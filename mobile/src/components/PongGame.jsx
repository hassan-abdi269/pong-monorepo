import React, { useEffect, useRef, useState } from "react";
import { Dimensions, PanResponder, Pressable, StyleSheet, Text, View } from "react-native";
import { clamp, createInitialBall, updateBall } from "../../../shared/gameLogic.js";

const WIDTH = Dimensions.get("window").width - 20;
const HEIGHT = Math.min(420, WIDTH * 0.62);
const PADDLE = { width: 14, height: 90 };

export default function PongGame() {
  const playerY = useRef(HEIGHT / 2 - PADDLE.height / 2);
  const computerY = useRef(HEIGHT / 2 - PADDLE.height / 2);
  const ball = useRef(createInitialBall(WIDTH, HEIGHT));
  const [, render] = useState(0);
  const [score, setScore] = useState({ player: 0, computer: 0 });
  const boardRef = useRef(null);
  const boardTopRef = useRef(0);

  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (_, gestureState) => {
        playerY.current = clamp(
          gestureState.moveY - boardTopRef.current - PADDLE.height / 2,
          0,
          HEIGHT - PADDLE.height
        );
        render((value) => value + 1);
      },
      onPanResponderMove: (_, gestureState) => {
        playerY.current = clamp(
          gestureState.moveY - boardTopRef.current - PADDLE.height / 2,
          0,
          HEIGHT - PADDLE.height
        );
        render((value) => value + 1);
      },
    })
  ).current;

  useEffect(() => {
    const timer = setInterval(() => {
      const player = { x: 20, y: playerY.current, ...PADDLE };
      const computer = { x: WIDTH - 34, y: computerY.current, ...PADDLE };
      const center = computerY.current + PADDLE.height / 2;

      if (center < ball.current.y) computerY.current += 4;
      if (center > ball.current.y) computerY.current -= 4;

      computerY.current = clamp(computerY.current, 0, HEIGHT - PADDLE.height);
      updateBall(ball.current, WIDTH, HEIGHT, player, computer);

      if (ball.current.x < -ball.current.radius) {
        setScore((s) => ({ ...s, computer: s.computer + 1 }));
        ball.current = createInitialBall(WIDTH, HEIGHT, 1);
      }

      if (ball.current.x > WIDTH + ball.current.radius) {
        setScore((s) => ({ ...s, player: s.player + 1 }));
        ball.current = createInitialBall(WIDTH, HEIGHT, -1);
      }

      render((v) => v + 1);
    }, 16);

    return () => clearInterval(timer);
  }, []);

  const restart = () => {
    setScore({ player: 0, computer: 0 });
    playerY.current = HEIGHT / 2 - 45;
    computerY.current = HEIGHT / 2 - 45;
    ball.current = createInitialBall(WIDTH, HEIGHT, Math.random() > 0.5 ? 1 : -1);
    render((value) => value + 1);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pong</Text>

      <View style={styles.score}>
        <Text style={styles.text}>Player: {score.player}</Text>
        <Text style={styles.text}>Computer: {score.computer}</Text>
      </View>

      <View
        ref={boardRef}
        onLayout={() => {
          boardRef.current?.measureInWindow((x, y) => {
            boardTopRef.current = y;
          });
        }}
        {...pan.panHandlers}
        style={styles.board}
      >
        <View style={[styles.paddle, styles.player, { top: playerY.current }]} />
        <View style={[styles.paddle, styles.computer, { top: computerY.current }]} />
        <View style={[styles.ball, { left: ball.current.x, top: ball.current.y }]} />
      </View>

      <Text style={styles.help}>Drag on the game board to move.</Text>

      <Pressable onPress={restart} style={styles.button}>
        <Text style={styles.buttonText}>Restart</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#020617",
    padding: 10,
  },
  title: {
    color: "#38bdf8",
    fontSize: 42,
    fontWeight: "bold",
    marginBottom: 14,
  },
  score: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 14,
  },
  text: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  board: {
    width: WIDTH,
    height: HEIGHT,
    backgroundColor: "black",
    borderWidth: 3,
    borderColor: "#38bdf8",
    borderRadius: 10,
    overflow: "hidden",
  },
  paddle: {
    position: "absolute",
    width: PADDLE.width,
    height: PADDLE.height,
    borderRadius: 6,
  },
  player: {
    left: 20,
    backgroundColor: "#38bdf8",
  },
  computer: {
    right: 20,
    backgroundColor: "#f97316",
  },
  ball: {
    position: "absolute",
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#facc15",
  },
  help: {
    color: "#cbd5e1",
    marginTop: 18,
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#38bdf8",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: "#082f49",
    fontWeight: "bold",
  },
});
