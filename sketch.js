/* == VARIABLES == */
const GRID_SCALE = 1 / 3; // 1/3 is in deployment
const SHOW_DRAW = true;
let images;
let waveFunction;

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
    imgs.push(loadImage(`tiles/${folder}/${i}.png`));
  }

  return imgs;
};

/* == MAIN FUNCTIONS == */
function preload() {
  images = loadAllImages("circuit-joe", 18);

  // images = loadAllImages("demo", 2);
  // images = loadAllImages("polka", 2);
  // images = loadAllImages("roads", 2);
  // images = loadAllImages("train-tracks", 2); // works with full edge
  // images = loadAllImages("circuit", 13);
  // images = loadAllImages("circuit-coding-train", 13);
  // images = loadAllImages("test/mountains", 2);
  // images = loadAllImages("test/pipes", 2);
  // images = loadAllImages("test/rail", 7);
  // images = loadAllImages("test/circuit-3", 17);
}

function setup() {
  Tile.fullEdgeDetection = false;
  Cell.resetCallback = (cell) => drawCell(cell);
  Cell.createOptions(images);

  waveFunction = new Grid(
    floor(width * GRID_SCALE),
    floor(height * GRID_SCALE)
  );

  createCanvas(innerWidth, innerHeight);
  fill("black");
  background("black");
  noStroke();
}

function draw() {
  if (SHOW_DRAW) {
    const newCell = waveFunction.observe();

    drawCell(newCell);
    Object.values(newCell.neighbors).forEach((cell) => drawCell(cell));

    if (waveFunction.collapsed) noLoop();
  } else {
    waveFunction.collapse();
    waveFunction.cells.forEach((cell) => drawCell(cell));
    noLoop();
  }
}
