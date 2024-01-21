let particles = [];
let message = "APL INNOVATION LAB";
let currentState = "legible";
let lastStateChangeTime = 0;
let myFont;

function preload() {
  myFont = loadFont('Roboto-Black.ttf');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textSize(30);
  textFont(myFont);
  textAlign(CENTER, CENTER);
  fill(0);

  // Center the message on the canvas
  let x = (width - textWidth(message)) / 2;
  let y = height / 2;

  // Create a particle for each letter in the message
  for (let i = 0; i < message.length; i++) {
    if (message[i] !== ' ') {
      let letterWidth = textWidth(message[i]);
      let letterX = x + textWidth(message.substring(0, i)) + letterWidth / 2;
      particles.push(new Particle(letterX, y, message[i]));
    }
  }

  lastStateChangeTime = millis();
  frameRate(30); // Set the frame rate to 30 fps
}

function draw() {
  background(255);

  let currentTime = millis();
  // Update the current state based on the time elapsed
  if (currentState === "legible" && currentTime - lastStateChangeTime > 2000) {
    currentState = "scattering";
    lastStateChangeTime = currentTime;
  } else if (currentState === "scattering" && currentTime - lastStateChangeTime > 5000) {
    currentState = "returning";
    lastStateChangeTime = currentTime;
  } else if (currentState === "returning" && currentTime - lastStateChangeTime > 5000) {
    currentState = "settled";
    lastStateChangeTime = currentTime;
  } else if (currentState === "settled" && currentTime - lastStateChangeTime > 2000) {
    currentState = "scattering";
    lastStateChangeTime = currentTime;
  }

  // Update and display particles
  for (let particle of particles) {
    if (currentState === "scattering") {
      particle.scatter();
    } else if (currentState === "returning") {
      particle.returnHome();
    }
    particle.update();
    particle.updateColor(); // Update the color of the particle
    particle.show();
  }

  lastState = currentState; // Track the last state
}

class Particle {
  constructor(x, y, letter) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D();
    this.letter = letter;
    this.home = createVector(x, y);
    this.startColor = color(random(255), random(255), random(255));
    this.endColor = color(random(255), random(255), random(255));
    this.color = this.startColor;
    this.colorInterp = 0;
    this.isSolid = true; // Toggle between solid and outline
    this.scatteringSpeed = random(3, 4); // Increase scattering speed
  }

  scatter() {
    // Apply a random velocity if the particle is not already moving fast
    if (this.vel.mag() < this.scatteringSpeed) {
      this.vel.add(p5.Vector.random2D().mult(this.scatteringSpeed)).limit(this.scatteringSpeed);
    }

    // Check for collision with walls
    if (this.pos.x <= 0 || this.pos.x >= width) {
      this.vel.x *= -0.95; // Reverse and dampen the horizontal velocity
      this.vel.rotate(random(-PI / 4, PI / 4)); // Slight change in direction
      this.toggleStyle();
    }
    if (this.pos.y <= 0 || this.pos.y >= height) {
      this.vel.y *= -0.95; // Reverse and dampen the vertical velocity
      this.vel.rotate(random(-PI / 4, PI / 4)); // Slight change in direction
      this.toggleStyle();
    }
  }

  returnHome() {
    let force = p5.Vector.sub(this.home, this.pos);
    let d = force.mag(); // Distance to home
    let speed = map(d, 0, 100, 0, 5); // Slow down as it gets closer
    force.setMag(speed);
    this.vel.lerp(force, 0.1); // Smoothly interpolate the velocity
  }

  update() {
    this.pos.add(this.vel);
  }

  updateColor() {
    this.colorInterp += 0.01;
    if (this.colorInterp > 1) {
      this.colorInterp = 0;
      let tempColor = this.startColor;
      this.startColor = this.endColor;
this.endColor = tempColor;
}
this.color = lerpColor(this.startColor, this.endColor, this.colorInterp);
}

toggleStyle() {
this.isSolid = !this.isSolid;
}

show() {
if (this.isSolid) {
fill(this.color);
noStroke();
} else {
noFill();
stroke(this.color);
strokeWeight(2);
}
text(this.letter, this.pos.x, this.pos.y);
}
}

// Prevent default browser behavior
function keyPressed() {
return false;
}

function keyReleased() {
return false;
}
