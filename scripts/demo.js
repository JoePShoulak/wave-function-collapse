const tileset = document.currentScript.getAttribute("tileset");
const parent = document.querySelector("main");

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
let images;
let waveFunction;
let width;
let height;

/* == HELPER FUNCTION == */
const cellAndNeighbors = (cell) => [cell, ...Object.values(cell.neighbors)];

function drawCell(cell) {
  const w = width / waveFunction.width;
  const h = height / waveFunction.height;

  cellAndNeighbors(cell).forEach((cell) => {
    const img = cell.state?.img;
    const pos = [cell.x * w, cell.y * h];
    const size = [w, h];

    img ? image(img, ...pos, ...size) : rect(...pos, ...size);
  });
}

const loadAllImages = (folder, number) => {
  const imgs = [...Array(number).keys()];

  return imgs.map((i) => loadImage(`../tiles/${folder}/${i}.png`));
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
  setup();
}

function reset() {
  noLoop();
  setTimeout(() => {
    if (isLooping()) return;

    waveFunction.reset();
    background("black");
    loop();
  }, LOOP_DELAY);
}

function preload() {
  images = loadAllImages(tileset, tilesetDict[tileset].length);
}

function setup() {
  width = parent.clientWidth;
  height = parent.clientHeight;
  const gridSize = [width, height].map((n) => floor(n * GRID_SCALE));

  Tile.rotateImg = rotateImg;
  Tile.fullEdgeDetection = tilesetDict[tileset].mode == "complex";
  Cell.resetCallback = (cell) => drawCell(cell);
  Cell.setOptions(images);

  createCanvas(width, height);
  fill("black");
  background("black");
  noStroke();
  loop();

  waveFunction = new Grid(...gridSize);
}

function draw() {
  if (SHOW_DRAW) {
    waveFunction.collapsed ? reset() : drawCell(waveFunction.observe());
  } else {
    waveFunction.collapse();
    waveFunction.cells.forEach((cell) => drawCell(cell));
    noLoop();
  }
}
