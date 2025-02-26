"use client";
import { useEffect, useState } from "react";
import { useInterval } from "usehooks-ts";

const size = 15;
const board = {
  width: 20,
  height: 20,
};

const Tail = React.memo(({ top, left }) => (
  <div
    style={{
      width: size,
      height: size,
      top: top * size,
      left: left * size,
    }}
    className="bg-green-700 absolute rounded-sm"
  />
));

export default function Home() {
  const [head, setHead] = useState({ top: 5, left: 4 });
  const [direction, setDirection] = useState("right");
  const [tails, setTails] = useState([
    { top: 5, left: 1 },
    { top: 5, left: 2 },
    { top: 5, left: 3 },
  ]);
  const [food, setFood] = useState({ top: 4, left: 5 });
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0); // Add score state

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.code) {
        case "ArrowUp":
          if (direction !== "down") setDirection("up");
          break;
        case "ArrowDown":
          if (direction !== "up") setDirection("down");
          break;
        case "ArrowLeft":
          if (direction !== "right") setDirection("left");
          break;
        case "ArrowRight":
          if (direction !== "left") setDirection("right");
          break;
        default:
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [direction]);

  function checkCollision(newHead) {
    return tails.some(
      (tail) => tail.top === newHead.top && tail.left === newHead.left
    );
  }

  function generateNewFood() {
    const newFoodTop = getRandomInt(board.height);
    const newFoodLeft = getRandomInt(board.width);
    setFood({ top: newFoodTop, left: newFoodLeft });
  }

  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  function gameLoop() {
    let newLeft = head.left;
    let newTop = head.top;

    switch (direction) {
      case "right":
        newLeft = head.left + 1;
        if (board.width <= newLeft) newLeft = 0;
        break;
      case "up":
        newTop = head.top - 1;
        if (newTop < 0) newTop = board.height - 1;
        break;
      case "down":
        newTop = head.top + 1;
        if (board.height <= newTop) newTop = 0;
        break;
      case "left":
        newLeft = head.left - 1;
        if (newLeft < 0) newLeft = board.width - 1;
        break;
    }

    const newHead = { top: newTop, left: newLeft };

    if (checkCollision(newHead)) {
      setIsGameOver(true);
      alert("Game Over!");
      return;
    }

    const newTails = [...tails];
    newTails.push(head);
    newTails.shift();
    setTails(newTails);
    setHead(newHead);

    if (newHead.top === food.top && newHead.left === food.left) {
      newTails.push(head); // Grow the snake
      setTails(newTails);
      generateNewFood();
      setScore((prevScore) => prevScore + 1); // Increment score
    }
  }

  function restartGame() {
    setHead({ top: 5, left: 4 });
    setDirection("right");
    setTails([
      { top: 5, left: 1 },
      { top: 5, left: 2 },
      { top: 5, left: 3 },
    ]);
    setFood({ top: 4, left: 5 });
    setIsGameOver(false);
    setScore(0); // Reset score
  }

  useInterval(() => {
    if (!isGameOver) gameLoop();
  }, 300);

  return (
    <div>
      <header className="text-center mt-10 text-[50px]">Welcome to Snake</header>
      <div className="text-center mt-5 text-2xl">Score: {score}</div> {/* Display score */}
      <div>
        <div
          style={{ width: board.width * size, height: board.height * size }}
          className="bg-violet-100 relative mx-auto mt-20 border-black"
        >
          <div
            style={{
              width: size,
              height: size,
              top: food.top * size,
              left: food.left * size,
            }}
            className="bg-red-600 absolute rounded-full"
          ></div>
          <div
            style={{
              width: size,
              height: size,
              top: head.top * size,
              left: head.left * size,
            }}
            className="bg-stone-900 absolute rounded-full"
          ></div>
          {tails.map((tail, index) => (
            <Tail key={`${tail.left}-${tail.top}-${index}`} top={tail.top} left={tail.left} />
          ))}
        </div>
      </div>

      <div className="flex gap-5 mt-10 justify-center">
        <button
          onClick={() => setDirection("left")}
          className="bg-blue-100 rounded-sm py-2 px-8"
        >
          Left
        </button>
        <button
          onClick={() => setDirection("up")}
          className="bg-blue-100 rounded-sm py-2 px-8"
        >
          Up
        </button>
        <button
          onClick={() => setDirection("down")}
          className="bg-blue-100 rounded-sm py-2 px-8"
        >
          Down
        </button>
        <button
          onClick={() => setDirection("right")}
          className="bg-blue-100 rounded-sm py-2 px-8"
        >
          Right
        </button>
      </div>

      {isGameOver && (
        <button
          onClick={restartGame}
          className="bg-red-500 text-white rounded-sm py-2 px-8 mt-5 block mx-auto"
        >
          Restart
        </button>
      )}
    </div>
  );
}