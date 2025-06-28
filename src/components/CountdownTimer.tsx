import { useState, useEffect } from 'react';

// Extended deadline: July 1, 2025 at 11:59:59 PM (EAT - East Africa Time)
const getTargetDate = () => {
  // Extended by 3 days from the original deadline (June 28 → July 1)
  return new Date('2025-07-01T23:59:59+03:00');
};

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const targetDate = getTargetDate();
    
    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      // Calculate time remaining
      const days = Math.max(0, Math.floor(distance / (1000 * 60 * 60 * 24)));
      const hours = Math.max(0, Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
      const minutes = Math.max(0, Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)));
      const seconds = Math.max(0, Math.floor((distance % (1000 * 60)) / 1000));

      setTimeLeft({ days, hours, minutes, seconds });

      if (distance < 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };
    
    // Initial call to set the countdown immediately
    updateCountdown();
    
    // Then update every second
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  const TimeBox = ({ value, label }: { value: number, label: string }) => (
    <div className="flex flex-col items-center">
      <div className="w-16 sm:w-20 h-16 sm:h-20 bg-gradient-to-br from-blue-600 to-red-600 rounded-lg flex items-center justify-center text-white text-2xl sm:text-3xl font-bold shadow-lg">
        {value.toString().padStart(2, '0')}
      </div>
      <span className="text-xs sm:text-sm text-muted-foreground mt-2">{label}</span>
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center w-full mt-auto pt-8">
      <div className="animate-bounce mb-4 px-4 py-2 bg-gradient-to-r from-red-500 to-yellow-500 text-white text-sm font-bold rounded-full shadow-lg transform rotate-[-3deg] hover:rotate-0 transition-transform duration-300">
        🎉 Deadline Extended! 🎉
      </div>
      <h3 className="text-xl md:text-2xl font-bold text-foreground mb-4 text-center">
        Registration Deadline
      </h3>
      <div className="flex justify-center gap-3 sm:gap-6">
        <TimeBox value={timeLeft.days} label="Days" />
        <div className="flex items-center text-2xl font-bold text-foreground/50">:</div>
        <TimeBox value={timeLeft.hours} label="Hours" />
        <div className="flex items-center text-2xl font-bold text-foreground/50">:</div>
        <TimeBox value={timeLeft.minutes} label="Minutes" />
        <div className="flex items-center text-2xl font-bold text-foreground/50">:</div>
        <TimeBox value={timeLeft.seconds} label="Seconds" />
      </div>
    </div>
  );
};

export default CountdownTimer;
