(function siteInterface() {
  "use strict";

  const ui = {
    "en-GB": {
      aboutAria: "Open information about this project", aboutButton: "About", zoomControls: "Calculator zoom controls", zoomOut: "Zoom out", zoomIn: "Zoom in", fitButton: "Fit", readyStatus: "Ready", manualButton: "Calculator manual",
      aboutEyebrow: "HKEAA reference model", aboutTitle: "A familiar calculator, rebuilt for the web.", aboutIntro: "A focused study simulator inspired by the fx-50FH II, recreated as a responsive web application.", openCalculator: "Open calculator",
      featureModes: "Six calculation modes", featureFormulas: "23 formulas", featureConstants: "40 constants", examNote: "The physical fx-50FH II is HKEAA-approved. This independent simulator is a learning tool and is not approved for examinations.",
      scopeEyebrow: "Development scope", scopeTitle: "One model. A dependable core.", coreStatus: "Core mode", coreDescription: "Arithmetic, fractions, powers, roots, trigonometry, logarithms, permutation, combination, history and memory.", availableStatus: "Available now", specialistTitle: "Five specialist modes", specialistDescription: "Complex numbers, base-n logic, weighted statistics, seven regression models, and four saved program areas.", projectFooter: "SciCal600 · independent educational project", readManual: "Read the calculator manual",
      manualEyebrow: "Six-language guide", manualTitle: "Calculator manual", manualIntro: "Learn the keys, modes, and common calculation workflows.", returnCalculator: "Return to calculator", manualFooter: "SciCal600 learning guide", languageLabel: "Language",
      modeEyebrow: "Calculation mode", chooseMode: "Choose a mode", modeComp: "Computation", modeComplex: "Complex numbers", modeBase: "Base-n & logic", modeSd: "Single-variable stats", modeReg: "Regression", modeProgram: "Four program areas",
      setupEyebrow: "Calculator setup", displayAngle: "Display & angle", angleUnit: "Angle unit", degrees: "Degrees", radians: "Radians", grads: "Grads", numberFormat: "Number format", done: "Done",
    },
    "zh-Hant": {
      aboutAria: "開啟本專案資訊", aboutButton: "關於", zoomControls: "計算機縮放控制", zoomOut: "縮小", zoomIn: "放大", fitButton: "適合", readyStatus: "可使用", manualButton: "計算機說明書",
      aboutEyebrow: "HKEAA 參考型號", aboutTitle: "熟悉的計算機，重新打造為 Web 應用。", aboutIntro: "以 fx-50FH II 為靈感的學習模擬器，並針對手機及電腦提供 Responsive Design。", openCalculator: "開啟計算機",
      featureModes: "六種 Calculation Mode", featureFormulas: "23 條 Formula", featureConstants: "40 個 Constant", examNote: "實體 fx-50FH II 獲 HKEAA 認可；本獨立模擬器只供學習，並未獲准在考試中使用。",
      scopeEyebrow: "開發範圍", scopeTitle: "一個型號，可靠的 Core。", coreStatus: "核心模式", coreDescription: "支援四則運算、分數、乘方、根式、三角函數、對數、排列組合、History 及 Memory。", availableStatus: "現已提供", specialistTitle: "五種專業模式", specialistDescription: "Complex、Base-n Logic、加權統計、七種 Regression Model，以及四個 Program Area。", projectFooter: "SciCal600 · 獨立教育專案", readManual: "閱讀計算機說明書",
      manualEyebrow: "六語言指南", manualTitle: "計算機說明書", manualIntro: "了解按鍵、模式與常用計算流程。", returnCalculator: "返回計算機", manualFooter: "SciCal600 學習指南", languageLabel: "語言",
      modeEyebrow: "Calculation Mode", chooseMode: "選擇模式", modeComp: "一般計算", modeComplex: "複數", modeBase: "進制與邏輯", modeSd: "單變量統計", modeReg: "迴歸分析", modeProgram: "四個程式區域",
      setupEyebrow: "Calculator Setup", displayAngle: "顯示及角度", angleUnit: "Angle Unit", degrees: "角度", radians: "弧度", grads: "梯度", numberFormat: "數字格式", done: "完成",
    },
    "zh-Hans": {
      aboutAria: "打开本项目信息", aboutButton: "关于", zoomControls: "计算器缩放控制", zoomOut: "缩小", zoomIn: "放大", fitButton: "适合", readyStatus: "可使用", manualButton: "计算器说明书",
      aboutEyebrow: "HKEAA 参考型号", aboutTitle: "熟悉的计算器，重新构建为 Web 应用。", aboutIntro: "以 fx-50FH II 为灵感的学习模拟器，并针对手机与电脑提供 Responsive Design。", openCalculator: "打开计算器",
      featureModes: "六种 Calculation Mode", featureFormulas: "23 条 Formula", featureConstants: "40 个 Constant", examNote: "实体 fx-50FH II 获 HKEAA 认可；本独立模拟器只用于学习，并未获准在考试中使用。",
      scopeEyebrow: "开发范围", scopeTitle: "一个型号，可靠的 Core。", coreStatus: "核心模式", coreDescription: "支持四则运算、分数、乘方、根式、三角函数、对数、排列组合、History 和 Memory。", availableStatus: "现已提供", specialistTitle: "五种专业模式", specialistDescription: "Complex、Base-n Logic、加权统计、七种 Regression Model，以及四个 Program Area。", projectFooter: "SciCal600 · 独立教育项目", readManual: "阅读计算器说明书",
      manualEyebrow: "六语言指南", manualTitle: "计算器说明书", manualIntro: "了解按键、模式和常用计算流程。", returnCalculator: "返回计算器", manualFooter: "SciCal600 学习指南", languageLabel: "语言",
      modeEyebrow: "Calculation Mode", chooseMode: "选择模式", modeComp: "一般计算", modeComplex: "复数", modeBase: "进制与逻辑", modeSd: "单变量统计", modeReg: "回归分析", modeProgram: "四个程序区域",
      setupEyebrow: "Calculator Setup", displayAngle: "显示和角度", angleUnit: "Angle Unit", degrees: "角度", radians: "弧度", grads: "梯度", numberFormat: "数字格式", done: "完成",
    },
    ja: {
      aboutAria: "このプロジェクトの情報を開く", aboutButton: "概要", zoomControls: "電卓のズーム操作", zoomOut: "縮小", zoomIn: "拡大", fitButton: "全体", readyStatus: "使用可能", manualButton: "電卓マニュアル",
      aboutEyebrow: "HKEAA 参照モデル", aboutTitle: "使い慣れた電卓を、Web向けに再構築。", aboutIntro: "fx-50FH IIに着想を得た、スマートフォンとPC対応の学習用シミュレーターです。", openCalculator: "電卓を開く",
      featureModes: "6つの計算モード", featureFormulas: "23の公式", featureConstants: "40の科学定数", examNote: "実機のfx-50FH IIはHKEAA認定モデルです。この独立シミュレーターは学習用であり、試験での使用は認められていません。",
      scopeEyebrow: "開発範囲", scopeTitle: "1つのモデル、信頼できるコア。", coreStatus: "基本モード", coreDescription: "四則演算、分数、べき乗、根、三角関数、対数、順列・組合せ、履歴、メモリーに対応。", availableStatus: "利用可能", specialistTitle: "5つの専門モード", specialistDescription: "複素数、基数と論理演算、加重統計、7種類の回帰、4つのプログラム領域。", projectFooter: "SciCal600 · 独立教育プロジェクト", readManual: "電卓マニュアルを読む",
      manualEyebrow: "6言語ガイド", manualTitle: "電卓マニュアル", manualIntro: "キー、モード、基本的な計算手順を確認できます。", returnCalculator: "電卓に戻る", manualFooter: "SciCal600 学習ガイド", languageLabel: "言語",
      modeEyebrow: "計算モード", chooseMode: "モードを選択", modeComp: "一般計算", modeComplex: "複素数", modeBase: "基数・論理", modeSd: "1変数統計", modeReg: "回帰", modeProgram: "4つのプログラム領域",
      setupEyebrow: "電卓設定", displayAngle: "表示と角度", angleUnit: "角度単位", degrees: "度", radians: "ラジアン", grads: "グラード", numberFormat: "数値形式", done: "完了",
    },
    ko: {
      aboutAria: "프로젝트 정보 열기", aboutButton: "소개", zoomControls: "계산기 확대/축소", zoomOut: "축소", zoomIn: "확대", fitButton: "맞춤", readyStatus: "사용 가능", manualButton: "계산기 설명서",
      aboutEyebrow: "HKEAA 참조 모델", aboutTitle: "익숙한 계산기를 웹으로 다시 만들었습니다.", aboutIntro: "fx-50FH II에서 영감을 받아 휴대전화와 PC에 맞게 만든 학습용 시뮬레이터입니다.", openCalculator: "계산기 열기",
      featureModes: "6가지 계산 모드", featureFormulas: "23개 공식", featureConstants: "40개 과학 상수", examNote: "실물 fx-50FH II는 HKEAA 승인 모델입니다. 이 독립 시뮬레이터는 학습용이며 시험 사용 승인을 받지 않았습니다.",
      scopeEyebrow: "개발 범위", scopeTitle: "하나의 모델, 신뢰할 수 있는 코어.", coreStatus: "기본 모드", coreDescription: "사칙연산, 분수, 거듭제곱, 근, 삼각함수, 로그, 순열·조합, 기록 및 메모리를 지원합니다.", availableStatus: "사용 가능", specialistTitle: "5가지 전문 모드", specialistDescription: "복소수, 진법과 논리, 가중 통계, 7가지 회귀 모델, 4개 프로그램 영역.", projectFooter: "SciCal600 · 독립 교육 프로젝트", readManual: "계산기 설명서 읽기",
      manualEyebrow: "6개 언어 가이드", manualTitle: "계산기 설명서", manualIntro: "키, 모드 및 일반적인 계산 방법을 알아보세요.", returnCalculator: "계산기로 돌아가기", manualFooter: "SciCal600 학습 가이드", languageLabel: "언어",
      modeEyebrow: "계산 모드", chooseMode: "모드 선택", modeComp: "일반 계산", modeComplex: "복소수", modeBase: "진법 및 논리", modeSd: "단일 변수 통계", modeReg: "회귀", modeProgram: "4개 프로그램 영역",
      setupEyebrow: "계산기 설정", displayAngle: "표시 및 각도", angleUnit: "각도 단위", degrees: "도", radians: "라디안", grads: "그라드", numberFormat: "숫자 형식", done: "완료",
    },
    ms: {
      aboutAria: "Buka maklumat tentang projek ini", aboutButton: "Tentang", zoomControls: "Kawalan zum kalkulator", zoomOut: "Zum keluar", zoomIn: "Zum masuk", fitButton: "Muat", readyStatus: "Sedia", manualButton: "Manual kalkulator",
      aboutEyebrow: "Model rujukan HKEAA", aboutTitle: "Kalkulator yang biasa, dibina semula untuk web.", aboutIntro: "Simulator pembelajaran berasaskan fx-50FH II yang responsif pada telefon dan komputer.", openCalculator: "Buka kalkulator",
      featureModes: "Enam mod pengiraan", featureFormulas: "23 formula", featureConstants: "40 pemalar", examNote: "fx-50FH II fizikal diluluskan HKEAA. Simulator bebas ini hanya alat pembelajaran dan tidak diluluskan untuk peperiksaan.",
      scopeEyebrow: "Skop pembangunan", scopeTitle: "Satu model. Teras yang boleh dipercayai.", coreStatus: "Mod teras", coreDescription: "Aritmetik, pecahan, kuasa, punca, trigonometri, logaritma, pilih atur, gabungan, sejarah dan memori.", availableStatus: "Tersedia sekarang", specialistTitle: "Lima mod khusus", specialistDescription: "Nombor kompleks, logik asas-n, statistik berwajaran, tujuh model regresi dan empat ruang program.", projectFooter: "SciCal600 · projek pendidikan bebas", readManual: "Baca manual kalkulator",
      manualEyebrow: "Panduan enam bahasa", manualTitle: "Manual kalkulator", manualIntro: "Pelajari kekunci, mod dan aliran kerja pengiraan biasa.", returnCalculator: "Kembali ke kalkulator", manualFooter: "Panduan pembelajaran SciCal600", languageLabel: "Bahasa",
      modeEyebrow: "Mod pengiraan", chooseMode: "Pilih mod", modeComp: "Pengiraan", modeComplex: "Nombor kompleks", modeBase: "Asas-n dan logik", modeSd: "Statistik satu pemboleh ubah", modeReg: "Regresi", modeProgram: "Empat ruang program",
      setupEyebrow: "Tetapan kalkulator", displayAngle: "Paparan dan sudut", angleUnit: "Unit sudut", degrees: "Darjah", radians: "Radian", grads: "Grad", numberFormat: "Format nombor", done: "Selesai",
    },
  };

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
      ["Screen controls", ["About at the top opens project information; Calculator manual at the bottom opens this guide.", "The calculator fits the screen automatically. Use − and + to zoom, and Fit to restore automatic sizing.", "Normal calculator view is locked against page swiping. Panning becomes available only when the enlarged calculator exceeds the viewport."]],
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
      ["畫面控制", ["頂部「關於」顯示專案資訊；底部「計算機說明書」進入本指南。", "計算機預設自動適合屏幕；使用 −、+ 縮放，Fit 恢復自動大小。", "正常 Calculator View 鎖定頁面滑動；只有放大超出視窗後才可拖動查看。"]],
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
      ["画面控制", ["顶部“关于”显示项目信息；底部“计算器说明书”进入本指南。", "计算器默认自动适合屏幕；使用 −、+ 缩放，Fit 恢复自动大小。", "正常 Calculator View 锁定页面滑动；只有放大超出视窗后才能拖动查看。"]],
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
      ["画面操作", ["上部の概要はプロジェクト情報、下部のマニュアルはこのガイドを開きます。", "最初は画面に自動調整されます。−・+で拡大縮小し、Fitで元に戻します。", "通常時はページをスワイプできません。拡大して画面を超えた場合だけ移動できます。"]],
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
      ["화면 제어", ["위쪽 소개 버튼은 프로젝트 정보, 아래쪽 설명서 버튼은 이 가이드를 엽니다.", "처음에는 화면에 자동 맞춤됩니다. −·+로 조절하고 Fit으로 복원합니다.", "보통 계산기 화면에서는 스와이프가 잠깁니다. 확대한 계산기가 화면을 넘을 때만 이동할 수 있습니다."]],
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
      ["Kawalan skrin", ["Butang Tentang di atas membuka maklumat projek; butang Manual di bawah membuka panduan ini.", "Kalkulator dimuatkan mengikut skrin secara automatik. Gunakan −, + dan Fit untuk saiz.", "Leret dikunci dalam paparan biasa. Gerakan hanya dibenarkan apabila kalkulator yang dibesarkan melebihi skrin."]],
    ],
  };

  const languageSelect = document.querySelector("#language-select");
  const viewport = document.querySelector("#calculator-viewport");
  const space = document.querySelector("#calculator-space");
  const canvas = document.querySelector("#calculator-canvas");
  const zoomLevel = document.querySelector("#zoom-level");
  const views = [...document.querySelectorAll("[data-view-panel]")];
  const allowedViews = new Set(["calculator", "about", "manual"]);
  let zoomFactor = 1;
  let currentView = "calculator";

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
    saveLanguage(selected);
  }

  function updateScale() {
    if (!canvas || !viewport.clientWidth || !viewport.clientHeight) return;
    const naturalWidth = canvas.offsetWidth;
    const naturalHeight = canvas.scrollHeight;
    const fitScale = Math.min(1, (viewport.clientWidth - 24) / naturalWidth, (viewport.clientHeight - 16) / naturalHeight);
    const scale = Math.max(0.35, fitScale * zoomFactor);
    const scaledWidth = Math.ceil(naturalWidth * scale);
    const scaledHeight = Math.ceil(naturalHeight * scale);

    canvas.style.transform = `scale(${scale})`;
    space.style.width = `${scaledWidth}px`;
    space.style.height = `${scaledHeight}px`;
    const overflowing = scaledWidth > viewport.clientWidth - 24 || scaledHeight > viewport.clientHeight - 16;
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
    const nextView = allowedViews.has(view) ? view : "calculator";
    currentView = nextView;
    views.forEach((panel) => {
      const active = panel.dataset.viewPanel === nextView;
      panel.hidden = !active;
      panel.classList.toggle("is-active", active);
      if (active && panel.classList.contains("app-view--scrollable")) panel.scrollTop = 0;
    });
    document.body.className = `is-${nextView}-view`;
    if (addHistory) history.pushState({ view: nextView }, "", `#${nextView}`);
    if (nextView === "calculator") requestAnimationFrame(updateScale);
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
  window.addEventListener("popstate", () => showView(location.hash.slice(1), false));
  if ("ResizeObserver" in window) new ResizeObserver(() => updateScale()).observe(canvas);

  applyLanguage(detectedLanguage());
  showView(allowedViews.has(location.hash.slice(1)) ? location.hash.slice(1) : "calculator", false);
  if (!location.hash) history.replaceState({ view: "calculator" }, "", "#calculator");

  window.SciCalUI = Object.freeze({ showView, applyLanguage, updateScale, get view() { return currentView; } });
})();
