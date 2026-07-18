"""Search the campaign's extracted Hymmnos lexicon by English gloss.

Usage:
    python query_hymmnos.py sleep root thorn
    python query_hymmnos.py --headword slep dorn dahzel
"""

from __future__ import annotations

import json
import sys
from pathlib import Path


LEXICON_PATH = Path(__file__).with_name("HYMMNOS_LEXICON_INDEX.json")


def main(arguments: list[str]) -> int:
    headword_mode = bool(arguments and arguments[0] == "--headword")
    search_terms = arguments[1:] if headword_mode else arguments

    if not search_terms:
        print("Supply one or more English search terms.", file=sys.stderr)
        return 2

    with LEXICON_PATH.open(encoding="utf-8") as lexicon_file:
        entries = json.load(lexicon_file)["entries"]

    for term in search_terms:
        print(f"\n### {term}")
        if headword_mode:
            matches = [
                entry
                for entry in entries
                if term.casefold() == entry["headword"].casefold()
            ]
        else:
            matches = [
                entry
                for entry in entries
                if term.casefold() in entry["meaning_e"].casefold()
            ]
        if not matches:
            print("(no match)")
            continue

        for entry in matches:
            fields = [
                entry["headword"],
                entry["part_of_speech"],
                entry["dialect"] or "unmarked",
                entry["pronunciation"],
                entry["meaning_e"],
                f"P{entry['source_paragraph']}",
            ]
            if entry["note"]:
                fields.append(entry["note"])
            print(" :: ".join(fields))

    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
