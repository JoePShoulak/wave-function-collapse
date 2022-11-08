const path = "/tiles/demo/";
let tiles;
let grid;
const GRID_SIZE = 40;

function drawGrid(grid) {
  grid.cells.forEach((cell) => {
    drawCell(cell);
  });
}

function drawCell(cell) {
  const w = width / grid.width;
  const h = height / grid.height;

  const pos = [cell.x * w, cell.y * h];
  const size = [w, h];

  if (cell.state) {
    let value = cell.state.value;
    image(tiles[value], ...pos, ...size);
  } else {
    fill("black");
    stroke("white");
    rect(...pos, ...size);
  }
}

function preload() {
  tiles = {
    BLANK: loadImage(path + "blank.png"),
    UP: loadImage(path + "up.png"),
    DOWN: loadImage(path + "down.png"),
    LEFT: loadImage(path + "left.png"),
    RIGHT: loadImage(path + "right.png"),
  };
}

function setup() {
  grid = new Grid(GRID_SIZE, GRID_SIZE);
  grid.resetCallback = () => drawGrid(grid);

  createCanvas(innerWidth, innerHeight);
  drawGrid(grid);
}

function draw() {
  const newCell = grid.advance();
  drawCell(newCell);

  if (grid.finished) {
    noLoop();
    console.log("Done!");
  }
}
