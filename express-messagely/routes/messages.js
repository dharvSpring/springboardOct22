const Message = require('../models/message');
const {ensureLoggedIn, ensureCorrectUser} = require('../middleware/auth');

const express = require('express');
const ExpressError = require('../expressError');
const router = new express.Router();

/** GET /:id - get detail of message.
 *
 * => {message: {id,
 *               body,
 *               sent_at,
 *               read_at,
 *               from_user: {username, first_name, last_name, phone},
 *               to_user: {username, first_name, last_name, phone}}
 *
 * Make sure that the currently-logged-in users is either the to or from user.
 *
 **/
router.get('/:id', ensureLoggedIn, async (req, res, next) => {
    try {
        const message = await Message.get(req.params.id);
        const username = req.user.username;
        if (message.to_user.username !== username && message.from_user.username !== username) {
            throw new ExpressError('Access Denied!', 401);
        }

        return res.json({message});
    } catch (err) {
        next(err);
    }
})

/** POST / - post message.
 *
 * {to_username, body} =>
 *   {message: {id, from_username, to_username, body, sent_at}}
 *
 **/
router.post('/', ensureLoggedIn, async (req, res, next) => {
    try {
        const from_username = req.user.username;
        const {to_username, body} = req.body;
        const message = await Message.create({from_username, to_username, body});

        return res.json({message});
    } catch (err) {
        next(err);
    }
})


/** POST/:id/read - mark message as read:
 *
 *  => {message: {id, read_at}}
 *
 * Make sure that the only the intended recipient can mark as read.
 *
 **/
router.post('/:id/read', ensureLoggedIn, async (req, res, next) => {
    try {
        const {id, to_user} = await Message.get(req.params.id);
        const username = req.user.username;
        if (to_user.username !== username) {
            throw new ExpressError('Access Denied!', 401);
        }
        const message = await Message.markRead(id);

        return res.json({message});
    } catch (err) {
        next(err);
    }
})


module.exports = router;