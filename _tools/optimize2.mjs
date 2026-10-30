import sharp from 'sharp';import fs from 'fs';import path from 'path';
const SRC=process.env.HOME+'/tahavirdiwala/jay-bhavani-vadapav/_scrape/mirror/jaybhavanivadapav.com/assets/img';
const OUT=process.env.HOME+'/tahavirdiwala/jay-bhavani-vadapav/public/img';
const jobs=[
 ['gallery',1600,78,''],['gallery',720,74,'t/'],            // lightbox + thumbs for grid/ring
 ['our-story',960,76,''],['products',560,80,''],['food-menu',640,82,''],
];
let n=0;
for(const [dir,w,q,sub] of jobs){
  for(const f of fs.readdirSync(path.join(SRC,dir),{recursive:true})){
    const p=path.join(SRC,dir,f); if(!fs.statSync(p).isFile()||!/\.(jpe?g|png)$/i.test(f))continue;
    const o=path.join(OUT,dir,sub+f.replace(/\.(jpe?g|png)$/i,'.webp').toLowerCase());
    fs.mkdirSync(path.dirname(o),{recursive:true});
    await sharp(p).rotate().resize({width:w,withoutEnlargement:true}).webp({quality:q,alphaQuality:90}).toFile(o);n++;
  }
}
for(const [f,w] of [['about.png',1100],['franchise.png',1100],['jbv-catring.jpg',1600],['contact.jpg',1200]]){
  await sharp(path.join(SRC,f)).resize({width:w,withoutEnlargement:true}).webp({quality:78}).toFile(path.join(OUT,f.replace(/\.(png|jpg)$/,'.webp')));n++;
}
for(let i=1;i<=8;i++){await sharp(path.join(SRC,`jbv-${i}.png`)).resize({width:800,withoutEnlargement:true}).webp({quality:78}).toFile(path.join(OUT,`jbv-${i}.webp`));n++}
await sharp(path.join(SRC,'jbv-md.jpg')).resize({width:800}).webp({quality:80}).toFile(path.join(OUT,'jbv-md.webp'));
console.log(n,'files');
