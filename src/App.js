import React, { Component } from 'react';
import sudokus from './Sudokus'
import SudokuGenerator from './SudokuGenerator'
import Board from './Board'

class Game extends Component {
	componentDidMount() {
	this.setState({peep:false})
	}
	generate = (level) => {
		let puzzles
		switch (level) {
			case 'Easy':
				puzzles = sudokus.Easy
				break
			case 'Medium':
				puzzles = sudokus.Medium
				break
			case 'Hard':
				puzzles = sudokus.Hard
				break
			default:
				puzzles = sudokus.Easy
		}
		let grid = puzzles[Math.floor(Math.random() * puzzles.length)]
			, sudoku = new SudokuGenerator(grid).generate()
			, puzzle = sudoku[0]
		this.solution = sudoku[1]
		const origin = new Set()
		for (let i = 0; i < 9; i++) {
			for (let j = 0; j < 9; j++) {
				if (puzzle[i][j]) {
					origin.add(i + '' + j)
				}
			}
		}
		this.setState({
			values: puzzle,
			level: level,
			origin: origin,
			chosen: null,
			possible: null,
			filter: new Set(),
			highlight: new Set(),
			conflict: new Set(),
			peep: false,
		})
	}
	componentWillMount() {
		this.generate('easy')
	}
		
	checkPossible = (i, j) => {
		let values = this.state.values
		let allPossible = new Set([...'123456789'])
		for (let k = 0; k <= 8; k++) {
			if (k === j) { continue }
			if (allPossible.has(values[i][k])) {
				allPossible.delete(values[i][k])
			}
		}
		for (let k = 0; k <= 8; k++) {
			if (k === i) { continue }
			if (allPossible.has(values[k][j])) {
				allPossible.delete(values[k][j])
			}
		}
		let bi = Math.floor(i / 3) * 3,
			bj = Math.floor(j / 3) * 3
		for (let m = bi; m < bi + 3; m++) {
			for (let n = bj; n < bj + 3; n++) {
				if (m === i && n === j) {
					continue
				}
				if (allPossible.has(values[m][n])) {
					allPossible.delete(values[m][n])
				}
			}
		}
		return allPossible
	}
	filter = (value) => {
		let values = this.state.values
		let filter = new Set()
		for (let m = 0; m < 9; m++) {
			for (let n = 0; n < 9; n++) {
				if (values[m][n] === value) {
					filter.add(m + '' + n)
				}
			}
		}
		this.setState({
			filter: filter,
			highlight: new Set(),
			chosen: null
		})
	}
	highlight = (i, j) => {
		let values = this.state.values
		let highlight = new Set()
		for (let k = 0; k < 9; k++) {
			if (values[i][k]) {
				highlight.add(i + '' + k)
			}
		}
		for (let k = 0; k < 9; k++) {
			if (values[k][j]) {
				highlight.add(k + '' + j)
			}
		}
		let line = Math.floor(i / 3) * 3,
			row = Math.floor(j / 3) * 3
		for (let ln = line; ln < line + 3; ln++) {
			for (let r = row; r < row + 3; r++) {
				if (values[ln][r]) {
					highlight.add(ln + '' + r)
				}
			}
		}
		this.setState({
			highlight: highlight,
			filter: new Set()
		})
	}
	solve = () => {
		debugger
		if (this.state.peep) {
			return
		}
		// eslint-disable-next-line no-restricted-globals
		let r = confirm("Are you sure you want to check the answer ? ")
		if (!r) {
			return
		} else {
			this.setState({
				values: this.solution,
				peep: true,
				conflict: new Set(),
				highlight: new Set(),
				filter: new Set(),
			})
		}

	}
	handleClick = (i, j) => {
		let values = this.state.values.slice()
		let thisvalue = values[i].slice()
		if (this.state.origin.has(i + '' + j)) {
			this.filter(thisvalue[j])
			return
		} else {
			this.highlight(i, j)
			let chosen = i + '' + j
			let possible = Array.from(this.checkPossible(i, j)).toString()
			this.setState({
				chosen: chosen,
				possible: possible,
				filter: new Set(),
				check: false
			});
		}
	}
	handleNumsClick = (i) => {
		if (this.state.peep) { return }
		let chosen = this.state.chosen
		if (!chosen) {
			this.filter('' + i)
		} else {
			let values = this.state.values.slice()
			if (this.state.origin.has([chosen[0]][chosen[1]])) {
				this.setState({
					chosen: null,
					highlight: new Set()
				})
				return
			}
			if (i === 'X') {
				values[chosen[0]][chosen[1]] = null
			} else {
				values[chosen[0]][chosen[1]] = '' + i
			}
			let conflict = new Set()
			for (let i = 0; i < 9; i++) {
				for (let j = 0; j < 9; j++) {
					if (!values[i][j]) {
						continue
					} else {
						let thisvalue = values[i][j],
							possible = this.checkPossible(i, j)
						if (!possible.has(thisvalue)) {
							conflict.add(i + '' + j)
						}
					}
				}
			}
			this.setState(
				{
					values: values,
					highlight: new Set(),
					conflict: conflict,
					chosen: null
				}
			)
			if (!this.state.peep && values.toString() === this.solution.toString()) {
				alert('Congratulations, you have completed this puzzle!')
				this.setState({
					peep: true
				})
			}
		}
	}
	render() {
		let choices = [...'123456789'].map((i) => {
			return <button key={i} className="choice" value={i} onClick={() => this.handleNumsClick(i)}>{i}</button>
		})
		let controls = ['Easy', 'Medium', 'Hard'].map((level, index) => {
			let active = level === this.state.level ? ' active' : ''
			return <li key={index} className={"level" + active} onClick={() => this.generate(level)}>{level}</li>
		})
		return (
			<div className="game">
				<ul className="controls">
					{controls}
					<li>
						<button className="clear" onClick={() => this.handleNumsClick("X")}>Select&Delete</button>
						<button className={"solved"}  onClick={this.solve}>SolveItNow</button>
					</li>
				</ul>
				<div className="main">

					<Board values={this.state.values}
						origin={this.state.origin}
						filter={this.state.filter}
						conflict={this.state.conflict}
						chosen={this.state.chosen}
						highlight={this.state.highlight}
						onClick={this.handleClick} />
					<div className="right">
					</div>
				</div>
				<ul className="choices">
					{choices}
				</ul>
			</div>
		);
	}
}
export default Game
