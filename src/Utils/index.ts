import { MAX_COLS, MAX_ROWS, NO_OF_BOMBS } from "../Constants";
import { CellValue, CellState, Cell } from "../Types";

export const generateCells = (): Cell[][] => {
  const cells: Cell[][] = [];

  //generating all cells
  for (let row = 0; row < MAX_ROWS; row++) {
    cells.push([]);

    for (let col = 0; col < MAX_COLS; col++) {
      cells[row].push({
        value: CellValue.none,
        state: CellState.visible,
      });
    }
  }

  //randomly put bombs
  let bombsPlaced = 0;
  while (bombsPlaced < NO_OF_BOMBS) {
    const randomRow = Math.floor(Math.random() * MAX_ROWS);
    const randomCol = Math.floor(Math.random() * MAX_COLS);

    const currentCell = cells[randomRow][randomCol];
    if (currentCell.value !== CellValue.bomb) {
      //turn cell into bomb
      cells[randomRow][randomCol] = {
        value: CellValue.bomb,
        state: CellState.visible,
      };

      bombsPlaced++;
    }
  }

  // calculate the numbers for each cell
  for (let rowIndex = 0; rowIndex < MAX_ROWS; rowIndex++) {
    for (let colIndex = 0; colIndex < MAX_COLS; colIndex++) {
      const currentCell = cells[rowIndex][colIndex];

      if (currentCell.value !== CellValue.bomb) {

        let numberOfBombs = 0;

        const topLeftBomb =
          rowIndex > 0 && colIndex > 0
            ? cells[rowIndex - 1][colIndex - 1]
            : null;
        const topBomb = rowIndex > 0 ? cells[rowIndex - 1][colIndex] : null;
        const topRightBomb =
          rowIndex > 0 && colIndex < MAX_COLS - 1
            ? cells[rowIndex - 1][colIndex + 1]
            : null;
        const leftBomb = colIndex > 0 ? cells[rowIndex][colIndex - 1] : null;
        const rightBomb =
          colIndex < MAX_COLS - 1 ? cells[rowIndex][colIndex + 1] : null;
        const bottomLeftBomb =
          rowIndex < MAX_ROWS - 1 && colIndex > 0
            ? cells[rowIndex + 1][colIndex - 1]
            : null;
        const bottomBomb =
          rowIndex < MAX_ROWS - 1 ? cells[rowIndex + 1][colIndex] : null;
        const bottomRightBomb =
          rowIndex < MAX_ROWS - 1 && colIndex < MAX_COLS - 1
            ? cells[rowIndex + 1][colIndex + 1]
            : null;

        let bombsToCount = [];
        bombsToCount.push(
          topLeftBomb,
          topBomb,
          topRightBomb,
          leftBomb,
          rightBomb,
          bottomLeftBomb,
          bottomBomb,
          bottomRightBomb
        );
        
        bombsToCount.map(cell => {
          if(cell?.value === CellValue.bomb){
            numberOfBombs++;
          }
        })

        if(numberOfBombs > 0){
          cells[rowIndex][colIndex].value = numberOfBombs;
        }
      }
    }
  }

  console.log(cells)

  return cells;
};
