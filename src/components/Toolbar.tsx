'use client';

import { useState } from 'react';
import { Pencil, Type } from 'lucide-react';

export function Toolbar() {
  const [activeTool, setActiveTool] = useState<'pen' | 'text'>('pen');

  return (
    <div className="w-16 bg-background border-l flex flex-col items-center py-4 space-y-4">
      <button
        onClick={() => setActiveTool('pen')}
        className={`w-12 h-12 flex items-center justify-center rounded-md border-2 transition-colors duration-150 ${activeTool === 'pen' ? 'bg-[#8C1515] text-white border-[#8C1515]' : 'bg-white text-[#2E2D29] border-gray-300 hover:bg-gray-100'}`}
        aria-label="Pen tool"
      >
        <Pencil className="w-6 h-6" />
      </button>
      <button
        onClick={() => setActiveTool('text')}
        className={`w-12 h-12 flex items-center justify-center rounded-md border-2 transition-colors duration-150 ${activeTool === 'text' ? 'bg-[#8C1515] text-white border-[#8C1515]' : 'bg-white text-[#2E2D29] border-gray-300 hover:bg-gray-100'}`}
        aria-label="Text tool"
      >
        <Type className="w-6 h-6" />
      </button>
    </div>
  );
} 