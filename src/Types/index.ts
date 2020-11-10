export enum CellValue {
    none,
    bomb,
    one,
    two,
    three,
    four,
    five,
    six,
    seven,
    eight,
}

export enum CellState {
    open,
    visible,
    flagged
}

export type Cell = {value:CellValue, state:CellState}