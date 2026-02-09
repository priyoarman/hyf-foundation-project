
if (typeof document === "undefined") {
  throw new Error("This script must be run in a browser, not with Node.js");
}

const gameBoard = document.getElementById("game-board");
const moveDisplay = document.getElementById("move-count");
const timeDisplay = document.getElementById("timer");

let cards = [];
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let moves = 0;
let timerInterval = null;
let timeStarted = false;
let seconds = 0;


let items = [];

async function fetchCards() {
  try {
    const response = await fetch("/api/cards");
    if (!response.ok) throw new Error("Failed to fetch cards");
    const data = await response.json();
    // Assuming each card has a 'value' property (adjust if needed)
    items = data.map(card => card.value);
  } catch (err) {
    console.error("Error fetching cards:", err);
    // Fallback to default items if API fails
    items = ["🚀", "🌟", "🎸", "🍕", "🐱", "🌵", "💎", "🍦"];
  }
}

async function initGame() {
  moves = 0;
  seconds = 0;
  timeStarted = false;
  moveDisplay.textContent = moves;
  timeDisplay.textContent = "00:00";
  clearInterval(timerInterval);
  gameBoard.innerHTML = "";

  await fetchCards();
  const deck = [...items, ...items];
  deck.sort(() => 0.5 - Math.random());

  deck.forEach((item) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.value = item;

    const inner = document.createElement("div");
    inner.classList.add("card-inner");

    const front = document.createElement("div");
    front.classList.add("card-front");

    const back = document.createElement("div");
    back.classList.add("card-back");
    back.innerText = item;

    inner.appendChild(front);
    inner.appendChild(back);
    card.appendChild(inner);

    card.addEventListener("click", flipCard);

    gameBoard.appendChild(card);
  });
}

function startTimer() {
  timeStarted = true;
  timerInterval = setInterval(() => {
    seconds++;
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    timeDisplay.textContent = `${mins}:${secs}`;
  }, 1000);
}

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  if (!timeStarted) startTimer();

  this.classList.add("flipped");

  if (!hasFlippedCard) {
    hasFlippedCard = true;
    firstCard = this;
    return;
  }

  secondCard = this;
  incrementMoves();
  checkForMatch();
}

function incrementMoves() {
  moves++;
  moveDisplay.textContent = moves;
}

function checkForMatch() {
  let isMatch = firstCard.dataset.value === secondCard.dataset.value;

  isMatch ? disableCards() : unflipCards();
}

function disableCards() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);
  resetBoard();
  checkAllMatched();
}

function checkAllMatched() {
  const remaining = gameBoard.querySelectorAll('.card:not(.flipped)');
  if (remaining.length === 0) {
    clearInterval(timerInterval);
    timerInterval = null;
    timeStarted = false;

    if (gameBoard.animate) {
      gameBoard.animate(
        [
          { transform: 'scale(1)' },
          { transform: 'scale(1.05)' },
          { transform: 'scale(1)' }
        ],
        { duration: 600, iterations: 3 }
      );
    } else {
      gameBoard.classList.add('all-matched');
    }
  }
}

function unflipCards() {
  lockBoard = true;

  setTimeout(() => {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
    resetBoard();
  }, 1000);
}

function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];

}

function restartGame() {
  initGame();
}

initGame();
