const tileset = document.currentScript.getAttribute("tileset");

const tilesetLengths = {
  "circuit-joe": 19,
  circuit: 13,
  demo: 2,
  polka: 2,
  roads: 2,
  "train-tracks": 2, // works with full edge
  "circuit-coding-train": 13,
  "test/mountains": 2,
  "test/pipes": 2,
  "test/rail": 7,
  "test/circuit-3": 17,
};

/* == VARIABLES == */
const GRID_SCALE = 1 / 40; // 1/3 is in deployment
const SHOW_DRAW = true;
const LOOP_DELAY = 10 * 1000; // ms
let images;
let waveFunction;

/* == HELPER FUNCTION == */
function drawCell(cell) {
  const w = width / waveFunction.width;
  const h = height / waveFunction.height;

  const img = cell.state?.img;
  const pos = [cell.x * w, cell.y * h];
  const size = [w, h];

  img ? image(img, ...pos, ...size) : rect(...pos, ...size);
}

const loadAllImages = (folder, number) => {
  const imgs = [];

  for (let i = 0; i < number; i++) {
    imgs.push(loadImage(`../tiles/${folder}/${i}.png`));
  }

  return imgs;
};

/* == MAIN FUNCTIONS == */

function preload() {
  const length = tilesetLengths[tileset];
  images = loadAllImages(tileset, length);
}

function setup() {
  Tile.fullEdgeDetection = false;
  Cell.resetCallback = (cell) => drawCell(cell);
  Cell.createOptions(images);

  waveFunction = new Grid(
    floor(innerWidth * GRID_SCALE),
    floor(innerHeight * GRID_SCALE)
  );

  createCanvas(innerWidth, innerHeight);
  fill("black");
  background("black");
  noStroke();
  loop();
}

function draw() {
  if (SHOW_DRAW) {
    if (!waveFunction.collapsed) {
      const newCell = waveFunction.observe();

      drawCell(newCell);
      Object.values(newCell.neighbors).forEach((cell) => drawCell(cell));
    } else {
      setTimeout(setup, LOOP_DELAY);
      noLoop();
    }
  } else {
    waveFunction.collapse();
    waveFunction.cells.forEach((cell) => drawCell(cell));
    noLoop();
  }
}
