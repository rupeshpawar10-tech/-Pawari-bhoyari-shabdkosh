import re
from generate_pawari_dictionary import pages_data

total_entries = 0
parsed_items = []

heading_letters = set(["अ", "आ", "इ", "ई", "उ", "ऊ", "ए", "ऐ", "ओ", "औ", "क", "ख", "ग", "घ", "च", "छ", "ज", "झ", "ट", "ठ", "ड", "ढ", "त", "थ", "द", "ध", "न", "प", "फ", "ब", "भ", "म", "य", "र", "ल", "व", "श", "ष", "स", "ह"])

for p_idx, page in enumerate(pages_data):
    lines = page.strip().split('\n')
    for line in lines:
        line = line.strip()
        if not line:
            continue
        if line in heading_letters:
            continue
        # Check if line contains separator – or -
        parts = re.split(r' – | –|– | – | - | -|-', line, maxsplit=1)
        if len(parts) == 2:
            word_part = parts[0].strip()
            meaning_part = parts[1].strip()
            total_entries += 1
            parsed_items.append((word_part, meaning_part))
        else:
            # Let's inspect any lines that don't match
            pass

print(f"Total entries extracted: {total_entries}")
print("First 10 entries:", parsed_items[:10])
print("Last 10 entries:", parsed_items[-10:])
