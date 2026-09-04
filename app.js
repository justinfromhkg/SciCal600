(function scientificCalculatorApp() {
  "use strict";

  const core = window.CalculatorCore;
  const catalogue = window.CalculatorData;

  const elements = {
    keypad: document.querySelector("#keypad"),
    expression: document.querySelector("#expression"),
    result: document.querySelector("#result"),
    shift: document.querySelector("#shift-indicator"),
    alpha: document.querySelector("#alpha-indicator"),
    memory: document.querySelector("#memory-indicator"),
    angle: document.querySelector("#angle-indicator"),
    format: document.querySelector("#format-indicator"),
    mode: document.querySelector("#mode-indicator"),
    modeDialog: document.querySelector("#mode-dialog"),
    settingsDialog: document.querySelector("#settings-dialog"),
    angleControl: document.querySelector("#angle-control"),
    formatControl: document.querySelector("#format-control"),
    workbench: document.querySelector("#mode-workbench"),
    toast: document.querySelector("#toast"),
    stageMode: document.querySelector("#stage-mode"),
    interfaceToggle: document.querySelector("#interface-mode-toggle"),
    interfaceModeLabel: document.querySelector("[data-interface-mode-label]"),
  };

  const state = {
    expression: "",
    cursor: 0,
    resultText: "0",
    lastResult: 0,
    ans: 0,
    memory: 0,
    shift: false,
    alpha: false,
    hyp: false,
    angle: "DEG",
    format: "NORM",
    formatDigits: 4,
    fractionView: false,
    history: [],
    historyIndex: 0,
    justEvaluated: false,
    powered: true,
    mode: "COMP",
    interfaceMode: "web",
    base: 10,
    complexForm: "RECT",
    lastComplex: new core.Complex(0, 0),
    ansComplex: new core.Complex(0, 0),
    sdData: [],
    regData: [],
    regressionType: "LIN",
    workbenchView: "mode",
    selectedFormula: 0,
    workbenchMessage: "",
    complexPart: "RE",
    variables: { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0, X: 0, Y: 0 },
    programSlot: 0,
    statisticsResultIndex: 0,
    regressionResultIndex: 0,
    programs: [
      { name: "P1", source: "?→A : A×2.54" },
      { name: "P2", source: "" },
      { name: "P3", source: "" },
      { name: "P4", source: "" },
    ],
  };

  const keyDefinitions = [
    { label: "Prog", className: "calc-key--orange", action: "set-mode", targetMode: "PRGM" },
    { label: "FMLA", className: "calc-key--orange", action: "catalogue", catalogue: "formulas" },
    { spacer: true },
    { spacer: true },
    { label: "x⁻¹", shiftLabel: "LOGIC", action: "reciprocal", shiftAction: "show-workbench" },
    { label: "x³", shiftLabel: "³√", input: "^3", shiftInput: "cbrt(" },

    { label: "a b/c", shiftLabel: "d/c", action: "fraction", shiftAction: "fraction" },
    { label: "√", input: "sqrt(" },
    { label: "x²", shiftLabel: "DEC", input: "^2", shiftAction: "base-select", targetBase: 10 },
    { label: "^", shiftLabel: "ˣ√", input: "^(", shiftInput: "root(" },
    { label: "log", shiftLabel: "10ˣ", input: "log(", shiftInput: "pow10(" },
    { label: "ln", shiftLabel: "eˣ", input: "ln(", shiftInput: "exp(" },

    { label: "(−)", alphaLabel: "A", input: "-", alphaAction: "variable", variable: "A" },
    { label: "°′″", alphaLabel: "B", action: "dms", alphaAction: "variable", variable: "B" },
    { label: "hyp", alphaLabel: "C", action: "hyp", alphaAction: "variable", variable: "C" },
    { label: "sin", shiftLabel: "sin⁻¹", alphaLabel: "D", action: "sin", shiftAction: "asin", alphaAction: "variable", variable: "D" },
    { label: "cos", shiftLabel: "cos⁻¹", alphaLabel: "E", action: "cos", shiftAction: "acos", alphaAction: "variable", variable: "E" },
    { label: "tan", shiftLabel: "tan⁻¹", alphaLabel: "F", action: "tan", shiftAction: "atan", alphaAction: "variable", variable: "F" },

    { label: "RCL", shiftLabel: "STO", action: "memory-recall", shiftAction: "memory-store" },
    { label: "ENG", alphaLabel: "i", action: "engineering", alphaInput: "i" },
    { label: "(", shiftLabel: "%", input: "(", shiftInput: "%" },
    { label: ")", shiftLabel: "Abs", alphaLabel: "X", input: ")", shiftInput: "abs(", alphaAction: "variable", variable: "X" },
    { label: ",", alphaLabel: "Y", input: ",", alphaAction: "variable", variable: "Y" },
    { label: "M+", shiftLabel: "M−", alphaLabel: "M", action: "memory-add", shiftAction: "memory-subtract", alphaAction: "memory-recall" },

    { label: "7", shiftLabel: "CONST", input: "7", shiftAction: "catalogue", catalogue: "constants", size: "number" },
    { label: "8", input: "8", size: "number" },
    { label: "9", shiftLabel: "CLR", input: "9", shiftAction: "all-clear", size: "number" },
    { label: "DEL", shiftLabel: "INS", action: "delete", shiftAction: "insert-info", className: "calc-key--danger", size: "number" },
    { label: "AC", shiftLabel: "OFF", action: "clear", shiftAction: "off", className: "calc-key--danger", size: "number" },

    { label: "4", input: "4", size: "number" },
    { label: "5", input: "5", size: "number" },
    { label: "6", input: "6", size: "number" },
    { label: "×", shiftLabel: "nPr", input: "×", shiftInput: " nPr ", size: "number" },
    { label: "÷", shiftLabel: "nCr", input: "÷", shiftInput: " nCr ", size: "number" },

    { label: "1", shiftLabel: "S-SUM", input: "1", shiftAction: "statistics-summary", size: "number" },
    { label: "2", shiftLabel: "S-VAR", input: "2", shiftAction: "statistics-variables", size: "number" },
    { label: "3", shiftLabel: "P-CMD", input: "3", shiftAction: "program-command", size: "number" },
    { label: "+", shiftLabel: "Pol", input: "+", shiftAction: "coordinate-polar", size: "number" },
    { label: "−", shiftLabel: "Rec", input: "-", shiftAction: "coordinate-rectangular", size: "number" },

    { label: "0", shiftLabel: "Rnd", input: "0", shiftAction: "round", size: "number" },
    { label: ".", shiftLabel: "Ran#", input: ".", shiftInput: "ran()", size: "number" },
    { label: "EXP", shiftLabel: "π", action: "exponent", shiftInput: "π", size: "number" },
    { label: "Ans", shiftLabel: "DRG▶", input: "Ans", shiftAction: "cycle-angle", size: "number" },
    { label: "EXE", shiftLabel: "Re↔Im", action: "execute", shiftAction: "complex-toggle", className: "calc-key--execute", size: "number" },
  ];

  let toastTimer;

  try {
    const savedPrograms = JSON.parse(
      window.localStorage.getItem("scical600.programs")
      || window.localStorage.getItem("scientific50.programs")
      || "null",
    );
    if (Array.isArray(savedPrograms) && savedPrograms.length === 4) {
      savedPrograms.forEach((source, index) => {
        if (typeof source === "string") state.programs[index].source = source;
      });
    }
  } catch (_error) {
    // Storage can be unavailable in private/file contexts; programs still work in memory.
  }

  function savePrograms() {
    try {
      window.localStorage.setItem("scical600.programs", JSON.stringify(state.programs.map((program) => program.source)));
    } catch (_error) {
      // Keep the current session usable even when persistent storage is unavailable.
    }
  }

  function renderKeypad() {
    const fragment = document.createDocumentFragment();
    keyDefinitions.forEach((key, index) => {
      if (key.spacer) {
        const spacer = document.createElement("span");
        spacer.setAttribute("aria-hidden", "true");
        fragment.append(spacer);
        return;
      }

      const button = document.createElement("button");
      button.type = "button";
      button.className = `calc-key ${key.className || ""}`.trim();
      if (key.shiftLabel || key.alphaLabel) button.classList.add("calc-key--layered");
      button.dataset.keyIndex = String(index);
      if (key.size) button.dataset.size = key.size;
      button.setAttribute("aria-label", describeKey(key));

      if (key.shiftLabel) {
        const shift = document.createElement("span");
        shift.className = "calc-key__shift";
        shift.textContent = key.shiftLabel;
        button.append(shift);
      }
      if (key.alphaLabel) {
        const alpha = document.createElement("span");
        alpha.className = "calc-key__alpha";
        alpha.textContent = key.alphaLabel;
        button.append(alpha);
      }
      const mainLabel = document.createElement("span");
      mainLabel.className = "calc-key__main";
      mainLabel.textContent = key.label;
      button.append(mainLabel);
      fragment.append(button);
    });
    elements.keypad.append(fragment);
  }

  function describeKey(key) {
    const extras = [];
    if (key.shiftLabel) extras.push(`Shift: ${key.shiftLabel}`);
    if (key.alphaLabel) extras.push(`Alpha: ${key.alphaLabel}`);
    return extras.length ? `${key.label}. ${extras.join(". ")}` : key.label;
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  function render() {
    if (!state.powered) {
      elements.expression.textContent = "";
      elements.result.textContent = "";
      document.querySelectorAll(".display__indicators span").forEach((item) => item.classList.remove("is-on"));
      return;
    }

    const beforeCursor = escapeHtml(state.expression.slice(0, state.cursor));
    const afterCursor = escapeHtml(state.expression.slice(state.cursor));
    const shownExpression = state.expression
      ? `${beforeCursor}<span class="cursor" aria-hidden="true"></span>${afterCursor}`
      : '<span class="cursor" aria-hidden="true"></span>';

    elements.expression.innerHTML = shownExpression;
    elements.result.textContent = state.resultText;
    elements.shift.classList.toggle("is-on", state.shift);
    elements.alpha.classList.toggle("is-on", state.alpha);
    elements.memory.classList.toggle("is-on", state.memory !== 0);
    elements.angle.classList.add("is-on");
    elements.angle.textContent = state.angle === "DEG" ? "D" : state.angle === "RAD" ? "R" : "G";
    elements.format.textContent = state.mode === "BASE" ? ({ 2: "BIN", 8: "OCT", 10: "DEC", 16: "HEX" })[state.base] : state.format;
    elements.mode.textContent = state.mode;
    elements.stageMode.textContent = `${String(["COMP", "CMPLX", "BASE", "SD", "REG", "PRGM"].indexOf(state.mode) + 1).padStart(2, "0")} / ${state.mode}`;
    document.body.dataset.interfaceMode = state.interfaceMode;
    elements.interfaceToggle?.setAttribute("aria-pressed", String(state.interfaceMode === "simulator"));
    if (elements.interfaceModeLabel) {
      const key = state.interfaceMode === "simulator" ? "simulatorMode" : "webMode";
      elements.interfaceModeLabel.dataset.i18n = key;
      elements.interfaceModeLabel.textContent = window.SciCalUI?.translate?.(key) || (state.interfaceMode === "simulator" ? "Simulator mode" : "Web mode");
    }

    document.querySelectorAll("[data-mode]").forEach((button) => {
      button.classList.toggle("mode-option--active", button.dataset.mode === state.mode);
    });

    document.querySelector('[data-action="shift"]')?.classList.toggle("is-active", state.shift);
    document.querySelector('[data-action="alpha"]')?.classList.toggle("is-active", state.alpha);
  }

  function showToast(message) {
    window.clearTimeout(toastTimer);
    elements.toast.textContent = message;
    elements.toast.classList.add("is-visible");
    toastTimer = window.setTimeout(() => elements.toast.classList.remove("is-visible"), 2400);
  }

  function wakeIfNeeded() {
    if (state.powered) return false;
    state.powered = true;
    state.expression = "";
    state.cursor = 0;
    state.resultText = "0";
    render();
    return true;
  }

  function appendInput(input) {
    if (wakeIfNeeded()) return;
    const isOperator = /^[+\-×÷^]/.test(input.trim()) || input.trim() === "nPr" || input.trim() === "nCr";

    if (state.justEvaluated) {
      const previous = state.mode === "BASE" ? core.formatBase(state.lastResult, state.base) : "Ans";
      state.expression = isOperator ? `${previous}${input}` : input;
      state.cursor = state.expression.length;
      state.justEvaluated = false;
    } else {
      state.expression = state.expression.slice(0, state.cursor) + input + state.expression.slice(state.cursor);
      state.cursor += input.length;
    }

    state.resultText = state.resultText.endsWith("ERROR") ? "0" : state.resultText;
    state.fractionView = false;
    render();
  }

  function balancedExpression(expression) {
    let balance = 0;
    for (const character of expression) {
      if (character === "(") balance += 1;
      if (character === ")") balance -= 1;
      if (balance < 0) return expression;
    }
    return expression + ")".repeat(balance);
  }

  function evaluateRealFields(expression, expected, usage) {
    const fields = expression.split(",").map((field) => field.trim()).filter(Boolean);
    if (fields.length < expected[0] || fields.length > expected[1]) {
      throw new core.CalculatorError(usage, "Input ERROR");
    }
    const values = fields.map((field) => core.evaluate(balancedExpression(field), {
      angle: state.angle,
      ans: state.ans,
      memory: state.memory,
      variables: state.variables,
    }));
    if (values.some((value) => !Number.isFinite(value))) throw new core.CalculatorError("Values must be finite", "Input ERROR");
    return values;
  }

  function commitSimulatorResult(value, text) {
    state.lastResult = value;
    state.ans = value;
    state.ansComplex = new core.Complex(value, 0);
    state.expression = "";
    state.cursor = 0;
    state.resultText = text;
    state.justEvaluated = false;
    state.fractionView = false;
    render();
    return value;
  }

  function calculateSdSimulator(expression) {
    const [x, frequency = 1] = evaluateRealFields(expression, [1, 2], "Enter x or x,frequency");
    if (!(frequency > 0)) throw new core.CalculatorError("Frequency must be greater than zero", "Input ERROR");
    state.sdData.push({ x, freq: frequency });
    const summary = core.statistics(state.sdData);
    return commitSimulatorResult(summary.mean, `n=${formatNumber(summary.n)}  x̄=${formatNumber(summary.mean)}`);
  }

  function calculateRegressionSimulator(expression) {
    const [x, y, frequency = 1] = evaluateRealFields(expression, [2, 3], "Enter x,y or x,y,frequency");
    if (!(frequency > 0)) throw new core.CalculatorError("Frequency must be greater than zero", "Input ERROR");
    state.regData.push({ x, y, freq: frequency });
    if (state.regData.length < 2) return commitSimulatorResult(y, "n=1  NEXT x,y");
    const fit = core.regression(state.regData, state.regressionType);
    return commitSimulatorResult(fit.a, `n=${state.regData.length}  a=${formatNumber(fit.a)} b=${formatNumber(fit.b)}`);
  }

  function calculateProgramSimulator(expression) {
    const program = state.programs[state.programSlot];
    if (!program.source.trim()) throw new core.CalculatorError(`${program.name} is empty`, "Program ERROR");
    const inputs = expression.trim()
      ? evaluateRealFields(expression, [1, 20], "Enter prompt values separated by commas")
      : [];
    const run = core.runProgram(program.source, inputs, {
      angle: state.angle,
      ans: state.ans,
      memory: state.memory,
      variables: state.variables,
    });
    state.variables = { ...state.variables, ...run.variables };
    state.memory = run.variables.M;
    state.justEvaluated = true;
    state.lastResult = run.ans;
    state.ans = run.ans;
    state.ansComplex = new core.Complex(run.ans, 0);
    state.expression = `${program.name}(${inputs.map(formatNumber).join(",")})`;
    state.cursor = state.expression.length;
    state.resultText = formatNumber(run.ans);
    render();
    return run.ans;
  }

  function calculate(options = {}) {
    if (wakeIfNeeded()) return null;
    const expression = state.expression.trim() || (state.justEvaluated ? "Ans" : "0");
    try {
      if (state.interfaceMode === "web" && ["SD", "REG", "PRGM"].includes(state.mode)) {
        renderWorkbench("mode");
        showToast(`${state.mode} calculations are run from the workbench`);
        return null;
      }

      if (state.interfaceMode === "simulator" && state.mode === "SD") return calculateSdSimulator(state.expression.trim());
      if (state.interfaceMode === "simulator" && state.mode === "REG") return calculateRegressionSimulator(state.expression.trim());
      if (state.interfaceMode === "simulator" && state.mode === "PRGM") return calculateProgramSimulator(state.expression.trim());

      let value;
      if (state.mode === "CMPLX") {
        value = core.evaluateComplex(balancedExpression(expression), {
          angle: state.angle,
          ans: state.ansComplex,
          variables: state.variables,
        });
        state.lastComplex = value;
        state.ansComplex = value;
        state.lastResult = value.im === 0 ? value.re : value.magnitude();
        state.resultText = core.formatComplex(value, {
          form: state.complexForm,
          angle: state.angle,
          numberFormat: state.format,
          digits: state.format === "SCI" ? 6 : state.formatDigits,
        });
      } else if (state.mode === "BASE") {
        const baseExpression = expression === "Ans" ? core.formatBase(state.lastResult, state.base) : expression;
        value = core.evaluateBase(baseExpression, state.base);
        state.lastResult = value;
        state.ans = value;
        state.ansComplex = new core.Complex(value, 0);
        state.resultText = core.formatBase(value, state.base);
      } else {
        value = core.evaluate(balancedExpression(expression), {
          angle: state.angle,
          ans: state.ans,
          memory: state.memory,
          variables: state.variables,
        });
        state.lastResult = value;
        state.ans = value;
        state.ansComplex = new core.Complex(value, 0);
        state.resultText = core.formatResult(value, {
          format: state.format,
          digits: state.format === "SCI" ? 6 : state.formatDigits,
        });
      }
      state.fractionView = false;
      state.justEvaluated = true;

      if (!options.silent && expression && expression !== "Ans") {
        const last = state.history[state.history.length - 1];
        if (!last || last.expression !== expression || last.mode !== state.mode) {
          state.history.push({ expression, result: state.resultText, mode: state.mode, base: state.base });
          if (state.history.length > 50) state.history.shift();
        }
        state.historyIndex = state.history.length;
      }

      render();
      return value;
    } catch (error) {
      state.resultText = error.displayMessage || "Math ERROR";
      state.justEvaluated = false;
      render();
      return null;
    }
  }

  function deleteCharacter() {
    if (state.cursor === 0 || !state.expression) return;
    state.expression = state.expression.slice(0, state.cursor - 1) + state.expression.slice(state.cursor);
    state.cursor -= 1;
    state.justEvaluated = false;
    render();
  }

  function clearEntry() {
    state.expression = "";
    state.cursor = 0;
    state.resultText = "0";
    state.justEvaluated = false;
    state.fractionView = false;
    state.shift = false;
    state.alpha = false;
    state.hyp = false;
    render();
  }

  function allClear() {
    clearEntry();
    state.ans = 0;
    state.memory = 0;
    state.lastResult = 0;
    state.ansComplex = new core.Complex(0, 0);
    state.lastComplex = new core.Complex(0, 0);
    state.history = [];
    state.historyIndex = 0;
    if (state.interfaceMode === "simulator" && state.mode === "SD") state.sdData = [];
    if (state.interfaceMode === "simulator" && state.mode === "REG") state.regData = [];
    showToast("Memory, Ans and replay history cleared");
    render();
  }

  function moveCursor(direction) {
    state.cursor = Math.max(0, Math.min(state.expression.length, state.cursor + direction));
    state.justEvaluated = false;
    render();
  }

  function navigateHistory(direction) {
    if (!state.history.length) {
      showToast("No replay history yet");
      return;
    }
    state.historyIndex = Math.max(0, Math.min(state.history.length - 1, state.historyIndex + direction));
    const item = state.history[state.historyIndex];
    state.mode = item.mode || "COMP";
    if (item.base) state.base = item.base;
    state.expression = item.expression;
    state.cursor = state.expression.length;
    state.resultText = item.result;
    state.justEvaluated = true;
    renderWorkbench("mode");
    render();
  }

  function currentValue() {
    if (state.expression && !state.justEvaluated) return calculate({ silent: true });
    if (state.mode === "CMPLX") return state.lastComplex;
    return state.lastResult;
  }

  function currentRealValue(feature) {
    const value = currentValue();
    if (value instanceof core.Complex) {
      if (Math.abs(value.im) > 1e-12) {
        showToast(`${feature} requires a real result`);
        return null;
      }
      return value.re;
    }
    return value;
  }

  function useMemory(operation) {
    const value = currentRealValue("Memory");
    if (value === null) return;
    if (operation === "store") state.memory = value;
    if (operation === "add") state.memory += value;
    if (operation === "subtract") state.memory -= value;
    state.resultText = core.formatResult(value, { format: state.format, digits: state.formatDigits });
    showToast(`Memory M = ${core.formatResult(state.memory)}`);
    render();
  }

  function toggleFraction() {
    const value = currentRealValue("Fraction conversion");
    if (value === null) return;
    try {
      state.fractionView = !state.fractionView;
      state.resultText = state.fractionView
        ? core.toFraction(value)
        : core.formatResult(value, { format: state.format, digits: state.formatDigits });
    } catch (error) {
      showToast(error.message);
    }
    render();
  }

  function showDms() {
    const value = currentRealValue("DMS conversion");
    if (value === null) return;
    state.resultText = core.toDms(value);
    render();
  }

  function cycleAngle() {
    const units = ["DEG", "RAD", "GRAD"];
    state.angle = units[(units.indexOf(state.angle) + 1) % units.length];
    syncSettingControls();
    if (state.mode === "CMPLX" && state.justEvaluated) refreshLastResult();
    if (!elements.workbench.hidden) renderWorkbench(state.workbenchView);
    showToast(`Angle unit: ${state.angle}`);
    render();
  }

  function reciprocal() {
    if (state.justEvaluated || !state.expression) appendInput("Ans^(-1)");
    else appendInput("^(-1)");
  }

  function engineeringNotation() {
    const value = currentRealValue("Engineering notation");
    if (value === null || value === 0) return;
    const exponent = Math.floor(Math.log10(Math.abs(value)) / 3) * 3;
    const coefficient = value / 10 ** exponent;
    state.resultText = `${core.formatResult(coefficient)}×10^${exponent}`;
    render();
  }

  function formatNumber(value) {
    return Number.isFinite(value) ? core.formatResult(value, { format: state.format, digits: 6 }) : "—";
  }

  function refreshLastResult() {
    if (state.mode === "CMPLX") {
      state.resultText = core.formatComplex(state.lastComplex, {
        form: state.complexForm,
        angle: state.angle,
        numberFormat: state.format,
        digits: state.format === "SCI" ? 6 : state.formatDigits,
      });
    } else if (state.mode === "BASE") {
      state.resultText = core.formatBase(state.lastResult, state.base);
    } else {
      state.resultText = core.formatResult(state.lastResult, { format: state.format, digits: state.formatDigits });
    }
  }

  function setMode(mode) {
    if (!["COMP", "CMPLX", "BASE", "SD", "REG", "PRGM"].includes(mode)) return;
    if (state.interfaceMode === "simulator" && state.mode === "REG" && mode === "REG") {
      const types = ["LIN", "LOG", "EXP", "ABEXP", "PWR", "INV", "QUAD"];
      state.regressionType = types[(types.indexOf(state.regressionType) + 1) % types.length];
      state.expression = "";
      state.cursor = 0;
      state.justEvaluated = false;
      state.resultText = `REG · ${state.regressionType} · ENTER x,y`;
      if (elements.modeDialog.open) elements.modeDialog.close();
      render();
      showToast(`Regression model: ${state.regressionType}`);
      return;
    }
    state.mode = mode;
    state.expression = "";
    state.cursor = 0;
    state.resultText = "0";
    state.justEvaluated = false;
    state.workbenchView = "mode";
    if (elements.modeDialog.open) elements.modeDialog.close();
    if (state.interfaceMode === "web") renderWorkbench("mode");
    else {
      elements.workbench.hidden = true;
      elements.workbench.innerHTML = "";
      if (mode === "SD") state.resultText = "ENTER x[,freq]";
      if (mode === "REG") state.resultText = `ENTER x,y · ${state.regressionType}`;
      if (mode === "PRGM") state.resultText = `${state.programs[state.programSlot].name} · ENTER INPUTS`;
    }
    render();
    showToast(`${mode} mode ready`);
  }

  function workbenchShell(title, subtitle, body) {
    return `
      <div class="workbench__header">
        <div><p class="eyebrow">${escapeHtml(state.workbenchView === "mode" ? state.mode : "TOOLS")}</p><h2>${escapeHtml(title)}</h2><p>${escapeHtml(subtitle)}</p></div>
        <button type="button" class="workbench__close" data-workbench-close aria-label="Close workbench">×</button>
      </div>
      ${body}`;
  }

  function renderWorkbench(view = state.workbenchView) {
    state.workbenchView = view;
    if (state.interfaceMode === "simulator" && view === "mode") {
      elements.workbench.hidden = true;
      elements.workbench.innerHTML = "";
      return;
    }
    if (view === "mode" && state.mode === "COMP") {
      elements.workbench.hidden = true;
      elements.workbench.innerHTML = "";
      return;
    }

    elements.workbench.hidden = false;
    if (view === "formulas") renderFormulaCatalogue();
    else if (view === "constants") renderConstantCatalogue();
    else if (view === "coordinate-polar" || view === "coordinate-rectangular") renderCoordinateTool(view);
    else if (state.mode === "CMPLX") renderComplexWorkbench();
    else if (state.mode === "BASE") renderBaseWorkbench();
    else if (state.mode === "SD") renderSdWorkbench();
    else if (state.mode === "REG") renderRegressionWorkbench();
    else if (state.mode === "PRGM") renderProgramWorkbench();
    else elements.workbench.hidden = true;
  }

  function renderComplexWorkbench() {
    const body = `
      <div class="workbench__toolbar" aria-label="Complex shortcuts">
        <button type="button" data-insert="i">i</button>
        <button type="button" data-insert="∠">Polar ∠</button>
        <button type="button" data-insert="Conjg(">Conjugate</button>
        <button type="button" data-insert="arg(">Argument</button>
        <button type="button" data-complex-form="RECT" class="${state.complexForm === "RECT" ? "is-selected" : ""}">a + bi</button>
        <button type="button" data-complex-form="POLAR" class="${state.complexForm === "POLAR" ? "is-selected" : ""}">r∠θ</button>
      </div>
      <p class="workbench__tip">Examples: <button type="button" class="text-action" data-example="(2+3i)*(4-i)">(2+3i)×(4−i)</button> or <button type="button" class="text-action" data-example="2∠30">2∠30</button>. Angles follow the current ${escapeHtml(state.angle)} setting.</p>`;
    elements.workbench.innerHTML = workbenchShell("Complex numbers", "Calculate in rectangular or polar form.", body);
  }

  function renderBaseWorkbench() {
    const body = `
      <div class="workbench__group"><span>Input and output base</span><div class="workbench__toolbar">
        ${[[2, "BIN"], [8, "OCT"], [10, "DEC"], [16, "HEX"]].map(([base, label]) => `<button type="button" data-base="${base}" class="${state.base === base ? "is-selected" : ""}">${label}</button>`).join("")}
      </div></div>
      <div class="workbench__group"><span>Digits and 32-bit logical operators</span><div class="workbench__toolbar">
        ${["A", "B", "C", "D", "E", "F", " AND ", " OR ", " XOR ", "NOT ", "NEG "].map((token) => `<button type="button" data-insert="${token}">${token.trim()}</button>`).join("")}
      </div></div>
      <p class="workbench__tip">BASE arithmetic uses signed 32-bit integers. Negative BIN/OCT/HEX results are displayed in two's-complement form.</p>`;
    elements.workbench.innerHTML = workbenchShell("Base-n & logic", "Convert and calculate in binary, octal, decimal, or hexadecimal.", body);
  }

  function renderSdWorkbench() {
    let summary = "<p class=\"empty-state\">Add a sample to see statistical variables.</p>";
    if (state.sdData.length) {
      try {
        const stats = core.statistics(state.sdData);
        const values = [
          ["n", stats.n], ["Σx", stats.sum], ["Σx²", stats.sumSquares], ["x̄", stats.mean],
          ["σx", stats.populationSd], ["sx", stats.sampleSd], ["min", stats.min], ["max", stats.max],
        ];
        summary = `<div class="result-grid">${values.map(([label, value]) => `<div><span>${label}</span><strong>${formatNumber(value)}</strong></div>`).join("")}</div>`;
      } catch (error) {
        summary = `<p class="empty-state">${escapeHtml(error.message)}</p>`;
      }
    }

    const rows = state.sdData.map((sample, index) => `<tr><td>${index + 1}</td><td>${formatNumber(sample.x)}</td><td>${formatNumber(sample.freq)}</td><td><button type="button" class="row-delete" data-sd-delete="${index}" aria-label="Delete sample ${index + 1}">×</button></td></tr>`).join("");
    const body = `
      <form class="entry-form" data-sd-form>
        <label>x<input name="x" type="number" step="any" required inputmode="decimal"></label>
        <label>Frequency<input name="freq" type="number" step="any" min="0.000000001" value="1" required inputmode="decimal"></label>
        <button type="submit">Add sample</button>
      </form>
      <div class="data-table-wrap"><table class="data-table"><thead><tr><th>#</th><th>x</th><th>Freq</th><th></th></tr></thead><tbody>${rows || "<tr><td colspan=\"4\">No samples yet</td></tr>"}</tbody></table></div>
      <div class="workbench__section-heading"><h3>Summary</h3><button type="button" class="text-action" data-clear="sd">Clear data</button></div>${summary}`;
    elements.workbench.innerHTML = workbenchShell("Single-variable statistics", `${state.sdData.length} entered value${state.sdData.length === 1 ? "" : "s"}, with optional frequency.`, body);
  }

  function renderRegressionWorkbench() {
    const typeNames = { LIN: "Linear · a+bx", LOG: "Logarithmic · a+b ln(x)", EXP: "Exponential · ae^(bx)", ABEXP: "a·b^x", PWR: "Power · ax^b", INV: "Inverse · a+b/x", QUAD: "Quadratic · a+bx+cx²" };
    let results = "<p class=\"empty-state\">Add at least two paired samples to fit a model.</p>";
    if (state.regData.length >= 2) {
      try {
        const fit = core.regression(state.regData, state.regressionType);
        const values = [["a", fit.a], ["b", fit.b], ...(fit.c === undefined ? [] : [["c", fit.c]]), ["r", fit.r]];
        results = `<div class="result-grid">${values.map(([label, value]) => `<div><span>${label}</span><strong>${formatNumber(value)}</strong></div>`).join("")}</div>
          <form class="predict-form" data-predict-form><label>Predict y at x<input name="x" type="number" step="any" required></label><button type="submit">Predict</button><output data-predict-output></output></form>`;
      } catch (error) {
        results = `<p class="empty-state">${escapeHtml(error.message)}</p>`;
      }
    }
    const rows = state.regData.map((sample, index) => `<tr><td>${index + 1}</td><td>${formatNumber(sample.x)}</td><td>${formatNumber(sample.y)}</td><td>${formatNumber(sample.freq)}</td><td><button type="button" class="row-delete" data-reg-delete="${index}" aria-label="Delete pair ${index + 1}">×</button></td></tr>`).join("");
    const body = `
      <label class="select-label">Regression model<select data-regression-type>${Object.entries(typeNames).map(([value, label]) => `<option value="${value}" ${state.regressionType === value ? "selected" : ""}>${label}</option>`).join("")}</select></label>
      <form class="entry-form entry-form--reg" data-reg-form>
        <label>x<input name="x" type="number" step="any" required inputmode="decimal"></label>
        <label>y<input name="y" type="number" step="any" required inputmode="decimal"></label>
        <label>Freq<input name="freq" type="number" step="any" min="0.000000001" value="1" required></label>
        <button type="submit">Add pair</button>
      </form>
      <div class="data-table-wrap"><table class="data-table"><thead><tr><th>#</th><th>x</th><th>y</th><th>Freq</th><th></th></tr></thead><tbody>${rows || "<tr><td colspan=\"5\">No pairs yet</td></tr>"}</tbody></table></div>
      <div class="workbench__section-heading"><h3>Coefficients</h3><button type="button" class="text-action" data-clear="reg">Clear data</button></div>${results}`;
    elements.workbench.innerHTML = workbenchShell("Regression", `${state.regData.length} paired sample${state.regData.length === 1 ? "" : "s"}.`, body);
  }

  function programBytes() {
    return state.programs.reduce((total, program) => total + new TextEncoder().encode(program.source).length, 0);
  }

  function renderProgramWorkbench() {
    const program = state.programs[state.programSlot];
    const bytes = programBytes();
    const body = `
      <div class="slot-tabs" role="tablist">${state.programs.map((item, index) => `<button type="button" data-program-slot="${index}" class="${state.programSlot === index ? "is-selected" : ""}" role="tab">${item.name}</button>`).join("")}</div>
      <label class="program-editor">Program source<textarea data-program-source rows="5" spellcheck="false" placeholder="?→A : A×2.54">${escapeHtml(program.source)}</textarea></label>
      <div class="workbench__toolbar workbench__toolbar--commands">
        <button type="button" data-program-insert="?→A">?→A</button><button type="button" data-program-insert=" : ">:</button><button type="button" data-program-insert="→A">→A</button><button type="button" data-program-insert="Ans">Ans</button>
      </div>
      <div class="program-meta"><span>${new TextEncoder().encode(program.source).length} bytes in ${program.name}</span><span class="${bytes > 680 ? "is-over" : ""}">${bytes} / 680 total bytes</span></div>
      <form class="program-runner" data-program-run><label>Prompt inputs (comma-separated)<input name="inputs" placeholder="e.g. 2, 4"></label><button type="submit" ${bytes > 680 ? "disabled" : ""}>Run ${program.name}</button></form>
      <output class="workbench__output" data-program-output>${escapeHtml(state.workbenchMessage)}</output>
      <p class="workbench__tip">Supported commands: <code>?→A</code> input, <code>expression→A</code> assignment, and <code>:</code> or a new line between statements. Execution is capped at 100 statements.</p>`;
    elements.workbench.innerHTML = workbenchShell("Program areas", "Edit, save automatically, and run four local calculation programs.", body);
  }

  function renderFormulaCatalogue() {
    const formula = catalogue.formulas[state.selectedFormula];
    const fields = formula.variables.map(([name, label]) => `<label>${escapeHtml(label)}<input name="${escapeHtml(name)}" type="number" step="any" required inputmode="decimal"></label>`).join("");
    const list = catalogue.formulas.map((item, index) => `<button type="button" class="catalogue-item ${index === state.selectedFormula ? "is-selected" : ""}" data-formula-index="${index}" data-search="${escapeHtml(`${item.name} ${item.display}`.toLowerCase())}"><span>${String(index + 1).padStart(2, "0")}</span><strong>${escapeHtml(item.name)}</strong><small>${escapeHtml(item.display)}</small></button>`).join("");
    const body = `<div class="catalogue-layout"><div><input class="catalogue-search" data-catalogue-search placeholder="Search 23 formulas" aria-label="Search formulas"><div class="catalogue-list">${list}</div></div>
      <div class="catalogue-detail"><span class="catalogue-detail__number">F-${String(state.selectedFormula + 1).padStart(2, "0")}</span><h3>${escapeHtml(formula.name)}</h3><p class="formula-display">${escapeHtml(formula.display)}</p><form class="formula-form" data-formula-form>${fields}<button type="submit">Calculate</button></form><output class="workbench__output" data-formula-output>${escapeHtml(state.workbenchMessage)}</output></div></div>`;
    elements.workbench.innerHTML = workbenchShell("Built-in formulas", `23 study formulas · catalogue ${catalogue.version}`, body);
  }

  function renderConstantCatalogue() {
    const list = catalogue.constants.map((item, index) => `<button type="button" class="constant-item" data-constant-index="${index}" data-search="${escapeHtml(`${item.symbol} ${item.name} ${item.unit}`.toLowerCase())}"><span>${escapeHtml(item.symbol)}</span><strong>${escapeHtml(item.name)}</strong><small>${escapeHtml(core.formatResult(item.value))} ${escapeHtml(item.unit)}</small></button>`).join("");
    const body = `<input class="catalogue-search" data-catalogue-search placeholder="Search 40 constants" aria-label="Search constants"><div class="constant-grid">${list}</div><p class="workbench__tip">Click a constant to insert its numeric value. Modern SI/CODATA-style study values, catalogue ${escapeHtml(catalogue.version)}.</p>`;
    elements.workbench.innerHTML = workbenchShell("Scientific constants", "40 named values with symbols and SI units.", body);
  }

  function renderCoordinateTool(view) {
    const polar = view === "coordinate-polar";
    const body = `<form class="coordinate-form" data-coordinate-form data-conversion="${polar ? "polar" : "rectangular"}">
      ${polar ? '<label>x<input name="first" type="number" step="any" required></label><label>y<input name="second" type="number" step="any" required></label>' : '<label>Radius r<input name="first" type="number" step="any" required></label><label>Angle θ<input name="second" type="number" step="any" required></label>'}
      <button type="submit">Convert</button></form><output class="workbench__output" data-coordinate-output></output>`;
    elements.workbench.innerHTML = workbenchShell(polar ? "Rectangular → polar" : "Polar → rectangular", polar ? `Return r and θ in ${state.angle}.` : `Read θ in ${state.angle}.`, body);
  }

  function executeNamedAction(action, key = {}) {
    switch (action) {
      case "execute": calculate(); break;
      case "delete": deleteCharacter(); break;
      case "clear": clearEntry(); break;
      case "all-clear": allClear(); break;
      case "off":
        state.powered = false;
        state.shift = false;
        state.alpha = false;
        render();
        break;
      case "reciprocal": reciprocal(); break;
      case "fraction": toggleFraction(); break;
      case "dms": showDms(); break;
      case "hyp":
        state.hyp = !state.hyp;
        showToast(state.hyp ? "Hyperbolic function ready" : "Hyperbolic function cancelled");
        break;
      case "sin": appendInput(`${state.hyp ? "sinh" : "sin"}(`); state.hyp = false; break;
      case "cos": appendInput(`${state.hyp ? "cosh" : "cos"}(`); state.hyp = false; break;
      case "tan": appendInput(`${state.hyp ? "tanh" : "tan"}(`); state.hyp = false; break;
      case "asin": appendInput(`${state.hyp ? "asinh" : "asin"}(`); state.hyp = false; break;
      case "acos": appendInput(`${state.hyp ? "acosh" : "acos"}(`); state.hyp = false; break;
      case "atan": appendInput(`${state.hyp ? "atanh" : "atan"}(`); state.hyp = false; break;
      case "memory-add": useMemory("add"); break;
      case "memory-subtract": useMemory("subtract"); break;
      case "memory-store": useMemory("store"); break;
      case "memory-recall": appendInput("M"); break;
      case "engineering": engineeringNotation(); break;
      case "exponent": appendInput("×10^("); break;
      case "round":
        state.lastResult = Math.round(currentRealValue("Rounding") ?? 0);
        state.ans = state.lastResult;
        state.resultText = core.formatResult(state.lastResult);
        render();
        break;
      case "cycle-angle": cycleAngle(); break;
      case "variable":
        if (state.mode === "BASE" && !"ABCDEF".includes(key.variable)) showToast(`${key.variable} is not a BASE digit`);
        else appendInput(key.variable);
        break;
      case "insert-info": showToast("Use the arrow keys to position the cursor, then type to insert"); break;
      case "set-mode":
        if (state.interfaceMode === "simulator" && state.mode === "PRGM" && key.targetMode === "PRGM") {
          state.programSlot = (state.programSlot + 1) % state.programs.length;
          clearEntry();
          state.resultText = `${state.programs[state.programSlot].name} · ENTER INPUTS`;
          render();
          showToast(`Program area ${state.programs[state.programSlot].name}`);
        } else setMode(key.targetMode);
        break;
      case "show-workbench":
        if (state.interfaceMode === "simulator" && state.mode === "BASE") {
          const operators = ["AND", "OR", "XOR"];
          const trailing = state.expression.match(/\s(AND|OR|XOR)\s*$/);
          if (trailing) {
            const next = operators[(operators.indexOf(trailing[1]) + 1) % operators.length];
            state.expression = state.expression.replace(/\s(AND|OR|XOR)\s*$/, ` ${next} `);
            state.cursor = state.expression.length;
            render();
            showToast(`Logic operator: ${next}`);
          } else {
            appendInput(" AND ");
            showToast("Logic operator: AND · press LOGIC again for OR or XOR");
          }
        } else if (state.interfaceMode === "web") renderWorkbench("mode");
        else showToast("Switch to Web mode for the specialist workbench");
        break;
      case "base-select":
        if (state.mode !== "BASE") showToast("Base selection is available in BASE mode");
        else if (state.interfaceMode === "simulator") {
          const bases = [10, 2, 8, 16];
          state.base = bases[(bases.indexOf(state.base) + 1) % bases.length];
          state.expression = "";
          state.cursor = 0;
          state.resultText = `BASE ${({ 2: "BIN", 8: "OCT", 10: "DEC", 16: "HEX" })[state.base]}`;
          showToast(`Input base: ${({ 2: "BIN", 8: "OCT", 10: "DEC", 16: "HEX" })[state.base]}`);
        }
        else {
          state.base = key.targetBase;
          state.expression = "";
          state.cursor = 0;
          state.resultText = core.formatBase(state.lastResult, state.base);
          renderWorkbench("mode");
        }
        break;
      case "catalogue":
        state.workbenchMessage = "";
        renderWorkbench(key.catalogue);
        break;
      case "statistics-summary":
      case "statistics-variables":
        if (!['SD', 'REG'].includes(state.mode)) showToast("Statistical results are available in SD or REG mode");
        else if (state.interfaceMode === "web") renderWorkbench("mode");
        else if (state.mode === "SD") {
          if (!state.sdData.length) showToast("No statistical data yet");
          else {
            const summary = core.statistics(state.sdData);
            const values = [
              ["n", summary.n], ["Σx", summary.sum], ["Σx²", summary.sumSquares], ["x̄", summary.mean],
              ["σx", summary.populationStandardDeviation], ["sx", summary.sampleStandardDeviation], ["min", summary.min], ["max", summary.max],
            ];
            const [label, value] = values[state.statisticsResultIndex % values.length];
            state.statisticsResultIndex += 1;
            state.lastResult = value;
            state.ans = value;
            state.resultText = `${label}=${formatNumber(value)}`;
          }
        } else {
          if (state.regData.length < 2) showToast("Enter at least two paired samples");
          else {
            const fit = core.regression(state.regData, state.regressionType);
            const values = [["a", fit.a], ["b", fit.b], ["c", fit.c], ["r", fit.r]].filter(([, value]) => Number.isFinite(value));
            const [label, value] = values[state.regressionResultIndex % values.length];
            state.regressionResultIndex += 1;
            state.lastResult = value;
            state.ans = value;
            state.resultText = `${label}=${formatNumber(value)}`;
          }
        }
        break;
      case "program-command":
        if (state.mode !== "PRGM") setMode("PRGM");
        else renderWorkbench("mode");
        window.setTimeout(() => elements.workbench.querySelector("[data-program-source]")?.focus(), 0);
        break;
      case "coordinate-polar":
        if (state.mode === "CMPLX") {
          state.complexForm = "POLAR";
          state.resultText = core.formatComplex(state.lastComplex, { form: "POLAR", angle: state.angle });
          renderWorkbench("mode");
        } else renderWorkbench("coordinate-polar");
        break;
      case "coordinate-rectangular":
        if (state.mode === "CMPLX") {
          state.complexForm = "RECT";
          state.resultText = core.formatComplex(state.lastComplex, { form: "RECT", angle: state.angle });
          renderWorkbench("mode");
        } else renderWorkbench("coordinate-rectangular");
        break;
      case "complex-toggle":
        if (state.mode !== "CMPLX") showToast("Re↔Im is available in CMPLX mode");
        else {
          state.complexPart = state.complexPart === "RE" ? "IM" : "RE";
          const part = state.complexPart === "RE" ? state.lastComplex.re : state.lastComplex.im;
          state.resultText = `${state.complexPart}=${formatNumber(part)}`;
        }
        break;
      default: break;
    }
  }

  function pressCalculatorKey(key) {
    if (wakeIfNeeded()) return;

    let action = key.action;
    let input = key.input;
    if (state.interfaceMode === "simulator" && state.mode === "BASE" && !state.shift && !state.alpha) {
      if (key.label === "(−)") {
        action = undefined;
        input = "NEG ";
      } else if (key.action === "reciprocal") {
        action = undefined;
        input = "NOT ";
      }
    }
    if (state.alpha && (key.alphaAction || key.alphaInput)) {
      action = key.alphaAction;
      input = key.alphaInput;
    } else if (state.shift && (key.shiftAction || key.shiftInput)) {
      action = key.shiftAction;
      input = key.shiftInput;
    }

    if (input !== undefined) appendInput(input);
    else if (action) executeNamedAction(action, key);

    state.shift = false;
    state.alpha = false;
    render();
  }

  function syncSettingControls() {
    elements.angleControl.querySelectorAll("button").forEach((button) => {
      button.classList.toggle("is-selected", button.dataset.angle === state.angle);
    });
    elements.formatControl.querySelectorAll("button").forEach((button) => {
      button.classList.toggle("is-selected", button.dataset.format === state.format);
    });
  }

  elements.keypad.addEventListener("click", (event) => {
    const button = event.target.closest("[data-key-index]");
    if (!button) return;
    pressCalculatorKey(keyDefinitions[Number(button.dataset.keyIndex)]);
  });

  elements.modeDialog.addEventListener("click", (event) => {
    const button = event.target.closest("[data-mode]");
    if (button) setMode(button.dataset.mode);
  });

  function setInterfaceMode(mode) {
    state.interfaceMode = mode === "simulator" ? "simulator" : "web";
    if (state.interfaceMode === "web") renderWorkbench("mode");
    else {
      elements.workbench.hidden = true;
      elements.workbench.innerHTML = "";
      if (state.mode === "SD") state.resultText = "ENTER x[,freq]";
      if (state.mode === "REG") state.resultText = `ENTER x,y · ${state.regressionType}`;
      if (state.mode === "PRGM") state.resultText = `${state.programs[state.programSlot].name} · ENTER INPUTS`;
    }
    render();
    window.SciCalUI?.updateScale?.();
    showToast(state.interfaceMode === "web" ? "Web mode: specialist workbench enabled" : "Simulator mode: use the display and calculator keys");
  }

  elements.interfaceToggle?.addEventListener("click", () => {
    setInterfaceMode(state.interfaceMode === "web" ? "simulator" : "web");
  });

  elements.workbench.addEventListener("click", (event) => {
    const target = event.target.closest("button");
    if (!target) return;

    if (target.hasAttribute("data-workbench-close")) {
      elements.workbench.hidden = true;
      return;
    }
    if (target.dataset.insert !== undefined) appendInput(target.dataset.insert);
    else if (target.dataset.example !== undefined) {
      state.expression = target.dataset.example;
      state.cursor = state.expression.length;
      state.justEvaluated = false;
      render();
    } else if (target.dataset.base) {
      state.base = Number(target.dataset.base);
      state.expression = "";
      state.cursor = 0;
      state.resultText = core.formatBase(state.lastResult, state.base);
      renderWorkbench("mode");
      render();
    } else if (target.dataset.complexForm) {
      state.complexForm = target.dataset.complexForm;
      state.resultText = core.formatComplex(state.lastComplex, { form: state.complexForm, angle: state.angle });
      renderWorkbench("mode");
      render();
    } else if (target.dataset.sdDelete !== undefined) {
      state.sdData.splice(Number(target.dataset.sdDelete), 1);
      renderWorkbench("mode");
    } else if (target.dataset.regDelete !== undefined) {
      state.regData.splice(Number(target.dataset.regDelete), 1);
      renderWorkbench("mode");
    } else if (target.dataset.clear === "sd") {
      state.sdData = [];
      renderWorkbench("mode");
    } else if (target.dataset.clear === "reg") {
      state.regData = [];
      renderWorkbench("mode");
    } else if (target.dataset.programSlot !== undefined) {
      state.programSlot = Number(target.dataset.programSlot);
      state.workbenchMessage = "";
      renderWorkbench("mode");
    } else if (target.dataset.programInsert !== undefined) {
      state.programs[state.programSlot].source += target.dataset.programInsert;
      savePrograms();
      renderWorkbench("mode");
      const editor = elements.workbench.querySelector("[data-program-source]");
      editor?.focus();
      editor?.setSelectionRange(editor.value.length, editor.value.length);
    } else if (target.dataset.formulaIndex !== undefined) {
      state.selectedFormula = Number(target.dataset.formulaIndex);
      state.workbenchMessage = "";
      renderWorkbench("formulas");
    } else if (target.dataset.constantIndex !== undefined) {
      if (state.mode === "BASE") showToast("Scientific constants are decimal values; switch to COMP or CMPLX mode first");
      else {
        const item = catalogue.constants[Number(target.dataset.constantIndex)];
        appendInput(String(item.value));
        showToast(`${item.symbol} · ${item.name} inserted`);
      }
    }
  });

  elements.workbench.addEventListener("input", (event) => {
    if (event.target.matches("[data-catalogue-search]")) {
      const query = event.target.value.trim().toLowerCase();
      elements.workbench.querySelectorAll("[data-search]").forEach((item) => {
        item.hidden = query && !item.dataset.search.includes(query);
      });
    } else if (event.target.matches("[data-program-source]")) {
      state.programs[state.programSlot].source = event.target.value;
      savePrograms();
      const bytes = programBytes();
      const meta = elements.workbench.querySelector(".program-meta");
      if (meta) {
        meta.children[0].textContent = `${new TextEncoder().encode(event.target.value).length} bytes in ${state.programs[state.programSlot].name}`;
        meta.children[1].textContent = `${bytes} / 680 total bytes`;
        meta.children[1].classList.toggle("is-over", bytes > 680);
      }
      const runButton = elements.workbench.querySelector("[data-program-run] button[type=submit]");
      if (runButton) runButton.disabled = bytes > 680;
    }
  });

  elements.workbench.addEventListener("change", (event) => {
    if (event.target.matches("[data-regression-type]")) {
      state.regressionType = event.target.value;
      renderWorkbench("mode");
    }
  });

  elements.workbench.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.target;
    if (form.matches("[data-sd-form]")) {
      const values = new FormData(form);
      state.sdData.push({ x: Number(values.get("x")), freq: Number(values.get("freq")) });
      renderWorkbench("mode");
      elements.workbench.querySelector('[data-sd-form] input[name="x"]')?.focus();
    } else if (form.matches("[data-reg-form]")) {
      const values = new FormData(form);
      state.regData.push({ x: Number(values.get("x")), y: Number(values.get("y")), freq: Number(values.get("freq")) });
      renderWorkbench("mode");
      elements.workbench.querySelector('[data-reg-form] input[name="x"]')?.focus();
    } else if (form.matches("[data-predict-form]")) {
      const x = Number(new FormData(form).get("x"));
      try {
        const value = core.regression(state.regData, state.regressionType).predict(x);
        form.querySelector("[data-predict-output]").textContent = `y = ${formatNumber(value)}`;
        state.lastResult = value;
        state.ans = value;
        state.ansComplex = new core.Complex(value, 0);
        state.resultText = formatNumber(value);
        render();
      } catch (error) {
        form.querySelector("[data-predict-output]").textContent = error.displayMessage || error.message;
      }
    } else if (form.matches("[data-program-run]")) {
      const rawInputs = String(new FormData(form).get("inputs") || "").trim();
      const inputs = rawInputs ? rawInputs.split(",").map((value) => Number(value.trim())) : [];
      const output = elements.workbench.querySelector("[data-program-output]");
      try {
        if (inputs.some((value) => !Number.isFinite(value))) throw new core.CalculatorError("Inputs must be comma-separated numbers", "Input ERROR");
        const run = core.runProgram(state.programs[state.programSlot].source, inputs, {
          angle: state.angle,
          ans: state.ans,
          memory: state.memory,
          variables: state.variables,
        });
        state.variables = { ...state.variables, ...run.variables };
        state.memory = run.variables.M;
        state.ans = run.ans;
        state.ansComplex = new core.Complex(run.ans, 0);
        state.lastResult = run.ans;
        state.resultText = formatNumber(run.ans);
        state.workbenchMessage = `Ans = ${formatNumber(run.ans)}${run.outputs.length ? ` · outputs: ${run.outputs.map(formatNumber).join(", ")}` : ""}`;
        output.textContent = state.workbenchMessage;
        render();
      } catch (error) {
        state.workbenchMessage = error.displayMessage || error.message;
        output.textContent = state.workbenchMessage;
      }
    } else if (form.matches("[data-formula-form]")) {
      const formula = catalogue.formulas[state.selectedFormula];
      const values = new FormData(form);
      const variables = Object.fromEntries(formula.variables.map(([name]) => [name, Number(values.get(name))]));
      const output = elements.workbench.querySelector("[data-formula-output]");
      try {
        const value = core.evaluate(formula.expression, { angle: state.angle, variables });
        state.ans = value;
        state.ansComplex = new core.Complex(value, 0);
        state.lastResult = value;
        state.expression = "";
        state.cursor = 0;
        state.resultText = formatNumber(value);
        state.justEvaluated = true;
        state.workbenchMessage = `${formatNumber(value)}${formula.unit ? ` ${formula.unit}` : ""}`;
        output.textContent = state.workbenchMessage;
        render();
      } catch (error) {
        state.workbenchMessage = error.displayMessage || error.message;
        output.textContent = state.workbenchMessage;
      }
    } else if (form.matches("[data-coordinate-form]")) {
      const values = new FormData(form);
      const first = Number(values.get("first"));
      const second = Number(values.get("second"));
      const polar = form.dataset.conversion === "polar";
      const radiansPerUnit = state.angle === "RAD" ? 1 : state.angle === "GRAD" ? Math.PI / 200 : Math.PI / 180;
      let result;
      if (polar) {
        const radians = Math.atan2(second, first);
        result = `r = ${formatNumber(Math.hypot(first, second))}, θ = ${formatNumber(radians / radiansPerUnit)} ${state.angle}`;
      } else {
        const radians = second * radiansPerUnit;
        result = `x = ${formatNumber(first * Math.cos(radians))}, y = ${formatNumber(first * Math.sin(radians))}`;
      }
      elements.workbench.querySelector("[data-coordinate-output]").textContent = result;
      state.resultText = result;
      render();
    }
  });

  document.querySelector(".utility-row").addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;
    const action = button.dataset.action;
    if (action === "shift") {
      if (wakeIfNeeded()) return;
      state.shift = !state.shift;
      state.alpha = false;
    } else if (action === "alpha") {
      if (wakeIfNeeded()) return;
      state.alpha = !state.alpha;
      state.shift = false;
    } else if (action === "mode") {
      if (state.shift) {
        state.shift = false;
        syncSettingControls();
        elements.settingsDialog.showModal();
      } else {
        elements.modeDialog.showModal();
      }
    } else if (action === "on") {
      if (!wakeIfNeeded()) clearEntry();
    } else if (action === "left") moveCursor(-1);
    else if (action === "right") moveCursor(1);
    else if (action === "history-up") navigateHistory(-1);
    else if (action === "history-down") navigateHistory(1);
    render();
  });

  elements.angleControl.addEventListener("click", (event) => {
    const button = event.target.closest("[data-angle]");
    if (!button) return;
    state.angle = button.dataset.angle;
    syncSettingControls();
    if (state.mode === "CMPLX" && state.justEvaluated) refreshLastResult();
    if (!elements.workbench.hidden) renderWorkbench(state.workbenchView);
    render();
  });

  elements.formatControl.addEventListener("click", (event) => {
    const button = event.target.closest("[data-format]");
    if (!button) return;
    state.format = button.dataset.format;
    state.formatDigits = state.format === "FIX" ? 4 : 6;
    syncSettingControls();
    if (state.justEvaluated) refreshLastResult();
    render();
  });

  document.addEventListener("keydown", (event) => {
    if (document.querySelector("dialog[open]")) return;
    if (event.target.matches("input, textarea, select")) return;
    const keyMap = {
      "*": "×",
      "/": "÷",
      "-": "-",
      "+": "+",
      "^": "^(",
      "(": "(",
      ")": ")",
      ".": ".",
      ",": ",",
    };

    if (/^\d$/.test(event.key)) appendInput(event.key);
    else if (state.mode === "BASE" && /^[a-f]$/i.test(event.key)) appendInput(event.key.toUpperCase());
    else if (state.mode === "CMPLX" && event.key.toLowerCase() === "i") appendInput("i");
    else if (event.key in keyMap) appendInput(keyMap[event.key]);
    else if (event.key === "Enter" || event.key === "=") calculate();
    else if (event.key === "Backspace" || event.key === "Delete") deleteCharacter();
    else if (event.key === "Escape") clearEntry();
    else if (event.key === "ArrowLeft") moveCursor(-1);
    else if (event.key === "ArrowRight") moveCursor(1);
    else if (event.key === "ArrowUp") navigateHistory(-1);
    else if (event.key === "ArrowDown") navigateHistory(1);
    else return;

    event.preventDefault();
  });

  function installImmediatePressFeedback() {
    const selector = "button:not(:disabled)";
    const clearPressed = (button) => {
      if (!button) return;
      button.classList.remove("is-pressed");
      delete button.dataset.activePointer;
    };

    if ("PointerEvent" in window) {
      document.addEventListener("pointerdown", (event) => {
        const button = event.target.closest(selector);
        if (!button || (event.pointerType === "mouse" && event.button !== 0)) return;
        button.dataset.activePointer = String(event.pointerId);
        button.classList.add("is-pressed");
        try { button.setPointerCapture(event.pointerId); } catch (_error) { /* Capture is optional on older WebViews. */ }
      }, { passive: true });
      ["pointerup", "pointercancel", "lostpointercapture"].forEach((type) => {
        document.addEventListener(type, (event) => {
          const button = event.target.closest("button") || document.querySelector(`[data-active-pointer="${event.pointerId}"]`);
          clearPressed(button);
        }, { passive: true });
      });
    } else {
      document.addEventListener("touchstart", (event) => event.target.closest(selector)?.classList.add("is-pressed"), { passive: true });
      ["touchend", "touchcancel"].forEach((type) => document.addEventListener(type, () => {
        document.querySelectorAll("button.is-pressed").forEach(clearPressed);
      }, { passive: true }));
    }

    window.addEventListener("blur", () => document.querySelectorAll("button.is-pressed").forEach(clearPressed));
    document.addEventListener("keydown", (event) => {
      if ((event.key === " " || event.key === "Enter") && event.target.matches(selector)) event.target.classList.add("is-pressed");
    });
    document.addEventListener("keyup", (event) => {
      if (event.target.matches("button")) clearPressed(event.target);
    });
  }

  renderKeypad();
  installImmediatePressFeedback();
  syncSettingControls();
  render();
  window.SciCalApp = Object.freeze({
    setInterfaceMode,
    getState: () => ({
      mode: state.mode,
      interfaceMode: state.interfaceMode,
      expression: state.expression,
      resultText: state.resultText,
      sdEntries: state.sdData.length,
      regEntries: state.regData.length,
      programSlot: state.programSlot,
    }),
  });
})();
