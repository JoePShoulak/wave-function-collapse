const GRID_SIZE = 20;
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

  // Dark Green: 0
  // Dark Gray: 1
  // Light Green: 2
  // Light Gray: 3
  // These are the edges for the tiles, in order, matching the image names by index
  const edges = [
    ["111", "111", "111", "111"],
    ["000", "000", "000", "000"],
    ["000", "020", "000", "000"],
    ["000", "030", "000", "030"],
    ["100", "020", "001", "111"],
    ["100", "000", "000", "001"],
    ["000", "020", "000", "020"],
    ["030", "020", "030", "020"],
    ["030", "000", "020", "000"],
    ["020", "020", "000", "020"],
    ["020", "020", "020", "020"],
    ["020", "020", "000", "000"],
    ["000", "020", "000", "020"],
  ];

  const tiles = [];

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
  const newCell = grid.advance();
  drawCell(newCell);

  if (grid.finished) noLoop();
}
