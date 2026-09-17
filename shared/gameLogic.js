export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function createInitialBall(width = 900, height = 500, direction = 1) {
  return {
    x: width / 2,
    y: height / 2,
    radius: 10,
    speed: 6,
    velocityX: direction * 6,
    velocityY: (Math.random() > 0.5 ? 1 : -1) * 4,
  };
}

function intersects(ball, paddle) {
  return (
    ball.x - ball.radius <= paddle.x + paddle.width &&
    ball.x + ball.radius >= paddle.x &&
    ball.y - ball.radius <= paddle.y + paddle.height &&
    ball.y + ball.radius >= paddle.y
  );
}

function bounceFrom(ball, paddle, direction) {
  const offset = (ball.y - (paddle.y + paddle.height / 2)) / (paddle.height / 2);
  const angle = offset * (Math.PI / 3);
  ball.velocityX = direction * ball.speed * Math.cos(angle);
  ball.velocityY = ball.speed * Math.sin(angle);
}

export function updateBall(ball, width, height, player, computer) {
  ball.x += ball.velocityX;
  ball.y += ball.velocityY;

  if (ball.y - ball.radius <= 0 || ball.y + ball.radius >= height) {
    ball.velocityY *= -1;
    ball.y = Math.max(ball.radius, Math.min(height - ball.radius, ball.y));
  }

  if (intersects(ball, player) && ball.velocityX < 0) {
    bounceFrom(ball, player, 1);
    ball.x = player.x + player.width + ball.radius;
  }

  if (intersects(ball, computer) && ball.velocityX > 0) {
    bounceFrom(ball, computer, -1);
    ball.x = computer.x - ball.radius;
  }
}
