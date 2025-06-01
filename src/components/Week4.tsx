'use client';

import { useState, useRef, useEffect } from 'react';

interface Week4Props {
  onComplete?: () => void;
}

export default function Week4({ onComplete }: Week4Props) {
  const [started, setStarted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [timeLeft, setTimeLeft] = useState(5);
  const [text, setText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showConclude, setShowConclude] = useState(false);

  useEffect(() => {
    if (started && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (started && timeLeft === 0) {
      // Exit fullscreen if active
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
      // Show the conclude page
      setShowConclude(true);
    }
  }, [started, timeLeft, onComplete]);

  // Auto-scroll to bottom when text changes
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
    }
  }, [text]);

  // Cursor blinking effect
  useEffect(() => {
    if (started) {
      const cursorInterval = setInterval(() => {
        setShowCursor(prev => !prev);
      }, 530);
      return () => clearInterval(cursorInterval);
    }
  }, [started]);

  const handleBegin = () => {
    setStarted(true);
    if (containerRef.current && containerRef.current.requestFullscreen) {
      containerRef.current.requestFullscreen();
    }
  };

  const handleReplay = () => {
    setStarted(false);
    setTimeLeft(5); // Reset the timer to 3 minutes
    setText('');
    setShowConclude(false);
  };

  if (!started) {
    return (
      <div className="max-w-3xl mx-auto flex flex-col items-center">
        <h2 className="text-3xl font-extrabold text-center mb-6" style={{ color: '#8C1515' }}>
          The Vigil
        </h2>
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full" style={{ borderLeft: '8px solid #8C1515' }}>
          <ul className="text-lg text-center mb-8" style={{ color: '#222' }}>
            <li className="mb-2">• The vigil will last 3 minutes.</li>
            <li className="mb-2">• There&apos;s just one rule:</li>
            <li className="mb-2">&nbsp;&nbsp;&nbsp;&nbsp;• <span className='font-bold'>Be nice</span></li>
          </ul>
          <div className="flex justify-center">
            <button
              onClick={handleBegin}
              className="px-8 py-3 rounded-md font-bold text-xl transition-colors duration-150"
              style={{ backgroundColor: '#8C1515', color: 'white' }}
            >
              Begin
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showConclude) {
    return (
      <div className="max-w-3xl mx-auto flex flex-col items-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full" style={{ borderLeft: '8px solid #8C1515' }}>
          <h3 className="text-3xl font-bold text-center mb-8" style={{ color: '#222' }}>
            The Vigil has concluded.
          </h3>
          <div className="flex justify-center space-x-4">
            <button
              onClick={handleReplay}
              className="px-8 py-3 rounded-md font-bold text-xl transition-colors duration-150"
              style={{ backgroundColor: '#8C1515', color: 'white' }}
            >
              Play Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Only the vigil experience is fullscreen
  return (
    <div ref={containerRef} className="fixed inset-0 w-screen h-screen bg-white" style={{zIndex: 50}}>
      <div className="w-full h-full flex flex-col">
        <div className="flex-1 p-8 relative">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full h-full p-4 text-lg font-mono resize-none focus:outline-none"
            style={{
              backgroundColor: 'white',
              color: '#2E2D29',
              lineHeight: '1.6',
              caretColor: showCursor ? '#2E2D29' : 'transparent'
            }}
            placeholder=""
            autoFocus
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            autoComplete="off"
          />
        </div>
      </div>
    </div>
  );
} 