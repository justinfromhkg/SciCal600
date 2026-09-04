(function linearAlgebraInterface() {
  "use strict";

  const core = window.LinearAlgebraCore;
  const workspace = document.querySelector("#matrix-workspace");
  if (!core || !workspace) return;

  const matrixA = document.querySelector("#matrix-a");
  const matrixB = document.querySelector("#matrix-b");
  const matrixBCard = document.querySelector("#matrix-b-card");
  const operation = document.querySelector("#matrix-operation");
  const calculateButton = document.querySelector("#matrix-calculate");
  const result = document.querySelector("#matrix-result");
  const binaryOperations = new Set(["add", "subtract", "multiply"]);

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

  function renderEigen(output) {
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
  }

  function calculate() {
    calculateButton.classList.remove("has-error", "has-success");
    try {
      const a = core.parseMatrix(matrixA.value, "Matrix A");
      const selected = operation.value;
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
        renderEigen(core.eigen(a));
        calculateButton.classList.add("has-success");
        return;
      }

      if (typeof output === "number") {
        const value = document.createElement("strong");
        value.className = "matrix-scalar-result";
        value.textContent = formatNumber(output);
        result.replaceChildren(value);
      } else {
        result.replaceChildren(matrixTable(output, "Matrix result"));
      }
      calculateButton.classList.add("has-success");
    } catch (error) {
      const message = document.createElement("p");
      message.className = "matrix-error";
      message.textContent = error instanceof core.MatrixError ? error.message : "Unable to calculate this matrix.";
      result.replaceChildren(message);
      calculateButton.classList.add("has-error");
    }
  }

  function syncOperation() {
    const needsB = binaryOperations.has(operation.value);
    matrixBCard.hidden = !needsB;
    workspace.classList.toggle("is-unary-operation", !needsB);
  }

  operation.addEventListener("change", syncOperation);
  calculateButton.addEventListener("click", calculate);
  [matrixA, matrixB].forEach((input) => input.addEventListener("keydown", (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
      event.preventDefault();
      calculate();
    }
  }));

  syncOperation();
  window.SciCalLinearAlgebra = Object.freeze({ calculate });
})();
