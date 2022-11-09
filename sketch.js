/* == VARIABLES == */
const GRID_SIZE = 40; // 40 looks good deployed
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

const loadAllImages = (folder, number) => {
  const imgs = [];

  for (let i = 0; i < number; i++) {
    imgs.push(loadImage(`tiles/${folder}/${i}.png`));
  }

  return imgs;
};

/* == MAIN FUNCTIONS == */
function preload() {
  // imgs = loadAllImages("demo", 2);
  // imgs = loadAllImages("polka", 2);
  // imgs = loadAllImages("roads", 2);
  imgs = loadAllImages("circuit", 13);
  // imgs = loadAllImages("circuit-coding-train", 13);
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
