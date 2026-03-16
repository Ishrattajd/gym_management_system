with open("data.json", "rb") as f:
    content = f.read()

# Remove BOM if present
if content.startswith(b'\xef\xbb\xbf'):
    content = content[3:]

with open("data_clean.json", "wb") as f:
    f.write(content)