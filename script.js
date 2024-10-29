const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Ball {
  constructor(x, y, speed, radius) {
    this.x = x;
    this.y = y;
    this.speedX = speed;
    this.speedY = speed;
    this.radius = radius;
    this.colorBall = this.color();
  }

  color() {
    return `rgba(255,20,205,${Math.random()*.9+.1})`;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.colorBall;
    ctx.fill();
    ctx.closePath();
  }

  moveBall() {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
      this.speedX = -this.speedX;
    }

    if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
      this.speedY = -this.speedY;
    }
  }

  colision(ball) {
    ball.forEach((ball) => {
      const ballx = ball.x - this.x;
      const bally = ball.y - this.y;
      const distance = Math.sqrt(ballx * ballx + bally * bally);

      if (distance / 10 < ball.radius + this.radius) {
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(ball.x, ball.y);
        ctx.strokeStyle = this.colorBall;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    });
  }
}

class workspace {
  constructor() {
    this.balls = [];
    this.mouseX = 0;
    this.mouseY = 0;
    canvas.addEventListener("mousemove", (e) => this.mouseMove(e));
  }

  mouseMove(e) {
    this.mouseX = e.clientX;
    this.mouseY = e.clientY;

    this.balls.forEach((ball) => {
      const ballx = this.mouseX - ball.x;
      const bally = this.mouseY - ball.y;
      const distance = Math.sqrt(ballx * ballx + bally * bally);

      if (distance < ball.radius + 100) {
        ball.speedX = -ballx / 100;
        ball.speedY = -bally / 100;      
      }
    });
  }

   drawLine() {
    this.balls.forEach((ball) => {
      const ballx = this.mouseX - ball.x;
      const bally = this.mouseY - ball.y;
      const distance = Math.sqrt(ballx * ballx + bally * bally);

      if (distance / 1 < ball.radius + 100) {
        ctx.beginPath();
        ctx.moveTo(this.mouseX, this.mouseY);
        ctx.lineTo(ball.x, ball.y);
        ctx.strokeStyle = ball.colorBall;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    });
   }

  makeBalls() {
    for (let i = 0; i < 200; i++) {
      this.balls.push(
        new Ball(
          Math.random() * canvas.width,
          Math.random() * canvas.height,
          Math.random() * 1+ 0.2,
          Math.random() * 3 + 0.2
        )
      );
    }
  }

  clearBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  update() {
    this.clearBoard();
    this.balls.forEach((ball) => {
      ball.draw();
      ball.moveBall();
      ball.colision(this.balls);
    });
    this.drawLine()
    requestAnimationFrame(() => this.update());
  }
}

const game = new workspace();
game.makeBalls();
game.update();
