import { useState } from 'react';

interface Week5Props {
}

interface StoryBlock {
  sentenceA: string;
  sentenceB: string;
  sentenceC: string;
  order: 'ABC' | 'CBA' | 'BAC' | 'CAB' | 'ACB' | 'BCA';
}

type OrderArray = Array<'A' | 'B' | 'C'>;

export default function Week5() {
  const [started, setStarted] = useState(false);
  const [currentBlock, setCurrentBlock] = useState<StoryBlock | null>(null);
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
  const [blocks, setBlocks] = useState<StoryBlock[]>([]);
  const [sentenceB, setSentenceB] = useState('');
  const [showConclude, setShowConclude] = useState(false);
  const [orderArray, setOrderArray] = useState<OrderArray>(['A', 'B', 'C']);

  const handleSentencesSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newSentences: string[] = [];
    for (let i = 0; i < 10; i++) {
      const sentence = formData.get(`sentence${i}`) as string;
      if (sentence.trim()) {
        newSentences.push(sentence.trim());
      }
    }
    if (newSentences.length === 10) {
      generateBlocks(newSentences);
      setStarted(true);
    }
  };

  const generateBlocks = (sentences: string[]) => {
    const newBlocks: StoryBlock[] = [];
    const availableSentences = [...sentences];
    for (let i = 0; i < 5; i++) {
      const randomIndexA = Math.floor(Math.random() * availableSentences.length);
      const sentenceA = availableSentences.splice(randomIndexA, 1)[0];
      const randomIndexC = Math.floor(Math.random() * availableSentences.length);
      const sentenceC = availableSentences.splice(randomIndexC, 1)[0];
      newBlocks.push({
        sentenceA,
        sentenceB: '',
        sentenceC,
        order: 'ABC', // default order
      });
    }
    setBlocks(newBlocks);
    setCurrentBlock(newBlocks[0]);
    setOrderArray(['A', 'B', 'C']);
  };

  const handleSentenceBSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentBlock) return;
    const orderString = orderArray.join('') as StoryBlock['order'];
    const updatedBlocks = [...blocks];
    updatedBlocks[currentBlockIndex] = {
      ...currentBlock,
      sentenceB,
      order: orderString,
    };
    setBlocks(updatedBlocks);
    if (currentBlockIndex < blocks.length - 1) {
      setCurrentBlockIndex(prev => prev + 1);
      setCurrentBlock(blocks[currentBlockIndex + 1]);
      setSentenceB('');
      setOrderArray(['A', 'B', 'C']);
    } else {
      setShowConclude(true);
    }
  };

  const moveRow = (index: number, direction: -1 | 1) => {
    setOrderArray(prev => {
      const newOrder = [...prev];
      const target = index + direction;
      if (target < 0 || target > 2) return prev;
      [newOrder[index], newOrder[target]] = [newOrder[target], newOrder[index]];
      return newOrder;
    });
  };

  const renderSentenceOrder = (block: StoryBlock, previewOrder?: OrderArray) => {
    const sentences = {
      A: block.sentenceA,
      B: block.sentenceB || '_________________',
      C: block.sentenceC,
    };
    const orderToUse = previewOrder || (block.order.split('') as OrderArray);
    return orderToUse.map((letter, idx) => (
      <div key={letter} className="mb-4 p-4 bg-gray-50 rounded-lg flex items-center" style={{ color: '#2E2D29' }}>
        <span className="flex-1">{sentences[letter]}</span>
        {previewOrder && (
          <div className="flex flex-col ml-2">
            <button
              type="button"
              aria-label="Move up"
              disabled={idx === 0}
              onClick={() => moveRow(idx, -1)}
              className={`px-2 py-1 mb-1 rounded ${idx === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gray-200'}`}
              style={{ color: '#2E2D29', background: 'white', border: '1px solid #8C1515' }}
            >
              ▲
            </button>
            <button
              type="button"
              aria-label="Move down"
              disabled={idx === 2}
              onClick={() => moveRow(idx, 1)}
              className={`px-2 py-1 rounded ${idx === 2 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gray-200'}`}
              style={{ color: '#2E2D29', background: 'white', border: '1px solid #8C1515' }}
            >
              ▼
            </button>
          </div>
        )}
      </div>
    ));
  };

  if (!started) {
    return (
      <div className="max-w-3xl mx-auto flex flex-col items-center">
        <h2 className="text-3xl font-extrabold text-center mb-6" style={{ color: '#8C1515' }}>
          Week 5: Story Connections
        </h2>
        <div className="bg-white rounded-lg shadow-lg p-8 w-full" style={{ borderLeft: '8px solid #8C1515' }}>
          <div className="flex flex-col items-center gap-6">
            <h3 className="text-xl font-bold text-center" style={{ color: '#2E2D29' }}>
              Welcome to Story Connections!
            </h3>
            <ul className="text-lg text-center mb-4" style={{ color: '#2E2D29' }}>
              <li className="mb-2">• Provide 10 <em>unrelated</em> sentences (of the same tense) which could be lines in a story</li>
              <li className="mb-2">• For example: &quot;The alligator looked at its son longingly.&quot;</li>
            </ul>
            <form onSubmit={handleSentencesSubmit} className="w-full space-y-4">
              {Array.from({ length: 10 }, (_, i) => (
                <div key={i} className="flex flex-col">
                  <label htmlFor={`sentence${i}`} className="mb-2" style={{ color: '#2E2D29' }}>
                    Sentence {i + 1}:
                  </label>
                  <input
                    type="text"
                    id={`sentence${i}`}
                    name={`sentence${i}`}
                    required
                    className="w-full p-2 border-2 rounded-md focus:outline-none"
                    style={{ borderColor: '#8C1515', color: '#2E2D29', backgroundColor: 'white' }}
                  />
                </div>
              ))}
              <button
                type="submit"
                className="w-full px-8 py-3 rounded-md font-bold text-lg transition-colors duration-150"
                style={{ backgroundColor: '#8C1515', color: 'white' }}
              >
                Begin Story Connections
              </button>
            </form>
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
            Story Connections Complete!
          </h3>
          <div className="space-y-6">
            {blocks.map((block, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-bold mb-2" style={{ color: '#8C1515' }}>Block {index + 1}</h4>
                {renderSentenceOrder(block)}
              </div>
            ))}
          </div>
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => {
                setStarted(false);
                setCurrentBlock(null);
                setCurrentBlockIndex(0);
                setBlocks([]);
                setSentenceB('');
                setShowConclude(false);
                setOrderArray(['A', 'B', 'C']);
              }}
              className="px-8 py-3 rounded-md font-bold text-lg transition-colors duration-150"
              style={{ backgroundColor: '#8C1515', color: 'white' }}
            >
              Play Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentBlock) return null;

  return (
    <div className="max-w-3xl mx-auto flex flex-col items-center">
      <h2 className="text-3xl font-extrabold text-center mb-6" style={{ color: '#8C1515' }}>
        Week 5: Story Connections
      </h2>
      <div className="bg-white rounded-lg shadow-lg p-8 w-full" style={{ borderLeft: '8px solid #8C1515' }}>
        <div className="flex flex-col items-center gap-6">
          <h3 className="text-xl font-bold text-center" style={{ color: '#2E2D29' }}>
            Block {currentBlockIndex + 1} of 5
          </h3>
          <div className="w-full space-y-4">
            <label className="block mb-2 font-semibold" style={{ color: '#2E2D29' }}>
              Arrange the order by moving the rows up or down:
            </label>
            {renderSentenceOrder({ ...currentBlock, sentenceB }, orderArray)}
          </div>
          <form onSubmit={handleSentenceBSubmit} className="w-full space-y-4">
            <div className="flex flex-col">
              <label htmlFor="sentenceB" className="mb-2" style={{ color: '#2E2D29' }}>
                Write a sentence that connects these two sentences:
              </label>
              <textarea
                id="sentenceB"
                value={sentenceB}
                onChange={(e) => setSentenceB(e.target.value)}
                required
                className="w-full p-2 border-2 rounded-md focus:outline-none h-32"
                style={{ borderColor: '#8C1515', color: '#2E2D29', backgroundColor: 'white' }}
              />
            </div>
            <button
              type="submit"
              className="w-full px-8 py-3 rounded-md font-bold text-lg transition-colors duration-150"
              style={{ backgroundColor: '#8C1515', color: 'white' }}
            >
              Submit Connection
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 