'use strict';
// The homepage's wider navigation collapses earlier than the unchanged inner pages.
(() => {
  const desktop = matchMedia('(min-width: 901px)');
  desktop.addEventListener('change', event => {
    const toggle = document.querySelector('.homepage .menu-toggle');
    const nav = document.querySelector('.homepage #main-navigation');
    if (!event.matches || !toggle || !nav) return;
    const restore = document.activeElement === toggle;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation');
    nav.classList.remove('is-open');
    if (restore) nav.querySelector('a')?.focus();
  });


})();

// Decorative paths follow card geometry at each responsive size.
(() => {
 const map=document.querySelector('.service-map');if(!map)return;
 const svg=map.querySelector('.service-map-lines'),cards=[...map.querySelectorAll('.service-card')];
 const ns='http://www.w3.org/2000/svg';const visited=new Set();
 const make=(tag,attrs)=>{const el=document.createElementNS(ns,tag);Object.entries(attrs).forEach(([k,v])=>el.setAttribute(k,v));svg.append(el);return el;};
 const draw=()=>{svg.replaceChildren();const box=map.getBoundingClientRect();svg.setAttribute('viewBox','0 0 '+box.width+' '+box.height);const mobile=matchMedia('(max-width:700px)').matches;
 cards.slice(1).forEach((card,i)=>{const a=cards[i].getBoundingClientRect(),b=card.getBoundingClientRect();let x1,y1,x2,y2,d;
 if(mobile){x1=-4;y1=a.top-box.top+40;x2=-4;y2=b.top-box.top+40;d='M '+(a.left-box.left)+' '+y1+' H '+x1+' V '+y2+' H '+(b.left-box.left);}
 else{const right=i%2===0;x1=(right?a.right:a.left)-box.left;y1=a.top-box.top+a.height/2;x2=(right?b.left:b.right)-box.left;y2=b.top-box.top+b.height/2;const middle=(x1+x2)/2;d='M '+x1+' '+y1+' H '+middle+' V '+y2+' H '+x2;}
 make('path',{d,class:'map-line-base'});make('path',{d,pathLength:1,class:'map-line-active'+(visited.has(card)?' is-drawn':''),'data-target':i+1});make('circle',{cx:mobile?b.left-box.left:x2,cy:y2,r:5,class:'map-node'+(visited.has(card)?' is-drawn':''),'data-target':i+1});
 });};
 const observer=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){visited.add(e.target);const index=cards.indexOf(e.target);svg.querySelectorAll('[data-target="'+index+'"]').forEach(el=>el.classList.add('is-drawn'));}});},{threshold:.25});cards.forEach(c=>observer.observe(c));new ResizeObserver(draw).observe(map);document.fonts.ready.then(draw);
})();
