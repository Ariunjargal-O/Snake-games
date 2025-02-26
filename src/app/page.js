"use client";
import { useActionState, useEffect, useState } from "react";
import { useInterval } from "usehooks-ts";
import { useEventListener } from "usehooks-ts";
const size = 15;

const board = {
  width: 20,
  height: 20,
};

export default function Home() {
  const [head, setHead] = useState({
    top: 5,
    left: 4,
  });
  const [direction, setDirection] = useState("right");
  const [tails, setTails] = useState([
    {
      top: 5,
      left: 1,
    },
    {
      top: 5,
      left: 2,
    },
    {
      top: 5,
      left: 3,
    },
  ]);
  const [food, setFood] = useState({
    top: 4,
    left: 5,
  });

  useEffect(() => {
    document.addEventListener("keydown", (e) => {
      if (e.code === "Arrowup") {
        setDirection("up");
      }
      switch (e.code) {
        case "ArrowUp": {
          setDirection("up");
          break;
        }
        case "ArrowDown": {
          setDirection("down");
          break;
        }
        case "ArrowLeft": {
          setDirection("left");
          break;
        }
        case "ArrowRight": {
          setDirection("right");
          break;
        }
      }
    });
  });

  function gameLoop() {
    let newLeft = head.left;
    let newTop = head.top;

    const newTails = [...tails];
    //  setTails(newTails)
    newTails.push(head);
    newTails.shift();
    setTails(newTails);

    switch (direction) {
      case "right": {
        newLeft = head.left + 1;
        if (board.width <= newLeft) {
          newLeft = 0;
        }
        break;
      }
      case "up": {
        newTop = head.top - 1;
        if (newTop < 0) {
          newTop = board.height - 1;
        }
        break;
      }
      case "down": {
        newTop = head.top + 1;
        if (board.height <= newTop) {
          newTop = 0;
        }
        break;
      }
      case "left": {
        newLeft = head.left - 1;
        if (newLeft < 0) {
          newLeft = board.width - 1;
        }
        break;
      }
    }

    setHead({ top: newTop, left: newLeft });

    if (head.top === food.top && head.left === food.left) {
      newTails.push(head);
      setTails(newTails);
      generateNewFood();
    }

    if (tails.find((tail) => tail.left === newLeft && tail.top === newTop)) {
      alert("GAMEOVER");
      location.reload();
      lo;
    }
  }

  function generateNewFood() {
    const newFoodTop = getRandomInt(board.height);
    const newFoodLeft = getRandomInt(board.width);
    setFood({ top: newFoodTop, left: newFoodLeft });
  }

  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  useInterval(() => {
    gameLoop();
  }, 100);

  return (
    <div>
      <header className="text-center mt-10 text-[50px]">
        Welcome to Snake
      </header>
      <div>
      <h1 className="text-center mt-10 text-[35px] mb-20">SCORE: </h1>
      {}
      </div>
      <div>
        <div 
       style={{ width: board.width * size + 1, height: board.height * size + 1 }}
        className="border-4 border-black border-double flex justify-self-center">
        <div
          style={{ width: board.width * size, height: board.height * size }}
          className="bg-violet-100 relative  "
        >
          <div
            style={{
              width: size,
              height: size,
              top: food.top * size,
              left: food.left * size,
            }}
            className="bg-red-600 absolute rounded-full "
          ></div>
          <div
            style={{
              width: size,
              height: size,
              top: head.top * size,
              left: head.left * size,
            }}
            className="bg-green-700 absolute flex rounded-sm "
          >
            <div className="flex gap-1">
              <div className="flex justify-center gap-1 flex-col ml-[2px] ">
                <div className="w-1 h-1 bg-black rounded-full"></div>
                <div className="w-1 h-1 bg-black rounded-full"></div>
              </div>
            </div>
          </div>
          {tails.map((tail, index) => (
            <div
              key={`${tail.left}-${tail.top}-${index}`}
              style={{
                width: size,
                height: size,
                top: tail.top * size,
                left: tail.left * size,
              }}
              className="bg-green-500 absolute rounded"
            ></div>
          ))}
        </div>
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
    </div>
  );
}
