const frame = document.getElementById("demo-iframe");

function loadSketch(page) {
  frame.src = `wfc/${page}.html`;
}

const collection = document.getElementsByClassName("sketch-button");
const buttons = Array.prototype.slice.call(collection, 0);

buttons.forEach((element) => {
  element.addEventListener("click", () => loadSketch(element.id));
});
