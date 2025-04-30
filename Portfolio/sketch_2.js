let hookSize = 20;
let fish = [];
let resetTimer = 0;
let dispersing = false;
let caughtCount = 0;
let showMessage = true;;

function setup() {
  createCanvas(windowWidth, windowHeight - (document.querySelector('nav').offsetHeight));
  createFish();
}

function draw() {
  background(0, 150, 255); // Water blue

  // Fishing line and hook (only show if not dispersing)
  if (!dispersing) {
    stroke(255);
    line(mouseX, 0, mouseX, mouseY);

    fill(200);
    noStroke();
    ellipse(mouseX, mouseY, hookSize, hookSize / 2);
  }

  // Move and draw fish
  caughtCount = 0; // Reset before counting
  for (let f of fish) {
    f.move();
    f.display();

    if (!dispersing) {
      let d = dist(mouseX, mouseY, f.x, f.y);
      if (d < hookSize / 2 + f.size / 2 && !f.caught) {
        f.caught = true;
      }

      if (f.caught) {
        f.x = mouseX;
        f.y = mouseY + 20;
        showMessage = false
        caughtCount++;
      }

      
    }
  }

  if (showMessage) {
    fill(255, 255, 0);
    noStroke();
    textSize(75);
    textAlign(LEFT, BOTTOM);
    text("Click to release fish!", 27, height - 10); 
  } else {
    // Draw caught fish counter
    fill(255, 255, 0);
    noStroke();
    textSize(125);
    textAlign(LEFT, BOTTOM);
    text(`${caughtCount}`, 27, height - 10);
  }

  // If dispersing, count down to reset
  if (resetTimer > 0) {
    resetTimer--;
    if (resetTimer === 0) {
      dispersing = false;
      createFish();
    }
  }
}

function createFish() {
  fish = [];
  for (let i = 0; i < 10; i++) {
    fish.push(new Fish());
  }
}

function mousePressed() {
  if (mouseButton === LEFT && !dispersing) {
    disperseFish();
    dispersing = true;
    resetTimer = 120; // 2 seconds
  }
}

function disperseFish() {
  for (let f of fish) {
    f.caught = false;
    f.dir = random([-1, 1]);
    f.speed = random(5, 8);
    f.x = random(width);
    f.y = random(height);
  }
}

class Fish {
  constructor() {
    this.x = random(50, width - 50);
    this.y = random(100, height - 30);
    this.size = random(20, 30);
    this.speed = random(1, 2);
    this.dir = random([-1, 1]);
    this.caught = false;
    this.color = color(random(200), random(200), random(200));
  }

  move() {
    if (!this.caught) {
      this.x += this.speed * this.dir;
      if (this.x > width - 30 || this.x < 30) {
        this.dir *= -1;
      }
    }
  }

  display() {
    fill(this.color);
    ellipse(this.x, this.y, this.size * 1.5, this.size);
    triangle(
      this.x - this.size * 0.8 * this.dir,
      this.y,
      this.x - this.size * 1.5 * this.dir,
      this.y - this.size / 2,
      this.x - this.size * 1.5 * this.dir,
      this.y + this.size / 2
    );
  }
}