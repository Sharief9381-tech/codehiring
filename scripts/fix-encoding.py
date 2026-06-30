"""
Fix broken UTF-8 emoji/special chars that got double-encoded as Latin-1.
Patterns like ðŸ"¥ should be 🔥, ðŸŒ± should be 🌱, â€" should be —, etc.
"""
import os
import re

# Broken byte sequences and their correct replacements
# These are UTF-8 bytes misread as Latin-1
FIXES = [
    # Common emoji prefixes (ð\x9f = U+1F...)
    (b'\xc3\xb0\xc5\xb8\x94\xa5', '🔥'),  # ðŸ"¥ -> 🔥
    (b'\xc3\xb0\xc5\xb8\x8c\xb1', '🌱'),  # ðŸŒ± -> 🌱
    (b'\xc3\xb0\xc5\xb8\x93\x98', '📘'),  # ðŸ"˜ -> 📘
    (b'\xc3\xb0\xc5\xb8\x8f\x86', '🏆'),  # ðŸ\x8f\x86 -> 🏆
    (b'\xc3\xb0\xc5\xb8\x93\x8a', '📊'),  # ðŸ"Š -> 📊
    (b'\xc3\xb0\xc5\xb8\x9a\x80', '🚀'),  # ðŸš€ -> 🚀
    (b'\xc3\xa2\xe2\x82\xac\xe2\x80\x9d', '—'),  # â€" -> —
]

TARGET_DIRS = [
    r'c:\Users\shari\Music\Hiring\codehiring\components',
    r'c:\Users\shari\Music\Hiring\codehiring\app',
]
EXTENSIONS = {'.tsx', '.ts', '.js', '.jsx'}

fixed_files = []

for base in TARGET_DIRS:
    for root, dirs, files in os.walk(base):
        # Skip node_modules and .next
        dirs[:] = [d for d in dirs if d not in ('node_modules', '.next', '.git')]
        for fname in files:
            if not any(fname.endswith(ext) for ext in EXTENSIONS):
                continue
            path = os.path.join(root, fname)
            try:
                with open(path, 'r', encoding='utf-8') as f:
                    content = f.read()
            except Exception:
                continue

            original = content

            # Fix broken multi-byte sequences rendered as Latin-1 strings
            # Pattern: ðŸXX  (U+00F0 U+009F = broken 4-byte emoji start)
            # Replace common broken sequences
            replacements = [
                ('ðŸ"¥', '🔥'),
                ('ðŸŒ±', '🌱'),
                ('ðŸ"˜', '📘'),
                ('ðŸš€', '🚀'),
                ('ðŸ"Š', '📊'),
                ('ðŸ†', '🏆'),
                ('ðŸ"‚', '📂'),
                ('ðŸ—„', '🗄'),
                ('ðŸ"', '📝'),
                ('ðŸ"–', '📖'),
                ('ðŸ'»', '💻'),
                ('ðŸ§©', '🧩'),
                ('ðŸŽ²', '🎲'),
                ('ðŸŽ¯', '🎯'),
                ('ðŸ'¡', '💡'),
                ('ðŸ"§', '🔧'),
                ('ðŸ"—', '🔗'),
                ('ðŸ'‚', '👂'),
                ('â€"', '—'),
                ('â€™', "'"),
                ('â€œ', '"'),
                ('â€', '"'),
                ('Â·', '·'),
                ('Â', ''),
            ]

            for broken, fixed in replacements:
                content = content.replace(broken, fixed)

            if content != original:
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(content)
                fixed_files.append(path)
                print(f'Fixed: {path}')

if fixed_files:
    print(f'\nTotal fixed: {len(fixed_files)} files')
else:
    print('No broken encoding found.')
