import { MAX_COLS, MAX_ROWS, NO_OF_BOMBS } from "../Constants";
import { CellValue, CellState, Cell } from "../Types"

export const generateCells = (): Cell[][] => {
  const cells:Cell[][] = [];

  //generating all cells
  for (let row = 0; row < MAX_ROWS; row++) {
    cells.push([]);

    for (let col = 0; col < MAX_COLS; col++) {
        cells[row].push({
            value: CellValue.none,
            state: CellState.visible
        })
    }
  }

  //randomly put bombs
  let bombsPlaced = 0;
  while(bombsPlaced < NO_OF_BOMBS){
    const randomRow = Math.floor(Math.random() * MAX_ROWS);
    const randomCol = Math.floor(Math.random() * MAX_COLS);

    const currentCell = cells[randomRow][randomCol];
    if(currentCell.value !== CellValue.bomb){
      //turn cell into bomb
      cells[randomRow][randomCol] = {
        value: CellValue.bomb,
        state: CellState.visible
      }

      bombsPlaced++;
    }

  }

  return cells;
};
