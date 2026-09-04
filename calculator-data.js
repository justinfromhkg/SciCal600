(function calculatorDataFactory(globalScope) {
  "use strict";

  // This catalogue is intentionally versioned. Values are modern SI/CODATA-style
  // study values rather than a claim of bit-for-bit parity with a specific device.
  const CATALOG_VERSION = "2026.1";

  const CONSTANTS = [
    { symbol: "c", name: "Speed of light", value: 299792458, unit: "m s⁻¹" },
    { symbol: "G", name: "Gravitational constant", value: 6.67430e-11, unit: "m³ kg⁻¹ s⁻²" },
    { symbol: "h", name: "Planck constant", value: 6.62607015e-34, unit: "J Hz⁻¹" },
    { symbol: "ℏ", name: "Reduced Planck constant", value: 1.054571817e-34, unit: "J s" },
    { symbol: "e", name: "Elementary charge", value: 1.602176634e-19, unit: "C" },
    { symbol: "mₑ", name: "Electron mass", value: 9.1093837139e-31, unit: "kg" },
    { symbol: "mₚ", name: "Proton mass", value: 1.67262192595e-27, unit: "kg" },
    { symbol: "mₙ", name: "Neutron mass", value: 1.67492750056e-27, unit: "kg" },
    { symbol: "u", name: "Atomic mass constant", value: 1.66053906892e-27, unit: "kg" },
    { symbol: "Nₐ", name: "Avogadro constant", value: 6.02214076e23, unit: "mol⁻¹" },
    { symbol: "k", name: "Boltzmann constant", value: 1.380649e-23, unit: "J K⁻¹" },
    { symbol: "R", name: "Molar gas constant", value: 8.31446261815324, unit: "J mol⁻¹ K⁻¹" },
    { symbol: "ε₀", name: "Vacuum permittivity", value: 8.8541878188e-12, unit: "F m⁻¹" },
    { symbol: "μ₀", name: "Vacuum permeability", value: 1.25663706127e-6, unit: "N A⁻²" },
    { symbol: "kₑ", name: "Coulomb constant", value: 8.9875517923e9, unit: "N m² C⁻²" },
    { symbol: "F", name: "Faraday constant", value: 96485.3321233, unit: "C mol⁻¹" },
    { symbol: "eV", name: "Electron volt", value: 1.602176634e-19, unit: "J" },
    { symbol: "σ", name: "Stefan–Boltzmann constant", value: 5.670374419e-8, unit: "W m⁻² K⁻⁴" },
    { symbol: "R∞", name: "Rydberg constant", value: 10973731.568157, unit: "m⁻¹" },
    { symbol: "a₀", name: "Bohr radius", value: 5.29177210544e-11, unit: "m" },
    { symbol: "g₀", name: "Standard gravity", value: 9.80665, unit: "m s⁻²" },
    { symbol: "atm", name: "Standard atmosphere", value: 101325, unit: "Pa" },
    { symbol: "Vₘ", name: "Ideal gas molar volume (STP)", value: 0.02241396954, unit: "m³ mol⁻¹" },
    { symbol: "α", name: "Fine-structure constant", value: 7.2973525643e-3, unit: "" },
    { symbol: "Φ₀", name: "Magnetic flux quantum", value: 2.067833848e-15, unit: "Wb" },
    { symbol: "G₀", name: "Conductance quantum", value: 7.748091729e-5, unit: "S" },
    { symbol: "Kⱼ", name: "Josephson constant", value: 4.835978484e14, unit: "Hz V⁻¹" },
    { symbol: "Rₖ", name: "von Klitzing constant", value: 25812.80745, unit: "Ω" },
    { symbol: "μᴮ", name: "Bohr magneton", value: 9.2740100657e-24, unit: "J T⁻¹" },
    { symbol: "μᴺ", name: "Nuclear magneton", value: 5.0507837393e-27, unit: "J T⁻¹" },
    { symbol: "γₑ", name: "Electron gyromagnetic ratio", value: 1.76085962784e11, unit: "s⁻¹ T⁻¹" },
    { symbol: "γₚ", name: "Proton gyromagnetic ratio", value: 2.6752218708e8, unit: "s⁻¹ T⁻¹" },
    { symbol: "λ꜀ₑ", name: "Electron Compton wavelength", value: 2.42631023538e-12, unit: "m" },
    { symbol: "λ꜀ₚ", name: "Proton Compton wavelength", value: 1.3214098536e-15, unit: "m" },
    { symbol: "rₑ", name: "Classical electron radius", value: 2.8179403205e-15, unit: "m" },
    { symbol: "σₑ", name: "Thomson cross section", value: 6.6524587051e-29, unit: "m²" },
    { symbol: "b", name: "Wien displacement constant", value: 2.897771955e-3, unit: "m K" },
    { symbol: "M☉", name: "Solar mass", value: 1.98847e30, unit: "kg" },
    { symbol: "M⊕", name: "Earth mass", value: 5.9722e24, unit: "kg" },
    { symbol: "au", name: "Astronomical unit", value: 149597870700, unit: "m" },
  ];

  const FORMULAS = [
    { name: "Rectangle area", display: "A = l × w", expression: "l*w", variables: [["l", "Length"], ["w", "Width"]], unit: "area units" },
    { name: "Circle area", display: "A = πr²", expression: "π*r^2", variables: [["r", "Radius"]], unit: "area units" },
    { name: "Triangle area", display: "A = bh ÷ 2", expression: "b*h/2", variables: [["b", "Base"], ["h", "Height"]], unit: "area units" },
    { name: "Pythagorean hypotenuse", display: "c = √(a² + b²)", expression: "sqrt(a^2+b^2)", variables: [["a", "Side a"], ["b", "Side b"]], unit: "length units" },
    { name: "Sphere volume", display: "V = 4πr³ ÷ 3", expression: "4*π*r^3/3", variables: [["r", "Radius"]], unit: "volume units" },
    { name: "Cylinder volume", display: "V = πr²h", expression: "π*r^2*h", variables: [["r", "Radius"], ["h", "Height"]], unit: "volume units" },
    { name: "Cone volume", display: "V = πr²h ÷ 3", expression: "π*r^2*h/3", variables: [["r", "Radius"], ["h", "Height"]], unit: "volume units" },
    { name: "Distance between points", display: "d = √((x₂−x₁)²+(y₂−y₁)²)", expression: "sqrt((xb-xa)^2+(yb-ya)^2)", variables: [["xa", "x₁"], ["ya", "y₁"], ["xb", "x₂"], ["yb", "y₂"]], unit: "length units" },
    { name: "Quadratic positive root", display: "x = (−b + √(b²−4ac)) ÷ 2a", expression: "(-b+sqrt(b^2-4*a*c))/(2*a)", variables: [["a", "a"], ["b", "b"], ["c", "c"]], unit: "" },
    { name: "Arithmetic nth term", display: "aₙ = a₁ + (n−1)d", expression: "q+(n-1)*d", variables: [["q", "First term"], ["n", "Term n"], ["d", "Difference"]], unit: "" },
    { name: "Arithmetic series sum", display: "Sₙ = n(2a₁+(n−1)d) ÷ 2", expression: "n*(2*q+(n-1)*d)/2", variables: [["q", "First term"], ["n", "Terms"], ["d", "Difference"]], unit: "" },
    { name: "Geometric nth term", display: "aₙ = a₁rⁿ⁻¹", expression: "q*r^(n-1)", variables: [["q", "First term"], ["r", "Ratio"], ["n", "Term n"]], unit: "" },
    { name: "Geometric series sum", display: "Sₙ = a₁(1−rⁿ) ÷ (1−r)", expression: "q*(1-r^n)/(1-r)", variables: [["q", "First term"], ["r", "Ratio (not 1)"], ["n", "Terms"]], unit: "" },
    { name: "Compound interest", display: "A = P(1+r/n)ⁿᵗ", expression: "P*(1+r/n)^(n*t)", variables: [["P", "Principal"], ["r", "Annual rate"], ["n", "Compounds/year"], ["t", "Years"]], unit: "currency units" },
    { name: "Simple interest amount", display: "A = P(1+rt)", expression: "P*(1+r*t)", variables: [["P", "Principal"], ["r", "Annual rate"], ["t", "Years"]], unit: "currency units" },
    { name: "Celsius to Fahrenheit", display: "°F = 9°C ÷ 5 + 32", expression: "9*C/5+32", variables: [["C", "Degrees Celsius"]], unit: "°F" },
    { name: "Fahrenheit to Celsius", display: "°C = 5(°F−32) ÷ 9", expression: "5*(F-32)/9", variables: [["F", "Degrees Fahrenheit"]], unit: "°C" },
    { name: "Kinetic energy", display: "Eₖ = mv² ÷ 2", expression: "mass*v^2/2", variables: [["mass", "Mass (kg)"], ["v", "Speed (m/s)"]], unit: "J" },
    { name: "Gravitational potential energy", display: "Eₚ = mgh", expression: "mass*g*h", variables: [["mass", "Mass (kg)"], ["g", "Gravity (m/s²)"], ["h", "Height (m)"]], unit: "J" },
    { name: "Ohm's law current", display: "I = V ÷ R", expression: "V/R", variables: [["V", "Voltage (V)"], ["R", "Resistance (Ω)"]], unit: "A" },
    { name: "Electrical power", display: "P = VI", expression: "V*I", variables: [["V", "Voltage (V)"], ["I", "Current (A)"]], unit: "W" },
    { name: "Wave speed", display: "v = fλ", expression: "f*w", variables: [["f", "Frequency (Hz)"], ["w", "Wavelength (m)"]], unit: "m s⁻¹" },
    { name: "Body mass index", display: "BMI = m ÷ h²", expression: "mass/h^2", variables: [["mass", "Mass (kg)"], ["h", "Height (m)"]], unit: "kg m⁻²" },
  ];

  const CalculatorData = Object.freeze({
    version: CATALOG_VERSION,
    constants: Object.freeze(CONSTANTS.map(Object.freeze)),
    formulas: Object.freeze(FORMULAS.map((formula) => Object.freeze({
      ...formula,
      variables: Object.freeze(formula.variables.map(Object.freeze)),
    }))),
  });

  if (typeof module !== "undefined" && module.exports) module.exports = CalculatorData;
  globalScope.CalculatorData = CalculatorData;
})(typeof window !== "undefined" ? window : globalThis);
