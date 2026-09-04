"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const core = require("../calculator-core.js");
const data = require("../calculator-data.js");

function closeTo(actual, expected, tolerance = 1e-10) {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} should be close to ${expected}`);
}

test("respects scientific calculation priority", () => {
  assert.equal(core.evaluate("2+3×4^2"), 50);
  assert.equal(core.evaluate("-2^2"), -4);
  assert.equal(core.evaluate("2^-3"), 0.125);
});

test("supports implicit multiplication and constants", () => {
  closeTo(core.evaluate("2π"), 2 * Math.PI);
  assert.equal(core.evaluate("2(3+4)"), 14);
});

test("uses the configured angle unit", () => {
  closeTo(core.evaluate("sin(30)", { angle: "DEG" }), 0.5);
  closeTo(core.evaluate("sin(π÷2)", { angle: "RAD" }), 1);
  closeTo(core.evaluate("cos(100)", { angle: "GRAD" }), 0, 1e-12);
  closeTo(core.evaluate("asin(0.5)", { angle: "DEG" }), 30);
});

test("supports common scientific functions", () => {
  assert.equal(core.evaluate("sqrt(81)+cbrt(27)"), 12);
  assert.equal(core.evaluate("log(1000)+ln(e)"), 4);
  closeTo(core.evaluate("pow10(2)+exp(0)"), 101);
  assert.equal(core.evaluate("abs(-7)"), 7);
});

test("supports factorial, permutation, combination and percentage", () => {
  assert.equal(core.evaluate("5!"), 120);
  assert.equal(core.evaluate("10 nPr 3"), 720);
  assert.equal(core.evaluate("10 nCr 3"), 120);
  assert.equal(core.evaluate("200×15%"), 30);
});

test("supports Ans and independent memory", () => {
  assert.equal(core.evaluate("Ans×M+2", { ans: 4, memory: 5 }), 22);
});

test("supports roots and deterministic random injection", () => {
  assert.equal(core.evaluate("root(81,4)"), 3);
  assert.equal(core.evaluate("root(-27,3)"), -3);
  assert.equal(core.evaluate("ran()", { random: () => 0.25 }), 0.25);
});

test("formats normal, fixed and scientific results", () => {
  assert.equal(core.formatResult(1 / 8), "0.125");
  assert.equal(core.formatResult(1 / 8, { format: "FIX", digits: 4 }), "0.1250");
  assert.equal(core.formatResult(12345, { format: "SCI", digits: 4 }), "1.235×10^4");
});

test("converts decimal results to fractions and DMS", () => {
  assert.equal(core.toFraction(0.75), "3⌟4");
  assert.equal(core.toFraction(7 / 3), "2 1⌟3");
  assert.equal(core.toDms(12.5), "12°30′0″");
});

test("reports invalid calculations as calculator errors", () => {
  assert.throws(() => core.evaluate("1÷0"), core.CalculatorError);
  assert.throws(() => core.evaluate("(-1)!"), core.CalculatorError);
  assert.throws(() => core.evaluate("sqrt(-1)"), core.CalculatorError);
});

test("evaluates and formats rectangular and polar complex numbers", () => {
  const sum = core.evaluateComplex("(2+3i)+(4-5i)");
  closeTo(sum.re, 6);
  closeTo(sum.im, -2);

  const product = core.evaluateComplex("(1+i)^2");
  closeTo(product.re, 0, 1e-12);
  closeTo(product.im, 2);

  const polar = core.evaluateComplex("2∠90", { angle: "DEG" });
  closeTo(polar.re, 0, 1e-12);
  closeTo(polar.im, 2);
  assert.equal(core.formatComplex(sum), "6 − 2i");
  assert.equal(core.formatComplex(polar, { form: "POLAR", angle: "DEG" }), "2∠90");
});

test("performs base-n arithmetic, conversion and logic", () => {
  assert.equal(core.evaluateBase("1010 + 1", 2), 11);
  assert.equal(core.evaluateBase("1F + 1", 16), 32);
  assert.equal(core.evaluateBase("1111 AND 1010", 2), 10);
  assert.equal(core.evaluateBase("12 XOR 10", 10), 6);
  assert.equal(core.formatBase(30, 2), "11110");
  assert.equal(core.formatBase(30, 8), "36");
  assert.equal(core.formatBase(30, 16), "1E");
  assert.equal(core.evaluateBase("1111111111", 2), -1);
  assert.equal(core.evaluateBase("7777777777", 8), -1);
  assert.equal(core.evaluateBase("FFFFFFFF", 16), -1);
  assert.equal(core.formatBase(-1, 2), "1111111111");
  assert.equal(core.formatBase(-1, 8), "7777777777");
  assert.equal(core.evaluateBase("hF + d1", 2), 16);
  assert.equal(core.evaluateBase("101 XNOR 11", 2), -7);
  assert.throws(() => core.evaluateBase("10000000000", 2), core.CalculatorError);
});

test("calculates weighted single-variable statistics", () => {
  const stats = core.statistics([{ x: 1, freq: 1 }, { x: 3, freq: 2 }]);
  assert.equal(stats.n, 3);
  assert.equal(stats.sum, 7);
  assert.equal(stats.sumSquares, 19);
  closeTo(stats.mean, 7 / 3);
  assert.equal(stats.min, 1);
  assert.equal(stats.max, 3);
});

test("supports linear and quadratic regression", () => {
  const samples = [{ x: 1, y: 3 }, { x: 2, y: 5 }, { x: 3, y: 7 }];
  const linear = core.regression(samples, "LIN");
  closeTo(linear.a, 1);
  closeTo(linear.b, 2);
  closeTo(linear.r, 1);
  closeTo(linear.predict(4), 9);

  const quadratic = core.regression([{ x: 1, y: 1 }, { x: 2, y: 4 }, { x: 3, y: 9 }], "QUAD");
  closeTo(quadratic.a, 0);
  closeTo(quadratic.b, 0);
  closeTo(quadratic.c, 1);
});

test("runs a safe four-area style calculation program", () => {
  const conversion = core.runProgram("?→A : A×2.54", [2]);
  closeTo(conversion.ans, 5.08);
  closeTo(conversion.outputs[0], 5.08);

  const variables = core.runProgram("?→A : A^2→B : B+1", [4]);
  assert.equal(variables.variables.B, 16);
  assert.equal(variables.ans, 17);
});

test("ships complete versioned formula and constant catalogues", () => {
  assert.match(data.version, /^\d{4}\.\d+$/);
  assert.equal(data.formulas.length, 23);
  assert.equal(data.constants.length, 40);
  assert.ok(data.constants.every((item) => item.name && item.symbol && Number.isFinite(item.value)));
  assert.equal(new Set(data.constants.map((item) => item.name)).size, 40);
});

test("evaluates representative interactive formulas", () => {
  const byName = Object.fromEntries(data.formulas.map((formula) => [formula.name, formula]));
  closeTo(core.evaluate(byName["Circle area"].expression, { variables: { r: 2 } }), 4 * Math.PI);
  closeTo(core.evaluate(byName["Distance between points"].expression, {
    variables: { xa: 0, ya: 0, xb: 3, yb: 4 },
  }), 5);
  assert.equal(core.evaluate(byName["Kinetic energy"].expression, { variables: { mass: 2, v: 3 } }), 9);
  closeTo(core.evaluate(byName["Body mass index"].expression, { variables: { mass: 72, h: 1.8 } }), 72 / 1.8 ** 2);
});

test("supports all seven advertised regression models", () => {
  const fixtures = {
    LIN: { fn: (x) => 2 + 3 * x, expected: { a: 2, b: 3 } },
    LOG: { fn: (x) => 2 + 3 * Math.log(x), expected: { a: 2, b: 3 } },
    EXP: { fn: (x) => 2 * Math.exp(0.5 * x), expected: { a: 2, b: 0.5 } },
    ABEXP: { fn: (x) => 3 * 2 ** x, expected: { a: 3, b: 2 } },
    PWR: { fn: (x) => 4 * x ** 1.5, expected: { a: 4, b: 1.5 } },
    INV: { fn: (x) => 5 + 2 / x, expected: { a: 5, b: 2 } },
  };
  for (const [type, fixture] of Object.entries(fixtures)) {
    const fit = core.regression([1, 2, 4, 8].map((x) => ({ x, y: fixture.fn(x) })), type);
    closeTo(fit.a, fixture.expected.a, 1e-9);
    closeTo(fit.b, fixture.expected.b, 1e-9);
    closeTo(fit.predict(3), fixture.fn(3), 1e-9);
  }
  const quadratic = core.regression([0, 1, 2, 3].map((x) => ({ x, y: 1 + 2 * x + 3 * x ** 2 })), "QUAD");
  closeTo(quadratic.a, 1);
  closeTo(quadratic.b, 2);
  closeTo(quadratic.c, 3);
});

test("supports complex catalogue helpers and signed base output", () => {
  const conjugate = core.evaluateComplex("Conjg(2+3i)");
  assert.equal(core.formatComplex(conjugate), "2 − 3i");
  closeTo(core.evaluateComplex("arg(i)", { angle: "DEG" }).re, 90);
  assert.equal(core.formatBase(-1, 16), "FFFFFFFF");
});
