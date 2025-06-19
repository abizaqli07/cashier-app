"use client";

import { IconClockPlay, IconClockStop } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { formatTime } from "~/lib/utils";
import { api } from "~/trpc/react";

const EmployeeClock = () => {
  const utils = api.useUtils();

  const [recentClock] = api.employeeRoute.clocking.getOne.useSuspenseQuery();
  const [clockId, setClockId] = useState<string>(recentClock.data?.id ?? "");

  const startClock = api.employeeRoute.clocking.startClock.useMutation({
    async onSuccess(data) {
      toast("Start Clock", {
        description: "Enjoy your work, good luck",
        position: "top-center",
      });
      setClockId(data[0]?.id ?? "");
      await utils.employeeRoute.clocking.getAll.invalidate();
    },
    onError(error) {
      toast("Error", {
        description: error.message,
      });
    },
  });
  const stopClock = api.employeeRoute.clocking.stopClock.useMutation({
    async onSuccess(data) {
      toast("Stopping Clock", {
        description: `Good job, you have been working for ${formatTime(data[0]?.totalHour ?? 0)}`,
        position: "top-center",
      });
      await utils.employeeRoute.clocking.getAll.invalidate();
    },
    onError(error) {
      toast("Error", {
        description: error.message,
      });
    },
  });

  const [isRunning, setIsRunning] = useState(!recentClock.isStopping);
  const [seconds, setSeconds] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(
    recentClock.data?.start ?? null,
  );

  useEffect(() => {
    if (!recentClock.isStopping) {
      const started = new Date(recentClock.data?.start ?? "");
      const now = new Date();
      const elapsed = Math.floor((now.getTime() - started.getTime()) / 1000);
      setStartTime(started);
      setSeconds(elapsed);
      setIsRunning(true);
    }
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning) {
      timer = setInterval(() => setSeconds((prev) => prev + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning]);

  const handleStart = () => {
    const now = new Date();
    setStartTime(now);
    setIsRunning(true);
    startClock.mutate({
      date: now,
      start: now,
    });
  };

  const handleStop = () => {
    const stopTime = new Date();
    const totalSeconds = seconds;
    setSeconds(0);
    setIsRunning(false);
    setStartTime(null);
    stopClock.mutate({
      clockId: clockId,
      stop: stopTime,
      totalHour: totalSeconds,
    });
  };

  return (
    <div>
      {isRunning ? (
        <div
          className="flex w-full items-center gap-2"
          onClick={() => handleStop()}
        >
          <IconClockStop />
          <span>{formatTime(seconds)}</span>
        </div>
      ) : (
        <div
          className="flex w-full items-center gap-2"
          onClick={() => handleStart()}
        >
          <IconClockPlay />
          <span>Start Clock</span>
        </div>
      )}
    </div>
  );
};

export default EmployeeClock;
