import React, { useEffect, useState } from "react";
import sudokus from "./Sudokus";
import { SudokuGenerator } from "./SudokuGenerator";
import Board from "./Board";

const Game = () => {
  const [solutionValue, setSolutionValue] = useState();
  const [docState, setDocState] = useState({
    level: "",
    origin: new Set(),
    chosen: null,
    possible: null,
    filter: new Set(),
    highlight: new Set(),
    conflict: new Set(),
    peep: false
  });
  console.log(docState,"InitialGrid")
  useEffect(() => {
    generate("easy");
  }, []);

  const generate = async level => {
    var puzzles;
    switch (level) {
      case "Easy":
        puzzles = sudokus.Easy;
        break;
      case "Medium":
        puzzles = sudokus.Medium;
        break;
      case "Hard":
        puzzles = sudokus.Hard;
        break;
      default:
        puzzles = sudokus.Easy;
    }
    let grid = puzzles[Math.floor(Math.random() * puzzles.length)],
      sudoku = SudokuGenerator(grid),
      puzzle = sudoku[0];
    setSolutionValue(sudoku[1]);
    const origin = new Set();
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (puzzle[i][j]) {
          origin.add(i + "" + j);
        }
      }
    }

    await setDocState({
      values: puzzle,
      level: level,
      origin: origin,
      chosen: null,
      possible: null,
      filter: new Set(),
      highlight: new Set(),
      conflict: new Set(),
      peep: false
    });

  };

  const checkPossible = (i, j) => {
    let values = docState.values;
    let allPossible = new Set([..."123456789"]);
    for (let k = 0; k <= 8; k++) {
      if (k === j) {
        continue;
      }
      if (allPossible.has(values[i][k])) {
        allPossible.delete(values[i][k]);
      }
    }
    for (let k = 0; k <= 8; k++) {
      if (k === i) {
        continue;
      }
      if (allPossible.has(values[k][j])) {
        allPossible.delete(values[k][j]);
      }
    }
    let bi = Math.floor(i / 3) * 3,
      bj = Math.floor(j / 3) * 3;
    for (let m = bi; m < bi + 3; m++) {
      for (let n = bj; n < bj + 3; n++) {
        if (m === i && n === j) {
          continue;
        }
        if (allPossible.has(values[m][n])) {
          allPossible.delete(values[m][n]);
        }
      }
    }
    return allPossible;
  };

  const filter = value => {
    let values = docState.values;
    let filter = new Set();
    for (let m = 0; m < 9; m++) {
      for (let n = 0; n < 9; n++) {
        if (values[m][n] === value) {
          filter.add(m + "" + n);
        }
      }
    }
    setDocState({
      ...docState,
      filter: filter,
      highlight: new Set(),
      chosen: null
    });
  };

  const highlight = (i, j) => {
    let values = docState.values;
    let highlight = new Set();
    for (let k = 0; k < 9; k++) {
      if (values[i][k]) {
        highlight.add(i + "" + k);
      }
    }
    for (let k = 0; k < 9; k++) {
      if (values[k][j]) {
        highlight.add(k + "" + j);
      }
    }
    let line = Math.floor(i / 3) * 3,
      row = Math.floor(j / 3) * 3;
    for (let ln = line; ln < line + 3; ln++) {
      for (let r = row; r < row + 3; r++) {
        if (values[ln][r]) {
          highlight.add(ln + "" + r);
        }
      }
    }
    setDocState({
      ...docState,
      highlight: highlight,
      filter: new Set()
    });
  };

  const solve = () => {
    if (docState.peep) {
      return;
    }
    // eslint-disable-next-line no-restricted-globals
    let r = confirm("Are you sure you want to check the answer ? ");
    if (!r) {
      return;
    } else {
      setDocState({
        ...docState,
        values: solutionValue,
        peep: true,
        conflict: new Set(),
        highlight: new Set(),
        filter: new Set()
      });
    }
  };

  const clear =()=>{
    docState.values.map(value=>{
      value.map((box, index)=>{
        if(box && !box.initial){
          value[index]= null
        }
      })
    })
    setDocState({
      ...docState,
      values: docState.values,
      conflict: new Set(),
      peep:false
    });
  }

  const check = () => {

    if (docState.conflict.size > 0) {
      alert('There is Some error')
      console.log("error")
    } else {
      console.log("clear")
      alert('Your are clear to go')
    }
  }
  const handleClick = (i, j) => {
    let values = docState.values.slice();
    let thisvalue = values[i].slice();
    if (docState.origin.has(i + "" + j)) {
      filter(thisvalue[j]);
      return;
    } else {
      highlight(i, j);
      let chosen = i + "" + j;
      let possible = Array.from(checkPossible(i, j)).toString();
      setDocState({
        ...docState,
        chosen: chosen,
        possible: possible,
        filter: new Set(),
        check: false
      });
    }
  };

  const handleNumsClick = i => {
    if (docState.peep) {
      return;
    }
    let chosen = docState.chosen;
    if (!chosen) {
      filter("" + i);
    } else {
      let values = docState.values.slice();
      if (docState.origin.has([chosen[0]][chosen[1]])) {
        setDocState({
          ...docState,
          chosen: null,
          highlight: new Set()
        });
        return;
      }
      if (i === "X") {
        values[chosen[0]][chosen[1]] = null;
      } else {
        values[chosen[0]][chosen[1]] = {number: "" + i, initial: false};
      }
      let conflict = new Set();
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          if (!values[i][j]) {
            continue;
          } else {
            let thisvalue = values[i][j],
              possible = checkPossible(i, j);
            if (!possible.has(thisvalue)) {
              conflict.add(i + "" + j);
            }
          }
        }
      }
      setDocState({
        ...docState,
        values: values,
        highlight: new Set(),
        conflict: conflict,
        // chosen: null
      });
      // if (values.toString() === solutionValue.toString()) {
      //   alert("Congratulations, you have completed this puzzle!");
      //   setDocState({
      //     ...docState,
      //     peep: true
      //   });
      // }
    }
  };

  const controls = ["Easy", "Medium", "Hard"].map((level, index) => {
    let active = level === docState.level ? " active" : "";
    return (
      <li
        key={index}
        className={"level" + active}
        onClick={() => generate(level)}
      >
        {level}
      </li>
    );
  });

  return (
    <div className="game">
      <ul className="controls">
        {controls}
        <li>
          <button className="clear" onClick={() => handleNumsClick("X")}>
            Undo
          </button>
          <button className={"solved"} onClick={clear}>
            Clear
          </button>
        </li>
      </ul>
      <div className="main">
        <Board
          values={docState.values}
          origin={docState.origin}
          filter={docState.filter}
          conflict={docState.conflict}
          chosen={docState.chosen}
          highlight={docState.highlight}
          onClick={handleClick}
          onChangeNums={handleNumsClick}
        />
        <div className="right"></div>
      </div>
      <ul className="controls">
        <li>
          <button className="clear" onClick={check}>
            Check
          </button>
          <button className={"solved"} onClick={solve}>
            Solve
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Game;
