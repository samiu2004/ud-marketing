'use strict';
// Decorative connectors follow the milestone geometry; content does not depend on JS.
(() => {
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');
 const ns='http://www.w3.org/2000/svg';
 document.querySelectorAll('[data-floating-journey]').forEach(root=>{
  const svg=root.querySelector('.floating-connectors');
  const nodes=[...root.querySelectorAll(':scope > .floating-node')];
  if(!svg||nodes.length<2)return;
  const seen=new Set();let scheduled=0;
  const make=(attributes)=>{const path=document.createElementNS(ns,'path');Object.entries(attributes).forEach(([key,value])=>path.setAttribute(key,value));svg.append(path);return path;};
  const highlight=(node,on)=>svg.querySelectorAll('.floating-ink[data-node="'+Math.max(1,nodes.indexOf(node))+'"]').forEach(path=>path.classList.toggle('is-highlighted',on));
  const draw=()=>{
   scheduled=0;const box=root.getBoundingClientRect();if(!box.width)return;
   svg.setAttribute('viewBox','0 0 '+box.width+' '+box.height);svg.replaceChildren();
   const points=nodes.map(node=>{const rect=node.querySelector('.floating-icon').getBoundingClientRect();return{x:rect.left-box.left+rect.width/2,y:rect.top-box.top+rect.height/2};});
   const mobile=matchMedia('(max-width:700px)').matches;
   points.slice(1).forEach((b,index)=>{const a=points[index],middle=(a.y+b.y)/2;const d=mobile?'M '+a.x+' '+a.y+' L '+b.x+' '+b.y:'M '+a.x+' '+a.y+' C '+a.x+' '+middle+', '+b.x+' '+middle+', '+b.x+' '+b.y;
    make({d,class:'floating-track'});
    make({d,pathLength:1,class:'floating-ink'+(seen.has(nodes[index+1])||reduce.matches?' is-visible':''),'data-node':index+1});
   });
   root.classList.add('floating-enhanced');
  };
  const queue=()=>{if(!scheduled)scheduled=requestAnimationFrame(draw);};
  draw();
  if('IntersectionObserver' in window){
   const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(!entry.isIntersecting)return;seen.add(entry.target);entry.target.classList.add('is-visible');svg.querySelectorAll('[data-node="'+nodes.indexOf(entry.target)+'"]').forEach(path=>path.classList.add('is-visible'));observer.unobserve(entry.target);});},{threshold:.08});
   nodes.forEach(node=>observer.observe(node));
   if(!reduce.matches)root.classList.add('floating-motion');
  }
  nodes.forEach(node=>{
   node.addEventListener('mouseenter',()=>highlight(node,true));
   node.addEventListener('mouseleave',()=>highlight(node,node.contains(document.activeElement)));
   node.addEventListener('focusin',()=>highlight(node,true));
   node.addEventListener('focusout',event=>{if(!node.contains(event.relatedTarget))highlight(node,false);});
  });
  if('ResizeObserver' in window)new ResizeObserver(queue).observe(root);
  window.addEventListener('resize',queue,{passive:true});
  document.fonts?.ready.then(queue);
  reduce.addEventListener('change',()=>{root.classList.toggle('floating-motion',!reduce.matches&&'IntersectionObserver' in window);queue();});
 });
 const nav=document.querySelector('.floating-nav');
 if(nav&&'IntersectionObserver' in window){
  const links=[...nav.querySelectorAll('a')];const visible=new Set();
  const mark=id=>links.forEach(link=>{if(link.hash==='#'+id)link.setAttribute('aria-current','true');else link.removeAttribute('aria-current');});
  const observer=new IntersectionObserver(entries=>{
   entries.forEach(entry=>{if(entry.isIntersecting)visible.add(entry.target);else visible.delete(entry.target);});
   const nearest=[...visible].sort((a,b)=>Math.abs(a.getBoundingClientRect().top-140)-Math.abs(b.getBoundingClientRect().top-140))[0];
   if(nearest)mark(nearest.id);
  },{rootMargin:'-100px 0px -20% 0px',threshold:0});
  document.querySelectorAll('.floating-category').forEach(category=>observer.observe(category));
  links.forEach(link=>link.addEventListener('click',()=>mark(link.hash.slice(1))));
 }
})();
