const bingusProportion = 0.4;
const damping = 2.5; // damping factor for oscillation
const stretchSpeed = 30; // frequency of oscillation

let grabCoords;
let originalStretchT;

let stretch; // <1 if squish, >1 if stretch, 1 if normal
let stretchAmplitude; // starting amplitude / height of release
let stretchStartTime = 0; // time of releasing bingus

let normalDim;
let pos;

let bingusScale = 1;

let bingusImage;

function preload() {
  bingusImage = loadImage("assets/bingus.png");
}

function getBingusScaleAndPos() {
  bingusScale = (windowHeight / normalDim.y) * bingusProportion;
  pos = {
    x: (windowWidth - normalDim.x * bingusScale) / 2,
    y: (2 * (windowHeight - normalDim.y * bingusScale)) / 3,
  };
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  getBingusScaleAndPos();
}

function setup() {
  // set up canvas
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("container");

  colorMode(RGB, 255, 255, 255);

  rectMode(CORNER);
  frameRate(60);

  stretch = 1;
  grabCoords = null;
  stretchAmplitude = 0;

  normalDim = { x: bingusImage.width, y: bingusImage.height };
  getBingusScaleAndPos();
}

function update() {
  if (mouseIsPressed) {
    if (grabCoords == null) {
      grabCoords = { x: mouseX, y: mouseY };
      originalStretchT = stretch;
    }

    // calculate stretchT from distance from grab to mouse
    let dist = grabCoords.y - mouseY;
    let t = constrain(
      -PI * (originalStretchT + dist / 1000.0),
      (-3 * PI) / 2,
      -PI / 2
    );
    stretch = (1 + sin(t)) * (0.8 / 2) + 0.6;
    stretch = constrain(stretch, 0.6, 1.4);
  }

  if (!mouseIsPressed) {
    // if i just let go
    if (grabCoords != null) {
      grabCoords = null;
      originalStretchT = 1;

      // set amplitude and startTime for oscillations
      stretchAmplitude = stretch - 1;
      stretchStartTime = frameCount;
    }

    // calculate stretch amount
    let seconds = (frameCount - stretchStartTime) / 60.0;
    stretch =
      1 +
      stretchAmplitude * exp(-damping * seconds) * cos(stretchSpeed * seconds);
  }
}

function draw() {
  update();

  background(255); // white background

  push();
  translate(pos.x, pos.y);
  scale(bingusScale);
  translate(normalDim.x / 2, normalDim.y);
  scale(lerp(1 / stretch, 1, 0.3), stretch);
  translate(-normalDim.x / 2, -normalDim.y);
  image(bingusImage, 0, 0);
  pop();
}
