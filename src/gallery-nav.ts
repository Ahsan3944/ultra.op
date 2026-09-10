export function installGalleryNav(){
  if(window.location.pathname.replace(/\/+$/,'')!=='/') return;
  const add=()=>{
    const nav=document.querySelector<HTMLElement>('.mobile-nav');
    if(!nav || nav.querySelector('[data-gallery-link="fan-art"]')) return;
    [['Fan Art','/fan-art/','fan-art'],['Assets','/assets/','assets']].forEach(([label,href,key])=>{
      const button=document.createElement('button');
      button.type='button'; button.textContent=label; button.dataset.galleryLink=key;
      button.addEventListener('click',()=>window.location.assign(href));
      nav.appendChild(button);
    });
  };
  const root=document.getElementById('root');
  if(!root) return;
  add();
  new MutationObserver(add).observe(root,{childList:true,subtree:true});
  window.setTimeout(add,300);
  window.setTimeout(add,1000);
}
