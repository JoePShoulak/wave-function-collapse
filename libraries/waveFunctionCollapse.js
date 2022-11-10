/**
 * Based off the incredible work of Dan Shiffman
 *
 * Website: https://thecodingtrain.com/
 * Tutorial:  https://youtu.be/rI_y2GAlQFM
 * Repo: https://github.com/CodingTrain/Wave-Function-Collapse
 */

/* == HELPERS == */
const randomFrom = (array) => array[Math.floor(Math.random() * array.length)];

const componentToHex = (c) => {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
};

const rgbToHex = (r, g, b, _a) => {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
};

/* == TILE CLASS == */
class Tile {
  constructor(img, edges = null) {
    this.img = img;
    this.img.loadPixels();
    this.edges = {};

    if (edges) {
      Grid.directions.forEach((dir, i) => (this.edges[dir] = edges[i]));
    } else {
      Grid.directions.forEach(
        (dir) => (this.edges[dir] = this.edgeFromImg(dir))
      );
    }
  }

  edgeFromImg(dir) {
    const w = this.img.width;
    const h = this.img.height;

    let points = [];

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

    return points.map((point) => rgbToHex(...this.img.get(...point)));

    // TODO This doesn't yet work for tiles/circuit-2/10.png, and I don't know if it's the code or tile

    // const w = this.img.width;
    // const h = this.img.height;

    // const edge = [];

    // switch (dir) {
    //   case "up":
    //     for (let x = 0; x < w; x++) {
    //       edge.push(rgbToHex(...this.img.get(x, 0)));
    //     }
    //     break;
    //   case "right":
    //     for (let y = 0; y < h; y++) {
    //       edge.push(rgbToHex(...this.img.get(w - 1, y)));
    //     }
    //     break;
    //   case "down":
    //     for (let x = w - 1; x >= 0; x--) {
    //       edge.push(rgbToHex(...this.img.get(x, h - 1)));
    //     }
    //     break;
    //   case "left":
    //     for (let y = h - 1; y >= 0; y--) {
    //       edge.push(rgbToHex(...this.img.get(0, y)));
    //     }
    //     break;
    // }

    // return edge;
  }

  allRotations() {
    let rotations = [];

    // All edges are the same
    const fullySymmetric =
      this.edges.left.every((bit, i) => bit == this.edges.up[i]) &&
      this.edges.left.every((bit, i) => bit == this.edges.right[i]) &&
      this.edges.left.every((bit, i) => bit == this.edges.down[i]);

    if (fullySymmetric) return [this];

    // Opposite edges are the same
    const halfSymmetric =
      this.edges.left.every((bit, i) => bit == this.edges.right[i]) &&
      this.edges.up.every((bit, i) => bit == this.edges.down[i]);

    const amount = halfSymmetric ? 2 : 4;

    for (let i = 0; i < amount; i++) {
      rotations.push(this.rotate(i));
    }

    return rotations;
  }

  rotate(amount) {
    const w = this.img.width;
    const h = this.img.height;

    const newImg = createGraphics(w, h);

    newImg.imageMode(CENTER);
    newImg.translate(w / 2, h / 2);
    newImg.rotate(HALF_PI * amount);
    newImg.image(this.img, 0, 0);

    return new Tile(newImg);
  }
}

/* == CELL CLASS == */
class Cell {
  static options = [];

  static resetCallback() {}

  static compareEdge(myEdge, relEdge) {
    const res = myEdge.every((bit, i) => bit == [...relEdge].reverse()[i]);
    return res;
  }

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

    Object.values(this.neighbors).forEach((cell) => {
      cell.update();
    });

    return this;
  }

  reset() {
    delete this.state;
    this.options = [...Cell.options];

    Cell.resetCallback(this);
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

      return Cell.compareEdge(myEdge, relEdge);
    }

    return true;
  }

  update() {
    this.options = this.options.filter((option) => {
      for (let i = 0; i < Grid.directions.length; i++) {
        if (!this.compare(Grid.directions[i], option)) return false;
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
  static directions = ["up", "down", "left", "right"];

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

  get collapsed() {
    return this.uncollapsed.length == 0;
  }

  get next() {
    const minEntropy = this.uncollapsed.reduce((acc, val) => {
      const ops = val.options.length;

      return acc < ops ? acc : ops;
    }, Cell.options.length);

    const allMin = this.uncollapsed.filter(
      (cell) => cell.options.length == minEntropy
    );

    return randomFrom(allMin);
  }

  collapse() {
    while (!this.collapsed) this.observe();
  }

  observe() {
    return this.next?.collapse();
  }

  getNeighbors(cell) {
    const index = cell.x + cell.y * this.width;

    const nbrs = {
      up: index - this.width,
      down: index + this.width,
      right: index + 1,
      left: index - 1,
    };

    const validNbrs = {};

    Object.entries(nbrs).forEach(([dir, nbr]) => {
      if (this.validNeighbor(nbr, dir)) validNbrs[dir] = this.cells[nbr];
    });

    return validNbrs;
  }

  validNeighbor(index, dir) {
    let flagBool = true;

    switch (dir) {
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
