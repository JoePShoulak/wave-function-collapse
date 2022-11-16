const frame = document.getElementById("demo-iframe");

function loadSketch(page) {
  frame.src = `wfc/${page}.html`;
}

const buttons = document
  .getElementsByClassName("sketch-button")
  .forEach((element) => {
    element.addEventListener("click", () => loadSketch(element.id));
  });
