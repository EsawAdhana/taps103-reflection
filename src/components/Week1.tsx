import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

interface Category {
  name: string;
}

const categories: Category[] = [
  {
    name: "Fruits"
  },
  {
    name: "Animals"
  },
  {
    name: "Countries"
  },
  {
    name: "Sports"
  },
  {
    name: "Colors"
  }
];

export default function Week1() {
  const [started, setStarted] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [timeLeft, setTimeLeft] = useState(5);
  const [gameOver, setGameOver] = useState(false);
  const [things, setThings] = useState(['', '', '']);

  useEffect(() => {
    if (started && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !gameOver) {
      setGameOver(true);
      // Trigger confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [started, timeLeft, gameOver]);

  const startGame = () => {
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    setCurrentCategory(randomCategory);
    setStarted(true);
    setTimeLeft(5);
    setGameOver(false);
    setThings(['', '', '']);
  };

  const handleInputChange = (index: number, value: string) => {
    const newThings = [...things];
    newThings[index] = value;
    setThings(newThings);
  };

  if (!started) {
    return (
      <div className="max-w-3xl mx-auto flex flex-col items-center">
        <h2 className="text-3xl font-extrabold text-center mb-6" style={{ color: '#8C1515' }}>
          Week 1: Three Things Game
        </h2>
        <div className="bg-white rounded-lg shadow-lg p-8 w-full" style={{ borderLeft: '8px solid #8C1515' }}>
          <div className="flex flex-col items-center gap-6">
            <h3 className="text-xl font-bold text-center" style={{ color: '#2E2D29' }}>
              Welcome to the Three Things Game!
            </h3>
            <ul className="text-lg text-center mb-4" style={{ color: '#2E2D29' }}>
              <li className="mb-2">• You&apos;ll be given a category</li>
              <li className="mb-2">• You have 5 seconds to name three things in that category</li>
              <li className="mb-2">• Don&apos;t worry about being perfect - just have fun!</li>
              <li className="mb-2">• When time&apos;s up, we&apos;ll celebrate with confetti!</li>
            </ul>
            <button
              onClick={startGame}
              className="px-8 py-3 rounded-md font-bold text-lg transition-colors duration-150"
              style={{ backgroundColor: '#8C1515', color: 'white' }}
            >
              Begin
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto flex flex-col items-center">
      <h2 className="text-3xl font-extrabold text-center mb-6" style={{ color: '#8C1515' }}>
        Week 1: Three Things Game
      </h2>
      <div className="bg-white rounded-lg shadow-lg p-8 w-full" style={{ borderLeft: '8px solid #8C1515' }}>
        <div className="flex flex-col items-center gap-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4" style={{ color: '#2E2D29' }}>
              Name three {currentCategory?.name.toLowerCase()}!
            </h3>
            <div className="text-4xl font-bold mb-4" style={{ color: timeLeft <= 2 ? '#ef4444' : '#2E2D29' }}>
              {timeLeft}
            </div>
          </div>

          <div className="w-full space-y-4">
            {[0, 1, 2].map((index) => (
              <div key={index} className="flex items-center gap-4">
                <span className="text-xl font-bold" style={{ color: '#8C1515' }}>{index + 1}.</span>
                <input
                  type="text"
                  value={things[index]}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  placeholder={`Type your ${index + 1}${index === 0 ? 'st' : index === 1 ? 'nd' : 'rd'} thing...`}
                  className="flex-1 p-3 text-lg rounded-md border-2 border-gray-300 focus:outline-none focus:border-red-800"
                  style={{ color: '#2E2D29' }}
                  disabled={gameOver}
                />
              </div>
            ))}
          </div>

          {gameOver && (
            <div className="text-center">
              <h4 className="text-3xl font-bold mb-4" style={{ color: '#8C1515' }}>
                THREE THINGS!
              </h4>
              <button
                onClick={startGame}
                className="px-6 py-2 rounded-md font-bold text-lg transition-colors duration-150"
                style={{ backgroundColor: '#8C1515', color: 'white' }}
              >
                Play Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 