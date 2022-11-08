const path = "/tiles/demo/";
let tiles;
let grid;
const GRID_SIZE = 50;

function preload() {
  tiles = {
    BLANK: loadImage(path + "blank.png"),
    UP: loadImage(path + "up.png"),
    DOWN: loadImage(path + "down.png"),
    LEFT: loadImage(path + "left.png"),
    RIGHT: loadImage(path + "right.png"),
  };
}

function drawGrid(grid) {
  grid.cells.forEach((cell) => {
    const w = width / grid.width;
    const h = height / grid.height;

    if (cell.state) {
      let value = cell.state.value;
      if (value == "BLANK") {
        image(tiles.BLANK, cell.x * w, cell.y * h, w, h);
      } else {
        // const img = tiles.DOWN;
        // const newImg = createGraphics(w, h);
        // newImg.imageMode(CENTER);
        // newImg.translate(w, h);
        // newImg.rotate(HALF_PI * cell.state.rotation);
        // newImg.image(img, w / 2, h / 2);
        // image(newImg, cell.x * w, cell.y * h, w, h);
        image(tiles[value], cell.x * w, cell.y * h, w, h);
      }
    } else {
      fill("black");
      stroke("white");
      rect(cell.x * w, cell.y * h, w, h);
    }
  });
}

const options = [];

options.push(new Tile("BLANK", [0, 0, 0, 0]));
options.push(new Tile("UP", [0, 0, 0, 0]));
options.push(new Tile("DOWN", [0, 0, 0, 0]));
options.push(new Tile("LEFT", [0, 0, 0, 0]));
options.push(new Tile("RIGHT", [0, 0, 0, 0]));

function setup() {
  createCanvas(innerWidth, innerHeight);

  grid = new Grid(GRID_SIZE, GRID_SIZE);
}

function draw() {
  background(80);

  const next = grid.oneUncollapsed;
  if (next) next.collapse();
  drawGrid(grid);
}
