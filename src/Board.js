import React from "react";

const Board = props => {
  const getsquares = rowindex => {
    const squares = [..."012345678"].map((i, squareindex) => {
      let cord = rowindex + "" + squareindex,
        className = "square";
      if (props.origin.has(cord)) {
        className += " origin";
      }
      if (props.highlight.has(cord)) {
        className += " highlight";
      }
      if (props.filter.has(cord)) {
        className += " filter";
      }
      if (props.conflict.has(cord)) {
        className += " conflict";
      }
      if (props.chosen === cord) {
        className += " chosen";
      }
      return (
        <button
          key={squareindex}
          className={className}
          onClick={() => props.onClick(rowindex, squareindex)}
        >
          {input(props.values && props.values[rowindex][squareindex]!== null && props.values[rowindex][squareindex].number)}
        </button>
      );
    });

    return (
      <div key={rowindex} className={"row " + rowindex}>
        {squares}
      </div>
    );
  };

  const handleChange = e => {
    const range = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const val = parseInt(e.target.value);
    if (range.indexOf(val) === -1) return;
    props.onChangeNums(val);
  };

  const input = val => (
    <input
      className="square-input"
      disabled={val}
      value={val ? val : ""}
      onChange={e => handleChange(e)}
    />
  );

  const rows = [..."012345678"].map((i, rowindex) => {
    return getsquares(rowindex);
  });

  return <div className="board">{rows}</div>;
};

export default Board;
