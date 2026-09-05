(function linearAlgebraTranslations(root) {
  "use strict";

  const en = {
    linearTitle: "Matrix work, without the setup friction.",
    linearIntro: "Choose an operation, paste or type your matrices, and read a structured result. Real matrices up to 6 × 6 are supported.",
    matrixWorkspaceEyebrow: "Matrix workspace",
    matrixWorkspaceTitle: "Choose an operation, then enter the data.",
    matrixExamples: "Examples",
    matrixExampleProduct: "Rectangular product",
    matrixExampleDeterminant: "3 × 3 determinant",
    matrixExampleEigen: "Eigenpairs",
    matrixOperationsAria: "Matrix operation shortcuts",
    matrixAddition: "Add",
    matrixSubtraction: "Subtract",
    matrixMultiplication: "Multiply",
    matrixInverseShort: "Inverse",
    matrixTransposeShort: "Transpose",
    matrixAdjugateShort: "Adjugate",
    matrixEigenShort: "Eigenpairs",
    matrixDeterminantShort: "Determinant",
    matrixInputHint: "One row per line · spaces or commas between values",
    matrixA: "Matrix A",
    matrixB: "Matrix B",
    matrixTemplatesAria: "Matrix templates",
    matrixIdentity: "Identity",
    matrixClear: "Clear",
    matrixSwap: "Swap A and B",
    matrixResultSummary: "Input and result dimensions will appear here.",
    matrixResultScalar: "Scalar",
    matrixResultPairs: "eigenpairs",
    matrixResultError: "Check input",
    matrixErrorGuidance: "Check the matrix values and dimensions, then try again.",
    matrixNote: "Calculations stay in your browser. Eigenpairs support every real 2 × 2 matrix and real symmetric matrices up to 6 × 6.",
  };

  const merge = (values) => ({ ...en, ...values });
  const dictionaries = {
    "en-GB": en,
    "zh-Hant": merge({
      linearTitle: "矩陣計算，省去繁瑣設定。", linearIntro: "選擇運算，貼上或輸入矩陣，即可查看結構清晰的結果；支援最大 6 × 6 實數矩陣。", matrixWorkspaceEyebrow: "矩陣工作空間", matrixWorkspaceTitle: "先選運算，再輸入資料。", matrixExamples: "範例", matrixExampleProduct: "矩形矩陣乘法", matrixExampleDeterminant: "3 × 3 行列式", matrixExampleEigen: "特徵對", matrixOperationsAria: "矩陣運算捷徑", matrixAddition: "相加", matrixSubtraction: "相減", matrixMultiplication: "相乘", matrixInverseShort: "逆矩陣", matrixTransposeShort: "轉置", matrixAdjugateShort: "伴隨", matrixEigenShort: "特徵對", matrixDeterminantShort: "行列式", matrixInputHint: "每行一列 · 數值以空格或逗號分隔", matrixTemplatesAria: "矩陣範本", matrixIdentity: "單位矩陣", matrixClear: "清除", matrixSwap: "交換 A 與 B", matrixResultSummary: "此處會顯示輸入與結果維度。", matrixResultScalar: "純量", matrixResultPairs: "組特徵對", matrixResultError: "檢查輸入", matrixNote: "計算只在瀏覽器內進行。特徵對支援所有實數 2 × 2 矩陣，以及最大 6 × 6 的實對稱矩陣。",
    }),
    "zh-Hans": merge({
      linearTitle: "矩阵计算，省去繁琐设置。", linearIntro: "选择运算，粘贴或输入矩阵，即可查看结构清晰的结果；支持最大 6 × 6 实数矩阵。", matrixWorkspaceEyebrow: "矩阵工作区", matrixWorkspaceTitle: "先选运算，再输入数据。", matrixExamples: "示例", matrixExampleProduct: "矩形矩阵乘法", matrixExampleDeterminant: "3 × 3 行列式", matrixExampleEigen: "特征对", matrixOperationsAria: "矩阵运算快捷方式", matrixAddition: "相加", matrixSubtraction: "相减", matrixMultiplication: "相乘", matrixInverseShort: "逆矩阵", matrixTransposeShort: "转置", matrixAdjugateShort: "伴随", matrixEigenShort: "特征对", matrixDeterminantShort: "行列式", matrixInputHint: "每行一行 · 数值以空格或逗号分隔", matrixTemplatesAria: "矩阵模板", matrixIdentity: "单位矩阵", matrixClear: "清除", matrixSwap: "交换 A 与 B", matrixResultSummary: "此处会显示输入与结果维度。", matrixResultScalar: "标量", matrixResultPairs: "组特征对", matrixResultError: "检查输入", matrixNote: "计算只在浏览器内进行。特征对支持所有实数 2 × 2 矩阵，以及最大 6 × 6 的实对称矩阵。",
    }),
    ja: merge({
      linearTitle: "設定に迷わない行列計算。", linearIntro: "演算を選び、行列を貼り付けるか入力すると、整理された結果を確認できます。実数行列は最大6×6。", matrixWorkspaceEyebrow: "行列ワークスペース", matrixWorkspaceTitle: "演算を選び、データを入力。", matrixExamples: "例", matrixExampleProduct: "長方形行列の積", matrixExampleDeterminant: "3×3 行列式", matrixExampleEigen: "固有対", matrixOperationsAria: "行列演算ショートカット", matrixAddition: "加算", matrixSubtraction: "減算", matrixMultiplication: "乗算", matrixInverseShort: "逆行列", matrixTransposeShort: "転置", matrixAdjugateShort: "随伴", matrixEigenShort: "固有対", matrixDeterminantShort: "行列式", matrixInputHint: "1行に1行分 · 値は空白またはコンマで区切る", matrixTemplatesAria: "行列テンプレート", matrixIdentity: "単位行列", matrixClear: "消去", matrixSwap: "AとBを交換", matrixResultSummary: "入力と結果の次元をここに表示します。", matrixResultScalar: "スカラー", matrixResultPairs: "個の固有対", matrixResultError: "入力を確認", matrixNote: "計算はブラウザー内だけで行われます。固有対は実数2×2行列と最大6×6の実対称行列に対応します。",
    }),
    ko: merge({
      linearTitle: "설정 부담 없는 행렬 계산.", linearIntro: "연산을 고르고 행렬을 붙여 넣거나 입력하면 구조화된 결과를 확인할 수 있습니다. 최대 6×6 실수 행렬 지원.", matrixWorkspaceEyebrow: "행렬 작업 공간", matrixWorkspaceTitle: "연산을 고른 뒤 데이터를 입력하세요.", matrixExamples: "예제", matrixExampleProduct: "직사각 행렬 곱", matrixExampleDeterminant: "3×3 행렬식", matrixExampleEigen: "고유쌍", matrixOperationsAria: "행렬 연산 바로가기", matrixAddition: "더하기", matrixSubtraction: "빼기", matrixMultiplication: "곱하기", matrixInverseShort: "역행렬", matrixTransposeShort: "전치", matrixAdjugateShort: "수반", matrixEigenShort: "고유쌍", matrixDeterminantShort: "행렬식", matrixInputHint: "한 줄에 한 행 · 값은 공백이나 쉼표로 구분", matrixTemplatesAria: "행렬 템플릿", matrixIdentity: "단위행렬", matrixClear: "지우기", matrixSwap: "A와 B 교환", matrixResultSummary: "입력과 결과 차원이 여기에 표시됩니다.", matrixResultScalar: "스칼라", matrixResultPairs: "개 고유쌍", matrixResultError: "입력 확인", matrixNote: "계산은 브라우저 안에서만 처리됩니다. 고유쌍은 모든 실수 2×2 및 최대 6×6 실대칭 행렬을 지원합니다.",
    }),
    ms: merge({
      linearTitle: "Kerja matriks tanpa persediaan rumit.", linearIntro: "Pilih operasi, tampal atau taip matriks, kemudian baca hasil berstruktur. Matriks nyata hingga 6 × 6.", matrixWorkspaceEyebrow: "Ruang kerja matriks", matrixWorkspaceTitle: "Pilih operasi, kemudian masukkan data.", matrixExamples: "Contoh", matrixExampleProduct: "Darab matriks segi empat", matrixExampleDeterminant: "Penentu 3 × 3", matrixExampleEigen: "Pasangan eigen", matrixOperationsAria: "Pintasan operasi matriks", matrixAddition: "Tambah", matrixSubtraction: "Tolak", matrixMultiplication: "Darab", matrixInverseShort: "Songsang", matrixTransposeShort: "Transpose", matrixAdjugateShort: "Adjugat", matrixEigenShort: "Pasangan eigen", matrixDeterminantShort: "Penentu", matrixInputHint: "Satu baris setiap baris teks · pisahkan nilai dengan ruang atau koma", matrixTemplatesAria: "Templat matriks", matrixIdentity: "Identiti", matrixClear: "Kosongkan", matrixSwap: "Tukar A dan B", matrixResultSummary: "Dimensi input dan hasil akan dipaparkan di sini.", matrixResultScalar: "Skalar", matrixResultPairs: "pasangan eigen", matrixResultError: "Semak input", matrixNote: "Pengiraan kekal dalam pelayar. Pasangan eigen menyokong matriks nyata 2 × 2 dan matriks simetri nyata hingga 6 × 6.",
    }),
    fr: merge({
      linearTitle: "Le calcul matriciel, sans réglages superflus.", linearIntro: "Choisissez une opération, collez ou saisissez vos matrices, puis lisez un résultat structuré. Matrices réelles jusqu’à 6 × 6.", matrixWorkspaceEyebrow: "Espace matriciel", matrixWorkspaceTitle: "Choisissez l’opération, puis saisissez les données.", matrixExamples: "Exemples", matrixExampleProduct: "Produit rectangulaire", matrixExampleDeterminant: "Déterminant 3 × 3", matrixExampleEigen: "Paires propres", matrixOperationsAria: "Raccourcis d’opérations matricielles", matrixAddition: "Addition", matrixSubtraction: "Soustraction", matrixMultiplication: "Produit", matrixInverseShort: "Inverse", matrixTransposeShort: "Transposée", matrixAdjugateShort: "Adjointe", matrixEigenShort: "Paires propres", matrixDeterminantShort: "Déterminant", matrixInputHint: "Une rangée par ligne · valeurs séparées par espaces ou virgules", matrixTemplatesAria: "Modèles de matrices", matrixIdentity: "Identité", matrixClear: "Effacer", matrixSwap: "Permuter A et B", matrixResultSummary: "Les dimensions d’entrée et de résultat apparaîtront ici.", matrixResultScalar: "Scalaire", matrixResultPairs: "paires propres", matrixResultError: "Vérifier la saisie", matrixNote: "Les calculs restent dans le navigateur. Les paires propres couvrent toute matrice réelle 2 × 2 et les matrices symétriques réelles jusqu’à 6 × 6.",
    }),
    de: merge({
      linearTitle: "Matrizen berechnen, ohne unnötige Einrichtung.", linearIntro: "Operation wählen, Matrizen einfügen oder eingeben und ein klar gegliedertes Ergebnis lesen. Reelle Matrizen bis 6 × 6.", matrixWorkspaceEyebrow: "Matrix-Arbeitsbereich", matrixWorkspaceTitle: "Operation wählen, dann Daten eingeben.", matrixExamples: "Beispiele", matrixExampleProduct: "Rechteckiges Produkt", matrixExampleDeterminant: "3 × 3-Determinante", matrixExampleEigen: "Eigenpaare", matrixOperationsAria: "Kurzbefehle für Matrixoperationen", matrixAddition: "Addieren", matrixSubtraction: "Subtrahieren", matrixMultiplication: "Multiplizieren", matrixInverseShort: "Inverse", matrixTransposeShort: "Transponierte", matrixAdjugateShort: "Adjunkte", matrixEigenShort: "Eigenpaare", matrixDeterminantShort: "Determinante", matrixInputHint: "Eine Zeile je Matrixzeile · Werte mit Leerzeichen oder Kommas trennen", matrixTemplatesAria: "Matrixvorlagen", matrixIdentity: "Einheitsmatrix", matrixClear: "Leeren", matrixSwap: "A und B tauschen", matrixResultSummary: "Eingabe- und Ergebnisdimensionen erscheinen hier.", matrixResultScalar: "Skalar", matrixResultPairs: "Eigenpaare", matrixResultError: "Eingabe prüfen", matrixNote: "Die Berechnung bleibt im Browser. Eigenpaare werden für reelle 2 × 2- und reelle symmetrische Matrizen bis 6 × 6 unterstützt.",
    }),
    es: merge({
      linearTitle: "Matrices sin configuraciones innecesarias.", linearIntro: "Elige una operación, pega o escribe las matrices y consulta un resultado estructurado. Matrices reales de hasta 6 × 6.", matrixWorkspaceEyebrow: "Espacio de matrices", matrixWorkspaceTitle: "Elige la operación y después introduce los datos.", matrixExamples: "Ejemplos", matrixExampleProduct: "Producto rectangular", matrixExampleDeterminant: "Determinante 3 × 3", matrixExampleEigen: "Pares propios", matrixOperationsAria: "Atajos de operaciones matriciales", matrixAddition: "Sumar", matrixSubtraction: "Restar", matrixMultiplication: "Multiplicar", matrixInverseShort: "Inversa", matrixTransposeShort: "Transpuesta", matrixAdjugateShort: "Adjunta", matrixEigenShort: "Pares propios", matrixDeterminantShort: "Determinante", matrixInputHint: "Una fila por línea · valores separados por espacios o comas", matrixTemplatesAria: "Plantillas de matrices", matrixIdentity: "Identidad", matrixClear: "Borrar", matrixSwap: "Intercambiar A y B", matrixResultSummary: "Aquí aparecerán las dimensiones de entrada y resultado.", matrixResultScalar: "Escalar", matrixResultPairs: "pares propios", matrixResultError: "Revisar entrada", matrixNote: "Los cálculos permanecen en el navegador. Los pares propios admiten matrices reales 2 × 2 y matrices simétricas reales de hasta 6 × 6.",
    }),
    ar: merge({
      linearTitle: "حساب المصفوفات بلا إعدادات معقدة.", linearIntro: "اختر العملية والصق المصفوفات أو اكتبها ثم اقرأ نتيجة منظّمة. يدعم المصفوفات الحقيقية حتى 6 × 6.", matrixWorkspaceEyebrow: "مساحة المصفوفات", matrixWorkspaceTitle: "اختر العملية ثم أدخل البيانات.", matrixExamples: "أمثلة", matrixExampleProduct: "ضرب مصفوفتين مستطيلتين", matrixExampleDeterminant: "محدد 3 × 3", matrixExampleEigen: "الأزواج الذاتية", matrixOperationsAria: "اختصارات عمليات المصفوفات", matrixAddition: "جمع", matrixSubtraction: "طرح", matrixMultiplication: "ضرب", matrixInverseShort: "المعكوس", matrixTransposeShort: "المنقول", matrixAdjugateShort: "المرافق", matrixEigenShort: "الأزواج الذاتية", matrixDeterminantShort: "المحدد", matrixInputHint: "صف واحد في كل سطر · افصل القيم بمسافات أو فواصل", matrixTemplatesAria: "قوالب المصفوفات", matrixIdentity: "الوحدة", matrixClear: "مسح", matrixSwap: "تبديل A وB", matrixResultSummary: "ستظهر أبعاد المدخلات والنتيجة هنا.", matrixResultScalar: "عدد قياسي", matrixResultPairs: "أزواج ذاتية", matrixResultError: "تحقق من الإدخال", matrixNote: "تبقى الحسابات داخل المتصفح. تدعم الأزواج الذاتية كل مصفوفة حقيقية 2 × 2 والمصفوفات الحقيقية المتناظرة حتى 6 × 6.",
    }),
  };

  const inputDetails = {
    "zh-Hant": { matrixA: "矩陣 A", matrixB: "矩陣 B", matrixInputHint: "每個矩陣橫列各佔一行 · 數值以空格或逗號分隔", matrixErrorGuidance: "請檢查矩陣數值與維度後再試。" },
    "zh-Hans": { matrixA: "矩阵 A", matrixB: "矩阵 B", matrixInputHint: "每个矩阵行各占一行 · 数值以空格或逗号分隔", matrixErrorGuidance: "请检查矩阵数值与维度后重试。" },
    ja: { matrixA: "行列 A", matrixB: "行列 B", matrixErrorGuidance: "行列の値と次元を確認して、もう一度お試しください。" },
    ko: { matrixA: "행렬 A", matrixB: "행렬 B", matrixErrorGuidance: "행렬 값과 차원을 확인한 뒤 다시 시도하세요." },
    ms: { matrixA: "Matriks A", matrixB: "Matriks B", matrixErrorGuidance: "Semak nilai dan dimensi matriks, kemudian cuba lagi." },
    fr: { matrixA: "Matrice A", matrixB: "Matrice B", matrixErrorGuidance: "Vérifiez les valeurs et les dimensions, puis réessayez." },
    de: { matrixA: "Matrix A", matrixB: "Matrix B", matrixErrorGuidance: "Werte und Dimensionen der Matrizen prüfen und erneut versuchen." },
    es: { matrixA: "Matriz A", matrixB: "Matriz B", matrixErrorGuidance: "Revisa los valores y las dimensiones e inténtalo de nuevo." },
    ar: { matrixA: "المصفوفة A", matrixB: "المصفوفة B", matrixErrorGuidance: "تحقق من قيم المصفوفة وأبعادها ثم حاول مرة أخرى." },
  };
  Object.entries(inputDetails).forEach(([language, details]) => Object.assign(dictionaries[language], details));

  root.SciCalLinearTranslations = Object.freeze(dictionaries);
})(window);
