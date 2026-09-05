(function linearAlgebraCoreFactory(root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.LinearAlgebraCore = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function createLinearAlgebraCore() {
  "use strict";

  const EPSILON = 1e-10;

  class MatrixError extends Error {
    constructor(message) {
      super(message);
      this.name = "MatrixError";
    }
  }

  function assertMatrix(matrix, name = "Matrix") {
    if (!Array.isArray(matrix) || !matrix.length || !Array.isArray(matrix[0]) || !matrix[0].length) {
      throw new MatrixError(`${name} must contain at least one row and one column.`);
    }
    const columns = matrix[0].length;
    if (matrix.length > 6 || columns > 6) throw new MatrixError(`${name} is limited to 6 × 6.`);
    matrix.forEach((row) => {
      if (!Array.isArray(row) || row.length !== columns) throw new MatrixError(`${name} must be rectangular.`);
      if (row.some((value) => !Number.isFinite(value))) throw new MatrixError(`${name} contains an invalid number.`);
    });
  }

  function parseMatrix(source, name = "Matrix") {
    let text = String(source ?? "").trim();
    if (!text) throw new MatrixError(`${name} must contain at least one row and one column.`);
    // Accept common spreadsheet/mobile paste forms without treating ordinary
    // spaces as row separators.  A boundary such as "],[" denotes a new row.
    text = text
      .replace(/\]\s*,\s*\[/g, "\n")
      .replace(/[\[\]]/g, "")
      .replace(/[−–—﹣－]/g, "-")
      .replace(/＋/g, "+")
      .replace(/[;；]/g, "\n")
      .replace(/\r\n?/g, "\n");
    const rawRows = text.split("\n");
    if (rawRows.some((row) => !row.trim())) throw new MatrixError(`${name} contains an empty row.`);
    const numericToken = /^[+-]?(?:(?:\d+(?:\.\d*)?)|(?:\.\d+))(?:[eE][+-]?\d+)?$/;
    const rows = rawRows.map((row) => {
      const tokens = row.trim().split(/[\t \u00A0,，]+/).filter(Boolean);
      if (!tokens.length || tokens.some((token) => !numericToken.test(token))) throw new MatrixError(`${name} contains an invalid number.`);
      return tokens.map((token) => Number(token));
    });
    assertMatrix(rows, name);
    return rows;
  }

  function dimensions(matrix) {
    assertMatrix(matrix);
    return [matrix.length, matrix[0].length];
  }

  function requireSameSize(a, b) {
    const [aRows, aColumns] = dimensions(a);
    const [bRows, bColumns] = dimensions(b);
    if (aRows !== bRows || aColumns !== bColumns) {
      throw new MatrixError("A and B must have the same dimensions for this operation.");
    }
  }

  function add(a, b) {
    requireSameSize(a, b);
    return a.map((row, rowIndex) => row.map((value, columnIndex) => value + b[rowIndex][columnIndex]));
  }

  function subtract(a, b) {
    requireSameSize(a, b);
    return a.map((row, rowIndex) => row.map((value, columnIndex) => value - b[rowIndex][columnIndex]));
  }

  function multiply(a, b) {
    const [, aColumns] = dimensions(a);
    const [bRows, bColumns] = dimensions(b);
    if (aColumns !== bRows) throw new MatrixError("Columns in A must equal rows in B for multiplication.");
    return a.map((row) => Array.from({ length: bColumns }, (_, columnIndex) => (
      row.reduce((sum, value, index) => sum + value * b[index][columnIndex], 0)
    )));
  }

  function transpose(matrix) {
    const [rows, columns] = dimensions(matrix);
    return Array.from({ length: columns }, (_, columnIndex) => (
      Array.from({ length: rows }, (_, rowIndex) => matrix[rowIndex][columnIndex])
    ));
  }

  function requireSquare(matrix) {
    const [rows, columns] = dimensions(matrix);
    if (rows !== columns) throw new MatrixError("This operation requires a square matrix.");
    return rows;
  }

  function pivotTolerance(matrix) {
    const scale = matrix.reduce((largest, row) => row.reduce((rowLargest, value) => (
      Math.max(rowLargest, Math.abs(value))
    ), largest), 0);
    return Math.max(Number.MIN_VALUE, scale * Number.EPSILON * matrix.length * 32);
  }

  function determinant(matrix) {
    const size = requireSquare(matrix);
    const working = matrix.map((row) => row.slice());
    const tolerance = pivotTolerance(matrix);
    let sign = 1;
    let result = 1;
    for (let column = 0; column < size; column += 1) {
      let pivot = column;
      for (let row = column + 1; row < size; row += 1) {
        if (Math.abs(working[row][column]) > Math.abs(working[pivot][column])) pivot = row;
      }
      if (Math.abs(working[pivot][column]) <= tolerance) return 0;
      if (pivot !== column) {
        [working[pivot], working[column]] = [working[column], working[pivot]];
        sign *= -1;
      }
      const pivotValue = working[column][column];
      result *= pivotValue;
      for (let row = column + 1; row < size; row += 1) {
        const factor = working[row][column] / pivotValue;
        for (let inner = column + 1; inner < size; inner += 1) {
          working[row][inner] -= factor * working[column][inner];
        }
      }
    }
    return cleanNumber(result * sign);
  }

  function inverse(matrix) {
    const size = requireSquare(matrix);
    const tolerance = pivotTolerance(matrix);
    const augmented = matrix.map((row, rowIndex) => [
      ...row,
      ...Array.from({ length: size }, (_, columnIndex) => Number(rowIndex === columnIndex)),
    ]);

    for (let column = 0; column < size; column += 1) {
      let pivot = column;
      for (let row = column + 1; row < size; row += 1) {
        if (Math.abs(augmented[row][column]) > Math.abs(augmented[pivot][column])) pivot = row;
      }
      if (Math.abs(augmented[pivot][column]) <= tolerance) throw new MatrixError("Matrix A is singular and has no inverse.");
      [augmented[pivot], augmented[column]] = [augmented[column], augmented[pivot]];
      const divisor = augmented[column][column];
      augmented[column] = augmented[column].map((value) => value / divisor);
      for (let row = 0; row < size; row += 1) {
        if (row === column) continue;
        const factor = augmented[row][column];
        augmented[row] = augmented[row].map((value, index) => value - factor * augmented[column][index]);
      }
    }
    return augmented.map((row) => row.slice(size).map(cleanNumber));
  }

  function minor(matrix, removedRow, removedColumn) {
    return matrix
      .filter((_, rowIndex) => rowIndex !== removedRow)
      .map((row) => row.filter((_, columnIndex) => columnIndex !== removedColumn));
  }

  function adjugate(matrix) {
    const size = requireSquare(matrix);
    if (size === 1) return [[1]];
    const cofactors = matrix.map((row, rowIndex) => row.map((_, columnIndex) => (
      ((rowIndex + columnIndex) % 2 ? -1 : 1) * determinant(minor(matrix, rowIndex, columnIndex))
    )));
    return transpose(cofactors).map((row) => row.map(cleanNumber));
  }

  function cleanNumber(value) {
    if (value === 0 || Object.is(value, -0)) return 0;
    const rounded = Math.round(value);
    const roundingTolerance = Number.EPSILON * Math.max(1, Math.abs(value)) * 32;
    return Math.abs(value - rounded) <= roundingTolerance ? rounded : Number(value.toPrecision(12));
  }

  function normalize(vector) {
    const length = Math.hypot(...vector);
    if (length < EPSILON) return vector.map(() => 0);
    const normalized = vector.map((value) => cleanNumber(value / length));
    const first = normalized.find((value) => Math.abs(value) > EPSILON);
    return first < 0 ? normalized.map((value) => -value) : normalized;
  }

  function eigenvector2(matrix, lambda) {
    const [[a, b], [c, d]] = matrix;
    const first = Math.abs(b) + Math.abs(lambda - a) >= Math.abs(lambda - d) + Math.abs(c)
      ? [b, lambda - a]
      : [lambda - d, c];
    if (Math.hypot(...first) < EPSILON) return [1, 0];
    return normalize(first);
  }

  function eigen2(matrix) {
    const [[a, b], [c, d]] = matrix;
    const trace = a + d;
    const discriminant = trace ** 2 - 4 * (a * d - b * c);
    if (discriminant >= -EPSILON) {
      const root = Math.sqrt(Math.max(0, discriminant));
      const values = [cleanNumber((trace + root) / 2), cleanNumber((trace - root) / 2)];
      if (root < EPSILON && Math.abs(b) < EPSILON && Math.abs(c) < EPSILON && Math.abs(a - d) < EPSILON) {
        return { values, vectors: [[1, 0], [0, 1]], complex: false };
      }
      return { values, vectors: values.map((value) => eigenvector2(matrix, value)), complex: false };
    }
    const imaginary = Math.sqrt(-discriminant) / 2;
    const real = trace / 2;
    const values = [{ re: cleanNumber(real), im: imaginary }, { re: cleanNumber(real), im: -imaginary }];
    const vectors = values.map((lambda) => {
      if (Math.abs(b) >= Math.abs(c) && Math.abs(b) > EPSILON) {
        return [{ re: b, im: 0 }, { re: lambda.re - a, im: lambda.im }];
      }
      return [{ re: lambda.re - d, im: lambda.im }, { re: c, im: 0 }];
    });
    return { values, vectors, complex: true };
  }

  function isSymmetric(matrix) {
    return matrix.every((row, rowIndex) => row.every((value, columnIndex) => (
      Math.abs(value - matrix[columnIndex][rowIndex]) < EPSILON
    )));
  }

  function eigenSymmetric(matrix) {
    const size = matrix.length;
    const working = matrix.map((row) => row.slice());
    const vectors = Array.from({ length: size }, (_, row) => (
      Array.from({ length: size }, (_, column) => Number(row === column))
    ));
    const maxIterations = Math.max(60, size * size * 40);

    for (let iteration = 0; iteration < maxIterations; iteration += 1) {
      let p = 0;
      let q = 1;
      let largest = 0;
      for (let row = 0; row < size; row += 1) {
        for (let column = row + 1; column < size; column += 1) {
          if (Math.abs(working[row][column]) > largest) {
            largest = Math.abs(working[row][column]);
            p = row;
            q = column;
          }
        }
      }
      if (largest < EPSILON) break;
      const angle = 0.5 * Math.atan2(2 * working[p][q], working[q][q] - working[p][p]);
      const cosine = Math.cos(angle);
      const sine = Math.sin(angle);

      for (let index = 0; index < size; index += 1) {
        if (index !== p && index !== q) {
          const ip = working[index][p];
          const iq = working[index][q];
          working[index][p] = working[p][index] = cosine * ip - sine * iq;
          working[index][q] = working[q][index] = sine * ip + cosine * iq;
        }
        const vp = vectors[index][p];
        const vq = vectors[index][q];
        vectors[index][p] = cosine * vp - sine * vq;
        vectors[index][q] = sine * vp + cosine * vq;
      }
      const app = working[p][p];
      const aqq = working[q][q];
      const apq = working[p][q];
      working[p][p] = cosine ** 2 * app - 2 * sine * cosine * apq + sine ** 2 * aqq;
      working[q][q] = sine ** 2 * app + 2 * sine * cosine * apq + cosine ** 2 * aqq;
      working[p][q] = working[q][p] = 0;
    }

    return Array.from({ length: size }, (_, index) => ({
      value: cleanNumber(working[index][index]),
      vector: normalize(vectors.map((row) => row[index])),
    }))
      .sort((left, right) => right.value - left.value)
      .reduce((result, item) => {
        result.values.push(item.value);
        result.vectors.push(item.vector);
        return result;
      }, { values: [], vectors: [], complex: false });
  }

  function eigen(matrix) {
    const size = requireSquare(matrix);
    if (size === 1) return { values: [matrix[0][0]], vectors: [[1]], complex: false };
    if (size === 2) return eigen2(matrix);
    if (!isSymmetric(matrix)) {
      throw new MatrixError("For matrices larger than 2 × 2, eigenvectors currently require a real symmetric matrix.");
    }
    return eigenSymmetric(matrix);
  }

  return Object.freeze({
    MatrixError,
    EPSILON,
    parseMatrix,
    dimensions,
    add,
    subtract,
    multiply,
    transpose,
    determinant,
    inverse,
    adjugate,
    eigen,
    cleanNumber,
  });
});
