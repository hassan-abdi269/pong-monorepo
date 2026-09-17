import { useEffect, useRef, useState } from "react";
import { clamp, createInitialBall, updateBall } from "../../../shared/gameLogic.js";

const WIDTH = 900;
const HEIGHT = 500;
const PADDLE = { width: 14, height: 100 };

export default function PongGame() {
  const canvasRef = useRef(null);
  const playerY = useRef(HEIGHT / 2 - PADDLE.height / 2);
  const computerY = useRef(HEIGHT / 2 - PADDLE.height / 2);
  const ball = useRef(createInitialBall(WIDTH, HEIGHT));
  const keys = useRef({ up: false, down: false });
  const frame = useRef(0);
  const [score, setScore] = useState({ player: 0, computer: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const draw = () => {
      ctx.fillStyle = "#020617"; ctx.fillRect(0, 0, WIDTH, HEIGHT);
      ctx.fillStyle = "#334155";
      for (let y = 0; y < HEIGHT; y += 30) ctx.fillRect(WIDTH / 2 - 1, y, 2, 18);
      ctx.fillStyle = "#38bdf8"; ctx.fillRect(20, playerY.current, PADDLE.width, PADDLE.height);
      ctx.fillStyle = "#f97316"; ctx.fillRect(WIDTH - 34, computerY.current, PADDLE.width, PADDLE.height);
      ctx.fillStyle = "#facc15"; ctx.beginPath(); ctx.arc(ball.current.x, ball.current.y, ball.current.radius, 0, Math.PI * 2); ctx.fill();
    };
    const update = () => {
      if (keys.current.up) playerY.current -= 7;
      if (keys.current.down) playerY.current += 7;
      playerY.current = clamp(playerY.current, 0, HEIGHT - PADDLE.height);
      const player = { x: 20, y: playerY.current, ...PADDLE };
      const computer = { x: WIDTH - 34, y: computerY.current, ...PADDLE };
      const center = computerY.current + PADDLE.height / 2;
      if (center < ball.current.y) computerY.current += 4;
      if (center > ball.current.y) computerY.current -= 4;
      computerY.current = clamp(computerY.current, 0, HEIGHT - PADDLE.height);
      updateBall(ball.current, WIDTH, HEIGHT, player, computer);
      if (ball.current.x < -ball.current.radius) { setScore(s => ({ ...s, computer: s.computer + 1 })); ball.current = createInitialBall(WIDTH, HEIGHT, 1); }
      if (ball.current.x > WIDTH + ball.current.radius) { setScore(s => ({ ...s, player: s.player + 1 })); ball.current = createInitialBall(WIDTH, HEIGHT, -1); }
    };
    const loop = () => { update(); draw(); frame.current = requestAnimationFrame(loop); };
    const down = e => { if (e.key === "ArrowUp") keys.current.up = true; if (e.key === "ArrowDown") keys.current.down = true; };
    const up = e => { if (e.key === "ArrowUp") keys.current.up = false; if (e.key === "ArrowDown") keys.current.down = false; };
    const mouse = e => { const r = canvas.getBoundingClientRect(); playerY.current = clamp(((e.clientY - r.top) / r.height) * HEIGHT - PADDLE.height / 2, 0, HEIGHT - PADDLE.height); };
    window.addEventListener("keydown", down); window.addEventListener("keyup", up); canvas.addEventListener("mousemove", mouse); frame.current = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(frame.current); window.removeEventListener("keydown", down); window.removeEventListener("keyup", up); canvas.removeEventListener("mousemove", mouse); };
  }, []);

  const restart = () => { setScore({ player: 0, computer: 0 }); playerY.current = HEIGHT / 2 - 50; computerY.current = HEIGHT / 2 - 50; ball.current = createInitialBall(WIDTH, HEIGHT, Math.random() > .5 ? 1 : -1); };
  return <div className="mx-auto max-w-5xl text-center"><div className="mb-4 flex justify-around text-2xl font-bold text-white"><span>Player: {score.player}</span><span>Computer: {score.computer}</span></div><canvas ref={canvasRef} width={WIDTH} height={HEIGHT} className="mx-auto w-full rounded-lg border-4 border-sky-400" /><p className="mt-4 text-slate-300">Use the mouse or ↑ ↓ keys to move.</p><button onClick={restart} className="rounded bg-sky-400 px-4 py-2 font-bold text-slate-950">Restart</button></div>;
}
