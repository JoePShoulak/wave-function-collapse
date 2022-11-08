const GRID_SIZE = 20;
// const path = "tiles/demo/";
const path = "tiles/circuit/";
let imgs;
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
  imgs = {
    BLANK_DARK_GRAY: loadImage(path + "0.png"),
    BLANK_GREEN: loadImage(path + "1.png"),
    POINT_GREEN: loadImage(path + "2.png"),
    STRAIGHT_GRAY: loadImage(path + "3.png"),
    IC_TO_GREEN: loadImage(path + "4.png"),
    IC_CORNER: loadImage(path + "5.png"),
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

  const ops = Cell.options;

  // Dark Gray: 0
  // Dark Green: 1
  // Light Green: 2
  // Light Gray: 3

  ops.push(new Tile(imgs.BLANK_DARK_GRAY, ["000", "000", "000", "000"]));
  ops.push(new Tile(imgs.BLANK_GREEN, ["111", "111", "111", "111"]));

  const POINT_GREEN = new Tile(imgs.POINT_GREEN, ["111", "121", "111", "111"]);
  ops.push(POINT_GREEN);
  ops.push(POINT_GREEN.rotate(1));
  ops.push(POINT_GREEN.rotate(2));
  ops.push(POINT_GREEN.rotate(3));

  const STRAIGHT_GRAY = new Tile(imgs.STRAIGHT_GRAY, [
    "000",
    "131",
    "000",
    "131",
  ]);
  ops.push(STRAIGHT_GRAY);
  ops.push(STRAIGHT_GRAY.rotate(1));

  const IC_TO_GREEN = new Tile(imgs.IC_TO_GREEN, ["011", "121", "110", "000"]);
  ops.push(IC_TO_GREEN);
  ops.push(IC_TO_GREEN.rotate(1));
  ops.push(IC_TO_GREEN.rotate(2));
  ops.push(IC_TO_GREEN.rotate(3));

  const IC_CORNER = new Tile(imgs.IC_CORNER, ["011", "111", "111", "110"]);
  ops.push(IC_CORNER);
  ops.push(IC_CORNER.rotate(1));
  ops.push(IC_CORNER.rotate(2));
  ops.push(IC_CORNER.rotate(3));

  const STRAIGHT_GREEN = new Tile(imgs.STRAIGHT_GREEN, [
    "111",
    "121",
    "111",
    "121",
  ]);
  ops.push(STRAIGHT_GREEN);
  ops.push(STRAIGHT_GREEN.rotate(1));

  const GRAY_O_GREEN = new Tile(imgs.GRAY_O_GREEN, [
    "131",
    "121",
    "131",
    "121",
  ]);
  ops.push(GRAY_O_GREEN);
  ops.push(GRAY_O_GREEN.rotate(1));

  const GRAY_TO_GREEN = new Tile(imgs.GRAY_TO_GREEN, [
    "131",
    "111",
    "121",
    "111",
  ]);
  ops.push(GRAY_TO_GREEN);
  ops.push(GRAY_TO_GREEN.rotate(1));
  ops.push(GRAY_TO_GREEN.rotate(2));
  ops.push(GRAY_TO_GREEN.rotate(3));

  const GREEN_D_ANGLE = new Tile(imgs.GREEN_D_ANGLE, [
    "121",
    "121",
    "121",
    "121",
  ]);
  ops.push(GREEN_D_ANGLE);
  ops.push(GREEN_D_ANGLE.rotate(1));

  const GREEN_S_ANGLE = new Tile(imgs.GREEN_S_ANGLE, [
    "121",
    "121",
    "111",
    "111",
  ]);
  ops.push(GREEN_S_ANGLE);
  ops.push(GREEN_S_ANGLE.rotate(1));

  const STRAIGHT_G_P = new Tile(imgs.STRAIGHT_G_P, [
    "111",
    "121",
    "111",
    "121",
  ]);
  ops.push(STRAIGHT_G_P);
  ops.push(STRAIGHT_G_P.rotate(1));

  const JOINT_GREEN = new Tile(imgs.JOINT_GREEN, ["121", "121", "111", "121"]);
  ops.push(JOINT_GREEN);
  ops.push(JOINT_GREEN.rotate(1));
  ops.push(JOINT_GREEN.rotate(2));
  ops.push(JOINT_GREEN.rotate(3));

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
