/**
 * Based off the incredible work of Dan Shiffman
 *
 * Website: https://thecodingtrain.com/
 * Tutorial:  https://youtu.be/rI_y2GAlQFM
 * Repo: https://github.com/CodingTrain/Wave-Function-Collapse
 */

/* == HELPERS == */
const randomFrom = (array) => array[Math.floor(Math.random() * array.length)];

const reverseString = (string) => string.split("").reverse().join("");

const compareEdge = (myEdge, relEdge) => myEdge == reverseString(relEdge);

const componentToHex = (c) => {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
};

const rgbToHex = (r, g, b, _a) => {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
};

const rotateImg = (img, amount) => {
  const w = img.width;
  const h = img.height;

  const newImg = createGraphics(w, h);

  newImg.imageMode(CENTER);
  newImg.translate(w / 2, h / 2);
  newImg.rotate(HALF_PI * amount);
  newImg.image(img, 0, 0);

  return newImg;
};

const DIRECTIONS = ["up", "down", "left", "right"];

/* == TILE CLASS == */
class Tile {
  static colors = {};

  static addColor(color) {
    color = rgbToHex(...color);

    if (Tile.colors[color] == undefined) {
      const iterator = Object.keys(Tile.colors).length;
      Tile.colors[color] = String.fromCharCode(iterator);
    }

    return Tile.colors[color];
  }

  constructor(img) {
    this.img = img;
    this.img.loadPixels();

    this.edges = {};
    DIRECTIONS.forEach((dir) => (this.edges[dir] = this.edgeFromImg(dir)));
  }

  edgeFromImg(dir) {
    let points = [];

    const w = this.img.width;
    const h = this.img.height;

    const NW = [1, 1];
    const NN = [w / 2, 1];
    const NE = [w - 1, 1];
    const EE = [w - 1, h / 2];
    const SE = [w - 1, h - 1];
    const SS = [w / 2, h - 1];
    const SW = [1, h - 1];
    const WW = [1, h / 2];

    switch (dir) {
      case "up":
        points = [NW, NN, NE];
        break;
      case "right":
        points = [NE, EE, SE];
        break;
      case "down":
        points = [SE, SS, SW];
        break;
      case "left":
        points = [SW, WW, NW];
        break;
    }

    return points
      .map((point) => Tile.addColor(this.img.get(...point)))
      .join("");
  }

  allRotations() {
    let amount;
    let rotations = [];

    if (
      // All edges are the same
      this.edges.left == this.edges.up &&
      this.edges.left == this.edges.right &&
      this.edges.left == this.edges.down
    ) {
      return [this];
    }

    if (
      // Opposite edges are the same
      this.edges.left == this.edges.right &&
      this.edges.up == this.edges.down
    ) {
      amount = 2;
    } else {
      amount = 4;
    }

    for (let i = 0; i < amount; i++) {
      rotations.push(this.rotate(i));
    }

    return rotations;
  }

  rotate(amount) {
    const edges = [...Object.values(this.edges)];

    for (let i = 0; i < amount; i++) {
      edges.unshift(edges.pop());
    }

    const newImg = rotateImg(this.img, amount);

    return new Tile(newImg, edges);
  }
}

/* == CELL CLASS == */
class Cell {
  static options = [];

  static resetCallback() {}

  constructor(x, y, grid) {
    this.x = x;
    this.y = y;
    this.grid = grid;

    this.options = [...Cell.options];
    this.neighbors = [];
  }

  collapse() {
    this.state = randomFrom(this.options);

    const index = this.grid.uncollapsed.indexOf(this);
    this.grid.uncollapsed.splice(index, 1);

    Object.values(this.neighbors).forEach((cell) => cell.update());

    return this;
  }

  reset() {
    delete this.state;
    this.options = [...Cell.options];

    this.grid.uncollapsed.push(this);
  }

  compare(dir, option) {
    const oppEdge = {
      up: "down",
      down: "up",
      left: "right",
      right: "left",
    };

    if (this.neighbors[dir]?.state) {
      const myEdge = option.edges[dir];
      const relEdge = this.neighbors[dir].state.edges[oppEdge[dir]];

      return compareEdge(myEdge, relEdge);
    }

    return true;
  }

  update() {
    this.options = this.options.filter((option) => {
      for (let i = 0; i < DIRECTIONS.length; i++) {
        if (!this.compare(DIRECTIONS[i], option)) return false;
      }

      return true;
    });

    if (this.options.length == 0) {
      this.reset();

      Object.values(this.neighbors).forEach((cell) => cell.reset());
    }
  }
}

/* == GRID CLASS == */
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

    this.uncollapsed = [...this.cells];
  }

  get finished() {
    return this.uncollapsed.length == 0;
  }

  get next() {
    // TODO Optimize this
    const allU = this.uncollapsed;

    const rSeed = allU[0]?.options.length;
    const minE = allU.reduce((acc, val) => {
      const ops = val.options.length;

      return acc < ops ? acc : ops;
    }, rSeed);

    const allMin = allU.filter((cell) => cell.options.length == minE);

    return randomFrom(allMin);
  }

  advance() {
    return this.next?.collapse();
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
}
