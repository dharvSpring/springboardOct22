const defaultState = { face: "┐(´д｀)┌" };

function moodReducer(state = defaultState, action) {
    switch (action.type) {
        case 'HAPPY':
            return { ...state, face: "UωU" };
        case 'SAD':
            return { ...state, face: "QQ" };
        case 'ANGRY':
            return { ...state, face: "ಠ╭╮ಠ" };
        case 'CONFUSED':
            return { ...state, face: "ↂ_ↂ" };
        default:
            return { ...state, face: defaultState.face };
    }
}

const moodStore = Redux.createStore(moodReducer);
const moodDiv = document.getElementById("mood");

document.querySelectorAll("button").forEach(button => (
    button.addEventListener("click", (evt) => {
        moodStore.dispatch({ type: evt.target.id.toUpperCase() });
    }))
);

function showMood() {
    moodDiv.innerText = moodStore.getState().face;
}
moodStore.subscribe(showMood);

showMood();