const path = "tiles/demo/";
let images;
let grid;
const GRID_SIZE = 40;

function drawGrid(grid) {
  grid.cells.forEach((cell) => drawCell(cell));
}

function drawCell(cell) {
  const w = width / grid.width;
  const h = height / grid.height;

  const pos = [cell.x * w, cell.y * h];
  const size = [w, h];

  if (cell.state) {
    image(cell.state.img, ...pos, ...size);
  } else {
    rect(...pos, ...size);
  }
}

function preload() {
  images = {
    BLANK: loadImage(path + "blank.png"),
    UP: loadImage(path + "up.png"),
    DOWN: loadImage(path + "down.png"),
    LEFT: loadImage(path + "left.png"),
    RIGHT: loadImage(path + "right.png"),
  };
}

function setup() {
  const BLANK = new Tile(images.BLANK, ["0", "0", "0", "0"]);

  const DOWN = new Tile(images.DOWN, ["0", "1", "1", "1"]);
  const LEFT = DOWN.rotate(1);
  const UP = DOWN.rotate(2);
  const RIGHT = DOWN.rotate(3);

  LEFT.img = images.LEFT;
  UP.img = images.UP;
  RIGHT.img = images.RIGHT;

  const options = [BLANK, DOWN, LEFT, UP, RIGHT];
  grid = new Grid(GRID_SIZE, GRID_SIZE, options);
  grid.resetCallback = () => drawGrid(grid);

  createCanvas(innerWidth, innerHeight);
  fill("black");
  stroke("white");
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
