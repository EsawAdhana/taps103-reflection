import { useState, useEffect, useRef } from 'react';

interface Story {
  id: number;
  prompt: string;
  content: string[]; // One entry per round
}

const PROMPT_POOL = [
  '(Setting) The Louvre',
  '(Setting) Rooftop garden',
  '(Setting) Deserted island',
  '(Setting) Busy subway',
  '(Character) Upset magician',
  '(Character) Sleepy astronaut',
  '(Character) Nervous chef',
  '(Character) Overworked detective',
  '(Object) Lost umbrella',
  '(Object) Mysterious letter',
  '(Object) Ancient coin',
  '(Object) Broken watch',
];

const TRANSITION_POOL = [
  'The next day...',
  'After finishing that...',
  'Immediately after...',
  'A month later...',
  'That next evening...'
];

export default function Week7() {
  const [started, setStarted] = useState(false);
  const [currentRound, setCurrentRound] = useState(0);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [stories, setStories] = useState<Story[]>([]);
  const [timeLeft, setTimeLeft] = useState(10);
  const [showTransition, setShowTransition] = useState(false);
  const [userInput, setUserInput] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [showSummary, setShowSummary] = useState(false);
  const [selectedTransitions, setSelectedTransitions] = useState<string[]>([]); // 2 transitions for rounds 2 and 3

  // Initialize stories and transitions at the start
  useEffect(() => {
    if (started && stories.length === 0) {
      // Pick 4 unique prompts
      const shuffledPrompts = [...PROMPT_POOL].sort(() => Math.random() - 0.5);
      const initialStories = shuffledPrompts.slice(0, 4).map((prompt, index) => ({
        id: index,
        prompt,
        content: ["", "", ""] // 3 rounds
      }));
      setStories(initialStories);
      // Pick 2 unique transitions for rounds 2 and 3
      const shuffledTransitions = [...TRANSITION_POOL].sort(() => Math.random() - 0.5);
      setSelectedTransitions(shuffledTransitions.slice(0, 2));
    }
  }, [started, stories.length]);

  // Timer logic
  useEffect(() => {
    if (started && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      // Save the current input to the story's content for this round
      setStories(prevStories => {
        const updated = prevStories.map((story, idx) => {
          if (idx !== currentStoryIndex) return story;
          const newContent = [...story.content];
          newContent[currentRound] = userInput;
          return { ...story, content: newContent };
        });
        return updated;
      });
      // Automatically switch to next story or round
      setTimeout(() => {
        setTimeLeft(10); // Reset timer for next story to 10 seconds
        setUserInput('');
        if (currentStoryIndex < 3) {
          setCurrentStoryIndex(prev => prev + 1);
        } else {
          if (currentRound < 2) {
            setShowTransition(true);
            setTimeout(() => {
              setShowTransition(false);
              setCurrentRound(prev => prev + 1);
              setCurrentStoryIndex(0);
            }, 2000);
          } else {
            // Game complete: show summary page
            setShowSummary(true);
          }
        }
      }, 400); // Small delay for UX
    }
  }, [started, timeLeft, currentStoryIndex, currentRound]);

  // Auto-focus input when switching stories
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
    // Set the input to the previous value for this story/round (if any)
    setUserInput(stories[currentStoryIndex]?.content[currentRound] || '');
  }, [currentStoryIndex, currentRound, stories]);

  // Handle user input separately
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserInput(e.target.value);
    setStories(prevStories => {
      const updated = prevStories.map((story, idx) => {
        if (idx !== currentStoryIndex) return story;
        const newContent = [...story.content];
        newContent[currentRound] = e.target.value;
        return { ...story, content: newContent };
      });
      return updated;
    });
  };

  if (!started) {
    return (
      <div className="max-w-3xl mx-auto flex flex-col items-center">
        <h2 className="text-3xl font-extrabold text-center mb-6" style={{ color: '#8C1515' }}>
          Week 7: Switch Left Game
        </h2>
        <div className="bg-white rounded-lg shadow-lg p-8 w-full" style={{ borderLeft: '8px solid #8C1515' }}>
          <div className="flex flex-col items-center gap-6">
            <h3 className="text-xl font-bold text-center" style={{ color: '#2E2D29' }}>
              Welcome to the Switch Left Game!
            </h3>
            <ul className="text-lg text-center mb-4" style={{ color: '#2E2D29' }}>
              <li className="mb-2">• You&apos;ll be writing 4 different stories simultaneously</li>
              <li className="mb-2">• Each story gets 10 seconds of writing time before switching</li>
              <li className="mb-2">• After completing the 4 stories, a transition will be presented and you&apos;ll continue</li>
              <li className="mb-2">• This will happen 3 times total</li>
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

  if (showSummary) {
    return (
      <div className="max-w-3xl mx-auto flex flex-col items-center">
        <h2 className="text-3xl font-extrabold text-center mb-6" style={{ color: '#8C1515' }}>
          Your Stories
        </h2>
        <div className="space-y-8 w-full">
          {stories.map((story, idx) => (
            <div key={story.id} className="bg-white rounded-lg shadow-lg p-6 w-full" style={{ borderLeft: '8px solid #8C1515' }}>
              <h3 className="text-xl font-bold mb-2" style={{ color: '#2E2D29' }}>
                Story {idx + 1}: {story.prompt}
              </h3>
              <div className="text-gray-800 whitespace-pre-line">
                {story.content.map((text, roundIdx) => (
                  <div key={roundIdx}>
                    {roundIdx > 0 && (
                      <div className="text-[#8C1515] font-semibold mb-1">
                        {selectedTransitions[roundIdx - 1]}
                      </div>
                    )}
                    <div>{text}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={() => {
            setStarted(false);
            setCurrentRound(0);
            setCurrentStoryIndex(0);
            setStories([]);
            setTimeLeft(10);
            setShowTransition(false);
            setUserInput('');
            setShowSummary(false);
            setSelectedTransitions([]);
          }}
          className="mt-8 px-8 py-3 rounded-md font-bold text-lg transition-colors duration-150"
          style={{ backgroundColor: '#8C1515', color: 'white' }}
        >
          Play Again
        </button>
      </div>
    );
  }

  if (showTransition) {
    return (
      <div className="max-w-3xl mx-auto flex flex-col items-center">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full text-center" style={{ borderLeft: '8px solid #8C1515' }}>
          <h3 className="text-2xl font-bold" style={{ color: '#2E2D29' }}>
            {selectedTransitions[currentRound]}
          </h3>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto flex flex-col items-center">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full" style={{ borderLeft: '8px solid #8C1515' }}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold" style={{ color: '#2E2D29' }}>
            Round {currentRound + 1}/3
          </h3>
          <div className="text-lg font-semibold" style={{ color: '#8C1515' }}>
            Time: {timeLeft}s
          </div>
        </div>
        <div className="mb-4">
          <h4 className="text-lg font-semibold mb-2" style={{ color: '#2E2D29' }}>
            Story {currentStoryIndex + 1}/4: {stories[currentStoryIndex]?.prompt}
          </h4>
          {currentRound > 0 && (
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-600 italic">Previous content:</p>
              <div className="text-gray-800 whitespace-pre-line">
                {Array.from({ length: currentRound }).map((_, idx) => (
                  <div key={idx}>
                    {idx > 0 && (
                      <div className="text-[#8C1515] font-semibold mb-1">
                        {selectedTransitions[idx - 1]}
                      </div>
                    )}
                    <div>{stories[currentStoryIndex].content[idx]}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {currentRound > 0 && (
            <div className="mb-2 text-[#8C1515] font-semibold">
              {selectedTransitions[currentRound - 1]}
            </div>
          )}
          <textarea
            ref={inputRef}
            value={userInput}
            onChange={handleInputChange}
            className="w-full h-48 p-4 border rounded-lg resize-none text-[#2E2D29] placeholder-[#6B4C3B]"
            style={{ borderColor: '#8C1515' }}
            placeholder={currentRound === 0 ? "Start writing your story..." : "Continue the story..."}
            disabled={timeLeft === 0}
          />
        </div>
      </div>
    </div>
  );
} 