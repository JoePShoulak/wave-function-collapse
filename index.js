const demoDiv = document.getElementById("demo");
const circuitButton = document.getElementById("circuit");

function loadScript(tileset) {
  const script = document.createElement("script");
  script.src = "scripts/demo.js";
  script.type = "text/javascript";
  script.setAttribute("tileset", tileset);
  demoDiv.appendChild(script);
}

loadScript("circuit");

// circuitButton.addEventListener("click", () => loadScript("circuit"));
