import { ReactNode } from 'react';

interface WeekLayoutProps {
  children: ReactNode;
  currentWeek: number;
  onWeekChange: (week: number) => void;
}

export default function WeekLayout({ children, currentWeek, onWeekChange }: WeekLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg border-b-4" style={{ borderBottomColor: '#8C1515' }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="h-16 flex items-center">
            <div className="flex space-x-4 justify-center w-full">
              {Array.from({ length: 10 }, (_, i) => i + 1).map((week) => (
                <button
                  key={week}
                  onClick={() => onWeekChange(week)}
                  className={`px-5 py-2 rounded-md text-base font-semibold transition-colors duration-150
                    ${currentWeek === week
                      ? 'text-white shadow-lg'
                      : 'hover:bg-[#8C1515] hover:text-white'}
                  `}
                  style={{ minWidth: 100, backgroundColor: currentWeek === week ? '#8C1515' : 'white', color: currentWeek === week ? 'white' : '#2E2D29', border: '1px solid #8C1515' }}
                >
                  {week === 10 ? 'Conclusions' : `Week ${week === 9 ? '9+' : week}`}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
} 