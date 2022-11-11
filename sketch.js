const tileset = document.currentScript.getAttribute("tileset");
const mode = document.currentScript.getAttribute("mode");

const parent = document.querySelector("main");
const width = parent.clientWidth;
const height = parent.clientHeight;

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
  "circuit-custom": 17,
};

/* == VARIABLES == */
const GRID_SCALE = 1 / 40; // 1/3 is in deployment
const SHOW_DRAW = true;
const LOOP_DELAY = 10 * 1000; // ms

let images;
let waveFunction;
let waiting = false;

/* == HELPER FUNCTION == */
function drawCell(cell) {
  const w = width / waveFunction.width;
  const h = height / waveFunction.height;

  const cells = [cell, ...Object.values(cell.neighbors)];

  cells.forEach((cell) => {
    const img = cell.state?.img;
    const pos = [cell.x * w, cell.y * h];
    const size = [w, h];

    img ? image(img, ...pos, ...size) : rect(...pos, ...size);
  });
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
  Tile.fullEdgeDetection = mode == "complex";
  Cell.resetCallback = (cell) => drawCell(cell);
  Cell.setOptions(images);

  createCanvas(width, height);
  fill("black");
  background("black");
  noStroke();

  waveFunction = new Grid(
    floor(width * GRID_SCALE),
    floor(height * GRID_SCALE)
  );
}

function reset() {
  background("black");
  waveFunction.reset();
  waiting = false;
  loop();
}

function draw() {
  if (SHOW_DRAW) {
    if (!waveFunction.collapsed) {
      const newCell = waveFunction.observe();
      drawCell(newCell);
    } else {
      if (!waiting) {
        setTimeout(reset, LOOP_DELAY);
        waiting = true;
        noLoop();
      }
    }
  } else {
    waveFunction.collapse();
    waveFunction.cells.forEach((cell) => drawCell(cell));
    noLoop();
  }
}
