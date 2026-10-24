'use strict';
// Render crawlable cards from the same package data used by the fee checker.
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const escape=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const config=JSON.parse(fs.readFileSync(path.join(root,'assets/data/llc-packages.json'),'utf8'));
if(config.currency!=='USD'||config.packages.length!==4||config.packages.map(p=>p.id).join(',')!=='basic,standard,premium,custom')throw Error('Invalid package configuration');
function renderCards(homepage=false){
 return '<div class="plan-grid">'+config.packages.map(pack=>{
  if(pack.fee!==null&&(!Number.isFinite(pack.fee)||pack.fee<0))throw Error('Invalid package fee');
  const heading=homepage?'h3':'h2',id=(homepage?'home-plan-':'plan-')+pack.id;
  const feeControl=pack.fee===null?'<span class="plan-fee-spacer" aria-hidden="true"></span>':homepage?'<a class="state-fee-control" href="/pricing.html?package='+encodeURIComponent(pack.id)+'#fee-checker">+ State Filing Fee<span class="sr-only"> for '+escape(pack.name)+'</span></a>':'<button class="state-fee-control" type="button" data-fee-package="'+escape(pack.id)+'" aria-controls="fee-checker">+ State Filing Fee<span class="sr-only"> for '+escape(pack.name)+'</span></button>';
  return '<article class="plan-card'+(pack.id==='premium'?' plan-premium':'')+'" aria-labelledby="'+id+'"><'+heading+' id="'+id+'">'+escape(pack.name)+'</'+heading+'><p class="plan-price'+(pack.fee===null?' plan-quote':'')+'">'+(pack.fee===null?'Custom Quote':'$'+escape(pack.fee))+'<span>'+(pack.fee===null?'Discuss your requirements':'USD service fee')+'</span></p>'+feeControl+'<p class="plan-description">'+escape(pack.description)+'</p><ul>'+pack.features.map(feature=>'<li><span aria-hidden="true">✓</span>'+escape(feature)+'</li>').join('')+'</ul><a class="button '+(pack.id==='premium'?'plan-cyan':'primary')+'" href="/get-started/?package='+encodeURIComponent(pack.id)+'#consultation">'+(pack.fee===null?"Let's Talk":'Get Started')+'<span aria-hidden="true">→</span><span class="sr-only"> with '+escape(pack.name)+'</span></a></article>';
 }).join('')+'</div>';
}
const homePath=path.join(root,'index.html');let home=fs.readFileSync(homePath,'utf8');
const start=home.indexOf('<section class="section home-pricing"'),end=home.indexOf('<section',start+10);if(start<0||end<0)throw Error('Homepage pricing section not found');
const current=home.slice(start,end);const heading=current.match(/<div class="package-heading">[\s\S]*?<\/div>/)?.[0];if(!heading)throw Error('Homepage pricing heading not found');
const section='<section class="section home-pricing" id="pricing" aria-labelledby="pricing-title"><div class="container">'+heading+renderCards(true)+'</div></section>';
home=home.slice(0,start)+section+home.slice(end);if(!home.includes('href="/assets/pricing.css"'))home=home.replace('</head>','<link rel="stylesheet" href="/assets/pricing.css"></head>');fs.writeFileSync(homePath,home);
const pricingPath=path.join(root,'pricing.html');let pricing=fs.readFileSync(pricingPath,'utf8');const a=pricing.indexOf('<div class="plan-grid">'),b=pricing.indexOf('<p class="pricing-note">',a);if(a<0||b<0)throw Error('Pricing cards not found');pricing=pricing.slice(0,a)+renderCards()+pricing.slice(b);fs.writeFileSync(pricingPath,pricing);
console.log('Synced homepage and Pricing cards from assets/data/llc-packages.json.');
