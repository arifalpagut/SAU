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

function calculateAnnualLeaveEntitlement(hireDate, dateOfBirth) {
  const now = new Date();
  const hire = new Date(hireDate);
  const birth = new Date(dateOfBirth);

  // Kidem yili hesapla
  let seniority = now.getFullYear() - hire.getFullYear();
  const hireAnniversary = new Date(hire);
  hireAnniversary.setFullYear(now.getFullYear());
  if (now < hireAnniversary) seniority--;

  // Yas hesapla
  let age = now.getFullYear() - birth.getFullYear();
  const birthday = new Date(birth);
  birthday.setFullYear(now.getFullYear());
  if (now < birthday) age--;

  // 1 yildan az calisma suresi = 0 gun
  if (seniority < 1) {
    return { days: 0, seniority, age, rule: 'Kidem 1 yildan az' };
  }

  let days;
  let rule;

  // Kidem bazli hesaplama
  if (seniority >= 15) {
    days = 26;
    rule = 'Kidem >= 15 yil';
  } else if (seniority >= 5) {
    days = 20;
    rule = 'Kidem 5-14 yil';
  } else {
    days = 14;
    rule = 'Kidem 1-4 yil';
  }

  // Yas korumasi: 18 ve alti veya 50 ve ustu ise minimum 20 gun
  if ((age <= 18 || age >= 50) && days < 20) {
    days = 20;
    rule += ' + Yas korumasi (min 20 gun)';
  }

  return { days, seniority, age, rule };
}

module.exports = {
  calculateLeaveDays,
  calculateAnnualLeaveEntitlement
};
