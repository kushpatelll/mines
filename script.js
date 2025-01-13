document.getElementById('startBtn').addEventListener('click', startGame);

let gridSize = 5;
let grid = document.getElementById('grid');
let multiplierElem = document.getElementById('multiplier');
let currentBetElem = document.getElementById('currentBet');
let resultElem = document.getElementById('result');
let numMines, betAmount, multiplier = 1, gameActive = true;
let minePositions = [];

function startGame() {
    numMines = parseInt(document.getElementById('mines').value);
    betAmount = parseInt(document.getElementById('bet').value);
    multiplier = 1 + (numMines * 0.1);
    multiplierElem.textContent = `${multiplier.toFixed(1)}x`;
    currentBetElem.textContent = betAmount;

    // Reset game state
    gameActive = true;
    resultElem.textContent = '';
    minePositions = [];
    grid.innerHTML = '';

    // Generate mine positions
    while (minePositions.length < numMines) {
        let randPos = Math.floor(Math.random() * (gridSize * gridSize));
        if (!minePositions.includes(randPos)) {
            minePositions.push(randPos);
        }
    }

    // Create the grid
    for (let i = 0; i < gridSize * gridSize; i++) {
        let cell = document.createElement('div');
        cell.classList.add('hidden');
        cell.setAttribute('data-id', i);
        cell.addEventListener('click', cellClickHandler);
        grid.appendChild(cell);
    }
}

function cellClickHandler(event) {
    if (!gameActive) return;

    const cell = event.target;
    const cellId = parseInt(cell.getAttribute('data-id'));

    // Check if clicked on a mine
    if (minePositions.includes(cellId)) {
        cell.classList.add('bomb');
        resultElem.textContent = `Game Over! You hit a bomb. You lost your bet of ${betAmount}.`;
        gameActive = false;
    } else {
        cell.classList.add('diamond');
        let remainingCells = document.querySelectorAll('.grid div.hidden');
        if (remainingCells.length === numMines) {
            resultElem.textContent = `You won! Your payout is ${betAmount * multiplier} units.`;
            gameActive = false;
        }
    }
}
