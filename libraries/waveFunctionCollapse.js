const randomFrom = (array) => array[Math.floor(Math.random() * array.length)];

const reverseString = (string) => string.split("").reverse().join("");

const compareEdge = (myEdge, relEdge) => myEdge == reverseString(relEdge);

class Tile {
  constructor(img, edges) {
    this.img = img;

    this.edges = {
      up: edges[0],
      right: edges[1],
      down: edges[2],
      left: edges[3],
    };
  }

  rotate(amount) {
    const edges = [...Object.values(this.edges)];

    for (let i = 0; i < amount; i++) {
      edges.unshift(edges.pop());
    }

    // TODO Rotate the image too

    return new Tile(this.img, edges);
  }
}

class Cell {
  constructor(x, y, grid) {
    this.x = x;
    this.y = y;
    this.grid = grid;

    this.options = [...this.grid.options];

    this.neighbors = [];
  }

  collapse() {
    this.state = randomFrom(this.options);

    Object.values(this.neighbors).forEach((cell) => cell.update());

    return this;
  }

  reset() {
    delete this.state;

    this.options = [...this.grid.options];
  }

  compare(key, option) {
    const oppEdge = {
      up: "down",
      down: "up",
      left: "right",
      right: "left",
    };

    if (this.neighbors[key]?.state) {
      const myEdge = option.edges[key];
      const relEdge = this.neighbors[key].state.edges[oppEdge[key]];

      return compareEdge(myEdge, relEdge);
    }

    return true;
  }

  update() {
    this.options = this.options.filter((option) => {
      if (!this.compare("up", option)) return false;
      if (!this.compare("right", option)) return false;
      if (!this.compare("down", option)) return false;
      if (!this.compare("left", option)) return false;

      return true;
    });

    if (this.options.length == 0) {
      this.grid.reset();
    }
  }
}

class Grid {
  constructor(width, height, options) {
    this.width = width;
    this.height = height;

    this.options = options;

    this.cells = [];

    for (let j = 0; j < height; j++) {
      for (let i = 0; i < width; i++) {
        const index = i + width * j;
        this.cells[index] = new Cell(i, j, this);
      }
    }

    this.cells.forEach((cell) => {
      cell.neighbors = this.getNeighbors(cell);
    });
  }

  get finished() {
    return this.allUncollapsed.length == 0;
  }

  get allUncollapsed() {
    return this.cells.filter((cell) => cell.state == undefined);
  }

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
      case "right":
        flagBool = index % this.width != 0;
        break;
      case "left":
        flagBool = (index + 1) % this.width != 0;
        break;
    }

    return index >= 0 && index < this.cells.length && flagBool;
  }

  getNeighbors(cell) {
    const nbrs = {};

    const index = cell.x + cell.y * this.width;

    const up = index - this.width;
    const down = index + this.width;
    const right = index + 1;
    const left = index - 1;

    if (this.validNeighbor(up)) nbrs.up = this.cells[up];
    if (this.validNeighbor(down)) nbrs.down = this.cells[down];
    if (this.validNeighbor(right, "right")) nbrs.right = this.cells[right];
    if (this.validNeighbor(left, "left")) nbrs.left = this.cells[left];

    return nbrs;
  }

  advance() {
    return this.oneUncollapsed?.collapse();
  }

  resetCallback() {}

  reset() {
    this.cells.forEach((cell) => cell.reset());
    this.resetCallback();
  }
}
