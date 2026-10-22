# Campaign content audit

Regenerate with `npm run audit:campaign -- --report`. This checks repository content, not the deployed app or Firebase assets.

| Content | Count |
| --- | ---: |
| NPCs | 118 |
| Named portrait files | 126 |
| Placeholder fallback URLs | 118 |
| Map floors | 2 |
| Map areas | 23 |
| Map regions | 52 |
| Locations linked to NPC workplaces | 30 |

## NPC datasets

- npcs_artisan.js: 15 NPCs
- npcs_central.js: 12 NPCs
- npcs_divers.js: 1 NPCs
- npcs_guild.js: 13 NPCs
- npcs_healing.js: 11 NPCs
- npcs_market.js: 24 NPCs
- npcs_misc.js: 11 NPCs
- npcs_residential.js: 19 NPCs
- npcs_utility.js: 12 NPCs

## Validation errors

None.

## Warnings

- 118 NPC fallback URLs are placeholders; named Firebase portrait files still need a live asset check.

## Town locations without authored resident links

- Guardhouse (guardhouse-medical)
- Guardhouse (guardhouse-market)
- Silk and Stitch (silk-stitch)
- The Gem Cutter's Guild (gem-cutters-guild)
- The Hero's Museum (heros-museum)
- Clover Lake (clover-lake)
- The Night Eye (night-eye)

These locations have no confirmed workplace mapping; do not invent residents to fill them.

## NPC workplaces without a map link

- Diver
- Shadow Alley
- The Basilica of Harmony
- The Whispering Woods
- Tower Entrance

A workplace can be unmapped intentionally (for example, a roaming Diver). Review these against campaign notes.

## Remaining campaign work

- Verify named NPC portrait files and floor images in Firebase; placeholder fallback URLs do not prove the primary portraits are missing.
- Review NPC lore and discovery tiers with the DM; structural validation does not establish narrative completeness.
- Exploration maps currently cover the Town and Tower Floor 1. Further floors still need authored geometry and content.
- Only two town buildings currently have authored image galleries.
- Review unique monster profiles, including the Avatar of Greed and Patience, then playtest first-session encounters.
- Verify the deployed branch, seeded data, and a complete player/DM session before calling these systems ready.
