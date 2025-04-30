let capture;
let spacing = 10;
let t = 0; // Time variable for animation

function setup() {
  createCanvas(windowWidth, windowHeight - (document.querySelector('nav').offsetHeight));

  capture = createCapture(VIDEO);
  capture.size(width, height);
  capture.hide(); // Hide raw video feed
  rectMode(CENTER);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight - document.querySelector('nav').offsetHeight);
  capture.size(width, height);
}

function draw() {
  background(0);
  capture.loadPixels();

  for (let y = 0; y < capture.height; y += spacing) {
    for (let x = 0; x < capture.width; x += spacing) {
      let index = (x + y * capture.width) * 4;
      let r = capture.pixels[index];
      let g = capture.pixels[index + 1];
      let b = capture.pixels[index + 2];

      let brightness = (r + g + b) / 3;
      let len = map(brightness, 0, 255, spacing * 1.5, 0);

      // Wiggly animation using sine wave
      let wiggle = sin(t + (x + y) * 0.01) * 2;

      push();
      stroke(255);
      strokeWeight(1);
      translate(x + wiggle, y);
      line(-len / 2, 0, len / 2, 0);
      pop();
    }
  }

  t += 0.03; // Advance time for animation
}