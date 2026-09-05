(function computerCalculatorInterface() {
  "use strict";
  const core = window.ComputerCalculatorCore;
  const root = document.querySelector("#computer-calculator");
  if (!core || !root) return;

  const $ = (selector) => root.querySelector(selector);
  const $$ = (selector) => [...root.querySelectorAll(selector)];
  const text = (value) => String(value);
  const numberText = (value, digits = 8) => Number.isFinite(value) ? Number(value.toPrecision(digits)).toString() : String(value);

  function setResult(element, html, error = false) {
    element.classList.toggle("is-error", error);
    element.innerHTML = html;
  }

  function fail(element, error) {
    setResult(element, `<strong>${escapeHtml(error?.message || String(error))}</strong>`, true);
  }

  function escapeHtml(value) {
    const node = document.createElement("span");
    node.textContent = String(value);
    return node.innerHTML;
  }

  function copyButton(value) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "copy-button";
    button.textContent = "Copy";
    button.addEventListener("click", async () => {
      try { await navigator.clipboard.writeText(String(value)); button.textContent = "Copied"; }
      catch (_error) { button.textContent = "Select and copy"; }
      setTimeout(() => { button.textContent = "Copy"; }, 1200);
    });
    return button;
  }

  function selectLayer(name) {
    $$('[data-computer-section]').forEach((button) => button.classList.toggle("is-selected", button.dataset.computerSection === name));
    $$('[data-computer-panel]').forEach((panel) => {
      const active = panel.dataset.computerPanel === name;
      panel.hidden = !active;
      panel.classList.toggle("is-active", active);
    });
    try { localStorage.setItem("scical600.computer.layer", name); } catch (_error) { /* optional */ }
  }

  root.addEventListener("click", (event) => {
    const layer = event.target.closest("[data-computer-section]");
    if (layer) selectLayer(layer.dataset.computerSection);
  });

  function renderRadix() {
    const result = $("#radix-results");
    try {
      const parsed = core.parseRadix($("#radix-input").value, $("#radix-from").value);
      const target = Number($("#radix-to").value);
      const bases = [...new Set([2, 8, 10, 16, target])];
      result.replaceChildren(...bases.map((base) => {
        const card = document.createElement("div");
        card.className = "radix-result";
        const label = document.createElement("span"); label.textContent = `Base ${base}`;
        const value = core.formatRadix(parsed, base, { grouped: $("#radix-grouped").checked, maxFractionDigits: 64 });
        const output = document.createElement("bdi"); output.dir = "ltr"; output.textContent = value;
        card.append(label, output, copyButton(value.replaceAll(" ", "")));
        return card;
      }));
    } catch (error) { result.replaceChildren(); const message = document.createElement("div"); message.className = "computer-result is-error"; message.textContent = error.message; result.append(message); }
  }
  ["#radix-input", "#radix-from", "#radix-to", "#radix-grouped"].forEach((selector) => $(selector).addEventListener("input", renderRadix));

  function renderInteger() {
    const target = $("#integer-result");
    try {
      const width = Number($("#integer-width").value);
      const a = BigInt($("#integer-a").value.trim());
      const b = BigInt($("#integer-b").value.trim());
      const signed = $("#integer-signed").value === "true";
      const representation = core.integerRepresentations(a, width);
      const output = core.alu($("#integer-operation").value, a, b, width, signed);
      const flags = Object.entries(output.flags).map(([name, value]) => `<span class="${value ? "is-set" : ""}">${name[0].toUpperCase()}=${value ? 1 : 0}</span>`).join("");
      setResult(target, `<div class="result-grid"><span>Bit pattern<strong>${representation.bitPattern}</strong></span><span>Hex<strong>${representation.hexadecimal}</strong></span><span>Unsigned<strong>${representation.unsigned}</strong></span><span>Two's complement<strong>${representation.signed}</strong></span><span>Sign-magnitude<strong>${representation.signMagnitudeNegativeZero ? "−0" : representation.signMagnitude}</strong></span><span>One's complement<strong>${representation.onesComplementNegativeZero ? "−0" : representation.onesComplement}</strong></span><span>ALU result<strong>${output.signedResult} / ${output.hexadecimal}</strong></span><span>Mathematical truth<strong>${output.mathematical}</strong></span><span>Range<strong>${representation.range.signed[0]}…${representation.range.signed[1]}</strong></span></div><div class="flag-row">${flags}</div><p>Carry is unsigned carry/no-borrow or the last shifted-out bit; Overflow is signed two's-complement overflow. The bit pattern wraps to ${width} bits.</p>`);
    } catch (error) { fail(target, error); }
  }
  $("#integer-calculate").addEventListener("click", renderInteger);
  ["#integer-width", "#integer-signed", "#integer-operation"].forEach((selector) => $(selector).addEventListener("change", renderInteger));

  $("#bcd-encode").addEventListener("click", () => { try { const value = core.encodeBCD($("#bcd-decimal").value); $("#bcd-bits").value = value; setResult($("#bcd-result"), `<strong dir="ltr">${value}</strong>`); } catch (error) { fail($("#bcd-result"), error); } });
  $("#bcd-decode").addEventListener("click", () => { try { const value = core.decodeBCD($("#bcd-bits").value); $("#bcd-decimal").value = value; setResult($("#bcd-result"), `<strong dir="ltr">${value}</strong>`); } catch (error) { fail($("#bcd-result"), error); } });

  function renderIEEE() {
    const target = $("#ieee-result");
    try {
      const info = core.inspectIEEE($("#ieee-input").value, Number($("#ieee-width").value), $("#ieee-format").value);
      const eStart = 1 + info.exponentBits;
      $("#ieee-segments").innerHTML = `<span class="sign">S ${info.binary[0]}</span><span class="exponent">E ${info.binary.slice(1, eStart)}</span><span class="mantissa">M ${info.binary.slice(eStart)}</span>`;
      const exactPower = `${info.sign ? "−" : ""}${info.significandNumerator} × 2^(${info.actualExponent}−${info.fractionBits})`;
      setResult(target, `<div class="result-grid"><span>Class<strong>${info.classification}</strong></span><span>Hex<strong>${info.hexadecimal}</strong></span><span>Bias<strong>${info.bias}</strong></span><span>Actual exponent<strong>${info.actualExponent}</strong></span><span>Hidden bit<strong>${info.hiddenBit}</strong></span><span>Exact binary value<strong>${exactPower}</strong></span><span>Approximate decimal<strong>${Object.is(info.value, -0) ? "−0" : info.value}</strong></span><span>ULP<strong>${info.ulp}</strong></span><span>Next down<strong>${info.nextDown}</strong></span><span>Next up<strong>${info.nextUp}</strong></span></div>`);
    } catch (error) { $("#ieee-segments").replaceChildren(); fail(target, error); }
  }
  $("#ieee-inspect").addEventListener("click", renderIEEE);

  $("#custom-encode").addEventListener("click", () => {
    const target = $("#custom-result");
    try {
      const parts = $("#custom-layout").value.split("/").map(Number);
      if (parts.length !== 3 || parts[0] !== 1) throw new core.ComputerError("Use S/E/M such as 1/3/4; one sign bit is required.");
      const options = { exponentBits: parts[1], fractionBits: parts[2], bias: Number($("#custom-bias").value), radix: Number($("#custom-radix").value) };
      const encoded = core.customFloatEncode($("#custom-input").value, options);
      const decoded = core.customFloatDecode(encoded.bits, options);
      setResult(target, `<div class="result-grid"><span>Bits<strong>${encoded.bits}</strong></span><span>Decoded<strong>${decoded.value}</strong></span><span>Exponent<strong>${decoded.exponent}</strong></span><span>Absolute error<strong>${encoded.absoluteError || 0}</strong></span></div><p>This configurable teaching format is not IEEE 754 and does not reserve IEEE special encodings.</p>`);
    } catch (error) { fail(target, error); }
  });

  $("#float-calculate").addEventListener("click", () => {
    const target = $("#float-result");
    try {
      const output = core.floatingAddSteps($("#float-a").value, $("#float-b").value, Number($("#ieee-width").value), $("#float-operation").value);
      setResult(target, `<strong>${output.result}</strong><ol>${output.steps.map((step) => `<li>${escapeHtml(step)}</li>`).join("")}</ol>`);
    } catch (error) { fail(target, error); }
  });

  let lmcState = null;
  let lmcRunToken = 0;
  function parseLmcInput() {
    const value = $("#lmc-input").value.trim();
    if (!value) return [];
    return value.split(/[\s,]+/).map((item) => {
      const numeric = Number(item);
      if (!Number.isInteger(numeric) || numeric < -999 || numeric > 999) throw new core.ComputerError("LMC input values must be integers from −999 to 999.");
      return numeric;
    });
  }
  function assembleLmc() {
    lmcRunToken += 1;
    const assembled = core.assembleLMC($("#lmc-source").value);
    lmcState = core.createLMC(assembled, parseLmcInput());
    renderLmc(`Assembled ${assembled.listing.length} words.`);
    return lmcState;
  }
  function renderLmc(message = "") {
    if (!lmcState) return;
    $("#lmc-registers").innerHTML = [["PC",lmcState.pc],["MAR",lmcState.mar],["MDR",lmcState.mdr],["IR",String(lmcState.ir).padStart(3,"0")],["ACC",lmcState.acc],["Cycles",lmcState.cycles]].map(([key,value]) => `<span>${key}<strong>${value}</strong></span>`).join("");
    $("#lmc-memory").innerHTML = lmcState.memory.map((value,index) => `<span class="${index === lmcState.pc ? "is-active" : ""}" title="${String(index).padStart(2,"0")}">${String(index).padStart(2,"0")}<br>${String(value).padStart(3,"0")}</span>`).join("");
    const last = lmcState.trace.at(-1);
    const detail = last ? `<p><strong>${String(last.instruction).padStart(3,"0")}</strong> · ${last.micro.map(escapeHtml).join(" → ")}</p>` : "";
    setResult($("#lmc-result"), `${message ? `<p>${escapeHtml(message)}</p>` : ""}<div class="result-grid"><span>Steps<strong>${lmcState.steps}</strong></span><span>Output<strong>${lmcState.output.join(", ") || "—"}</strong></span><span>Status<strong>${lmcState.error || (lmcState.halted ? "halted" : "ready")}</strong></span></div>${detail}`, Boolean(lmcState.error));
  }
  $("#lmc-assemble").addEventListener("click", () => { try { assembleLmc(); } catch (error) { fail($("#lmc-result"), error); } });
  $("#lmc-reset").addEventListener("click", () => { try { assembleLmc(); } catch (error) { fail($("#lmc-result"), error); } });
  $("#lmc-step").addEventListener("click", () => { try { if (!lmcState || lmcState.halted) assembleLmc(); core.stepLMC(lmcState, 10000); renderLmc(); } catch (error) { fail($("#lmc-result"), error); } });
  $("#lmc-run").addEventListener("click", () => {
    try {
      if (!lmcState || lmcState.halted) assembleLmc();
      const breakpoints = new Set($("#lmc-breakpoints").value.split(/[\s,]+/).filter(Boolean).map(Number));
      const token = ++lmcRunToken;
      function chunk() {
        if (token !== lmcRunToken || lmcState.halted) { renderLmc(); return; }
        for (let count = 0; count < 100 && !lmcState.halted; count += 1) {
          if (lmcState.steps > 0 && breakpoints.has(lmcState.pc)) { renderLmc(`Breakpoint ${String(lmcState.pc).padStart(2,"0")} reached.`); return; }
          core.stepLMC(lmcState, 10000);
        }
        renderLmc();
        if (!lmcState.halted) requestAnimationFrame(chunk);
      }
      requestAnimationFrame(chunk);
    } catch (error) { fail($("#lmc-result"), error); }
  });

  function splitNumbers(selector, delimiter = "/") {
    return $(selector).value.split(delimiter).map((value) => Number(value.trim()));
  }
  root.addEventListener("click", (event) => {
    const button = event.target.closest("[data-performance]");
    if (!button) return;
    const name = button.dataset.performance;
    const target = $(`#${name}-result`);
    try {
      if (name === "capacity") {
        const value = core.addressCapacity($("#perf-address").value, 8, $("#perf-unit").value);
        setResult(target, `<strong>${value.bytes} bytes · ${numberText(value.mebibytes)} MiB · ${numberText(value.gigabytes)} GB (SI)</strong><p>2^address bits × addressable bytes per location.</p>`);
      } else if (name === "clock") {
        const frequency = Number($("#perf-frequency").value);
        const timing = core.frequencyPeriod(frequency, "GHz");
        setResult(target, `<strong>${numberText(timing.seconds * 1e9)} ns period · ${numberText(core.executionTime($("#perf-cycles").value, timing.hertz))} s execution</strong><p>time = cycles / frequency</p>`);
      } else if (name === "bus") {
        const [width,mhz,transfers,efficiency] = splitNumbers("#perf-bus");
        const value = core.busBandwidth({ widthBits:width, frequencyHz:mhz*1e6, transfersPerCycle:transfers, efficiency:efficiency/100 });
        setResult(target, `<strong>${numberText(value.bytesPerSecond/1e9)} GB/s · ${numberText(value.bitsPerSecond/1e9)} Gb/s</strong><p>width × clock × transfers × efficiency; decimal SI units.</p>`);
      } else if (name === "cache") {
        const parts = $("#perf-cache").value.split(";").map((part) => part.trim());
        const memory = Number(parts.pop());
        const levels = parts.map((part) => { const [hit,miss] = part.split("/").map(Number); return { hitTime:hit, missRate:miss/100 }; });
        setResult(target, `<strong>${numberText(core.amat(levels,memory))} ns AMAT</strong><p>Tᵢ = hit timeᵢ + local miss rateᵢ × Tᵢ₊₁.</p>`);
      } else if (name === "disk") {
        const [seek,rpm,bytes,mbps,overhead,queue] = splitNumbers("#perf-disk");
        const value = core.diskAccess({seekMs:seek,rpm,bytes,bytesPerSecond:mbps*1e6,overheadMs:overhead,queueMs:queue});
        setResult(target, `<strong>${numberText(value.totalMs)} ms total</strong><p>${numberText(value.seekMs)} seek + ${numberText(value.rotationalMs)} average rotation + ${numberText(value.transferMs)} transfer + ${numberText(value.overheadMs + value.queueMs)} overhead/queue.</p>`);
      } else if (name === "dma") {
        const [bytes,mbps,setup] = splitNumbers("#perf-dma");
        const value = core.dmaTransfer({bytes,bytesPerSecond:mbps*1e6,setupSeconds:setup/1000});
        setResult(target, `<strong>${numberText(value.elapsedSeconds*1000)} ms elapsed · ${numberText(value.cpuUtilisation*100)}% estimated CPU busy</strong><p>DMA setup + transfer; PIO comparison assumes CPU busy for the transfer.</p>`);
      } else if (name === "wafer") {
        const [diameter,area,defects] = splitNumbers("#perf-wafer");
        const value = core.waferYield({diameterMm:diameter,dieAreaMm2:area,defectDensityPerMm2:defects});
        setResult(target, `<strong>${numberText(value.grossDies)} gross · ${numberText(value.expectedGoodDies)} expected good dies</strong><p>${value.model}; an educational edge-loss approximation, not a foundry yield forecast.</p>`);
      }
    } catch (error) { fail(target, error); }
  });

  try { selectLayer(localStorage.getItem("scical600.computer.layer") || "numbers"); } catch (_error) { selectLayer("numbers"); }
  renderRadix(); renderInteger(); renderIEEE();
  try { assembleLmc(); } catch (_error) { /* default source is valid */ }
})();
