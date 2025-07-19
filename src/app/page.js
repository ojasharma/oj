"use client";

import React, { useState, useEffect } from "react";

export default function WelcomePage() {
  const messages = [
    "Hello, Welcome \nto this website Oj",
    "I know you have been feeling a little down so I made a little something for you",
    "But first a short quiz 👀",
  ];

  const [displayedText, setDisplayedText] = useState("");
  const [messageIndex, setMessageIndex] = useState(0);
  const [typing, setTyping] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [secretRevealed, setSecretRevealed] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showGrid, setShowGrid] = useState(false);

  useEffect(() => {
    if (messageIndex < messages.length) {
      let index = 0;
      setTyping(true);
      const currentMessage = messages[messageIndex];

      const interval = setInterval(() => {
        setDisplayedText(currentMessage.slice(0, index + 1));
        index++;
        if (index === currentMessage.length) {
          clearInterval(interval);
          setTyping(false);
        }
      }, 60);

      return () => clearInterval(interval);
    }
  }, [messageIndex]);

  const handleContinue = () => {
    if (typing) return;

    if (messageIndex < messages.length - 1) {
      setDisplayedText("");
      setMessageIndex(messageIndex + 1);
    } else if (
      messageIndex === messages.length - 1 &&
      selectedOption &&
      !showCelebration
    ) {
      setShowCelebration(true);
    } else if (showCelebration && !showGrid) {
      setShowGrid(true);
    }
  };

  const renderQuiz = () => (
    <div className="text-white text-center space-y-4">
      <h2 className="text-2xl font-semibold">
        From the below people, which girl is the most beautiful, smart, amazing,
        magnetic, baddest, cutest, sweet goddess of woman?
      </h2>
      <div className="flex flex-col gap-3 items-center">
        {["A. Oj Gupta", "B. Oj Vikas Gupta", "C. Oh Jay Gupta"].map(
          (option, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSelectedOption(option);
                setSecretRevealed(false);
              }}
              className={`px-4 py-2 rounded-full border-2 ${
                selectedOption === option
                  ? "bg-white text-pink-500 border-white"
                  : "border-white text-white"
              } hover:bg-white hover:text-pink-500 transition`}
            >
              {option}
            </button>
          )
        )}

        <button
          onClick={() => {
            setSelectedOption("D. Still Oj Gupta, duh 🙄");
            setSecretRevealed(true);
          }}
          className={`px-4 py-2 rounded-full border-2 ${
            selectedOption === "D. Still Oj Gupta, duh 🙄"
              ? "bg-white text-pink-500 border-white"
              : "border-white text-white"
          } hover:bg-white hover:text-pink-500 transition`}
        >
          {secretRevealed ? "Still Oj Gupta, duh 🙄" : "D. Secret Option"}
        </button>
      </div>
    </div>
  );

  const renderGrid = () => (
    <div className="grid grid-cols-10 mt-8">
      {Array.from({ length: 100 }).map((_, i) => (
        <div
          key={i}
          className="w-6 h-6 sm:w-8 sm:h-8 bg-pink-500 border border-white"
        />
      ))}
    </div>
  );

  const isContinueDisabled =
    (messageIndex === messages.length - 1 &&
      !selectedOption &&
      !showCelebration) ||
    typing;

  return (
    <div className="bg-pink-400 min-h-screen flex flex-col items-center justify-center px-4 space-y-6">
      {!showCelebration && messageIndex < messages.length ? (
        <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-semibold text-center whitespace-pre-wrap">
          {displayedText}
        </h1>
      ) : null}

      {!showCelebration &&
        messageIndex === messages.length - 1 &&
        !typing &&
        renderQuiz()}

      {showCelebration && !showGrid && (
        <div className="flex flex-col items-center space-y-6 text-center">
          <h2 className="text-white text-3xl font-bold">
            Hooray! 🎉 Correct Answer 😽
          </h2>
          <img
            src="/cat.gif"
            alt="celebration cat"
            className="w-60 h-60 rounded-lg shadow-lg"
          />
        </div>
      )}

      {showGrid && renderGrid()}

      {/* Continue Button always visible */}
      <button
        onClick={handleContinue}
        disabled={isContinueDisabled}
        className={`mt-6 px-6 py-2 rounded-full text-lg font-medium flex items-center gap-2 transition border-2 ${
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
    </div>
  );
}
