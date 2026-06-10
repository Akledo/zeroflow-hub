#!/usr/bin/env python3
"""Integrate Phase 9 Wave 5 articles and assets into the site."""
import shutil, os, glob

SITE_CONTENT = "/home/team/shared/zeroflow-hub/src/content"
SITE_IMAGES = "/home/team/shared/zeroflow-hub/src/assets/images"
SHARED_ARTICLES = "/home/team/shared/articles"
SHARED_IMAGES = "/home/team/shared/assets/images/articles"

# 1. Copy hero images to site assets
assets = [
    "multi-gpu-blackwell-hero.png",
    "multi-gpu-rackmount-diagram.png",
    "residential-liquid-cooling-hero.png",
    "meshtastic-base-station-hero.png",
]
for a in assets:
    src = os.path.join(SHARED_IMAGES, a)
    dst = os.path.join(SITE_IMAGES, a)
    if os.path.exists(src):
        shutil.copy2(src, dst)
        print(f"✅ Copied {a}")
    else:
        print(f"⚠️  Not found: {src}")

# 2. Create article with front matter
def make_article(source_file, front_matter, dest_filename=None):
    with open(source_file) as f:
        body = f.read()
    
    # Remove leading # heading from body (it will be in front matter title)
    lines = body.split('\n')
    while lines and (lines[0].startswith('# ') or lines[0].strip() == ''):
        lines.pop(0)
    body = '\n'.join(lines).strip()
    
    # Build front matter
    fm_lines = ["---"]
    for k, v in front_matter.items():
        if isinstance(v, list):
            fm_lines.append(f'{k}:')
            for item in v:
                fm_lines.append(f'  - "{item}"')
        elif isinstance(v, str) and (':' in v or v.startswith('"') or v.startswith('[')):
            fm_lines.append(f'{k}: {v}')
        else:
            fm_lines.append(f'{k}: "{v}"')
    fm_lines.append("---")
    fm_lines.append("")
    
    if dest_filename is None:
        dest_filename = os.path.basename(source_file)
    
    dst = os.path.join(SITE_CONTENT, dest_filename)
    with open(dst, 'w') as f:
        f.write('\n'.join(fm_lines))
        f.write(body)
        f.write('\n')
    print(f"✅ Created {dest_filename}")

# Article 1: Multi-GPU RTX 5090
make_article(
    os.path.join(SHARED_ARTICLES, "multi-gpu-rtx-5090-home-lab-design-2027.md"),
    {
        "layout": "layouts/article.njk",
        "title": "Designing a Multi-GPU RTX 5090 Home Lab for LLM Inference (2027)",
        "description": "Engineering guide for building a high-density Blackwell AI cluster at home — PCIe Gen5 routing, power delivery, thermal management, and software orchestration for running 70B+ LLMs locally.",
        "date": "2026-06-07",
        "category": "Technology",
        "author": "ZeroFlow Editorial Team",
        "tags": ["AI", "Hardware", "GPU", "Deep Learning", "DIY"],
        "keywords": "multi-GPU RTX 5090 home lab design, NVIDIA Blackwell LLM inference 2027, PCIe Gen5 GPU cluster, VRAM pooling local LLM, RTX 5090 multi-card build guide"
    }
)

# Article 2: Liquid-Cooled Server Racks
make_article(
    os.path.join(SHARED_ARTICLES, "liquid-cooling-server-racks-residential-physics-2027.md"),
    {
        "layout": "layouts/article.njk",
        "title": "Liquid-Cooled Server Racks: The Physics of Thermal Management for Home AI (2027)",
        "description": "Deep dive into thermal density physics for multi-GPU AI rigs — liquid cooling ROI, custom loop design vs AIO, and heat exchanger sizing for residential environments.",
        "date": "2026-06-07",
        "category": "Technology",
        "author": "ZeroFlow Editorial Team",
        "tags": ["AI", "Hardware", "Cooling", "DIY", "Thermal Management"],
        "keywords": "liquid cooled server rack home AI, residential GPU thermal management, RTX 5090 water cooling loop, heat exchanger sizing AI lab, custom loop vs AIO AI workloads"
    }
)

# Article 3: Liquid Cooling ROI (bonus companion)
make_article(
    os.path.join(SHARED_ARTICLES, "liquid-cooling-home-server-roi.md"),
    {
        "layout": "layouts/article.njk",
        "title": "Liquid Cooling for Home Servers: Is it Worth the Cost for Your AI Rig?",
        "description": "Cost-benefit analysis of liquid cooling for home AI labs — compare upfront investment vs thermal throttling losses, noise reduction, and hardware longevity.",
        "date": "2026-06-07",
        "category": "Technology",
        "author": "ZeroFlow Editorial Team",
        "tags": ["AI", "Hardware", "Cooling", "ROI", "DIY"],
        "keywords": "home server liquid cooling ROI, AI rig thermal management cost, RTX 5090 water cooling worth it, residential server cooling comparison"
    }
)

print("\n✅ All articles and assets integrated!")
