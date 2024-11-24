// components/CursorTrail.tsx
'use client'
import { useEffect, useState } from "react";

const CursorTrail = () => {
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Increase density by adding multiple particles for each movement
      for (let i = 0; i < 5; i++) {
        const newParticle = {
          id: Date.now() + i, // Unique id for each particle
          x: e.clientX + Math.random() * 10 - 5, // Slight random offset
          y: e.clientY + Math.random() * 10 - 5, // Slight random offset
          size: Math.random() * 5 + 5, // Random particle size
          opacity: 1,
        };
        setParticles((prevParticles) => [...prevParticles, newParticle]);

        // Remove particles after a brief fade-out time
        setTimeout(() => {
          setParticles((prevParticles) =>
            prevParticles.filter((particle) => particle.id !== newParticle.id)
          );
        }, 500); // Fade-out duration
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <>
      {particles.map((particle, index) => (
        <div
          key={index}
          className="particle"
          style={{
            left: particle.x - particle.size / 2 + "px",
            top: particle.y - particle.size / 2 + "px",
            width: particle.size + "px",
            height: particle.size + "px",
            opacity: particle.opacity,
            animation: `particleAnim 0.5s ease-out`, // Slightly slower fade-out for glitter
          }}
        />
      ))}
    </>
  );
};

export default CursorTrail;
