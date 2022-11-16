const frame = document.getElementById("demo-iframe");

const loadSketch = (page) => (frame.src = `wfc/${page}.html`);

const buttons = document.getElementsByClassName("sketch-button");

Array.from(buttons).forEach((btn) => {
  btn.addEventListener("click", () => loadSketch(btn.id));
});
