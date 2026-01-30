
import React, { useState, useEffect, useCallback } from 'react';
import { LAUNCH_DATE } from '../constants';
import { CountdownTime } from '../types';

const Countdown: React.FC = () => {
  const calculateTimeLeft = useCallback((): CountdownTime => {
    const difference = +LAUNCH_DATE - +new Date();
    let timeLeft: CountdownTime = { days: 0, hours: 0, minutes: 0, seconds: 0 };

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  }, []);

  const [timeLeft, setTimeLeft] = useState<CountdownTime>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  const TimeBox = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center min-w-[60px] md:min-w-[100px]">
      <span className="text-4xl sm:text-5xl md:text-7xl font-light tracking-tighter mb-2 tabular-nums">
        {formatNumber(value)}
      </span>
      <span className="text-[8px] md:text-[10px] uppercase tracking-[0.3em] md:tracking-[0.4em] text-white/40">{label}</span>
    </div>
  );

  return (
    <div className="flex justify-center items-center gap-4 sm:gap-8 md:gap-16 my-10 md:my-20 w-full overflow-hidden">
      <TimeBox value={timeLeft.days} label="Days" />
      <TimeBox value={timeLeft.hours} label="Hours" />
      <TimeBox value={timeLeft.minutes} label="Mins" />
      <TimeBox value={timeLeft.seconds} label="Secs" />
    </div>
  );
};

export default Countdown;
