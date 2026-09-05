(function computerCalculatorCore(globalScope) {
  "use strict";

  class ComputerError extends Error {
    constructor(message) {
      super(message);
      this.name = "ComputerError";
    }
  }

  const DIGITS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const WIDTHS = new Set([8, 16, 32, 64]);

  function assertInteger(value, label = "Value") {
    if (typeof value === "bigint") return value;
    if (typeof value === "number" && !Number.isSafeInteger(value)) throw new ComputerError(`${label} must be supplied as text when it exceeds JavaScript's safe integer range.`);
    const text = String(value).trim().replaceAll("_", "");
    if (!/^[+-]?\d+$/.test(text)) throw new ComputerError(`${label} must be an integer.`);
    return BigInt(text);
  }

  function assertWidth(width) {
    const numeric = Number(width);
    if (!WIDTHS.has(numeric)) throw new ComputerError("Bit width must be 8, 16, 32 or 64.");
    return numeric;
  }

  function maskFor(width) {
    return (1n << BigInt(assertWidth(width))) - 1n;
  }

  function unsignedValue(value, width) {
    return BigInt.asUintN(assertWidth(width), assertInteger(value));
  }

  function signedValue(value, width) {
    return BigInt.asIntN(assertWidth(width), assertInteger(value));
  }

  function bits(value, width, grouped = true) {
    const checkedWidth = assertWidth(width);
    const raw = unsignedValue(value, checkedWidth).toString(2).padStart(checkedWidth, "0");
    return grouped ? raw.replace(/(.{4})(?=.)/g, "$1 ") : raw;
  }

  function hex(value, width, prefixed = true) {
    const checkedWidth = assertWidth(width);
    const raw = unsignedValue(value, checkedWidth).toString(16).toUpperCase().padStart(checkedWidth / 4, "0");
    return `${prefixed ? "0x" : ""}${raw}`;
  }

  function parseRadix(input, radix) {
    const base = Number(radix);
    if (!Number.isInteger(base) || base < 2 || base > 36) throw new ComputerError("Radix must be between 2 and 36.");
    let text = String(input).trim().toUpperCase().replace(/[ _]/g, "");
    if (!text) throw new ComputerError("Enter a value to convert.");
    let sign = 1n;
    if (text[0] === "+" || text[0] === "-") {
      if (text[0] === "-") sign = -1n;
      text = text.slice(1);
    }
    if (base === 16 && text.startsWith("0X")) text = text.slice(2);
    if (base === 2 && text.startsWith("0B")) text = text.slice(2);
    if (base === 8 && text.startsWith("0O")) text = text.slice(2);
    if (!text || (text.match(/\./g) || []).length > 1) throw new ComputerError("The number format is invalid.");
    const [wholeText = "0", fractionText = ""] = text.split(".");
    if (!wholeText && !fractionText) throw new ComputerError("The number format is invalid.");
    const parseDigit = (character) => {
      const digit = DIGITS.indexOf(character);
      if (digit < 0 || digit >= base) throw new ComputerError(`Digit “${character}” is not valid in base ${base}.`);
      return BigInt(digit);
    };
    let numerator = 0n;
    for (const character of wholeText || "0") numerator = numerator * BigInt(base) + parseDigit(character);
    let denominator = 1n;
    let fraction = 0n;
    for (const character of fractionText) {
      fraction = fraction * BigInt(base) + parseDigit(character);
      denominator *= BigInt(base);
    }
    numerator = sign * (numerator * denominator + fraction);
    return { numerator, denominator, radix: base, fractionalDigits: fractionText.length };
  }

  function formatRadix(rational, radix, options = {}) {
    const base = Number(radix);
    if (!Number.isInteger(base) || base < 2 || base > 36) throw new ComputerError("Radix must be between 2 and 36.");
    const maxFractionDigits = Math.max(0, Math.min(128, Number(options.maxFractionDigits ?? 32)));
    let numerator = BigInt(rational.numerator);
    const denominator = BigInt(rational.denominator);
    if (denominator <= 0n) throw new ComputerError("Denominator must be positive.");
    const negative = numerator < 0n;
    if (negative) numerator = -numerator;
    const whole = numerator / denominator;
    let remainder = numerator % denominator;
    let wholeText = whole.toString(base).toUpperCase();
    const fraction = [];
    const seen = new Map();
    let repeatingAt = -1;
    while (remainder && fraction.length < maxFractionDigits) {
      if (seen.has(remainder)) {
        repeatingAt = seen.get(remainder);
        break;
      }
      seen.set(remainder, fraction.length);
      remainder *= BigInt(base);
      fraction.push(DIGITS[Number(remainder / denominator)]);
      remainder %= denominator;
    }
    let fractionText = fraction.join("");
    if (repeatingAt >= 0) fractionText = `${fractionText.slice(0, repeatingAt)}(${fractionText.slice(repeatingAt)})`;
    else if (remainder) fractionText += "…";
    if (options.grouped) {
      wholeText = wholeText.replace(/(?=(.{4})+$)/g, " ").trim();
      fractionText = fractionText.replace(/(.{4})(?=.)/g, "$1 ");
    }
    return `${negative && numerator !== 0n ? "−" : ""}${wholeText}${fractionText ? `.${fractionText}` : ""}`;
  }

  function convertRadix(input, fromRadix, toRadix, options) {
    return formatRadix(parseRadix(input, fromRadix), toRadix, options);
  }

  function integerRepresentations(value, width) {
    const checkedWidth = assertWidth(width);
    const unsigned = unsignedValue(value, checkedWidth);
    const signed = signedValue(unsigned, checkedWidth);
    const signMask = 1n << BigInt(checkedWidth - 1);
    const magnitudeMask = signMask - 1n;
    const signMagnitude = unsigned & signMask ? -(unsigned & magnitudeMask) : unsigned;
    const onesComplement = unsigned & signMask ? -((~unsigned) & maskFor(checkedWidth)) : unsigned;
    return {
      width: checkedWidth,
      bitPattern: bits(unsigned, checkedWidth),
      hexadecimal: hex(unsigned, checkedWidth),
      unsigned,
      signed,
      signMagnitude,
      signMagnitudeNegativeZero: unsigned === signMask,
      onesComplement,
      onesComplementNegativeZero: unsigned === maskFor(checkedWidth),
      range: {
        unsigned: [0n, maskFor(checkedWidth)],
        signed: [-(1n << BigInt(checkedWidth - 1)), (1n << BigInt(checkedWidth - 1)) - 1n],
      },
    };
  }

  function extend(value, fromWidth, toWidth, signed = false) {
    const sourceWidth = assertWidth(fromWidth);
    const targetWidth = assertWidth(toWidth);
    if (targetWidth < sourceWidth) throw new ComputerError("Target width cannot be smaller than source width.");
    const source = unsignedValue(value, sourceWidth);
    return signed ? unsignedValue(signedValue(source, sourceWidth), targetWidth) : source;
  }

  function alu(operation, left, right, width, signed = false) {
    const checkedWidth = assertWidth(width);
    const op = String(operation).toUpperCase();
    const a = unsignedValue(left, checkedWidth);
    const b = unsignedValue(right, checkedWidth);
    const signedA = signedValue(a, checkedWidth);
    const signedB = signedValue(b, checkedWidth);
    const modulus = 1n << BigInt(checkedWidth);
    const shift = Number(b);
    let mathematical;
    let raw;
    let carry = false;
    let overflow = false;
    const signedMin = -(1n << BigInt(checkedWidth - 1));
    const signedMax = (1n << BigInt(checkedWidth - 1)) - 1n;
    const selectedA = signed ? signedA : a;
    const selectedB = signed ? signedB : b;

    if (op === "ADD") {
      mathematical = selectedA + selectedB;
      raw = a + b;
      carry = raw >= modulus;
      overflow = (signedA >= 0n && signedB >= 0n && signedValue(raw, checkedWidth) < 0n)
        || (signedA < 0n && signedB < 0n && signedValue(raw, checkedWidth) >= 0n);
    } else if (op === "SUB") {
      mathematical = selectedA - selectedB;
      raw = a - b;
      carry = a >= b; // no-borrow convention
      overflow = (signedA >= 0n && signedB < 0n && signedValue(raw, checkedWidth) < 0n)
        || (signedA < 0n && signedB >= 0n && signedValue(raw, checkedWidth) >= 0n);
    } else if (op === "MUL") {
      mathematical = selectedA * selectedB;
      raw = a * b;
      carry = raw > maskFor(checkedWidth);
      const signedProduct = signedA * signedB;
      overflow = signedProduct < signedMin || signedProduct > signedMax;
    } else if (op === "DIV") {
      if (selectedB === 0n) throw new ComputerError("Division by zero is undefined.");
      mathematical = selectedA / selectedB;
      raw = mathematical;
      overflow = signed && selectedA === signedMin && selectedB === -1n;
    } else if (op === "NEG") {
      mathematical = -selectedA;
      raw = -a;
      carry = a !== 0n;
      overflow = signedA === signedMin;
    } else if (op === "AND") raw = a & b;
    else if (op === "OR") raw = a | b;
    else if (op === "XOR") raw = a ^ b;
    else if (op === "NOT") raw = ~a;
    else if (op === "LSL") {
      raw = shift >= checkedWidth ? 0n : a << BigInt(shift);
      carry = shift > 0 && shift <= checkedWidth ? Boolean((a >> BigInt(checkedWidth - shift)) & 1n) : false;
    } else if (op === "LSR") {
      raw = shift >= checkedWidth ? 0n : a >> BigInt(shift);
      carry = shift > 0 && shift <= checkedWidth ? Boolean((a >> BigInt(shift - 1)) & 1n) : false;
    } else if (op === "ASR") {
      raw = shift >= checkedWidth ? (signedA < 0n ? -1n : 0n) : signedA >> BigInt(shift);
      carry = shift > 0 && shift <= checkedWidth ? Boolean((a >> BigInt(shift - 1)) & 1n) : false;
    }
    else if (op === "ROL" || op === "ROR") {
      const amount = ((shift % checkedWidth) + checkedWidth) % checkedWidth;
      if (amount === 0) raw = a;
      else if (op === "ROL") raw = (a << BigInt(amount)) | (a >> BigInt(checkedWidth - amount));
      else raw = (a >> BigInt(amount)) | (a << BigInt(checkedWidth - amount));
      carry = amount > 0 ? Boolean(op === "ROL" ? unsignedValue(raw, checkedWidth) & 1n : unsignedValue(raw, checkedWidth) & (1n << BigInt(checkedWidth - 1))) : false;
    } else throw new ComputerError(`Unsupported ALU operation: ${operation}.`);

    const result = unsignedValue(raw, checkedWidth);
    if (mathematical === undefined) mathematical = signed ? signedValue(result, checkedWidth) : result;
    return {
      operation: op,
      width: checkedWidth,
      result,
      signedResult: signedValue(result, checkedWidth),
      mathematical,
      bitPattern: bits(result, checkedWidth),
      hexadecimal: hex(result, checkedWidth),
      flags: { carry, overflow, zero: result === 0n, negative: Boolean(result & (1n << BigInt(checkedWidth - 1))) },
    };
  }

  function encodeBCD(value) {
    const text = String(value).trim();
    if (!/^\d+$/.test(text)) throw new ComputerError("BCD input must contain decimal digits only.");
    return text.split("").map((digit) => Number(digit).toString(2).padStart(4, "0")).join(" ");
  }

  function decodeBCD(value) {
    const compact = String(value).replace(/[ _]/g, "");
    if (!/^[01]+$/.test(compact) || compact.length % 4) throw new ComputerError("BCD must contain complete 4-bit groups.");
    let result = "";
    for (let index = 0; index < compact.length; index += 4) {
      const digit = Number.parseInt(compact.slice(index, index + 4), 2);
      if (digit > 9) throw new ComputerError(`BCD group ${compact.slice(index, index + 4)} is invalid.`);
      result += digit;
    }
    return result;
  }

  function ieeeLayout(width) {
    if (Number(width) === 32) return { width: 32, exponentBits: 8, fractionBits: 23, bias: 127 };
    if (Number(width) === 64) return { width: 64, exponentBits: 11, fractionBits: 52, bias: 1023 };
    throw new ComputerError("IEEE 754 width must be 32 or 64 bits.");
  }

  function numberToIeeeBits(value, width) {
    const layout = ieeeLayout(width);
    const buffer = new ArrayBuffer(layout.width / 8);
    const view = new DataView(buffer);
    if (layout.width === 32) view.setFloat32(0, Number(value), false);
    else view.setFloat64(0, Number(value), false);
    let raw = 0n;
    for (let index = 0; index < buffer.byteLength; index += 1) raw = (raw << 8n) | BigInt(view.getUint8(index));
    return raw;
  }

  function ieeeBitsToNumber(raw, width) {
    const layout = ieeeLayout(width);
    let bitsValue = BigInt.asUintN(layout.width, BigInt(raw));
    const buffer = new ArrayBuffer(layout.width / 8);
    const view = new DataView(buffer);
    for (let index = buffer.byteLength - 1; index >= 0; index -= 1) {
      view.setUint8(index, Number(bitsValue & 0xFFn));
      bitsValue >>= 8n;
    }
    return layout.width === 32 ? view.getFloat32(0, false) : view.getFloat64(0, false);
  }

  function parseIeeeInput(input, width, format = "decimal") {
    const layout = ieeeLayout(width);
    if (format === "decimal") {
      const text = String(input).trim();
      if (!text) throw new ComputerError("Enter a floating-point value.");
      const value = Number(text);
      if (Number.isNaN(value) && !/^[-+]?nan$/i.test(text)) throw new ComputerError("The decimal value is invalid.");
      return numberToIeeeBits(value, layout.width);
    }
    let text = String(input).trim().replace(/[ _]/g, "").toUpperCase();
    if (format === "hex") {
      text = text.replace(/^0X/, "");
      if (!/^[0-9A-F]+$/.test(text) || text.length > layout.width / 4) throw new ComputerError(`Enter at most ${layout.width / 4} hexadecimal digits.`);
      return BigInt(`0x${text}`);
    }
    if (format === "binary") {
      text = text.replace(/^0B/, "");
      if (!/^[01]+$/.test(text) || text.length > layout.width) throw new ComputerError(`Enter at most ${layout.width} binary digits.`);
      return BigInt(`0b${text}`);
    }
    throw new ComputerError("Floating-point input format is invalid.");
  }

  function inspectIEEE(input, width, format = "decimal") {
    const layout = ieeeLayout(width);
    const raw = parseIeeeInput(input, layout.width, format);
    const fractionMask = (1n << BigInt(layout.fractionBits)) - 1n;
    const exponentMask = (1n << BigInt(layout.exponentBits)) - 1n;
    const sign = Number(raw >> BigInt(layout.width - 1));
    const exponentRaw = (raw >> BigInt(layout.fractionBits)) & exponentMask;
    const fractionRaw = raw & fractionMask;
    const exponentAllOnes = exponentRaw === exponentMask;
    const exponentZero = exponentRaw === 0n;
    let classification = "normal";
    if (exponentZero && fractionRaw === 0n) classification = sign ? "-zero" : "+zero";
    else if (exponentZero) classification = "subnormal";
    else if (exponentAllOnes && fractionRaw === 0n) classification = sign ? "-infinity" : "+infinity";
    else if (exponentAllOnes) classification = (fractionRaw & (1n << BigInt(layout.fractionBits - 1))) ? "quiet-nan" : "signaling-nan";
    const value = ieeeBitsToNumber(raw, layout.width);
    const actualExponent = exponentZero ? 1 - layout.bias : Number(exponentRaw) - layout.bias;
    const significandNumerator = exponentZero ? fractionRaw : (1n << BigInt(layout.fractionBits)) | fractionRaw;
    const finite = !exponentAllOnes;
    const ulp = finite ? 2 ** (actualExponent - layout.fractionBits) : Number.NaN;
    const positiveInfinityRaw = exponentMask << BigInt(layout.fractionBits);
    function adjacent(direction) {
      if (Number.isNaN(value)) return Number.NaN;
      if (direction > 0 && value === Infinity) return Infinity;
      if (direction < 0 && value === -Infinity) return -Infinity;
      if (Object.is(value, -0) && direction > 0) return ieeeBitsToNumber(1n, layout.width);
      if (Object.is(value, 0) && direction < 0) return ieeeBitsToNumber((1n << BigInt(layout.width - 1)) | 1n, layout.width);
      const nextRaw = (sign === 0) === (direction > 0) ? raw + 1n : raw - 1n;
      if (nextRaw < 0n || nextRaw > ((1n << BigInt(layout.width)) - 1n) || nextRaw > positiveInfinityRaw && sign === 0) return direction > 0 ? Infinity : -Infinity;
      return ieeeBitsToNumber(nextRaw, layout.width);
    }
    return {
      ...layout,
      raw,
      sign,
      exponentRaw,
      fractionRaw,
      actualExponent,
      hiddenBit: exponentZero ? 0 : 1,
      significandNumerator,
      classification,
      value,
      binary: raw.toString(2).padStart(layout.width, "0"),
      hexadecimal: `0x${raw.toString(16).toUpperCase().padStart(layout.width / 4, "0")}`,
      ulp,
      nextDown: adjacent(-1),
      nextUp: adjacent(1),
    };
  }

  function customFloatDecode(bitPattern, options = {}) {
    const signBits = Number(options.signBits ?? 1);
    const exponentBits = Number(options.exponentBits ?? 3);
    const fractionBits = Number(options.fractionBits ?? 4);
    const bias = Number(options.bias ?? ((1 << (exponentBits - 1)) - 1));
    const radix = Number(options.radix ?? 2);
    if (signBits !== 1 || !Number.isInteger(exponentBits) || exponentBits < 1 || exponentBits > 15 || !Number.isInteger(fractionBits) || fractionBits < 1 || fractionBits > 52 || radix < 2 || radix > 36) throw new ComputerError("Custom floating-point settings are out of range.");
    const compact = String(bitPattern).replace(/[ _]/g, "");
    const total = 1 + exponentBits + fractionBits;
    if (!/^[01]+$/.test(compact) || compact.length !== total) throw new ComputerError(`Enter exactly ${total} bits.`);
    const sign = compact[0] === "1" ? -1 : 1;
    const exponentRaw = Number.parseInt(compact.slice(1, 1 + exponentBits), 2);
    const fractionRaw = BigInt(`0b${compact.slice(1 + exponentBits)}`);
    const fraction = Number(fractionRaw) / 2 ** fractionBits;
    const exponent = exponentRaw - bias;
    return { sign, exponentRaw, exponent, fractionRaw, significand: 1 + fraction, value: sign * (1 + fraction) * radix ** exponent, bias, radix };
  }

  function customFloatEncode(input, options = {}) {
    const exponentBits = Number(options.exponentBits ?? 3);
    const fractionBits = Number(options.fractionBits ?? 4);
    const bias = Number(options.bias ?? ((1 << (exponentBits - 1)) - 1));
    const radix = Number(options.radix ?? 2);
    const value = Number(input);
    if (!Number.isFinite(value)) throw new ComputerError("The teaching format accepts finite values only.");
    if (!Number.isInteger(exponentBits) || exponentBits < 1 || exponentBits > 15 || !Number.isInteger(fractionBits) || fractionBits < 1 || fractionBits > 52 || !Number.isInteger(bias) || radix < 2 || radix > 36) throw new ComputerError("Custom floating-point settings are out of range.");
    const sign = value < 0 || Object.is(value, -0) ? 1 : 0;
    if (value === 0) return { bits: `${sign}${"0".repeat(exponentBits + fractionBits)}`, value: sign ? -0 : 0, exponent: -bias, rounded: false };
    const magnitude = Math.abs(value);
    const exponent = Math.floor(Math.log(magnitude) / Math.log(radix));
    const exponentRaw = exponent + bias;
    if (exponentRaw < 0 || exponentRaw >= 2 ** exponentBits) throw new ComputerError("Value is outside this teaching format's exponent range.");
    const significand = magnitude / radix ** exponent;
    const scaledFraction = (significand - 1) * 2 ** fractionBits;
    let fractionRaw = Math.round(scaledFraction);
    let adjustedExponentRaw = exponentRaw;
    if (fractionRaw >= 2 ** fractionBits) { fractionRaw = 0; adjustedExponentRaw += 1; }
    if (adjustedExponentRaw >= 2 ** exponentBits) throw new ComputerError("Rounded value overflows this teaching format.");
    const bitsText = `${sign}${adjustedExponentRaw.toString(2).padStart(exponentBits, "0")}${fractionRaw.toString(2).padStart(fractionBits, "0")}`;
    const decoded = customFloatDecode(bitsText, { exponentBits, fractionBits, bias, radix });
    return { bits: bitsText, value: decoded.value, exponent: decoded.exponent, rounded: !Object.is(decoded.value, value), absoluteError: Math.abs(decoded.value - value) };
  }

  function floatingAddSteps(left, right, width = 32, operation = "add") {
    const layout = ieeeLayout(width);
    const a = Number(left);
    const b = Number(right);
    if (Number.isNaN(a) || Number.isNaN(b)) throw new ComputerError("Enter valid decimal operands.");
    const signedB = operation === "subtract" ? -b : b;
    const result = layout.width === 32 ? Math.fround(Math.fround(a) + Math.fround(signedB)) : a + signedB;
    const inspectedA = inspectIEEE(String(a), layout.width, "decimal");
    const inspectedB = inspectIEEE(String(signedB), layout.width, "decimal");
    const inspectedResult = inspectIEEE(String(result), layout.width, "decimal");
    return {
      result,
      inspectedResult,
      steps: [
        `Decode exponents: ${inspectedA.actualExponent} and ${inspectedB.actualExponent}.`,
        `Align significands to exponent ${Math.max(inspectedA.actualExponent, inspectedB.actualExponent)}.`,
        `${operation === "subtract" ? "Subtract" : "Add"} the aligned signed significands.`,
        "Normalize the significand and adjust the exponent.",
        `Round to ${layout.fractionBits} fraction bits using round-to-nearest, ties-to-even.`,
        `Classify the result as ${inspectedResult.classification}.`,
      ],
    };
  }

  const LMC_OPCODES = Object.freeze({ ADD: 100, SUB: 200, STA: 300, STO: 300, LDA: 500, BRA: 600, BRZ: 700, BRP: 800, INP: 901, OUT: 902, HLT: 0, COB: 0, DAT: null });

  function assembleLMC(source) {
    const lines = String(source).split(/\r?\n/);
    const parsed = [];
    const labels = new Map();
    for (const [lineIndex, rawLine] of lines.entries()) {
      const clean = rawLine.replace(/\/\/.*$|#.*$/g, "").trim();
      if (!clean) continue;
      const tokens = clean.toUpperCase().split(/\s+/);
      let label = null;
      if (!(tokens[0] in LMC_OPCODES) && !/^\d{1,3}$/.test(tokens[0])) label = tokens.shift().replace(/:$/, "");
      if (!tokens.length) throw new ComputerError(`Line ${lineIndex + 1}: missing instruction.`);
      if (label) {
        if (!/^[A-Z][A-Z0-9_]*$/.test(label) || labels.has(label)) throw new ComputerError(`Line ${lineIndex + 1}: invalid or duplicate label.`);
        labels.set(label, parsed.length);
      }
      parsed.push({ line: lineIndex + 1, mnemonic: tokens[0], operand: tokens[1], source: clean });
    }
    if (parsed.length > 100) throw new ComputerError("LMC programs can use at most 100 mailboxes.");
    const memory = Array(100).fill(0);
    const listing = parsed.map((item, address) => {
      if (/^\d{1,3}$/.test(item.mnemonic)) {
        memory[address] = Number(item.mnemonic);
        return { ...item, address, code: memory[address] };
      }
      if (!(item.mnemonic in LMC_OPCODES)) throw new ComputerError(`Line ${item.line}: unknown instruction ${item.mnemonic}.`);
      let code;
      if (item.mnemonic === "DAT") {
        code = item.operand === undefined ? 0 : Number(item.operand);
        if (!Number.isInteger(code) || code < 0 || code > 999) throw new ComputerError(`Line ${item.line}: DAT must be 0…999.`);
      } else if (LMC_OPCODES[item.mnemonic] >= 900 || LMC_OPCODES[item.mnemonic] === 0) {
        if (item.operand !== undefined) throw new ComputerError(`Line ${item.line}: ${item.mnemonic} takes no operand.`);
        code = LMC_OPCODES[item.mnemonic];
      } else {
        const operand = labels.has(item.operand) ? labels.get(item.operand) : Number(item.operand);
        if (!Number.isInteger(operand) || operand < 0 || operand > 99) throw new ComputerError(`Line ${item.line}: address must be 00…99 or a label.`);
        code = LMC_OPCODES[item.mnemonic] + operand;
      }
      memory[address] = code;
      return { ...item, address, code };
    });
    return { memory, listing, labels: Object.fromEntries(labels) };
  }

  function createLMC(program, input = []) {
    const assembled = typeof program === "string" ? assembleLMC(program) : program;
    return { memory: [...assembled.memory], pc: 0, mar: 0, mdr: 0, ir: 0, acc: 0, input: input.map(Number), output: [], halted: false, steps: 0, cycles: 0, trace: [], error: null };
  }

  function stepLMC(state, maxSteps = 10000) {
    if (state.halted) return state;
    if (state.steps >= maxSteps) {
      state.halted = true;
      state.error = `Step limit ${maxSteps} reached; possible infinite loop.`;
      return state;
    }
    state.mar = state.pc;
    state.mdr = state.memory[state.mar];
    state.ir = state.mdr;
    state.pc = (state.pc + 1) % 100;
    const instruction = state.ir;
    const opcode = Math.floor(instruction / 100);
    const address = instruction % 100;
    const micro = [`MAR ← PC`, `MDR ← M[MAR]`, `IR ← MDR`, `PC ← PC + 1`];
    if (instruction === 0) { state.halted = true; micro.push("HALT"); }
    else if (instruction === 901) {
      if (!state.input.length) { state.halted = true; state.error = "Input queue is empty."; }
      else { state.acc = state.input.shift(); micro.push("ACC ← input"); }
    } else if (instruction === 902) { state.output.push(state.acc); micro.push("output ← ACC"); }
    else if (opcode === 1 || opcode === 2 || opcode === 5) {
      state.mar = address; state.mdr = state.memory[address]; micro.push(`MAR ← ${address}`, "MDR ← M[MAR]");
      if (opcode === 1) { state.acc += state.mdr; micro.push("ACC ← ACC + MDR"); }
      if (opcode === 2) { state.acc -= state.mdr; micro.push("ACC ← ACC − MDR"); }
      if (opcode === 5) { state.acc = state.mdr; micro.push("ACC ← MDR"); }
    } else if (opcode === 3) { state.memory[address] = ((state.acc % 1000) + 1000) % 1000; micro.push(`M[${address}] ← ACC`); }
    else if (opcode === 6) { state.pc = address; micro.push(`PC ← ${address}`); }
    else if (opcode === 7) { if (state.acc === 0) state.pc = address; micro.push(state.acc === 0 ? `PC ← ${address}` : "branch not taken"); }
    else if (opcode === 8) { if (state.acc >= 0) state.pc = address; micro.push(state.acc >= 0 ? `PC ← ${address}` : "branch not taken"); }
    else { state.halted = true; state.error = `Invalid instruction ${instruction.toString().padStart(3, "0")}.`; }
    state.steps += 1;
    state.cycles += micro.length;
    state.trace.push({ step: state.steps, instruction, pc: state.pc, mar: state.mar, mdr: state.mdr, ir: state.ir, acc: state.acc, micro });
    return state;
  }

  function runLMC(program, input = [], maxSteps = 10000) {
    const state = createLMC(program, input);
    while (!state.halted) stepLMC(state, maxSteps);
    return state;
  }

  function frequencyPeriod(value, unit = "Hz") {
    const multipliers = { Hz: 1, kHz: 1e3, MHz: 1e6, GHz: 1e9 };
    const frequency = Number(value) * (multipliers[unit] || 0);
    if (!Number.isFinite(frequency) || frequency <= 0) throw new ComputerError("Frequency must be positive.");
    return { hertz: frequency, seconds: 1 / frequency };
  }

  function addressCapacity(addressBits, wordSizeBits = 8, addressableUnitBytes = 1) {
    const addresses = Number(addressBits);
    const word = Number(wordSizeBits);
    const unit = Number(addressableUnitBytes);
    if (!Number.isInteger(addresses) || addresses < 1 || addresses > 64 || !Number.isFinite(word) || word <= 0 || !Number.isFinite(unit) || unit <= 0) throw new ComputerError("Address bits, word size and addressable unit must be positive.");
    const locations = 1n << BigInt(addresses);
    if (!Number.isInteger(unit)) throw new ComputerError("Addressable unit must be a whole number of bytes.");
    const bytesExact = locations * BigInt(unit);
    const bytes = Number(bytesExact);
    return { locations, bytes: bytesExact, bits: bytesExact * 8n, wordSizeBits: word, kibibytes: bytes / 1024, mebibytes: bytes / 1024 ** 2, gigabytes: bytes / 1e9 };
  }

  function busBandwidth(options) {
    const width = Number(options.widthBits);
    const frequency = Number(options.frequencyHz);
    const transfers = Number(options.transfersPerCycle ?? 1);
    const efficiency = Number(options.efficiency ?? 1);
    if (![width, frequency, transfers, efficiency].every(Number.isFinite) || width <= 0 || frequency <= 0 || transfers <= 0 || efficiency <= 0 || efficiency > 1) throw new ComputerError("Bus parameters must be positive and efficiency at most 1.");
    const bytesPerSecond = width / 8 * frequency * transfers * efficiency;
    const transferSeconds = options.bytes == null ? null : Number(options.bytes) / bytesPerSecond;
    return { bytesPerSecond, bitsPerSecond: bytesPerSecond * 8, transferSeconds };
  }

  function amat(levels, memoryTime = 0) {
    if (!Array.isArray(levels) || !levels.length) throw new ComputerError("Provide at least one cache level.");
    let downstream = Number(memoryTime);
    if (!Number.isFinite(downstream) || downstream < 0) throw new ComputerError("Memory time cannot be negative.");
    for (let index = levels.length - 1; index >= 0; index -= 1) {
      const hitTime = Number(levels[index].hitTime);
      const missRate = Number(levels[index].missRate);
      if (!Number.isFinite(hitTime) || hitTime < 0 || !Number.isFinite(missRate) || missRate < 0 || missRate > 1) throw new ComputerError("Cache hit times must be non-negative and miss rates between 0 and 1.");
      downstream = hitTime + missRate * downstream;
    }
    return downstream;
  }

  function diskAccess(options) {
    const seekMs = Number(options.seekMs);
    const rpm = Number(options.rpm);
    const bytes = Number(options.bytes ?? 0);
    const bytesPerSecond = Number(options.bytesPerSecond ?? Infinity);
    const overheadMs = Number(options.overheadMs ?? 0);
    const queueMs = Number(options.queueMs ?? 0);
    if (![seekMs, rpm, bytes, bytesPerSecond, overheadMs, queueMs].every(Number.isFinite) || seekMs < 0 || rpm <= 0 || bytes < 0 || bytesPerSecond <= 0 || overheadMs < 0 || queueMs < 0) throw new ComputerError("Disk parameters are invalid.");
    const rotationalMs = 30000 / rpm;
    const transferMs = bytes / bytesPerSecond * 1000;
    return { seekMs, rotationalMs, transferMs, overheadMs, queueMs, totalMs: seekMs + rotationalMs + transferMs + overheadMs + queueMs };
  }

  function executionTime(cycles, frequencyHz) {
    const cycleCount = Number(cycles);
    const frequency = Number(frequencyHz);
    if (!Number.isFinite(cycleCount) || cycleCount < 0 || !Number.isFinite(frequency) || frequency <= 0) throw new ComputerError("Cycles must be non-negative and frequency positive.");
    return cycleCount / frequency;
  }

  function dmaTransfer(options) {
    const bytes = Number(options.bytes);
    const rate = Number(options.bytesPerSecond);
    const setupSeconds = Number(options.setupSeconds ?? 0);
    const interruptSeconds = Number(options.interruptSeconds ?? 0);
    if (![bytes, rate, setupSeconds, interruptSeconds].every(Number.isFinite) || bytes < 0 || rate <= 0 || setupSeconds < 0 || interruptSeconds < 0) throw new ComputerError("DMA parameters are invalid.");
    const transferSeconds = bytes / rate;
    const elapsedSeconds = setupSeconds + transferSeconds + interruptSeconds;
    const cpuBusySeconds = setupSeconds + interruptSeconds;
    return { transferSeconds, elapsedSeconds, cpuBusySeconds, cpuUtilisation: elapsedSeconds ? cpuBusySeconds / elapsedSeconds : 0, pioCpuBusySeconds: transferSeconds };
  }

  function waferYield(options) {
    const diameterMm = Number(options.diameterMm);
    const dieAreaMm2 = Number(options.dieAreaMm2);
    const defectDensityPerMm2 = Number(options.defectDensityPerMm2 ?? 0);
    if (![diameterMm, dieAreaMm2, defectDensityPerMm2].every(Number.isFinite) || diameterMm <= 0 || dieAreaMm2 <= 0 || defectDensityPerMm2 < 0) throw new ComputerError("Wafer parameters are invalid.");
    const grossDies = Math.PI * (diameterMm / 2) ** 2 / dieAreaMm2 - Math.PI * diameterMm / Math.sqrt(2 * dieAreaMm2);
    const yieldRate = Math.exp(-defectDensityPerMm2 * dieAreaMm2);
    return { grossDies, wholeDies: Math.max(0, Math.floor(grossDies)), yieldRate, expectedGoodDies: Math.max(0, Math.floor(grossDies)) * yieldRate, model: "area-minus-edge / Poisson approximation" };
  }

  const api = Object.freeze({ ComputerError, DIGITS, assertWidth, maskFor, unsignedValue, signedValue, bits, hex, parseRadix, formatRadix, convertRadix, integerRepresentations, extend, alu, encodeBCD, decodeBCD, ieeeLayout, numberToIeeeBits, ieeeBitsToNumber, inspectIEEE, customFloatDecode, customFloatEncode, floatingAddSteps, LMC_OPCODES, assembleLMC, createLMC, stepLMC, runLMC, frequencyPeriod, addressCapacity, busBandwidth, amat, diskAccess, executionTime, dmaTransfer, waferYield });
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (globalScope) globalScope.ComputerCalculatorCore = api;
})(typeof window !== "undefined" ? window : globalThis);
