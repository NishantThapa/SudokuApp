export const SudokuGenerator = gridVal => {
  let grid = gridVal;
  let nums = [..."123456789"];
  let chars = [..."ABCDEFGHI"];

  let numSet = new Set(nums);
  let charSet = new Set(chars);
  let map = new Map();
  for (let i = 0; i <= 8; i++) {
    map.set(chars[i], nums[i]);
  }
  let pattern = shuffleGrid(grid, nums, chars);
  let puzzle = [];
  for (let i = 0; i <= 8; i++) {
    let row = [];
    for (let j = 0; j <= 8; j++) {
      if (numSet.has(pattern[9 * i + j])) {
        row.push({number: pattern[9 * i + j], initial: true});
      } else {
        row.push(null);
      }
    }
    puzzle.push(row);
  }
  let solution = [];
  for (let i = 0; i <= 8; i++) {
    let row = [];
    for (let j = 0; j <= 8; j++) {
      if (charSet.has(pattern[9 * i + j])) {
        row.push(map.get(pattern[9 * i + j]));
      } else {
        row.push(pattern[9 * i + j]);
      }
    }
    solution.push(row);
  }
  return [puzzle, solution];
};

const shuffleArray = array => {
  for (let i = array.length; i; i--) {
    let j = Math.floor(Math.random() * i);
    [array[i - 1], array[j]] = [array[j], array[i - 1]];
  }
};

const shuffleGrid = (gridval, numsVal, charsVal) => {
  let nums,
    chars,
    shuffledNums,
    shuffledChars,
    index1,
    index2,
    index3,
    index,
    rotate,
    numMap,
    charMap,
    tempGrid,
    grid;
  grid = gridval;
  nums = numsVal.slice();
  chars = charsVal.slice();
  index1 = [0, 1, 2];
  index2 = [3, 4, 5];
  index3 = [6, 7, 8];
  // shuffle symbols
  shuffledNums = nums.slice();
  shuffledChars = [];
  shuffleArray(shuffledNums);
  for (let num of shuffledNums) {
    shuffledChars.push(chars[parseInt(num, 10) - 1]);
  }
  numMap = new Map();
  charMap = new Map();
  for (let i = 0; i < 9; i++) {
    numMap.set(nums[i], shuffledNums[i]);
  }
  for (let i = 0; i < 9; i++) {
    charMap.set(chars[i], shuffledChars[i]);
  }
  tempGrid = "";
  for (let c of grid) {
    if (numMap.has(c)) {
      tempGrid += numMap.get(c);
    } else {
      tempGrid += charMap.get(c);
    }
  }
  grid = tempGrid;
  // shuffle rows
  shuffleArray(index1);
  shuffleArray(index2);
  shuffleArray(index3);
  index = index1.concat(index2).concat(index3);
  tempGrid = "";
  for (let i of index) {
    tempGrid += grid.slice(i * 9, i * 9 + 9);
  }
  grid = tempGrid;
  // shuffle cols
  shuffleArray(index1);
  shuffleArray(index2);
  shuffleArray(index3);
  index = index1.concat(index2).concat(index3);
  tempGrid = "";
  for (let i = 0; i < 9; i++) {
    for (let j of index) {
      tempGrid += grid.slice(i * 9, i * 9 + 9)[j];
    }
  }
  grid = tempGrid;
  // shuffle blockRows
  shuffleArray(index1);
  tempGrid = "";
  for (let i of index1) {
    tempGrid += grid.slice(i * 3 * 9, i * 3 * 9 + 27);
  }
  grid = tempGrid;
  // shuffle blockCols
  shuffleArray(index1);
  tempGrid = "";
  for (let i = 0; i < 9; i++) {
    for (let j of index1) {
      tempGrid += grid.slice(i * 9, i * 9 + 9).slice(j * 3, j * 3 + 3);
    }
  }
  grid = tempGrid;
  // rotate left | none | right
  tempGrid = "";
  rotate = [-1, 0, 1][Math.floor(Math.random() * 3)];
  if (rotate === 0) {
  } else if (rotate === -1) {
    for (let i = 8; i >= 0; i--) {
      for (let j = 0; j <= 8; j++) {
        tempGrid += grid[j * 9 + i];
      }
    }
    grid = tempGrid;
  } else {
    for (let i = 0; i <= 8; i++) {
      for (let j = 8; j >= 0; j--) {
        tempGrid += grid[j * 9 + i];
      }
    }
    grid = tempGrid;
  }
  return grid;
};
