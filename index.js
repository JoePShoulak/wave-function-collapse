const buttons = Array.from(document.getElementsByClassName("sketch-button"));
const frame = document.getElementById("demo");

const updateFrame = (e) => (frame.src = `demo/${e.target.id}.html`);

buttons.forEach((btn) => btn.addEventListener("click", updateFrame));
