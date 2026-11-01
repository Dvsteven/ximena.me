import { useEffect, useState } from "react";

// Diferencia calendario entre startDate y endDate (por defecto, ahora).
function diff(startDate, endDate) {
  const start = new Date(startDate).getTime();
  const now = endDate ? new Date(endDate).getTime() : Date.now();
  const ms = Math.max(0, now - start);

  const totalSeconds = Math.floor(ms / 1000);
  const totalDays = Math.floor(totalSeconds / 86400);

  // Años/meses/días aproximados a calendario real (no solo división de días)
  const startD = new Date(start);
  const nowD = new Date(now);
  let years = nowD.getFullYear() - startD.getFullYear();
  let months = nowD.getMonth() - startD.getMonth();
  let days = nowD.getDate() - startD.getDate();
  if (days < 0) {
    months -= 1;
    const prevMonth = new Date(nowD.getFullYear(), nowD.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { years, months, days, hours, minutes, seconds, totalDays };
}

// Devuelve el tiempo transcurrido desde startDate.
// - Sin endDate: se actualiza cada segundo (contador en vivo).
// - Con endDate: se calcula una sola vez y queda detenido en esa fecha.
export function useElapsedTime(startDate, endDate = null) {
  const [elapsed, setElapsed] = useState(() => diff(startDate, endDate));

  useEffect(() => {
    if (endDate) {
      setElapsed(diff(startDate, endDate));
      return undefined;
    }
    const id = setInterval(() => setElapsed(diff(startDate, null)), 1000);
    return () => clearInterval(id);
  }, [startDate, endDate]);

  return elapsed;
}
