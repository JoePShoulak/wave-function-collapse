const randomFrom = (array) => array[Math.floor(Math.random() * array.length)];

class Tile {
  constructor(value, edges) {
    this.value = value;
    this.edges = {
      up: edges[0],
      right: edges[1],
      down: edges[2],
      left: edges[3],
    };

    // this.rotation = 0;
  }

  // rotate(amount) {
  //   const edges = Object.values(this.edges);
  //   let value;

  //   for (let i = 0; i < amount; i++) {
  //     edges.unshift(edges.pop());
  //   }

  //   if (this.value != "BLANK") {
  //     const values = ["UP", "RIGHT", "DOWN", "LEFT"];

  //     const index = (values.indexOf(this.value) + amount) % 4;

  //     value = values[index];
  //   }

  //   const newTile = new Tile(value, edges);
  //   newTile.rotation = amount;
  //   return newTile;
  // }
}

class Cell {
  static BLANK = new Tile("BLANK", [0, 0, 0, 0]);
  static DOWN = new Tile("DOWN", [0, 1, 1, 1]);
  static LEFT = new Tile("LEFT", [1, 0, 1, 1]);
  static UP = new Tile("UP", [1, 1, 0, 1]);
  static RIGHT = new Tile("RIGHT", [1, 1, 1, 0]);

  constructor(x, y, grid) {
    this.x = x;
    this.y = y;
    this.grid = grid;

    this.options = [
      Cell.BLANK,
      Cell.DOWN,
      // Cell.DOWN.rotate(1),
      // Cell.DOWN.rotate(2),
      // Cell.DOWN.rotate(3),
      Cell.LEFT,
      Cell.UP,
      Cell.RIGHT,
    ];
  }

  collapse() {
    this.state = randomFrom(this.options);

    const nbrs = grid.getNeighbors(this);

    Object.values(nbrs).forEach((cell) => cell.update());
  }

  reset() {
    delete this.state;

    this.options = [
      Cell.BLANK,
      Cell.DOWN,
      // Cell.DOWN.rotate(1),
      // Cell.DOWN.rotate(2),
      // Cell.DOWN.rotate(3),
      Cell.LEFT,
      Cell.UP,
      Cell.RIGHT,
    ];
  }

  update() {
    const nbrs = grid.getNeighbors(this);

    this.options = this.options.filter((op) => {
      if (nbrs.north?.state) {
        if (op.edges.up != nbrs.north.state.edges.down) return false;
      }

      if (nbrs.east?.state) {
        if (op.edges.right != nbrs.east.state.edges.left) return false;
      }

      if (nbrs.south?.state) {
        if (op.edges.down != nbrs.south.state.edges.up) return false;
      }

      if (nbrs.west?.state) {
        if (op.edges.left != nbrs.west.state.edges.right) return false;
      }

      return true;
    });

    // FIXME
    // If there are no legal options, we have made a mistake
    // For now, log that fact and set the tile to Blank
    if (this.options.length == 0) {
      console.log("Found error");
      this.reset();

      const nbrs = grid.getNeighbors(this);

      Object.values(nbrs).forEach((cell) => {
        if (cell.state) cell.reset();
      });
    }
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
