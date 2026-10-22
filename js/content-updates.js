// Dynamic counters must not trigger a scan of the entire page every frame.
export function observeChangedContent(process,ignoreSelector=''){
 const pending=new Set();let queued=false;
 const ignored=node=>ignoreSelector&&(node.nodeType===1?node:node.parentElement)?.closest(ignoreSelector);
 const add=node=>{if((node.nodeType===1||node.nodeType===3)&&!ignored(node))pending.add(node);};
 const observer=new MutationObserver(mutations=>{
  for(const m of mutations){if(m.type==='characterData')add(m.target);else for(const node of m.addedNodes)add(node);}
  if(!pending.size||queued)return;queued=true;
  requestAnimationFrame(()=>{
   queued=false;const nodes=[...pending].filter(n=>n.isConnected&&!ignored(n));pending.clear();
   for(const node of nodes)if(!nodes.some(other=>other!==node&&other.contains(node)))process(node);
  });
 });
 observer.observe(document.body,{childList:true,subtree:true,characterData:true});
 return observer;
}
