import json, sys, io
from PIL import Image
spec = json.load(open(sys.argv[1]))
out = {}
for item in spec:
    im = Image.open(item['src'])
    has_alpha = im.mode in ('RGBA','LA') or (im.mode == 'P' and 'transparency' in im.info)
    if has_alpha:
        im = im.convert('RGBA')
        # drop alpha if fully opaque
        if im.getchannel('A').getextrema() == (255,255):
            im = im.convert('RGB'); has_alpha=False
    else:
        im = im.convert('RGB')
    s = item['size']
    if max(im.size) > s:
        im = im.resize((s, s) if im.size[0]==im.size[1] else (s, int(im.size[1]*s/im.size[0])), Image.LANCZOS)
    buf = io.BytesIO()
    im.save(buf, 'WEBP', quality=item['q'], method=6)
    open(item['dst'],'wb').write(buf.getvalue())
    out[item['dst']] = [im.size[0], im.size[1], len(buf.getvalue()), has_alpha]
json.dump(out, open(sys.argv[2],'w'))
