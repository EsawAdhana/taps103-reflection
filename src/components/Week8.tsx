import { useState, useEffect, useRef } from 'react';

interface Story {
  prompt: string;
  content: string[];
}

const PROMPT_POOL = [
  'In the depths of an ancient library...',
  'On a space station orbiting a distant planet...',
  'As waves hit the shore..',
  'Deep within an underground bunker, surrounded by concrete walls...',
  'A time traveler from the future arrives in the present...',
  'In a high-tech kitchen, a chef prepares an unusual meal...',
  'A crystal key glows...',
  'A golden compass points to......',
  'A mysterious book opens...',
];

export default function Week8() {
  const [started, setStarted] = useState(false);
  const [story, setStory] = useState<Story | null>(null);
  const [userInput, setUserInput] = useState('');
  const [showNewChoice, setShowNewChoice] = useState(false);
  const [storyComplete, setStoryComplete] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Initialize story with random prompt when started
  useEffect(() => {
    if (started && !story) {
      const randomPrompt = PROMPT_POOL[Math.floor(Math.random() * PROMPT_POOL.length)];
      setStory({
        prompt: randomPrompt,
        content: []
      });
    }
  }, [started, story]);

  // Auto-focus input when component mounts or when showing new choice
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [showNewChoice]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserInput(e.target.value);
  };

  const handleSubmit = () => {
    if (!userInput.trim()) return;

    // 50% chance to accept or reject
    const isAccepted = Math.random() < 0.5;

    if (isAccepted) {
      setStory(prev => {
        if (!prev) return null;
        return {
          ...prev,
          content: [...prev.content, userInput]
        };
      });
      setUserInput('');
      setShowNewChoice(false);
    } else {
      setShowNewChoice(true);
      setUserInput('');
    }
  };

  const handleEndStory = () => {
    setStoryComplete(true);
  };

  const handlePlayAgain = () => {
    setStarted(false);
    setStory(null);
    setUserInput('');
    setShowNewChoice(false);
    setStoryComplete(false);
  };

  if (!started) {
    return (
      <div className="max-w-3xl mx-auto flex flex-col items-center">
        <h2 className="text-3xl font-extrabold text-center mb-6" style={{ color: '#8C1515' }}>
          Week 8: New Choice Game
        </h2>
        <div className="bg-white rounded-lg shadow-lg p-8 w-full" style={{ borderLeft: '8px solid #8C1515' }}>
          <div className="flex flex-col items-center gap-6">
            <h3 className="text-xl font-bold text-center" style={{ color: '#2E2D29' }}>
              Welcome to the New Choice Game!
            </h3>
            <ul className="text-lg text-center mb-4" style={{ color: '#2E2D29' }}>
              <li className="mb-2">• You&apos;ll be given a prompt to start a story</li>
              <li className="mb-2">• Add one sentence at a time to build your story</li>
              <li className="mb-2">• Each sentence has a chance of being accepted or rejected</li>
              <li className="mb-2">• If rejected, you&apos;ll need to try a different sentence</li>
              <li className="mb-2">• End the story whenever you feel it&apos;s complete!</li>
            </ul>
            <button
              onClick={() => setStarted(true)}
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

  if (storyComplete) {
    return (
      <div className="max-w-3xl mx-auto flex flex-col items-center">
        <h2 className="text-3xl font-extrabold text-center mb-6" style={{ color: '#8C1515' }}>
          Your Story
        </h2>
        <div className="bg-white rounded-lg shadow-lg p-8 w-full" style={{ borderLeft: '8px solid #8C1515' }}>
          <h3 className="text-xl font-bold mb-4" style={{ color: '#2E2D29' }}>
            {story?.prompt}
          </h3>
          <div className="text-gray-800 whitespace-pre-line mb-6">
            {story?.content.map((sentence, index) => (
              <p key={index} className="mb-2">{sentence}</p>
            ))}
          </div>
          <button
            onClick={handlePlayAgain}
            className="px-8 py-3 rounded-md font-bold text-lg transition-colors duration-150"
            style={{ backgroundColor: '#8C1515', color: 'white' }}
          >
            Play Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto flex flex-col items-center">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full" style={{ borderLeft: '8px solid #8C1515' }}>
        <h3 className="text-xl font-bold mb-4" style={{ color: '#2E2D29' }}>
          {story?.prompt}
        </h3>
        {story && story.content.length > 0 && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="text-gray-800 whitespace-pre-line">
              {story.content.map((sentence, index) => (
                <p key={index} className="mb-2">{sentence}</p>
              ))}
            </div>
          </div>
        )}
        {showNewChoice && (
          <div className="mb-4 p-4 bg-red-50 rounded-lg text-red-700 font-semibold">
            NEW CHOICE! Try a different sentence.
          </div>
        )}
        <textarea
          ref={inputRef}
          value={userInput}
          onChange={handleInputChange}
          className="w-full h-32 p-4 border rounded-lg resize-none text-[#2E2D29] placeholder-[#6B4C3B] mb-4"
          style={{ borderColor: '#8C1515' }}
          placeholder="Add your next sentence..."
        />
        <div className="flex justify-between">
          <button
            onClick={handleSubmit}
            className="px-6 py-2 rounded-md font-bold text-lg transition-colors duration-150"
            style={{ backgroundColor: '#8C1515', color: 'white' }}
          >
            Submit
          </button>
          <button
            onClick={handleEndStory}
            className="px-6 py-2 rounded-md font-bold text-lg transition-colors duration-150"
            style={{ backgroundColor: '#2E2D29', color: 'white' }}
          >
            End Story
          </button>
        </div>
      </div>
    </div>
  );
} 