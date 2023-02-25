const express = require("express");
const router = new express.Router();

const Item = require('./item');
const ExpressError = require('./expressError');


/** GET /items get list of items */
router.get("/", function(req, res, next) {
    return res.json(Item.all());
});


/** POST /items: create item */
router.post("/", function(req, res, next) {
    try {
        const {name, price} = req.body;
        if (name == null) {
            throw new ExpressError(`name is required`, 400);
        }
        if (price == null) {
            throw new ExpressError(`price is required`, 400);
        }

        const added = new Item(name, price);

        return res.status(201).json({added});
    } catch (err) {
        next(err);
    }
});


/** GET /items/:name get item's name and price */
router.get("/:name", function(req, res, next) {
    try {
        return res.json(Item.find(req.params.name));
    } catch (err) {
        next(err);
    }
});


/** PATCH /items/:name modify a single item's name and/or price */
router.patch("/:name", function(req, res, next) {
    try {
        return res.json(Item.update(req.params.name, req.body));
    } catch (err) {
        next(err);
    }
});


/** DELETE /items/:name delete item, return status */
router.delete("/:name", function(req, res, next) {
    try {
        return res.json(Item.delete(req.params.name));
    } catch (err) {
        next(err);
    }
});


module.exports = router;
