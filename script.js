const gameBoard = document.getElementById("game-board");
const moveDisplay = document.getElementById("move-count");
const timeDisplay = document.getElementById("timer");

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let moves = 0;
let timerInterval = null;
let timeStarted = false;
let seconds = 0;

async function initGame() {
  moves = 0;
  seconds = 0;
  timeStarted = false;
  moveDisplay.textContent = moves;
  timeDisplay.textContent = "00:00";
  clearInterval(timerInterval);
  gameBoard.innerHTML = "";

  try {
    // Week 2: Fetch cards from the Backend API
    const response = await fetch("http://localhost:3000/api/cards");
    const icons = await response.json();

    // Create pairs and shuffle
    const deck = [...icons, ...icons];
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
      
      const img = document.createElement("img");
      img.src = `assets/${item}`;
      img.alt = item;
      back.appendChild(img);

      inner.appendChild(front);
      inner.appendChild(back);
      card.appendChild(inner);

      card.addEventListener("click", flipCard);
      gameBoard.appendChild(card);
    });
  } catch (error) {
    console.error("Failed to fetch cards:", error);
    gameBoard.innerHTML =
      "<p style='color:red'>Error loading game data. Is the server running?</p>";
  }
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
  const isMatch = firstCard.dataset.value === secondCard.dataset.value;

  isMatch ? disableCards() : unflipCards();
}

function disableCards() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);

  lockBoard = true;
  setTimeout(() => {
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");
    resetBoard();
    checkAllMatched();
  }, 1000);
}

function checkAllMatched() {
  const remaining = document.querySelectorAll(".card:not(.matched)");

  if (remaining.length === 0) {
    clearInterval(timerInterval);
    setTimeout(() => {
      alert(`You won! Moves: ${moves}, Time: ${timeDisplay.textContent}`);
    }, 500);
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
