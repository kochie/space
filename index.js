const foreground = document.getElementById('foreground');
const background = document.getElementById('background');

background.width = window.innerWidth;
background.height = window.innerHeight;
foreground.width = window.innerWidth;
foreground.height = window.innerHeight;

window.onresize = function() {
  background.width = window.innerWidth;
  background.height = window.innerHeight;
  foreground.width = window.innerWidth;
  foreground.height = window.innerHeight;
};

const ctx = foreground.getContext('2d');
const rocket = new Image();
rocket.src = './rocket.png';
const exhaust = new Image();
exhaust.src = './rocket_exhaust.gif';


backctx = background.getContext('2d');
const bg = new Image();
bg.src = './background.png';
backctx.drawImage(
  bg,
  -100,
  -100,
  window.innerWidth + 100,
  window.innerHeight + 100,
);

const scaleFactor = 200;
const mouseCoords = {x: 0, y: 0};
const scale = 0.2;
const coords = {x: 0, y: 0};
const speedScale = 0.02;

const updateBackground = () => {

  backctx.clearRect(
    -100,
    -100,
    window.innerWidth + 100,
    window.innerHeight + 100,
  );
  backctx.drawImage(
    bg,
    (mouseCoords.x - 0.5 * window.innerWidth) *
      (scaleFactor / window.innerWidth) -
      scaleFactor * 0.5,
    (mouseCoords.y - 0.5 * window.innerHeight) *
      (scaleFactor / window.innerHeight) -
      scaleFactor * 0.5,
    window.innerWidth + scaleFactor,
    window.innerHeight + scaleFactor,
  );
}

document.onmousemove = function(e) {
  mouseCoords.x = e.clientX;
  mouseCoords.y = e.clientY;
};


const displacement = {
    x: mouseCoords.x - coords.x,
    y: mouseCoords.y - coords.y,
};

const updatePosition = () => {

    displacement.x = mouseCoords.x - coords.x
    displacement.y = mouseCoords.y - coords.y

  const time = new Date();
  const t  = 2 * Math.PI/6000 * time.getTime()
  const q =
    5 *
    Math.sin(
      t
    );
  const r =
    5 *
    Math.cos(

        t,
    ) *
    Math.sin(t
    );
  let oldCoords = {x: coords.x, y: coords.y};
  coords.y =
    coords.y +
    displacement.y * speedScale +
    (1 - displacement.y / window.innerHeight) * r;
  coords.x =
    coords.x +
    displacement.x * speedScale +
    (1 - displacement.x / window.innerWidth) * q;
  const angle =
    Math.atan2(coords.y - oldCoords.y, coords.x - oldCoords.x) + Math.PI / 2;
  drawNewBop(coords.x, coords.y, angle);
};

const animate = () => {
  updatePosition();
  updateBackground();
  window.requestAnimationFrame(animate);
};

const drawNewBop = (x, y, angle) => {
  const rocket_width = x - rocket.width * scale * 0.5;
  const rocket_height = y - rocket.height * scale * 0.5;
	
  ctx.save();
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.translate(-x, -y);
  ctx.drawImage(
    rocket,
    rocket_width,
    rocket_height,
    rocket.width * scale,
    rocket.height * scale,
  );
  if (displacement.x**2+displacement.y**2 > 90000) {	
  ctx.translate(x,y);
  ctx.rotate(Math.PI);
  ctx.translate(-x,-y);
  ctx.drawImage(exhaust, 
    x - exhaust.width * scale,
    y - rocket.height*scale + 20 - exhaust.height * scale,
    exhaust.width * scale*2,
    exhaust.height * scale*2)}
  ctx.restore();
};

const audio = new Audio('rocket_man.mp3');
audio.loop = true;
audio.play();

window.requestAnimationFrame(animate);
