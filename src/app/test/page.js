"use client";

import React from "react";
import ShootGame from "@/components/ShootGame"; // Make sure this path is correct

export default function ShootGamePage() {
  return (
    <div className="w-full h-screen bg-black flex items-center justify-center">
      <ShootGame />
    </div>
  );
}
