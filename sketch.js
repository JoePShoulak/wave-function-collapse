/* == VARIABLES == */
const GRID_SIZE = 30; // 20 solves rather easily
const path = "tiles/circuit/";
const tiles = [];
let imgs;
let grid;

// Dark Green (Blank): B
// Dark Gray (IC): I
// Light Green (Trace): T
// Light Gray (Wire): W
// These are the edges for the tiles, in order, matching the image names by index
const edges = [
  ["III", "III", "III", "III"], // 0
  ["BBB", "BBB", "BBB", "BBB"], // 1
  ["BBB", "BTB", "BBB", "BBB"], // 2
  ["BBB", "BWB", "BBB", "BWB"], // 3
  ["IBB", "BTB", "BBI", "III"], // 4
  ["IBB", "BBB", "BBB", "BBI"], // 5
  ["BBB", "BTB", "BBB", "BTB"], // 6
  ["BWB", "BTB", "BWB", "BTB"], // 7
  ["BWB", "BBB", "BTB", "BBB"], // 8
  ["BTB", "BTB", "BBB", "BTB"], // 9
  ["BTB", "BTB", "BTB", "BTB"], // 10
  ["BTB", "BTB", "BBB", "BBB"], // 11
  ["BBB", "BTB", "BBB", "BTB"], // 12
];

/* == HELPER FUNCTIONS == */
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

/* == MAIN FUNCTIONS == */
function preload() {
  imgs = [
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
  ];
}

function setup() {
  Tile.rotateImage = rotateImg;

  edges.forEach((edges, i) => tiles.push(new Tile(imgs[i], edges)));

  tiles.forEach((tile) => {
    tile.allRotations().forEach((rot) => Cell.options.push(rot));
  });

  grid = new Grid(GRID_SIZE, GRID_SIZE);
  grid.resetCallback = (g) => drawGrid(g);

  createCanvas(innerWidth, innerHeight);
  fill("black");
  stroke("white");
  drawGrid(grid);
}

function draw() {
  // This causes visual artifacts; redrawing whole screen instead
  // const newCell = grid.advance();
  // drawCell(newCell);

  grid.advance();
  drawGrid(grid);

  if (grid.finished) {
    noLoop();
  }
}
