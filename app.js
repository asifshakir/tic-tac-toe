// ui objects
const msgObj = document.getElementById("message");
const boardObj = document.getElementById("board");
const scoresObj = document.getElementById("scores");

// Constants
const CROSS = '×';
const ZERO = '○';
const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// State Fields
//localStorage.clear();
const gameWinners = JSON.parse(localStorage.getItem('winners')) ?? [];
let cells = JSON.parse(localStorage.getItem('cells')) ?? new Array(9).fill(null);
let currentPlayer = localStorage.getItem('currentPlayer') ?? CROSS;
let isDrawn = false;
let winner = null;

function checkWinner(firstLoad) {
    // check if the game is a draw
    isDrawn = !cells.some(x => x === null);
    if ( !isDrawn ) {
        // check for winner
        const hasWinner = lines.some(x => 
                                cells[x[0]] && 
                                cells[x[0]] === cells[x[1]] && 
                                cells[x[0]] === cells[x[2]])
        if ( hasWinner ) {
            winner = currentPlayer;
            if (!firstLoad) { 
                gameWinners.push(winner)
                localStorage.setItem('winners', JSON.stringify(gameWinners))
            }
            drawScores()
        } else {
            if (!firstLoad) { 
                // switch player
                currentPlayer = currentPlayer == CROSS ? ZERO : CROSS;
                localStorage.setItem('currentPlayer', currentPlayer)
            }
        }
    } else {
        if (!firstLoad) { 
            gameWinners.push(null)
            localStorage.setItem('winners', JSON.stringify(gameWinners))
        }
        drawScores()
    }    
}

function playerMove(obj, x) {
    if(!winner && !cells[x]) {
        cells[x] = currentPlayer;
        localStorage.setItem('cells', JSON.stringify(cells))
        obj.innerHTML = currentPlayer;
        checkWinner();
        drawMessage()
    }
}

function clearScores() {
    localStorage.clear();
    newGame(false);
}

function drawScores() {
    let html = '<table><tr><th>'+CROSS+'</th><th>'+ZERO+'</th></tr>';
    html += gameWinners.reduce((p, x) => {
        return p + `<tr><td>${x === CROSS ? 1 : 0}</td><td>${x === ZERO ? 1 : 0}</td></tr>`;
    }, '')
    html += "</table><button onclick='clearScores()'>Clear all scores</button>";
    scoresObj.innerHTML = html;
}

function newGame(firstLoad) {
    if (!firstLoad) {
        cells = new Array(9).fill(null);
        currentPlayer = CROSS;
        isDrawn = false;
        winner = null;    
    }
    drawBoard();
    drawScores();
    checkWinner(true);
    drawMessage()
}

function drawMessage() {
    let message = null;
    if(winner) {
        message = "Winner: " + winner + "<button onclick='newGame(false)'>New Game</button>";
    } else if(isDrawn) {
        message = "DRAW!" + "<button onclick='newGame()'>New Game</button>";
    } else {
        message = "Current Player: " + currentPlayer;
    }
    msgObj.innerHTML = message;
}

function drawBoard() {
    drawMessage();
    let html = "<table>";
    for(let x = 0, ctr = 0; x < 3; x++) {
        html += "<tr>";
        for(let y = 0; y < 3; y++, ctr++) {
            html += "<td><button onclick='playerMove(this, "+ctr+")'>"+(cells[ctr] ?? "")+"</button></td>";
        }
        html += "</tr>";
    }
    html += "</table>"
    boardObj.innerHTML = html;
}

newGame(true);