import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useSound } from '../context/SoundContext';
import { firePointConfetti } from '../utils/confetti';

const BALLOON_COLORS = ['#ff6b6b', '#4ecdc4', '#ffe66d', '#a18cd1', '#ff9a9e'];
const TARGET_SCORE = 10;

export default function MiniGameSection({ onNext }) {
  const { playPop } = useSound();
  const [score, setScore] = useState(0);
  const [balloons, setBalloons] = useState([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [showNextBtn, setShowNextBtn] = useState(false);

  const rewardRef = useRef(null);
  const nextBtnRef = useRef(null);
  const balloonCounter = useRef(0);

  useEffect(() => {
    if (isGameOver) return;

    const interval = setInterval(() => {
      setBalloons((prev) => {
        if (prev.length >= 8) return prev;
        const id = ++balloonCounter.current;
        const color = BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)];
        const left = Math.random() * 80 + 10;
        const duration = Math.random() * 2.5 + 3.5;

        return [...prev, { id, color, left, duration }];
      });
    }, 800);

    return () => clearInterval(interval);
  }, [isGameOver]);

  const handlePop = (balloon, e) => {
    if (isGameOver) return;

    playPop();

    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;
    firePointConfetti(x, y, [balloon.color], 16, 25);

    setBalloons((prev) => prev.filter((b) => b.id !== balloon.id));

    setScore((prev) => {
      const next = prev + 1;
      if (next >= TARGET_SCORE) {
        setIsGameOver(true);
        setBalloons([]);
      }
      return next;
    });
  };

  useEffect(() => {
    if (isGameOver && rewardRef.current) {
      gsap.fromTo(
        rewardRef.current,
        { opacity: 0, scale: 0.5 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.9,
          ease: 'elastic.out(1, 0.3)',
          onComplete: () => {
            setTimeout(() => setShowNextBtn(true), 600);
          }
        }
      );
    }
  }, [isGameOver]);

  useEffect(() => {
    if (showNextBtn && nextBtnRef.current) {
      gsap.fromTo(
        nextBtnRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
      );
    }
  }, [showNextBtn]);

  return (
    <section id="mini-game" className="fullscreen-section active">
      <h2 className="section-title">Pop the Birthday Balloons! 🎈</h2>
      <div className="score-board">
        Score: <span>{score}</span> / {TARGET_SCORE}
      </div>

      <div id="game-area">
        {balloons.map((b) => (
          <div
            key={b.id}
            className="game-balloon"
            style={{
              '--bg-color': b.color,
              left: `${b.left}%`,
              animationDuration: `${b.duration}s`
            }}
            onClick={(e) => handlePop(b, e)}
            onAnimationEnd={() => {
              setBalloons((prev) => prev.filter((item) => item.id !== b.id));
            }}
          />
        ))}
      </div>

      {isGameOver && (
        <div id="game-reward" ref={rewardRef}>
          You unlocked a special birthday wish 💖
        </div>
      )}

      {showNextBtn && (
        <button
          ref={nextBtnRef}
          id="next-to-cake"
          className="nav-btn glow-on-hover"
          onClick={onNext}
        >
          Next Surprise ✨
        </button>
      )}
    </section>
  );
}
