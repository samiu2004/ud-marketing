'use strict';
(() => {
 const section=document.querySelector('#fee-checker');if(!section)return;
 const input=document.querySelector('#fee-state'),list=document.querySelector('#fee-state-list'),packageSelect=document.querySelector('#fee-package');
 const loadStatus=document.querySelector('#fee-load-status'),retry=document.querySelector('#fee-retry'),hint=document.querySelector('#fee-state-hint');
 const amount=id=>document.querySelector(id);const serviceAmount=amount('#fee-service-amount'),stateAmount=amount('#fee-state-amount'),totalAmount=amount('#fee-total-amount');
 const verification=amount('#fee-verification'),sourceLink=amount('#fee-official-source'),verifiedDate=amount('#fee-verified-date'),consultation=amount('#fee-consultation');
 const expectedCodes='AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI WY'.split(' ');
 const money=new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',minimumFractionDigits:0,maximumFractionDigits:2});
 let states=[],plans=[],selectedState=null,filtered=[],active=-1,loading=false,requestedPackage='';
 const close=()=>{list.hidden=true;input.setAttribute('aria-expanded','false');input.removeAttribute('aria-activedescendant');active=-1;};
 const validDate=value=>typeof value==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(value)&&!Number.isNaN(Date.parse(value))&&new Date(value+'T00:00:00Z').toISOString().slice(0,10)===value;
 const officialUrl=value=>{try{const url=new URL(value);return url.protocol==='https:'&&!url.username&&!url.password?url.href:null;}catch{return null;}};
 const render=()=>{
  const plan=plans.find(p=>p.id===packageSelect.value);const fee=selectedState?.formationFeeUsd;
  serviceAmount.textContent=plan?money.format(plan.fee):'—';stateAmount.textContent=selectedState?money.format(fee):'—';totalAmount.textContent=plan&&selectedState?money.format((Math.round(plan.fee*100)+Math.round(fee*100))/100):'—';
  amount('#fee-selection').textContent=selectedState&&plan?selectedState.state+' · '+plan.name:selectedState?selectedState.state+' · choose a package':plan?plan.name+' · choose a state':'Choose a state and package';
  sourceLink.hidden=true;sourceLink.removeAttribute('href');verifiedDate.hidden=true;verifiedDate.textContent='';
  const url=officialUrl(selectedState?.officialSourceUrl);
  if(selectedState?.officialVerificationStatus==='VERIFIED'&&url&&validDate(selectedState.lastOfficialVerifiedDate)){
   verification.textContent='Listed filing fee checked against the official state source.';sourceLink.href=url;sourceLink.hidden=false;verifiedDate.textContent='Last Verified: '+selectedState.lastOfficialVerifiedDate;verifiedDate.hidden=false;
  }else verification.textContent=selectedState?'Official-source verification pending for '+selectedState.state+'. This is a preliminary listed fee, not a confirmed current government quote.':'State filing fees are estimates. Official-source verification is pending.';
  const params=new URLSearchParams();if(plan)params.set('package',plan.id);if(selectedState)params.set('state',selectedState.code);consultation.href='/get-started/'+(params.size?'?'+params.toString():'')+'#consultation';
 };
 const highlight=index=>{active=index;[...list.querySelectorAll('[role=option]')].forEach((option,i)=>option.setAttribute('aria-selected',String(i===active)));if(active>=0){const option=list.querySelectorAll('[role=option]')[active];input.setAttribute('aria-activedescendant',option.id);option.scrollIntoView({block:'nearest'});}else input.removeAttribute('aria-activedescendant');};
 const open=()=>{
  if(loading||!states.length)return;const query=input.value.trim().toLowerCase();filtered=states.filter(s=>s.state.toLowerCase().includes(query)||s.code.toLowerCase()===query);list.replaceChildren();active=-1;
  filtered.forEach((state,index)=>{const option=document.createElement('li');option.id='fee-state-option-'+state.code;option.setAttribute('role','option');option.setAttribute('aria-selected','false');option.dataset.index=index;option.textContent=state.state+' ('+state.code+')';list.append(option);});
  if(!filtered.length){const message=document.createElement('li');message.className='fee-no-results';message.textContent='No matching states. Try a state name or abbreviation.';list.append(message);}
  list.hidden=false;input.setAttribute('aria-expanded','true');input.removeAttribute('aria-activedescendant');
 };
 const choose=state=>{selectedState=state;input.value=state.state;input.removeAttribute('aria-invalid');hint.textContent='Selected state: '+state.state+'.';close();render();};
 input.addEventListener('focus',open);input.addEventListener('click',()=>{if(list.hidden)open();});
 input.addEventListener('input',()=>{selectedState=null;input.removeAttribute('aria-invalid');hint.textContent='Choose a state from the list.';render();open();});
 input.addEventListener('keydown',event=>{
  if(event.key==='ArrowDown'||event.key==='ArrowUp'){event.preventDefault();if(list.hidden)open();if(filtered.length)highlight(active===-1?(event.key==='ArrowDown'?0:filtered.length-1):(active+(event.key==='ArrowDown'?1:-1)+filtered.length)%filtered.length);}
  else if(event.key==='Enter'&&!list.hidden){event.preventDefault();if(active>=0&&filtered[active])choose(filtered[active]);}
  else if(event.key==='Escape'){event.preventDefault();close();}
  else if(event.key==='Tab')close();
 });
 list.addEventListener('mousedown',event=>event.preventDefault());list.addEventListener('click',event=>{const option=event.target.closest('[role=option]');if(option&&filtered[Number(option.dataset.index)]){choose(filtered[Number(option.dataset.index)]);input.focus({preventScroll:true});close();}});
 document.addEventListener('click',event=>{if(!event.target.closest('.fee-state-field'))close();});
 input.addEventListener('blur',()=>{const exact=states.find(s=>s.state.toLowerCase()===input.value.trim().toLowerCase()||s.code===input.value.trim().toUpperCase());if(exact)choose(exact);else if(input.value.trim()){selectedState=null;input.setAttribute('aria-invalid','true');hint.textContent='Select a valid state from the list to calculate a total.';render();}});
 packageSelect.addEventListener('change',render);
 const setPackage=id=>{packageSelect.value=plans.some(p=>p.id===id)?id:'basic';render();};
 document.querySelectorAll('[data-fee-package]').forEach(button=>button.addEventListener('click',()=>{
  requestedPackage=button.dataset.feePackage;setPackage(requestedPackage);section.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});if(!input.disabled)input.focus({preventScroll:true});
 }));
 const load=async()=>{
  if(loading)return;loading=true;input.disabled=true;packageSelect.disabled=true;retry.hidden=true;loadStatus.hidden=false;loadStatus.textContent='Loading state filing fees…';close();
  try{
   const responses=await Promise.all([fetch('/assets/data/llc-state-fees.json'),fetch('/assets/data/llc-packages.json')]);if(responses.some(r=>!r.ok))throw Error('Dataset unavailable');const [data,config]=await Promise.all(responses.map(r=>r.json()));
   if(data.currency!=='USD'||!Array.isArray(data.states)||data.states.length!==50||new Set(data.states.map(s=>s.code)).size!==50||new Set(data.states.map(s=>s.state)).size!==50||!data.states.every(s=>expectedCodes.includes(s.code)&&typeof s.state==='string'&&s.state.trim()&&typeof s.formationFeeUsd==='number'&&Number.isFinite(s.formationFeeUsd)&&s.formationFeeUsd>=0&&Number.isSafeInteger(Math.round(s.formationFeeUsd*100))&&typeof s.recurringFeeUsd==='number'&&Number.isFinite(s.recurringFeeUsd)&&s.recurringFeeUsd>=0))throw Error('Invalid state data');
   if(config.currency!=='USD'||!Array.isArray(config.packages))throw Error('Invalid package data');const fixed=config.packages.filter(p=>p.fee!==null);if(fixed.length!==3||new Set(fixed.map(p=>p.id)).size!==3||!fixed.every(p=>['basic','standard','premium'].includes(p.id)&&typeof p.name==='string'&&Number.isFinite(p.fee)&&p.fee>=0))throw Error('Invalid package prices');
   states=[...data.states].sort((a,b)=>a.state.localeCompare(b.state,'en'));plans=fixed;
   packageSelect.replaceChildren(...plans.map(p=>new Option(p.name+' — '+money.format(p.fee),p.id)));
   const params=new URLSearchParams(location.search);setPackage(requestedPackage||params.get('package'));const requestedState=params.get('state');if(requestedState){const match=states.find(s=>s.code===requestedState.toUpperCase());if(match)choose(match);}
   input.disabled=false;packageSelect.disabled=false;loadStatus.textContent='';loadStatus.hidden=true;render();loading=false;
   if(requestedPackage){input.focus({preventScroll:true});open();}
  }catch{
   states=[];plans=[];selectedState=null;render();loadStatus.hidden=false;loadStatus.textContent='The estimate is temporarily unavailable. Please retry or request a consultation.';retry.hidden=false;
  }finally{loading=false;}
 };
 retry.addEventListener('click',load);load();
})();
