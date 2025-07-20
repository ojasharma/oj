"use client";

import React from "react";

export default function ShootGame() {
  return (
    <div className="relative w-full h-screen bg-pink-100 overflow-hidden">
      <img
        src="/head.png"
        alt="Head"
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-16 h-16 sm:w-20 sm:h-20 object-contain"
      />
    </div>
  );
}
