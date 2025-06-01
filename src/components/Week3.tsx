import { useState, useEffect, useRef } from 'react';

interface Level {
  name: string;
  description: string;
  targetTime: number; // Time in ms that the user should take to move the ball
  tolerance: number; // Acceptable deviation from target time in ms
}

const BALL_RADIUS = 20;
const BALL_BORDER = 1;
const PLATFORM_HEIGHT = 120; // Raised platform higher (was 300)

const levels: Level[] = [
  {
    name: "Light as a Feather",
    description: "Move the ball quickly to the platform - it's very light!",
    targetTime: 1000, // 1 second
    tolerance: 0, // Not used for this level
  },
  {
    name: "Heavy Weight",
    description: "Move the ball very slowly to the platform - it's super heavy!",
    targetTime: 3000, // 3 seconds
    tolerance: 0, // Not used for this level
  },
];

export default function Week3() {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [ball, setBall] = useState({ x: 200, y: 350 });
  const [isDragging, setIsDragging] = useState(false);
  const [started, setStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState('');
  const dragStartTime = useRef<number>(0);
  const dragStartPosition = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const dx = mouseX - ball.x;
    const dy = mouseY - ball.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance <= BALL_RADIUS) {
      setIsDragging(true);
      dragStartTime.current = Date.now();
      dragStartPosition.current = { x: ball.x, y: ball.y };
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const rect = e.currentTarget.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      setBall({
        x: Math.max(BALL_RADIUS, Math.min(400 - BALL_RADIUS, mouseX)),
        y: Math.max(BALL_RADIUS, Math.min(400 - BALL_RADIUS, mouseY)),
      });
    }
  };

  const handleMouseUp = () => {
    if (isDragging) {
      const endTime = Date.now();
      const timeTaken = endTime - dragStartTime.current;
      let snapped = false;
      // Snap to platform if above the bar
      if (ball.y <= PLATFORM_HEIGHT - BALL_RADIUS + 20) {
        setBall(b => ({ ...b, y: PLATFORM_HEIGHT - BALL_RADIUS }));
        snapped = true;
      }
      // Check if ball reached (or snapped to) the platform
      if (snapped || ball.y <= PLATFORM_HEIGHT - BALL_RADIUS) {
        setBall(b => ({ ...b, x: ball.x, y: PLATFORM_HEIGHT - BALL_RADIUS }));
        if (currentLevel === 0) {
          // Light as a Feather: must be under 1s
          if (timeTaken < 1000) {
            setSuccess(true);
            setMessage("Perfect! You moved the ball quickly enough!");
          } else {
            setSuccess(false);
            setMessage("Too slow! Try moving the ball more quickly.");
          }
        } else if (currentLevel === 1) {
          // Heavy: must be 3s or more
          if (timeTaken >= 3000) {
            setSuccess(true);
            setMessage("Perfect! You moved the ball slowly enough!");
          } else {
            setSuccess(false);
            setMessage("Too fast! Try moving the ball more slowly.");
          }
        }
      } else {
        setSuccess(false);
        setMessage("The ball didn't reach the platform! Try again.");
      }
      setGameOver(true);
      setIsDragging(false);
    }
  };

  const handleNextLevel = () => {
    if (currentLevel < levels.length - 1) {
      setCurrentLevel(prev => prev + 1);
      setBall({ x: 200, y: 350 });
      setGameOver(false);
      setSuccess(false);
      setMessage('');
    }
  };

  const handleRestart = () => {
    setStarted(false);
    setCurrentLevel(0);
    setBall({ x: 200, y: 350 });
    setGameOver(false);
    setSuccess(false);
    setMessage('');
  };

  useEffect(() => {
    if (gameOver) {
      if (success) {
        // Advance to next level after delay, or show Play Again if last level
        if (currentLevel < levels.length - 1) {
          const timer = setTimeout(() => {
            setCurrentLevel(prev => prev + 1);
            setBall({ x: 200, y: 350 });
            setGameOver(false);
            setSuccess(false);
            setMessage('');
          }, 1200);
          return () => clearTimeout(timer);
        }
        // If last level, do nothing (show Play Again)
      } else {
        // Reset current level after delay
        const timer = setTimeout(() => {
          setBall({ x: 200, y: 350 });
          setGameOver(false);
          setSuccess(false);
          setMessage('');
        }, 1200);
        return () => clearTimeout(timer);
      }
    }
  }, [gameOver, success, currentLevel]);

  return (
    <div className="max-w-2xl mx-auto flex flex-col items-center">
      <h2 className="text-3xl font-extrabold text-center mb-6" style={{ color: '#8C1515' }}>
        Week 3: Space-Object Work
      </h2>
      <div className="bg-white rounded-lg shadow-lg p-8 w-full flex flex-col items-center" style={{ borderLeft: '8px solid #8C1515' }}>
        {!started ? (
          <div className="flex flex-col items-center gap-6">
            <h3 className="text-xl font-bold text-center" style={{ color: '#2E2D29' }}>
              Welcome to the space-object work playground!
            </h3>
            <ul className="text-lg text-center mb-4" style={{ color: '#2E2D29' }}>
              <li className="mb-2">• Click and drag the ball to move it</li>
              <li className="mb-2">• Match the speed of your movement to the ball's weight</li>
              <li className="mb-2">• Get the ball to the platform in the right amount of time</li>
            </ul>
            <button
              onClick={() => setStarted(true)}
              className="px-8 py-3 rounded-md font-bold text-lg transition-colors duration-150"
              style={{ backgroundColor: '#8C1515', color: 'white' }}
            >
              Begin
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-6">
            <div className="text-xl font-bold" style={{ color: '#2E2D29' }}>
              {levels[currentLevel].name}
            </div>
            <div className="text-lg text-center mb-4" style={{ color: '#2E2D29' }}>
              {levels[currentLevel].description}
            </div>
            <div
              className="relative rounded-lg"
              style={{
                width: '400px',
                height: '400px',
                background: 'linear-gradient(to top, #e0e7ef 60%, #cfe2f3 100%)', // sky
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {/* Platform */}
              <div
                className="absolute w-full"
                style={{
                  height: '8px',
                  top: PLATFORM_HEIGHT,
                  backgroundColor: '#a0522d', // brown wood color
                  opacity: 0.7,
                  borderRadius: 4,
                  boxShadow: '0 2px 8px #a0522d33',
                }}
              />
              {/* Ground */}
              <div
                className="absolute w-full left-0"
                style={{
                  height: '40px',
                  bottom: 0,
                  background: 'linear-gradient(to top, #b0b48a 60%, #e0e7ef 100%)',
                  borderBottomLeftRadius: 12,
                  borderBottomRightRadius: 12,
                }}
              />
              {/* Ball shadow */}
              <div
                className="absolute"
                style={{
                  width: BALL_RADIUS * 2.2,
                  height: BALL_RADIUS * 0.7,
                  left: ball.x - BALL_RADIUS * 1.1,
                  top: ball.y + BALL_RADIUS - 4,
                  background: 'rgba(140,21,21,0.10)',
                  borderRadius: '50%',
                  filter: 'blur(1.5px)',
                  zIndex: 1,
                }}
              />
              {/* Ball */}
              <div
                className="absolute rounded-full cursor-grab active:cursor-grabbing"
                style={{
                  width: BALL_RADIUS * 2,
                  height: BALL_RADIUS * 2,
                  left: ball.x - BALL_RADIUS,
                  top: ball.y - BALL_RADIUS,
                  border: `${BALL_BORDER}px solid rgba(140,21,21,0.1)`,
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  zIndex: 2,
                }}
              />
            </div>
            {gameOver && (
              <div className="flex flex-col items-center gap-4">
                <p className={`text-lg font-semibold text-center ${success ? 'text-green-600' : 'text-red-600'}`}>
                  {message}
                </p>
                {currentLevel === levels.length - 1 && success && (
                  <button
                    onClick={handleRestart}
                    className="px-6 py-2 rounded-md font-bold text-lg transition-colors duration-150"
                    style={{ backgroundColor: '#8C1515', color: 'white' }}
                  >
                    Play Again
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 