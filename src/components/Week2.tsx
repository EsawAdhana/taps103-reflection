import { useState, useEffect, useRef } from 'react';

function generateRandomNumber(length: number) {
  let num = '';
  for (let i = 0; i < length; i++) {
    num += Math.floor(Math.random() * 10).toString();
  }
  return num;
}

const NUM_LENGTH = 10;
const TOTAL_ROUNDS = 5;
const DISPLAY_TIME = 3000; // Changed from 5000 (5 seconds) to 3000 (3 seconds)

export default function Week2() {
  const [round, setRound] = useState(1);
  const [showNumber, setShowNumber] = useState(true);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [currentNumber, setCurrentNumber] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Start with a random number on mount or restart
  useEffect(() => {
    if (started) {
      const first = generateRandomNumber(NUM_LENGTH);
      setCurrentNumber(first);
      setHistory([first]);
      setShowNumber(true);
      setInput('');
      setGameOver(false);
      setRound(1);
    }
  }, [started]);

  // Show number for DISPLAY_TIME ms, then hide and show input
  useEffect(() => {
    if (showNumber && !gameOver && started) {
      const timer = setTimeout(() => {
        setShowNumber(false);
        setInput('');
        setTimeout(() => {
          inputRef.current?.focus();
        }, 100);
      }, DISPLAY_TIME);
      return () => clearTimeout(timer);
    }
  }, [showNumber, gameOver, started]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value.replace(/\D/g, '').slice(0, NUM_LENGTH));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.length !== NUM_LENGTH) return;
    if (round < TOTAL_ROUNDS) {
      setHistory((prev) => [...prev, input]);
      setCurrentNumber(input);
      setRound((r) => r + 1);
      setShowNumber(true);
      setInput('');
    } else {
      setHistory((prev) => [...prev, input]);
      setGameOver(true);
    }
  };

  // Reset game
  const handleRestart = () => {
    setStarted(false);
  };

  // Start game from intro
  const handleBegin = () => {
    setStarted(true);
  };

  return (
    <div className="max-w-2xl mx-auto flex flex-col items-center">
      <h2 className="text-3xl font-extrabold text-center mb-6" style={{ color: '#8C1515' }}>
        Week 2: Metamorphic Circle
      </h2>
      <div className="bg-white rounded-lg shadow-lg p-8 w-full flex flex-col items-center" style={{ borderLeft: '8px solid #8C1515' }}>
        {!started ? (
          <div className="flex flex-col items-center gap-6">
            <h3 className="text-xl font-bold text-center" style={{ color: '#2E2D29' }}>Welcome to the Metamorphic Circle Game!</h3>
            <ul className="text-lg text-center mb-4" style={{ color: '#2E2D29' }}>
              <li className="mb-2">• You will see a random <span className="font-bold">10-digit number</span> for 3 seconds.</li>
              <li className="mb-2">• Try to memorize it! After 5 seconds, the number will disappear.</li>
              <li className="mb-2">• Type the number you remember in the box provided.</li>
              <li className="mb-2">• Your answer becomes the number for the next round.</li>
              <li className="mb-2">• There are 5 rounds total.</li>
            </ul>
            <button
              onClick={handleBegin}
              className="px-8 py-3 rounded-md font-bold text-lg transition-colors duration-150"
              style={{ backgroundColor: '#8C1515', color: 'white' }}
            >
              Begin
            </button>
          </div>
        ) : !gameOver ? (
          <>
            <div className="mb-6 text-center">
              <h3 className="text-xl font-bold mb-2" style={{ color: '#2E2D29' }}>Round {round} of {TOTAL_ROUNDS}</h3>
              {showNumber ? (
                <div className="text-2xl font-mono tracking-widest bg-gray-100 p-4 rounded-lg select-none" style={{ letterSpacing: '0.15em', color: '#2E2D29' }}>
                  {currentNumber}
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
                  <label htmlFor="numberInput" className="text-lg font-medium" style={{ color: '#2E2D29', opacity: 0.7 }}>Type the number you just saw:</label>
                  <input
                    id="numberInput"
                    ref={inputRef}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={input}
                    onChange={handleInputChange}
                    className="border-2 rounded-md px-4 py-2 text-xl font-mono tracking-widest focus:outline-none"
                    style={{ borderColor: '#8C1515', color: '#2E2D29' }}
                    disabled={showNumber}
                    autoComplete="off"
                  />
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-md font-bold text-lg transition-colors duration-150"
                    style={{ backgroundColor: input.length === NUM_LENGTH ? '#8C1515' : '#ccc', color: 'white' }}
                    disabled={input.length !== NUM_LENGTH}
                  >
                    Submit
                  </button>
                </form>
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-6">
            <h3 className="text-xl font-bold" style={{ color: '#2E2D29' }}>Game Over!</h3>
            <div className="bg-gray-50 p-4 rounded-lg w-full">
              <div className="mb-2">
                <span className="font-semibold" style={{ color: '#2E2D29' }}>Initial Number:</span>
                <div className="font-mono tracking-widest text-lg mt-1" style={{ letterSpacing: '0.15em', color: '#2E2D29' }}>{history[0]}</div>
              </div>
              <div className="mb-2">
                <span className="font-semibold" style={{ color: '#2E2D29' }}>Your Final Answer:</span>
                <div className="font-mono tracking-widest text-lg mt-1" style={{ letterSpacing: '0.15em', color: '#2E2D29' }}>{history[history.length - 1]}</div>
              </div>
            </div>
            <button
              onClick={handleRestart}
              className="px-6 py-2 rounded-md font-bold text-lg transition-colors duration-150"
              style={{ backgroundColor: '#8C1515', color: 'white' }}
            >
              Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 