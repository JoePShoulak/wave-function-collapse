const buttons = Array.from(document.getElementsByClassName("sketch-button"));
const frame = document.getElementById("demo-iframe");

const loadSketch = (e) => (frame.src = `wfc/${e.target.id}.html`);

buttons.forEach((btn) => btn.addEventListener("click", loadSketch));
