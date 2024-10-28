// DOM Variables
var buttons = document.getElementsByClassName("btn");
var reset = document.getElementById("reset-btn");
var playerType = document.getElementById("player-type");
var notification = document.getElementById("notification");
var notificationMessage = document.getElementById("notification-message");
var closeNotification = document.getElementById("close-notification");

// Game Flow Variables
var playerNumber = 1; // Player 1 starts
var filledGrid = []; // Player board
var filledCells = 0;

// Initialize the grid
for (var i = 0; i < 6; i++) {
  var arr = [-1, -1, -1, -1, -1, -1, -1]; // Initialize with -1
  filledGrid.push(arr);
}

// Background Music
const bgm = new Audio("asset/bgm.mp3"); // Replace with your BGM path
bgm.loop = true;
bgm.volume = 0.05;
bgm.play(); // Autoplay background music

// Reset Button Event Listener
reset.addEventListener("click", function () {
  resetBoard();
});

// Close Notification Event Listener
closeNotification.addEventListener("click", function () {
  resetBoard(); // Restart the game
  hideNotification(); // Then hide the notification
});

// Button click events for each grid cell
for (let i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener("click", function () {
    var buttonNo = this.classList[1];
    makeMove(this, buttonNo.slice(4));
  });
}

// Make Move and disable button
function makeMove(button, buttonNo) {
  var row =
    buttonNo % 7 === 0
      ? Math.floor(buttonNo / 7) - 1
      : Math.floor(buttonNo / 7);
  var col = buttonNo % 7 === 0 ? 6 : (buttonNo % 7) - 1;

  // Set player icon as an image
  const playerIcon =
    playerNumber === 1
      ? "<img src='asset/pumpkin.png' alt='Pumpkin' class='player-icon'/>"
      : "<img src='asset/ghost.png' alt='Ghost' class='player-icon'/>";

  button.innerHTML = playerIcon; // Set player icon
  filledGrid[row][col] = playerNumber;
  filledCells++;

  if (playerWon(row, col, playerNumber)) {
    document.body.classList.add("win-animation"); // Add win animation
    setTimeout(function () {
      showNotification(
        `Game Over: ${playerNumber === 1 ? "Pumpkin" : "Ghost"} Wins!`
      );
    }, 500);
    return;
  }

  // Update player turn
  playerNumber = playerNumber === 1 ? 2 : 1;
  playerType.textContent = `Player - ${playerNumber}`;

  if (filledCells === 42) {
    setTimeout(function () {
      showNotification("Game Draw 🎃👻");
    }, 200);
  }

  // Disable button
  setTimeout(function () {
    button.disabled = true;
  }, 10);
}

// Check win conditions
function playerWon(row, col, player) {
  let count = 0;

  // Check columns
  for (let i = 0; i < 7; i++) {
    count = filledGrid[row][i] === player ? count + 1 : 0;
    if (count === 4) return true;
  }

  // Check rows
  count = 0;
  for (let i = 0; i < 6; i++) {
    count = filledGrid[i][col] === player ? count + 1 : 0;
    if (count === 4) return true;
  }

  // Check diagonals
  return checkDiagonals(row, col, player);
}

// Diagonal check helper function
function checkDiagonals(row, col, player) {
  let count = 0;

  // Primary diagonal
  let i = row - col;
  let j = 0;
  for (; i <= 5 && j <= 6; i++, j++) {
    count = filledGrid[i] && filledGrid[i][j] === player ? count + 1 : 0;
    if (count === 4) return true;
  }

  // Secondary diagonal
  i = row + col;
  j = 0;
  for (; i >= 0 && j <= 6; i--, j++) {
    count = filledGrid[i] && filledGrid[i][j] === player ? count + 1 : 0;
    if (count === 4) return true;
  }

  return false;
}

// Reset Board function
function resetBoard() {
  // Reset UI
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].disabled = false;
    buttons[i].innerHTML = ""; // Clear icons
  }

  // Reset variables
  playerNumber = 1;
  playerType.textContent = "Player - 1";
  filledCells = 0;
  document.body.classList.remove("win-animation"); // Remove animation

  // Reset grid
  for (let i = 0; i < 6; i++) {
    filledGrid[i].fill(-1);
  }

  // Restart background music
  bgm.currentTime = 0;
  bgm.play();
}

// Show Notification Function
function showNotification(message) {
  notificationMessage.textContent = message; // Set the message
  notification.classList.remove("hidden"); // Show the notification
  notification.classList.add("visible"); // Add visible class
}

// Hide Notification Function
function hideNotification() {
  notification.classList.remove("visible"); // Hide the notification
  notification.classList.add("hidden"); // Add hidden class
}
