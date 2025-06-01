import { useState } from 'react';

interface ResponseOption {
  text: string;
  employeeChange: number; // bossChange will be -employeeChange
}

interface DialogueBlock {
  boss: string;
  options: ResponseOption[];
}

const dialogueBlocks: DialogueBlock[] = [
  {
    boss: "You're late. Why should I not fire you right now?",
    options: [
      {
        text: "Are you serious? I told you about my dentist appointment yesterday. See you in 20 minutes.",
        employeeChange: 2
      },
      {
        text: "Sorry, I had nobody to watch the baby and got stuck in traffic. It won't happen again. Please, I really need this job right now.",
        employeeChange: -2
      },
      {
        text: "Sorry, I woke up late. I'll clock in earlier tomorrow to make up for it.",
        employeeChange: -1
      }
    ]
  },
  {
    boss: "Okay, and what's the status of your project?",
    options: [
      {
        text: "Report is done, and I hope you like it!",
        employeeChange: -1
      },
      {
        text: "Work in progress still.",
        employeeChange: 0
      },
      {
        text: "My progress is up to date on the JIRA board.",
        employeeChange: 1
      }
    ]
  },
  {
    boss: "Sounds good. And then are you still available for our team's dinner after work?",
    options: [
      {
        text: "I'm allergic to fish, as I've told you a million times. Why on earth would you think I'd want to go to Nobu?",
        employeeChange: 2
      },
      {
        text: "*Leaves on read*",
        employeeChange: 1
      },
      {
        text: "Oh, of course, I wouldn't miss this for the world! Need a ride?",
        employeeChange: -1
      }
    ]
  }
];

export default function Week6() {
  const [started, setStarted] = useState(false);
  const [currentBlock, setCurrentBlock] = useState(0);
  // Start at neutral (0, 0)
  const [employeeStatus, setEmployeeStatus] = useState(0);
  const [bossStatus, setBossStatus] = useState(0);
  const [messages, setMessages] = useState<{ text: string; sender: 'boss' | 'employee' }[]>([
    { text: dialogueBlocks[0].boss, sender: 'boss' }
  ]);
  const [showConclude, setShowConclude] = useState(false);

  const handleOptionSelect = (option: ResponseOption) => {
    setMessages(prev => [...prev, { text: option.text, sender: 'employee' }]);
    setEmployeeStatus(prev => prev + option.employeeChange);
    setBossStatus(prev => prev - option.employeeChange);
    if (currentBlock < dialogueBlocks.length - 1) {
      const nextBlock = currentBlock + 1;
      setTimeout(() => {
        setMessages(prev => [...prev, { text: dialogueBlocks[nextBlock].boss, sender: 'boss' }]);
        setCurrentBlock(nextBlock);
      }, 400);
    } else {
      setTimeout(() => setShowConclude(true), 400);
    }
  };

  const renderStatusBar = (status: number, label: string) => (
    <div className="w-full mb-4">
      <div className="flex justify-between mb-1">
        <span className="font-semibold" style={{ color: '#2E2D29' }}>{label}</span>
      </div>
      <div className="w-full h-4 bg-gray-200 rounded-full relative">
        <div className="absolute inset-0 flex justify-between px-2 text-xs text-gray-500">
          <span>Low Status</span>
          <span>High Status</span>
        </div>
        <div
          className="h-4 rounded-full transition-all duration-300"
          style={{
            width: '4px',
            backgroundColor: '#8C1515',
            position: 'absolute',
            left: `${((status + 5) / 10) * 100}%`,
            transform: 'translateX(-50%)'
          }}
        />
      </div>
    </div>
  );

  if (!started) {
    return (
      <div className="max-w-3xl mx-auto flex flex-col items-center">
        <h2 className="text-3xl font-extrabold text-center mb-6" style={{ color: '#8C1515' }}>
          Week 6: Status Dynamics
        </h2>
        <div className="bg-white rounded-lg shadow-lg p-8 w-full" style={{ borderLeft: '8px solid #8C1515' }}>
          <div className="flex flex-col items-center gap-6">
            <h3 className="text-xl font-bold text-center" style={{ color: '#2E2D29' }}>
              Welcome to Status Dynamics!
            </h3>
            <ul className="text-lg text-center mb-4" style={{ color: '#2E2D29' }}>
              <li className="mb-2">• In this exercise, you&apos;ll engage in a conversation between a boss and an employee</li>
              <li className="mb-2">• Observe how different responses affect the status dynamics between them</li>
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

  if (showConclude) {
    return (
      <div className="max-w-3xl mx-auto flex flex-col items-center">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full" style={{ borderLeft: '8px solid #8C1515' }}>
          <h3 className="text-2xl font-bold text-center mb-6" style={{ color: '#2E2D29' }}>
            Conversation Complete!
          </h3>
          <div className="space-y-6">
            {renderStatusBar(bossStatus, "Boss Status")}
            {renderStatusBar(employeeStatus, "Employee Status")}
            <div className="text-center mt-8">
              <p className="text-lg mb-4" style={{ color: '#2E2D29' }}>
                Notice how the status markers moved throughout the conversation.
                Each response subtly shifted the power dynamic between the characters.
              </p>
              <button
                onClick={() => {
                  setStarted(false);
                  setCurrentBlock(0);
                  setEmployeeStatus(0);
                  setBossStatus(0);
                  setMessages([{ text: dialogueBlocks[0].boss, sender: 'boss' }]);
                  setShowConclude(false);
                }}
                className="px-8 py-3 rounded-md font-bold text-lg transition-colors duration-150"
                style={{ backgroundColor: '#8C1515', color: 'white' }}
              >
                Play Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto flex flex-col items-center">
      <h2 className="text-3xl font-extrabold text-center mb-6" style={{ color: '#8C1515' }}>
        Week 6: Status Dynamics
      </h2>
      <div className="bg-white rounded-lg shadow-lg p-8 w-full" style={{ borderLeft: '8px solid #8C1515' }}>
        <div className="flex flex-col items-center gap-6">
          {renderStatusBar(bossStatus, "Boss Status")}
          {renderStatusBar(employeeStatus, "Employee Status")}
          <div className="w-full space-y-6">
            <div className="space-y-4 max-h-[400px] overflow-y-auto p-4 bg-gray-50 rounded-lg">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.sender === 'boss' ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.sender === 'boss'
                        ? 'bg-gray-100 border-2 border-gray-200'
                        : 'bg-[#8C1515] text-white'
                    }`}
                    style={
                      message.sender === 'boss'
                        ? { color: '#2E2D29' }
                        : { color: 'white' }
                    }
                  >
                    <p className="text-sm font-semibold mb-1">
                      {message.sender === 'boss' ? 'Boss' : 'You'}
                    </p>
                    <p>{message.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-3">
              {dialogueBlocks[currentBlock].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleOptionSelect(option)}
                  className="w-full p-4 text-left rounded-md font-medium border-2 transition-colors duration-150 hover:bg-gray-50"
                  style={{ borderColor: '#8C1515', color: '#2E2D29' }}
                >
                  {option.text}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 