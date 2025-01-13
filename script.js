const boardSize = 5; // fixed board size (5x5)
let numMines = 5; // default number of mines
let board = document.getElementById('board');
let cells = [];
let gameOver = false;
let revealedCount = 0;

// Generate board with the chosen number of mines
function generateBoard() {
  // Clear the previous board
  board.innerHTML = '';
  cells = [];
  revealedCount = 0;

  // Get the number of mines from the user input
  numMines = parseInt(document.getElementById('mine-count').value);

  // Ensure number of mines is valid for the grid size
  if (numMines < 1 || numMines >= boardSize * boardSize) {
    alert('Invalid number of mines! Please select a number between 1 and ' + (boardSize * boardSize - 1));
    return;
  }

  const minePositions = generateMines();
  
  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.setAttribute('data-row', row);
      cell.setAttribute('data-col', col);
      
      // Add event listener
      cell.addEventListener('click', handleCellClick);
      cells.push(cell);
      board.appendChild(cell);
    }
  }

  // Place mines and calculate numbers
  cells.forEach(cell => {
    const row = cell.getAttribute('data-row');
    const col = cell.getAttribute('data-col');
    const mine = minePositions.some(m => m.row == row && m.col == col);
    
    if (mine) {
      cell.dataset.mine = true;
    } else {
      const surroundingMines = countAdjacentMines(row, col, minePositions);
      if (surroundingMines > 0) {
        cell.textContent = surroundingMines;
      }
    }
  });
}

// Generate random mine positions
function generateMines() {
  let positions = [];
  while (positions.length < numMines) {
    let randRow = Math.floor(Math.random() * boardSize);
    let randCol = Math.floor(Math.random() * boardSize);
    if (!positions.some(pos => pos.row === randRow && pos.col === randCol)) {
      positions.push({ row: randRow, col: randCol });
    }
  }
  return positions;
}

// Count adjacent mines
function countAdjacentMines(row, col, mines) {
  let mineCount = 0;
  const adjacentCells = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],         [0, 1],
    [1, -1], [1, 0], [1, 1]
  ];

  adjacentCells.forEach(([rOffset, cOffset]) => {
    const newRow = parseInt(row) + rOffset;
    const newCol = parseInt(col) + cOffset;
    if (newRow >= 0 && newRow < boardSize && newCol >= 0 && newCol < boardSize) {
      if (mines.some(m => m.row === newRow && m.col === newCol)) {
        mineCount++;
      }
    }
  });

  return mineCount;
}

// Handle cell click
function handleCellClick(e) {
  if (gameOver) return;
  
  const cell = e.target;
  const row = cell.getAttribute('data-row');
  const col = cell.getAttribute('data-col');
  
  if (cell.classList.contains('revealed')) return;

  // Reveal cell
  cell.classList.add('revealed');
  
  if (cell.dataset.mine) {
    cell.classList.add('mine');
    alert('Game Over! You hit a mine!');
    gameOver = true;
  } else {
    revealedCount++;
    if (revealedCount === (boardSize * boardSize - numMines)) {
      alert('Congratulations! You won!');
    }
  }
}

// Restart game
document.getElementById('restart').addEventListener('click', () => {
  gameOver = false;
  generateBoard();
});

// Start a new game with the selected number of mines
document.getElementById('start-game').addEventListener('click', () => {
  gameOver = false;
  generateBoard();
});

generateBoard(); // Initial game start
