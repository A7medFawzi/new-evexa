#!/usr/bin/env python3
"""Convert used raster images to WebP (max 2000px wide), rewrite all
references across src/, delete the originals. Brand favicons stay PNG."""
import os, re
from PIL import Image

ROOT = "/home/z/my-project"
MAX_W = 2000
QUALITY = 82

# 1. collect used raster images
blob_files = []
for root, dirs, files in os.walk(os.path.join(ROOT, "src")):
    for fn in files:
        if fn.endswith((".html", ".css", ".ts", ".tsx", ".js")):
            blob_files.append(os.path.join(root, fn))
B = "\n".join(open(f, encoding="utf8", errors="ignore").read() for f in blob_files)

used = []
for root, dirs, files in os.walk(os.path.join(ROOT, "public/images")):
    for fn in files:
        full = os.path.join(root, fn)
        rel = "/" + os.path.relpath(full, os.path.join(ROOT, "public")).replace(os.sep, "/")
        if rel.startswith("/images/brand/") or fn.endswith(".svg"):
            continue
        if fn in B:
            used.append((rel, full))

print(f"converting {len(used)} used raster images...")

# 2. convert
new_names = {}  # old basename -> new basename
tot_before = tot_after = 0
for rel, full in used:
    base, ext = os.path.splitext(os.path.basename(full))
    webp_rel = rel.rsplit(".", 1)[0] + ".webp"
    webp_full = os.path.join(ROOT, "public", webp_rel.lstrip("/"))
    img = Image.open(full)
    w, h = img.size
    if w > MAX_W:
        img = img.resize((MAX_W, round(h * MAX_W / w)), Image.LANCZOS)
    if img.mode in ("RGBA", "P", "LA"):
        img = img.convert("RGBA")
    else:
        img = img.convert("RGB")
    img.save(webp_full, "WEBP", quality=QUALITY, method=6)
    before = os.path.getsize(full)
    after = os.path.getsize(webp_full)
    tot_before += before
    tot_after += after
    new_names[os.path.basename(full)] = os.path.basename(webp_full)
    os.remove(full)
    print(f"  {before/1024:7.0f} KB -> {after/1024:6.0f} KB  {os.path.basename(webp_full)}")

print(f"TOTAL: {tot_before/1e6:.1f} MB -> {tot_after/1e6:.1f} MB ({(1-tot_after/tot_before)*100:.0f}% smaller)")

# 3. rewrite references in src (handle ?scale-down-to= query variants)
count = 0
for f in blob_files:
    t = open(f, encoding="utf8", errors="ignore").read()
    orig = t
    for old, new in new_names.items():
        o, n = os.path.splitext(old)[0], os.path.splitext(new)[0]
        # /images/old.png and /images/old.png?scale-down-to=N  ->  /images/new.webp
        t = re.sub(
            r"(/images/" + re.escape(o) + r"\.(?:png|jpe?g))(?:\?scale-down-to=\d+)?",
            "/images/" + n,
            t,
        )
    if t != orig:
        open(f, "w", encoding="utf8").write(t)
        count += 1
print(f"rewrote references in {count} src files")

# 4. verify no dangling old references remain
leftover = 0
B2 = "\n".join(open(f, encoding="utf8", errors="ignore").read() for f in blob_files)
for old in new_names:
    o = os.path.splitext(old)[0]
    if re.search(r"/images/" + re.escape(o) + r"\.(?:png|jpe?g)", B2):
        print("  LEFTOVER ref:", old)
        leftover += 1
print("leftover refs:", leftover)
