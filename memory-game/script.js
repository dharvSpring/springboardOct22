const gameContainer = document.getElementById("game");
const startButton = document.querySelector('#start');
const restartButton = document.querySelector('#restart');
restartButton.disabled = true;

const currentScore = document.querySelector('#currentScore');
const bestScore = document.querySelector('#bestScore');
const storedBest = 'bestScore';
bestScore.innerText = localStorage.getItem(storedBest);


const clickedClass = 'clicked';
const matchedClass = 'matched';

let paused = false;
let score = 0;

const COLORS = [
  "red",
  "blue",
  "green",
  "orange",
  "purple",
  "red",
  "blue",
  "green",
  "orange",
  "purple"
];

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForColors(colorArray) {
  for (let color of colorArray) {
    // create a new div
    const newDiv = document.createElement("div");

    // give it a class attribute for the value we are looping over
    newDiv.classList.add(color);

    // call a function handleCardClick when a div is clicked on
    newDiv.addEventListener("click", handleCardClick);

    // append the div to the element with an id of game
    gameContainer.append(newDiv);
  }
}

function updateScore() {
  currentScore.innerText = score;
}

function updateBestScore() {
  const best = localStorage.getItem(storedBest);
  if (!best || best >= score) {
    localStorage.setItem(storedBest, score);
    bestScore.innerText = score;
  }
}

function clearClicked() {
  const clickedDivs = document.querySelectorAll(`.${clickedClass}`);
  for (let div of clickedDivs) {
    console.log(div.classList);
    div.style.backgroundColor = '';
    div.classList.remove(clickedClass);
  }
  paused = false;
}

function checkForWin() {
  const gameDivs = gameContainer.querySelectorAll('div');
  let winner = true;
  for (let d of gameDivs) {
    if (!d.classList.contains(matchedClass)) {
      console.log('not done yet!');
      winner = false;
      break;
    }
  }

  if (winner) {
    console.log(`Won the game in ${score} clicks!`);
    updateBestScore();
  }
}

function handleCardClick(event) {
  // you can use event.target to see which element was clicked
  // console.log("you just clicked", event.target);
  if (!paused) {
    const targetDiv = event.target;
    const targetColor = targetDiv.classList[0];
    if (targetDiv.classList.contains(matchedClass)) {
      console.log(`already matched ${targetColor}`);
    } else if (targetDiv.classList.contains(clickedClass)) {
      console.log(`already clicked ${targetColor}`);
    } else {
      score++;
      updateScore();
      
      targetDiv.style.backgroundColor = targetColor;
      const otherDiv = document.querySelector(`.${clickedClass}`);
      targetDiv.classList.add(clickedClass);

      if (otherDiv) {
        if (otherDiv.classList[0] == targetColor) {
          targetDiv.classList.remove(clickedClass);
          otherDiv.classList.remove(clickedClass);
          targetDiv.classList.add(matchedClass);
          otherDiv.classList.add(matchedClass);
          checkForWin();
        } else {
          paused = true;
          setTimeout(clearClicked, 1000);
        }
      }
    }
  }
}

function startGame() {
  score = 0;
  updateScore();
  // createDivsForColors(shuffle(COLORS));
  createDivsForColors(shuffle(createRandomColors(6)));
  restartButton.disabled = false;
}

function resetGame() {
  gameContainer.innerHTML = '';
  startGame();
}

startButton.addEventListener('click', function(event) {
  event.target.disabled = true;
  startGame();
});

restartButton.addEventListener('click', function(event) {
  event.target.disabled = true;
  resetGame();
});

// random colors
function createRandomColors(numColors) {
  const colors = [];
  while (numColors > 0) {
    const red = Math.floor(Math.random() * 256);
    const green = Math.floor(Math.random() * 256);
    const blue = Math.floor(Math.random() * 256);
    const color = `rgb(${red},${green},${blue})`;
    colors.push(color);
    colors.push(color);
    numColors--;
  }
  return colors;
}


// when the DOM loads
// createDivsForColors(shuffledColors);

/* */