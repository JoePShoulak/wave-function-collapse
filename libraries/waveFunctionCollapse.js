/**
 * Based off the incredible work of Dan Shiffman
 *
 * Website: https://thecodingtrain.com/
 * Tutorial:  https://youtu.be/rI_y2GAlQFM
 * Repo: https://github.com/CodingTrain/Wave-Function-Collapse
 */

const randomFrom = (array) => array[Math.floor(Math.random() * array.length)];

const reverseString = (string) => string.split("").reverse().join("");

const compareEdge = (myEdge, relEdge) => myEdge == reverseString(relEdge);

class Tile {
  static rotateImage() {}

  constructor(img, edges) {
    this.img = img;

    this.edges = {
      up: edges[0],
      right: edges[1],
      down: edges[2],
      left: edges[3],
    };
  }

  allRotations() {
    let amount;
    let rotations = [this];

    if (
      // All edges are the same
      this.edges.up == this.edges.right &&
      this.edges.left == this.edges.right &&
      this.edges.down == this.edges.right
    )
      amount = 0;
    else if (
      // Opposite edges are the same
      this.edges.up == this.edges.down &&
      this.edges.left == this.edges.right
    ) {
      amount = 2;
    } else {
      amount = 4;
    }

    for (let i = 1; i < amount; i++) {
      rotations.push(this.rotate(i));
    }

    return rotations;
  }

  rotate(amount) {
    const edges = [...Object.values(this.edges)];

    for (let i = 0; i < amount; i++) {
      edges.unshift(edges.pop());
    }

    const newImg = Tile.rotateImage(this.img, amount);

    return new Tile(newImg, edges);
  }
}

class Cell {
  static options = [];

  constructor(x, y, grid) {
    this.x = x;
    this.y = y;
    this.grid = grid;

    this.options = [...Cell.options];
    this.neighbors = [];
  }

  collapse() {
    this.state = randomFrom(this.options);

    Object.values(this.neighbors).forEach((cell) => cell.update());

    return this;
  }

  reset() {
    delete this.state;

    this.options = [...Cell.options];
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
      const opts = ["up", "down", "left", "right"];

      for (let i = 0; i < opts.length; i++) {
        if (!this.compare(opts[i], option)) return false;
      }

      return true;
    });

    // TODO Optimize this
    if (this.options.length == 0) {
      this.grid.reset();
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

    this.cells.forEach((cell) => {
      cell.neighbors = this.getNeighbors(cell);
    });
  }

  get allUncollapsed() {
    return this.cells.filter((cell) => cell.state == undefined);
  }

  get finished() {
    return this.allUncollapsed.length == 0;
  }

  get next() {
    // TODO Optimize this
    const allU = this.allUncollapsed;

    const rSeed = allU[0]?.options?.length;
    const minE = allU.reduce((acc, val) => {
      const ops = val.options.length;

      return acc < ops ? acc : ops;
    }, rSeed);

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
    return this.next?.collapse();
  }

  resetCallback() {}

  reset() {
    this.cells.forEach((cell) => cell.reset());
    this.resetCallback(this);
  }
}
