# this fixes escape errors in monsters.json
import re
with open('monsters.json', 'r', encoding='utf-8', errors='ignore') as f:
    data = f.read()
fixed = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f]', lambda m: "\\u{:04x}".format(ord(m.group())), data)
with open('clean_monsters.json', 'w', encoding='utf-8') as f:
    f.write(fixed)
