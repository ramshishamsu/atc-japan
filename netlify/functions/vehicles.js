const crypto = require('crypto');

const API = 'https://api.github.com';
const headers = () => ({
  'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
  'Accept': 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
  'User-Agent': 'ATC-JAPAN-Inventory'
});
const repoPath = (path) => `${API}/repos/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}/contents/${path}`;
const branch = () => process.env.GITHUB_BRANCH || 'main';
const json = (statusCode, body) => ({statusCode, headers:{'Content-Type':'application/json','Cache-Control':'no-store'}, body:JSON.stringify(body)});

function signToken(){
  const payload = Buffer.from(JSON.stringify({exp:Date.now()+8*60*60*1000, nonce:crypto.randomBytes(12).toString('hex')})).toString('base64url');
  const sig = crypto.createHmac('sha256',process.env.ADMIN_PASSWORD).update(payload).digest('base64url');
  return `${payload}.${sig}`;
}
function validToken(event){
  const token = event.headers.authorization || event.headers.Authorization || '';
  const [payload,sig] = token.replace(/^Bearer\s+/i,'').split('.');
  if(!payload || !sig) return false;
  const expected = crypto.createHmac('sha256',process.env.ADMIN_PASSWORD).update(payload).digest();
  let actual; try { actual=Buffer.from(sig,'base64url'); } catch(e){return false;}
  if(actual.length!==expected.length || !crypto.timingSafeEqual(actual,expected)) return false;
  try { return JSON.parse(Buffer.from(payload,'base64url').toString()).exp>Date.now(); } catch(e){return false;}
}
async function github(path, options={}){
  const res=await fetch(repoPath(path),{...options,headers:{...headers(),...(options.headers||{})}});
  const body=await res.json().catch(()=>({}));
  if(!res.ok) throw new Error(body.message || `GitHub API error ${res.status}`);
  return body;
}
async function getInventory(){
  try {
    const result=await github('vehicles.json');
    const decoded=Buffer.from(result.content.replace(/\n/g,''),'base64').toString('utf8');
    return JSON.parse(decoded);
  } catch(error){
    if(String(error.message).includes('Not Found')) return null;
    throw error;
  }
}
async function putFile(path, content, message){
  let sha;
  try { sha=(await github(path)).sha; } catch(e) { if(!String(e.message).includes('Not Found')) throw e; }
  return github(path,{method:'PUT',body:JSON.stringify({message,content,branch:branch(),...(sha?{sha}:{})})});
}
exports.handler = async (event) => {
  try {
    if(event.httpMethod==='GET'){
      if(!process.env.GITHUB_TOKEN || !process.env.GITHUB_OWNER || !process.env.GITHUB_REPO) return json(503,{error:'Inventory service is not configured yet.'});
      const vehicles=await getInventory();
      return json(200,{vehicles:Array.isArray(vehicles)?vehicles:[]});
    }
    if(event.httpMethod!=='POST') return json(405,{error:'Method not allowed'});
    if(!process.env.ADMIN_PASSWORD || !process.env.GITHUB_TOKEN || !process.env.GITHUB_OWNER || !process.env.GITHUB_REPO) return json(503,{error:'Netlify environment variables are not configured.'});
    const body=JSON.parse(event.body||'{}');
    if(body.action==='login'){
      const supplied=crypto.createHash('sha256').update(String(body.password||'')).digest();
      const configured=crypto.createHash('sha256').update(process.env.ADMIN_PASSWORD).digest();
      if(!crypto.timingSafeEqual(supplied,configured)) return json(401,{error:'Incorrect password'});
      return json(200,{token:signToken()});
    }
    if(!validToken(event)) return json(401,{error:'Admin session expired. Please log in again.'});
    if(body.action==='save'){
      const vehicle=body.vehicle;
      if(!vehicle || !vehicle.id || !vehicle.name || !Array.isArray(vehicle.images) || vehicle.images.length<1 || vehicle.images.length>8) return json(400,{error:'Vehicle details or photos are invalid. Upload 1–8 photos.'});
      const images=[];
      for(let i=0;i<vehicle.images.length;i++){
        const data=vehicle.images[i];
        if(typeof data==='string' && data.startsWith('https://')) { images.push(data); continue; }
        const match=String(data).match(/^data:image\/(jpeg|jpg|png|webp);base64,([A-Za-z0-9+/=]+)$/);
        if(!match) throw new Error('One of the selected photos is not a supported image.');
        const ext=match[1]==='jpeg'?'jpg':match[1];
        const file=`uploads/${String(vehicle.id).replace(/[^a-zA-Z0-9_-]/g,'')}-${Date.now()}-${i}.${ext}`;
        await putFile(file,match[2],`Upload ${vehicle.id} photo ${i+1}`);
        images.push(`https://raw.githubusercontent.com/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}/${branch()}/${file}`);
      }
      const clean={...vehicle,images,image:images[0]};
      const current=await getInventory() || [];
      const index=current.findIndex(v=>v.id===clean.id);
      if(index>=0) current[index]=clean; else current.unshift(clean);
      await putFile('vehicles.json',Buffer.from(JSON.stringify(current,null,2)).toString('base64'),`${index>=0?'Update':'Add'} vehicle ${clean.id}`);
      return json(200,{ok:true,vehicles:current});
    }
    if(body.action==='delete'){
      const current=await getInventory() || [];
      const next=current.filter(v=>v.id!==body.id);
      await putFile('vehicles.json',Buffer.from(JSON.stringify(next,null,2)).toString('base64'),`Delete vehicle ${body.id}`);
      return json(200,{ok:true,vehicles:next});
    }
    return json(400,{error:'Unknown action'});
  } catch(error){
    console.error(error);
    return json(500,{error:error.message || 'Unexpected server error'});
  }
};
