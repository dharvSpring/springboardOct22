const items = require('./fakeDb');
const ExpressError = require('./expressError');

class Item {
    constructor(name, price) {
        this.name = name;
        this.price = price;

        // store to 'database'
        items.push(this);
    }

    // equals(other) {
    //     return this.name == other.name
    //             && this.price == other.price;
    // }

    static all() {
        return items;
    }

    static _findIdx(name) {
        const idx = items.findIndex(i => i.name === name);
        if (idx === -1) {
            throw new ExpressError(`item '${name}' not found`, 404);
        }
        return idx;
    }

    static find(name) {
        return items[Item._findIdx(name)];
    }

    static update(name, newValues) {
        const updateMe = items[Item._findIdx(name)];

        updateMe.name = newValues.name ? newValues.name : updateMe.name;
        updateMe.price = newValues.price ? newValues.price : updateMe.price;

        return updateMe;
    }

    static delete(name) {
        const idx = Item._findIdx(name);
        items.splice(idx, 1);
        return { message: "Deleted" };
    }

}

module.exports = Item;
