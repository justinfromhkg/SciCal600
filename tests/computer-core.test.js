const test = require("node:test");
const assert = require("node:assert/strict");
const core = require("../computer-core.js");

function closeTo(actual, expected, tolerance = 1e-12) {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} should be within ${tolerance} of ${expected}`);
}

test("converts exact integers and finite fractions across bases 2-36", () => {
  assert.equal(core.convertRadix("FFFFFFFFFFFFFFFF", 16, 10), "18446744073709551615");
  assert.equal(core.convertRadix("1010.101", 2, 10), "10.625");
  assert.equal(core.convertRadix("A.A", 16, 2), "1010.101");
  assert.equal(core.parseRadix("ZZ", 36).numerator, 1295n);
  assert.equal(core.convertRadix("0.1", 10, 2, { maxFractionDigits: 16 }), "0.0(0011)");
  assert.throws(() => core.parseRadix("102", 2), core.ComputerError);
  assert.throws(() => core.parseRadix("1", 37), core.ComputerError);
});

test("interprets and extends 64-bit-safe integer bit patterns", () => {
  const allOnes = core.integerRepresentations("18446744073709551615", 64);
  assert.equal(allOnes.unsigned, 18446744073709551615n);
  assert.equal(allOnes.signed, -1n);
  assert.equal(allOnes.hexadecimal, "0xFFFFFFFFFFFFFFFF");
  assert.equal(core.extend(0x80n, 8, 16, true), 0xFF80n);
  assert.equal(core.extend(0x80n, 8, 16, false), 0x0080n);
  assert.equal(core.integerRepresentations(0x80n, 8).signMagnitudeNegativeZero, true);
  assert.equal(core.integerRepresentations(0xFFn, 8).onesComplementNegativeZero, true);
});

test("separates carry from signed overflow and wraps to the selected width", () => {
  let output = core.alu("ADD", 0xFFn, 1n, 8);
  assert.equal(output.result, 0n);
  assert.deepEqual(output.flags, { carry: true, overflow: false, zero: true, negative: false });

  output = core.alu("ADD", 0x7Fn, 1n, 8);
  assert.equal(output.result, 0x80n);
  assert.equal(output.flags.carry, false);
  assert.equal(output.flags.overflow, true);

  output = core.alu("SUB", 0x80n, 1n, 8);
  assert.equal(output.result, 0x7Fn);
  assert.equal(output.flags.carry, true);
  assert.equal(output.flags.overflow, true);

  assert.equal(core.alu("ASR", 0x8000000000000000n, 1n, 64).result, 0xC000000000000000n);
  assert.equal(core.alu("ASR", 0x8000000000000001n, 1n, 64).flags.carry, true);
  assert.equal(core.alu("ROL", 0x8000000000000000n, 1n, 64).result, 1n);
  assert.equal(core.alu("ROL", 0x8000000000000000n, 1n, 64).flags.carry, true);
});

test("encodes and validates BCD", () => {
  assert.equal(core.encodeBCD("907"), "1001 0000 0111");
  assert.equal(core.decodeBCD("1001 0000 0111"), "907");
  assert.throws(() => core.decodeBCD("1010"), core.ComputerError);
});

test("classifies IEEE 754 boundary and special bit patterns", () => {
  assert.equal(core.inspectIEEE("00000000", 32, "hex").classification, "+zero");
  assert.equal(core.inspectIEEE("80000000", 32, "hex").classification, "-zero");
  assert.equal(core.inspectIEEE("00000001", 32, "hex").classification, "subnormal");
  assert.equal(core.inspectIEEE("007FFFFF", 32, "hex").classification, "subnormal");
  assert.equal(core.inspectIEEE("00800000", 32, "hex").classification, "normal");
  assert.equal(core.inspectIEEE("7F7FFFFF", 32, "hex").classification, "normal");
  assert.equal(core.inspectIEEE("7F800000", 32, "hex").classification, "+infinity");
  assert.equal(core.inspectIEEE("FF800000", 32, "hex").classification, "-infinity");
  assert.equal(core.inspectIEEE("7FC00000", 32, "hex").classification, "quiet-nan");
  assert.equal(core.inspectIEEE("7F800001", 32, "hex").classification, "signaling-nan");
  assert.equal(core.inspectIEEE("0", 32, "decimal").hexadecimal, "0x00000000");
  assert.equal(core.inspectIEEE("-0", 64, "decimal").hexadecimal, "0x8000000000000000");
  assert.equal(core.inspectIEEE("0000000000000001", 64, "hex").classification, "subnormal");
  assert.equal(core.inspectIEEE("0010000000000000", 64, "hex").classification, "normal");
  assert.equal(core.inspectIEEE("7FEFFFFFFFFFFFFF", 64, "hex").classification, "normal");
  assert.equal(core.inspectIEEE("7FF0000000000000", 64, "hex").classification, "+infinity");
  assert.equal(core.inspectIEEE("7FF8000000000000", 64, "hex").classification, "quiet-nan");
  assert.equal(core.inspectIEEE("00000000", 32, "hex").nextUp, 2 ** -149);
  assert.equal(core.inspectIEEE("00000000", 32, "hex").nextDown, -(2 ** -149));
  assert.equal(core.inspectIEEE("1.000000059604644775390625", 32, "decimal").hexadecimal, "0x3F800000");
  assert.equal(core.inspectIEEE("1.000000178813934326171875", 32, "decimal").hexadecimal, "0x3F800002");
});

test("assembles and runs LMC programs with RTL trace and loop protection", () => {
  const source = `INP\nSTA N\nLDA N\nADD N\nOUT\nHLT\nN DAT 0`;
  const assembled = core.assembleLMC(source);
  assert.deepEqual(assembled.memory.slice(0, 7), [901, 306, 506, 106, 902, 0, 0]);
  const run = core.runLMC(source, [21]);
  assert.deepEqual(run.output, [42]);
  assert.equal(run.halted, true);
  assert.equal(run.error, null);
  assert.ok(run.trace.every((entry) => entry.micro.length >= 1));

  const loop = core.runLMC("LOOP BRA LOOP", [], 25);
  assert.equal(loop.steps, 25);
  assert.match(loop.error, /possible infinite loop/);
  assert.throws(() => core.assembleLMC("BRA MISSING"), core.ComputerError);

  const branch = core.runLMC("INP\nLOOP OUT\nSUB ONE\nBRP LOOP\nHLT\nONE DAT 1", [2]);
  assert.deepEqual(branch.output, [2, 1, 0]);
  assert.equal(branch.acc, -1);
});

test("calculates storage, timing, bandwidth, cache and disk quantities", () => {
  const clock = core.frequencyPeriod(2.5, "GHz");
  closeTo(clock.seconds, 0.4e-9, 1e-20);
  assert.equal(core.executionTime(5e9, 2.5e9), 2);

  const capacity = core.addressCapacity(32, 8, 1);
  assert.equal(capacity.locations, 4294967296n);
  assert.equal(capacity.bytes, 4294967296n);
  assert.equal(capacity.kibibytes, 4194304);

  const bus = core.busBandwidth({ widthBits: 64, frequencyHz: 100e6, transfersPerCycle: 2, efficiency: 0.8 });
  assert.equal(bus.bytesPerSecond, 1.28e9);
  assert.equal(core.amat([{ hitTime: 1, missRate: 0.05 }, { hitTime: 10, missRate: 0.1 }], 100), 2);
  closeTo(core.diskAccess({ seekMs: 0, rpm: 7200, bytes: 0, bytesPerSecond: 1 }).rotationalMs, 4.166666666666667);
  closeTo(core.dmaTransfer({ bytes: 1e6, bytesPerSecond: 1e8, setupSeconds: 0.001 }).elapsedSeconds, 0.011);
  const wafer = core.waferYield({ diameterMm: 300, dieAreaMm2: 100, defectDensityPerMm2: 0.005 });
  closeTo(wafer.yieldRate, Math.exp(-0.5));
});
