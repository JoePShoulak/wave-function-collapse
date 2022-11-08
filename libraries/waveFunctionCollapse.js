const randomFrom = (array) => array[Math.floor(Math.random() * array.length)];

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

    Object.values(nbrs).forEach((cell) => {
      if (cell) cell.update();
    });
  }

  update() {
    const nbrs = grid.getNeighbors(this);

    Object.entries(nbrs).forEach(([key, value]) => {
      let blanks = [Cell.BLANK];
      let responseBlanks = [Cell.BLANK];

      // Depending on where the neighbor is, define inputs and responses
      switch (key) {
        case "north":
          blanks.push(Cell.UP);
          responseBlanks.push(Cell.DOWN);
          break;
        case "south":
          blanks.push(Cell.DOWN);
          responseBlanks.push(Cell.UP);
          break;
        case "east":
          blanks.push(Cell.RIGHT);
          responseBlanks.push(Cell.LEFT);
          break;
        case "west":
          blanks.push(Cell.LEFT);
          responseBlanks.push(Cell.RIGHT);
          break;
      }

      // If the tile has a state...
      if (value?.state) {
        // If it's a blank in this context...
        if (blanks.includes(value.state)) {
          // Set our options to valid responses (responseBlanks)
          this.options = this.options.filter((op) =>
            responseBlanks.includes(op)
          );
        } else {
          // If it's not a blank in this context...
          // Set our options to valid responses (!responseBlanks)
          this.options = this.options.filter(
            (op) => !responseBlanks.includes(op)
          );
        }
      }

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

  validIndex(index, flag = "") {
    let flagBool;

    switch (flag) {
      case "east":
        flagBool = index % this.width != 0;
        break;
      case "west":
        flagBool = (index + 1) % this.width != 0;
        break;

      default:
        flagBool = true;
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

    nbrs.north = this.validIndex(north) ? this.cells[north] : null;
    nbrs.south = this.validIndex(south) ? this.cells[south] : null;
    nbrs.east = this.validIndex(east, "east") ? this.cells[east] : null;
    nbrs.west = this.validIndex(west, "west") ? this.cells[west] : null;

    return nbrs;
  }
}
