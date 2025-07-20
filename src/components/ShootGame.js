"use client";

import React, { useState, useEffect, useRef } from "react";

// A unique ID generator for our projectiles and bait
let projectileId = 0;
let baitId = 0;

export default function ShootGame() {
  const [projectiles, setProjectiles] = useState([]);
  const [baits, setBaits] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false); // ✅ Track if game is over
  const headRef = useRef(null);

  // Stop game when score reaches 20
  useEffect(() => {
    if (score >= 20) {
      setGameOver(true);
    }
  }, [score]);

  const handleClick = (event) => {
    if (gameOver) return; // ✅ Prevent shooting after game ends
    if (projectiles.length > 0) return;
    if (!headRef.current) return;

    const headRect = headRef.current.getBoundingClientRect();
    const startX = headRect.left + headRect.width / 2;
    const startY = headRect.top + headRect.height / 2;
    const endX = event.clientX;
    const endY = event.clientY;
    const angle = Math.atan2(endY - startY, endX - startX);

    const newProjectile = {
      id: projectileId++,
      x: startX,
      y: startY,
      dx: Math.cos(angle),
      dy: Math.sin(angle),
    };
    setProjectiles((prev) => [...prev, newProjectile]);
  };

  // Spawn bait every few seconds
  useEffect(() => {
    if (gameOver) return;

    const spawnBait = () => {
      const startX = Math.random() * window.innerWidth;
      const startY = -20;
      const newBait = { id: baitId++, x: startX, y: startY };
      setBaits((prev) => [...prev, newBait]);
    };

    const intervalId = setInterval(spawnBait, 1500 + Math.random() * 1500);
    return () => clearInterval(intervalId);
  }, [gameOver]);

  // Animation loop
  useEffect(() => {
    if (gameOver) return;

    let animationFrameId;

    const animate = () => {
      setProjectiles((currentProjectiles) => {
        const updatedProjectiles = currentProjectiles.map((p) => ({
          ...p,
          x: p.x + p.dx * 8,
          y: p.y + p.dy * 8,
        }));

        const collidedBaitIds = new Set();
        const projectile = updatedProjectiles[0];

        if (projectile) {
          setBaits((currentBaits) => {
            const remainingBaits = currentBaits.filter((bait) => {
              const distance = Math.sqrt(
                (projectile.x - bait.x) ** 2 + (projectile.y - bait.y) ** 2
              );
              if (distance < 25) {
                collidedBaitIds.add(bait.id);
                return false;
              }
              return true;
            });

            if (collidedBaitIds.size > 0) {
              setScore((prevScore) => prevScore + 1);
              setProjectiles([]);
            }

            return remainingBaits;
          });
        }

        return updatedProjectiles.filter(
          (p) =>
            p.x > -20 &&
            p.x < window.innerWidth + 20 &&
            p.y > -20 &&
            p.y < window.innerHeight + 20
        );
      });

      if (headRef.current) {
        const headRect = headRef.current.getBoundingClientRect();
        const headX = headRect.left + headRect.width / 2;
        const headY = headRect.top + headRect.height / 2;

        setBaits((currentBaits) =>
          currentBaits
            .map((b) => {
              const angle = Math.atan2(headY - b.y, headX - b.x);
              const dx = Math.cos(angle) * 2;
              const dy = Math.sin(angle) * 2;
              return { ...b, x: b.x + dx, y: b.y + dy };
            })
            .filter(
              (b) => Math.sqrt((headX - b.x) ** 2 + (headY - b.y) ** 2) > 20
            )
        );
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [gameOver]);

  return (
    <div
      className="fixed top-0 left-0 w-full h-screen bg-transparent overflow-hidden cursor-crosshair"
      onClick={handleClick}
    >
      {/* Score display */}
      <div className="absolute top-4 left-4 text-white text-2xl font-bold z-10">
        Score: {score} / 20
      </div>

      {/* Congratulations Message */}
      {gameOver && (
        <div className="absolute inset-0 flex items-center justify-center bg-pink bg-opacity-70 z-50">
          <div className="text-white text-4xl font-bold text-center">
            🎉 Congratulations! 🎉
            <div className="text-xl mt-2">You ate all my heads again!</div>
          </div>
        </div>
      )}

      {/* Head Image */}
      <img
        ref={headRef}
        src="/head.png"
        alt="Head"
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 sm:w-20 sm:h-20 object-contain pointer-events-none"
      />

      {/* Projectiles */}
      {!gameOver &&
        projectiles.map((p) => (
          <img
            key={p.id}
            src="/eat.png"
            alt="Projectile"
            className="absolute w-8 h-8 object-contain pointer-events-none"
            style={{
              left: `${p.x}px`,
              top: `${p.y}px`,
              transform: "translate(-50%, -50%)",
            }}
          />
        ))}

      {/* Baits */}
      {!gameOver &&
        baits.map((b) => (
          <img
            key={b.id}
            src="/bait.png"
            alt="Bait"
            className="absolute w-8 h-8 object-contain pointer-events-none"
            style={{
              left: `${b.x}px`,
              top: `${b.y}px`,
              transform: "translate(-50%, -50%)",
            }}
          />
        ))}
    </div>
  );
}

