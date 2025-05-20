import { intervalToDuration, parseISO } from "date-fns";

const getDuration = (start: string, end: string): string => {
  const startDate = parseISO(start);
  const endDate = parseISO(end);

  const duration = intervalToDuration({ start: startDate, end: endDate });

  const { years, months, days } = duration;

  let result = '';
  if (years) result += `${years} yr `;
  if (months) result += `${months} mo `;
  if (days) result += `${days} days`;

  return result.trim() || '0 days';
};

export default getDuration