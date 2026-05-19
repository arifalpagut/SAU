function round2(num) {
  return Math.round((Number(num) + Number.EPSILON) * 100) / 100;
}

function calculatePayroll({ grossSalary, additions = 0 }) {
  const gross = Number(grossSalary || 0);
  const extra = Number(additions || 0);
  const totalGross = gross + extra;

  const sgkEmployee = round2(totalGross * 0.14);
  const unemploymentEmployee = round2(totalGross * 0.01);
  const taxableBase = round2(totalGross - sgkEmployee - unemploymentEmployee);
  const incomeTax = round2(taxableBase * 0.15);
  const stampTax = round2(totalGross * 0.00759);
  const totalDeductions = round2(sgkEmployee + unemploymentEmployee + incomeTax + stampTax);
  const netSalary = round2(totalGross - totalDeductions);

  const items = [
    { itemType: 'EARNING', itemName: 'Brut Maas', amount: gross },
    { itemType: 'EARNING', itemName: 'Ek Odemeler', amount: extra },
    { itemType: 'DEDUCTION', itemName: 'SGK Isci Payi', amount: sgkEmployee },
    { itemType: 'DEDUCTION', itemName: 'Issizlik Sigortasi Isci Payi', amount: unemploymentEmployee },
    { itemType: 'DEDUCTION', itemName: 'Gelir Vergisi', amount: incomeTax },
    { itemType: 'DEDUCTION', itemName: 'Damga Vergisi', amount: stampTax }
  ];

  return { grossSalary: round2(gross), totalAdditions: round2(extra), totalDeductions, netSalary, items };
}

module.exports = { calculatePayroll };
