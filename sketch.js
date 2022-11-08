const GRID_SIZE = 40;
const path = "tiles/demo/";
let images;
let grid;

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
  Cell.options.push(BLANK);

  const DOWN = new Tile(images.DOWN, ["0", "1", "1", "1"]);
  Cell.options.push(DOWN);
  Cell.options.push(DOWN.rotate(1));
  Cell.options.push(DOWN.rotate(2));
  Cell.options.push(DOWN.rotate(3));

  grid = new Grid(GRID_SIZE, GRID_SIZE);
  grid.resetCallback = (g) => drawGrid(g);

  createCanvas(innerWidth, innerHeight);
  fill("black");
  stroke("white");
  drawGrid(grid);
}

function draw() {
  const newCell = grid.advance();
  drawCell(newCell);

  if (grid.finished) noLoop();
}
