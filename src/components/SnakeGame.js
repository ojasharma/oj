"use client";

import React, { useState, useEffect } from "react";

export default function SnakeGame({ onComplete }) {
  const GRID_SIZE = 6;
  const [dotPosition, setDotPosition] = useState({
    row: 2,
    col: GRID_SIZE - 1,
  });
  const [direction, setDirection] = useState("left");
  const [baitPosition, setBaitPosition] = useState({ row: 2, col: 1 });
  const [tail, setTail] = useState([]);
  const [goalReached, setGoalReached] = useState(false);
  const [isEating, setIsEating] = useState(false);

  // Movement and bait logic
  useEffect(() => {
    if (!goalReached) {
      const interval = setInterval(() => {
        setDotPosition((prev) => {
          let { row, col } = prev;
          if (direction === "left") col = (col - 1 + GRID_SIZE) % GRID_SIZE;
          else if (direction === "right") col = (col + 1) % GRID_SIZE;
          else if (direction === "up") row = (row - 1 + GRID_SIZE) % GRID_SIZE;
          else if (direction === "down") row = (row + 1) % GRID_SIZE;

          const newPosition = { row, col };

          // Eating bait
          if (
            newPosition.row === baitPosition.row &&
            newPosition.col === baitPosition.col
          ) {
            setIsEating(true);
            setTimeout(() => setIsEating(false), 400);

            const getNewBait = () => {
              let r, c;
              do {
                r = Math.floor(Math.random() * GRID_SIZE);
                c = Math.floor(Math.random() * GRID_SIZE);
              } while (
                (r === newPosition.row && c === newPosition.col) ||
                tail.some((seg) => seg.row === r && seg.col === c)
              );
              return { row: r, col: c };
            };
            setBaitPosition(getNewBait());
            setTail((prevTail) => [...prevTail, { ...prev }]);
          }

          // Move tail and check for goal
          setTail((prevTail) => {
            const newTail = [...prevTail];
            for (let i = newTail.length - 1; i > 0; i--) {
              newTail[i] = { ...newTail[i - 1] };
            }
            if (newTail.length > 0) newTail[0] = { ...prev };

            if (!goalReached && newTail.length >= 5) {
              setGoalReached(true); // ✅ Only set state here
            }

            return newTail;
          });

          return newPosition;
        });
      }, 400);
      return () => clearInterval(interval);
    }
  }, [direction, baitPosition, tail, goalReached]);

  // ✅ Trigger parent callback AFTER state updates
  useEffect(() => {
    if (goalReached && onComplete) {
      onComplete();
    }
  }, [goalReached, onComplete]);

  // Render grid
  const renderGrid = () => (
    <div className="grid grid-cols-6 mt-8 w-fit z-10">
      {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
        const row = Math.floor(i / GRID_SIZE);
        const col = i % GRID_SIZE;
        const isDot = row === dotPosition.row && col === dotPosition.col;
        const isTail = tail.some((seg) => seg.row === row && seg.col === col);
        const isBait = row === baitPosition.row && col === baitPosition.col;

        let content = "";
        let bg = "bg-pink-500";

        if (isDot) {
          content = (
            <img
              src={isEating ? "/eat.png" : "/head.png"}
              alt="snake head"
              className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
            />
          );
          bg = "bg-white";
        } else if (isTail) {
          content = "●";
          bg = "bg-white text-pink-300";
        } else if (isBait) {
          content = (
            <img
              src="/bait.png"
              alt="bait"
              className="w-6 h-6 sm:w-8 sm:h-8 object-contain"
            />
          );
          bg = "bg-green-400 text-white";
        }

        return (
          <div
            key={i}
            className={`w-12 h-12 sm:w-14 sm:h-14 ${bg} border border-white flex items-center justify-center text-xl`}
          >
            {content}
          </div>
        );
      })}
    </div>
  );

  // Controls
  const renderArrowControls = () => (
    <div className="mt-6 flex flex-col items-center space-y-2 z-10">
      <button
        onClick={() => direction !== "down" && setDirection("up")}
        className="w-12 h-12 bg-white text-pink-500 rounded-full shadow-md hover:scale-105 transition"
      >
        ↑
      </button>
      <div className="flex space-x-4">
        <button
          onClick={() => direction !== "right" && setDirection("left")}
          className="w-12 h-12 bg-white text-pink-500 rounded-full shadow-md hover:scale-105 transition"
        >
          ←
        </button>
        <button
          onClick={() => direction !== "up" && setDirection("down")}
          className="w-12 h-12 bg-white text-pink-500 rounded-full shadow-md hover:scale-105 transition"
        >
          ↓
        </button>
        <button
          onClick={() => direction !== "left" && setDirection("right")}
          className="w-12 h-12 bg-white text-pink-500 rounded-full shadow-md hover:scale-105 transition"
        >
          →
        </button>
      </div>
    </div>
  );

  return (
    <>
      {renderGrid()}
      {renderArrowControls()}

      {goalReached && (
        <div className="absolute inset-0 z-50 bg-transparent bg-opacity-70 flex items-center justify-center">
          <div className="bg-white text-pink-500 px-8 py-6 rounded-2xl shadow-2xl text-center space-y-4">
            <h2 className="text-3xl font-bold">🎉 Congratulations!</h2>
            <p className="text-xl">You ate all my heads! 💖</p>
          </div>
        </div>
      )}
    </>
  );
}
