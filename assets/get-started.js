'use strict';
(() => {
 const form=document.querySelector('#consultation-form');if(!form)return;
 const service=form.elements.service,pack=form.elements.package,field=document.querySelector('#package-field');
 const whatsapp=document.querySelector('.gs-form-layout a[href^="https://wa.me/"]');
 const updateContact=()=>{const selected=service.selectedOptions[0]?.textContent;const chosen=pack.selectedOptions[0]?.textContent;let message='Hello UD Marketing, I would like a free consultation about my US business.';if(service.value)message+=' Service: '+selected+'.';if(service.value==='new-llc' && pack.value)message+=' Package: '+chosen+'.';whatsapp.href='https://wa.me/923164248897?text='+encodeURIComponent(message);};
 const sync=()=>{const show=service.value==='new-llc';field.hidden=!show;pack.disabled=!show;pack.required=show;if(!show)pack.value='';updateContact();};
 const query=new URLSearchParams(location.search);const requestedService=query.get('service'),requestedPackage=query.get('package');
 if([...service.options].some(o=>o.value===requestedService))service.value=requestedService;
 if(['launch','grow','expand','not-sure'].includes(requestedPackage)){service.value='new-llc';pack.value=requestedPackage;}
 sync();service.addEventListener('change',sync);pack.addEventListener('change',updateContact);
 // No endpoint is configured. Guard every submission path; never send or store details.
 form.addEventListener('submit',event=>{event.preventDefault();const status=document.querySelector('#form-status');status.textContent='Your inquiry has not been sent. Online submission is not connected. Please use WhatsApp or email to contact UD Marketing.';status.setAttribute('role','alert');});
})();
