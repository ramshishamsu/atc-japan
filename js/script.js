
function initMachineryCarousel(){
  const carousel=document.getElementById('machineryCarousel');
  if(!carousel) return;
  const slides=[...carousel.querySelectorAll('.machinery-slide')];
  const dots=[...carousel.querySelectorAll('.machinery-carousel-dots button')];
  if(slides.length<2) return;
  let current=0, timer;
  const show=(index)=>{
    current=(index+slides.length)%slides.length;
    slides.forEach((slide,i)=>slide.classList.toggle('active',i===current));
    dots.forEach((dot,i)=>{dot.classList.toggle('active',i===current);dot.setAttribute('aria-pressed',i===current?'true':'false');});
  };
  const restart=()=>{clearInterval(timer);timer=setInterval(()=>show(current+1),5000);};
  carousel.querySelector('.prev')?.addEventListener('click',()=>{show(current-1);restart();});
  carousel.querySelector('.next')?.addEventListener('click',()=>{show(current+1);restart();});
  dots.forEach((dot,i)=>dot.addEventListener('click',()=>{show(i);restart();}));
  carousel.addEventListener('mouseenter',()=>clearInterval(timer));
  carousel.addEventListener('mouseleave',restart);
  carousel.addEventListener('focusin',()=>clearInterval(timer));
  carousel.addEventListener('focusout',restart);
  show(0);restart();
}

document.addEventListener("DOMContentLoaded", async () => {
  initMachineryCarousel();
  await loadVehicles();
  updateJapanTime();
  setInterval(updateJapanTime, 1000);

  fillYearSelects();
  renderBrandGrid('Truck');
  renderBodyGrid();
  renderHomeVehicles();

  const quick = document.getElementById("quickSearchForm");
  if(quick){
    quick.addEventListener("submit", e => {
      e.preventDefault();
      const p = new URLSearchParams();
      const fields = {category:"searchCategory",body:"searchBody",make:"searchMake",fromYear:"searchFromYear",toYear:"searchToYear",keyword:"searchKeyword"};
      Object.entries(fields).forEach(([key,id])=>{
        const el=document.getElementById(id);
        if(el && el.value) p.set(key,el.value);
      });
      location.href = "stock.html?" + p.toString();
    });
  }

  if(document.getElementById("stockGrid")) initStockPage();
  if(document.getElementById("contactForm")) initContactForm();
  if(document.getElementById("vehicleDetails")) initVehicleDetails();
});

function updateJapanTime(){
  const el=document.getElementById("japanTime");
  if(!el) return;
  el.textContent=new Intl.DateTimeFormat("en-GB",{timeZone:"Asia/Tokyo",hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:false}).format(new Date());
}

function fillYearSelects(){
  const selects=[document.getElementById("searchFromYear"),document.getElementById("searchToYear")];
  selects.forEach(s=>{
    if(!s) return;
    for(let y=2026;y>=2000;y--){ const o=document.createElement("option"); o.value=y; o.textContent=y; s.appendChild(o); }
  });
}

function renderBrandGrid(category="Truck"){
  const grid=document.getElementById("brandGrid");
  if(!grid) return;
  const brands=brandGroups[category] || brandGroups.Truck || [];
  grid.innerHTML=brands.map(([name,logo])=>`
    <a class="brand-card" href="stock.html?category=${encodeURIComponent(category)}&make=${encodeURIComponent(name)}" aria-label="View ${escapeHtml(name)} ${escapeHtml(category)}">
      <span class="brand-logo"><img src="${logo}" alt="${escapeHtml(name)} logo" loading="lazy"></span>
      <span class="brand-name">${escapeHtml(name)}</span>
    </a>`).join("");
}

function renderBodyGrid(){
  const grid=document.getElementById("bodyGrid"); if(!grid) return;
  grid.innerHTML=bodyTypes.map(([name,icon])=>`
    <a class="body-card" href="stock.html?body=${encodeURIComponent(name)}">
      <i class="fa-solid ${icon}"></i><span>${name}</span>
    </a>`).join("");
}

function goCategory(category){ location.href="stock.html?category="+encodeURIComponent(category); }

function filterHomeCategory(category,btn){
  document.querySelectorAll(".category-tab").forEach(x=>{
    x.classList.toggle("active", x===btn);
    x.setAttribute("aria-pressed", x===btn ? "true" : "false");
  });
  renderBrandGrid(category);
  const title=document.getElementById("homeVehicleTitle");
  if(title) title.textContent=category==="Truck"?"Used Trucks":category==="Car"?"Used Cars":"Used Machinery";
  const selected=getVehicles().filter(v=>String(v.category||"").toLowerCase()===category.toLowerCase()).slice(0,4);
  renderVehicleCards("homeVehicles",selected);
}

function renderHomeVehicles(){
  const all=getVehicles();
  renderVehicleCards("homeVehicles",all.filter(v=>v.category==="Car").slice(0,4));
  renderVehicleCards("homeTrucks",all.filter(v=>v.category==="Truck").slice(0,4));
  renderVehicleCards("homeMachinery",all.filter(v=>v.category==="Machinery").slice(0,4));
}

function renderVehicleCards(targetId, vehicles){
  const target=document.getElementById(targetId); if(!target) return;
  if(!vehicles.length){ target.innerHTML='<div class="empty-state">No vehicles found.</div>'; return; }
  target.innerHTML=vehicles.map(vehicleCard).join("");
}

function vehicleCard(v){
  const image=(Array.isArray(v.images)&&v.images[0])||v.image||"";
  return `<article class="vehicle-card">
    <div class="vehicle-image-wrap"><img src="${image}" alt="${escapeHtml(v.name)}" loading="lazy"><span class="vehicle-badge">${escapeHtml(v.category)}</span><button class="heart-btn" aria-label="Favorite"><i class="fa-regular fa-heart"></i></button></div>
    <div class="vehicle-card-body">
      <h3>${escapeHtml(v.name)}</h3>
      <div class="spec-grid">
        <span><i class="fa-solid fa-calendar"></i>${v.year}</span><span><i class="fa-solid fa-gears"></i>${escapeHtml(v.body)}</span>
        <span><i class="fa-solid fa-gas-pump"></i>${escapeHtml(v.fuel)}</span><span><i class="fa-solid fa-gauge-high"></i>${escapeHtml(v.mileage)}</span>
        <span><i class="fa-solid fa-gear"></i>${escapeHtml(v.transmission)}</span><span><i class="fa-solid fa-road"></i>${escapeHtml(v.drive)}</span>
      </div>
      <div class="stock-id">Stock ID: <b>${escapeHtml(v.id)}</b></div>
      <div class="vehicle-bottom"><strong>$${Number(v.price).toLocaleString()}</strong><a href="vehicle-details.html?id=${encodeURIComponent(v.id)}" class="btn btn-outline-dark btn-sm">View Details <i class="fa-solid fa-arrow-right"></i></a></div>
      <a class="card-whatsapp" href="https://wa.me/818032521347?text=${encodeURIComponent("Hello ATC JAPAN, I am interested in stock "+v.id+" - "+v.name)}" target="_blank" rel="noopener"><i class="fa-brands fa-whatsapp"></i> WhatsApp Inquiry</a>
    </div>
  </article>`;
}

function initStockPage(){
  const params=new URLSearchParams(location.search);
  const makeEl=document.getElementById("stockMake"), bodyEl=document.getElementById("stockBody");
  [...new Set(getVehicles().map(v=>v.make))].sort().forEach(x=>makeEl.insertAdjacentHTML("beforeend",`<option>${escapeHtml(x)}</option>`));
  [...new Set(getVehicles().map(v=>v.body))].sort().forEach(x=>bodyEl.insertAdjacentHTML("beforeend",`<option>${escapeHtml(x)}</option>`));

  let activeCategory=params.get("category")||"";
  document.querySelectorAll("[data-stock-category]").forEach(btn=>{
    btn.classList.toggle("active",btn.dataset.stockCategory===activeCategory);
    btn.addEventListener("click",()=>{ activeCategory=btn.dataset.stockCategory; document.querySelectorAll("[data-stock-category]").forEach(b=>b.classList.remove("active")); btn.classList.add("active"); applyStockFilters(); });
  });
  if(params.get("make")){
    const requestedMake=params.get("make");
    if(![...makeEl.options].some(option=>option.value.toLowerCase()===requestedMake.toLowerCase())){
      const option=document.createElement("option");
      option.value=requestedMake;
      option.textContent=requestedMake;
      makeEl.appendChild(option);
    }
    makeEl.value=requestedMake;
  }
  if(params.get("body")) bodyEl.value=params.get("body");
  if(params.get("keyword")) document.getElementById("stockKeyword").value=params.get("keyword");
  document.getElementById("stockSearchBtn").addEventListener("click",applyStockFilters);
  document.getElementById("clearStock").addEventListener("click",()=>{ activeCategory=""; makeEl.value="";bodyEl.value="";document.getElementById("stockKeyword").value="";document.querySelectorAll("[data-stock-category]").forEach(b=>b.classList.toggle("active",!b.dataset.stockCategory));applyStockFilters(); });
  applyStockFilters();

  function applyStockFilters(){
    const make=makeEl.value.toLowerCase(), body=bodyEl.value.toLowerCase(), keyword=document.getElementById("stockKeyword").value.toLowerCase();
    const result=getVehicles().filter(v=>(!activeCategory||v.category===activeCategory)&&(!make||v.make.toLowerCase()===make)&&(!body||v.body.toLowerCase()===body)&&(!keyword||`${v.name} ${v.id} ${v.make}`.toLowerCase().includes(keyword)));
    document.getElementById("stockCountTitle").textContent=`${result.length} Vehicle${result.length!==1?"s":""} Found`;
    renderVehicleCards("stockGrid",result);
  }
}

function initContactForm(){
  const p=new URLSearchParams(location.search); const stock=p.get("stock");
  if(stock) document.getElementById("contactStock").value=stock;
  document.getElementById("contactForm").addEventListener("submit",e=>{
    e.preventDefault();
    const checks=[...document.querySelectorAll('#contactForm input[type="checkbox"]:checked')].map(x=>x.value).join(", ")||"Not specified";
    const body=`Name: ${document.getElementById("contactName").value}\nEmail: ${document.getElementById("contactEmail").value}\nCountry: ${document.getElementById("contactCountry").value}\nStock ID: ${document.getElementById("contactStock").value}\nSearching for: ${checks}\n\nMessage:\n${document.getElementById("contactMessage").value}`;
    location.href=`mailto:bashirtokyo@gmail.com?subject=${encodeURIComponent("ATC JAPAN Vehicle Inquiry")}&body=${encodeURIComponent(body)}`;
  });
}

function escapeHtml(str){return String(str).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));}


function initVehicleDetails(){
  const target=document.getElementById("vehicleDetails"); if(!target) return;
  const id=new URLSearchParams(location.search).get("id");
  const vehicle=getVehicles().find(v=>v.id===id);
  if(!vehicle){ target.innerHTML='<div class="empty-state"><h3>Vehicle not found</h3><p>This stock may have been removed or the link is invalid.</p><a class="btn btn-orange" href="stock.html">Back to Stock</a></div>'; return; }
  const images=(vehicle.images&&vehicle.images.length?vehicle.images:[vehicle.image]).filter(Boolean);
  const title=document.getElementById("detailsTitle"); if(title) title.textContent=vehicle.name;
  const gallery=images.length ? `<div class="details-gallery"><div class="details-main-image"><img id="detailsMainImage" src="${images[0]}" alt="${escapeHtml(vehicle.name)}"></div><div class="details-thumbs">${images.map((img,i)=>`<button class="details-thumb ${i===0?'active':''}" data-image="${img}" aria-label="View photo ${i+1}"><img src="${img}" alt=""></button>`).join("")}</div></div>` : '';
  const message=`Hello ATC JAPAN, I am interested in stock ${vehicle.id} - ${vehicle.name}.`;
  target.innerHTML=`<div class="details-top"><a class="back-stock" href="stock.html"><i class="fa-solid fa-arrow-left"></i> Back to Stock</a><span class="vehicle-badge static">${escapeHtml(vehicle.category)}</span></div>
  <div class="details-layout">
    ${gallery}
    <div class="details-info">
      <span class="section-kicker">STOCK ID: ${escapeHtml(vehicle.id)}</span><h2>${escapeHtml(vehicle.name)}</h2><div class="details-price">$${Number(vehicle.price).toLocaleString()}</div>
      <div class="details-specs">
        ${detailSpec('Year','calendar',vehicle.year)}${detailSpec('Make','car-side',vehicle.make)}${detailSpec('Model','car',vehicle.model||vehicle.name.replace(/^\d{4}\s+/,'').replace(new RegExp('^'+escapeRegExp(vehicle.make)+'\\s*','i'),''))}${detailSpec('Body Type','gears',vehicle.body)}${detailSpec('Fuel','gas-pump',vehicle.fuel)}${detailSpec('Mileage / Hours','gauge-high',vehicle.mileage)}${detailSpec('Transmission','gear',vehicle.transmission)}${detailSpec('Drive','road',vehicle.drive)}
      </div>
      <p class="details-description">${escapeHtml(vehicle.description||'Quality Japanese used vehicle available for worldwide export from ATC JAPAN.')}</p>
      <div class="details-actions"><a class="btn btn-whatsapp" href="https://wa.me/818032521347?text=${encodeURIComponent(message)}" target="_blank" rel="noopener"><i class="fa-brands fa-whatsapp"></i> Enquire on WhatsApp</a><a class="btn btn-orange" href="contact.html?stock=${encodeURIComponent(vehicle.id)}"><i class="fa-solid fa-envelope"></i> Send Enquiry</a></div>
    </div>
  </div>`;
  target.querySelectorAll('.details-thumb').forEach(btn=>btn.addEventListener('click',()=>{ target.querySelectorAll('.details-thumb').forEach(x=>x.classList.remove('active')); btn.classList.add('active'); document.getElementById('detailsMainImage').src=btn.dataset.image; }));
}
function detailSpec(label,icon,value){ return `<div><i class="fa-solid fa-${icon}"></i><span>${escapeHtml(label)}</span><strong>${escapeHtml(value??'—')}</strong></div>`; }
function escapeRegExp(str){ return String(str).replace(/[.*+?^${}()|[\]\\]/g,'\\$&'); }

