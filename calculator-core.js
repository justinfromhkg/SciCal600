(function calculatorCoreFactory(globalScope) {
  "use strict";

  class CalculatorError extends Error {
    constructor(message, displayMessage = "Math ERROR") {
      super(message);
      this.name = "CalculatorError";
      this.displayMessage = displayMessage;
    }
  }

  class Tokenizer {
    constructor(source) {
      this.source = String(source).replace(/\s+/g, "");
      this.index = 0;
      this.current = this.readToken();
    }

    readToken() {
      if (this.index >= this.source.length) return { type: "eof", value: "" };

      const rest = this.source.slice(this.index);
      const numberMatch = rest.match(/^(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?/);
      if (numberMatch) {
        this.index += numberMatch[0].length;
        return { type: "number", value: Number(numberMatch[0]) };
      }

      const char = this.source[this.index];
      if (char === "π") {
        this.index += 1;
        return { type: "constant", value: "pi" };
      }

      if ("+-×÷*/^!%(),∠".includes(char)) {
        this.index += 1;
        const normalized = char === "×" ? "*" : char === "÷" ? "/" : char;
        return { type: "operator", value: normalized };
      }

      const identifierMatch = rest.match(/^(?:pow10|[A-Za-z]+)/);
      if (identifierMatch) {
        this.index += identifierMatch[0].length;
        return { type: "identifier", value: identifierMatch[0] };
      }

      throw new CalculatorError(`Unexpected character: ${char}`, "Syntax ERROR");
    }

    advance() {
      const previous = this.current;
      this.current = this.readToken();
      return previous;
    }

    is(type, value) {
      return this.current.type === type && (value === undefined || this.current.value === value);
    }

    expect(type, value) {
      if (!this.is(type, value)) {
        throw new CalculatorError(`Expected ${value || type}`, "Syntax ERROR");
      }
      return this.advance();
    }
  }

  function factorial(value) {
    if (!Number.isInteger(value) || value < 0 || value > 170) {
      throw new CalculatorError("Factorial requires an integer from 0 to 170");
    }
    let result = 1;
    for (let number = 2; number <= value; number += 1) result *= number;
    return result;
  }

  function permutation(n, r) {
    if (!Number.isInteger(n) || !Number.isInteger(r) || n < 0 || r < 0 || r > n) {
      throw new CalculatorError("Permutation requires integers where 0 ≤ r ≤ n");
    }
    let result = 1;
    for (let value = n - r + 1; value <= n; value += 1) result *= value;
    return result;
  }

  function combination(n, r) {
    if (!Number.isInteger(n) || !Number.isInteger(r) || n < 0 || r < 0 || r > n) {
      throw new CalculatorError("Combination requires integers where 0 ≤ r ≤ n");
    }
    const smallerR = Math.min(r, n - r);
    let result = 1;
    for (let index = 1; index <= smallerR; index += 1) {
      result = (result * (n - smallerR + index)) / index;
    }
    return result;
  }

  class Parser {
    constructor(source, context = {}) {
      this.tokens = new Tokenizer(source);
      this.context = {
        angle: context.angle || "DEG",
        ans: Number(context.ans) || 0,
        memory: Number(context.memory) || 0,
        random: context.random || Math.random,
        variables: context.variables || {},
      };
    }

    parse() {
      const value = this.parseAddSubtract();
      if (!this.tokens.is("eof")) {
        throw new CalculatorError("Unexpected input after expression", "Syntax ERROR");
      }
      if (!Number.isFinite(value)) {
        throw new CalculatorError("Result is outside the supported range");
      }
      return Object.is(value, -0) ? 0 : value;
    }

    parseAddSubtract() {
      let value = this.parseMultiplyDivide();
      while (this.tokens.is("operator", "+") || this.tokens.is("operator", "-")) {
        const operator = this.tokens.advance().value;
        const right = this.parseMultiplyDivide();
        value = operator === "+" ? value + right : value - right;
      }
      return value;
    }

    parseMultiplyDivide() {
      let value = this.parseUnary();

      while (true) {
        if (this.tokens.is("operator", "*") || this.tokens.is("operator", "/")) {
          const operator = this.tokens.advance().value;
          const right = this.parseUnary();
          if (operator === "/" && right === 0) throw new CalculatorError("Division by zero");
          value = operator === "*" ? value * right : value / right;
          continue;
        }

        if (this.tokens.is("identifier", "nPr") || this.tokens.is("identifier", "nCr")) {
          const operator = this.tokens.advance().value;
          const right = this.parseUnary();
          value = operator === "nPr" ? permutation(value, right) : combination(value, right);
          continue;
        }

        if (this.startsImplicitProduct()) {
          value *= this.parseUnary();
          continue;
        }

        break;
      }

      return value;
    }

    startsImplicitProduct() {
      if (this.tokens.is("number") || this.tokens.is("constant") || this.tokens.is("operator", "(")) {
        return true;
      }
      if (!this.tokens.is("identifier")) return false;
      return !["nPr", "nCr"].includes(this.tokens.current.value);
    }

    parseUnary() {
      if (this.tokens.is("operator", "+")) {
        this.tokens.advance();
        return this.parseUnary();
      }
      if (this.tokens.is("operator", "-")) {
        this.tokens.advance();
        return -this.parseUnary();
      }
      return this.parsePower();
    }

    parsePower() {
      const base = this.parsePostfix();
      if (this.tokens.is("operator", "^")) {
        this.tokens.advance();
        return Math.pow(base, this.parseUnary());
      }
      return base;
    }

    parsePostfix() {
      let value = this.parsePrimary();
      while (this.tokens.is("operator", "!") || this.tokens.is("operator", "%")) {
        const operator = this.tokens.advance().value;
        value = operator === "!" ? factorial(value) : value / 100;
      }
      return value;
    }

    parsePrimary() {
      if (this.tokens.is("number")) return this.tokens.advance().value;

      if (this.tokens.is("constant")) {
        this.tokens.advance();
        return Math.PI;
      }

      if (this.tokens.is("operator", "(")) {
        this.tokens.advance();
        const value = this.parseAddSubtract();
        this.tokens.expect("operator", ")");
        return value;
      }

      if (this.tokens.is("identifier")) {
        const identifier = this.tokens.advance().value;
        const normalized = identifier.toLowerCase();

        if (normalized === "ans") return this.context.ans;
        if (normalized === "m") return this.context.memory;
        if (normalized === "e") return Math.E;
        if (Object.prototype.hasOwnProperty.call(this.context.variables, identifier)) {
          return Number(this.context.variables[identifier]) || 0;
        }

        this.tokens.expect("operator", "(");
        const args = [];
        if (!this.tokens.is("operator", ")")) {
          args.push(this.parseAddSubtract());
          while (this.tokens.is("operator", ",")) {
            this.tokens.advance();
            args.push(this.parseAddSubtract());
          }
        }
        this.tokens.expect("operator", ")");
        return this.callFunction(normalized, args);
      }

      throw new CalculatorError("A value was expected", "Syntax ERROR");
    }

    callFunction(name, args) {
      const requireArgs = (count) => {
        if (args.length !== count) {
          throw new CalculatorError(`${name} expects ${count} argument${count === 1 ? "" : "s"}`, "Syntax ERROR");
        }
      };

      const toRadians = (value) => {
        if (this.context.angle === "RAD") return value;
        if (this.context.angle === "GRAD") return (value * Math.PI) / 200;
        return (value * Math.PI) / 180;
      };

      const fromRadians = (value) => {
        if (this.context.angle === "RAD") return value;
        if (this.context.angle === "GRAD") return (value * 200) / Math.PI;
        return (value * 180) / Math.PI;
      };

      const unaryFunctions = {
        sin: (value) => Math.sin(toRadians(value)),
        cos: (value) => Math.cos(toRadians(value)),
        tan: (value) => Math.tan(toRadians(value)),
        asin: (value) => fromRadians(Math.asin(value)),
        acos: (value) => fromRadians(Math.acos(value)),
        atan: (value) => fromRadians(Math.atan(value)),
        sinh: Math.sinh,
        cosh: Math.cosh,
        tanh: Math.tanh,
        asinh: Math.asinh,
        acosh: Math.acosh,
        atanh: Math.atanh,
        sqrt: Math.sqrt,
        cbrt: Math.cbrt,
        abs: Math.abs,
        log: Math.log10,
        ln: Math.log,
        exp: Math.exp,
        pow10: (value) => Math.pow(10, value),
        rnd: (value) => Math.round(value),
      };

      if (name === "ran" || name === "random") {
        requireArgs(0);
        return this.context.random();
      }

      if (name === "root") {
        requireArgs(2);
        const [value, degree] = args;
        if (degree === 0) throw new CalculatorError("Root degree cannot be zero");
        if (value < 0 && Number.isInteger(degree) && Math.abs(degree % 2) === 1) {
          return -Math.pow(-value, 1 / degree);
        }
        return Math.pow(value, 1 / degree);
      }

      if (!(name in unaryFunctions)) {
        throw new CalculatorError(`Unknown function: ${name}`, "Syntax ERROR");
      }

      requireArgs(1);
      const result = unaryFunctions[name](args[0]);
      if (!Number.isFinite(result)) throw new CalculatorError(`${name} is undefined for this input`);
      return result;
    }
  }

  function trimDecimalZeros(value) {
    return value
      .replace(/(\.\d*?[1-9])0+(?=e|$)/i, "$1")
      .replace(/\.0+(?=e|$)/i, "")
      .replace(/e\+?/i, "×10^")
      .replace(/×10\^(-?)0+(\d+)/, "×10^$1$2");
  }

  function formatResult(value, options = {}) {
    if (!Number.isFinite(value)) throw new CalculatorError("Result is outside the supported range");
    if (Object.is(value, -0) || Math.abs(value) < 1e-15) value = 0;

    const format = options.format || "NORM";
    if (format === "FIX") {
      const digits = Number.isInteger(options.digits) ? options.digits : 4;
      return value.toFixed(Math.max(0, Math.min(9, digits)));
    }
    if (format === "SCI") {
      const digits = Number.isInteger(options.digits) ? options.digits : 6;
      return trimDecimalZeros(value.toExponential(Math.max(0, Math.min(9, digits - 1))));
    }

    const magnitude = Math.abs(value);
    if (magnitude !== 0 && (magnitude >= 1e10 || magnitude < 1e-9)) {
      return trimDecimalZeros(value.toExponential(9));
    }
    return trimDecimalZeros(Number(value.toPrecision(10)).toString());
  }

  function toFraction(value, maxDenominator = 100000) {
    if (!Number.isFinite(value)) throw new CalculatorError("Cannot convert this value to a fraction");
    if (Number.isInteger(value)) return String(value);

    const sign = value < 0 ? -1 : 1;
    let target = Math.abs(value);
    let previousNumerator = 0;
    let numerator = 1;
    let previousDenominator = 1;
    let denominator = 0;
    let iterations = 0;

    while (iterations < 32) {
      const integerPart = Math.floor(target);
      const nextNumerator = integerPart * numerator + previousNumerator;
      const nextDenominator = integerPart * denominator + previousDenominator;
      if (nextDenominator > maxDenominator) break;

      previousNumerator = numerator;
      numerator = nextNumerator;
      previousDenominator = denominator;
      denominator = nextDenominator;

      const remainder = target - integerPart;
      if (remainder < 1e-12) break;
      target = 1 / remainder;
      iterations += 1;
    }

    numerator *= sign;
    if (!denominator || Math.abs(value - numerator / denominator) > 1e-10) {
      throw new CalculatorError("No compact fraction is available");
    }

    const whole = Math.trunc(numerator / denominator);
    const remainder = Math.abs(numerator % denominator);
    if (whole !== 0 && remainder !== 0) return `${whole} ${remainder}⌟${denominator}`;
    return `${numerator}⌟${denominator}`;
  }

  function toDms(value) {
    if (!Number.isFinite(value)) throw new CalculatorError("Cannot convert this value to DMS");
    const sign = value < 0 ? "−" : "";
    const absolute = Math.abs(value);
    const degrees = Math.floor(absolute);
    const minutesFloat = (absolute - degrees) * 60;
    const minutes = Math.floor(minutesFloat);
    let seconds = (minutesFloat - minutes) * 60;
    seconds = Number(seconds.toFixed(6));
    return `${sign}${degrees}°${minutes}′${seconds}″`;
  }

  class Complex {
    constructor(real = 0, imaginary = 0) {
      this.re = Number(real);
      this.im = Number(imaginary);
    }

    static from(value) {
      return value instanceof Complex ? value : new Complex(value, 0);
    }

    static polar(radius, radians) {
      return new Complex(radius * Math.cos(radians), radius * Math.sin(radians));
    }

    add(other) {
      other = Complex.from(other);
      return new Complex(this.re + other.re, this.im + other.im);
    }

    subtract(other) {
      other = Complex.from(other);
      return new Complex(this.re - other.re, this.im - other.im);
    }

    multiply(other) {
      other = Complex.from(other);
      return new Complex(
        this.re * other.re - this.im * other.im,
        this.re * other.im + this.im * other.re,
      );
    }

    divide(other) {
      other = Complex.from(other);
      const denominator = other.re ** 2 + other.im ** 2;
      if (denominator === 0) throw new CalculatorError("Division by zero");
      return new Complex(
        (this.re * other.re + this.im * other.im) / denominator,
        (this.im * other.re - this.re * other.im) / denominator,
      );
    }

    negate() {
      return new Complex(-this.re, -this.im);
    }

    conjugate() {
      return new Complex(this.re, -this.im);
    }

    magnitude() {
      return Math.hypot(this.re, this.im);
    }

    argument() {
      return Math.atan2(this.im, this.re);
    }

    exp() {
      const scale = Math.exp(this.re);
      return new Complex(scale * Math.cos(this.im), scale * Math.sin(this.im));
    }

    log() {
      if (this.re === 0 && this.im === 0) throw new CalculatorError("Logarithm of zero");
      return new Complex(Math.log(this.magnitude()), this.argument());
    }

    power(exponent) {
      exponent = Complex.from(exponent);
      if (this.re === 0 && this.im === 0) {
        if (exponent.im === 0 && exponent.re > 0) return new Complex(0, 0);
        throw new CalculatorError("Undefined complex power");
      }
      return this.log().multiply(exponent).exp();
    }
  }

  class ComplexParser {
    constructor(source, context = {}) {
      this.tokens = new Tokenizer(source);
      this.context = {
        angle: context.angle || "DEG",
        ans: Complex.from(context.ans || new Complex()),
        variables: context.variables || {},
      };
    }

    parse() {
      const value = this.parsePolar();
      if (!this.tokens.is("eof")) throw new CalculatorError("Unexpected input after expression", "Syntax ERROR");
      if (!Number.isFinite(value.re) || !Number.isFinite(value.im)) throw new CalculatorError("Complex result is outside the supported range");
      if (Math.abs(value.re) < 1e-14) value.re = 0;
      if (Math.abs(value.im) < 1e-14) value.im = 0;
      return value;
    }

    toRadians(value) {
      if (this.context.angle === "RAD") return value;
      if (this.context.angle === "GRAD") return (value * Math.PI) / 200;
      return (value * Math.PI) / 180;
    }

    fromRadians(value) {
      if (this.context.angle === "RAD") return value;
      if (this.context.angle === "GRAD") return (value * 200) / Math.PI;
      return (value * 180) / Math.PI;
    }

    parsePolar() {
      let value = this.parseAddSubtract();
      if (this.tokens.is("operator", "∠")) {
        this.tokens.advance();
        const angle = this.parseAddSubtract();
        this.requireReal(value, "Polar radius");
        this.requireReal(angle, "Polar angle");
        value = Complex.polar(value.re, this.toRadians(angle.re));
      }
      return value;
    }

    parseAddSubtract() {
      let value = this.parseMultiplyDivide();
      while (this.tokens.is("operator", "+") || this.tokens.is("operator", "-")) {
        const operator = this.tokens.advance().value;
        const right = this.parseMultiplyDivide();
        value = operator === "+" ? value.add(right) : value.subtract(right);
      }
      return value;
    }

    parseMultiplyDivide() {
      let value = this.parseUnary();
      while (true) {
        if (this.tokens.is("operator", "*") || this.tokens.is("operator", "/")) {
          const operator = this.tokens.advance().value;
          const right = this.parseUnary();
          value = operator === "*" ? value.multiply(right) : value.divide(right);
        } else if (this.startsImplicitProduct()) {
          value = value.multiply(this.parseUnary());
        } else {
          break;
        }
      }
      return value;
    }

    startsImplicitProduct() {
      return this.tokens.is("number") || this.tokens.is("constant") || this.tokens.is("identifier") || this.tokens.is("operator", "(");
    }

    parseUnary() {
      if (this.tokens.is("operator", "+")) {
        this.tokens.advance();
        return this.parseUnary();
      }
      if (this.tokens.is("operator", "-")) {
        this.tokens.advance();
        return this.parseUnary().negate();
      }
      return this.parsePower();
    }

    parsePower() {
      const base = this.parsePostfix();
      if (this.tokens.is("operator", "^")) {
        this.tokens.advance();
        return base.power(this.parseUnary());
      }
      return base;
    }

    parsePostfix() {
      let value = this.parsePrimary();
      while (this.tokens.is("operator", "!") || this.tokens.is("operator", "%")) {
        const operator = this.tokens.advance().value;
        if (operator === "!") {
          this.requireReal(value, "Factorial");
          value = new Complex(factorial(value.re), 0);
        } else {
          value = value.divide(100);
        }
      }
      return value;
    }

    parsePrimary() {
      if (this.tokens.is("number")) return new Complex(this.tokens.advance().value, 0);
      if (this.tokens.is("constant")) {
        this.tokens.advance();
        return new Complex(Math.PI, 0);
      }
      if (this.tokens.is("operator", "(")) {
        this.tokens.advance();
        const value = this.parsePolar();
        this.tokens.expect("operator", ")");
        return value;
      }
      if (!this.tokens.is("identifier")) throw new CalculatorError("A value was expected", "Syntax ERROR");

      const identifier = this.tokens.advance().value;
      const name = identifier.toLowerCase();
      if (name === "i") return new Complex(0, 1);
      if (name === "e") return new Complex(Math.E, 0);
      if (name === "ans") return this.context.ans;
      if (Object.prototype.hasOwnProperty.call(this.context.variables, identifier)) {
        return Complex.from(this.context.variables[identifier]);
      }

      this.tokens.expect("operator", "(");
      const args = [];
      if (!this.tokens.is("operator", ")")) {
        args.push(this.parsePolar());
        while (this.tokens.is("operator", ",")) {
          this.tokens.advance();
          args.push(this.parsePolar());
        }
      }
      this.tokens.expect("operator", ")");
      return this.callFunction(name, args);
    }

    requireReal(value, label) {
      if (Math.abs(value.im) > 1e-12) throw new CalculatorError(`${label} requires a real value`);
    }

    callFunction(name, args) {
      if (args.length !== 1) throw new CalculatorError(`${name} expects one argument`, "Syntax ERROR");
      const value = args[0];
      const scaled = value.multiply(this.toRadians(1));

      if (name === "conjg" || name === "conj") return value.conjugate();
      if (name === "abs") return new Complex(value.magnitude(), 0);
      if (name === "arg") return new Complex(this.fromRadians(value.argument()), 0);
      if (name === "exp") return value.exp();
      if (name === "ln" || name === "log") {
        const result = value.log();
        return name === "log" ? result.divide(Math.LN10) : result;
      }
      if (name === "sqrt") return value.power(0.5);
      if (name === "cbrt") return value.power(1 / 3);
      if (name === "sin") return new Complex(
        Math.sin(scaled.re) * Math.cosh(scaled.im),
        Math.cos(scaled.re) * Math.sinh(scaled.im),
      );
      if (name === "cos") return new Complex(
        Math.cos(scaled.re) * Math.cosh(scaled.im),
        -Math.sin(scaled.re) * Math.sinh(scaled.im),
      );
      if (name === "tan") {
        const sine = this.callFunction("sin", [value]);
        const cosine = this.callFunction("cos", [value]);
        return sine.divide(cosine);
      }
      throw new CalculatorError(`Unsupported complex function: ${name}`, "Syntax ERROR");
    }
  }

  function formatComplex(value, options = {}) {
    value = Complex.from(value);
    const numberOptions = { format: options.numberFormat || "NORM", digits: options.digits || 6 };
    if (options.form === "POLAR") {
      const radians = value.argument();
      const angle = options.angle === "RAD" ? radians : options.angle === "GRAD" ? (radians * 200) / Math.PI : (radians * 180) / Math.PI;
      return `${formatResult(value.magnitude(), numberOptions)}∠${formatResult(angle, numberOptions)}`;
    }

    const real = Math.abs(value.re) < 1e-14 ? 0 : value.re;
    const imaginary = Math.abs(value.im) < 1e-14 ? 0 : value.im;
    if (imaginary === 0) return formatResult(real, numberOptions);
    if (real === 0) return `${formatResult(imaginary, numberOptions)}i`;
    const sign = imaginary < 0 ? "−" : "+";
    return `${formatResult(real, numberOptions)} ${sign} ${formatResult(Math.abs(imaginary), numberOptions)}i`;
  }

  class BaseTokenizer {
    constructor(source) {
      this.source = String(source);
      this.index = 0;
      this.current = this.readToken();
    }

    readToken() {
      while (/\s/.test(this.source[this.index] || "")) this.index += 1;
      if (this.index >= this.source.length) return { type: "eof", value: "" };
      const rest = this.source.slice(this.index);
      const prefixedNumber = rest.match(/^([dhbo])([0-9A-F]+)/);
      if (prefixedNumber) {
        this.index += prefixedNumber[0].length;
        return {
          type: "number",
          value: prefixedNumber[2].toUpperCase(),
          base: ({ d: 10, h: 16, b: 2, o: 8 })[prefixedNumber[1]],
        };
      }
      const keyword = rest.match(/^(AND|OR|XNOR|XOR|NOT|NEG)\b/i);
      if (keyword) {
        this.index += keyword[0].length;
        return { type: "keyword", value: keyword[0].toUpperCase() };
      }
      const number = rest.match(/^[0-9A-F]+/i);
      if (number) {
        this.index += number[0].length;
        return { type: "number", value: number[0].toUpperCase() };
      }
      const character = this.source[this.index];
      if ("+-×÷*/()".includes(character)) {
        this.index += 1;
        return { type: "operator", value: character === "×" ? "*" : character === "÷" ? "/" : character };
      }
      throw new CalculatorError(`Invalid BASE character: ${character}`, "Syntax ERROR");
    }

    advance() {
      const token = this.current;
      this.current = this.readToken();
      return token;
    }

    is(type, value) {
      return this.current.type === type && (value === undefined || this.current.value === value);
    }
  }

  class BaseParser {
    constructor(source, base) {
      this.tokens = new BaseTokenizer(source);
      this.base = base;
    }

    parse() {
      const result = this.parseOr();
      if (!this.tokens.is("eof")) throw new CalculatorError("Unexpected BASE input", "Syntax ERROR");
      const limits = BaseParser.limitsFor(this.base);
      if (!Number.isInteger(result) || result < limits.minimum || result > limits.maximum) {
        throw new CalculatorError(`BASE result is outside the ${limits.bits}-bit ${this.base === 10 ? "decimal" : "display"} range`);
      }
      return result | 0;
    }

    static limitsFor(base) {
      const bits = base === 2 ? 10 : base === 8 ? 30 : 32;
      return {
        bits,
        minimum: -(2 ** (bits - 1)),
        maximum: 2 ** (bits - 1) - 1,
        maximumUnsigned: 2 ** bits - 1,
      };
    }

    parseOr() {
      let value = this.parseXor();
      while (this.tokens.is("keyword", "OR")) {
        this.tokens.advance();
        value = value | this.parseXor();
      }
      return value;
    }

    parseXor() {
      let value = this.parseAnd();
      while (this.tokens.is("keyword", "XOR") || this.tokens.is("keyword", "XNOR")) {
        const operator = this.tokens.advance().value;
        const right = this.parseAnd();
        value = operator === "XOR" ? value ^ right : ~(value ^ right);
      }
      return value;
    }

    parseAnd() {
      let value = this.parseAddSubtract();
      while (this.tokens.is("keyword", "AND")) {
        this.tokens.advance();
        value = value & this.parseAddSubtract();
      }
      return value;
    }

    parseAddSubtract() {
      let value = this.parseMultiplyDivide();
      while (this.tokens.is("operator", "+") || this.tokens.is("operator", "-")) {
        const operator = this.tokens.advance().value;
        const right = this.parseMultiplyDivide();
        value = operator === "+" ? value + right : value - right;
      }
      return value;
    }

    parseMultiplyDivide() {
      let value = this.parseUnary();
      while (this.tokens.is("operator", "*") || this.tokens.is("operator", "/")) {
        const operator = this.tokens.advance().value;
        const right = this.parseUnary();
        if (operator === "/" && right === 0) throw new CalculatorError("Division by zero");
        value = operator === "*" ? value * right : Math.trunc(value / right);
      }
      return value;
    }

    parseUnary() {
      if (this.tokens.is("operator", "+")) {
        this.tokens.advance();
        return this.parseUnary();
      }
      if (this.tokens.is("operator", "-") || this.tokens.is("keyword", "NEG")) {
        this.tokens.advance();
        return -this.parseUnary();
      }
      if (this.tokens.is("keyword", "NOT")) {
        this.tokens.advance();
        return ~this.parseUnary();
      }
      return this.parsePrimary();
    }

    parsePrimary() {
      if (this.tokens.is("number")) {
        const token = this.tokens.advance();
        const raw = token.value;
        const literalBase = token.base || this.base;
        const allowed = "0123456789ABCDEF".slice(0, literalBase);
        if ([...raw].some((character) => !allowed.includes(character))) {
          throw new CalculatorError(`Digit is invalid in base ${literalBase}`, "Syntax ERROR");
        }
        const value = parseInt(raw, literalBase);
        const limits = BaseParser.limitsFor(literalBase);
        const largestLiteral = literalBase === 10 ? 2 ** 31 : limits.maximumUnsigned;
        if (!Number.isSafeInteger(value) || value > largestLiteral) {
          throw new CalculatorError(`Value is outside the supported base-${literalBase} range`, "Math ERROR");
        }
        if (literalBase !== 10 && value > limits.maximum) return value - 2 ** limits.bits;
        return value;
      }
      if (this.tokens.is("operator", "(")) {
        this.tokens.advance();
        const value = this.parseOr();
        if (!this.tokens.is("operator", ")")) throw new CalculatorError("Missing closing bracket", "Syntax ERROR");
        this.tokens.advance();
        return value;
      }
      throw new CalculatorError("A BASE value was expected", "Syntax ERROR");
    }
  }

  function formatBase(value, base) {
    if (!Number.isInteger(value)) throw new CalculatorError("BASE results must be integers");
    const limits = BaseParser.limitsFor(base);
    if (value < limits.minimum || value > limits.maximum) {
      throw new CalculatorError(`Value is outside the supported base-${base} range`);
    }
    if (base === 10) return String(value);
    const unsigned = value < 0 ? value + 2 ** limits.bits : value;
    return unsigned.toString(base).toUpperCase();
  }

  function statistics(samples) {
    const valid = (samples || []).map((sample) => ({
      x: Number(sample.x),
      freq: sample.freq === undefined ? 1 : Number(sample.freq),
    })).filter((sample) => Number.isFinite(sample.x) && Number.isFinite(sample.freq) && sample.freq > 0);
    if (!valid.length) throw new CalculatorError("Enter at least one statistical sample", "Data ERROR");
    const n = valid.reduce((sum, item) => sum + item.freq, 0);
    const sum = valid.reduce((total, item) => total + item.x * item.freq, 0);
    const sumSquares = valid.reduce((total, item) => total + item.x ** 2 * item.freq, 0);
    const mean = sum / n;
    const squaredDeviation = valid.reduce((total, item) => total + (item.x - mean) ** 2 * item.freq, 0);
    return {
      n,
      sum,
      sumSquares,
      mean,
      populationSd: Math.sqrt(squaredDeviation / n),
      sampleSd: n > 1 ? Math.sqrt(squaredDeviation / (n - 1)) : NaN,
      min: Math.min(...valid.map((item) => item.x)),
      max: Math.max(...valid.map((item) => item.x)),
    };
  }

  function solveLinearSystem(matrix, vector) {
    const size = vector.length;
    const augmented = matrix.map((row, index) => [...row, vector[index]]);
    for (let column = 0; column < size; column += 1) {
      let pivot = column;
      for (let row = column + 1; row < size; row += 1) {
        if (Math.abs(augmented[row][column]) > Math.abs(augmented[pivot][column])) pivot = row;
      }
      if (Math.abs(augmented[pivot][column]) < 1e-14) throw new CalculatorError("Regression data is singular", "Data ERROR");
      [augmented[column], augmented[pivot]] = [augmented[pivot], augmented[column]];
      const divisor = augmented[column][column];
      for (let cell = column; cell <= size; cell += 1) augmented[column][cell] /= divisor;
      for (let row = 0; row < size; row += 1) {
        if (row === column) continue;
        const factor = augmented[row][column];
        for (let cell = column; cell <= size; cell += 1) augmented[row][cell] -= factor * augmented[column][cell];
      }
    }
    return augmented.map((row) => row[size]);
  }

  function regression(samples, type = "LIN") {
    const expanded = [];
    for (const sample of samples || []) {
      const x = Number(sample.x);
      const y = Number(sample.y);
      const freq = sample.freq === undefined ? 1 : Number(sample.freq);
      if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(freq) || freq <= 0) continue;
      expanded.push({ x, y, freq });
    }
    if (expanded.length < 2) throw new CalculatorError("Enter at least two paired samples", "Data ERROR");

    if (type === "QUAD") {
      const sums = (powerX, powerY = 0) => expanded.reduce((total, item) => total + item.x ** powerX * item.y ** powerY * item.freq, 0);
      const n = expanded.reduce((total, item) => total + item.freq, 0);
      const [a, b, c] = solveLinearSystem(
        [[n, sums(1), sums(2)], [sums(1), sums(2), sums(3)], [sums(2), sums(3), sums(4)]],
        [sums(0, 1), sums(1, 1), sums(2, 1)],
      );
      const predict = (x) => a + b * x + c * x * x;
      return { type, a, b, c, r: predictionCorrelation(expanded, predict), predict };
    }

    const transforms = {
      LIN: { x: (x) => x, y: (y) => y, coefficients: (a, b) => ({ a, b }), predict: (a, b, x) => a + b * x },
      LOG: { x: Math.log, y: (y) => y, coefficients: (a, b) => ({ a, b }), predict: (a, b, x) => a + b * Math.log(x) },
      EXP: { x: (x) => x, y: Math.log, coefficients: (a, b) => ({ a: Math.exp(a), b }), predict: (a, b, x) => a * Math.exp(b * x) },
      ABEXP: { x: (x) => x, y: Math.log, coefficients: (a, b) => ({ a: Math.exp(a), b: Math.exp(b) }), predict: (a, b, x) => a * b ** x },
      PWR: { x: Math.log, y: Math.log, coefficients: (a, b) => ({ a: Math.exp(a), b }), predict: (a, b, x) => a * x ** b },
      INV: { x: (x) => 1 / x, y: (y) => y, coefficients: (a, b) => ({ a, b }), predict: (a, b, x) => a + b / x },
    };
    const transform = transforms[type] || transforms.LIN;
    const transformed = expanded.map((item) => ({ x: transform.x(item.x), y: transform.y(item.y), freq: item.freq }));
    if (transformed.some((item) => !Number.isFinite(item.x) || !Number.isFinite(item.y))) {
      throw new CalculatorError("Data is outside this regression domain", "Data ERROR");
    }
    const weight = transformed.reduce((total, item) => total + item.freq, 0);
    const meanX = transformed.reduce((total, item) => total + item.x * item.freq, 0) / weight;
    const meanY = transformed.reduce((total, item) => total + item.y * item.freq, 0) / weight;
    const covariance = transformed.reduce((total, item) => total + (item.x - meanX) * (item.y - meanY) * item.freq, 0);
    const varianceX = transformed.reduce((total, item) => total + (item.x - meanX) ** 2 * item.freq, 0);
    const varianceY = transformed.reduce((total, item) => total + (item.y - meanY) ** 2 * item.freq, 0);
    if (varianceX === 0) throw new CalculatorError("Regression x-values must vary", "Data ERROR");
    const rawB = covariance / varianceX;
    const rawA = meanY - rawB * meanX;
    const coefficients = transform.coefficients(rawA, rawB);
    const predict = (x) => transform.predict(coefficients.a, coefficients.b, x);
    return {
      type,
      ...coefficients,
      r: varianceY === 0 ? NaN : covariance / Math.sqrt(varianceX * varianceY),
      predict,
    };
  }

  function predictionCorrelation(samples, predict) {
    const weight = samples.reduce((total, item) => total + item.freq, 0);
    const meanY = samples.reduce((total, item) => total + item.y * item.freq, 0) / weight;
    const predictions = samples.map((item) => ({ ...item, predicted: predict(item.x) }));
    const meanPrediction = predictions.reduce((total, item) => total + item.predicted * item.freq, 0) / weight;
    const covariance = predictions.reduce((total, item) => total + (item.y - meanY) * (item.predicted - meanPrediction) * item.freq, 0);
    const varianceY = predictions.reduce((total, item) => total + (item.y - meanY) ** 2 * item.freq, 0);
    const variancePrediction = predictions.reduce((total, item) => total + (item.predicted - meanPrediction) ** 2 * item.freq, 0);
    return covariance / Math.sqrt(varianceY * variancePrediction);
  }

  function runProgram(source, inputValues = [], context = {}) {
    const variables = { A: 0, B: 0, C: 0, D: 0, X: 0, Y: 0, M: Number(context.memory) || 0, ...(context.variables || {}) };
    const queue = inputValues.map(Number);
    const outputs = [];
    let ans = Number(context.ans) || 0;
    const statements = String(source).split(/[:\n]+/).map((item) => item.trim()).filter(Boolean);
    if (!statements.length) throw new CalculatorError("Program is empty", "Program ERROR");
    if (statements.length > 100) throw new CalculatorError("Program has too many statements", "Program ERROR");

    for (const statement of statements) {
      const promptMatch = statement.match(/^\?\s*(?:→|->)\s*([A-DXYM])$/i);
      if (promptMatch) {
        if (!queue.length) throw new CalculatorError(`Input required for ${promptMatch[1].toUpperCase()}`, "Input ERROR");
        variables[promptMatch[1].toUpperCase()] = queue.shift();
        ans = variables[promptMatch[1].toUpperCase()];
        continue;
      }

      const assignmentMatch = statement.match(/^(.*?)\s*(?:→|->)\s*([A-DXYM])$/i);
      if (assignmentMatch) {
        const value = new Parser(assignmentMatch[1], { ...context, ans, variables }).parse();
        variables[assignmentMatch[2].toUpperCase()] = value;
        ans = value;
        continue;
      }

      ans = new Parser(statement.replace(/◢/g, ""), { ...context, ans, variables }).parse();
      outputs.push(ans);
    }

    return { ans, variables, outputs };
  }

  const CalculatorCore = {
    CalculatorError,
    evaluate(expression, context) {
      if (!String(expression).trim()) return 0;
      return new Parser(expression, context).parse();
    },
    Complex,
    evaluateComplex(expression, context) {
      if (!String(expression).trim()) return new Complex();
      return new ComplexParser(expression, context).parse();
    },
    formatComplex,
    evaluateBase(expression, base = 10) {
      if (!String(expression).trim()) return 0;
      return new BaseParser(expression, base).parse();
    },
    formatBase,
    statistics,
    regression,
    runProgram,
    factorial,
    permutation,
    combination,
    formatResult,
    toFraction,
    toDms,
  };

  globalScope.CalculatorCore = CalculatorCore;
  if (typeof module !== "undefined" && module.exports) module.exports = CalculatorCore;
})(typeof window !== "undefined" ? window : globalThis);
