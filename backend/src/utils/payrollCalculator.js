function round2(num) {
  return Math.round((Number(num) + Number.EPSILON) * 100) / 100;
}
function getRate(params, name, defaultValue) {
  if (!params || !params[name]) return defaultValue;
  return Number(params[name]);
}
function validateInput(value, fieldName) {
  var num = Number(value || 0);
  if (Number.isNaN(num)) throw new Error(fieldName + ' gecerli bir sayi olmalidir');
  if (num < 0) throw new Error(fieldName + ' negatif olamaz');
  return round2(num);
}
function calculatePayroll(input, params) {
  params = params || {};
  var grossSalary = validateInput(input.grossSalary, 'Brut maas');
  var bonusPayment = validateInput(input.bonusPayment, 'Ek odeme');
  var overtimePayment = validateInput(input.overtimePayment, 'Fazla mesai');
  var transportationAllowance = validateInput(input.transportationAllowance, 'Yol yardimi');
  var mealAllowance = validateInput(input.mealAllowance, 'Yemek yardimi');
  var otherEarnings = validateInput(input.otherEarnings, 'Diger kazanclar');
  var besDeduction = validateInput(input.besDeduction, 'BES kesintisi');
  var advanceDeduction = validateInput(input.advanceDeduction, 'Avans kesintisi');
  var enforcementDeduction = validateInput(input.enforcementDeduction, 'Icra kesintisi');
  var otherDeductionsInput = validateInput(input.otherDeductions, 'Diger kesintiler');
  var employeeSgkRate = getRate(params, 'employee_sgk_rate', 0.14);
  var employeeUnemploymentRate = getRate(params, 'employee_unemployment_rate', 0.01);
  var employerSgkRate = getRate(params, 'employer_sgk_rate', 0.205);
  var employerUnemploymentRate = getRate(params, 'employer_unemployment_rate', 0.02);
  var incomeTaxRate = getRate(params, 'income_tax_rate', 0.15);
  var stampTaxRate = getRate(params, 'stamp_tax_rate', 0.00759);
  var totalGrossEarnings = round2(grossSalary + bonusPayment + overtimePayment + transportationAllowance + mealAllowance + otherEarnings);
  if (totalGrossEarnings <= 0) throw new Error('Toplam brut kazanc sifirdan buyuk olmalidir');
  var employeeSgkPremium = round2(totalGrossEarnings * employeeSgkRate);
  var employeeUnemploymentPremium = round2(totalGrossEarnings * employeeUnemploymentRate);
  var incomeTaxBase = round2(totalGrossEarnings - employeeSgkPremium - employeeUnemploymentPremium);
  var incomeTax = round2(incomeTaxBase * incomeTaxRate);
  var stampTax = round2(totalGrossEarnings * stampTaxRate);
  var totalLegalDeductions = round2(employeeSgkPremium + employeeUnemploymentPremium + incomeTax + stampTax);
  var totalOtherDeductions = round2(besDeduction + advanceDeduction + enforcementDeduction + otherDeductionsInput);
  var totalDeductions = round2(totalLegalDeductions + totalOtherDeductions);
  var netSalary = round2(totalGrossEarnings - totalDeductions);
  var employerSgkPremium = round2(totalGrossEarnings * employerSgkRate);
  var employerUnemploymentPremium = round2(totalGrossEarnings * employerUnemploymentRate);
  var totalEmployerCost = round2(totalGrossEarnings + employerSgkPremium + employerUnemploymentPremium);
  var items = [
    { itemType: 'EARNING', itemName: 'Brut Maas', amount: grossSalary },
    { itemType: 'EARNING', itemName: 'Ek Odeme', amount: bonusPayment },
    { itemType: 'EARNING', itemName: 'Fazla Mesai', amount: overtimePayment },
    { itemType: 'EARNING', itemName: 'Yol Yardimi', amount: transportationAllowance },
    { itemType: 'EARNING', itemName: 'Yemek Yardimi', amount: mealAllowance },
    { itemType: 'EARNING', itemName: 'Diger Kazanclar', amount: otherEarnings },
    { itemType: 'DEDUCTION', itemName: 'SGK Isci Primi', amount: employeeSgkPremium },
    { itemType: 'DEDUCTION', itemName: 'Issizlik Isci Payi', amount: employeeUnemploymentPremium },
    { itemType: 'DEDUCTION', itemName: 'Gelir Vergisi', amount: incomeTax },
    { itemType: 'DEDUCTION', itemName: 'Damga Vergisi', amount: stampTax },
    { itemType: 'DEDUCTION', itemName: 'BES Kesintisi', amount: besDeduction },
    { itemType: 'DEDUCTION', itemName: 'Avans Kesintisi', amount: advanceDeduction },
    { itemType: 'DEDUCTION', itemName: 'Icra Kesintisi', amount: enforcementDeduction },
    { itemType: 'DEDUCTION', itemName: 'Diger Kesintiler', amount: otherDeductionsInput },
    { itemType: 'EMPLOYER', itemName: 'SGK Isveren Primi', amount: employerSgkPremium },
    { itemType: 'EMPLOYER', itemName: 'Issizlik Isveren Primi', amount: employerUnemploymentPremium }
  ].filter(function(item) { return item.amount > 0; });
  return {
    grossSalary: grossSalary, bonusPayment: bonusPayment, overtimePayment: overtimePayment,
    transportationAllowance: transportationAllowance, mealAllowance: mealAllowance, otherEarnings: otherEarnings,
    totalGrossEarnings: totalGrossEarnings, employeeSgkPremium: employeeSgkPremium,
    employeeUnemploymentPremium: employeeUnemploymentPremium, incomeTaxBase: incomeTaxBase,
    incomeTax: incomeTax, stampTax: stampTax, besDeduction: besDeduction, advanceDeduction: advanceDeduction,
    enforcementDeduction: enforcementDeduction, otherDeductions: otherDeductionsInput,
    totalLegalDeductions: totalLegalDeductions, totalOtherDeductions: totalOtherDeductions,
    totalDeductions: totalDeductions,
    totalAdditions: round2(bonusPayment + overtimePayment + transportationAllowance + mealAllowance + otherEarnings),
    netSalary: netSalary, employerSgkPremium: employerSgkPremium,
    employerUnemploymentPremium: employerUnemploymentPremium, totalEmployerCost: totalEmployerCost,
    appliedRates: { employeeSgkRate: employeeSgkRate, employeeUnemploymentRate: employeeUnemploymentRate, employerSgkRate: employerSgkRate, employerUnemploymentRate: employerUnemploymentRate, incomeTaxRate: incomeTaxRate, stampTaxRate: stampTaxRate },
    items: items
  };
}
module.exports = { calculatePayroll: calculatePayroll, validateInput: validateInput, round2: round2 };