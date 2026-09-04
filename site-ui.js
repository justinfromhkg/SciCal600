(function siteInterface() {
  "use strict";

  const ui = {
    "en-GB": {
      aboutAria: "Open information about this project", aboutButton: "About", zoomControls: "Calculator zoom controls", zoomOut: "Zoom out", zoomIn: "Zoom in", fitButton: "Fit", readyStatus: "Ready", manualButton: "Calculator manual",
      aboutEyebrow: "HKEAA reference model", aboutTitle: "A familiar calculator, rebuilt for the web.", aboutIntro: "A focused study simulator inspired by the fx-50FH II, recreated as a responsive web application.", openCalculator: "Open calculator", referenceModel: "Reference model", modelNotice: "Independent web study simulator · not an official Casio product",
      featureModes: "Six calculation modes", featureFormulas: "23 formulas", featureConstants: "40 constants", examNote: "The physical fx-50FH II is HKEAA-approved. This independent simulator is a learning tool and is not approved for examinations.",
      scopeEyebrow: "Development scope", scopeTitle: "One model. A dependable core.", coreStatus: "Core mode", coreDescription: "Arithmetic, fractions, powers, roots, trigonometry, logarithms, permutation, combination, history and memory.", availableStatus: "Available now", specialistTitle: "Five specialist modes", specialistDescription: "Complex numbers, base-n logic, weighted statistics, seven regression models, and four saved program areas.", projectFooter: "SciCal600 · independent educational project", readManual: "Read the calculator manual",
      manualEyebrow: "Physical + web guide", manualTitle: "fx-50FH II calculator manual", manualIntro: "A practical guide for both the physical fx-50FH II and this web simulator.", manualAudience: "For the physical calculator and web simulator", manualCaveat: "Follow the matching key and mode names on a physical fx-50FH II. Web-only screen controls are identified separately.", returnCalculator: "Return to calculator", manualFooter: "fx-50FH II · SciCal600 learning guide", languageLabel: "Language",
      modeEyebrow: "Calculation mode", chooseMode: "Choose a mode", modeComp: "Computation", modeComplex: "Complex numbers", modeBase: "Base-n & logic", modeSd: "Single-variable stats", modeReg: "Regression", modeProgram: "Four program areas",
      setupEyebrow: "Calculator setup", displayAngle: "Display & angle", angleUnit: "Angle unit", degrees: "Degrees", radians: "Radians", grads: "Grads", numberFormat: "Number format", done: "Done", batteryUnavailable: "Device battery unavailable", batteryLevel: "Device battery {level}%", batteryCharging: "Device battery {level}%, charging",
    },
    "zh-Hant": {
      aboutAria: "開啟本專案資訊", aboutButton: "關於", zoomControls: "計算機縮放控制", zoomOut: "縮小", zoomIn: "放大", fitButton: "適合", readyStatus: "可使用", manualButton: "計算機說明書",
      aboutEyebrow: "HKEAA 參考型號", aboutTitle: "熟悉的計算機，重新打造為 Web 應用。", aboutIntro: "以 fx-50FH II 為靈感的學習模擬器，並針對手機及電腦提供 Responsive Design。", openCalculator: "開啟計算機", referenceModel: "參考型號", modelNotice: "獨立 Web 學習模擬器 · 並非 Casio 官方產品",
      featureModes: "六種 Calculation Mode", featureFormulas: "23 條 Formula", featureConstants: "40 個 Constant", examNote: "實體 fx-50FH II 獲 HKEAA 認可；本獨立模擬器只供學習，並未獲准在考試中使用。",
      scopeEyebrow: "開發範圍", scopeTitle: "一個型號，可靠的 Core。", coreStatus: "核心模式", coreDescription: "支援四則運算、分數、乘方、根式、三角函數、對數、排列組合、History 及 Memory。", availableStatus: "現已提供", specialistTitle: "五種專業模式", specialistDescription: "Complex、Base-n Logic、加權統計、七種 Regression Model，以及四個 Program Area。", projectFooter: "SciCal600 · 獨立教育專案", readManual: "閱讀計算機說明書",
      manualEyebrow: "實體機 + Web 指南", manualTitle: "fx-50FH II 計算機說明書", manualIntro: "同時適用於 fx-50FH II 實體計算機與本 Web Simulator 的實用指南。", manualAudience: "適用於實體計算機及 Web Simulator", manualCaveat: "實體 fx-50FH II 使用者可依照相同的 Key 與 Mode 名稱操作；僅限 Web 的畫面功能會另行標示。", returnCalculator: "返回計算機", manualFooter: "fx-50FH II · SciCal600 學習指南", languageLabel: "語言",
      modeEyebrow: "Calculation Mode", chooseMode: "選擇模式", modeComp: "一般計算", modeComplex: "複數", modeBase: "進制與邏輯", modeSd: "單變量統計", modeReg: "迴歸分析", modeProgram: "四個程式區域",
      setupEyebrow: "Calculator Setup", displayAngle: "顯示及角度", angleUnit: "Angle Unit", degrees: "角度", radians: "弧度", grads: "梯度", numberFormat: "數字格式", done: "完成", batteryUnavailable: "無法讀取裝置電量", batteryLevel: "裝置電量 {level}%", batteryCharging: "裝置電量 {level}%，正在充電",
    },
    "zh-Hans": {
      aboutAria: "打开本项目信息", aboutButton: "关于", zoomControls: "计算器缩放控制", zoomOut: "缩小", zoomIn: "放大", fitButton: "适合", readyStatus: "可使用", manualButton: "计算器说明书",
      aboutEyebrow: "HKEAA 参考型号", aboutTitle: "熟悉的计算器，重新构建为 Web 应用。", aboutIntro: "以 fx-50FH II 为灵感的学习模拟器，并针对手机与电脑提供 Responsive Design。", openCalculator: "打开计算器", referenceModel: "参考型号", modelNotice: "独立 Web 学习模拟器 · 并非 Casio 官方产品",
      featureModes: "六种 Calculation Mode", featureFormulas: "23 条 Formula", featureConstants: "40 个 Constant", examNote: "实体 fx-50FH II 获 HKEAA 认可；本独立模拟器只用于学习，并未获准在考试中使用。",
      scopeEyebrow: "开发范围", scopeTitle: "一个型号，可靠的 Core。", coreStatus: "核心模式", coreDescription: "支持四则运算、分数、乘方、根式、三角函数、对数、排列组合、History 和 Memory。", availableStatus: "现已提供", specialistTitle: "五种专业模式", specialistDescription: "Complex、Base-n Logic、加权统计、七种 Regression Model，以及四个 Program Area。", projectFooter: "SciCal600 · 独立教育项目", readManual: "阅读计算器说明书",
      manualEyebrow: "实体机 + Web 指南", manualTitle: "fx-50FH II 计算器说明书", manualIntro: "同时适用于 fx-50FH II 实体计算器与本 Web Simulator 的实用指南。", manualAudience: "适用于实体计算器及 Web Simulator", manualCaveat: "实体 fx-50FH II 用户可以按照相同的 Key 和 Mode 名称操作；仅限 Web 的画面功能会另行标明。", returnCalculator: "返回计算器", manualFooter: "fx-50FH II · SciCal600 学习指南", languageLabel: "语言",
      modeEyebrow: "Calculation Mode", chooseMode: "选择模式", modeComp: "一般计算", modeComplex: "复数", modeBase: "进制与逻辑", modeSd: "单变量统计", modeReg: "回归分析", modeProgram: "四个程序区域",
      setupEyebrow: "Calculator Setup", displayAngle: "显示和角度", angleUnit: "Angle Unit", degrees: "角度", radians: "弧度", grads: "梯度", numberFormat: "数字格式", done: "完成", batteryUnavailable: "无法读取设备电量", batteryLevel: "设备电量 {level}%", batteryCharging: "设备电量 {level}%，正在充电",
    },
    ja: {
      aboutAria: "このプロジェクトの情報を開く", aboutButton: "概要", zoomControls: "電卓のズーム操作", zoomOut: "縮小", zoomIn: "拡大", fitButton: "全体", readyStatus: "使用可能", manualButton: "電卓マニュアル",
      aboutEyebrow: "HKEAA 参照モデル", aboutTitle: "使い慣れた電卓を、Web向けに再構築。", aboutIntro: "fx-50FH IIに着想を得た、スマートフォンとPC対応の学習用シミュレーターです。", openCalculator: "電卓を開く", referenceModel: "参照モデル", modelNotice: "独立したWeb学習シミュレーター · Casio公式製品ではありません",
      featureModes: "6つの計算モード", featureFormulas: "23の公式", featureConstants: "40の科学定数", examNote: "実機のfx-50FH IIはHKEAA認定モデルです。この独立シミュレーターは学習用であり、試験での使用は認められていません。",
      scopeEyebrow: "開発範囲", scopeTitle: "1つのモデル、信頼できるコア。", coreStatus: "基本モード", coreDescription: "四則演算、分数、べき乗、根、三角関数、対数、順列・組合せ、履歴、メモリーに対応。", availableStatus: "利用可能", specialistTitle: "5つの専門モード", specialistDescription: "複素数、基数と論理演算、加重統計、7種類の回帰、4つのプログラム領域。", projectFooter: "SciCal600 · 独立教育プロジェクト", readManual: "電卓マニュアルを読む",
      manualEyebrow: "実機 + Webガイド", manualTitle: "fx-50FH II 電卓マニュアル", manualIntro: "fx-50FH II実機と本Webシミュレーターの両方で使える実用ガイドです。", manualAudience: "実機とWebシミュレーターに対応", manualCaveat: "fx-50FH II実機では同じキー名とモード名に従って操作できます。Web専用の画面機能は別に示します。", returnCalculator: "電卓に戻る", manualFooter: "fx-50FH II · SciCal600 学習ガイド", languageLabel: "言語",
      modeEyebrow: "計算モード", chooseMode: "モードを選択", modeComp: "一般計算", modeComplex: "複素数", modeBase: "基数・論理", modeSd: "1変数統計", modeReg: "回帰", modeProgram: "4つのプログラム領域",
      setupEyebrow: "電卓設定", displayAngle: "表示と角度", angleUnit: "角度単位", degrees: "度", radians: "ラジアン", grads: "グラード", numberFormat: "数値形式", done: "完了", batteryUnavailable: "端末のバッテリー情報を取得できません", batteryLevel: "端末のバッテリー {level}%", batteryCharging: "端末のバッテリー {level}%、充電中",
    },
    ko: {
      aboutAria: "프로젝트 정보 열기", aboutButton: "소개", zoomControls: "계산기 확대/축소", zoomOut: "축소", zoomIn: "확대", fitButton: "맞춤", readyStatus: "사용 가능", manualButton: "계산기 설명서",
      aboutEyebrow: "HKEAA 참조 모델", aboutTitle: "익숙한 계산기를 웹으로 다시 만들었습니다.", aboutIntro: "fx-50FH II에서 영감을 받아 휴대전화와 PC에 맞게 만든 학습용 시뮬레이터입니다.", openCalculator: "계산기 열기", referenceModel: "참조 모델", modelNotice: "독립 Web 학습 시뮬레이터 · Casio 공식 제품이 아닙니다",
      featureModes: "6가지 계산 모드", featureFormulas: "23개 공식", featureConstants: "40개 과학 상수", examNote: "실물 fx-50FH II는 HKEAA 승인 모델입니다. 이 독립 시뮬레이터는 학습용이며 시험 사용 승인을 받지 않았습니다.",
      scopeEyebrow: "개발 범위", scopeTitle: "하나의 모델, 신뢰할 수 있는 코어.", coreStatus: "기본 모드", coreDescription: "사칙연산, 분수, 거듭제곱, 근, 삼각함수, 로그, 순열·조합, 기록 및 메모리를 지원합니다.", availableStatus: "사용 가능", specialistTitle: "5가지 전문 모드", specialistDescription: "복소수, 진법과 논리, 가중 통계, 7가지 회귀 모델, 4개 프로그램 영역.", projectFooter: "SciCal600 · 독립 교육 프로젝트", readManual: "계산기 설명서 읽기",
      manualEyebrow: "실물 + Web 가이드", manualTitle: "fx-50FH II 계산기 설명서", manualIntro: "fx-50FH II 실물 계산기와 이 Web 시뮬레이터에서 함께 사용할 수 있는 실용 가이드입니다.", manualAudience: "실물 계산기 및 Web 시뮬레이터용", manualCaveat: "실물 fx-50FH II에서는 같은 키와 모드 이름을 따라 사용할 수 있습니다. Web 전용 화면 기능은 별도로 표시합니다.", returnCalculator: "계산기로 돌아가기", manualFooter: "fx-50FH II · SciCal600 학습 가이드", languageLabel: "언어",
      modeEyebrow: "계산 모드", chooseMode: "모드 선택", modeComp: "일반 계산", modeComplex: "복소수", modeBase: "진법 및 논리", modeSd: "단일 변수 통계", modeReg: "회귀", modeProgram: "4개 프로그램 영역",
      setupEyebrow: "계산기 설정", displayAngle: "표시 및 각도", angleUnit: "각도 단위", degrees: "도", radians: "라디안", grads: "그라드", numberFormat: "숫자 형식", done: "완료", batteryUnavailable: "기기 배터리 정보를 사용할 수 없음", batteryLevel: "기기 배터리 {level}%", batteryCharging: "기기 배터리 {level}%, 충전 중",
    },
    ms: {
      aboutAria: "Buka maklumat tentang projek ini", aboutButton: "Tentang", zoomControls: "Kawalan zum kalkulator", zoomOut: "Zum keluar", zoomIn: "Zum masuk", fitButton: "Muat", readyStatus: "Sedia", manualButton: "Manual kalkulator",
      aboutEyebrow: "Model rujukan HKEAA", aboutTitle: "Kalkulator yang biasa, dibina semula untuk web.", aboutIntro: "Simulator pembelajaran berasaskan fx-50FH II yang responsif pada telefon dan komputer.", openCalculator: "Buka kalkulator", referenceModel: "Model rujukan", modelNotice: "Simulator pembelajaran Web bebas · bukan produk rasmi Casio",
      featureModes: "Enam mod pengiraan", featureFormulas: "23 formula", featureConstants: "40 pemalar", examNote: "fx-50FH II fizikal diluluskan HKEAA. Simulator bebas ini hanya alat pembelajaran dan tidak diluluskan untuk peperiksaan.",
      scopeEyebrow: "Skop pembangunan", scopeTitle: "Satu model. Teras yang boleh dipercayai.", coreStatus: "Mod teras", coreDescription: "Aritmetik, pecahan, kuasa, punca, trigonometri, logaritma, pilih atur, gabungan, sejarah dan memori.", availableStatus: "Tersedia sekarang", specialistTitle: "Lima mod khusus", specialistDescription: "Nombor kompleks, logik asas-n, statistik berwajaran, tujuh model regresi dan empat ruang program.", projectFooter: "SciCal600 · projek pendidikan bebas", readManual: "Baca manual kalkulator",
      manualEyebrow: "Panduan fizikal + Web", manualTitle: "Manual kalkulator fx-50FH II", manualIntro: "Panduan praktikal untuk kalkulator fizikal fx-50FH II dan simulator Web ini.", manualAudience: "Untuk kalkulator fizikal dan simulator Web", manualCaveat: "Pada fx-50FH II fizikal, ikuti nama kekunci dan mod yang sama. Kawalan skrin khusus Web ditandakan berasingan.", returnCalculator: "Kembali ke kalkulator", manualFooter: "fx-50FH II · panduan pembelajaran SciCal600", languageLabel: "Bahasa",
      modeEyebrow: "Mod pengiraan", chooseMode: "Pilih mod", modeComp: "Pengiraan", modeComplex: "Nombor kompleks", modeBase: "Asas-n dan logik", modeSd: "Statistik satu pemboleh ubah", modeReg: "Regresi", modeProgram: "Empat ruang program",
      setupEyebrow: "Tetapan kalkulator", displayAngle: "Paparan dan sudut", angleUnit: "Unit sudut", degrees: "Darjah", radians: "Radian", grads: "Grad", numberFormat: "Format nombor", done: "Selesai", batteryUnavailable: "Bateri peranti tidak tersedia", batteryLevel: "Bateri peranti {level}%", batteryCharging: "Bateri peranti {level}%, sedang dicas",
    },
  };

  const addedLanguages = {
    ja: {
      webMode: "Webモード", simulatorMode: "シミュレーターモード", interfaceModeAria: "Webモードとシミュレーターモードを切り替える", aboutEyebrow: "スマート電卓プラットフォーム", aboutTitle: "役立つ数学を、わかりやすく。", aboutIntro: "SciCal600は、スマートフォンとPCで明快かつ信頼できる計算を提供する、拡張可能なスマート電卓プラットフォームです。", platformNow: "現在利用可能", smartCalculator: "スマート電卓", platformNotice: "独立した教育プラットフォーム · モダンWeb向け", featureScientific: "科学計算", featureLinear: "線形代数", featureResponsive: "モバイル優先", platformGoal: "すぐに開けて理解しやすく、精度を保ったまま拡張できる専門計算ツールの共通ホームを目指します。", toolsEyebrow: "計算ツール", toolsTitle: "目的に合うワークスペースを選択。", scientificToolTitle: "科学電卓 fx-50FH II", scientificToolDescription: "6モード、公式、定数、メモリー、履歴、Webワークベンチと実機風入力を備えたレスポンシブシミュレーター。", openScientific: "科学電卓を開く", linearToolTitle: "線形代数", linearToolDescription: "行列の加減乗、逆行列、転置、随伴、固有値、固有ベクトル、行列式を計算します。", openLinear: "線形代数を開く", futureStatus: "今後の拡張", futureToolsTitle: "さらに多くの専門電卓", futureToolsDescription: "方程式、確率、金融、グラフなどのツールを追加できる構造です。", linearEyebrow: "スマート電卓 · 線形代数", linearTitle: "行列計算を、ひとつの明快な画面で。", linearIntro: "1行に1行分を入力し、空白またはコンマで値を区切ります。最大6×6の実行列に対応。", backToTools: "ツールへ戻る", matrixOperation: "演算", matrixInverse: "Aの逆行列", matrixTranspose: "Aの転置", matrixAdjugate: "Aの随伴行列", matrixEigen: "Aの固有値と固有ベクトル", matrixDeterminant: "Aの行列式", calculateMatrix: "計算", matrixResult: "結果", matrixReady: "演算を選んで計算してください。", matrixNote: "実数2×2行列と最大6×6の実対称行列で固有ベクトルを求められます。",
    },
    ko: {
      webMode: "웹 모드", simulatorMode: "시뮬레이터 모드", interfaceModeAria: "웹 모드와 시뮬레이터 모드 전환", aboutEyebrow: "스마트 계산기 플랫폼", aboutTitle: "유용한 수학을 더 쉽게.", aboutIntro: "SciCal600은 휴대전화와 컴퓨터에서 명확하고 신뢰할 수 있는 계산을 제공하는 확장형 스마트 계산기 플랫폼입니다.", platformNow: "현재 제공", smartCalculator: "스마트 계산기", platformNotice: "독립 교육 플랫폼 · 현대 웹용", featureScientific: "과학 계산", featureLinear: "선형대수", featureResponsive: "모바일 우선", platformGoal: "빠르고 이해하기 쉬우며 정확성을 유지하면서 확장되는 전문 계산 도구의 일관된 공간을 목표로 합니다.", toolsEyebrow: "계산 도구", toolsTitle: "알맞은 작업 공간을 선택하세요.", scientificToolTitle: "과학 계산기 fx-50FH II", scientificToolDescription: "6개 모드, 공식, 상수, 메모리, 기록, 웹 작업대와 실물 방식 입력을 갖춘 반응형 시뮬레이터입니다.", openScientific: "과학 계산기 열기", linearToolTitle: "선형대수", linearToolDescription: "행렬 덧셈·뺄셈·곱셈, 역행렬, 전치, 수반, 고윳값, 고유벡터와 행렬식을 계산합니다.", openLinear: "선형대수 열기", futureStatus: "향후 확장", futureToolsTitle: "더 많은 전문 계산기", futureToolsDescription: "방정식, 확률, 금융, 그래프 등 다양한 도구를 추가할 구조입니다.", linearEyebrow: "스마트 계산기 · 선형대수", linearTitle: "행렬 계산을 하나의 명확한 공간에서.", linearIntro: "한 줄에 한 행을 입력하고 값을 공백이나 쉼표로 구분하세요. 최대 6×6 실수 행렬을 지원합니다.", backToTools: "도구로 돌아가기", matrixOperation: "연산", matrixInverse: "A의 역행렬", matrixTranspose: "A의 전치", matrixAdjugate: "A의 수반행렬", matrixEigen: "A의 고윳값과 고유벡터", matrixDeterminant: "A의 행렬식", calculateMatrix: "계산", matrixResult: "결과", matrixReady: "연산을 선택하고 계산하세요.", matrixNote: "모든 실수 2×2 행렬과 최대 6×6 실대칭 행렬의 고유벡터를 지원합니다.",
    },
    ms: {
      webMode: "Mod Web", simulatorMode: "Mod simulator", interfaceModeAria: "Tukar antara mod Web dan simulator", aboutEyebrow: "Platform Kalkulator Pintar", aboutTitle: "Matematik berguna, lebih mudah difahami.", aboutIntro: "SciCal600 ialah platform kalkulator pintar yang berkembang untuk pengiraan jelas dan boleh dipercayai pada telefon dan komputer.", platformNow: "Tersedia hari ini", smartCalculator: "Kalkulator Pintar", platformNotice: "Platform pendidikan bebas · direka untuk Web moden", featureScientific: "Pengiraan saintifik", featureLinear: "Algebra linear", featureResponsive: "Utamakan mudah alih", platformGoal: "Matlamat kami ialah satu tempat konsisten untuk alat khusus yang pantas, mudah difahami dan boleh berkembang tanpa mengorbankan ketepatan.", toolsEyebrow: "Alat pengiraan", toolsTitle: "Pilih ruang kerja yang sesuai.", scientificToolTitle: "Kalkulator saintifik fx-50FH II", scientificToolDescription: "Simulator responsif dengan enam mod, formula, pemalar, memori, sejarah, meja kerja Web dan input gaya fizikal.", openScientific: "Buka kalkulator saintifik", linearToolTitle: "Algebra Linear", linearToolDescription: "Tambah, tolak dan darab matriks; hitung songsang, transpose, adjugat, nilai eigen, vektor eigen dan penentu.", openLinear: "Buka Algebra Linear", futureStatus: "Peluasan masa depan", futureToolsTitle: "Lebih banyak kalkulator khusus", futureToolsDescription: "Struktur platform sedia untuk persamaan, kebarangkalian, kewangan, graf dan alat lain.", linearEyebrow: "Kalkulator Pintar · Algebra Linear", linearTitle: "Pengiraan matriks dalam satu ruang yang jelas.", linearIntro: "Masukkan satu baris setiap baris teks dan pisahkan nilai dengan ruang atau koma. Matriks nyata sehingga 6×6.", backToTools: "Kembali ke alat", matrixOperation: "Operasi", matrixInverse: "Songsang A", matrixTranspose: "Transpose A", matrixAdjugate: "Adjugat A", matrixEigen: "Nilai & vektor eigen A", matrixDeterminant: "Penentu A", calculateMatrix: "Kira", matrixResult: "Hasil", matrixReady: "Pilih operasi dan kira.", matrixNote: "Vektor eigen tersedia untuk matriks nyata 2×2 dan matriks simetri nyata sehingga 6×6.",
    },
    fr: {
      aboutAria: "Ouvrir les informations du projet", aboutButton: "À propos", zoomControls: "Contrôles de zoom", zoomOut: "Réduire", zoomIn: "Agrandir", fitButton: "Ajuster", readyStatus: "Prêt", manualButton: "Manuel de la calculatrice",
      openCalculator: "Ouvrir la calculatrice", availableStatus: "Disponible", projectFooter: "SciCal600 · projet éducatif indépendant", readManual: "Lire le manuel", returnCalculator: "Retour à la calculatrice", languageLabel: "Langue",
      modeEyebrow: "Mode de calcul", chooseMode: "Choisir un mode", modeComp: "Calcul", modeComplex: "Nombres complexes", modeBase: "Bases et logique", modeSd: "Statistiques à une variable", modeReg: "Régression", modeProgram: "Quatre zones de programme",
      setupEyebrow: "Réglages", displayAngle: "Affichage et angle", angleUnit: "Unité d’angle", degrees: "Degrés", radians: "Radians", grads: "Grades", numberFormat: "Format numérique", done: "Terminé", batteryUnavailable: "Batterie indisponible", batteryLevel: "Batterie {level} %", batteryCharging: "Batterie {level} %, en charge",
      manualEyebrow: "Guide physique + Web", manualTitle: "Manuel fx-50FH II", manualIntro: "Guide pratique pour la calculatrice physique et le simulateur Web.", manualAudience: "Pour la calculatrice physique et le simulateur Web", manualCaveat: "Suivez les mêmes noms de touches et de modes ; les contrôles propres au Web sont signalés.", manualFooter: "fx-50FH II · guide SciCal600",
    },
    de: {
      aboutAria: "Projektinformationen öffnen", aboutButton: "Über", zoomControls: "Rechner-Zoom", zoomOut: "Verkleinern", zoomIn: "Vergrößern", fitButton: "Einpassen", readyStatus: "Bereit", manualButton: "Rechnerhandbuch",
      openCalculator: "Rechner öffnen", availableStatus: "Jetzt verfügbar", projectFooter: "SciCal600 · unabhängiges Bildungsprojekt", readManual: "Handbuch lesen", returnCalculator: "Zurück zum Rechner", languageLabel: "Sprache",
      modeEyebrow: "Rechenmodus", chooseMode: "Modus wählen", modeComp: "Berechnung", modeComplex: "Komplexe Zahlen", modeBase: "Zahlensysteme & Logik", modeSd: "Eindimensionale Statistik", modeReg: "Regression", modeProgram: "Vier Programmbereiche",
      setupEyebrow: "Rechnereinstellungen", displayAngle: "Anzeige & Winkel", angleUnit: "Winkeleinheit", degrees: "Grad", radians: "Radiant", grads: "Gon", numberFormat: "Zahlenformat", done: "Fertig", batteryUnavailable: "Geräteakku nicht verfügbar", batteryLevel: "Geräteakku {level} %", batteryCharging: "Geräteakku {level} %, lädt",
      manualEyebrow: "Gerät + Web", manualTitle: "fx-50FH II Handbuch", manualIntro: "Praktischer Leitfaden für den physischen Rechner und den Web-Simulator.", manualAudience: "Für physischen Rechner und Web-Simulator", manualCaveat: "Verwenden Sie dieselben Tasten- und Modusnamen; reine Web-Steuerungen sind gekennzeichnet.", manualFooter: "fx-50FH II · SciCal600 Lernhilfe",
    },
    es: {
      aboutAria: "Abrir información del proyecto", aboutButton: "Acerca de", zoomControls: "Controles de zoom", zoomOut: "Alejar", zoomIn: "Acercar", fitButton: "Ajustar", readyStatus: "Listo", manualButton: "Manual de la calculadora",
      openCalculator: "Abrir calculadora", availableStatus: "Disponible", projectFooter: "SciCal600 · proyecto educativo independiente", readManual: "Leer el manual", returnCalculator: "Volver a la calculadora", languageLabel: "Idioma",
      modeEyebrow: "Modo de cálculo", chooseMode: "Elegir un modo", modeComp: "Cálculo", modeComplex: "Números complejos", modeBase: "Bases y lógica", modeSd: "Estadística de una variable", modeReg: "Regresión", modeProgram: "Cuatro áreas de programa",
      setupEyebrow: "Configuración", displayAngle: "Pantalla y ángulo", angleUnit: "Unidad angular", degrees: "Grados", radians: "Radianes", grads: "Gradianes", numberFormat: "Formato numérico", done: "Listo", batteryUnavailable: "Batería no disponible", batteryLevel: "Batería {level} %", batteryCharging: "Batería {level} %, cargando",
      manualEyebrow: "Guía física + Web", manualTitle: "Manual de fx-50FH II", manualIntro: "Guía práctica para la calculadora física y el simulador web.", manualAudience: "Para la calculadora física y el simulador web", manualCaveat: "Siga los mismos nombres de teclas y modos; los controles exclusivos de la web están identificados.", manualFooter: "fx-50FH II · guía SciCal600",
    },
    ar: {
      aboutAria: "فتح معلومات المشروع", aboutButton: "حول", zoomControls: "عناصر تكبير الحاسبة", zoomOut: "تصغير", zoomIn: "تكبير", fitButton: "ملاءمة", readyStatus: "جاهز", manualButton: "دليل الحاسبة",
      openCalculator: "فتح الحاسبة", availableStatus: "متاح الآن", projectFooter: "SciCal600 · مشروع تعليمي مستقل", readManual: "قراءة الدليل", returnCalculator: "العودة إلى الحاسبة", languageLabel: "اللغة",
      modeEyebrow: "وضع الحساب", chooseMode: "اختر وضعًا", modeComp: "الحساب", modeComplex: "الأعداد المركبة", modeBase: "الأنظمة والمنطق", modeSd: "إحصاء متغير واحد", modeReg: "الانحدار", modeProgram: "أربع مساحات برامج",
      setupEyebrow: "إعداد الحاسبة", displayAngle: "العرض والزاوية", angleUnit: "وحدة الزاوية", degrees: "درجات", radians: "راديان", grads: "غراد", numberFormat: "تنسيق العدد", done: "تم", batteryUnavailable: "بطارية الجهاز غير متاحة", batteryLevel: "بطارية الجهاز {level}٪", batteryCharging: "بطارية الجهاز {level}٪، قيد الشحن",
      manualEyebrow: "دليل الجهاز والويب", manualTitle: "دليل fx-50FH II", manualIntro: "دليل عملي للحاسبة الفعلية ومحاكي الويب.", manualAudience: "للحاسبة الفعلية ومحاكي الويب", manualCaveat: "اتبع أسماء المفاتيح والأوضاع نفسها؛ عناصر الويب فقط موضحة بشكل منفصل.", manualFooter: "fx-50FH II · دليل SciCal600",
    },
  };

  Object.entries(addedLanguages).forEach(([language, dictionary]) => {
    ui[language] = { ...ui["en-GB"], ...(ui[language] || {}), ...dictionary };
  });

  const platformTranslations = {
    "en-GB": {
      webMode: "Web mode", simulatorMode: "Simulator mode", interfaceModeAria: "Switch between web and simulator interaction modes", aboutEyebrow: "Smart Calculator platform", aboutTitle: "Useful mathematics, made approachable.", aboutIntro: "SciCal600 is a growing smart-calculator platform built for clear, dependable calculations on phones and computers.", platformNow: "Available today", smartCalculator: "Smart Calculator", platformNotice: "Independent educational platform · designed for the modern web", featureScientific: "Scientific calculation", featureLinear: "Linear algebra", featureResponsive: "Mobile first", platformGoal: "Our goal is one consistent home for focused calculation tools: fast to open, easy to understand, and ready to expand without sacrificing accuracy.", toolsEyebrow: "Calculation tools", toolsTitle: "Choose the right workspace.", scientificToolTitle: "Scientific calculator fx-50FH II", scientificToolDescription: "A responsive scientific-calculator simulator with six modes, formulas, constants, memory, history, web workbenches and physical-style input.", openScientific: "Open scientific calculator", linearToolTitle: "Linear Algebra", linearToolDescription: "Add, subtract and multiply matrices; calculate inverses, transposes, adjugates, eigenvalues, eigenvectors and determinants.", openLinear: "Open Linear Algebra", futureStatus: "Future expansion", futureToolsTitle: "More focused calculators", futureToolsDescription: "The platform structure is ready for equation solving, probability, finance, graphing and other purpose-built mathematical tools.", linearEyebrow: "Smart Calculator · Linear Algebra", linearTitle: "Matrix calculations, in one clear workspace.", linearIntro: "Enter rows on separate lines and values with spaces or commas. Real matrices up to 6 × 6 are supported.", backToTools: "Back to tools", matrixOperation: "Operation", matrixAdd: "A + B", matrixSubtract: "A − B", matrixMultiply: "A × B", matrixInverse: "Inverse of A", matrixTranspose: "Transpose of A", matrixAdjugate: "Adjugate of A", matrixEigen: "Eigenvalues & eigenvectors of A", matrixDeterminant: "Determinant of A", calculateMatrix: "Calculate", matrixResult: "Result", matrixReady: "Choose an operation and calculate.", matrixNote: "Eigenvectors are available for all real 2 × 2 matrices and for real symmetric matrices up to 6 × 6. Complex 2 × 2 eigenpairs are displayed symbolically.",
    },
    "zh-Hant": {
      webMode: "網頁模式", simulatorMode: "模擬模式", interfaceModeAria: "切換網頁模式與模擬模式", aboutEyebrow: "智能計算器平台", aboutTitle: "讓實用數學更易理解。", aboutIntro: "SciCal600 是持續擴展的智能計算器平台，為手機及電腦提供清晰、可靠的計算工具。", platformNow: "現已提供", smartCalculator: "智能計算器", platformNotice: "獨立教育平台 · 為現代 Web 設計", featureScientific: "科學計算", featureLinear: "線性代數", featureResponsive: "手機優先", platformGoal: "我們希望建立一致的專門計算工具入口：快速開啟、容易理解，並在不犧牲準確度下持續擴展。", toolsEyebrow: "計算工具", toolsTitle: "選擇合適的工作空間。", scientificToolTitle: "科學計算器 fx-50FH II", scientificToolDescription: "具六種模式、公式、常數、記憶、歷史、網頁工作台及實體式輸入的響應式科學計算器。", openScientific: "開啟科學計算器", linearToolTitle: "線性代數", linearToolDescription: "矩陣加減乘、逆矩陣、轉置矩陣、伴隨矩陣、特徵值、特徵向量及行列式。", openLinear: "開啟線性代數", futureStatus: "未來擴展", futureToolsTitle: "更多專門計算器", futureToolsDescription: "平台已為方程、概率、金融、繪圖及更多數學工具預留結構。", linearEyebrow: "智能計算器 · 線性代數", linearTitle: "在同一個清晰空間完成矩陣計算。", linearIntro: "每行輸入一列，以空格或逗號分隔數值；支援最大 6 × 6 實數矩陣。", backToTools: "返回工具", matrixOperation: "運算", matrixInverse: "A 的逆矩陣", matrixTranspose: "A 的轉置矩陣", matrixAdjugate: "A 的伴隨矩陣", matrixEigen: "A 的特徵值與特徵向量", matrixDeterminant: "A 的行列式", calculateMatrix: "計算", matrixResult: "結果", matrixReady: "選擇運算後開始計算。", matrixNote: "所有實數 2 × 2 矩陣及最大 6 × 6 的實對稱矩陣均可求特徵向量；複數 2 × 2 特徵對以符號顯示。",
    },
    "zh-Hans": {
      webMode: "网页模式", simulatorMode: "模拟模式", interfaceModeAria: "切换网页模式和模拟模式", aboutEyebrow: "智能计算器平台", aboutTitle: "让实用数学更易理解。", aboutIntro: "SciCal600 是持续扩展的智能计算器平台，为手机和电脑提供清晰、可靠的计算工具。", platformNow: "现已提供", smartCalculator: "智能计算器", platformNotice: "独立教育平台 · 为现代 Web 设计", featureScientific: "科学计算", featureLinear: "线性代数", featureResponsive: "移动优先", platformGoal: "我们的目标是建立统一的专用计算工具入口：快速打开、易于理解，并在不牺牲准确度的情况下持续扩展。", toolsEyebrow: "计算工具", toolsTitle: "选择合适的工作空间。", scientificToolTitle: "科学计算器 fx-50FH II", scientificToolDescription: "具备六种模式、公式、常数、记忆、历史、网页工作台和实体式输入的响应式科学计算器。", openScientific: "打开科学计算器", linearToolTitle: "线性代数", linearToolDescription: "矩阵加减乘、逆矩阵、转置矩阵、伴随矩阵、特征值、特征向量和行列式。", openLinear: "打开线性代数", futureStatus: "未来扩展", futureToolsTitle: "更多专用计算器", futureToolsDescription: "平台已为方程、概率、金融、绘图和更多数学工具预留结构。", linearEyebrow: "智能计算器 · 线性代数", linearTitle: "在一个清晰空间完成矩阵计算。", linearIntro: "每行输入一行，以空格或逗号分隔数值；支持最大 6 × 6 实数矩阵。", backToTools: "返回工具", matrixOperation: "运算", matrixInverse: "A 的逆矩阵", matrixTranspose: "A 的转置矩阵", matrixAdjugate: "A 的伴随矩阵", matrixEigen: "A 的特征值和特征向量", matrixDeterminant: "A 的行列式", calculateMatrix: "计算", matrixResult: "结果", matrixReady: "选择运算后开始计算。", matrixNote: "所有实数 2 × 2 矩阵及最大 6 × 6 的实对称矩阵均可求特征向量；复数 2 × 2 特征对以符号显示。",
    },
    fr: {
      webMode: "Mode Web", simulatorMode: "Mode simulateur", interfaceModeAria: "Basculer entre le mode Web et le mode simulateur", aboutEyebrow: "Plateforme Smart Calculator", aboutTitle: "Des mathématiques utiles et accessibles.", aboutIntro: "SciCal600 est une plateforme évolutive de calculateurs intelligents, claire et fiable sur mobile comme sur ordinateur.", platformNow: "Disponible aujourd’hui", smartCalculator: "Smart Calculator", platformNotice: "Plateforme éducative indépendante · conçue pour le Web moderne", featureScientific: "Calcul scientifique", featureLinear: "Algèbre linéaire", featureResponsive: "Priorité au mobile", platformGoal: "Notre objectif : réunir des outils spécialisés, rapides à ouvrir, faciles à comprendre et extensibles sans sacrifier la précision.", toolsEyebrow: "Outils de calcul", toolsTitle: "Choisissez le bon espace.", scientificToolTitle: "Calculatrice scientifique fx-50FH II", scientificToolDescription: "Simulateur adaptatif avec six modes, formules, constantes, mémoire, historique et saisie physique.", openScientific: "Ouvrir la calculatrice scientifique", linearToolTitle: "Algèbre linéaire", linearToolDescription: "Addition, soustraction, produit, inverse, transposée, adjointe, valeurs propres, vecteurs propres et déterminant.", openLinear: "Ouvrir l’algèbre linéaire", futureStatus: "Évolutions futures", futureToolsTitle: "D’autres calculateurs spécialisés", futureToolsDescription: "La plateforme est prête pour les équations, probabilités, finances, graphiques et d’autres outils.", linearEyebrow: "Smart Calculator · Algèbre linéaire", linearTitle: "Tous les calculs matriciels dans un espace clair.", linearIntro: "Une ligne par rangée, valeurs séparées par des espaces ou virgules. Matrices réelles jusqu’à 6 × 6.", backToTools: "Retour aux outils", matrixOperation: "Opération", matrixInverse: "Inverse de A", matrixTranspose: "Transposée de A", matrixAdjugate: "Adjointe de A", matrixEigen: "Valeurs et vecteurs propres de A", matrixDeterminant: "Déterminant de A", calculateMatrix: "Calculer", matrixResult: "Résultat", matrixReady: "Choisissez une opération puis calculez.", matrixNote: "Les vecteurs propres sont disponibles pour les matrices réelles 2 × 2 et les matrices symétriques réelles jusqu’à 6 × 6.",
    },
    de: {
      webMode: "Webmodus", simulatorMode: "Simulatormodus", interfaceModeAria: "Zwischen Web- und Simulatormodus wechseln", aboutEyebrow: "Smart-Calculator-Plattform", aboutTitle: "Nützliche Mathematik, verständlich gemacht.", aboutIntro: "SciCal600 ist eine wachsende Plattform für klare, zuverlässige Berechnungen auf Smartphone und Computer.", platformNow: "Heute verfügbar", smartCalculator: "Smart Calculator", platformNotice: "Unabhängige Lernplattform · für das moderne Web", featureScientific: "Wissenschaftliches Rechnen", featureLinear: "Lineare Algebra", featureResponsive: "Mobile zuerst", platformGoal: "Unser Ziel ist ein einheitlicher Ort für spezialisierte Werkzeuge: schnell, verständlich und präzise erweiterbar.", toolsEyebrow: "Rechenwerkzeuge", toolsTitle: "Den passenden Arbeitsbereich wählen.", scientificToolTitle: "Wissenschaftlicher Rechner fx-50FH II", scientificToolDescription: "Responsiver Simulator mit sechs Modi, Formeln, Konstanten, Speicher, Verlauf und physischer Eingabe.", openScientific: "Wissenschaftlichen Rechner öffnen", linearToolTitle: "Lineare Algebra", linearToolDescription: "Matrizen addieren, subtrahieren und multiplizieren sowie Inverse, Transponierte, Adjunkte, Eigenwerte, Eigenvektoren und Determinanten berechnen.", openLinear: "Lineare Algebra öffnen", futureStatus: "Künftige Erweiterung", futureToolsTitle: "Weitere spezialisierte Rechner", futureToolsDescription: "Die Plattform ist für Gleichungen, Wahrscheinlichkeit, Finanzen, Graphen und weitere Werkzeuge vorbereitet.", linearEyebrow: "Smart Calculator · Lineare Algebra", linearTitle: "Matrizen übersichtlich berechnen.", linearIntro: "Eine Zeile pro Matrixzeile; Werte mit Leerzeichen oder Kommas trennen. Reelle Matrizen bis 6 × 6.", backToTools: "Zurück zu den Werkzeugen", matrixOperation: "Operation", matrixInverse: "Inverse von A", matrixTranspose: "Transponierte von A", matrixAdjugate: "Adjunkte von A", matrixEigen: "Eigenwerte & Eigenvektoren von A", matrixDeterminant: "Determinante von A", calculateMatrix: "Berechnen", matrixResult: "Ergebnis", matrixReady: "Operation wählen und berechnen.", matrixNote: "Eigenvektoren sind für reelle 2 × 2-Matrizen und reelle symmetrische Matrizen bis 6 × 6 verfügbar.",
    },
    es: {
      webMode: "Modo web", simulatorMode: "Modo simulador", interfaceModeAria: "Cambiar entre los modos web y simulador", aboutEyebrow: "Plataforma Smart Calculator", aboutTitle: "Matemáticas útiles y accesibles.", aboutIntro: "SciCal600 es una plataforma de calculadoras inteligentes, clara y fiable en móviles y ordenadores.", platformNow: "Disponible hoy", smartCalculator: "Smart Calculator", platformNotice: "Plataforma educativa independiente · diseñada para la web moderna", featureScientific: "Cálculo científico", featureLinear: "Álgebra lineal", featureResponsive: "Prioridad móvil", platformGoal: "Nuestro objetivo es reunir herramientas especializadas, rápidas, comprensibles y ampliables sin perder precisión.", toolsEyebrow: "Herramientas de cálculo", toolsTitle: "Elige el espacio adecuado.", scientificToolTitle: "Calculadora científica fx-50FH II", scientificToolDescription: "Simulador adaptable con seis modos, fórmulas, constantes, memoria, historial y entrada física.", openScientific: "Abrir calculadora científica", linearToolTitle: "Álgebra lineal", linearToolDescription: "Suma, resta, multiplicación, inversa, transpuesta, adjunta, valores propios, vectores propios y determinante.", openLinear: "Abrir Álgebra Lineal", futureStatus: "Expansión futura", futureToolsTitle: "Más calculadoras especializadas", futureToolsDescription: "La plataforma está preparada para ecuaciones, probabilidad, finanzas, gráficos y otras herramientas.", linearEyebrow: "Smart Calculator · Álgebra lineal", linearTitle: "Cálculos matriciales en un espacio claro.", linearIntro: "Una fila por línea y valores separados por espacios o comas. Matrices reales de hasta 6 × 6.", backToTools: "Volver a herramientas", matrixOperation: "Operación", matrixInverse: "Inversa de A", matrixTranspose: "Transpuesta de A", matrixAdjugate: "Adjunta de A", matrixEigen: "Valores y vectores propios de A", matrixDeterminant: "Determinante de A", calculateMatrix: "Calcular", matrixResult: "Resultado", matrixReady: "Elige una operación y calcula.", matrixNote: "Los vectores propios están disponibles para matrices reales 2 × 2 y matrices simétricas reales de hasta 6 × 6.",
    },
    ar: {
      webMode: "وضع الويب", simulatorMode: "وضع المحاكاة", interfaceModeAria: "التبديل بين وضع الويب ووضع المحاكاة", aboutEyebrow: "منصة الحاسبة الذكية", aboutTitle: "رياضيات مفيدة بطريقة واضحة.", aboutIntro: "SciCal600 منصة متنامية للحاسبات الذكية توفر حسابات واضحة وموثوقة على الهاتف والحاسوب.", platformNow: "متاح اليوم", smartCalculator: "الحاسبة الذكية", platformNotice: "منصة تعليمية مستقلة · مصممة للويب الحديث", featureScientific: "الحساب العلمي", featureLinear: "الجبر الخطي", featureResponsive: "الهاتف أولًا", platformGoal: "هدفنا مكان موحّد لأدوات حساب متخصصة: سريعة وسهلة الفهم وقابلة للتوسع مع الحفاظ على الدقة.", toolsEyebrow: "أدوات الحساب", toolsTitle: "اختر مساحة العمل المناسبة.", scientificToolTitle: "الحاسبة العلمية fx-50FH II", scientificToolDescription: "محاكي متجاوب بستة أوضاع وصيغ وثوابت وذاكرة وسجل وإدخال يحاكي الجهاز.", openScientific: "فتح الحاسبة العلمية", linearToolTitle: "الجبر الخطي", linearToolDescription: "جمع المصفوفات وطرحها وضربها وحساب المعكوس والمنقول والمرافق والقيم والمتجهات الذاتية والمحدد.", openLinear: "فتح الجبر الخطي", futureStatus: "توسعات مستقبلية", futureToolsTitle: "حاسبات متخصصة إضافية", futureToolsDescription: "المنصة جاهزة للمعادلات والاحتمالات والتمويل والرسوم وأدوات رياضية أخرى.", linearEyebrow: "الحاسبة الذكية · الجبر الخطي", linearTitle: "حسابات المصفوفات في مساحة واضحة.", linearIntro: "أدخل كل صف في سطر وافصل القيم بمسافات أو فواصل. مصفوفات حقيقية حتى 6 × 6.", backToTools: "العودة إلى الأدوات", matrixOperation: "العملية", matrixInverse: "معكوس A", matrixTranspose: "منقول A", matrixAdjugate: "مرافق A", matrixEigen: "القيم والمتجهات الذاتية لـ A", matrixDeterminant: "محدد A", calculateMatrix: "احسب", matrixResult: "النتيجة", matrixReady: "اختر عملية ثم احسب.", matrixNote: "تتوفر المتجهات الذاتية لكل مصفوفة حقيقية 2 × 2 وللمصفوفات الحقيقية المتناظرة حتى 6 × 6.",
    },
  };

  Object.entries(platformTranslations).forEach(([language, dictionary]) => {
    Object.assign(ui[language], dictionary);
  });

  const manuals = {
    "en-GB": [
      ["Quick start", ["Press MODE and choose COMP for ordinary scientific calculations.", "Enter an expression with the keypad, then press EXE. Use DEL to remove one character and AC to clear the current entry.", "SHIFT selects the orange label above a key; ALPHA selects the red letter or symbol."]],
      ["Display and replay", ["The upper line shows the expression and cursor; the lower line shows the result.", "Use ◀ and ▶ to edit. Use ▲ and ▼ to recall earlier calculations.", "SHIFT + MODE opens angle and number-format settings."]],
      ["COMP · Computation", ["Use this mode for arithmetic, fractions, powers, roots, logarithms, trigonometry, nPr and nCr.", "Example: enter sin(30), select DEG, then press EXE to obtain 0.5.", "Ans inserts the previous answer. RCL recalls memory M; SHIFT + RCL stores the current value."]],
      ["CMPLX · Complex", ["Enter i with ALPHA + ENG, or use the shortcuts in the Complex workbench.", "Both a+bi and polar r∠θ input are supported. Angle results follow DEG, RAD or GRAD.", "Use Conjg for conjugate, arg for argument, and SHIFT + EXE to alternate real and imaginary parts."]],
      ["BASE · Number bases", ["Choose BIN, OCT, DEC or HEX in the Base workbench.", "Use integer arithmetic and the 32-bit logical operators AND, OR, XOR, NOT and NEG.", "Digits A–F are available for hexadecimal input. Negative non-decimal results use two's-complement display."]],
      ["SD · Statistics", ["Add each x value and its optional frequency in the workbench.", "The summary provides n, Σx, Σx², mean, population and sample standard deviation, minimum and maximum.", "Delete individual rows or choose Clear data to begin again."]],
      ["REG · Regression", ["Add paired x and y values, with an optional frequency.", "Choose linear, logarithmic, exponential, a·bˣ, power, inverse or quadratic regression.", "Read coefficients a, b, c and r, then enter x in the prediction field to calculate y."]],
      ["PRGM · Programs", ["Four local program areas P1–P4 are saved automatically in this browser.", "Use ?→A to request an input, expression→A for assignment, and a colon or new line between statements.", "Enter prompt values separated by commas and press Run. The combined capacity meter is 680 bytes."]],
      ["Formulas and constants", ["Press FMLA to search 23 interactive study formulas and calculate from their input fields.", "Press SHIFT + 7 to search 40 scientific constants; select one to insert its numeric value.", "These are modern study values and do not claim exact table or rounding parity with every physical revision."]],
      ["Screen controls", ["About at the top opens project information; Calculator manual at the bottom opens this guide.", "The calculator fits the screen automatically. Use − and + to zoom, and Fit to restore automatic sizing.", "Normal calculator view is locked against page swiping. Panning becomes available only when the enlarged calculator exceeds the viewport.", "The battery icon replaces the decorative solar panel and shows this device's percentage and charging state when the browser permits access."]],
    ],
    "zh-Hant": [
      ["快速開始 Quick Start", ["按 MODE 並選擇 COMP，進行一般 Scientific Calculation。", "使用鍵盤輸入算式，再按 EXE。DEL 刪除一個字元；AC 清除目前輸入。", "SHIFT 選擇按鍵上方橙色功能；ALPHA 選擇紅色字母或符號。"]],
      ["顯示與 Replay", ["上行顯示 Expression 及 Cursor；下行顯示 Result。", "使用 ◀、▶ 編輯；使用 ▲、▼ 讀取之前的計算。", "SHIFT + MODE 開啟 Angle Unit 與 Number Format 設定。"]],
      ["COMP · 一般計算", ["適用於四則運算、分數、乘方、根式、Log、三角函數、nPr 與 nCr。", "例：在 DEG 下輸入 sin(30)，按 EXE，結果為 0.5。", "Ans 插入上一個答案；RCL 讀取 Memory M；SHIFT + RCL 儲存目前數值。"]],
      ["CMPLX · 複數", ["使用 ALPHA + ENG 輸入 i，或使用 Complex Workbench 捷徑。", "支援 a+bi 與極座標 r∠θ；角度依照 DEG、RAD 或 GRAD。", "Conjg 求共軛，arg 求幅角；SHIFT + EXE 切換實部與虛部。"]],
      ["BASE · 進制", ["在 Base Workbench 選擇 BIN、OCT、DEC 或 HEX。", "支援整數運算及 32-bit AND、OR、XOR、NOT、NEG Logic。", "HEX 可輸入 A–F；非十進制負數使用 Two's Complement 顯示。"]],
      ["SD · 統計", ["加入每個 x 與可選 Frequency。", "Summary 顯示 n、Σx、Σx²、Mean、母體及樣本 Standard Deviation、最小值與最大值。", "可刪除單行，或使用 Clear Data 重新開始。"]],
      ["REG · 迴歸", ["加入成對 x、y 與可選 Frequency。", "可選 Linear、Logarithmic、Exponential、a·bˣ、Power、Inverse 或 Quadratic Regression。", "查看 a、b、c、r，再輸入 x 預測 y。"]],
      ["PRGM · 程式", ["P1–P4 四個 Program Area 會自動儲存在此瀏覽器。", "?→A 讀取輸入；expression→A 指派數值；冒號或換行分隔 Statement。", "以逗號分隔 Prompt Input，然後按 Run；總容量為 680 bytes。"]],
      ["Formula 與 Constant", ["按 FMLA 搜尋 23 條互動 Formula。", "按 SHIFT + 7 搜尋 40 個 Scientific Constant，點選即可插入數值。", "資料使用現代學習數值，不保證與每個實體版本完全相同。"]],
      ["畫面控制", ["頂部「關於」顯示專案資訊；底部「計算機說明書」進入本指南。", "計算機預設自動適合屏幕；使用 −、+ 縮放，Fit 恢復自動大小。", "正常 Calculator View 鎖定頁面滑動；只有放大超出視窗後才可拖動查看。", "Battery 圖示取代裝飾性 Solar Panel；瀏覽器允許時會顯示本裝置電量及充電狀態。"]],
    ],
    "zh-Hans": [
      ["快速开始 Quick Start", ["按 MODE 并选择 COMP，进行一般 Scientific Calculation。", "使用键盘输入算式，再按 EXE。DEL 删除一个字符；AC 清除当前输入。", "SHIFT 选择按键上方橙色功能；ALPHA 选择红色字母或符号。"]],
      ["显示与 Replay", ["上行显示 Expression 和 Cursor；下行显示 Result。", "使用 ◀、▶ 编辑；使用 ▲、▼ 读取之前的计算。", "SHIFT + MODE 打开 Angle Unit 和 Number Format 设置。"]],
      ["COMP · 一般计算", ["适用于四则运算、分数、乘方、根式、Log、三角函数、nPr 和 nCr。", "示例：在 DEG 下输入 sin(30)，按 EXE，结果为 0.5。", "Ans 插入上一个答案；RCL 读取 Memory M；SHIFT + RCL 保存当前数值。"]],
      ["CMPLX · 复数", ["使用 ALPHA + ENG 输入 i，或使用 Complex Workbench 快捷按钮。", "支持 a+bi 和极坐标 r∠θ；角度依照 DEG、RAD 或 GRAD。", "Conjg 求共轭，arg 求辐角；SHIFT + EXE 切换实部和虚部。"]],
      ["BASE · 进制", ["在 Base Workbench 选择 BIN、OCT、DEC 或 HEX。", "支持整数运算及 32-bit AND、OR、XOR、NOT、NEG Logic。", "HEX 可输入 A–F；非十进制负数使用 Two's Complement 显示。"]],
      ["SD · 统计", ["添加每个 x 及可选 Frequency。", "Summary 显示 n、Σx、Σx²、Mean、总体及样本 Standard Deviation、最小值和最大值。", "可以删除单行，或使用 Clear Data 重新开始。"]],
      ["REG · 回归", ["添加成对 x、y 和可选 Frequency。", "可以选择 Linear、Logarithmic、Exponential、a·bˣ、Power、Inverse 或 Quadratic Regression。", "查看 a、b、c、r，再输入 x 预测 y。"]],
      ["PRGM · 程序", ["P1–P4 四个 Program Area 会自动保存在此浏览器。", "?→A 读取输入；expression→A 指定数值；冒号或换行分隔 Statement。", "用逗号分隔 Prompt Input，然后按 Run；总容量为 680 bytes。"]],
      ["Formula 和 Constant", ["按 FMLA 搜索 23 条交互 Formula。", "按 SHIFT + 7 搜索 40 个 Scientific Constant，点击即可插入数值。", "数据使用现代学习数值，不保证与每个实体版本完全相同。"]],
      ["画面控制", ["顶部“关于”显示项目信息；底部“计算器说明书”进入本指南。", "计算器默认自动适合屏幕；使用 −、+ 缩放，Fit 恢复自动大小。", "正常 Calculator View 锁定页面滑动；只有放大超出视窗后才能拖动查看。", "Battery 图标取代装饰性 Solar Panel；浏览器允许时会显示本设备电量和充电状态。"]],
    ],
    ja: [
      ["クイックスタート", ["MODEを押してCOMPを選ぶと、通常の科学計算を行えます。", "キーで式を入力してEXEを押します。DELは1文字削除、ACは入力を消去します。", "SHIFTはキー上のオレンジ機能、ALPHAは赤い文字・記号を選択します。"]],
      ["表示とリプレイ", ["上段は式とカーソル、下段は結果を表示します。", "◀・▶で編集し、▲・▼で過去の計算を呼び出します。", "SHIFT + MODEで角度単位と数値形式を設定します。"]],
      ["COMP · 一般計算", ["四則演算、分数、べき乗、根、対数、三角関数、nPr、nCrに使用します。", "例：DEGでsin(30)を入力してEXEを押すと0.5です。", "Ansは直前の答え、RCLはメモリーM、SHIFT + RCLは現在値の保存です。"]],
      ["CMPLX · 複素数", ["ALPHA + ENGでiを入力するか、Complexパネルのショートカットを使用します。", "a+biと極形式r∠θを利用でき、角度はDEG・RAD・GRADに従います。", "Conjgは共役、argは偏角、SHIFT + EXEは実部と虚部の切替です。"]],
      ["BASE · 基数", ["BaseパネルでBIN・OCT・DEC・HEXを選びます。", "整数演算と32-bit AND・OR・XOR・NOT・NEGを利用できます。", "16進数ではA–Fを入力でき、負の非10進数は2の補数で表示します。"]],
      ["SD · 統計", ["各xと必要なら度数を追加します。", "n、Σx、Σx²、平均、母・標本標準偏差、最小値、最大値を表示します。", "行ごとの削除またはClear dataで初期化できます。"]],
      ["REG · 回帰", ["x・yの組と必要なら度数を追加します。", "線形、対数、指数、a·bˣ、べき乗、逆数、2次回帰を選べます。", "係数a・b・c・rを確認し、xを入力してyを予測します。"]],
      ["PRGM · プログラム", ["P1–P4はこのブラウザーに自動保存されます。", "?→Aは入力、expression→Aは代入、コロンまたは改行は文の区切りです。", "入力値をカンマで区切りRunを押します。合計容量は680 bytesです。"]],
      ["公式と科学定数", ["FMLAで23の対話式公式を検索できます。", "SHIFT + 7で40の科学定数を検索し、数値を式へ挿入できます。", "学習用の現代値であり、すべての実機版と完全一致するものではありません。"]],
      ["画面操作", ["上部の概要はプロジェクト情報、下部のマニュアルはこのガイドを開きます。", "最初は画面に自動調整されます。−・+で拡大縮小し、Fitで元に戻します。", "通常時はページをスワイプできません。拡大して画面を超えた場合だけ移動できます。", "バッテリー表示は装飾用ソーラーパネルに代わり、ブラウザーが許可すると端末の残量と充電状態を表示します。"]],
    ],
    ko: [
      ["빠른 시작", ["MODE를 누르고 COMP를 선택하면 일반 과학 계산을 할 수 있습니다.", "키패드로 식을 입력하고 EXE를 누릅니다. DEL은 한 글자 삭제, AC는 현재 입력 지우기입니다.", "SHIFT는 주황색 보조 기능, ALPHA는 빨간 문자나 기호를 선택합니다."]],
      ["표시와 다시 보기", ["위 줄에는 식과 커서, 아래 줄에는 결과가 표시됩니다.", "◀·▶로 편집하고 ▲·▼로 이전 계산을 불러옵니다.", "SHIFT + MODE에서 각도 단위와 숫자 형식을 설정합니다."]],
      ["COMP · 일반 계산", ["사칙연산, 분수, 거듭제곱, 근, 로그, 삼각함수, nPr, nCr에 사용합니다.", "예: DEG에서 sin(30)을 입력하고 EXE를 누르면 0.5입니다.", "Ans는 이전 답, RCL은 메모리 M, SHIFT + RCL은 현재 값 저장입니다."]],
      ["CMPLX · 복소수", ["ALPHA + ENG로 i를 입력하거나 Complex 패널의 바로가기를 사용합니다.", "a+bi와 극형식 r∠θ를 지원하며 각도는 DEG·RAD·GRAD 설정을 따릅니다.", "Conjg는 켤레, arg는 편각, SHIFT + EXE는 실수부와 허수부 전환입니다."]],
      ["BASE · 진법", ["Base 패널에서 BIN·OCT·DEC·HEX를 선택합니다.", "정수 계산과 32-bit AND·OR·XOR·NOT·NEG 논리 연산을 지원합니다.", "16진수에는 A–F를 사용하며 음수 비10진수는 2의 보수로 표시됩니다."]],
      ["SD · 통계", ["각 x 값과 필요한 경우 빈도를 추가합니다.", "n, Σx, Σx², 평균, 모집단·표본 표준편차, 최솟값과 최댓값을 제공합니다.", "각 행을 삭제하거나 Clear data로 다시 시작할 수 있습니다."]],
      ["REG · 회귀", ["x와 y 쌍 및 필요한 경우 빈도를 추가합니다.", "선형, 로그, 지수, a·bˣ, 거듭제곱, 역수, 이차 회귀를 선택합니다.", "계수 a·b·c·r을 확인하고 x를 입력해 y를 예측합니다."]],
      ["PRGM · 프로그램", ["P1–P4 네 영역은 이 브라우저에 자동 저장됩니다.", "?→A는 입력, expression→A는 대입, 콜론이나 줄바꿈은 명령 구분입니다.", "입력을 쉼표로 나누어 Run을 누릅니다. 전체 용량은 680 bytes입니다."]],
      ["공식과 과학 상수", ["FMLA에서 23개 대화형 공식을 검색합니다.", "SHIFT + 7에서 40개 과학 상수를 검색하고 값을 식에 넣습니다.", "현대 학습용 값이며 모든 실물 버전과 완전히 같음을 보장하지 않습니다."]],
      ["화면 제어", ["위쪽 소개 버튼은 프로젝트 정보, 아래쪽 설명서 버튼은 이 가이드를 엽니다.", "처음에는 화면에 자동 맞춤됩니다. −·+로 조절하고 Fit으로 복원합니다.", "보통 계산기 화면에서는 스와이프가 잠깁니다. 확대한 계산기가 화면을 넘을 때만 이동할 수 있습니다.", "배터리 아이콘은 장식용 태양광 패널을 대체하며, 브라우저가 허용하면 기기의 잔량과 충전 상태를 표시합니다."]],
    ],
    ms: [
      ["Mula pantas", ["Tekan MODE dan pilih COMP untuk pengiraan saintifik biasa.", "Masukkan ungkapan dan tekan EXE. DEL memadam satu aksara; AC membersihkan input semasa.", "SHIFT memilih fungsi jingga; ALPHA memilih huruf atau simbol merah."]],
      ["Paparan dan replay", ["Baris atas menunjukkan ungkapan dan kursor; baris bawah menunjukkan jawapan.", "Gunakan ◀ dan ▶ untuk mengedit, ▲ dan ▼ untuk memanggil pengiraan lama.", "SHIFT + MODE membuka tetapan unit sudut dan format nombor."]],
      ["COMP · Pengiraan", ["Untuk aritmetik, pecahan, kuasa, punca, logaritma, trigonometri, nPr dan nCr.", "Contoh: dalam DEG, masukkan sin(30) dan tekan EXE untuk mendapat 0.5.", "Ans memasukkan jawapan lalu; RCL memanggil M; SHIFT + RCL menyimpan nilai semasa."]],
      ["CMPLX · Kompleks", ["Masukkan i dengan ALPHA + ENG atau gunakan pintasan panel Complex.", "Bentuk a+bi dan kutub r∠θ disokong; sudut mengikut DEG, RAD atau GRAD.", "Conjg mencari konjugat, arg mencari argumen, SHIFT + EXE menukar bahagian nyata/khayal."]],
      ["BASE · Asas nombor", ["Pilih BIN, OCT, DEC atau HEX dalam panel Base.", "Gunakan aritmetik integer dan operasi logik 32-bit AND, OR, XOR, NOT dan NEG.", "A–F tersedia untuk HEX; hasil negatif bukan perpuluhan menggunakan pelengkap dua."]],
      ["SD · Statistik", ["Tambah setiap nilai x dan kekerapan pilihan.", "Ringkasan memberi n, Σx, Σx², min, sisihan piawai populasi/sampel, minimum dan maksimum.", "Padam baris tertentu atau pilih Clear data untuk bermula semula."]],
      ["REG · Regresi", ["Tambah pasangan x dan y serta kekerapan pilihan.", "Pilih regresi linear, logaritma, eksponen, a·bˣ, kuasa, songsang atau kuadratik.", "Lihat pekali a, b, c dan r, kemudian masukkan x untuk meramal y."]],
      ["PRGM · Program", ["Empat ruang P1–P4 disimpan automatik dalam pelayar ini.", "?→A meminta input, expression→A menetapkan nilai, titik bertindih atau baris baharu memisahkan arahan.", "Masukkan nilai dipisah koma dan tekan Run. Jumlah kapasiti ialah 680 bytes."]],
      ["Formula dan pemalar", ["Tekan FMLA untuk mencari 23 formula interaktif.", "Tekan SHIFT + 7 untuk mencari 40 pemalar saintifik dan memasukkan nilainya.", "Nilai kajian moden ini tidak menjamin padanan tepat dengan setiap versi fizikal."]],
      ["Kawalan skrin", ["Butang Tentang di atas membuka maklumat projek; butang Manual di bawah membuka panduan ini.", "Kalkulator dimuatkan mengikut skrin secara automatik. Gunakan −, + dan Fit untuk saiz.", "Leret dikunci dalam paparan biasa. Gerakan hanya dibenarkan apabila kalkulator yang dibesarkan melebihi skrin.", "Ikon bateri menggantikan panel solar hiasan dan menunjukkan peratus serta status pengecasan apabila dibenarkan oleh pelayar."]],
    ],
    fr: [
      ["Démarrage rapide", ["Appuyez sur MODE et choisissez COMP pour les calculs scientifiques.", "Saisissez une expression puis appuyez sur EXE. DEL efface un caractère et AC efface la saisie.", "SHIFT active les libellés orange et ALPHA les lettres rouges."]],
      ["Affichage et modes", ["La ligne supérieure affiche la saisie, la ligne inférieure le résultat.", "Le mode Web ouvre les établis détaillés ; le mode simulateur utilise uniquement l’écran et les touches.", "SHIFT + MODE ouvre les unités d’angle et le format numérique."]],
      ["COMP · Calcul", ["Arithmétique, fractions, puissances, racines, logarithmes, trigonométrie, nPr et nCr.", "Ans rappelle le résultat précédent et RCL la mémoire M."]],
      ["CMPLX · Complexes", ["Saisissez i avec ALPHA + ENG.", "Les formes a+bi et r∠θ, le conjugué et l’argument sont pris en charge."]],
      ["BASE · Bases", ["Choisissez BIN, OCT, DEC ou HEX dans l’établi Web.", "Le mode simulateur accepte l’arithmétique entière et les chiffres hexadécimaux."]],
      ["SD · Statistiques", ["En simulateur, saisissez x ou x,fréquence puis EXE.", "SHIFT + 1 ou 2 parcourt les résultats ; SHIFT + 9 efface les données."]],
      ["REG · Régression", ["En simulateur, saisissez x,y ou x,y,fréquence puis EXE.", "Les sept modèles et la prédiction restent disponibles dans l’établi Web."]],
      ["PRGM · Programmes", ["P1 à P4 sont enregistrés dans le navigateur.", "En simulateur, Prog change de zone ; saisissez les valeurs séparées par des virgules puis EXE."]],
      ["Formules et constantes", ["FMLA ouvre 23 formules ; SHIFT + 7 ouvre 40 constantes."]],
      ["Navigation", ["La racine présente la plateforme, /scientific-calculator ouvre la calculatrice et /linear-algebra ouvre les matrices."]],
    ],
    de: [
      ["Schnellstart", ["MODE drücken und COMP für wissenschaftliche Rechnungen wählen.", "Ausdruck eingeben und EXE drücken. DEL löscht ein Zeichen, AC die aktuelle Eingabe.", "SHIFT aktiviert orange, ALPHA rote Beschriftungen."]],
      ["Anzeige und Modi", ["Oben steht die Eingabe, unten das Ergebnis.", "Der Webmodus öffnet Arbeitsbereiche; der Simulatormodus nutzt Display und Tasten.", "SHIFT + MODE öffnet Winkel- und Zahlenformat."]],
      ["COMP · Berechnung", ["Arithmetik, Brüche, Potenzen, Wurzeln, Logarithmen, Trigonometrie, nPr und nCr.", "Ans übernimmt das letzte Ergebnis, RCL den Speicher M."]],
      ["CMPLX · Komplex", ["i wird mit ALPHA + ENG eingegeben.", "a+bi, r∠θ, Konjugation und Argument werden unterstützt."]],
      ["BASE · Zahlensysteme", ["BIN, OCT, DEC oder HEX im Web-Arbeitsbereich wählen.", "Der Simulator verarbeitet Ganzzahlarithmetik und Hex-Ziffern."]],
      ["SD · Statistik", ["Im Simulator x oder x,Häufigkeit eingeben und EXE drücken.", "SHIFT + 1/2 blättert Ergebnisse; SHIFT + 9 löscht Daten."]],
      ["REG · Regression", ["Im Simulator x,y oder x,y,Häufigkeit eingeben und EXE drücken.", "Sieben Modelle und Prognosen stehen im Web-Arbeitsbereich bereit."]],
      ["PRGM · Programme", ["P1–P4 werden im Browser gespeichert.", "Prog wechselt den Bereich; Eingaben mit Kommas trennen und EXE drücken."]],
      ["Formeln und Konstanten", ["FMLA öffnet 23 Formeln; SHIFT + 7 öffnet 40 Konstanten."]],
      ["Navigation", ["/ öffnet die Plattform, /scientific-calculator den Rechner und /linear-algebra die Matrizen."]],
    ],
    es: [
      ["Inicio rápido", ["Pulsa MODE y elige COMP para cálculos científicos.", "Introduce una expresión y pulsa EXE. DEL borra un carácter y AC la entrada actual.", "SHIFT activa las etiquetas naranjas y ALPHA las rojas."]],
      ["Pantalla y modos", ["La línea superior muestra la entrada y la inferior el resultado.", "El modo web abre paneles detallados; el simulador usa pantalla y teclas.", "SHIFT + MODE abre unidades angulares y formato numérico."]],
      ["COMP · Cálculo", ["Aritmética, fracciones, potencias, raíces, logaritmos, trigonometría, nPr y nCr.", "Ans recupera el último resultado y RCL la memoria M."]],
      ["CMPLX · Complejos", ["Introduce i con ALPHA + ENG.", "Admite a+bi, r∠θ, conjugado y argumento."]],
      ["BASE · Bases", ["Elige BIN, OCT, DEC o HEX en el panel web.", "El simulador admite aritmética entera y dígitos hexadecimales."]],
      ["SD · Estadística", ["En simulador introduce x o x,frecuencia y pulsa EXE.", "SHIFT + 1/2 recorre resultados; SHIFT + 9 borra los datos."]],
      ["REG · Regresión", ["En simulador introduce x,y o x,y,frecuencia y pulsa EXE.", "Los siete modelos y la predicción siguen disponibles en el panel web."]],
      ["PRGM · Programas", ["P1–P4 se guardan en el navegador.", "Prog cambia de área; separa entradas con comas y pulsa EXE."]],
      ["Fórmulas y constantes", ["FMLA abre 23 fórmulas; SHIFT + 7 abre 40 constantes."]],
      ["Navegación", ["/ abre la plataforma, /scientific-calculator la calculadora y /linear-algebra las matrices."]],
    ],
    ar: [
      ["بدء سريع", ["اضغط MODE واختر COMP للحسابات العلمية.", "أدخل التعبير ثم اضغط EXE. يحذف DEL رمزًا ويمسح AC الإدخال الحالي.", "يفعّل SHIFT العناوين البرتقالية وALPHA الحمراء."]],
      ["الشاشة والأوضاع", ["يعرض السطر العلوي الإدخال والسفلي النتيجة.", "يفتح وضع الويب لوحات مفصلة؛ ويستخدم وضع المحاكاة الشاشة والمفاتيح.", "يفتح SHIFT + MODE إعدادات الزاوية والأرقام."]],
      ["COMP · الحساب", ["الحساب والكسور والقوى والجذور واللوغاريتمات والمثلثات والتباديل والتوافيق.", "يستدعي Ans الجواب السابق وRCL الذاكرة M."]],
      ["CMPLX · المركبة", ["أدخل i بواسطة ALPHA + ENG.", "يدعم a+bi وr∠θ والمرافق والسعة."]],
      ["BASE · الأنظمة", ["اختر BIN أو OCT أو DEC أو HEX في لوحة الويب.", "يدعم المحاكي حساب الأعداد الصحيحة وأرقام النظام الست عشري."]],
      ["SD · الإحصاء", ["في المحاكي أدخل x أو x,التكرار ثم EXE.", "يعرض SHIFT + 1/2 النتائج ويمسح SHIFT + 9 البيانات."]],
      ["REG · الانحدار", ["أدخل x,y أو x,y,التكرار ثم EXE.", "تتوفر النماذج السبعة والتنبؤ في لوحة الويب."]],
      ["PRGM · البرامج", ["تُحفظ P1–P4 في المتصفح.", "يبدّل Prog المنطقة؛ افصل المدخلات بفواصل ثم اضغط EXE."]],
      ["الصيغ والثوابت", ["يفتح FMLA ‏23 صيغة؛ ويفتح SHIFT + 7 ‏40 ثابتًا."]],
      ["التنقل", ["يفتح / المنصة و/scientific-calculator الحاسبة و/linear-algebra المصفوفات."]],
    ],
  };

  const languageSelect = document.querySelector("#language-select");
  const viewport = document.querySelector("#calculator-viewport");
  const space = document.querySelector("#calculator-space");
  const canvas = document.querySelector("#calculator-canvas");
  const zoomLevel = document.querySelector("#zoom-level");
  const batteryIndicator = document.querySelector("#device-battery");
  const batteryFill = document.querySelector("#battery-fill");
  const batteryText = document.querySelector("#battery-text");
  const views = [...document.querySelectorAll("[data-view-panel]")];
  const allowedViews = new Set(["calculator", "about", "manual", "linear-algebra"]);
  let zoomFactor = 1;
  let currentView = "about";
  let batteryState = { available: false, charging: false, level: null };

  function readSavedLanguage() {
    try {
      return window.localStorage.getItem("scical600.language");
    } catch (_error) {
      return null;
    }
  }

  function saveLanguage(language) {
    try {
      window.localStorage.setItem("scical600.language", language);
    } catch (_error) {
      // Language selection still works for the current session when storage is unavailable.
    }
  }

  function renderBattery() {
    const language = ui[document.documentElement.lang] ? document.documentElement.lang : "en-GB";
    const dictionary = ui[language];
    const level = batteryState.available ? Math.round(Math.max(0, Math.min(1, batteryState.level)) * 100) : null;
    batteryIndicator.classList.toggle("is-unavailable", !batteryState.available);
    batteryIndicator.classList.toggle("is-charging", batteryState.available && batteryState.charging);
    batteryIndicator.classList.toggle("is-low", batteryState.available && !batteryState.charging && level <= 20);

    if (level === null) {
      batteryFill.style.width = "0%";
      batteryText.textContent = "--";
      batteryIndicator.setAttribute("aria-label", dictionary.batteryUnavailable);
      batteryIndicator.title = dictionary.batteryUnavailable;
      return;
    }

    batteryFill.style.width = `${level}%`;
    batteryText.textContent = `${level}%`;
    const label = (batteryState.charging ? dictionary.batteryCharging : dictionary.batteryLevel).replace("{level}", String(level));
    batteryIndicator.setAttribute("aria-label", label);
    batteryIndicator.title = label;
  }

  async function setupBattery() {
    if (typeof navigator.getBattery !== "function") {
      renderBattery();
      return;
    }

    try {
      const battery = await navigator.getBattery();
      const update = () => {
        batteryState = { available: true, charging: Boolean(battery.charging), level: Number(battery.level) };
        renderBattery();
      };
      update();
      battery.addEventListener("levelchange", update);
      battery.addEventListener("chargingchange", update);
    } catch (_error) {
      batteryState = { available: false, charging: false, level: null };
      renderBattery();
    }
  }

  function detectedLanguage() {
    const saved = readSavedLanguage();
    if (saved && ui[saved]) return saved;
    for (const rawLanguage of navigator.languages || [navigator.language]) {
      const language = String(rawLanguage || "").toLowerCase();
      if (language.startsWith("zh-tw") || language.startsWith("zh-hk") || language.startsWith("zh-mo") || language.includes("hant")) return "zh-Hant";
      if (language.startsWith("zh") || language.includes("hans")) return "zh-Hans";
      if (language.startsWith("ja")) return "ja";
      if (language.startsWith("ko")) return "ko";
      if (language.startsWith("ms")) return "ms";
      if (language.startsWith("fr")) return "fr";
      if (language.startsWith("de")) return "de";
      if (language.startsWith("es")) return "es";
      if (language.startsWith("ar")) return "ar";
      if (language.startsWith("en")) return "en-GB";
    }
    return "en-GB";
  }

  function renderManual(language) {
    const sections = manuals[language] || manuals["en-GB"];
    const index = document.querySelector("#manual-index");
    const content = document.querySelector("#manual-content");
    index.replaceChildren();
    content.replaceChildren();

    sections.forEach(([title, items], position) => {
      const id = `manual-${position + 1}`;
      const link = document.createElement("a");
      link.href = `#${id}`;
      link.textContent = `${String(position + 1).padStart(2, "0")} · ${title}`;
      link.addEventListener("click", (event) => {
        event.preventDefault();
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
      index.append(link);

      const section = document.createElement("article");
      section.className = `manual-section${position === 0 || position === sections.length - 1 ? " manual-section--wide" : ""}`;
      section.id = id;
      const number = document.createElement("span");
      number.className = "manual-section__number";
      number.textContent = String(position + 1).padStart(2, "0");
      const heading = document.createElement("h2");
      heading.textContent = title;
      const list = document.createElement("ul");
      items.forEach((item) => {
        const listItem = document.createElement("li");
        listItem.textContent = item;
        list.append(listItem);
      });
      section.append(number, heading, list);
      content.append(section);
    });
  }

  function applyLanguage(language) {
    const selected = ui[language] ? language : "en-GB";
    const dictionary = ui[selected];
    document.documentElement.lang = selected;
    document.documentElement.dir = selected === "ar" ? "rtl" : "ltr";
    document.querySelectorAll("[data-i18n]").forEach((element) => {
      const key = element.dataset.i18n;
      element.textContent = dictionary[key] || ui["en-GB"][key] || element.textContent;
    });
    document.querySelectorAll("[data-i18n-aria]").forEach((element) => {
      const key = element.dataset.i18nAria;
      element.setAttribute("aria-label", dictionary[key] || ui["en-GB"][key] || "");
    });
    languageSelect.value = selected;
    renderManual(selected);
    renderBattery();
    saveLanguage(selected);
  }

  function updateScale() {
    if (!canvas || !viewport.clientWidth || !viewport.clientHeight) return;
    const naturalWidth = canvas.offsetWidth;
    const naturalHeight = canvas.scrollHeight;
    const horizontalGutter = viewport.clientWidth <= 560 ? 8 : 24;
    const verticalGutter = viewport.clientHeight <= 620 ? 4 : 16;
    const widthScale = (viewport.clientWidth - horizontalGutter) / naturalWidth;
    const heightScale = (viewport.clientHeight - verticalGutter) / naturalHeight;
    const phonePortrait = viewport.clientWidth <= 560 && viewport.clientHeight > viewport.clientWidth;
    const compactLandscape = viewport.clientWidth > viewport.clientHeight * 1.25 && viewport.clientHeight < 600;
    // Mobile browser chrome changes the visual viewport height while scrolling. In
    // portrait, fitting against that transient height made the entire calculator
    // pulse smaller and reduced its keys below a comfortable touch size. Fill the
    // stable width instead and let the dedicated viewport scroll vertically.
    const fitScale = phonePortrait || compactLandscape
      ? Math.min(1, widthScale)
      : Math.min(1, widthScale, heightScale);
    const scale = Math.max(0.35, fitScale * zoomFactor);
    const scaledWidth = Math.ceil(naturalWidth * scale);
    const scaledHeight = Math.ceil(naturalHeight * scale);

    canvas.style.transform = `scale(${scale})`;
    space.style.width = `${scaledWidth}px`;
    space.style.height = `${scaledHeight}px`;
    space.style.marginInline = scaledWidth <= viewport.clientWidth - horizontalGutter ? "auto" : "0";
    const overflowing = scaledWidth > viewport.clientWidth - horizontalGutter || scaledHeight > viewport.clientHeight - verticalGutter;
    viewport.classList.toggle("is-phone-portrait", phonePortrait);
    viewport.classList.toggle("is-overflowing", overflowing);
    if (!overflowing) {
      viewport.scrollLeft = 0;
      viewport.scrollTop = 0;
    }
    zoomLevel.textContent = `${Math.round(zoomFactor * 100)}%`;
    document.querySelector('[data-zoom="out"]').disabled = zoomFactor <= 0.6;
    document.querySelector('[data-zoom="in"]').disabled = zoomFactor >= 2;
  }

  function showView(view, addHistory = true) {
    const nextView = allowedViews.has(view) ? view : "about";
    currentView = nextView;
    views.forEach((panel) => {
      const active = panel.dataset.viewPanel === nextView;
      panel.hidden = !active;
      panel.classList.toggle("is-active", active);
      if (active) {
        panel.classList.remove("is-entering");
        requestAnimationFrame(() => panel.classList.add("is-entering"));
      }
      if (active && panel.classList.contains("app-view--scrollable")) panel.scrollTop = 0;
    });
    document.body.className = `is-${nextView}-view`;
    const targetPath = pathForView(nextView);
    if (addHistory && location.pathname !== targetPath) history.pushState({ view: nextView }, "", targetPath);
    if (nextView === "calculator") requestAnimationFrame(updateScale);
  }

  function pathForView(view) {
    if (view === "about") return "/";
    if (view === "calculator") return "/scientific-calculator";
    return `/${view}`;
  }

  function viewFromLocation() {
    const path = location.pathname.replace(/\/+$/, "") || "/";
    if (path === "/" || path === "/about") return "about";
    if (path === "/scientific-calculator" || path === "/calculator") return "calculator";
    if (path === "/manual") return "manual";
    if (path === "/linear-algebra") return "linear-algebra";
    return "about";
  }

  document.addEventListener("click", (event) => {
    const viewButton = event.target.closest("[data-view-target]");
    if (viewButton) showView(viewButton.dataset.viewTarget);

    const zoomButton = event.target.closest("[data-zoom]");
    if (!zoomButton) return;
    if (zoomButton.dataset.zoom === "fit") zoomFactor = 1;
    if (zoomButton.dataset.zoom === "in") zoomFactor = Math.min(2, Math.round((zoomFactor + 0.1) * 10) / 10);
    if (zoomButton.dataset.zoom === "out") zoomFactor = Math.max(0.6, Math.round((zoomFactor - 0.1) * 10) / 10);
    updateScale();
  });

  languageSelect.addEventListener("change", () => applyLanguage(languageSelect.value));
  viewport.addEventListener("wheel", (event) => {
    if (!viewport.classList.contains("is-overflowing")) event.preventDefault();
  }, { passive: false });

  window.addEventListener("resize", updateScale);
  window.visualViewport?.addEventListener("resize", updateScale);
  window.visualViewport?.addEventListener("scroll", updateScale);
  window.addEventListener("popstate", () => showView(viewFromLocation(), false));
  if ("ResizeObserver" in window) new ResizeObserver(() => updateScale()).observe(canvas);

  applyLanguage(detectedLanguage());
  setupBattery();
  showView(viewFromLocation(), false);
  history.replaceState({ view: currentView }, "", pathForView(currentView) + location.search + location.hash);

  window.SciCalUI = Object.freeze({
    showView,
    applyLanguage,
    updateScale,
    translate: (key) => ui[document.documentElement.lang]?.[key] || ui["en-GB"][key] || key,
    get view() { return currentView; },
  });
})();
