'use client';

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import styles from './Game.module.css';

interface GameState {
  isPlaying: boolean;
  isGameOver: boolean;
  score: number;
  birdPosition: number;
  birdVelocity: number;
  pipes: Array<{
    x: number;
    height: number;
  }>;
}

const GRAVITY = 0.4;
const JUMP_FORCE = -7;
const MAX_VELOCITY = 10;
const PIPE_SPEED = 4;
const FRAME_RATE = 60;
const FRAME_TIME = 1000 / FRAME_RATE;

export default function Game() {
  const [dimensions, setDimensions] = useState({
    BIRD_WIDTH: 0,
    BIRD_HEIGHT: 0,
    PIPE_WIDTH: 0,
    PIPE_GAP: 0,
    GROUND_HEIGHT: 0,
  });

  useEffect(() => {
    setDimensions({
      BIRD_WIDTH: window.innerWidth * 0.05,
      BIRD_HEIGHT: window.innerWidth * 0.05 * 0.7,
      PIPE_WIDTH: window.innerWidth * 0.08,
      PIPE_GAP: window.innerHeight * 0.35,
      GROUND_HEIGHT: window.innerHeight * 0.12,
    });
  }, []);

  const [gameState, setGameState] = useState<GameState>({
    isPlaying: false,
    isGameOver: false,
    score: 0,
    birdPosition: 350,
    birdVelocity: 0,
    pipes: [],
  });

  const [fallingAnimation, setFallingAnimation] = useState({
    rotation: 0,
    scale: 1,
  });

  const gameLoopRef = useRef<number>(null);
  const lastTimeRef = useRef<number>(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const images = useMemo(() => {
    const birdImages = [new Image(), new Image(), new Image()];
    const numberImages: HTMLImageElement[] = Array.from({ length: 10 }, () => new Image());
    const otherImages = {
      background: new Image(),
      pipe: new Image(),
      ground: new Image(),
      gameOver: new Image(),
      message: new Image(),
    };

    const loadImage = (img: HTMLImageElement, src: string) => {
      img.src = src;
      return new Promise((resolve) => {
        img.onload = resolve;
      });
    };

    Promise.all([
      loadImage(birdImages[0], '/Game Objects/yellowbird-downflap.png'),
      loadImage(birdImages[1], '/Game Objects/yellowbird-midflap.png'),
      loadImage(birdImages[2], '/Game Objects/yellowbird-upflap.png'),
      loadImage(otherImages.background, '/Game Objects/background-day.png'),
      loadImage(otherImages.pipe, '/Game Objects/pipe-green.png'),
      loadImage(otherImages.ground, '/Game Objects/base.png'),
      loadImage(otherImages.gameOver, '/UI/gameover.png'),
      loadImage(otherImages.message, '/UI/message.png'),
      ...numberImages.map((img, i) => loadImage(img, `/UI/Numbers/${i}.png`)),
    ]);

    return { birdImages, numberImages, ...otherImages };
  }, []);

  const handleClick = useCallback(() => {
    if (gameState.isGameOver) {
      setGameState({
        isPlaying: true,
        isGameOver: false,
        score: 0,
        birdPosition: 250,
        birdVelocity: 0,
        pipes: [],
      });
      setFallingAnimation({ rotation: 0, scale: 1 });
    } else if (!gameState.isPlaying) {
      setGameState((prev) => ({ ...prev, isPlaying: true }));
    } else {
      setGameState((prev) => ({
        ...prev,
        birdVelocity: JUMP_FORCE,
      }));
      new Audio('/Sound Efects/wing.wav').play().catch(() => {});
    }
  }, [gameState.isGameOver, gameState.isPlaying]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let groundX = 0;
    let birdFrame = 0;
    let frameCount = 0;

    let smoothedBirdPosition = gameState.birdPosition;
    let smoothedBirdRotation = 0;

    let lastFrameTime = 0;
    let animationFrameId: number;

    const gameLoop = (timestamp: number) => {
      if (timestamp - lastFrameTime < FRAME_TIME) {
        animationFrameId = requestAnimationFrame(gameLoop);
        return;
      }

      const deltaTime = (timestamp - lastTimeRef.current) / 16.67;
      lastTimeRef.current = timestamp;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.drawImage(images.background, 0, 0, canvas.width, canvas.height);

      if (gameState.isPlaying && !gameState.isGameOver) {
        setGameState((prev) => {
          smoothedBirdPosition = lerp(smoothedBirdPosition, prev.birdPosition, 0.1 * deltaTime);

          const newBirdPosition = prev.birdPosition + prev.birdVelocity * deltaTime;
          const newBirdVelocity = Math.min(
            Math.max(prev.birdVelocity + GRAVITY * deltaTime, -MAX_VELOCITY),
            MAX_VELOCITY
          );

          let newPipes = [...prev.pipes];
          if (
            newPipes.length === 0 ||
            newPipes[newPipes.length - 1].x < canvas.width - canvas.width * 0.4
          ) {
            newPipes.push({
              x: canvas.width,
              height: Math.random() * (canvas.height - dimensions.PIPE_GAP - dimensions.GROUND_HEIGHT - 100) + 50,
            });
          }

          newPipes = newPipes.filter((pipe) => pipe.x > -dimensions.PIPE_WIDTH);
          const currentPipeSpeed = PIPE_SPEED + prev.score * 0.1;
          newPipes = newPipes.map((pipe) => ({
            ...pipe,
            x: pipe.x - currentPipeSpeed * deltaTime,
          }));

          const birdBox = {
            x: canvas.width * 0.15 - dimensions.BIRD_WIDTH / 2,
            y: newBirdPosition,
            width: dimensions.BIRD_WIDTH,
            height: dimensions.BIRD_HEIGHT,
          };

          if (newBirdPosition > canvas.height - dimensions.GROUND_HEIGHT - dimensions.BIRD_HEIGHT) {
            new Audio('/Sound Efects/hit.wav').play().catch(() => {});
            new Audio('/Sound Efects/die.wav').play().catch(() => {});
            return { ...prev, isGameOver: true };
          }

          for (const pipe of newPipes) {
            const upperPipeBox = {
              x: pipe.x,
              y: 0,
              width: dimensions.PIPE_WIDTH,
              height: pipe.height,
            };

            const lowerPipeBox = {
              x: pipe.x,
              y: pipe.height + dimensions.PIPE_GAP,
              width: dimensions.PIPE_WIDTH,
              height: canvas.height - (pipe.height + dimensions.PIPE_GAP),
            };

            if (
              (birdBox.x + birdBox.width > upperPipeBox.x &&
                birdBox.x < upperPipeBox.x + upperPipeBox.width &&
                birdBox.y < upperPipeBox.height) ||
              (birdBox.x + birdBox.width > lowerPipeBox.x &&
                birdBox.x < lowerPipeBox.x + lowerPipeBox.width &&
                birdBox.y + birdBox.height > lowerPipeBox.y)
            ) {
              new Audio('/Sound Efects/hit.wav').play().catch(() => {});
              new Audio('/Sound Efects/die.wav').play().catch(() => {});
              return { ...prev, isGameOver: true };
            }
          }

          let newScore = prev.score;
          for (const pipe of newPipes) {
            const birdCenterX = canvas.width * 0.15;
            if (
              pipe.x + dimensions.PIPE_WIDTH < birdCenterX &&
              pipe.x + dimensions.PIPE_WIDTH > birdCenterX - currentPipeSpeed * deltaTime
            ) {
              newScore++;
              new Audio('/Sound Efects/point.wav').play().catch(() => {});
            }
          }

          const rotationTarget = newBirdVelocity > 0 ? 45 : -30;
          setFallingAnimation((prev) => ({
            ...prev,
            rotation: lerp(prev.rotation, rotationTarget, 0.1 * deltaTime),
          }));

          return {
            ...prev,
            birdPosition: newBirdPosition,
            birdVelocity: newBirdVelocity,
            pipes: newPipes,
            score: newScore,
          };
        });
      }

      gameState.pipes.forEach((pipe) => {
        ctx.save();
        ctx.scale(1, -1);
        ctx.drawImage(images.pipe, pipe.x, -pipe.height, dimensions.PIPE_WIDTH, pipe.height);
        ctx.restore();

        ctx.drawImage(
          images.pipe,
          pipe.x,
          pipe.height + dimensions.PIPE_GAP,
          dimensions.PIPE_WIDTH,
          canvas.height - (pipe.height + dimensions.PIPE_GAP)
        );
      });

      groundX = (groundX - 0) % images.ground.width;
      for (let x = groundX; x < canvas.width; x += images.ground.width) {
        ctx.drawImage(images.ground, x, canvas.height - dimensions.GROUND_HEIGHT);
      }

      const targetRotation = Math.min(Math.max(gameState.birdVelocity * 2, -20), 90);
      smoothedBirdRotation = lerp(smoothedBirdRotation, targetRotation, 0.1 * deltaTime);

      frameCount++;
      if (frameCount % 5 === 0) {
        birdFrame = (birdFrame + 1) % 3;
      }

      ctx.save();
      ctx.translate(canvas.width * 0.15, smoothedBirdPosition + dimensions.BIRD_HEIGHT / 2);
      ctx.rotate((fallingAnimation.rotation * Math.PI) / 290);
      ctx.scale(fallingAnimation.scale, fallingAnimation.scale);
      ctx.drawImage(
        images.birdImages[birdFrame],
        -dimensions.BIRD_WIDTH / 2,
        -dimensions.BIRD_HEIGHT / 2,
        dimensions.BIRD_WIDTH,
        dimensions.BIRD_HEIGHT
      );
      ctx.restore();

      const scoreStr = gameState.score.toString();
      const digitWidth = 40;
      const digitHeight = 40;
      const scoreWidth = scoreStr.length * digitWidth;
      let scoreX = (canvas.width - scoreWidth) / 2;
      const scoreY = canvas.height * 0.1;

      for (let i = 0; i < scoreStr.length; i++) {
        const digit = parseInt(scoreStr[i]);
        ctx.drawImage(
          images.numberImages[digit],
          scoreX + i * digitWidth,
          scoreY,
          digitWidth,
          digitHeight
        );
      }

      if (gameState.isGameOver) {
        ctx.drawImage(images.gameOver, canvas.width / 2 - 96, canvas.height / 2 - 21);
      } else if (!gameState.isPlaying) {
        ctx.drawImage(images.message, canvas.width / 2 - 92, canvas.height / 2 - 140);
      }

      lastFrameTime = timestamp;
      animationFrameId = requestAnimationFrame(gameLoop);
    };

    animationFrameId = requestAnimationFrame(gameLoop);

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [gameState, dimensions, images]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        handleClick();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleClick]);

  const lerp = (start: number, end: number, amount: number) => {
    return start + (end - start) * amount;
  };

  return (
    <div className={styles.gameContainer}>
      <canvas
        ref={canvasRef}
        className={styles.gameCanvas}
        onClick={handleClick}
        style={{
          width: '100vw',
          height: '100vh',
          touchAction: 'none',
        }}
      />
    </div>
  );
}