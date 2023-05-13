/**
 * Returns a randomly selected item from array of items
 */
function choice(items) {
    const randIdx = Math.floor(Math.random() * items.length);
    return items[randIdx];
}

/**
 * Removes the first matching item from items, if item exists, and returns it.
 * 
 * Otherwise returns undefined.
 */
function remove(items, item) {
    console.log(items)
    for (let i = 0; i < items.length; i++) {
        if (items[i] === item) {
            return [...items.slice(0, i), ...items.slice(i+1)];
        }
    }
}

export {choice, remove};