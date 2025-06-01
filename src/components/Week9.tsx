'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

// Home row keys for A B C D E F G A B C (starting at A4)
const KEY_ORDER = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';'];
const NOTE_ORDER = [
  'A4', 'B4', 'C5', 'D5', 'E5', 'F5', 'G5', 'A5', 'B5', 'C6'
];
const NOTES: { [key: string]: string } = {};
KEY_ORDER.forEach((key, idx) => {
  NOTES[key] = NOTE_ORDER[idx];
});

const NOTE_NAMES: { [note: string]: string } = {
  'A4': 'A', 'B4': 'B', 'C5': 'C', 'D5': 'D', 'E5': 'E',
  'F5': 'F', 'G5': 'G', 'A5': 'A', 'B5': 'B', 'C6': 'C'
};

function playMetronomeTick() {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  oscillator.type = 'square';
  oscillator.frequency.setValueAtTime(2000, audioContext.currentTime);
  gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.1);
}

export default function Week9() {
  const [phase, setPhase] = useState<'practice'|'countdown'|'recital'|'playback'>('practice');
  const [timeLeft, setTimeLeft] = useState(15);
  const [countdown, setCountdown] = useState(3);
  const [recitalTime, setRecitalTime] = useState(20);
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set());
  const [recordedNotes, setRecordedNotes] = useState<{note: string, time: number}[]>([]);
  const [playbackStart, setPlaybackStart] = useState<number|null>(null);
  const [story, setStory] = useState('');
  const recitalStartRef = useRef<number|null>(null);
  const playbackTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  // Initialize audio context
  useEffect(() => {
    const initAudio = async () => {
      try {
        const context = new (window.AudioContext || (window as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext)();
        // Resume the context to handle autoplay restrictions
        await context.resume();
        setAudioContext(context);
      } catch (error) {
        console.error('Failed to initialize audio context:', error);
      }
    };
    initAudio();
  }, []);

  // Practice timer
  useEffect(() => {
    if (phase !== 'practice') return;
    if (timeLeft <= 0) {
      setPhase('countdown');
      setCountdown(3);
      return;
    }
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [phase, timeLeft]);

  // Countdown phase
  useEffect(() => {
    if (phase !== 'countdown') return;
    if (countdown === 0) {
      setPhase('recital');
      setRecitalTime(20);
      recitalStartRef.current = performance.now();
      return;
    }
    playMetronomeTick();
    const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [phase, countdown]);

  // Recital timer
  useEffect(() => {
    if (phase !== 'recital') return;
    if (recitalTime <= 0) {
      setPhase('playback');
      setPlaybackStart(performance.now());
      return;
    }
    const timer = setInterval(() => setRecitalTime(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [phase, recitalTime]);

  // Playback loop
  useEffect(() => {
    if (phase !== 'playback' || recordedNotes.length === 0) return;
    if (playbackTimeoutRef.current) clearTimeout(playbackTimeoutRef.current);
    const start = performance.now();
    let idx = 0;
    function scheduleNext() {
      if (recordedNotes.length === 0) return;
      if (idx >= recordedNotes.length) {
        // Loop
        idx = 0;
        setPlaybackStart(performance.now());
      }
      const now = performance.now();
      const nextNote = recordedNotes[idx];
      const delay = Math.max(0, (nextNote.time - (now - start)));
      playbackTimeoutRef.current = setTimeout(() => {
        playNote(nextNote.note);
        idx++;
        scheduleNext();
      }, delay);
    }
    scheduleNext();
    return () => {
      if (playbackTimeoutRef.current) clearTimeout(playbackTimeoutRef.current);
    };
    // eslint-disable-next-line
  }, [phase, recordedNotes, playbackStart]);

  // Play note function
  const playNote = useCallback((note: string) => {
    if (!audioContext) return;
    
    try {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(getFrequency(note), audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 1);
    } catch (error) {
      console.error('Failed to play note:', error);
    }
  }, [audioContext]);

  // Frequency map
  const getFrequency = (note: string) => {
    const noteMap: { [key: string]: number } = {
      'A4': 440.00, 'B4': 493.88, 'C5': 523.25, 'D5': 587.33, 'E5': 659.25,
      'F5': 698.46, 'G5': 783.99, 'A5': 880.00, 'B5': 987.77, 'C6': 1046.50
    };
    return noteMap[note] || 440;
  };

  // Keyboard event listeners
  useEffect(() => {
    if (phase !== 'practice' && phase !== 'recital') return;
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (NOTES[key] && !activeKeys.has(key)) {
        setActiveKeys(prev => new Set([...prev, key]));
        if (phase === 'recital' && recitalStartRef.current) {
          setRecordedNotes(prev => [
            ...prev,
            { note: NOTES[key], time: performance.now() - recitalStartRef.current! }
          ]);
        }
        playNote(NOTES[key]);
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (NOTES[key]) {
        setActiveKeys(prev => {
          const newSet = new Set(prev);
          newSet.delete(key);
          return newSet;
        });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [phase, activeKeys, playNote]);

  // UI rendering
  let mainContent;
  if (phase === 'practice') {
    mainContent = (
      <div className="bg-white rounded-lg shadow-lg p-8 w-full" style={{ borderLeft: '8px solid #8C1515' }}>
        <h2 className="text-2xl font-extrabold mb-4" style={{ color: '#8C1515' }}>Practice Time</h2>
        <p className="text-xl mb-4" style={{ color: '#2E2D29' }}>Time remaining: {timeLeft} seconds</p>
        <p className="text-gray-700">Use your keyboard to play notes. Press the corresponding key, on the home row, namely 'A through ;, to create music.</p>
      </div>
    );
  } else if (phase === 'countdown') {
    mainContent = (
      <div className="bg-white rounded-lg shadow-lg p-8 w-full text-center" style={{ borderLeft: '8px solid #8C1515' }}>
        <h2 className="text-2xl font-extrabold mb-4" style={{ color: '#8C1515' }}>Get Ready!</h2>
        <p className="text-6xl font-bold text-blue-600">{countdown > 0 ? countdown : ''}</p>
      </div>
    );
  } else if (phase === 'recital') {
    mainContent = (
      <div className="bg-white rounded-lg shadow-lg p-8 w-full" style={{ borderLeft: '8px solid #8C1515' }}>
        <h2 className="text-2xl font-extrabold mb-4" style={{ color: '#8C1515' }}>Recital Time</h2>
        <p className="text-xl mb-4" style={{ color: '#2E2D29' }}>Time remaining: {recitalTime} seconds</p>
        <p className="text-gray-700">Create your 20-second improvisation piece!</p>
      </div>
    );
  } else if (phase === 'playback') {
    mainContent = (
      <div className="bg-white rounded-lg shadow-lg p-8 w-full text-center" style={{ borderLeft: '8px solid #8C1515' }}>
        <h2 className="text-2xl font-extrabold mb-4" style={{ color: '#8C1515' }}>Playback</h2>
        <p className="text-xl mb-4" style={{ color: '#2E2D29' }}>Enjoy your performance on loop!</p>
        <div className="mt-8">
          <label htmlFor="story" className="block text-lg font-semibold mb-2" style={{ color: '#2E2D29' }}>
            While your music plays, write a story that fits its vibe:
          </label>
          <textarea
            id="story"
            className="w-full h-40 p-4 border rounded-lg resize-none text-[#2E2D29] placeholder-[#6B4C3B]"
            style={{ borderColor: '#8C1515' }}
            placeholder="Type your story here..."
            value={story}
            onChange={e => setStory(e.target.value)}
          />
          <button
            onClick={() => {
              setPhase('practice');
              setTimeLeft(15);
              setCountdown(3);
              setRecitalTime(20);
              setActiveKeys(new Set());
              setRecordedNotes([]);
              setPlaybackStart(null);
              setStory('');
            }}
            className="mt-4 px-8 py-3 rounded-md font-bold text-lg transition-colors duration-150"
            style={{ backgroundColor: '#8C1515', color: 'white' }}
          >
            Play Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto flex flex-col items-center">
        <h1 className="text-3xl font-extrabold text-center mb-6" style={{ color: '#8C1515' }}>
          Week 9: Musical Improvisation
        </h1>
        {mainContent}
        {phase !== 'playback' && (
          <div className="bg-white rounded-lg shadow-lg p-6 w-full" style={{ borderLeft: '8px solid #8C1515' }}>
            <h3 className="text-xl font-bold mb-4" style={{ color: '#2E2D29' }}>Keyboard Layout</h3>
            <div className="grid grid-cols-10 gap-2">
              {KEY_ORDER.map((key) => (
                <div
                  key={key}
                  className={`p-4 text-center rounded transition-colors duration-100 ${
                    activeKeys.has(key)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-black'
                  }`}
                >
                  <div className="font-bold text-lg">{key.toUpperCase()}</div>
                  <div className="text-sm">{NOTE_NAMES[NOTES[key]]}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 