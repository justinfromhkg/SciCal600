(function linearAlgebraInterface() {
  "use strict";

  const core = window.LinearAlgebraCore;
  const workspace = document.querySelector("#matrix-workspace");
  if (!core || !workspace) return;

  const matrixA = document.querySelector("#matrix-a");
  const matrixB = document.querySelector("#matrix-b");
  const matrixACard = document.querySelector("#matrix-a-card");
  const matrixBCard = document.querySelector("#matrix-b-card");
  const matrixAShape = document.querySelector("#matrix-a-shape");
  const matrixBShape = document.querySelector("#matrix-b-shape");
  const operation = document.querySelector("#matrix-operation");
  const operationButtons = [...document.querySelectorAll("[data-matrix-operation]")];
  const templateButtons = [...document.querySelectorAll("[data-matrix-template]")];
  const exampleButtons = [...document.querySelectorAll("[data-matrix-example]")];
  const swapButton = document.querySelector("#matrix-swap");
  const calculateButton = document.querySelector("#matrix-calculate");
  const expression = document.querySelector("#matrix-expression");
  const resultPanel = document.querySelector(".matrix-result");
  const resultExpression = document.querySelector("#matrix-result-expression");
  const resultShape = document.querySelector("#matrix-result-shape");
  const result = document.querySelector("#matrix-result");
  const resultSummary = document.querySelector("#matrix-result-summary");
  const languageSelect = document.querySelector("#language-select");
  const binaryOperations = new Set(["add", "subtract", "multiply"]);
  const notation = Object.freeze({
    add: "A + B",
    subtract: "A − B",
    multiply: "A × B",
    inverse: "A⁻¹",
    transpose: "Aᵀ",
    adjugate: "adj(A)",
    eigen: "eig(A)",
    determinant: "det(A)",
  });
  const examples = Object.freeze({
    product: { operation: "multiply", a: "1 2 3\n4 5 6", b: "7 8\n9 10\n11 12" },
    determinant: { operation: "determinant", a: "2 -1 0\n-1 2 -1\n0 -1 2" },
    eigen: { operation: "eigen", a: "2 1\n1 2" },
  });
  let lastResultContext = null;

  function translate(key) {
    return window.SciCalUI?.translate(key) || key;
  }

  function formatNumber(value) {
    const cleaned = core.cleanNumber(value);
    if (Number.isInteger(cleaned)) return String(cleaned);
    return Number(cleaned.toPrecision(10)).toString();
  }

  function formatComplex(value) {
    if (typeof value === "number") return formatNumber(value);
    const real = formatNumber(value.re);
    const imaginary = formatNumber(Math.abs(value.im));
    if (Math.abs(value.im) < core.EPSILON) return real;
    return `${real} ${value.im < 0 ? "−" : "+"} ${imaginary}i`;
  }

  function matrixTable(matrix, label = "") {
    const table = document.createElement("table");
    table.className = "matrix-output-table";
    if (label) table.setAttribute("aria-label", label);
    const body = document.createElement("tbody");
    matrix.forEach((row) => {
      const tableRow = document.createElement("tr");
      row.forEach((value) => {
        const cell = document.createElement("td");
        cell.textContent = typeof value === "object" ? formatComplex(value) : formatNumber(value);
        tableRow.append(cell);
      });
      body.append(tableRow);
    });
    table.append(body);
    return table;
  }

  function getParsed(input, name) {
    try {
      return core.parseMatrix(input.value, name);
    } catch (_error) {
      return null;
    }
  }

  function shapeOf(matrix) {
    return matrix ? `${matrix.length} × ${matrix[0].length}` : "—";
  }

  function updateMatrixStatus(input, output, card, showError = false) {
    const parsed = getParsed(input, input === matrixA ? "Matrix A" : "Matrix B");
    output.textContent = shapeOf(parsed);
    card.classList.toggle("has-valid-input", Boolean(parsed));
    card.classList.toggle("has-invalid-input", showError && !parsed);
    input.setAttribute("aria-invalid", String(showError && !parsed));
    return parsed;
  }

  function readInputs(showError = false) {
    return {
      a: updateMatrixStatus(matrixA, matrixAShape, matrixACard, showError),
      b: updateMatrixStatus(matrixB, matrixBShape, matrixBCard, showError),
    };
  }

  function resetResult() {
    const empty = document.createElement("span");
    empty.className = "empty-state";
    empty.textContent = translate("matrixReady");
    result.replaceChildren(empty);
    resultExpression.textContent = notation[operation.value];
    resultShape.textContent = "—";
    resultSummary.textContent = translate("matrixResultSummary");
    resultPanel.dataset.state = "ready";
    lastResultContext = null;
    calculateButton.classList.remove("has-error", "has-success");
  }

  function renderResultContext(context) {
    const { a, b, detail, kind } = context;
    const outputShape = kind === "scalar"
      ? translate("matrixResultScalar")
      : kind === "eigen" ? `${detail} ${translate("matrixResultPairs")}` : detail;
    const inputs = b ? `A ${shapeOf(a)} · B ${shapeOf(b)}` : `A ${shapeOf(a)}`;
    resultExpression.textContent = notation[operation.value];
    resultShape.textContent = outputShape;
    resultSummary.textContent = `${inputs} → ${outputShape}`;
    resultPanel.dataset.state = kind;
  }

  function setResultContext(a, b, detail, kind = "matrix") {
    lastResultContext = { a, b, detail, kind };
    renderResultContext(lastResultContext);
  }

  function renderEigen(output, a) {
    const container = document.createElement("div");
    container.className = "eigen-results";
    output.values.forEach((value, index) => {
      const card = document.createElement("article");
      card.className = "eigen-card";
      const heading = document.createElement("strong");
      heading.textContent = `λ${index + 1} = ${formatComplex(value)}`;
      const vectorLabel = document.createElement("span");
      vectorLabel.textContent = `v${index + 1}`;
      const vector = matrixTable(output.vectors[index].map((component) => [component]), `Eigenvector ${index + 1}`);
      card.append(heading, vectorLabel, vector);
      container.append(card);
    });
    result.replaceChildren(container);
    setResultContext(a, null, output.values.length, "eigen");
  }

  function calculate() {
    calculateButton.classList.remove("has-error", "has-success");
    resultPanel.dataset.state = "calculating";
    const selected = operation.value;
    const inputs = readInputs(true);
    try {
      const a = core.parseMatrix(matrixA.value, "Matrix A");
      const b = binaryOperations.has(selected) ? core.parseMatrix(matrixB.value, "Matrix B") : null;
      let output;
      if (selected === "add") output = core.add(a, b);
      else if (selected === "subtract") output = core.subtract(a, b);
      else if (selected === "multiply") output = core.multiply(a, b);
      else if (selected === "inverse") output = core.inverse(a);
      else if (selected === "transpose") output = core.transpose(a);
      else if (selected === "adjugate") output = core.adjugate(a);
      else if (selected === "determinant") output = core.determinant(a);
      else if (selected === "eigen") {
        renderEigen(core.eigen(a), a);
        calculateButton.classList.add("has-success");
        return;
      }

      if (typeof output === "number") {
        const value = document.createElement("strong");
        value.className = "matrix-scalar-result";
        value.textContent = formatNumber(output);
        result.replaceChildren(value);
        setResultContext(a, b, null, "scalar");
      } else {
        result.replaceChildren(matrixTable(output, "Matrix result"));
        setResultContext(a, b, shapeOf(output), "matrix");
      }
      calculateButton.classList.add("has-success");
    } catch (error) {
      const message = document.createElement("p");
      message.className = "matrix-error";
      message.textContent = error instanceof core.MatrixError ? error.message : "Unable to calculate this matrix.";
      result.replaceChildren(message);
      resultExpression.textContent = notation[selected];
      resultShape.textContent = translate("matrixResultError");
      resultSummary.textContent = error instanceof Error ? error.message : translate("matrixResultError");
      resultPanel.dataset.state = "error";
      lastResultContext = { kind: "error" };
      calculateButton.classList.add("has-error");
      if (/Matrix A/.test(message.textContent)) matrixA.focus();
      else if (/Matrix B/.test(message.textContent)) matrixB.focus();
      else {
        matrixACard.classList.toggle("has-invalid-input", !inputs.a);
        matrixBCard.classList.toggle("has-invalid-input", binaryOperations.has(selected) && !inputs.b);
      }
    }
  }

  function syncOperation(shouldReset = true) {
    const selected = operation.value;
    const needsB = binaryOperations.has(selected);
    matrixBCard.hidden = !needsB;
    swapButton.hidden = !needsB;
    workspace.classList.toggle("is-unary-operation", !needsB);
    operationButtons.forEach((button) => {
      const active = button.dataset.matrixOperation === selected;
      button.classList.toggle("is-selected", active);
      button.setAttribute("aria-pressed", String(active));
    });
    expression.textContent = notation[selected];
    if (shouldReset) resetResult();
  }

  function serialize(matrix) {
    return matrix.map((row) => row.join(" ")).join("\n");
  }

  function squareTemplate(input, size, identity = false) {
    const existing = getParsed(input, "Matrix");
    return Array.from({ length: size }, (_, row) => Array.from({ length: size }, (_, column) => {
      if (identity) return Number(row === column);
      return existing?.[row]?.[column] ?? 0;
    }));
  }

  function applyTemplate(button) {
    const input = button.dataset.matrixTarget === "a" ? matrixA : matrixB;
    const template = button.dataset.matrixTemplate;
    if (template === "clear") input.value = "";
    else {
      const current = getParsed(input, "Matrix");
      const size = template === "identity"
        ? (current && current.length === current[0].length ? current.length : 2)
        : Number(template);
      input.value = serialize(squareTemplate(input, size, template === "identity"));
    }
    readInputs();
    resetResult();
    input.focus();
  }

  function swapMatrices() {
    [matrixA.value, matrixB.value] = [matrixB.value, matrixA.value];
    readInputs();
    resetResult();
  }

  function loadExample(name) {
    const sample = examples[name];
    if (!sample) return;
    operation.value = sample.operation;
    matrixA.value = sample.a;
    if (sample.b) matrixB.value = sample.b;
    syncOperation(false);
    readInputs();
    calculate();
  }

  function refreshTranslatedState() {
    templateButtons.filter((button) => button.dataset.matrixTemplate === "identity").forEach((button) => {
      button.title = translate("matrixIdentity");
      button.setAttribute("aria-label", translate("matrixIdentity"));
    });
    if (resultPanel.dataset.state === "ready") resetResult();
    else if (lastResultContext?.kind === "error") {
      resultShape.textContent = translate("matrixResultError");
      resultSummary.textContent = translate("matrixErrorGuidance");
    } else if (lastResultContext) renderResultContext(lastResultContext);
  }

  operation.addEventListener("change", () => syncOperation());
  operationButtons.forEach((button) => button.addEventListener("click", () => {
    operation.value = button.dataset.matrixOperation;
    syncOperation();
  }));
  templateButtons.forEach((button) => button.addEventListener("click", () => applyTemplate(button)));
  exampleButtons.forEach((button) => button.addEventListener("click", () => loadExample(button.dataset.matrixExample)));
  swapButton.addEventListener("click", swapMatrices);
  calculateButton.addEventListener("click", calculate);
  [matrixA, matrixB].forEach((input) => {
    input.addEventListener("input", () => {
      readInputs();
      resetResult();
    });
    input.addEventListener("keydown", (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
        event.preventDefault();
        calculate();
      }
    });
  });
  languageSelect?.addEventListener("change", () => requestAnimationFrame(refreshTranslatedState));

  syncOperation(false);
  readInputs();
  resetResult();
  refreshTranslatedState();
  window.SciCalLinearAlgebra = Object.freeze({ calculate, loadExample, setOperation: (value) => {
    if (!notation[value]) return;
    operation.value = value;
    syncOperation();
  } });
})();
