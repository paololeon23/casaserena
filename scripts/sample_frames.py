import os
import subprocess

import imageio_ffmpeg

ff = imageio_ffmpeg.get_ffmpeg_exe()
base = r"c:\Users\CRISTOPHERPAOLOLEONA\Desktop\shey\imgs"
out = r"c:\Users\CRISTOPHERPAOLOLEONA\Desktop\shey\public\media\_frames"
os.makedirs(out, exist_ok=True)
files = [
    ("a", "ssstik.io_1791837140890.mp4"),
    ("b", "ssstik.io_1791837362719.mp4"),
]
for stem, name in files:
    src = os.path.join(base, name)
    probe = subprocess.run([ff, "-i", src], capture_output=True, text=True)
    for line in probe.stderr.splitlines():
        if "Duration" in line or "Video:" in line:
            print(stem, line.strip())
    for t in ["0.4", "1.5", "3", "5", "8", "12", "16", "20", "25"]:
        dest = os.path.join(out, f"{stem}-{t.replace('.', '_')}.jpg")
        subprocess.run(
            [ff, "-y", "-ss", t, "-i", src, "-frames:v", "1", "-q:v", "4", dest],
            capture_output=True,
        )
        size = os.path.getsize(dest) if os.path.exists(dest) else 0
        print("wrote", os.path.basename(dest), size)
