let all=[];const t=document.querySelector('#cask-timeline');function render(items){t.innerHTML='';items.forEach(x=>t.insertAdjacentHTML('beforeend',`<article id="${x.anchor}" class="timeline-item" style="scroll-margin-top:100px"><div class="timeline-year">${x.year}</div><div class="timeline-main"><div><div class="status">${x.status}</div><div class="kicker">${x.distillery}</div><h3>${x.title}</h3><p class="subtitle">${x.subtitle}</p><ul class="timeline-details">${x.details.map(d=>`<li>${d}</li>`).join('')}</ul></div><div class="timeline-side">${x.image?`<figure class="timeline-photo${x.imageClass?` ${x.imageClass}`:'' }"><img class="zoomable-image" src="${x.image}" alt="${x.imageAlt||''}" loading="lazy" tabindex="0" role="button" aria-label="Enlarge image"><figcaption>${x.imageCaption||''}</figcaption></figure>`:''}<p>${x.note}</p></div></div></article>`))}(async()=>{try{all=await loadJSON('data/casks.json');all.sort((a,b)=>Number(b.year)-Number(a.year));render(all)}catch(e){if(t)t.innerHTML='<p class="quiet">We apologize, the content is unavailable for the moment due to technical difficulties.<br>Please come back later.</p>'}})()

const lightbox=document.createElement('div');
lightbox.className='image-lightbox';
lightbox.setAttribute('aria-hidden','true');
lightbox.innerHTML='<button class="image-lightbox-close" type="button" aria-label="Close enlarged image">×</button><img class="image-lightbox-img" alt="">';
document.body.appendChild(lightbox);
const lightboxImg=lightbox.querySelector('.image-lightbox-img');
const lightboxClose=lightbox.querySelector('.image-lightbox-close');
function openLightbox(img){
  lightboxImg.src=img.src;
  lightboxImg.alt=img.alt||'';
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden','false');
  document.body.classList.add('lightbox-open');
  lightboxClose.focus();
}
function closeLightbox(){
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden','true');
  lightboxImg.removeAttribute('src');
  document.body.classList.remove('lightbox-open');
}
t.addEventListener('click',e=>{
  const img=e.target.closest('.zoomable-image');
  if(img) openLightbox(img);
});
t.addEventListener('keydown',e=>{
  const img=e.target.closest('.zoomable-image');
  if(img&&(e.key==='Enter'||e.key===' ')){
    e.preventDefault();
    openLightbox(img);
  }
});
lightbox.addEventListener('click',e=>{
  if(e.target===lightbox||e.target===lightboxClose) closeLightbox();
});
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'&&lightbox.classList.contains('open')) closeLightbox();
});
