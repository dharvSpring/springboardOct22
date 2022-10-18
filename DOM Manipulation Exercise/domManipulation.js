// 1  Select the section with an id of container without using querySelector.
const containerSection = document.getElementById('container');

// 2  Select the section with an id of container using querySelector.
const containerSectionQS = document.querySelector('#container');

// 3  Select all of the list items with a class of “second”.
const secondList = document.querySelectorAll('.second');

// 4  Select a list item with a class of third, but only the list item inside of the ol tag.
const olThird = document.querySelector('ol > .third');

// 5  Give the section with an id of container the text “Hello!”.
// commented out so I can keep working on this same file
// containerSection.innerText = "Hello!";

// 6  Add the class main to the div with a class of footer.
document.querySelector('.footer').classList.add('main');

// 7  Remove the class main on the div with a class of footer.
document.querySelector('.footer').classList.remove('main');

// 8  Create a new li element.
const listItem = document.createElement('li');

// 9  Give the li the text “four”.
listItem.innerText = "four";

// 10 Append the li to the ul element.
document.querySelector('ul').append(listItem);

// 11 Loop over all of the list inside the ol tag and give them a background color of “green”.
const items = document.querySelectorAll('ol > li');
for (let item of items) {
    item.style.backgroundColor = "green";
}

// 12 Remove the div with a class of footer
document.querySelector('.footer').remove();