"use client";

import React from "react";

export default function Celebration() {
  return (
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
  );
}
