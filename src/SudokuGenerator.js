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
        row.push(pattern[9 * i + j]);
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

const shuffleGrid = (gridval, numsVal, charsVal) => {
  let nums,
    chars,
    index1,
    index2,
    index3,
    grid;
  grid = gridval;
  nums = numsVal.slice();
  chars = charsVal.slice();
  index1 = [0, 1, 2];
  index2 = [3, 4, 5];
  index3 = [6, 7, 8];
  return grid;
};