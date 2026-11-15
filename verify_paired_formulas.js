const fs=require('fs'),vm=require('vm');
let raw=fs.readFileSync('/mnt/data/yuen_pages_ready/index.html','utf8');let scripts=[...raw.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(x=>x[1]);
let first=scripts[0].split('const A0=')[0];let second=scripts[1].split('function renderPaired()')[0];
let js=first+'\n'+second+`\n
const A=WATER_PAIRS.map(o=>o[0]),B=WATER_PAIRS.map(o=>o[1]),DIF=A.map((v,i)=>v-B[i]);
const m=pairedInference(DIF), t=trimmedDifference(DIF,.2),w=marginalDifference(A,B,.2);
console.log(JSON.stringify({m,t:{estimate:t.estimate,se:t.se,df:t.df,p:t.p,ci:t.ci},w:{estimate:w.estimate,se:w.se,df:w.df,p:w.p,ci:w.ci,cov:w.cov},chartChars:pairedForest([{short:'paired',res:m},{short:'lumen',res:t},{short:'wrs2',res:w}]).length,plotChars:pairedScatter(WATER_PAIRS,rankFlags(DIF,.2)).length},null,2));
if(Math.abs(t.estimate-3.64285714285)>1e-8 || Math.abs(w.estimate-6.375)>1e-8 || Math.abs(w.p-0.01892756)>1e-6) throw Error('Reference data mismatch');
for(const gamma of [0,.1,.2,.3]) { const v1=trimmedDifference(DIF,gamma),v2=marginalDifference(A,B,gamma); if(!(v1.se>=0&&v2.se>=0&&Number.isFinite(v1.p)&&Number.isFinite(v2.p))) throw Error('Invalid SE or p at '+gamma);if(gamma===0 && Math.abs(v1.estimate-v2.estimate)>1e-12)throw Error('untrimmed mean mismatch'); }
console.log('All numerical and generated SVG smoke checks passed.');`;
vm.runInNewContext(js, {console, Math, Number, Array, Set, JSON, Error});
