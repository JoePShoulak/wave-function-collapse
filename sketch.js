/* == VARIABLES == */
const GRID_SIZE = 40; // 20 solves rather easily
const tiles = [];
let imgs;
let grid;

function drawCell(cell) {
  const w = width / grid.width;
  const h = height / grid.height;

  const img = cell.state?.img;
  const pos = [cell.x * w, cell.y * h];
  const size = [w, h];

  img ? image(img, ...pos, ...size) : rect(...pos, ...size);
}

/* == MAIN FUNCTIONS == */
function preload() {
  const path = "tiles/circuit/";

  imgs = [
    // Circuit
    loadImage(path + "0.png"),
    loadImage(path + "1.png"),
    loadImage(path + "2.png"),
    loadImage(path + "3.png"),
    loadImage(path + "4.png"),
    loadImage(path + "5.png"),
    loadImage(path + "6.png"),
    loadImage(path + "7.png"),
    loadImage(path + "8.png"),
    loadImage(path + "9.png"),
    loadImage(path + "10.png"),
    loadImage(path + "11.png"),
    loadImage(path + "12.png"),

    // Demo
    // loadImage(path + "blank.png"),
    // loadImage(path + "up.png"),
  ];
}

function setup() {
  imgs
    .map((img) => new Tile(img))
    .forEach((tile) => {
      tile.allRotations().forEach((rot) => Cell.options.push(rot));
    });

  grid = new Grid(GRID_SIZE, GRID_SIZE);

  createCanvas(innerWidth, innerHeight);
  fill("black");
  background("black");
  noStroke();
  frameRate(60);
}

function draw() {
  const newCell = grid.advance();
  drawCell(newCell);
  Object.values(newCell.neighbors).forEach((cell) => drawCell(cell));

  if (grid.finished) {
    noLoop();
  }
}
