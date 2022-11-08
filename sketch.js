const GRID_SIZE = 10;
// const path = "tiles/demo/";
const path = "tiles/circuit/";
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
    BLANK_DARK_GRAY: loadImage(path + "0.png"),
    BLANK_GREEN: loadImage(path + "1.png"),
    POINT_GREEN: loadImage(path + "2.png"),
    STRAIGHT_GRAY: loadImage(path + "3.png"),
    //
    STRAIGHT_GREEN: loadImage(path + "6.png"),
    GRAY_O_GREEN: loadImage(path + "7.png"),
    GRAY_TO_GREEN: loadImage(path + "8.png"),
    JOINT_GREEN: loadImage(path + "9.png"),
    GREEN_D_ANGLE: loadImage(path + "10.png"),
    GREEN_S_ANGLE: loadImage(path + "11.png"),
    STRAIGHT_G_P: loadImage(path + "12.png"),
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

  // Dark Gray: 0
  // Dark Green: 1
  // Light Green: 2
  // Light Gray: 3

  Cell.options.push(new Tile(images.BLANK_DARK_GRAY, ["0", "0", "0", "0"]));
  Cell.options.push(new Tile(images.BLANK_GREEN, ["1", "1", "1", "1"]));

  const POINT_GREEN = new Tile(images.POINT_GREEN, ["1", "2", "1", "1"]);
  Cell.options.push(POINT_GREEN);
  Cell.options.push(POINT_GREEN.rotate(1));
  Cell.options.push(POINT_GREEN.rotate(2));
  Cell.options.push(POINT_GREEN.rotate(3));

  const STRAIGHT_GRAY = new Tile(images.STRAIGHT_GRAY, ["0", "3", "0", "3"]);
  Cell.options.push(STRAIGHT_GRAY);
  Cell.options.push(STRAIGHT_GRAY.rotate(1));

  const STRAIGHT_GREEN = new Tile(images.STRAIGHT_GREEN, ["1", "2", "1", "2"]);
  Cell.options.push(STRAIGHT_GREEN);
  Cell.options.push(STRAIGHT_GREEN.rotate(1));

  const GRAY_O_GREEN = new Tile(images.GRAY_O_GREEN, ["3", "2", "3", "2"]);
  Cell.options.push(GRAY_O_GREEN);
  Cell.options.push(GRAY_O_GREEN.rotate(1));

  const GRAY_TO_GREEN = new Tile(images.GRAY_TO_GREEN, ["3", "1", "2", "1"]);
  Cell.options.push(GRAY_TO_GREEN);
  Cell.options.push(GRAY_TO_GREEN.rotate(1));

  const GREEN_D_ANGLE = new Tile(images.GREEN_D_ANGLE, ["2", "2", "2", "2"]);
  Cell.options.push(GREEN_D_ANGLE);
  Cell.options.push(GREEN_D_ANGLE.rotate(1));

  const GREEN_S_ANGLE = new Tile(images.GREEN_S_ANGLE, ["2", "2", "1", "1"]);
  Cell.options.push(GREEN_S_ANGLE);
  Cell.options.push(GREEN_S_ANGLE.rotate(1));

  const STRAIGHT_G_P = new Tile(images.STRAIGHT_G_P, ["1", "2", "1", "2"]);
  Cell.options.push(STRAIGHT_G_P);
  Cell.options.push(STRAIGHT_G_P.rotate(1));

  const JOINT_GREEN = new Tile(images.JOINT_GREEN, ["2", "2", "1", "2"]);
  Cell.options.push(JOINT_GREEN);
  Cell.options.push(JOINT_GREEN.rotate(1));
  Cell.options.push(JOINT_GREEN.rotate(2));
  Cell.options.push(JOINT_GREEN.rotate(3));

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
