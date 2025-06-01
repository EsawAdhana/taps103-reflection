'use client';

import { useState } from 'react';
import WeekLayout from '@/components/WeekLayout';
import Week1 from '@/components/Week1';
import Week2 from '@/components/Week2';
import Week3 from '@/components/Week3';
import Week4 from '@/components/Week4';
import Week5 from '@/components/Week5';
import Week6 from '@/components/Week6';
import Week7 from '@/components/Week7';
import Week8 from '@/components/Week8';
import Week9 from '@/components/Week9';
import Conclusions from '@/components/Conclusions';

export default function Home() {
  const [currentWeek, setCurrentWeek] = useState(1);

  const renderWeekContent = () => {
    switch (currentWeek) {
      case 1:
        return <Week1 />;
      case 2:
        return <Week2 />;
      case 3:
        return <Week3 />;
      case 4:
        return <Week4 onComplete={() => setCurrentWeek(5)} />;
      case 5:
        return <Week5 onComplete={() => setCurrentWeek(6)} />;
      case 6:
        return <Week6 onComplete={() => setCurrentWeek(7)} />;
      case 7:
        return <Week7 onComplete={() => setCurrentWeek(8)} />;
      case 8:
        return <Week8 onComplete={() => setCurrentWeek(9)} />;
      case 9:
        return <Week9 onComplete={() => setCurrentWeek(10)} />;
      case 10:
        return <Conclusions />;
      default:
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Week {currentWeek}</h2>
            <p className="text-gray-600">Coming soon...</p>
          </div>
        );
    }
  };

  return (
    <WeekLayout currentWeek={currentWeek} onWeekChange={setCurrentWeek}>
      {renderWeekContent()}
    </WeekLayout>
  );
}
