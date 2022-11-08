const randomFrom = (array) => array[Math.floor(Math.random() * array.length)];

class Tile {}

class Cell {
  static BLANK = "BLANK";
  static UP = "UP";
  static DOWN = "DOWN";
  static LEFT = "LEFT";
  static RIGHT = "RIGHT";

  constructor(x, y, grid) {
    this.x = x;
    this.y = y;
    this.grid = grid;

    this.options = [Cell.BLANK, Cell.UP, Cell.DOWN, Cell.LEFT, Cell.RIGHT];
  }

  collapse() {
    this.state = randomFrom(this.options);

    const nbrs = grid.getNeighbors(this);

    Object.values(nbrs).forEach((cell) => cell.update());
  }

  update() {
    const nbrs = grid.getNeighbors(this);

    Object.entries(nbrs).forEach(([key, value]) => {
      let blanks = [Cell.BLANK];
      let resBlanks = [Cell.BLANK];

      // Define our valid options based on the location of the relevant cell
      switch (key) {
        case "north":
          blanks.push(Cell.UP);
          resBlanks.push(Cell.DOWN);
          break;
        case "south":
          blanks.push(Cell.DOWN);
          resBlanks.push(Cell.UP);
          break;
        case "east":
          blanks.push(Cell.RIGHT);
          resBlanks.push(Cell.LEFT);
          break;
        case "west":
          blanks.push(Cell.LEFT);
          resBlanks.push(Cell.RIGHT);
          break;
      }

      // Reduce our available options to the valid options
      if (value?.state) {
        const matchBlank = blanks.includes(value.state);

        this.options = this.options.filter((op) => {
          const blank = resBlanks.includes(op);

          return matchBlank ? blank : !blank;
        });
      }

      // FIXME
      // If there are no legal options, we have made a mistake
      // For now, log that fact and set the tile to Blank
      if (this.options.length == 0) {
        console.log("broken tile");
        this.options = [Cell.BLANK];
      }
    });
  }
}

class Grid {
  constructor(width, height) {
    this.width = width;
    this.height = height;

    this.cells = [];

    for (let j = 0; j < height; j++) {
      for (let i = 0; i < width; i++) {
        const index = i + width * j;
        this.cells[index] = new Cell(i, j, this);
      }
    }
  }

  get allUncollapsed() {
    return this.cells.filter((cell) => cell.state == undefined);
  }

  /**
   * This function asks for all the uncollapsed cells,
   * finds the minnimuim entropy among them (shortest options length),
   * filters for all uncollapsed with that minnimum entropy,
   * and then returns a matching element of that filtered array.
   */
  get oneUncollapsed() {
    const allU = this.allUncollapsed;

    const minE = allU.reduce(
      (acc, val) => {
        return acc < val.options.length ? acc : val.options.length;
      },
      allU[0] ? allU[0].options.length : null
    );

    const allMin = allU.filter((cell) => cell.options.length == minE);

    return randomFrom(allMin);
  }

  validNeighbor(index, flag = "") {
    let flagBool = true;

    switch (flag) {
      case "east":
        flagBool = index % this.width != 0;
        break;
      case "west":
        flagBool = (index + 1) % this.width != 0;
        break;
    }

    return index >= 0 && index < this.cells.length && flagBool;
  }

  getNeighbors(cell) {
    const nbrs = {};

    const index = cell.x + cell.y * this.width;

    const north = index - this.width;
    const south = index + this.width;
    const east = index + 1;
    const west = index - 1;

    if (this.validNeighbor(north)) nbrs.north = this.cells[north];
    if (this.validNeighbor(south)) nbrs.south = this.cells[south];
    if (this.validNeighbor(east, "east")) nbrs.east = this.cells[east];
    if (this.validNeighbor(west, "west")) nbrs.west = this.cells[west];

    return nbrs;
  }
}
