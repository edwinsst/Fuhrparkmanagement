const TIME_REGEX = /(?<hour>[0-9]{2}):(?<minute>[0-9]{2})/

export function parseTime(time: string | null): [number, number] {
  if (!time) {
    return [99, 99];
  }
  const timeRegexMatch = String(time).match(TIME_REGEX);
  if (timeRegexMatch?.groups) {
    const hour = parseInt(timeRegexMatch.groups['hour']);
    const minute = parseInt(timeRegexMatch.groups['minute']);
    return [hour, minute];
  }
  return [99, 99];
}

export function getDateWithTime(date: Date, time: [number, number]): Date {
  date = new Date(date.getTime());
  date.setHours(time[0]);
  date.setMinutes(time[1]);
  return date;
}

export function formatDateTime(date: Date | null, timeStr: string | null): string {
  if (!date || !timeStr) {
    return '';
  }
  return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()} (${timeStr} Uhr)`;
}

export function toTimeString(date: Date): string {
  // TODO: research
  const hour = (date.getHours() - 1).toString().padStart(2, '0');
  const minute = date.getMinutes().toString().padStart(2, '0');
  return `${hour}:${minute}`;
}

export function formatDateTimeISO8601(date: Date, timeStr: string): string {
  const year = date.getFullYear().toString().padStart(4, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}T${timeStr}:00.000Z`;
}
