import os
import shutil
import subprocess

import imageio_ffmpeg

ff = imageio_ffmpeg.get_ffmpeg_exe()
imgs = r"c:\Users\CRISTOPHERPAOLOLEONA\Desktop\shey\imgs"
media = r"c:\Users\CRISTOPHERPAOLOLEONA\Desktop\shey\public\media"
frames = os.path.join(media, "_frames")
os.makedirs(media, exist_ok=True)

shutil.copyfile(
    os.path.join(imgs, "WhatsApp Image 2026-10-05 at 6.14.16 PM.jpeg"),
    os.path.join(media, "habitacion.jpg"),
)
shutil.copyfile(os.path.join(frames, "a-0_4.jpg"), os.path.join(media, "poster-otuzco.jpg"))
shutil.copyfile(os.path.join(frames, "b-5.jpg"), os.path.join(media, "poster-detalle.jpg"))

jobs = [
    ("ssstik.io_1791837140890.mp4", "otuzco.mp4"),
    ("ssstik.io_1791837362719.mp4", "detalle.mp4"),
]
for src_name, dest_name in jobs:
    src = os.path.join(imgs, src_name)
    dest = os.path.join(media, dest_name)
    cmd = [
        ff,
        "-y",
        "-i",
        src,
        "-vf",
        "scale=720:-2",
        "-c:v",
        "libx264",
        "-preset",
        "veryfast",
        "-crf",
        "28",
        "-pix_fmt",
        "yuv420p",
        "-c:a",
        "aac",
        "-b:a",
        "96k",
        "-movflags",
        "+faststart",
        dest,
    ]
    print("encoding", dest_name)
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        print(result.stderr[-1500:])
        raise SystemExit(result.returncode)
    print("done", dest_name, os.path.getsize(dest))
