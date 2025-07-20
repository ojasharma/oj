"use client";

import React, { useState } from "react";
import WelcomeMessage from "@/components/WelcomeMessage";
import Quiz from "@/components/Quiz";
import Celebration from "@/components/Celebration";
import SnakeGame from "@/components/SnakeGame";
import ShootGame from "@/components/ShootGame";
import Message from "@/components/Message"; // 1. Import the new component

export default function WelcomePage() {
  const [phase, setPhase] = useState("welcome");
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [snakeCompleted, setSnakeCompleted] = useState(false);
  const [shootGameCompleted, setShootGameCompleted] = useState(false); // 2. New state for shoot game

  const handleContinue = () => {
    if (phase === "welcome") {
      setPhase("quiz");
    } else if (phase === "quiz" && isQuizCompleted) {
      setPhase("celebration");
    } else if (phase === "celebration") {
      setPhase("game");
    } else if (phase === "game" && snakeCompleted) {
      setPhase("shoot");
    } else if (phase === "shoot" && shootGameCompleted) {
      // 3. Condition to move to the new "message" phase
      setPhase("message");
    }
  };

  const renderPhase = () => {
    switch (phase) {
      case "welcome":
        return <WelcomeMessage />;
      case "quiz":
        return <Quiz onQuizComplete={() => setIsQuizCompleted(true)} />;
      case "celebration":
        return <Celebration />;
      case "game":
        return <SnakeGame onComplete={() => setSnakeCompleted(true)} />;
      case "shoot":
        // Pass the callback to update the state when the game is complete
        return <ShootGame onGameComplete={() => setShootGameCompleted(true)} />;
      case "message": // 4. Render the new Message component
        return <Message />;
      default:
        return <WelcomeMessage />;
    }
  };

  // 5. Update the disabled logic for the "Continue" button
  const isContinueDisabled =
    (phase === "quiz" && !isQuizCompleted) ||
    (phase === "game" && !snakeCompleted) ||
    (phase === "shoot" && !shootGameCompleted); // The button is only disabled while the game is in progress

  // 6. Optionally, hide the button on the final message screen
  const showButton = phase !== "message";

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <div className="absolute inset-0 z-0 bg-pink-400"></div>
      <img
        src="/bg.gif"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover z-10 opacity-30"
      />

      <div className="relative z-20 bg-transparent min-h-screen flex flex-col items-center justify-center px-4 space-y-6">
        {renderPhase()}

        {/* The button is now hidden on the final "message" phase */}
        {showButton && (
          <button
            onClick={handleContinue}
            disabled={isContinueDisabled}
            className={`z-[200] mt-56 px-6 py-2 rounded-full text-lg font-medium flex items-center gap-2 transition border-2 ${
              isContinueDisabled
                ? "border-white text-white opacity-50 cursor-not-allowed"
                : "border-white text-white hover:bg-white hover:text-pink-500"
            }`}
          >
            Continue
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
