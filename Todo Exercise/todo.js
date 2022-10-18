const listDataKey = "listData";
const finishedStyle = 'finished';
const todoName = document.querySelector('#name');
const todoAdd = document.querySelector('#add');
const todoList = document.querySelector('#todo-list');

// item: {name, done, id}
let listData;

function addItemToModel(name, done, id) {
    listData.push({name, done, id});
    localStorage.setItem(listDataKey, JSON.stringify(listData));
}

function addItem(newName, done, id, updateModel) {
    if (newName.length > 0) {
        // <li><span>Sample Text</span> <button>X</button></li>
        const newSpan = document.createElement('span');
        newSpan.innerText = `${newName} `;
        newSpan.classList.toggle(finishedStyle, done);
        
        const newButton = document.createElement('button');
        newButton.innerText = 'X';

        const newItem = document.createElement('li');
        newItem.append(newSpan);
        newItem.append(newButton);
        newItem.dataset.name = newName;
        newItem.dataset.done = done;
        newItem.dataset.id = id;

        if (updateModel) {
            addItemToModel(newName, done, id);
        }

        todoList.append(newItem);
    }
}

function removeItem(listItem) {
    const itemId = listItem.dataset.id;
    for (let i = 0; i < listData.length; i++) {
        if (listData[i].id == itemId) {
            listData.splice(i, 1);
            break;
        }
    }
    localStorage.setItem(listDataKey, JSON.stringify(listData));
    listItem.remove();
}

function toggleFinished(spanItem) {
    const done = spanItem.classList.toggle(finishedStyle);
    const listItem = spanItem.parentElement;
    const itemId = listItem.dataset.id;

    listItem.dataset.done = done;
    for (let current of listData) {
        if (current.id == itemId) {
            current.done = done;
            break;
        }
    }
    localStorage.setItem(listDataKey, JSON.stringify(listData));
}

//
// Load from the model
//
listData = JSON.parse(localStorage.getItem(listDataKey));
if (listData) {
    console.log(listData);
    for (let row of listData) {
        addItem(row.name, row.done, row.id, false);
    }
} else {
    listData = [];
}

//
// Event Listenters
//

// Using Data.now() for ids isn't ideal but it's good enough for this simple app
document.querySelector('form').addEventListener('submit', function(event) {
    event.preventDefault();
    addItem(todoName.value, false, Date.now(), true);
    todoName.value = '';
});

todoAdd.addEventListener('click', function(event) {
    addItem(todoName.value, false, Date.now(), true);
    todoName.value = '';
});

todoList.addEventListener('click', function(event) {
    if (event.target.tagName === "SPAN") {
        toggleFinished(event.target);
    } else if (event.target.tagName === "BUTTON") {
        removeItem(event.target.parentElement);
    }
});

