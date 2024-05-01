import { useMemo } from 'react';

function Component({ url }: { url: string }) {
  const selectedDateMin3DaysDifference = useMemo(() => {
    const diff = today.diff(selectedDate, "days");
    return diff > 3 || diff < -3;
  }, [today, selectedDate]);
}