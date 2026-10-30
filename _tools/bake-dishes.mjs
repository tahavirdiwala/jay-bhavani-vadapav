// Bakes each dish's 3D relief ONCE at build time: a normal map (png) + a 65x65 height grid (base64 in heights.json).
// The browser then does zero image processing at runtime.
import sharp from 'sharp';import fs from 'fs';import path from 'path';
const ROOT=process.env.HOME+'/tahavirdiwala/jay-bhavani-vadapav/public';
const OUT=ROOT+'/3d';fs.mkdirSync(OUT,{recursive:true});
const S=192,G=65;
const box=(src,r)=>{const t=new Float32Array(S*S),o=new Float32Array(S*S);
 for(let y=0;y<S;y++)for(let x=0;x<S;x++){let s=0;for(let k=-r;k<=r;k++){const xx=x+k;if(xx>=0&&xx<S)s+=src[y*S+xx]}t[y*S+x]=s/(2*r+1)}
 for(let y=0;y<S;y++)for(let x=0;x<S;x++){let s=0;for(let k=-r;k<=r;k++){const yy=y+k;if(yy>=0&&yy<S)s+=t[yy*S+x]}o[y*S+x]=s/(2*r+1)}return o};
const out={};
for(const f of fs.readdirSync(ROOT+'/img/food-menu')){
  const key=f.replace('.webp','');
  const {data}=await sharp(ROOT+'/img/food-menu/'+f).resize(S,S,{fit:'fill'}).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  const a=new Float32Array(S*S),lum=new Float32Array(S*S);
  for(let i=0;i<S*S;i++){a[i]=data[i*4+3]>200?1:0;lum[i]=(data[i*4]*.3+data[i*4+1]*.59+data[i*4+2]*.11)/255}
  const h=box(box(box(a,6),6),5),H=new Float32Array(S*S);
  for(let i=0;i<S*S;i++)H[i]=Math.pow(Math.min(1,h[i]*1.35),.7)*(.92+.08*lum[i]);
  // normal map
  const K=3.2,at=(x,y)=>H[Math.max(0,Math.min(S-1,y))*S+Math.max(0,Math.min(S-1,x))];
  const nb=Buffer.alloc(S*S*3);
  for(let y=0;y<S;y++)for(let x=0;x<S;x++){const dx=(at(x+1,y)-at(x-1,y))*K,dy=(at(x,y+1)-at(x,y-1))*K,l=Math.hypot(dx,dy,1),i=(y*S+x)*3;
    nb[i]=(-dx/l*.5+.5)*255;nb[i+1]=(dy/l*.5+.5)*255;nb[i+2]=(1/l*.5+.5)*255}
  await sharp(nb,{raw:{width:S,height:S,channels:3}}).png({compressionLevel:9}).toFile(`${OUT}/${key}-n.png`);
  // height grid (bilinear), row 0 = top, matching THREE.PlaneGeometry vertex order
  const g=Buffer.alloc(G*G);
  for(let j=0;j<G;j++)for(let i=0;i<G;i++){const u=i/(G-1)*(S-1),v=j/(G-1)*(S-1),x0=Math.min(S-2,Math.floor(u)),y0=Math.min(S-2,Math.floor(v)),fx=u-x0,fy=v-y0;
    const hh=(H[y0*S+x0]*(1-fx)+H[y0*S+x0+1]*fx)*(1-fy)+(H[(y0+1)*S+x0]*(1-fx)+H[(y0+1)*S+x0+1]*fx)*fy;g[j*G+i]=Math.round(hh*255)}
  out[key]=g.toString('base64');
}
fs.writeFileSync(OUT+'/heights.json',JSON.stringify(out));
console.log(Object.keys(out).length,'dishes baked',(fs.statSync(OUT+'/heights.json').size/1024).toFixed(0)+'KB');
