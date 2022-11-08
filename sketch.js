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

  const img = cell.state?.img;
  const pos = [cell.x * w, cell.y * h];
  const size = [w, h];

  img ? image(img, ...pos, ...size) : rect(...pos, ...size);
}

function preload() {
  images = {
    BLANK: loadImage(path + "blank.png"),
    DOWN: loadImage(path + "down.png"),
  };
}

function setup() {
  Tile.rotateImage = (img, amount) => {
    const w = img.width;
    const h = img.height;

    const newImg = createGraphics(w, h);

    newImg.imageMode(CENTER);
    newImg.translate(w / 2, h / 2);
    newImg.rotate(HALF_PI * amount);
    newImg.image(img, 0, 0);

    return newImg;
  };

  const BLANK = new Tile(images.BLANK, ["0", "0", "0", "0"]);

  const DOWN = new Tile(images.DOWN, ["0", "1", "1", "1"]);
  const LEFT = DOWN.rotate(1);
  const UP = DOWN.rotate(2);
  const RIGHT = DOWN.rotate(3);

  const options = [BLANK, DOWN, LEFT, UP, RIGHT];
  grid = new Grid(GRID_SIZE, GRID_SIZE, options);
  grid.resetCallback = () => drawGrid(grid);

  createCanvas(innerWidth, innerHeight);
  fill("black");
  stroke("white");
  drawGrid(grid);
}

function draw() {
  const newCell = grid.next();
  drawCell(newCell);

  if (grid.finished) noLoop();
}
