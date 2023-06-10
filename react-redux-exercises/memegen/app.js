const memeStore = Redux.createStore(memeReducer);

const memeDump = document.querySelector('#memes');

const imageSrcInput = document.querySelector('#image-src');
const topTextInput = document.querySelector('#top-text');
const bottomTextInput = document.querySelector('#bottom-text');

function clearForm() {
    imageSrcInput.value = '';
    topTextInput.value = '';
    bottomTextInput.value = '';
}

function divFactory(text) {
    const newDiv = document.createElement('div');
    newDiv.classList.add('meme-text');
    newDiv.innerText = text;
    return newDiv;
}

function deleteMeme(event) {
    const memeId = event.target.parentElement.dataset.id;
    memeStore.dispatch({ type: 'REMOVE', payload: memeId });
}

function renderMeme(topText, bottomText, imgSrc, id) {
    const newMeme = document.createElement('div');
    newMeme.classList.add('meme');
    newMeme.dataset.id = id;

    const topTextDiv = divFactory(topText);
    topTextDiv.classList.add('top-text');

    const bottomTextDiv = divFactory(bottomText);
    bottomTextDiv.classList.add('bottom-text');

    const image = document.createElement('img');
    image.src = imgSrc;

    const removeButton = document.createElement('button');
    removeButton.innerText = 'Delete Me';
    removeButton.addEventListener('click', deleteMeme);

    newMeme.appendChild(topTextDiv);
    newMeme.appendChild(image);
    newMeme.appendChild(bottomTextDiv);
    newMeme.appendChild(removeButton);
    memeDump.appendChild(newMeme);
}

document.querySelector('#src-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const newMeme = {
        topText: topTextInput.value,
        bottomText: bottomTextInput.value,
        imgSrc: imageSrcInput.value,
        id: crypto.randomUUID(), // needs localhost or HTTPS but works for now
    }
    renderMeme(newMeme.topText, newMeme.bottomText, newMeme.imgSrc, newMeme.id);
    memeStore.dispatch({ type: "ADD", payload: newMeme });

    clearForm();
});

function renderMemes() {
    memeDump.innerHTML = "";

    const memes = memeStore.getState().memes;
    memes.forEach(meme => {
        renderMeme(meme.topText, meme.bottomText, meme.imgSrc, meme.id);
    });
}

memeStore.subscribe(renderMemes);