const demoDiv = document.getElementById("demo");
const circuitButton = document.getElementById("circuit");
const circuitModButton = document.getElementById("circuit-modified");

function loadScript(tileset) {
  while (demoDiv.firstChild) demoDiv.removeChild(demoDiv.firstChild);

  const script = document.createElement("script");
  script.src = "scripts/demo.js";
  script.type = "text/javascript";
  script.setAttribute("tileset", tileset);
  demoDiv.appendChild(script);
}

circuitButton.addEventListener("click", () => loadScript("circuit"));
circuitModButton.addEventListener("click", () => loadScript("circuit-joe"));
