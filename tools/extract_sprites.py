"""Prepare selected, consistent character expressions from user-provided assets.

Run from the project root: python tools/extract_sprites.py
The archives are read by exact member name; archive paths are never extracted.
"""

from io import BytesIO
from pathlib import Path
from zipfile import ZipFile
from collections import deque

import numpy as np
from PIL import Image, ImageChops


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "botc_assets"
DEST = ROOT / "assets" / "characters" / "vn"


def find_source(ending):
    matches = list(SOURCE.glob(f"*{ending}"))
    if len(matches) != 1:
        raise ValueError(f"Expected one source ending in {ending!r}, found {len(matches)}")
    return matches[0]


def from_sheet(ending, columns, rows, index):
    with Image.open(find_source(ending)) as source:
        col, row = index % columns, index // columns
        box = (
            round(col * source.width / columns),
            round(row * source.height / rows),
            round((col + 1) * source.width / columns),
            round((row + 1) * source.height / rows),
        )
        image = source.crop(box).convert("RGBA")
    # These sprite sheets use a solid teal matte, not real transparency.
    matte = Image.new("RGB", image.size, (0, 128, 128))
    distance = ImageChops.difference(image.convert("RGB"), matte)
    alpha = ImageChops.multiply(
        image.getchannel("A"),
        distance.convert("L").point(lambda value: 0 if value < 13 else 255),
    )
    image.putalpha(alpha)
    return image


def from_archive(ending, member):
    with ZipFile(find_source(ending)) as archive:
        with Image.open(BytesIO(archive.read(member))) as source:
            image = source.convert("RGBA")
    # Several archive frames are exported over an opaque black canvas. Clear
    # only the connected border matte so black clothes and hair remain intact.
    pixels = np.asarray(image).copy()
    matte = (pixels[:, :, :3].max(axis=2) <= 12) & (pixels[:, :, 3] == 255)
    height, width = matte.shape
    if not (matte[0, 0] or matte[0, -1] or matte[-1, 0] or matte[-1, -1]):
        return image
    outside = np.zeros((height, width), dtype=bool)
    queue = deque([(x, 0) for x in range(width) if matte[0, x]])
    queue.extend((x, height - 1) for x in range(width) if matte[-1, x])
    queue.extend((0, y) for y in range(height) if matte[y, 0])
    queue.extend((width - 1, y) for y in range(height) if matte[y, -1])
    while queue:
        x, y = queue.popleft()
        if not matte[y, x]:
            continue
        left, right = x, x
        while left > 0 and matte[y, left - 1]:
            left -= 1
        while right + 1 < width and matte[y, right + 1]:
            right += 1
        matte[y, left:right + 1] = False
        outside[y, left:right + 1] = True
        for neighbor in (y - 1, y + 1):
            if 0 <= neighbor < height:
                matches = np.flatnonzero(matte[neighbor, left:right + 1])
                if matches.size:
                    starts = matches[np.r_[True, np.diff(matches) > 1]]
                    queue.extend((left + int(dx), neighbor) for dx in starts)
    pixels[:, :, 3][outside] = 0
    image = Image.fromarray(pixels, "RGBA")
    return image


def from_file(ending):
    with Image.open(find_source(ending)) as source:
        return source.convert("RGBA")


def save(image, scenario, person, emotion, bust=True):
    alpha = image.getchannel("A")
    bbox = alpha.getbbox()
    if bbox is None:
        raise ValueError(f"Empty sprite: {scenario}/{person}/{emotion}")
    image = image.crop(bbox)
    if bust:
        image = image.crop((0, 0, image.width, round(image.height * 0.62)))
    image.thumbnail((640, 850), Image.Resampling.LANCZOS)
    output = DEST / scenario / person / f"{emotion}.png"
    output.parent.mkdir(parents=True, exist_ok=True)
    image.save(output, optimize=True)
    print(output.relative_to(ROOT))


def main():
    sheet_sets = [
        # Every in-game person always uses a single source character.
        ("demo", "max", "Nagito Komaeda.png", 5, 7, {"neutral": 0, "confident": 1, "nervous": 14}),
        ("demo", "katya", "Mikan Tsumiki.png", 4, 6, {"neutral": 0, "angry": 9, "nervous": 4}),
        ("second", "ira", "Junko Enoshima.png", 4, 5, {"neutral": 7, "warm": 0, "suspicious": 15}),
    ]
    for scenario, person, ending, columns, rows, emotions in sheet_sets:
        for emotion, index in emotions.items():
            save(from_sheet(ending, columns, rows, index), scenario, person, emotion, bust=False)

    archive_sets = [
        ("demo", "ira", "Miu Iruma.zip", "Miu Iruma/Miu", {"neutral": 1, "warm": 10, "suspicious": 24}),
        ("demo", "sasha", "Kokichi Oma.zip", "Kokichi Oma/Kokichi", {"neutral": 1, "amused": 10, "concerned": 17}),
        ("second", "max", "Korekiyo Shinguji.zip", "Korekiyo Shinguji/Korekiyo", {"neutral": 1, "confident": 11, "nervous": 18}),
        ("second", "katya", "Himiko Yumeno.zip", "Himiko Yumeno/Himiko", {"neutral": 1, "angry": 19, "nervous": 16}),
        ("second", "sasha", "Rantaro Amami.zip", "Rantaro Amami/Rantaro", {"neutral": 1, "amused": 2, "concerned": 8}),
        ("third", "max", "Kaito Momota.zip", "Kaito Momota/Kaito", {"neutral": 1, "confident": 6, "nervous": 7}),
    ]
    for scenario, person, ending, prefix, emotions in archive_sets:
        for emotion, number in emotions.items():
            member = f"{prefix} ({number}).png"
            save(from_archive(ending, member), scenario, person, emotion)

    standing_sets = [
        ("third", "katya", "Sonia Nevermind.zip", "sonia/stand_10", {"neutral": 0, "angry": 12, "nervous": 15}),
        ("third", "sasha", "Hajime Hinata.zip", "hajime/stand_00", {"neutral": 0, "amused": 13, "concerned": 1}),
    ]
    for scenario, person, ending, prefix, emotions in standing_sets:
        for emotion, number in emotions.items():
            save(from_archive(ending, f"{prefix}_{number:02d}.png"), scenario, person, emotion)

    for emotion, (row, right) in {"neutral": (0, 309), "warm": (1, 283), "suspicious": (4, 309)}.items():
        # This sheet has irregular column widths; the second row's next
        # expression starts at x=285, whereas the first row ends at x=309.
        image = from_file("Celestia Ludenberg.png").crop((0, row * 284, right, (row + 1) * 284))
        save(image, "third", "ira", emotion, bust=False)


if __name__ == "__main__":
    main()
