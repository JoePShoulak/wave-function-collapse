const path = "/tiles/demo/";
let tiles;
let grid;
const GRID_SIZE = 10;

function preload() {
  tiles = {
    BLANK: loadImage(path + "blank.png"),
    UP: loadImage(path + "up.png"),
    DOWN: loadImage(path + "down.png"),
    LEFT: loadImage(path + "left.png"),
    RIGHT: loadImage(path + "right.png"),
  };
}

function drawGrid(grid) {
  grid.cells.forEach((cell) => {
    const w = width / grid.width;
    const h = height / grid.height;

    if (cell.state) {
      image(tiles[cell.state], cell.x * w, cell.y * h, w, h);
    } else {
      fill("black");
      stroke("white");
      rect(cell.x * w, cell.y * h, w, h);
    }
  });
}

function setup() {
  createCanvas(innerWidth, innerHeight);

  grid = new Grid(GRID_SIZE, GRID_SIZE);
}

function draw() {
  background(80);

  const next = grid.oneUncollapsed;
  if (next) next.collapse();
  drawGrid(grid);
}
