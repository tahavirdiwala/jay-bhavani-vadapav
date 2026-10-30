import re,glob,html,json,os
R=os.path.expanduser('~/tahavirdiwala/jay-bhavani-vadapav/_scrape/mirror/jaybhavanivadapav.com/')
def rd(f):return open(R+f,encoding='utf8',errors='ignore').read()
def clean(s):return re.sub(r'\s+',' ',html.unescape(re.sub(r'<[^>]+>','',s))).strip()
# menu
skip={'index','about','career','catering','chat_','contact-us','franchise','gallery','store-locator'}
cats=[]
nav=rd('vadapav.html')
for f in sorted(glob.glob(R+'*.html')):
    n=os.path.basename(f)[:-5]
    h=rd(n+'.html')
    items=re.findall(r'<img src="(assets/img/products/[^"]+)"[^>]*>\s*</div>\s*<h3>(.*?)</h3>',h,re.S)
    if not items: continue
    title=re.search(r'<title>(.*?)</title>',h,re.S).group(1)
    cats.append({'slug':n,'title':clean(title).split('–')[0].strip(),'items':[{'name':clean(t),'img':i} for i,t in items]})
# label from nav
for c in cats:
    m=re.search(r'href="%s\.html"[^>]*>(.*?)</a>'%c['slug'],nav,re.S)
    if m:c['label']=clean(m.group(1))
    else:c['label']=c['title']
for c in cats:
    if c['slug']=='vadapav':c['label']='Vadapav'
    if c['slug']=='excotic-vadapav':c['label']='Exotic Vadapav'
# stores
h=rd('store-locator.html')
stores=[]
for m in re.finditer(r'<div class="col-lg-4[^"]*dealerdiv"([^>]*)>([\s\S]*?)(?=<div class="col-lg-4[^"]*dealerdiv"|\Z)',h):
    a=dict(re.findall(r'data-(\w+)="([^"]*)"',m.group(1)));b=m.group(2)
    ps=[clean(p) for p in re.findall(r'<p[^>]*>([\s\S]*?)</p>',b)]
    link=re.search(r'href="(http[^"]+)"[^>]*btn_cus',b)
    stores.append({'area':a.get('area'),'city':a.get('city'),'state':a.get('state'),'country':a.get('country'),'address':ps[0] if ps else '','hours':ps[-1] if ps else '','map':link.group(1) if link else ''})
# timeline
ab=rd('about.html')
tl=[]
for m in re.finditer(r"url\('(assets/img/our-story/[^']+)'\)[\s\S]*?class=\"year\">(\d{4})</span>\s*<p>([\s\S]*?)</p>",ab):
    tl.append({'year':m.group(2),'img':m.group(1),'text':clean(m.group(3))})
os.makedirs(os.path.expanduser('~/tahavirdiwala/jay-bhavani-vadapav/_scrape/'),exist_ok=True)
json.dump({'menu':cats,'stores':stores,'timeline':tl},open(os.path.expanduser('~/tahavirdiwala/jay-bhavani-vadapav/_scrape/data.json'),'w'),indent=1,ensure_ascii=False)
print(len(cats),sum(len(c['items']) for c in cats),len(stores),len(tl))
from collections import Counter
print(Counter(s['country'] for s in stores))
print([c['label'] for c in cats])
