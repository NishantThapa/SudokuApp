import React, { Component } from 'react';
class Board extends Component {
	getsquares = (rowindex) => {
		let squares = [...'012345678'].map((i, squareindex) => {
			let cord = rowindex + '' + squareindex
				, className = 'square'
			if (this.props.origin.has(cord)) { className += ' origin' }
			if (this.props.highlight.has(cord)) { className += ' highlight' }
			if (this.props.filter.has(cord)) { className += ' filter' }
			if (this.props.conflict.has(cord)) { className += ' conflict' }
			if (this.props.chosen === cord) { className += ' chosen' }
			return (
				<button key={squareindex} className={className} onClick={() => this.props.onClick(rowindex, squareindex)}>
					{this.props.values[rowindex][squareindex]}
				</button>
			)
		})
		return (
			<div key={rowindex} className={'row ' + rowindex}>
				{squares}
			</div>
		)
	}
	render() {
		let rows = [...'012345678'].map((i, rowindex) => {
			return this.getsquares(rowindex)
		})
		return (
			<div className='board'>
				{rows}
			</div>
		)
	}
}
export default Board
