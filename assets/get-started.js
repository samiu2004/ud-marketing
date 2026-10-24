'use strict';
(() => {
 const form=document.querySelector('#consultation-form');if(!form)return;
 const service=form.elements.service,pack=form.elements.package,field=document.querySelector('#package-field');
 const stateField=document.querySelector('#inquiry-state-field'),stateInput=document.querySelector('#inquiry-state');
 const whatsapp=document.querySelector('.gs-form-layout a[href^="https://wa.me/"]');
 const updateContact=()=>{const selected=service.selectedOptions[0]?.textContent;const chosen=pack.selectedOptions[0]?.textContent;let message='Hello UD Marketing, I would like a free consultation about my US business.';if(service.value)message+=' Service: '+selected+'.';if(service.value==='new-llc' && pack.value)message+=' Package: '+chosen+'.';if(service.value==='new-llc' && stateInput.value)message+=' Formation state: '+stateInput.value+'.';whatsapp.href='https://wa.me/923164248897?text='+encodeURIComponent(message);};
 const sync=()=>{const show=service.value==='new-llc';field.hidden=!show;pack.disabled=!show;pack.required=show;if(!show)pack.value='';stateField.hidden=!show||!stateInput.value;stateInput.disabled=!show||!stateInput.value;updateContact();};
 const query=new URLSearchParams(location.search);const requestedService=query.get('service'),requestedPackage=query.get('package');
 if([...service.options].some(o=>o.value===requestedService))service.value=requestedService;
 if(['basic','standard','premium','custom','launch','grow','expand','not-sure'].includes(requestedPackage)){service.value='new-llc';pack.value=requestedPackage;}
 const stateNames={"AL":"Alabama","AK":"Alaska","AZ":"Arizona","AR":"Arkansas","CA":"California","CO":"Colorado","CT":"Connecticut","DE":"Delaware","FL":"Florida","GA":"Georgia","HI":"Hawaii","ID":"Idaho","IL":"Illinois","IN":"Indiana","IA":"Iowa","KS":"Kansas","KY":"Kentucky","LA":"Louisiana","ME":"Maine","MD":"Maryland","MA":"Massachusetts","MI":"Michigan","MN":"Minnesota","MS":"Mississippi","MO":"Missouri","MT":"Montana","NE":"Nebraska","NV":"Nevada","NH":"New Hampshire","NJ":"New Jersey","NM":"New Mexico","NY":"New York","NC":"North Carolina","ND":"North Dakota","OH":"Ohio","OK":"Oklahoma","OR":"Oregon","PA":"Pennsylvania","RI":"Rhode Island","SC":"South Carolina","SD":"South Dakota","TN":"Tennessee","TX":"Texas","UT":"Utah","VT":"Vermont","VA":"Virginia","WA":"Washington","WV":"West Virginia","WI":"Wisconsin","WY":"Wyoming"};const requestedState=(query.get('state')||'').toUpperCase();if(Object.hasOwn(stateNames,requestedState))stateInput.value=stateNames[requestedState];
 sync();service.addEventListener('change',sync);pack.addEventListener('change',updateContact);
 // No endpoint is configured. Guard every submission path; never send or store details.
 form.addEventListener('submit',event=>{event.preventDefault();const status=document.querySelector('#form-status');status.textContent='Your inquiry has not been sent. Online submission is not connected. Please use WhatsApp or email to contact UD Marketing.';status.setAttribute('role','alert');});
})();
