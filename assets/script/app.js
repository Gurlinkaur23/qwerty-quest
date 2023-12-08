'use strict';

// Imports
import { onEvent, select } from './utils.js';
import Score from './Score.js';

// Selections
const btnStart = select('.start');
const btnRestart = select('.restart');
const seconds = select('.seconds');
const wordDiv = select('.word-div');
const word = select('.word');
const hits = select('.hits');
const userWord = select('.user-word');
const modal = select('.modal');
const overlay = select('.overlay');
const btnCloseModal = select('.close-modal');
const scoreBoardDiv = select('.score-board-div');

/* - - - - - - Main code - - - - - - - */

const wordsArr = [
  'dinosaur',
  'love',
  'pineapple',
  'calendar',
  'robot',
  'building',
  'population',
  'weather',
  'bottle',
  'history',
  'dream',
  'character',
  'money',
  'absolute',
  'discipline',
  'machine',
  'accurate',
  'connection',
  'rainbow',
  'bicycle',
  'eclipse',
  'calculator',
  'trouble',
  'watermelon',
  'developer',
  'philosophy',
  'database',
  'periodic',
  'capitalism',
  'abominable',
  'component',
  'future',
  'pasta',
  'microwave',
  'jungle',
  'wallet',
  'canada',
  'coffee',
  'beauty',
  'agency',
  'chocolate',
  'eleven',
  'technology',
  'promise',
  'alphabet',
  'knowledge',
  'magician',
  'professor',
  'triangle',
  'earthquake',
  'baseball',
  'beyond',
  'evolution',
  'banana',
  'perfume',
  'computer',
  'management',
  'discovery',
  'ambition',
  'music',
  'eagle',
  'crown',
  'chess',
  'laptop',
  'bedroom',
  'delivery',
  'enemy',
  'button',
  'superman',
  'library',
  'unboxing',
  'bookstore',
  'language',
  'homework',
  'fantastic',
  'economy',
  'interview',
  'awesome',
  'challenge',
  'science',
  'mystery',
  'famous',
  'league',
  'memory',
  'leather',
  'planet',
  'software',
  'update',
  'yellow',
  'keyboard',
  'window',
  'beans',
  'truck',
  'sheep',
  'band',
  'level',
  'hope',
  'download',
  'blue',
  'actor',
  'desk',
  'watch',
  'giraffe',
  'brazil',
  'mask',
  'audio',
  'school',
  'detective',
  'hero',
  'progress',
  'winter',
  'passion',
  'rebel',
  'amber',
  'jacket',
  'article',
  'paradox',
  'social',
  'resort',
  'escape',
];

let numCorrectWords = 0;

let initialSeconds = 20;
let secondsInterval = '';

let currentWord = '';
let enteredWordsArr = [];

let scoresArr = loadScores();
let isGameActive = false;

// Display the words from the wordsArr
function displayRandomWord() {
  const remainingWords = wordsArr.filter(
    word => !enteredWordsArr.includes(word)
  );

  if (remainingWords.length === 0) {
    enteredWordsArr = [];
    endGame();
  }

  const randomIndex = Math.floor(Math.random() * remainingWords.length);
  const randomWord = remainingWords[randomIndex];

  enteredWordsArr.push(randomWord);

  if (isGameActive) {
    word.innerText = randomWord;
  }
  return randomWord;
}

// Matching the user word with the current word
function matchWords() {
  let input = userWord.value.trim();
  currentWord = word.innerText;

  if (input === currentWord) {
    numCorrectWords++;
    hits.innerText = `Hits: ${numCorrectWords}`;
    currentWord = displayRandomWord();
    userWord.value = '';
  }
}

// Play the audio
const playSound = new Audio('./assets/audio/bg-music.mp3');
playSound.type = 'audio/mp3';

// Toggle the buttons
function toggleBtn() {
  btnStart.classList.toggle('hidden');
  btnRestart.classList.toggle('hidden');
}

// Start the game
function startGame() {
  isGameActive = true;
  seconds.innerText = 20;
  secondsInterval = setInterval(secondsLeft, 1000);
  displayRandomWord();
  userWord.focus();
  userWord.disabled = false;

  setTimeout(() => {
    userWord.focus();
  }, 100);

  playSound.play();
  resetGame();
  toggleBtn();
}

// Restart the game
function restartGame() {
  isGameActive = true;
  clearInterval(secondsInterval);
  playSound.currentTime = 0;
  seconds.innerText = 20;
  startGame();
  toggleBtn();
}

// End the game
function endGame() {
  isGameActive = false;
  playSound.pause();
  // To reset the playback from the beginning
  playSound.currentTime = 0;
  toggleBtn();
  word.textContent = '';
  userWord.value = '';
  userWord.disabled = true;

  createScoreObject();
  displayScoreBoard();

  resetGame();
}

// Reset the game
function resetGame() {
  hits.innerText = 'Hits: 0';
  userWord.value = '';
  numCorrectWords = 0;
  initialSeconds = 20;
}

// Function to create a score object
function createScoreObject() {
  const gameDate = getDate();
  const gameHits = numCorrectWords;
  const gamePercentage = calcPercentage();

  const gameScoreObject = {
    date: gameDate,
    hits: gameHits,
    percentage: gamePercentage,
  };

  scoresArr.push(gameScoreObject);
  updateScoreObject();
}

function updateScoreObject() {
  // Sort the array based on highest hits
  scoresArr.sort((a, b) => {
    if (b.hits === a.hits) return new Date(b.date) - new Date(a.date);

    return b.hits - a.hits;
  });
  // Splice the array for top 9 hits
  scoresArr.splice(9);

  saveScores();
}

// Function to display the score board
function displayScoreBoard() {
  scoresArr = loadScores();
  scoreBoardDiv.innerHTML = '';
  createScoreBoard(scoresArr);
  openModal();
}

function createScoreBoard(array) {
  if (array.length > 0) {
    array.forEach((obj, index) => {
      const scoreInfoDiv = document.createElement('div');
      scoreInfoDiv.classList.add('score-info');

      const indexInfo = document.createElement('p');
      const hitsInfo = document.createElement('p');
      const dateInfo = document.createElement('p');

      indexInfo.innerText = `#${index + 1}`;
      hitsInfo.innerText = `${obj.hits.toString().padStart(2, '0')} hits`;
      dateInfo.innerText = obj.date;

      scoreInfoDiv.appendChild(indexInfo);
      scoreInfoDiv.appendChild(hitsInfo);
      scoreInfoDiv.appendChild(dateInfo);

      scoreBoardDiv.appendChild(scoreInfoDiv);
    });
  }
}

function saveScores() {
  localStorage.setItem('scores-info', JSON.stringify(scoresArr));
}

function loadScores() {
  const storedScores = localStorage.getItem('scores-info');
  return JSON.parse(storedScores) || [];
}

// Function to create date
function getDate() {
  const date = new Date();
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  return date.toLocaleTimeString('en-US', options);
}

// Function to calculate percentage
function calcPercentage() {
  let percentage = Math.round((numCorrectWords / wordsArr.length) * 100);
  return percentage;
}

// Modal functions
function openModal() {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
}

function closeModal() {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
  userWord.value = '';
}

/* - - - - - - Set the timer - - - - - - - */
function secondsLeft() {
  let secondsString = initialSeconds.toString().padStart(2, '0');
  seconds.innerText = `${secondsString}`;
  initialSeconds--;

  // Stop the timer when it reaches 0
  if (initialSeconds < 0) {
    stopInterval();
  }
}

function stopInterval() {
  clearInterval(secondsInterval);
  endGame();
}

/* - - - - - - Events - - - - - - - */
onEvent('click', btnStart, () => {
  startGame();
});

onEvent('click', btnRestart, () => {
  restartGame();
});

onEvent('input', userWord, () => {
  matchWords();
});

onEvent('click', btnCloseModal, () => {
  closeModal();
});

onEvent('click', overlay, () => {
  closeModal();
});