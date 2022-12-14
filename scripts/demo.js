/* == VARIABLES == */
const tileset = document.currentScript.getAttribute("tileset");
const parent = document.querySelector("main");
const GRID_SCALE = 1 / 40; // 1/3 is in deployment
const SHOW_DRAW = true;
const LOOP_DELAY = 10 * 1000; // ms
let images;
let waveFunction;
let width;
let height;

const tilesetDict = {
  "circuit-joe": { complex: true, length: 19 },
  circuit: { complex: false, length: 13 },
  lines: { complex: false, length: 2 },
  polka: { complex: false, length: 2 },
  roads: { complex: false, length: 2 },
  "train-tracks": { complex: true, length: 2 },
  "circuit-coding-train": { complex: false, length: 13 },
  "circuit-custom": { complex: true, length: 17 },
};

/* == HELPER FUNCTIONS == */
const cellAndNeighbors = (cell) => [cell, ...Object.values(cell.neighbors)];

function drawCell(cell) {
  const w = width / waveFunction.width;
  const h = height / waveFunction.height;

  cellAndNeighbors(cell).forEach((cell) => {
    const img = cell.state?.img;
    const pos = [cell.x * w, cell.y * h];

    img ? image(img, ...pos, w, h) : rect(...pos, w, h);
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
  Tile.fullEdgeDetection = tilesetDict[tileset].complex;
  Cell.resetCallback = (cell) => drawCell(cell);
  Cell.setOptions(images);
  waveFunction = new Grid(...gridSize);

  createCanvas(width, height);
  fill("black");
  background("black");
  noStroke();
  loop();
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
