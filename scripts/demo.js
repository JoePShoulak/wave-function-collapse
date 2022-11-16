var sketch = (p5) => {
  const tileset = document.currentScript.getAttribute("tileset");

  // const parent = document.querySelector("#demo");
  // const width = parent.clientWidth;
  // const height = parent.clientHeight;
  const width = 500;
  const height = 500;

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

      img ? p5.image(img, ...pos, ...size) : p5.rect(...pos, ...size);
    });
  }

  const loadAllImages = (folder, number) => {
    const imgs = [];

    for (let i = 0; i < number; i++) {
      imgs.push(p5.loadImage(`../tiles/${folder}/${i}.png`));
    }

    return imgs;
  };

  function rotateImg(img, amount) {
    const w = img.width;
    const h = img.height;

    const newImg = p5.createGraphics(w, h);

    newImg.imageMode(p5.CENTER);
    newImg.translate(w / 2, h / 2);
    newImg.rotate(p5.HALF_PI * amount);
    newImg.image(img, 0, 0);

    return new Tile(newImg);
  }

  /* == MAIN FUNCTIONS == */
  function reset() {
    p5.background("black");
    waveFunction.reset();
    p5.loop();
  }

  p5.preload = () => {
    const length = tilesetDict[tileset].length;
    images = loadAllImages(tileset, length);
  };

  p5.setup = () => {
    Tile.rotateImg = rotateImg;
    Tile.fullEdgeDetection = mode == "complex";
    Cell.resetCallback = (cell) => drawCell(cell);
    Cell.setOptions(images);

    const canvas = p5.createCanvas(width, height);
    canvas.parent("demo");
    p5.fill("black");
    p5.background("black");
    p5.noStroke();

    waveFunction = new Grid(
      p5.floor(width * GRID_SCALE),
      p5.floor(height * GRID_SCALE)
    );
  };

  p5.draw = () => {
    if (SHOW_DRAW) {
      if (!waveFunction.collapsed) {
        const newCell = waveFunction.observe();
        drawCell(newCell);
      } else {
        setTimeout(reset, LOOP_DELAY);
        p5.noLoop();
      }
    } else {
      waveFunction.collapse();
      waveFunction.cells.forEach((cell) => drawCell(cell));
      p5.noLoop();
    }
  };
};

if (myP5) {
  myP5.remove();
}
var myP5 = new p5(sketch);
