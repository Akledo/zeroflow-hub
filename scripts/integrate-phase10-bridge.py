#!/usr/bin/env python3
"""Integrate Phase 10 Bridge Batch 1 articles and assets."""
import shutil, os

SITE_CONTENT = "/home/team/shared/zeroflow-hub/src/content"
SITE_IMAGES = "/home/team/shared/zeroflow-hub/src/assets/images"
SHARED_ARTICLES = "/home/team/shared/articles"
SHARED_IMAGES = "/home/team/shared/assets/images/articles"

# Available hero images from designer
hero_images = {
    "can-i-run-my-whole-house-on-solar": "can-i-run-my-whole-house-on-solar-hero.png",
    "solar-vs-wind-comparison-guide": "solar-vs-wind-hero.png",
}
missing_hero = ["nvidia-rtx-5090-non-gamers-guide", "how-to-run-llama-3-locally-easy-guide", "local-ai-vs-chatgpt-comparison"]

# Copy available hero images
for slug, img in hero_images.items():
    src = os.path.join(SHARED_IMAGES, img)
    dst = os.path.join(SITE_IMAGES, img)
    if os.path.exists(src):
        shutil.copy2(src, dst)
        print(f"✅ Copied hero: {img}")
    else:
        print(f"⚠️  Missing hero: {img}")

print(f"⚠️  No hero images yet for: {', '.join(missing_hero)} (designer task 44e7abfb)")

# Article definitions: source_file -> front_matter config
articles = [
    ("can-i-run-my-whole-house-on-solar.md", {
        "layout": "layouts/article.njk",
        "title": "Can I Run My Whole House on Solar? The Reality of Off-Grid Living (2027)",
        "description": "A physics-based guide to achieving 100% solar self-sufficiency — peak load math, battery buffer requirements, and the real cost of cutting the grid cord.",
        "date": "2026-06-07",
        "category": "Energy Tech",
        "author": "ZeroFlow Editorial Team",
        "tags": ["Solar", "Off-Grid", "Energy Independence", "DIY"],
        "keywords": "whole house solar power feasibility, off-grid solar battery sizing, home solar ROI calculator, solar self-sufficiency guide"
    }),
    ("solar-vs-wind-comparison-guide.md", {
        "layout": "layouts/article.njk",
        "title": "Solar vs. Wind: Which is Better for Your Home Energy Independence? (2027)",
        "description": "Compare energy density, ROI, geography requirements, and counter-cyclical generation of solar PV vs micro-wind for residential off-grid systems.",
        "date": "2026-06-07",
        "category": "Energy Tech",
        "author": "ZeroFlow Editorial Team",
        "tags": ["Solar", "Wind", "Off-Grid", "Energy", "Comparison"],
        "keywords": "solar vs wind home energy, residential wind turbine ROI, solar PV vs micro-wind comparison, off-grid energy generation mix"
    }),
    ("nvidia-rtx-5090-non-gamers-guide.md", {
        "layout": "layouts/article.njk",
        "title": "NVIDIA RTX 5090: The Non-Gamer's Guide to Blackwell for AI and Productivity (2027)",
        "description": "Why the RTX 5090 is the most cost-effective entry point for local LLM inference, 3D rendering, and professional AI workloads — a non-gaming perspective.",
        "date": "2026-06-07",
        "category": "Technology",
        "author": "ZeroFlow Editorial Team",
        "tags": ["AI", "GPU", "Hardware", "Productivity", "NVIDIA"],
        "keywords": "RTX 5090 for non gamers, Blackwell AI workstation, local LLM inference GPU, NVIDIA RTX 5090 productivity guide"
    }),
    ("how-to-run-llama-3-locally-easy-guide.md", {
        "layout": "layouts/article.njk",
        "title": "How to Run Llama 3 Locally: The Easy Guide (2027)",
        "description": "Step-by-step guide to setting up Llama 3 on your own hardware using Ollama and vLLM — no subscriptions, no data tracking, no internet required.",
        "date": "2026-06-07",
        "category": "Technology",
        "author": "ZeroFlow Editorial Team",
        "tags": ["AI", "LLM", "Tutorial", "DIY", "Privacy"],
        "keywords": "run Llama 3 locally, local LLM setup guide, Ollama tutorial 2027, vLLM local inference, private AI assistant guide"
    }),
    ("local-ai-vs-chatgpt-comparison.md", {
        "layout": "layouts/article.njk",
        "title": "Local AI vs. ChatGPT: Privacy, Speed, and Cost Comparison (2027)",
        "description": "Head-to-head comparison of local LLMs (Llama 3, Mixtral) vs ChatGPT covering privacy, response speed, total cost of ownership, and use-case fit.",
        "date": "2026-06-07",
        "category": "Technology",
        "author": "ZeroFlow Editorial Team",
        "tags": ["AI", "LLM", "Comparison", "Privacy", "Cost"],
        "keywords": "local AI vs ChatGPT comparison, Llama 3 vs GPT-4 privacy, local LLM cost vs cloud API, off-grid AI assistant 2027"
    }),
]

def make_article(source_file, front_matter):
    fpath = os.path.join(SHARED_ARTICLES, source_file)
    with open(fpath) as f:
        body = f.read()
    
    # Remove leading # heading from body
    lines = body.split('\n')
    while lines and (lines[0].startswith('# ') or lines[0].strip() == ''):
        lines.pop(0)
    body = '\n'.join(lines).strip()
    
    # Build YAML front matter
    fm_lines = ["---"]
    for k, v in front_matter.items():
        if isinstance(v, list):
            fm_lines.append(f'{k}:')
            for item in v:
                fm_lines.append(f'  - "{item}"')
        else:
            fm_lines.append(f'{k}: "{v}"')
    fm_lines.append("---")
    fm_lines.append("")
    
    dst = os.path.join(SITE_CONTENT, source_file)
    with open(dst, 'w') as f:
        f.write('\n'.join(fm_lines))
        f.write(body)
        f.write('\n')
    print(f"✅ Created {source_file}")

for src, fm in articles:
    make_article(src, fm)

print("\n✅ Phase 10 Bridge Batch 1 integrated!")
print("⚠️  Note: Missing hero images for:", ', '.join(missing_hero))