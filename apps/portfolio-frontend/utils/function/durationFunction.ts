import { intervalToDuration, parseISO,format } from "date-fns";

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


export const formatDateRange = (start: string, end: string): string => {
  const startDate = parseISO(start);
  const endDate = parseISO(end);

  const formattedStart = format(startDate, "MMM yyyy");
  const formattedEnd = format(endDate, "MMM yyyy");

  return `${formattedStart} - ${formattedEnd}`;
};
