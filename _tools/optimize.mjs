import sharp from 'sharp';import fs from 'fs';import path from 'path';
const SRC=process.env.HOME+'/tahavirdiwala/jay-bhavani-vadapav/_scrape/mirror/jaybhavanivadapav.com/assets/img';
const OUT=process.env.HOME+'/tahavirdiwala/jay-bhavani-vadapav/public/img';
const skip=/shape|compubrain|flag|thumb|bg\.png/;
let n=0,before=0,after=0;
async function walk(d,rel=''){
  for(const f of fs.readdirSync(d)){
    const p=path.join(d,f),r=path.join(rel,f);
    if(fs.statSync(p).isDirectory()){await walk(p,r);continue}
    if(!/\.(jpe?g|png)$/i.test(f)||skip.test(r))continue;
    const o=path.join(OUT,r.replace(/\.(jpe?g|png)$/i,'.webp').toLowerCase());
    fs.mkdirSync(path.dirname(o),{recursive:true});
    const big=/banner|gallery|our-story|store|catring|25-years|franchise|about|contact|gallary|menu\.jpg/.test(r);
    const img=sharp(p).rotate().resize({width:big?1920:900,withoutEnlargement:true});
    await img.webp({quality:big?78:82,alphaQuality:90}).toFile(o);
    before+=fs.statSync(p).size;after+=fs.statSync(o).size;n++;
  }
}
await walk(SRC);
// favicon/logo keep png
for(const f of['logo.png','favicon.png','sticker-monogram.png']){fs.copyFileSync(path.join(SRC,f),path.join(OUT,f))}
console.log(n,(before/1e6).toFixed(1)+'MB ->',(after/1e6).toFixed(1)+'MB');
