(function economicsCalculatorCore(globalScope) {
  "use strict";

  class EconomicsError extends Error {
    constructor(message) { super(message); this.name = "EconomicsError"; }
  }

  function finite(value, label, options = {}) {
    const number = Number(value);
    if (!Number.isFinite(number)) throw new EconomicsError(`${label} must be a finite number.`);
    if (options.min != null && number < options.min) throw new EconomicsError(`${label} must be at least ${options.min}.`);
    if (options.max != null && number > options.max) throw new EconomicsError(`${label} must be at most ${options.max}.`);
    return number;
  }

  function periodsPerYear(value) {
    const aliases = { annual: 1, semiannual: 2, quarterly: 4, monthly: 12, daily: 365 };
    const periods = aliases[value] || Number(value);
    if (!Number.isInteger(periods) || periods < 1 || periods > 366) throw new EconomicsError("Compounding periods must be a whole number from 1 to 366.");
    return periods;
  }

  function yearFraction(days, basis = 365) {
    const dayCount = finite(days, "Days");
    const denominator = finite(basis, "Day-count basis", { min: 1 });
    return dayCount / denominator;
  }

  function simpleInterest(principal, annualRatePercent, years) {
    const amount = finite(principal, "Principal");
    const rate = finite(annualRatePercent, "Annual rate") / 100;
    const duration = finite(years, "Years", { min: 0 });
    const interest = amount * rate * duration;
    return { principal: amount, interest, futureValue: amount + interest, assumption: "Simple interest: P × r × t" };
  }

  function compoundInterest(principal, annualRatePercent, years, compounding = 12) {
    const amount = finite(principal, "Principal");
    const periods = periodsPerYear(compounding);
    const duration = finite(years, "Years", { min: 0 });
    const rate = finite(annualRatePercent, "Annual rate") / 100;
    if (1 + rate / periods < 0) throw new EconomicsError("The periodic rate cannot make the compounding factor negative.");
    const futureValue = amount * (1 + rate / periods) ** (periods * duration);
    return { principal: amount, interest: futureValue - amount, futureValue, periods, assumption: `Nominal annual rate compounded ${periods} times per year` };
  }

  function nominalToEAR(nominalPercent, compounding = 12) {
    const periods = periodsPerYear(compounding);
    const nominal = finite(nominalPercent, "Nominal rate") / 100;
    if (1 + nominal / periods < 0) throw new EconomicsError("The periodic rate is below −100%.");
    return ((1 + nominal / periods) ** periods - 1) * 100;
  }

  function earToNominal(earPercent, compounding = 12) {
    const periods = periodsPerYear(compounding);
    const ear = finite(earPercent, "Effective annual rate") / 100;
    if (ear < -1) throw new EconomicsError("EAR cannot be below −100%.");
    return periods * ((1 + ear) ** (1 / periods) - 1) * 100;
  }

  function savingsFV(payment, annualRatePercent, years, compounding = 12, due = false) {
    const contribution = finite(payment, "Periodic payment");
    const periods = periodsPerYear(compounding);
    const count = Math.round(finite(years, "Years", { min: 0 }) * periods);
    const rate = finite(annualRatePercent, "Annual rate") / 100 / periods;
    const value = rate === 0 ? contribution * count : contribution * (((1 + rate) ** count - 1) / rate) * (due ? 1 + rate : 1);
    return { futureValue: value, contributions: contribution * count, interest: value - contribution * count, periods: count, due };
  }

  function paymentForLoan(principal, annualRatePercent, months) {
    const amount = finite(principal, "Principal", { min: 0 });
    const count = finite(months, "Months", { min: 1 });
    if (!Number.isInteger(count)) throw new EconomicsError("Months must be a whole number.");
    const rate = finite(annualRatePercent, "Annual rate") / 1200;
    if (rate <= -1) throw new EconomicsError("Monthly rate must be above −100%.");
    return rate === 0 ? amount / count : amount * rate / (1 - (1 + rate) ** -count);
  }

  function amortization(options) {
    const principal = finite(options.principal, "Principal", { min: 0 });
    const months = finite(options.months, "Months", { min: 1 });
    if (!Number.isInteger(months) || months > 1200) throw new EconomicsError("Months must be a whole number from 1 to 1200.");
    const annualRatePercent = finite(options.annualRatePercent, "Annual rate");
    const payment = paymentForLoan(principal, annualRatePercent, months);
    const monthlyRate = annualRatePercent / 1200;
    let balance = principal;
    const schedule = [];
    for (let month = 1; month <= months; month += 1) {
      const interest = balance * monthlyRate;
      const principalPaid = month === months ? balance : payment - interest;
      balance = Math.max(0, balance - principalPaid);
      schedule.push({ month, payment: month === months ? principalPaid + interest : payment, principal: principalPaid, interest, balance });
    }
    const totalPayment = schedule.reduce((sum, row) => sum + row.payment, 0);
    const earlyFee = finite(options.earlyRepaymentFee ?? 0, "Early repayment fee");
    const rebate = finite(options.cashRebate ?? 0, "Cash rebate");
    return { payment, schedule, totalPayment, totalInterest: totalPayment - principal, scenarioCost: totalPayment + earlyFee - rebate, principal, months, annualRatePercent };
  }

  function mortgageComparison(options) {
    const pRate = finite(options.pRate, "P rate");
    const pAdjustment = finite(options.pAdjustment ?? 0, "P-plan adjustment");
    const hibor = finite(options.hibor, "HIBOR");
    const hSpread = finite(options.hSpread ?? 0, "H-plan spread");
    const capAdjustment = finite(options.capAdjustment ?? 0, "P-rate cap adjustment");
    const pPlanRate = pRate + pAdjustment;
    const uncappedHRate = hibor + hSpread;
    const capRate = pRate + capAdjustment;
    const hPlanRate = Math.min(uncappedHRate, capRate);
    const shared = { principal: options.principal, months: options.months, earlyRepaymentFee: options.earlyRepaymentFee, cashRebate: options.cashRebate };
    return { pPlanRate, uncappedHRate, capRate, hPlanRate, capApplied: uncappedHRate > capRate, pPlan: amortization({ ...shared, annualRatePercent: pPlanRate }), hPlan: amortization({ ...shared, annualRatePercent: hPlanRate }) };
  }

  function npv(rate, cashFlows) {
    const r = finite(rate, "Periodic discount rate");
    if (r <= -1) throw new EconomicsError("Discount rate must be above −100%.");
    if (!Array.isArray(cashFlows) || cashFlows.length < 2) throw new EconomicsError("Provide at least two cash flows.");
    return cashFlows.reduce((sum, flow, index) => sum + finite(flow, `Cash flow ${index}`) / (1 + r) ** index, 0);
  }

  function irr(cashFlows, options = {}) {
    if (!Array.isArray(cashFlows) || cashFlows.length < 2 || !cashFlows.some((v) => Number(v) < 0) || !cashFlows.some((v) => Number(v) > 0)) throw new EconomicsError("IRR requires at least one positive and one negative cash flow.");
    let low = options.low ?? -0.999999;
    let high = options.high ?? 10;
    let lowValue = npv(low, cashFlows);
    let highValue = npv(high, cashFlows);
    while (Math.sign(lowValue) === Math.sign(highValue) && high < 1e8) { high *= 10; highValue = npv(high, cashFlows); }
    if (Math.sign(lowValue) === Math.sign(highValue)) throw new EconomicsError("No IRR root was found in the supported range.");
    for (let iteration = 0; iteration < 200; iteration += 1) {
      const mid = (low + high) / 2;
      const value = npv(mid, cashFlows);
      if (Math.abs(value) < 1e-10) return mid;
      if (Math.sign(value) === Math.sign(lowValue)) { low = mid; lowValue = value; } else { high = mid; highValue = value; }
    }
    return (low + high) / 2;
  }

  function feeAwareAPR(options) {
    const amount = finite(options.principal, "Principal", { min: 0 });
    const fees = finite(options.upfrontFees ?? 0, "Upfront fees");
    const months = finite(options.months, "Months", { min: 1 });
    if (!Number.isInteger(months)) throw new EconomicsError("Months must be a whole number.");
    const payment = options.payment == null ? paymentForLoan(amount, options.annualRatePercent, months) : finite(options.payment, "Payment");
    const netProceeds = amount - fees;
    if (netProceeds <= 0) throw new EconomicsError("Net proceeds must remain positive after fees.");
    const monthlyIRR = irr([-netProceeds, ...Array(months).fill(payment)]);
    return { netProceeds, payment, monthlyIRR, nominalAnnualPercent: monthlyIRR * 12 * 100, effectiveAnnualPercent: ((1 + monthlyIRR) ** 12 - 1) * 100, disclaimer: "Educational fee-aware IRR estimate; not an official HKAB APR quotation." };
  }

  function presentValue(futureValue, annualRatePercent, years, compounding = 1) {
    const periods = periodsPerYear(compounding);
    return finite(futureValue, "Future value") / (1 + finite(annualRatePercent, "Annual rate") / 100 / periods) ** (periods * finite(years, "Years"));
  }
  function futureValue(present, annualRatePercent, years, compounding = 1) { return compoundInterest(present, annualRatePercent, years, compounding).futureValue; }
  function realReturn(nominalPercent, inflationPercent) { return ((1 + finite(nominalPercent, "Nominal return") / 100) / (1 + finite(inflationPercent, "Inflation") / 100) - 1) * 100; }
  function percentChange(oldValue, newValue) { const old = finite(oldValue, "Old value"); if (old === 0) throw new EconomicsError("Percentage change is undefined from zero."); return (finite(newValue, "New value") - old) / Math.abs(old) * 100; }

  function normaliseCurrency(value) {
    const code = String(value || "").trim().toUpperCase();
    if (!/^[A-Z]{3}$/.test(code)) throw new EconomicsError("Currency must be a three-letter ISO code.");
    return code;
  }

  function parseFrankfurterRates(payload, base, quote) {
    const baseCode = normaliseCurrency(base);
    const quoteCode = normaliseCurrency(quote);
    if (baseCode === quoteCode) return { base: baseCode, quote: quoteCode, rate: 1, inverseRate: 1, date: null, provider: "identity" };
    const rows = Array.isArray(payload) ? payload : Array.isArray(payload?.rates) ? payload.rates : [];
    const matching = rows.filter((row) => row && String(row.base).toUpperCase() === baseCode && String(row.quote).toUpperCase() === quoteCode && Number.isFinite(Number(row.rate)) && Number(row.rate) > 0 && /^\d{4}-\d{2}-\d{2}$/.test(String(row.date)));
    if (!matching.length) throw new EconomicsError("FX response is missing a valid requested rate.");
    matching.sort((a, b) => String(b.date).localeCompare(String(a.date)));
    const row = matching[0];
    const rate = Number(row.rate);
    return { base: baseCode, quote: quoteCode, rate, inverseRate: 1 / rate, date: row.date, provider: "Frankfurter / ECB reference rates" };
  }

  function convertFX(amount, rate, base, quote) {
    const value = finite(amount, "Amount");
    const source = normaliseCurrency(base);
    const target = normaliseCurrency(quote);
    const effectiveRate = source === target ? 1 : finite(rate, "Exchange rate", { min: Number.MIN_VALUE });
    return { amount: value, converted: value * effectiveRate, rate: effectiveRate, inverseRate: 1 / effectiveRate, base: source, quote: target };
  }

  function recordDate(record, dateFields = ["end_of_day", "effective_date", "record_date", "date"] ) {
    for (const field of dateFields) {
      const value = record?.[field];
      if (value && !Number.isNaN(Date.parse(String(value)))) return String(value).slice(0, 10);
    }
    return null;
  }

  function latestValidRecord(payload, requiredFields, dateFields) {
    const records = Array.isArray(payload) ? payload : payload?.result?.records;
    if (!Array.isArray(records)) throw new EconomicsError("Official API response has no records array.");
    const candidates = records.map((record) => ({ record, date: recordDate(record, dateFields) })).filter(({ record, date }) => date && requiredFields.every((field) => record[field] !== null && record[field] !== "" && Number.isFinite(Number(record[field]))));
    if (!candidates.length) throw new EconomicsError("Official API response has no complete dated record.");
    candidates.sort((a, b) => b.date.localeCompare(a.date));
    return candidates[0];
  }

  function latestMappedRecord(payload, fieldAliases, dateFields) {
    const records = Array.isArray(payload) ? payload : payload?.result?.records;
    if (!Array.isArray(records)) throw new EconomicsError("Official API response has no records array.");
    const candidates = records.map((record) => {
      const values = {};
      for (const [name, aliases] of Object.entries(fieldAliases)) {
        const field = aliases.find((alias) => record?.[alias] !== null && record?.[alias] !== "" && Number.isFinite(Number(record?.[alias])));
        if (field) values[name] = Number(record[field]);
      }
      return { record, values, date: recordDate(record, dateFields) };
    }).filter((item) => item.date && Object.keys(fieldAliases).every((name) => Number.isFinite(item.values[name])));
    if (!candidates.length) throw new EconomicsError("Official API response has no complete dated record.");
    candidates.sort((a, b) => b.date.localeCompare(a.date));
    return candidates[0];
  }

  function parseHKMARates(payloads) {
    const blr = latestMappedRecord(payloads.blr, { bestLendingRate: ["best_lending_rate", "ir_best_lending_rate"] });
    const hibor = latestMappedRecord(payloads.hibor, {
      overnight: ["ir_overnight", "hibor_fixing_overnight", "hibor_overnight"],
      "1w": ["ir_1w", "hibor_fixing_1w", "hibor_1w"],
      "1m": ["ir_1m", "hibor_fixing_1m", "hibor_1m"],
      "3m": ["ir_3m", "hibor_fixing_3m", "hibor_3m"],
      "6m": ["ir_6m", "hibor_fixing_6m", "hibor_6m"],
      "12m": ["ir_12m", "hibor_fixing_12m", "hibor_12m"],
    });
    const base = latestMappedRecord(payloads.baseRate, { baseRate: ["base_rate", "discount_window_base_rate"] });
    const depositField = ["savings_deposit_rate", "ir_savings_deposit_rate"].find((field) => blr.record[field] !== null && blr.record[field] !== "" && Number.isFinite(Number(blr.record[field])));
    return {
      bestLendingRate: blr.values.bestLendingRate, bestLendingRateDate: blr.date,
      depositRate: depositField ? Number(blr.record[depositField]) : null,
      hibor: hibor.values, hiborDate: hibor.date,
      baseRate: base.values.baseRate, baseRateDate: base.date,
      disclaimer: "Best lending rate is the HSBC quoted rate in this HKMA series and does not represent every bank.",
    };
  }

  function cacheSnapshot(data, fetchedAt = Date.now()) { return { version: 1, fetchedAt: finite(fetchedAt, "Fetch time", { min: 0 }), data }; }
  function inspectCache(snapshot, maxAgeMs, now = Date.now()) {
    if (!snapshot || snapshot.version !== 1 || !Number.isFinite(Number(snapshot.fetchedAt)) || !("data" in snapshot)) throw new EconomicsError("Cached data is malformed.");
    const ageMs = Math.max(0, finite(now, "Current time") - Number(snapshot.fetchedAt));
    return { data: snapshot.data, fetchedAt: Number(snapshot.fetchedAt), ageMs, stale: ageMs > finite(maxAgeMs, "Cache maximum age", { min: 0 }) };
  }

  function budgetSummary(categories, income = 0) {
    if (!Array.isArray(categories)) throw new EconomicsError("Budget categories must be a list.");
    const rows = categories.map((entry, index) => ({ name: String(entry.name || `Category ${index + 1}`), amount: finite(entry.amount, `Category ${index + 1}`) }));
    const expenses = rows.reduce((sum, row) => sum + row.amount, 0);
    const incomeValue = finite(income, "Income");
    return { categories: rows, income: incomeValue, expenses, savings: incomeValue - expenses, savingsRate: incomeValue === 0 ? null : (incomeValue - expenses) / incomeValue * 100 };
  }

  const api = Object.freeze({ EconomicsError, finite, periodsPerYear, yearFraction, simpleInterest, compoundInterest, nominalToEAR, earToNominal, savingsFV, paymentForLoan, amortization, mortgageComparison, npv, irr, feeAwareAPR, presentValue, futureValue, realReturn, percentChange, normaliseCurrency, parseFrankfurterRates, convertFX, latestValidRecord, latestMappedRecord, parseHKMARates, cacheSnapshot, inspectCache, budgetSummary });
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (globalScope) globalScope.EconomicsCalculatorCore = api;
})(typeof window !== "undefined" ? window : globalThis);
