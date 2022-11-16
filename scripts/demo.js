const tileset = document.currentScript.getAttribute("tileset");

const parent = document.querySelector("main");
let width = parent.clientWidth;
let height = parent.clientHeight;

const tilesetDict = {
  "circuit-joe": { mode: "complex", length: 19 },
  circuit: { mode: "simple", length: 13 },
  lines: { mode: "simple", length: 2 },
  polka: { mode: "simple", length: 2 },
  roads: { mode: "simple", length: 2 },
  "train-tracks": { mode: "complex", length: 2 },
  "circuit-coding-train": { mode: "simple", length: 13 },
  "circuit-custom": { mode: "complex", length: 17 },
};

/* == VARIABLES == */
const GRID_SCALE = 1 / 40; // 1/3 is in deployment
const SHOW_DRAW = true;
const LOOP_DELAY = 10 * 1000; // ms
const mode = tilesetDict[tileset].mode;
let images;
let waveFunction;

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

function rotateImg(img, amount) {
  const w = img.width;
  const h = img.height;

  const newImg = createGraphics(w, h);

  newImg.imageMode(CENTER);
  newImg.translate(w / 2, h / 2);
  newImg.rotate(HALF_PI * amount);
  newImg.image(img, 0, 0);

  return new Tile(newImg);
}

/* == MAIN FUNCTIONS == */
function windowResized() {
  width = parent.clientWidth;
  height = parent.clientHeight;
  loop();
  setup();
}

function reset() {
  if (isLooping()) return;

  background("black");
  waveFunction.reset();
  loop();
}

function preload() {
  const length = tilesetDict[tileset].length;
  images = loadAllImages(tileset, length);
}

function setup() {
  Tile.rotateImg = rotateImg;
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

function draw() {
  if (SHOW_DRAW) {
    if (!waveFunction.collapsed) {
      const newCell = waveFunction.observe();
      drawCell(newCell);
    } else {
      setTimeout(reset, LOOP_DELAY);
      noLoop();
    }
  } else {
    waveFunction.collapse();
    waveFunction.cells.forEach((cell) => drawCell(cell));
    noLoop();
  }
}
