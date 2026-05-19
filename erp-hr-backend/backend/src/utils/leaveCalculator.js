function calculateLeaveDays(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    throw new Error('Gecersiz tarih');
  }
  if (end < start) {
    throw new Error('Bitis tarihi baslangic tarihinden once olamaz');
  }
  const milliseconds = end - start;
  const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24)) + 1;
  return days;
}

module.exports = { calculateLeaveDays };
