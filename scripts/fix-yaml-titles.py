#!/usr/bin/env python3
"""Fix YAML front matter titles that contain colons."""
import os, re

content_dir = "/home/team/shared/zeroflow-hub/src/content"

for fname in os.listdir(content_dir):
    if not fname.endswith('.md'):
        continue
    fpath = os.path.join(content_dir, fname)
    with open(fpath) as f:
        text = f.read()
    
    # Match the title line in front matter
    # Replace `title: Something: With Colon` with `title: "Something: With Colon"`
    def fix_title(m):
        prefix = m.group(1)
        val = m.group(2)
        # If already quoted, skip
        if val.startswith('"') and val.endswith('"'):
            return m.group(0)
        if val.startswith("'") and val.endswith("'"):
            return m.group(0)
        # Quote it
        return f'{prefix}: "{val}"'
    
    new_text = re.sub(r'^(title:\s*)(.+)$', fix_title, text, flags=re.MULTILINE)
    
    if new_text != text:
        with open(fpath, 'w') as f:
            f.write(new_text)
        print(f"✅ Fixed {fname}")
    else:
        print(f"  No change {fname}")

print("Done!")