// Game Setup
window.onload = function () {
	log("4mok Start")
	createBoard()
};

const BOARD_WIDTH = 7
const BOARD_HEIGHT = 6

// Game State
let player = {
	number: 0,
	piece: 0,
	colour: 0,
	address: "",
	ready: false
}

let game = {
	player1: null,
	player2: null,
	board: [],
	turn: 0,
	heightState: []
}
let boardGrid = []

let player1Piece = "https://assets.codepen.io/2417226/0.png"
let player2Piece = "https://assets.codepen.io/2417226/0_1.png"


const info = []
let map = new Array(6)
for (let i = 0; i < 7; i++) {
	map[i] = new Array(7)
	game.heightState.push(BOARD_HEIGHT - 1)
}
// Functions to manage game
const createBoard = () => {
	let board = document.querySelector('#game-board')

	// Create board
	for (let i = 0; i < BOARD_HEIGHT; i++) {
		boardGrid.push([])
		let row = document.createElement('div')
		row.className = 'row'

		for (let j = 0; j < BOARD_WIDTH; j++) {
			let square = document.createElement('div')
			square.className = 'square'
			row.appendChild(square)
			boardGrid[i].push(square)
		}
		board.appendChild(row)
	}
	// Set event handlers
	boardGrid.forEach((row, rowNum) => {
		row.forEach((square, colNum) => {
			square.addEventListener('click', () => {
				console.log('click', rowNum, colNum)
				if (square.firstChild) return
				let piece = document.createElement('img');
				if (game.turn % 2 === 0) {
					piece.src = player1Piece
				} else {
					piece.src = player2Piece
				}
				if (rowNum == 5) {
					square.appendChild(piece)
					info.push({
						user: game.turn % 2,
						y: rowNum,
						x: colNum
					})
					map[rowNum][colNum] = game.turn % 2
					if (checkGame(rowNum, colNum, game.turn % 2) === true) {
						alert(`user : ${game.turn % 2} victory`)
						return
					}
					game.turn++
					game.heightState[colNum]--
				}
				else {
					let flag = false
					for (const item of info) {
						if (item.y - 1 === rowNum && item.x === colNum) {
							flag = true
							break
						}
					}
					if (flag === true) {
						square.appendChild(piece)
						info.push({
							user: game.turn % 2,
							y: rowNum,
							x: colNum
						})
						map[rowNum][colNum] = game.turn % 2
						if (checkGame(rowNum, colNum, game.turn % 2) === true) {
							alert(`user : ${game.turn % 2} victory`)
							return
						}
						game.turn++
						game.heightState[colNum]--
					}
					else{
						return
					}
				}

				// bot's turn
				let nowx = 3, nowy;
				// do{
				// 	nowx = Math.floor(Math.random() * BOARD_WIDTH)
				// }while (game.heightState[nowx] === -1)
				// x좌표 정하기
				nowx = choose(1, MAX_DEFTH, Infinity).x
				// console.log(evaluate());
				let ai_piece = document.createElement('img');
				if (game.turn % 2 === 0) {
					ai_piece.src = player1Piece
				} else {
					ai_piece.src = player2Piece
				}
				nowy = game.heightState[nowx]
				boardGrid[nowy][nowx].appendChild(ai_piece);
				info.push({
					user: game.turn % 2,
					y: nowy,
					x: nowx
				})
				map[nowy][nowx] = game.turn % 2
				if (checkGame(nowy, nowx, game.turn % 2) === true) {
					alert(`user : ${game.turn % 2} victory`)
				}
				game.turn++
				game.heightState[nowx]--
			})
		})
	})
}

const can = (y, x, user) => 0 <= y && y <= 5 && 0 <= x && x <= 6 && map[y][x] !== undefined && map[y][x] === user



const l = (y, x, user) => can(y, x, user) === false ? 0 : l(y, x - 1, user) + 1
const r = (y, x, user) => can(y, x, user) === false ? 0 : r(y, x + 1, user) + 1
const u = (y, x, user) => can(y, x, user) === false ? 0 : u(y - 1, x, user) + 1
const d = (y, x, user) => can(y, x, user) === false ? 0 : d(y + 1, x, user) + 1

const ld = (y, x, user) => can(y, x, user) === false ? 0 : ld(y + 1, x - 1, user) + 1
const ru = (y, x, user) => can(y, x, user) === false ? 0 : ru(y - 1, x + 1, user) + 1
const lu = (y, x, user) => can(y, x, user) === false ? 0 : lu(y - 1, x + 1, user) + 1
const rd = (y, x, user) => can(y, x, user) === false ? 0 : rd(y + 1, x + 1, user) + 1

const checkGame = (y, x, user) => {
	if (l(y, x, user) + r(y, x, user) - 1 >= 4 || u(y, x, user) + d(y, x, user) - 1 >= 4) return true
	if (ld(y, x, user) + ru(y, x, user) - 1 >= 4 || lu(y, x, user) + rd(y, x, user) - 1 >= 4) return true
	return false
}

const startGame = () => {

}

const newGame = () => {

}

const endGame = () => {

}

const placePiece = () => {

}

const displayResult = () => {

}

const log = (message) => {
	document.getElementById("log").textContent += message + "\n";
};



let EventNames = [
	'newGame',
	'joinGame',
	'moveData',
]


const MAX_DEFTH = 8;

var i;
const evaluate = () => { // 받은 판의 점수 계산
	let ans = [0, 0];
	for (let i = 0; i < BOARD_WIDTH; i++){
		for (let j = 0; j < BOARD_HEIGHT; j++){
			if (map[i][j] === undefined)
				continue;
			let got;
			if (!can(i - 1, j - 1, map[i][j])){
				got = rd(i, j, map[i][j])
				if (i > 0 && j > 0 && map[i - 1][j - 1] === undefined)
					ans[map[i][j]]++
				if (i + got + 1 < BOARD_HEIGHT && j + got + 1 < BOARD_WIDTH && map[i + got + 1][j + got + 1] === map[i][j])
					got += rd(i + got + 1, j + got + 1, map[i][j]);
				ans[map[i][j]] += (got - 1) * 3
			}
			if (!can(i - 1, j, map[i][j])){
				got = d(i, j, map[i][j])
				if (i > 0 && map[i - 1][j] === undefined)
					ans[map[i][j]]++
				if (i + got + 1 < BOARD_HEIGHT && map[i + got + 1][j] === map[i][j])
					got += d(i + got + 1, j, map[i][j]);
				ans[map[i][j]] += (got - 1) * 3
			}
			if (!can(i - 1, j + 1, map[i][j])){
				got = ld(i, j, map[i][j])
				if (i > 0 && j < BOARD_WIDTH - 1 && map[i - 1][j + 1] === undefined)
					ans[map[i][j]]++
				if (i + got + 1 < BOARD_HEIGHT && j - got - 1 < BOARD_WIDTH && map[i + got + 1][j - got - 1] === map[i][j])
					got += rd(i + got + 1, j - got - 1, map[i][j]);
				ans[map[i][j]] += (got - 1) * 3
			}
			if (!can(i, j - 1, map[i][j])){
				got = r(i, j, map[i][j])
				if (i > 0 && map[i][j] === undefined)
					ans[map[i][j]]++
				if (j + got + 1 < BOARD_WIDTH && map[i][j + got + 1] === map[i][j])
					got += r(i, j + got + 1, map[i][j]);
				ans[map[i][j]] += (got - 1) * 3
			}
		}
	}
	return ans[1] - ans[0];
}

const choose = (user, cnt, siblingWorst) => {
	// console.log('choose')
    if (cnt === 0){
		const ret = evaluate();
		// console.log(ret)
        return ret;
	}
	let ansState, ansX = 3;
	let childBest;
	if (user === 0)
		ansState = Infinity
	else
		ansState = -Infinity
	childBest = -ansState;
    for (let nowx = 0; nowx < BOARD_WIDTH; nowx++){
		if (game.heightState[nowx] !== -1){
			let nowy = game.heightState[nowx]--
			map[nowy][nowx] = user
			if (checkGame(nowy, nowx, user)) {
				map[nowy][nowx] = undefined
				game.heightState[nowx]++
				if (user === 0)
					return {state: -Infinity, x: nowx}
				else
					return {state: Infinity, x: nowx}
			}
			if (user === 0){
				const got = choose(1, cnt - 1, childBest).state
				if (got < ansState){
					ansState = got
					ansX = nowx
					childBest = got;
					if (ansState < siblingWorst) {
						map[nowy][nowx] = undefined
						game.heightState[nowx]++
						// console.log('alphabeta')
						return { state: ansState, x: nowx }
					}
				}
			}
			else{
				const got = choose(0, cnt - 1, childBest).state
				if (got > ansState){
					ansState = got
					ansX = nowx
					childBest = got;
					if (ansState < siblingWorst) {
						map[nowy][nowx] = undefined
						game.heightState[nowx]++
						// console.log('alphabeta')
						return { state: ansState, x: nowx }
					}
				}
			}
			map[nowy][nowx] = undefined
			game.heightState[nowx]++

		}
	}
	// console.log(ansState)
	return {state: ansState, x: ansX}
}