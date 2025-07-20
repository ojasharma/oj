"use client";

import React, { useState } from "react";

export default function Quiz({ onQuizComplete }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [secretRevealed, setSecretRevealed] = useState(false);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    if (option.startsWith("D.")) {
      setSecretRevealed(true);
      onQuizComplete();
    }
  };

  return (
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
              onClick={() => setSelectedOption(option)}
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
          onClick={() => handleOptionClick("D. Still Oj Gupta, duh 🙄")}
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
}
