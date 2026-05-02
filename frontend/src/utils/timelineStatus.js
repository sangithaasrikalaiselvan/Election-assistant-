const parseDate = (value) => new Date(`${value}T00:00:00`);

export const getTimelineStatus = (today, startDate, endDate) => {
  const start = parseDate(startDate);
  const end = parseDate(endDate);

  if (today > end) {
    return "COMPLETED";
  }
  if (today >= start && today <= end) {
    return "ACTIVE";
  }
  return "UPCOMING";
};

export const formatTimelineRange = (startDate, endDate) => `${startDate} to ${endDate}`;
