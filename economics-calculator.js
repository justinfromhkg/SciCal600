(function economicsCalculatorInterface() {
  "use strict";
  const core = window.EconomicsCalculatorCore;
  const root = document.querySelector("#economics-calculator");
  if (!core || !root) return;
  const $ = (selector) => root.querySelector(selector);
  const $$ = (selector) => [...root.querySelectorAll(selector)];
  const CURRENCIES = ["HKD","USD","CNY","GBP","EUR","JPY","KRW","TWD","MOP","SGD","AUD","CAD","CHF","NZD","THB","PHP","MYR","IDR","INR"];
  const FX_CACHE_MAX_AGE = 36 * 60 * 60 * 1000;
  const RATES_CACHE_MAX_AGE = 36 * 60 * 60 * 1000;
  let currentFx = null;
  let fxRequest = 0;

  function escapeHtml(value) { const node=document.createElement("span"); node.textContent=String(value); return node.innerHTML; }
  function number(value, digits=8) { return Number.isFinite(Number(value)) ? Number(Number(value).toPrecision(digits)).toLocaleString(document.documentElement.lang || "en-GB", {maximumFractionDigits:12}) : String(value); }
  function money(value, currency) { try { return new Intl.NumberFormat(document.documentElement.lang || "en-GB", {style:"currency",currency,maximumFractionDigits: currency === "JPY" || currency === "KRW" ? 0 : 2}).format(value); } catch (_error) { return `${currency} ${number(value)}`; } }
  function result(element, html, error=false) { element.classList.toggle("is-error",error); element.innerHTML=html; }
  function fail(element,error) { result(element,`<strong>${escapeHtml(error?.message || error)}</strong>`,true); }
  function badge(text,className="") { return `<span class="status-badge ${className}">${escapeHtml(text)}</span>`; }
  function translate(key) { return window.SciCalUI?.translate(key) || key; }

  function selectLayer(name) {
    $$('[data-economics-section]').forEach((button)=>button.classList.toggle("is-selected",button.dataset.economicsSection===name));
    $$('[data-economics-panel]').forEach((panel)=>{ const active=panel.dataset.economicsPanel===name; panel.hidden=!active; panel.classList.toggle("is-active",active); });
    try { localStorage.setItem("scical600.economics.layer",name); } catch (_error) { /* optional */ }
  }
  root.addEventListener("click",(event)=>{ const button=event.target.closest("[data-economics-section]"); if(button) selectLayer(button.dataset.economicsSection); });

  async function fetchJson(url, timeoutMs=8000) {
    const controller=new AbortController();
    const timeout=setTimeout(()=>controller.abort(),timeoutMs);
    try {
      const response=await fetch(url,{signal:controller.signal,headers:{Accept:"application/json"},cache:"no-store"});
      if(!response.ok) throw new core.EconomicsError(`Data service returned HTTP ${response.status}.`);
      const payload=await response.json();
      if(payload===null || typeof payload!=="object") throw new core.EconomicsError("Data service returned malformed JSON.");
      return payload;
    } catch(error) {
      if(error?.name==="AbortError") throw new core.EconomicsError(`Data request timed out after ${timeoutMs/1000} seconds.`);
      throw error;
    } finally { clearTimeout(timeout); }
  }

  function readCache(key,maxAge) {
    try { return core.inspectCache(JSON.parse(localStorage.getItem(key)),maxAge); } catch (_error) { return null; }
  }
  function writeCache(key,data) { try { localStorage.setItem(key,JSON.stringify(core.cacheSnapshot(data))); } catch (_error) { /* calculations still work */ } }
  function fxCacheKey(base,quote,date) { return `scical600.fx.v1.${base}.${quote}.${date||"latest"}`; }

  function populateCurrencies() {
    for(const select of [$("#fx-base"),$("#fx-quote")]) select.replaceChildren(...CURRENCIES.map((code)=>{ const option=document.createElement("option"); option.value=code; option.textContent=code; return option; }));
    $("#fx-base").value="HKD"; $("#fx-quote").value="USD";
  }

  function showFx(rateInfo,stateLabel,stateClass="is-reference") {
    currentFx=rateInfo;
    const converted=core.convertFX($("#fx-amount").value,rateInfo.rate,rateInfo.base,rateInfo.quote);
    $("#fx-status").innerHTML=badge(stateLabel,stateClass)+badge(rateInfo.date?`As of ${rateInfo.date}`:"No market date")+badge(rateInfo.provider||"Manual rate");
    result($("#fx-result"),`<span>${escapeHtml(money(converted.amount,converted.base))}</span><strong class="economics-result__amount">${escapeHtml(money(converted.converted,converted.quote))}</strong><div class="result-grid"><span>Rate<strong>1 ${converted.base} = ${number(converted.rate,12)} ${converted.quote}</strong></span><span>Inverse<strong>1 ${converted.quote} = ${number(converted.inverseRate,12)} ${converted.base}</strong></span></div>`);
  }

  async function refreshFx() {
    const request=++fxRequest;
    const base=core.normaliseCurrency($("#fx-base").value), quote=core.normaliseCurrency($("#fx-quote").value), date=$("#fx-date").value;
    if(base===quote) { showFx(core.parseFrankfurterRates(null,base,quote),"Same currency","is-reference"); return; }
    $("#fx-status").innerHTML=badge("Loading reference rate…");
    const query=new URLSearchParams({base,quotes:quote});
    if(date){ query.set("from",date); query.set("to",date); }
    const key=fxCacheKey(base,quote,date);
    try {
      const payload=await fetchJson(`https://api.frankfurter.dev/v2/rates?${query}`);
      if(request!==fxRequest)return;
      const parsed=core.parseFrankfurterRates(payload,base,quote);
      writeCache(key,parsed);
      showFx(parsed,date?"Historical reference":"Latest reference","is-reference");
    } catch(error) {
      if(request!==fxRequest)return;
      const cached=readCache(key,FX_CACHE_MAX_AGE);
      if(cached) showFx(cached.data,cached.stale?"Offline · stale cached reference":"Offline · cached reference",cached.stale?"is-stale":"");
      else { currentFx=null; $("#fx-status").innerHTML=badge(error.message,"is-error")+badge("Enter a manual rate to continue","is-stale"); fail($("#fx-result"),error); }
    }
  }

  $("#fx-refresh").addEventListener("click",()=>refreshFx().catch((error)=>fail($("#fx-result"),error)));
  $("#fx-convert").addEventListener("click",()=>{
    try {
      const base=$("#fx-base").value,quote=$("#fx-quote").value;
      const manual=Number($("#fx-manual-rate").value);
      if(Number.isFinite(manual)&&manual>0) showFx({base,quote,rate:manual,inverseRate:1/manual,date:null,provider:"Manual fallback"},"Manual · not live","is-stale");
      else if(currentFx&&currentFx.base===base&&currentFx.quote===quote) showFx(currentFx,"Reference rate","is-reference");
      else refreshFx();
    } catch(error){ fail($("#fx-result"),error); }
  });
  $("#fx-swap").addEventListener("click",()=>{ const base=$("#fx-base").value; $("#fx-base").value=$("#fx-quote").value; $("#fx-quote").value=base; $("#fx-manual-rate").value=""; refreshFx(); });
  ["#fx-base","#fx-quote","#fx-date"].forEach((selector)=>$(selector).addEventListener("change",()=>{currentFx=null;refreshFx();}));
  $("#fx-amount").addEventListener("input",()=>{if(currentFx)try{showFx(currentFx,"Reference rate","is-reference");}catch(_error){/* wait for valid amount */}});

  const HKMA_URLS={
    blr:"https://api.hkma.gov.hk/public/market-data-and-statistics/monthly-statistical-bulletin/er-ir/hkd-ir-effdates",
    hibor:"https://api.hkma.gov.hk/public/market-data-and-statistics/monthly-statistical-bulletin/er-ir/hk-interbank-ir-daily?segment=hibor.fixing",
    baseRate:"https://api.hkma.gov.hk/public/market-data-and-statistics/daily-monetary-statistics/daily-figures-interbank-liquidity",
  };
  function showHKRates(data,status,className="is-reference") {
    $("#hk-rates-status").innerHTML=badge(status,className)+badge("HKMA official public API");
    const cards=[
      ["HSBC quoted BLR",data.bestLendingRate,data.bestLendingRateDate],
      ["Deposit rate",data.depositRate,data.bestLendingRateDate],
      ["Discount Window Base Rate",data.baseRate,data.baseRateDate],
      ["HIBOR overnight",data.hibor.overnight,data.hiborDate],["HIBOR 1W",data.hibor["1w"],data.hiborDate],["HIBOR 1M",data.hibor["1m"],data.hiborDate],["HIBOR 3M",data.hibor["3m"],data.hiborDate],["HIBOR 6M",data.hibor["6m"],data.hiborDate],["HIBOR 12M",data.hibor["12m"],data.hiborDate],
    ];
    $("#hk-rates-result").innerHTML=cards.map(([label,value,date])=>`<div class="rate-card"><span>${label}</span><strong>${value==null?"N/A":`${number(value)}%`}</strong><small>${date||"No date"}</small></div>`).join("");
  }
  async function refreshHKRates() {
    $("#hk-rates-status").innerHTML=badge("Loading official records…");
    try {
      const [blr,hibor,baseRate]=await Promise.all([fetchJson(HKMA_URLS.blr),fetchJson(HKMA_URLS.hibor),fetchJson(HKMA_URLS.baseRate)]);
      const parsed=core.parseHKMARates({blr,hibor,baseRate}); writeCache("scical600.hkma.v1",parsed); showHKRates(parsed,"Latest official records","is-reference");
    } catch(error) {
      const cached=readCache("scical600.hkma.v1",RATES_CACHE_MAX_AGE);
      if(cached) showHKRates(cached.data,cached.stale?"Offline · stale official cache":"Offline · official cache",cached.stale?"is-stale":"");
      else { $("#hk-rates-status").innerHTML=badge(error.message,"is-error"); $("#hk-rates-result").replaceChildren(); }
    }
  }
  $("#hk-rates-refresh").addEventListener("click",()=>refreshHKRates());

  function interestCalculate(){
    const target=$("#interest-result");
    try{
      const principal=$("#interest-principal").value,rate=$("#interest-rate").value,years=$("#interest-years").value,periods=$("#interest-periods").value,method=$("#interest-method").value;
      let output;
      if(method==="simple")output=core.simpleInterest(principal,rate,years);
      else if(method==="compound")output=core.compoundInterest(principal,rate,years,periods);
      else { const savings=core.savingsFV(principal,rate,years,periods); output={futureValue:savings.futureValue,interest:savings.interest,principal:savings.contributions,assumption:`${savings.periods} end-of-period contributions`}; }
      result(target,`<div class="result-grid"><span>Future value<strong>${money(output.futureValue,"HKD")}</strong></span><span>Interest<strong>${money(output.interest,"HKD")}</strong></span><span>Principal/contributions<strong>${money(output.principal,"HKD")}</strong></span><span>Assumption<strong>${escapeHtml(output.assumption)}</strong></span><span>Selected day basis<strong>Actual/${$("#interest-day-basis").value}</strong></span></div>`);
    }catch(error){fail(target,error);}
  }
  $("#interest-calculate").addEventListener("click",interestCalculate);
  $("#ear-from-nominal").addEventListener("click",()=>{try{const value=core.nominalToEAR($("#ear-nominal").value,$("#interest-periods").value);$("#ear-effective").value=value;result($("#ear-result"),`<strong>${number(value)}% EAR</strong>`);}catch(error){fail($("#ear-result"),error);}});
  $("#nominal-from-ear").addEventListener("click",()=>{try{const value=core.earToNominal($("#ear-effective").value,$("#interest-periods").value);$("#ear-nominal").value=value;result($("#ear-result"),`<strong>${number(value)}% nominal</strong>`);}catch(error){fail($("#ear-result"),error);}});

  $("#loan-calculate").addEventListener("click",()=>{
    const target=$("#loan-result");
    try{
      const output=core.mortgageComparison({principal:$("#loan-principal").value,months:Number($("#loan-years").value)*12,pRate:$("#loan-p-rate").value,pAdjustment:$("#loan-p-adjustment").value,hibor:$("#loan-hibor").value,hSpread:$("#loan-h-spread").value,capAdjustment:$("#loan-cap-adjustment").value,earlyRepaymentFee:$("#loan-fee").value,cashRebate:$("#loan-rebate").value});
      const income=Number($("#loan-income").value);
      result(target,`<div class="result-grid"><span>P-plan rate<strong>${number(output.pPlanRate)}%</strong></span><span>P monthly payment<strong>${money(output.pPlan.payment,"HKD")}</strong></span><span>P total interest<strong>${money(output.pPlan.totalInterest,"HKD")}</strong></span><span>H-plan rate<strong>${number(output.hPlanRate)}%${output.capApplied?" (cap applied)":""}</strong></span><span>H monthly payment<strong>${money(output.hPlan.payment,"HKD")}</strong></span><span>H total interest<strong>${money(output.hPlan.totalInterest,"HKD")}</strong></span><span>P payment/income<strong>${income>0?number(output.pPlan.payment/income*100):"N/A"}%</strong></span><span>H payment/income<strong>${income>0?number(output.hPlan.payment/income*100):"N/A"}%</strong></span></div><p>Educational scenario only; rates may reset and actual bank terms, stress tests, fees and approval differ.</p>`);
      $("#loan-schedule").innerHTML=`<thead><tr><th>Month</th><th>Payment</th><th>Principal</th><th>Interest</th><th>Balance</th></tr></thead><tbody>${output.hPlan.schedule.slice(0,12).map((row)=>`<tr><td>${row.month}</td><td>${number(row.payment)}</td><td>${number(row.principal)}</td><td>${number(row.interest)}</td><td>${number(row.balance)}</td></tr>`).join("")}</tbody>`;
    }catch(error){fail(target,error);}
  });
  $("#apr-calculate").addEventListener("click",()=>{try{const output=core.feeAwareAPR({principal:$("#apr-principal").value,upfrontFees:$("#apr-fees").value,annualRatePercent:$("#apr-rate").value,months:Number($("#apr-months").value)});result($("#apr-result"),`<div class="result-grid"><span>Net proceeds<strong>${money(output.netProceeds,"HKD")}</strong></span><span>Monthly payment<strong>${money(output.payment,"HKD")}</strong></span><span>Nominal annual estimate<strong>${number(output.nominalAnnualPercent)}%</strong></span><span>Effective annual estimate<strong>${number(output.effectiveAnnualPercent)}%</strong></span></div>`);}catch(error){fail($("#apr-result"),error);}});

  $("#budget-calculate").addEventListener("click",()=>{try{const categories=$("#budget-categories").value.split(/\r?\n/).filter((line)=>line.trim()).map((line)=>{const split=line.lastIndexOf(":");if(split<1)throw new core.EconomicsError("Use name: amount on each budget line.");return{name:line.slice(0,split).trim(),amount:line.slice(split+1).trim()};});const output=core.budgetSummary(categories,$("#budget-income").value);result($("#budget-result"),`<div class="result-grid"><span>Income<strong>${money(output.income,"HKD")}</strong></span><span>Expenses<strong>${money(output.expenses,"HKD")}</strong></span><span>Savings<strong>${money(output.savings,"HKD")}</strong></span><span>Savings rate<strong>${output.savingsRate==null?"N/A":`${number(output.savingsRate)}%`}</strong></span></div>`);}catch(error){fail($("#budget-result"),error);}});
  $("#real-calculate").addEventListener("click",()=>{try{const real=core.realReturn($("#real-nominal").value,$("#real-inflation").value),change=core.percentChange($("#change-old").value,$("#change-new").value);result($("#real-result"),`<div class="result-grid"><span>Real return<strong>${number(real)}%</strong></span><span>Percentage change<strong>${number(change)}%</strong></span></div>`);}catch(error){fail($("#real-result"),error);}});

  populateCurrencies();
  try{selectLayer(localStorage.getItem("scical600.economics.layer")||"fx");}catch(_error){selectLayer("fx");}
  const cachedFx=readCache(fxCacheKey("HKD","USD",""),FX_CACHE_MAX_AGE); if(cachedFx)showFx(cachedFx.data,cachedFx.stale?"Cached · stale":"Cached reference",cachedFx.stale?"is-stale":""); else refreshFx();
  const cachedRates=readCache("scical600.hkma.v1",RATES_CACHE_MAX_AGE); if(cachedRates)showHKRates(cachedRates.data,cachedRates.stale?"Cached · stale":"Cached official rates",cachedRates.stale?"is-stale":"");
  interestCalculate();
})();
