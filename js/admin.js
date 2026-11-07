let selectedImages=[];
let adminVehicles=[];
let adminToken=sessionStorage.getItem('atcAdminToken')||'';
const apiUrl='/.netlify/functions/vehicles';

document.addEventListener('DOMContentLoaded',()=>{
  const login=document.getElementById('adminLogin'),app=document.getElementById('adminApp');
  const loginBtn=document.getElementById('adminLoginBtn');
  if(adminToken){login.classList.add('d-none');app.classList.remove('d-none');initAdmin();}
  loginBtn.addEventListener('click',loginAdmin);
  document.getElementById('adminPassword').addEventListener('keydown',e=>{if(e.key==='Enter')loginAdmin();});
});
async function request(action,payload={},auth=true){
  let response;
  try {
    response=await fetch(apiUrl,{method:'POST',headers:{'Content-Type':'application/json',...(auth?{Authorization:`Bearer ${adminToken}`}:{})},body:JSON.stringify({action,...payload})});
  } catch(error) {
    throw new Error('Cannot reach the Netlify admin function. Check that this site is deployed on Netlify and that /.netlify/functions/vehicles is available.');
  }
  const data=await response.json().catch(()=>({}));
  if(!response.ok){
    if(response.status===404) throw new Error('Admin function not found. Redeploy the complete project folder to Netlify, including netlify/functions/vehicles.js.');
    if(response.status===503) throw new Error(data.error||'Admin is not configured. Add the required Netlify environment variables and redeploy.');
    throw new Error(data.error||`Request failed (HTTP ${response.status}).`);
  }
  return data;
}
async function loginAdmin(){
  const button=document.getElementById('adminLoginBtn');
  const password=document.getElementById('adminPassword').value;
  if(!password){alert('Please enter your admin password.');return;}
  button.disabled=true;
  try{
    const data=await request('login',{password},false);
    if(!data.token) throw new Error('The server did not return an admin session. Check the Netlify function deployment.');
    adminToken=data.token;
    sessionStorage.setItem('atcAdminToken',adminToken);
    document.getElementById('adminLogin').classList.add('d-none');
    document.getElementById('adminApp').classList.remove('d-none');
    await initAdmin();
  } catch(e) {
    adminToken='';
    sessionStorage.removeItem('atcAdminToken');
    alert(e.message==='Incorrect password'
      ? 'Incorrect admin password. It must exactly match the ADMIN_PASSWORD value in Netlify environment variables. After changing that value, trigger a new deploy.'
      : e.message);
  } finally {button.disabled=false;}
}
async function initAdmin(){
  try{const response=await fetch(apiUrl,{cache:'no-store'});const data=await response.json();if(!response.ok)throw new Error(data.error||'Could not load inventory');adminVehicles=(data.vehicles||[]).map(normalizeVehicle);renderAdmin();}
  catch(e){alert('Cannot connect to the shared inventory. Check Netlify setup. '+e.message);}
  document.getElementById('vehicleForm').addEventListener('submit',saveVehicle);
  document.getElementById('cancelEdit').addEventListener('click',resetForm);
  document.getElementById('adminSearch').addEventListener('input',renderAdminTable);
  document.getElementById('vImages').addEventListener('change',handleImageSelection);
  document.getElementById('adminLogout').addEventListener('click',()=>{sessionStorage.removeItem('atcAdminToken');location.reload();});
  document.getElementById('exportBackup')?.addEventListener('click',exportVehicleBackup);
  document.getElementById('importBackup')?.addEventListener('change',importVehicleBackup);
}
function renderAdmin(){renderAdminStats();renderAdminTable();updateStorageInfo();}
function renderAdminStats(){const v=adminVehicles;document.getElementById('statVehicles').textContent=v.length;document.getElementById('statTrucks').textContent=v.filter(x=>x.category==='Truck').length;document.getElementById('statCars').textContent=v.filter(x=>x.category==='Car').length;document.getElementById('statMachinery').textContent=v.filter(x=>x.category==='Machinery').length;}
function renderAdminTable(){
 const q=(document.getElementById('adminSearch')?.value||'').toLowerCase(),body=document.getElementById('adminVehicleTable');
 const rows=adminVehicles.filter(v=>`${v.name} ${v.id} ${v.make} ${v.category}`.toLowerCase().includes(q));
 body.innerHTML=rows.length?rows.map(v=>{const img=(v.images&&v.images[0])||v.image||'';return `<tr><td><div class="admin-vehicle"><img src="${img}" alt=""><div><strong>${escapeHtml(v.name)}</strong><small>${escapeHtml(v.id)} · ${(v.images||[]).length} photos</small></div></div></td><td><span class="table-pill">${escapeHtml(v.category)}</span></td><td>${escapeHtml(v.make)}</td><td>${v.year}</td><td>$${Number(v.price).toLocaleString()}</td><td><button class="btn btn-sm btn-outline-dark me-1" onclick="editVehicle('${escapeHtml(v.id)}')"><i class="fa-solid fa-pen"></i></button><button class="btn btn-sm btn-outline-danger" onclick="deleteVehicle('${escapeHtml(v.id)}')"><i class="fa-solid fa-trash"></i></button></td></tr>`;}).join(''):'<tr><td colspan="6" class="text-center text-muted py-4">No vehicles found.</td></tr>';
}
async function handleImageSelection(e){const files=[...e.target.files];if(!files.length)return;if(selectedImages.length+files.length>8){alert('Maximum 8 photos per vehicle.');e.target.value='';return;}try{const converted=await Promise.all(files.map(fileToDataUrl));selectedImages.push(...converted);renderImagePreview();}catch(err){alert(err.message||'Could not read an image.');}e.target.value='';}
function fileToDataUrl(file){return new Promise((resolve,reject)=>{if(!file.type.startsWith('image/'))return reject(new Error('Please select image files only.'));if(file.size>12*1024*1024)return reject(new Error('Each photo must be smaller than 12 MB.'));const reader=new FileReader();reader.onload=()=>{const img=new Image();img.onload=()=>{const max=1200,scale=Math.min(1,max/Math.max(img.width,img.height)),canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(img.width*scale));canvas.height=Math.max(1,Math.round(img.height*scale));canvas.getContext('2d').drawImage(img,0,0,canvas.width,canvas.height);resolve(canvas.toDataURL('image/jpeg',0.62));};img.onerror=()=>reject(new Error('Invalid image file.'));img.src=reader.result;};reader.onerror=()=>reject(new Error('Could not read image.'));reader.readAsDataURL(file);});}
function renderImagePreview(){const el=document.getElementById('imagePreview');el.innerHTML=selectedImages.map((src,i)=>`<div class="admin-image-item"><img src="${src}" alt="Vehicle photo ${i+1}"><button type="button" onclick="removeSelectedImage(${i})"><i class="fa-solid fa-xmark"></i></button><span>Photo ${i+1}${i===0?' · Main':''}</span></div>`).join('');document.getElementById('imageUploadHint').textContent=`${selectedImages.length} photo(s) selected. First photo is the main listing image.`;}
function removeSelectedImage(i){selectedImages.splice(i,1);renderImagePreview();}
async function saveVehicle(e){e.preventDefault();const submit=document.querySelector('#vehicleForm button[type="submit"]');submit.disabled=true;submit.textContent='Saving to shared website…';try{const id=document.getElementById('vehicleId').value||'ATC-'+Date.now().toString().slice(-6),old=adminVehicles.find(x=>x.id===id);if(!selectedImages.length){alert('Please keep or upload at least one photo.');return;}const vehicle={id,name:v('vName'),category:v('vCategory'),make:v('vMake'),model:v('vModel'),body:v('vBody'),year:Number(v('vYear')),mileage:v('vMileage'),fuel:v('vFuel'),transmission:v('vTransmission'),drive:v('vDrive'),price:Number(v('vPrice')),images:selectedImages,description:v('vDescription')};const data=await request('save',{vehicle});adminVehicles=data.vehicles.map(normalizeVehicle);alert(old?'Vehicle updated and published.':'Vehicle added and published.');resetForm();renderAdmin();}catch(err){alert('Could not publish vehicle: '+err.message);}finally{submit.disabled=false;submit.innerHTML='<i class="fa-solid fa-save"></i> Save Vehicle';}}
function v(id){return document.getElementById(id).value.trim();}
function editVehicle(id){const x=adminVehicles.find(v=>v.id===id);if(!x)return;const map={vName:'name',vCategory:'category',vMake:'make',vModel:'model',vBody:'body',vYear:'year',vMileage:'mileage',vFuel:'fuel',vTransmission:'transmission',vDrive:'drive',vPrice:'price',vDescription:'description'};Object.entries(map).forEach(([f,k])=>document.getElementById(f).value=x[k]??'');selectedImages=[...(x.images||[x.image]).filter(Boolean)];renderImagePreview();document.getElementById('vehicleId').value=x.id;document.getElementById('cancelEdit').classList.remove('d-none');document.querySelector('#vehicleForm button[type="submit"]').innerHTML='<i class="fa-solid fa-save"></i> Update Vehicle';location.hash='addVehicle';}
function resetForm(){document.getElementById('vehicleForm').reset();document.getElementById('vehicleId').value='';document.getElementById('cancelEdit').classList.add('d-none');selectedImages=[];renderImagePreview();document.querySelector('#vehicleForm button[type="submit"]').innerHTML='<i class="fa-solid fa-save"></i> Save Vehicle';}
async function deleteVehicle(id){if(!confirm('Delete this vehicle from the live website for all visitors?'))return;try{const data=await request('delete',{id});adminVehicles=data.vehicles.map(normalizeVehicle);renderAdmin();}catch(e){alert('Could not delete vehicle: '+e.message);}}
function updateStorageInfo(){const el=document.getElementById('storageInfo');if(el)el.textContent='Shared online inventory · Published vehicles are visible to all website visitors.';}
function exportVehicleBackup(){const blob=new Blob([JSON.stringify({exportedAt:new Date().toISOString(),vehicles:adminVehicles},null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='vehicles-backup.json';a.click();URL.revokeObjectURL(url);}
function importVehicleBackup(e){alert('For safety, restore is disabled in this version. Add or edit vehicles through the dashboard.');e.target.value='';}
function escapeHtml(str){return String(str??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));}
