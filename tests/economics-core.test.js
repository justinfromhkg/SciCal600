const test = require("node:test");
const assert = require("node:assert/strict");
const core = require("../economics-core.js");

function closeTo(actual, expected, tolerance = 1e-8) { assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} ≉ ${expected}`); }

test("calculates interest with explicit compounding and day-count assumptions", () => {
  assert.deepEqual(core.simpleInterest(1000, 5, 2), { principal:1000, interest:100, futureValue:1100, assumption:"Simple interest: P × r × t" });
  closeTo(core.compoundInterest(1000, 12, 1, "monthly").futureValue, 1126.8250301319697);
  closeTo(core.nominalToEAR(12, 12), 12.682503013196978);
  closeTo(core.earToNominal(core.nominalToEAR(12,12),12), 12);
  assert.equal(core.yearFraction(366, 366), 1);
  assert.equal(core.savingsFV(100, 0, 1, 12).futureValue, 1200);
  assert.equal(core.compoundInterest(1000, -5, 0, 12).futureValue, 1000);
});

test("creates zero-rate and negative-rate amortization without NaN", () => {
  const zero = core.amortization({ principal:1200, annualRatePercent:0, months:12 });
  assert.equal(zero.payment, 100);
  assert.equal(zero.schedule.at(-1).balance, 0);
  const negative = core.amortization({ principal:1000, annualRatePercent:-1, months:12 });
  assert.ok(negative.payment < 1000/12);
  assert.equal(negative.schedule.length, 12);
  assert.throws(() => core.amortization({ principal:1000, annualRatePercent:5, months:0 }), core.EconomicsError);
});

test("compares Hong Kong P-plan and capped H-plan as scenarios", () => {
  const output = core.mortgageComparison({ principal:1e6, months:240, pRate:5.25, pAdjustment:-2.25, hibor:4.5, hSpread:1.3, capAdjustment:-2.0 });
  assert.equal(output.pPlanRate, 3);
  assert.equal(output.uncappedHRate, 5.8);
  assert.equal(output.hPlanRate, 3.25);
  assert.equal(output.capApplied, true);
});

test("estimates fee-aware APR by IRR and handles large amounts", () => {
  const output = core.feeAwareAPR({ principal:1e9, upfrontFees:1e6, annualRatePercent:3, months:24 });
  assert.ok(output.effectiveAnnualPercent > 3);
  closeTo(core.npv(output.monthlyIRR, [-output.netProceeds, ...Array(24).fill(output.payment)]), 0, 0.001);
  assert.match(output.disclaimer, /Educational/);
});

test("validates fixed Frankfurter mock responses, identity pairs and malformed data", () => {
  const mock = [
    { date:"2026-09-03", base:"HKD", quote:"USD", rate:0.1281 },
    { date:"2026-09-04", base:"HKD", quote:"USD", rate:0.1282 },
  ];
  const rate = core.parseFrankfurterRates(mock, "HKD", "USD");
  assert.equal(rate.date, "2026-09-04");
  assert.equal(core.convertFX(100, rate.rate, "HKD", "USD").converted, 12.82);
  assert.equal(core.parseFrankfurterRates(null, "HKD", "HKD").rate, 1);
  assert.throws(() => core.parseFrankfurterRates([{date:"bad",base:"HKD",quote:"USD",rate:null}], "HKD", "USD"), core.EconomicsError);
});

test("selects latest complete HKMA mock records instead of array order", () => {
  const blr = { result:{ records:[{effective_date:"2026-08-01",best_lending_rate:"5.5"},{effective_date:"2026-09-01",best_lending_rate:"5.25",savings_deposit_rate:"0.125"}] } };
  const hiborValues = { ir_overnight:"4",ir_1w:"4.1",ir_1m:"4.2",ir_3m:"4.3",ir_6m:"4.4",ir_12m:"4.5" };
  const hibor = { result:{ records:[{end_of_day:"2026-09-03",...hiborValues},{end_of_day:"2026-09-04",...hiborValues,ir_1m:"4.25"},{end_of_day:"2026-09-05",...hiborValues,ir_1m:null}] } };
  const baseRate = { result:{ records:[{end_of_day:"2026-09-03",base_rate:"4.75"},{end_of_day:"2026-09-04",base_rate:"4.5"}] } };
  const output = core.parseHKMARates({blr,hibor,baseRate});
  assert.equal(output.bestLendingRateDate,"2026-09-01");
  assert.equal(output.hiborDate,"2026-09-04");
  assert.equal(output.hibor["1m"],4.25);
  assert.equal(output.baseRate,4.5);
  assert.throws(() => core.parseHKMARates({blr:{result:{records:[]}},hibor,baseRate}), core.EconomicsError);

  const aliased = core.parseHKMARates({
    blr:{result:{records:[{effective_date:"2026-09-02",ir_best_lending_rate:"5.1",ir_savings_deposit_rate:"0.1"}]}},
    hibor:{result:{records:[{end_of_day:"2026-09-04",hibor_fixing_overnight:"4",hibor_fixing_1w:"4.1",hibor_fixing_1m:"4.2",hibor_fixing_3m:"4.3",hibor_fixing_6m:"4.4",hibor_fixing_12m:"4.5"}]}},
    baseRate:{result:{records:[{end_of_day:"2026-09-04",discount_window_base_rate:"4.6"}]}},
  });
  assert.equal(aliased.bestLendingRate,5.1);
  assert.equal(aliased.hibor["12m"],4.5);
  assert.equal(aliased.baseRate,4.6);
});

test("marks last-success cache stale and rejects malformed snapshots", () => {
  const snapshot = core.cacheSnapshot({rate:1.2}, 1000);
  assert.equal(core.inspectCache(snapshot, 500, 1400).stale, false);
  assert.equal(core.inspectCache(snapshot, 500, 1600).stale, true);
  assert.throws(() => core.inspectCache({fetchedAt:null}, 500, 1600), core.EconomicsError);
});

test("calculates supporting finance and budget tools", () => {
  closeTo(core.presentValue(110,10,1),100);
  closeTo(core.realReturn(5,2),2.941176470588225);
  assert.equal(core.percentChange(100,125),25);
  assert.deepEqual(core.budgetSummary([{name:"Rent",amount:600},{name:"Food",amount:200}],1000), {categories:[{name:"Rent",amount:600},{name:"Food",amount:200}],income:1000,expenses:800,savings:200,savingsRate:20});
  assert.throws(() => core.percentChange(0,1), core.EconomicsError);
});
