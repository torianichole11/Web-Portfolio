let fireworks = [];

function setup() {
  createCanvas(windowWidth, windowHeight - (document.querySelector('nav').offsetHeight));
  noStroke();
  explosionSound = loadSound('explosion.wav');
}

function draw() {
  background(0);

  // Draw and update fireworks
  for (let i = fireworks.length - 1; i >= 0; i--) {
    fireworks[i].update();
    fireworks[i].display();

    // Remove fireworks that have finished
    if (fireworks[i].isDone()) {
      fireworks.splice(i, 1);
    }
  }
}

function mousePressed() {
  // When the user taps, create a new firework at the mouse position
  let firework = new Firework(mouseX, mouseY);
  fireworks.push(firework);
}

class Firework {
  constructor(x, y) {
    this.origin = createVector(x, y);  // Starting position
    this.position = this.origin.copy();
    this.velocity = createVector(random(-3, 3), random(-5, -10));  // Initial velocity
    this.acceleration = createVector(0, 0.05);  // Gravity effect
    this.life = 255;  // Transparency fades with time
    this.exploded = false;
    this.particles = [];
  }

  update() {
    if (!this.exploded) {
      this.velocity.add(this.acceleration);  // Add gravity to velocity
      this.position.add(this.velocity);  // Update position

      // If the firework reaches its peak, explode
      if (this.velocity.y >= 0) {
        this.explode();
      }
    }

    // Update particles if exploded
    for (let i = this.particles.length - 1; i >= 0; i--) {
      this.particles[i].update();
      this.particles[i].display();

      // Remove particles that are no longer visible
      if (this.particles[i].isDone()) {
        this.particles.splice(i, 1);
      }
    }
  }

  display() {
    if (!this.exploded) {
      fill(255, this.life);
      ellipse(this.position.x, this.position.y, 10, 10);
    }
  }

  explode() {
    this.exploded = true;
    explosionSound.play();
    // Generate particles that will form the explosion
    for (let i = 0; i < 100; i++) {
      this.particles.push(new Particle(this.position.x, this.position.y));
    }
  }

  isDone() {
    return this.life < 0 && this.particles.length === 0;
  }
}

class Particle {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.velocity = createVector(random(-2, 2), random(-5, 0));
    this.acceleration = createVector(0, 0.1);  // Gravity for particles
    this.life = 255;
    this.color = color(random(255), random(255), random(255));
  }

  update() {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.life -= 4;  // Fade effect
  }

  display() {
    fill(this.color.levels[0], this.color.levels[1], this.color.levels[2], this.life);
    noStroke();
    ellipse(this.position.x, this.position.y, 10, 10);
  }

  isDone() {
    return this.life < 0;
  }
}