// Splits the logo into: base (oval + wire + text, no nails) and one transparent image per nail piece.
// Thick shapes survive a morphological opening; thin shapes (nails) do not, so they fall out as their own layer.
import sharp from 'sharp'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..')
const OUT=path.join(ROOT,'public','logo-parts')
fs.rmSync(OUT,{recursive:true,force:true});fs.mkdirSync(OUT,{recursive:true})
const R_SIL=+process.env.R_SIL||36, R_WHITE=+process.env.R_WHITE||8
const { data: orig, info } = await sharp(path.join(ROOT,'public','logo.png')).ensureAlpha().raw().toBuffer({resolveWithObject:true})
const w=info.width,h=info.height,N=w*h
// ---- exact squared EDT (Felzenszwalb) ----
function edt(mask){ // distance^2 to nearest pixel where mask==0
 const INF=1e12,f=new Float64Array(Math.max(w,h)),d=new Float64Array(Math.max(w,h)),v=new Int32Array(Math.max(w,h)),z=new Float64Array(Math.max(w,h)+1)
 const g=new Float64Array(N)
 const pass=(len,get,set)=>{let k=0;v[0]=0;z[0]=-INF;z[1]=INF
  for(let q=1;q<len;q++){let s;do{const p=v[k];s=((f[q]+q*q)-(f[p]+p*p))/(2*q-2*p);if(s<=z[k]){k--}else break}while(k>=0);if(k<0){k=0;v[0]=q;z[0]=-INF;z[1]=INF;continue}k++;v[k]=q;z[k]=s;z[k+1]=INF}
  k=0;for(let q=0;q<len;q++){while(z[k+1]<q)k++;const p=v[k];set(q,(q-p)*(q-p)+f[p])}}
 for(let x=0;x<w;x++){for(let y=0;y<h;y++)f[y]=mask[y*w+x]?INF:0;pass(h,null,(y,val)=>{g[y*w+x]=val})}
 const out=new Float64Array(N)
 for(let y=0;y<h;y++){for(let x=0;x<w;x++)f[x]=g[y*w+x];pass(w,null,(x,val)=>{out[y*w+x]=val})}
 return out}
const erode=(m,r)=>{const e=edt(m),o=new Uint8Array(N);for(let i=0;i<N;i++)o[i]=m[i]&&e[i]>r*r?1:0;return o}
const dilate=(m,r)=>{const inv=new Uint8Array(N);for(let i=0;i<N;i++)inv[i]=m[i]?0:1;const e=edt(inv),o=new Uint8Array(N);for(let i=0;i<N;i++)o[i]=m[i]||e[i]<=r*r?1:0;return o}
const open=(m,r)=>dilate(erode(m,r),r)
// ---- silhouette of the oval (nails outside are thinner than the opening) ----
const opaque=new Uint8Array(N);for(let i=0;i<N;i++)opaque[i]=orig[i*4+3]>128?1:0
const sil=open(opaque,R_SIL)
const silG=dilate(sil,3)
// ---- thick white structures inside the oval ----
const white=new Uint8Array(N);for(let i=0;i<N;i++)white[i]=sil[i]&&orig[i*4]>165&&orig[i*4+1]>150&&orig[i*4+3]>128?1:0
const thick=open(white,R_WHITE)
const thickG=dilate(thick,1)
// ---- base ----
const base=Buffer.alloc(N*4)
const BLUE=[92,108,242]
for(let i=0;i<N;i++){
 if(!silG[i]||orig[i*4+3]===0)continue
 // keep original anti-aliased edge alpha; paint flat blue/white inside
 const isWhite=thick[i]
 const c=isWhite?[255,255,255]:BLUE
 // soften the edge between white and blue using the original pixel when it is a mix
 base[i*4]=c[0];base[i*4+1]=c[1];base[i*4+2]=c[2];base[i*4+3]=orig[i*4+3]
}
// ---- nail layer: exterior opaque pixels + interior thin white pixels ----
const layerMask=new Uint8Array(N)
for(let i=0;i<N;i++){
 if(orig[i*4+3]<20)continue
 const exterior=!silG[i]
 const interiorThin=sil[i]&&white[i]&&!thickG[i]
 layerMask[i]=exterior||interiorThin?1:0}
// components
const lab=new Int32Array(N);const comps=[]
for(let s=0;s<N;s++){if(!layerMask[s]||lab[s])continue
 const id=comps.length+1;const st=[s];lab[s]=id;const px=[]
 while(st.length){const p=st.pop();px.push(p);const x=p%w,y=(p/w)|0
  for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++){const nx=x+dx,ny=y+dy;if(nx<0||ny<0||nx>=w||ny>=h)continue;const q=ny*w+nx;if(layerMask[q]&&!lab[q]){lab[q]=id;st.push(q)}}}
 comps.push(px)}
// silhouette centre
let ox=0,oy=0,on=0;for(let i=0;i<N;i++)if(sil[i]){ox+=i%w;oy+=(i/w)|0;on++};ox/=on;oy/=on
const parts=[]
let dropped=0,merged=0
for(const px of comps){
 if(px.length<260){ // tiny: interior bits go back into the base so the final logo stays complete; exterior specks are dropped
  for(const p of px){if(sil[p]){base[p*4]=255;base[p*4+1]=255;base[p*4+2]=255;base[p*4+3]=orig[p*4+3];merged++}else dropped++}
  continue}
 let mx=0,my=0;for(const p of px){mx+=p%w;my+=(p/w)|0}mx/=px.length;my/=px.length
 let sxx=0,syy=0,sxy=0;for(const p of px){const x=(p%w)-mx,y=((p/w)|0)-my;sxx+=x*x;syy+=y*y;sxy+=x*y}
 const th=0.5*Math.atan2(2*sxy,sxx-syy);let dx=Math.cos(th),dy=Math.sin(th)
 // direction pointing away from the oval centre (the side the nail enters from)
 if((mx-ox)*dx+(my-oy)*dy<0){dx=-dx;dy=-dy}
 let x0=w,y0=h,x1=0,y1=0;for(const p of px){const x=p%w,y=(p/w)|0;if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y}
 const bw=x1-x0+1,bh=y1-y0+1;const layer=Buffer.alloc(bw*bh*4)
 for(const p of px){const x=p%w,y=(p/w)|0;const o=((y-y0)*bw+(x-x0))*4;layer[o]=orig[p*4];layer[o+1]=orig[p*4+1];layer[o+2]=orig[p*4+2];layer[o+3]=orig[p*4+3]}
 const file=`nail-${parts.length}.webp`
 await sharp(layer,{raw:{width:bw,height:bh,channels:4}}).webp({quality:92,alphaQuality:100}).toFile(`${OUT}/${file}`)
 parts.push({file,x:x0,y:y0,w:bw,h:bh,dx,dy,cx:mx,cy:my,area:px.length})
}
// ---- group the pieces that belong to the same nail (same line, close together) ----
const parent=parts.map((_,i)=>i)
const find=(i)=>parent[i]===i?i:(parent[i]=find(parent[i]))
for(let i=0;i<parts.length;i++)for(let j=i+1;j<parts.length;j++){
 const a=parts[i],b=parts[j]
 let da=Math.abs(Math.atan2(a.dy,a.dx)-Math.atan2(b.dy,b.dx));da=Math.min(da,2*Math.PI-da);da=Math.min(da,Math.PI-da)
 if(da>0.2)continue
 const vx=b.cx-a.cx,vy=b.cy-a.cy
 const perpA=Math.abs(vx*a.dy-vy*a.dx),perpB=Math.abs(vx*b.dy-vy*b.dx),along=Math.abs(vx*a.dx+vy*a.dy)
 if(perpA<16&&perpB<16&&along<300)parent[find(j)]=find(i)}
const groups=new Map()
parts.forEach((p,i)=>{const r=find(i);if(!groups.has(r))groups.set(r,[]);groups.get(r).push(p)})
const nails=[...groups.values()].map((ps)=>{const big=ps.reduce((m,p)=>p.area>m.area?p:m);return{dx:+big.dx.toFixed(4),dy:+big.dy.toFixed(4),pieces:ps.map((p)=>({file:p.file,x:p.x,y:p.y,w:p.w,h:p.h}))}})
await sharp(base,{raw:{width:w,height:h,channels:4}}).webp({quality:92,alphaQuality:100}).toFile(`${OUT}/base.webp`)
fs.writeFileSync(path.join(ROOT,'src','data','logoParts.json'),JSON.stringify({w,h,center:{x:+ox.toFixed(1),y:+oy.toFixed(1)},nails}))
console.log({pieces:parts.length,nails:nails.length,mergedBackIntoBase:merged,droppedExteriorSpecks:dropped})
if(process.env.PREVIEW){ // optional: write base / recomposed previews on a dark background
 const dark=(buf)=>sharp({create:{width:w,height:h,channels:3,background:'#0B0B10'}}).composite([{input:buf}])
 await dark(await sharp(`${OUT}/base.webp`).png().toBuffer()).jpeg({quality:88}).toFile(path.join(process.env.PREVIEW,'base3.jpg'))
 const layers=await Promise.all(parts.map(async(n)=>({input:await sharp(`${OUT}/${n.file}`).png().toBuffer(),left:n.x,top:n.y})))
 await dark(await sharp(`${OUT}/base.webp`).composite(layers).png().toBuffer()).jpeg({quality:88}).toFile(path.join(process.env.PREVIEW,'recomposed3.jpg'))
}
