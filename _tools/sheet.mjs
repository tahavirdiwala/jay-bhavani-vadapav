import sharp from 'sharp';import fs from 'fs';
const dir='public/img/';const files=process.argv.slice(2);
const T=260;const cols=4;const rows=Math.ceil(files.length/cols);
const comps=[];
for(let i=0;i<files.length;i++){
 const b=await sharp(dir+files[i]).resize(T-10,T-30,{fit:'contain',background:'#334'}).flatten({background:'#334'}).toBuffer();
 const lbl=Buffer.from(`<svg width="${T}" height="20"><text x="4" y="14" font-size="12" fill="#fff">${files[i].slice(-30)}</text></svg>`);
 const x=(i%cols)*T,y=Math.floor(i/cols)*T;
 comps.push({input:b,left:x+5,top:y+20},{input:lbl,left:x,top:y});
}
await sharp({create:{width:T*cols,height:T*rows,channels:3,background:'#111'}}).composite(comps).jpeg({quality:70}).toFile(process.env.OUT);
