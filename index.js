const foreground = document.getElementById('foreground');
const ctx = foreground.getContext('2d');
const rocket = new Image()
rocket.src = "./rocket.png"

foreground.width = window.innerWidth;
foreground.height = window.innerHeight;

const mouseCoords = {x: 0, y: 0};

document.onmousemove = function(e) {
  mouseCoords.x = e.clientX;
  mouseCoords.y = e.clientY;
};

const animate = () => {
  drawNewBop(mouseCoords.x, mouseCoords.y);

  window.requestAnimationFrame(animate);
};

const drawNewBop = (x,y) => {
  ctx.save();
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  const time = new Date();
  ctx.fillStyle = 'red';
  ctx.translate(x, y);
  ctx.rotate(
    2 * Math.PI / 6 * time.getSeconds() +
      2 * Math.PI / 6000 * time.getMilliseconds(),
  );
	ctx.translate(-x, -y);
	ctx.drawImage(rocket, x, y)
	//ctx.fillRect(x - 10, y - 10, 20, 20);
  ctx.restore();
};

const audio = new Audio('rocket_man.mp3');
audio.play();

window.requestAnimationFrame(animate);
