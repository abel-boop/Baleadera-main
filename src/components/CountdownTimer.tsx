import { useState, useEffect } from 'react';

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    // Set the target date to 9 days from now
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 9);
    
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      // Calculate time remaining
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });

      if (distance < 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

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
    <div className="w-full max-w-4xl mx-auto bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-border/50 mt-8 sm:mt-12">
      <h3 className="text-center text-lg sm:text-xl font-semibold text-foreground mb-4">
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
