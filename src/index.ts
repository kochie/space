import rocket from "./assets/rocket.png";
import exhaust from "./assets/exhaust.png";
import backgroundImage from "./assets/background.png";

interface Coords {
  x: number;
  y: number;
}

class Rocket {
  frames: number;
  scaleFactor: number;
  mouseCoords: Coords;
  scale: number;
  coords: Coords;
  speedScale: number;
  displacement: Coords;
  i: number;
  angle: number;
  ctx: CanvasRenderingContext2D;
  rocket: HTMLImageElement;
  exhaust: HTMLImageElement;
  spriteWidth: number;

  constructor(foreground: HTMLCanvasElement) {
    this.ctx = foreground.getContext("2d");
    this.frames = 13;
    this.scaleFactor = 200;
    this.mouseCoords = { x: 0, y: 0 };
    this.scale = 0.2;
    this.coords = { x: 0, y: 0 };
    this.speedScale = 0.02;
    this.i = 0;
    this.angle = 0;
    this.spriteWidth = 0;
    this.displacement = {
      x: this.mouseCoords.x - this.coords.x,
      y: this.mouseCoords.y - this.coords.y
    };

    this.rocket = new Image();
    this.rocket.src = rocket;

    this.exhaust = new Image();
    this.exhaust.src = exhaust;

    this.exhaust.onload = () => {
      this.spriteWidth = this.exhaust.width / this.frames;
      // resize();
      // window.requestAnimationFrame(animate);
      // const audio = new Audio("rocket_man.mp3");
      // audio.loop = true;
      // audio.play();
    };
  }

  updatePosition() {
    this.displacement = {
      x: this.mouseCoords.x - this.coords.x,
      y: this.mouseCoords.y - this.coords.y
    };

    const time = new Date();
    const t = ((2 * Math.PI) / 6000) * time.getTime();
    const q = 5 * Math.sin(t);
    const r = 5 * Math.cos(t) * Math.sin(t);
    let oldCoords = { ...this.coords };
    this.coords = {
      y:
        this.coords.y +
        this.displacement.y * this.speedScale +
        (1 - this.displacement.y / window.innerHeight) * r,
      x:
        this.coords.x +
        this.displacement.x * this.speedScale +
        (1 - this.displacement.x / window.innerWidth) * q
    };
    this.angle =
      Math.atan2(this.coords.y - oldCoords.y, this.coords.x - oldCoords.x) +
      Math.PI / 2;
  }

  redrawRocket() {
    const rocket_width = this.coords.x - this.rocket.width * this.scale * 0.5;
    const rocket_height = this.coords.y - this.rocket.height * this.scale * 0.5;

    this.ctx.save();
    this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    this.ctx.translate(this.coords.x, this.coords.y);
    this.ctx.rotate(this.angle);
    this.ctx.translate(-this.coords.x, -this.coords.y);
    this.ctx.drawImage(
      this.rocket,
      rocket_width,
      rocket_height,
      this.rocket.width * this.scale,
      this.rocket.height * this.scale
    );

    if (this.displacement.x ** 2 + this.displacement.y ** 2 > 90000) {
      this.ctx.translate(this.coords.x, this.coords.y);
      this.ctx.rotate(Math.PI);
      this.ctx.translate(-this.coords.x, -this.coords.y);
      this.ctx.drawImage(
        this.exhaust,
        this.spriteWidth * this.i,
        0,
        this.spriteWidth,
        this.exhaust.height,
        this.coords.x - this.spriteWidth * this.scale,
        this.coords.y -
          this.rocket.height * this.scale +
          10 -
          this.exhaust.height * this.scale,
        this.spriteWidth * this.scale * 2,
        this.exhaust.height * this.scale * 2
      );
      this.i = (this.i + 1) % this.frames;
    }

    this.ctx.restore();
  }

  updateMouseCoords(newMouseCoords: Coords) {
    this.mouseCoords = newMouseCoords;
  }
}

class Background {
  mouseCoords: Coords;
  scaleFactor: number;
  ctx: CanvasRenderingContext2D;
  bg: HTMLImageElement;

  constructor(background: HTMLCanvasElement) {
    this.mouseCoords = { x: 0, y: 0 };
    this.scaleFactor = 200;
    this.ctx = background.getContext("2d");
    this.bg = new Image();
    this.bg.src = backgroundImage;
    this.ctx.drawImage(
      this.bg,
      -100,
      -100,
      window.innerWidth + 100,
      window.innerHeight + 100
    );
  }

  updateBackground = () => {
    this.ctx.clearRect(
      -100,
      -100,
      window.innerWidth + 100,
      window.innerHeight + 100
    );
    this.ctx.drawImage(
      this.bg,
      (this.mouseCoords.x - 0.5 * window.innerWidth) *
        (this.scaleFactor / window.innerWidth) -
        this.scaleFactor * 0.5,
      (this.mouseCoords.y - 0.5 * window.innerHeight) *
        (this.scaleFactor / window.innerHeight) -
        this.scaleFactor * 0.5,
      window.innerWidth + this.scaleFactor,
      window.innerHeight + this.scaleFactor
    );
  };

  updateMouseCoords(newMouseCoords: Coords) {
    this.mouseCoords = newMouseCoords;
  }
}

function main() {
  const foreground = <HTMLCanvasElement>document.getElementById("foreground");
  const background = <HTMLCanvasElement>document.getElementById("background");

  const resize = () => {
    background.width = window.innerWidth;
    background.height = window.innerHeight;
    foreground.width = window.innerWidth;
    foreground.height = window.innerHeight;
  };

  window.onresize = resize

  const rocket = new Rocket(foreground);
  const parallax = new Background(background);

  document.onmousemove = function(e) {
    const mouseCoords = { x: e.clientX, y: e.clientY };
    rocket.updateMouseCoords(mouseCoords);
    parallax.updateMouseCoords(mouseCoords);
  };

  const animate = () => {
    rocket.updatePosition();
    rocket.redrawRocket();
    parallax.updateBackground();
    window.requestAnimationFrame(animate);
  };

  resize()
  animate()
}

window.onload = main
