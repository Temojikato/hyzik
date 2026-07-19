# Omnia Economy and Loot — Rules Reference

This is the source of truth for the post-gold economy. Code constants live in `src/data/economyConfig.json` and the server copy in `functions-admin/economyConfig.json`.

## Two separate values

- **Favor Points (Favor)** are spendable city credit. Donations and positive barter awards add Favor; purchases and negative barter awards spend it.
- **Faction reputation** is permanent trust with one faction. It is never spent. It unlocks rare stock and improves prices.
- Every donation, automated purchase, inventory transfer, currency migration, and manually recorded barter creates an immutable entry in `economyTransactions`.
- The admin Economy tab shows available Favor, lifetime Favor earned/spent, faction contributions, a per-player reputation graph, and the complete literal transaction history.

## Gold

Gold is not currency in Omnia. `Gold Nugget` and `Gold Ingot` are crafting materials. Legacy Gold Coins migrate one-for-one into Gold Nuggets. Loot tables may drop gold material but never money.

## Donation values

Each item derives a rarity and base Favor value:

| Rarity | Base Favor |
|---|---:|
| Common | 2 |
| Uncommon | 5 |
| Rare | 14 |
| Epic | 38 |
| Legendary | 100 |
| Artifact | 260 |

Category usefulness and recipe complexity adjust that base. A preferred faction pays 125% of the resulting value; an off-specialty faction pays 80%. A donation grants `ceil(Favor / 6)` reputation with its recipient. Item-specific overrides are authoritative for staples, including Health Potion (55 purchase / 16 donation), Antidote (32 / 9), Mana Potion (52 / 15), and Stamina Elixir (36 / 10).

## Reputation tiers

| Reputation | Tier | Vendor discount | Stock access |
|---:|---|---:|---|
| 0 | Unknown | 0% | Common and uncommon |
| 10 | Noticed | 3% | Common and uncommon |
| 25 | Trusted | 7% | Rare |
| 60 | Allied | 12% | Epic |
| 120 | Honored | 18% | Legendary |

Artifacts are never ordinary vendor stock regardless of reputation.

## Factions

- **The Diver's Guild:** survival gear, containers, tools, weapons, armor. Vendors: Guild Quartermaster; The Diver's Guildhall.
- **Foundry Collective:** raw/advanced materials, crafting stations, weapons, armor. Vendors: The Foundry; The Iron Forge; The Blade and Bow; Shield and Anvil.
- **Healing Concord:** consumables, alchemy, essences, spirit food, foodstuffs. Vendors: The Healing Hand Clinic; The Mending Mind Clinic; Cremia's Salvation; The Alchemist's Alembic.
- **Archive Covenant:** ritual items, leveling components, gemstones, wondrous items, magical essences. Vendors: Arcane Antiques; The Whispering Quill; Hall of Records; Reyvateil Sanctuary.
- **Civic Provisioners:** food, basic materials, containers, survival gear, tools, trade goods. Vendors: The Grain Mill; The Waterworks; The Resting Wyvern; The Silver Chalice.
- **Silent Shadows:** collectibles, trade goods, wondrous items, gemstones, forbidden magical goods. Vendors: The Endless Emporium; Shadow Alley.

## Loot curve

Every loot source always resolves on the server. Entries referring to missing item records stop the roll with a visible error instead of silently disappearing.

- Every source has a **primary roll**. Its jackpot chance is exactly **1 in 150**.
- A jackpot selects from the highest tangible rarity that source can produce and can never select `Nothing`.
- Extra items may roll from richer sources, but extra rolls cannot jackpot.
- Tier 1 sources cap at Rare, Tier 2 at Epic, Tier 3 at Legendary, Tier 4 at Artifact. Even incorrectly labeled table data is clamped to that source cap.

Normal primary rarity curves:

| Source tier | Common | Uncommon | Rare | Epic | Legendary | Jackpot ceiling |
|---:|---:|---:|---:|---:|---:|---|
| 1 | 80% | 20% | — | — | — | Rare |
| 2 | 64% | 30% | 6% | — | — | Epic |
| 3 | 46% | 31% | 18% | 5% | — | Legendary |
| 4 | 31% | 30% | 24% | 10% | 5% | Artifact |

The engine selects the nearest available pool when a particular source has no entry of the rolled rarity. Common results should remain useful through quantities and city usefulness; exceptional results remain exceptional.

## Player flow

- Found loot immediately presents **Take** or **Show the group**. It does not use the private “Open” seal.
- Admin-granted items use the private “Open” seal, then **Keep** or **Show the group**.
- The finder alone chooses the recipient after showing the group.
- Inventory transfers require recipient acceptance.
- Inventory items can be donated remotely through the Reyvateil. Donations are permanent and record their faction, item, quantity, Favor, and reputation.
- City Exchange purchases are recorded with exact faction, vendor, item, quantity, and Favor price.
- Manual at-table negotiations remain valid; the admin records their exact terms in Economy → Record an in-person barter.
