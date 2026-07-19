# Economy and campaign clock rules

## Campaign modes

- The administrator is the sole authority for `town` and `dungeon` mode.
- Town purchases deduct Favor and enter the buyer's inventory immediately.
- Dungeon purchases deduct Favor immediately and create a persistent reservation.
- Entering town fulfills every pending reservation into its owner's inventory. Both the reservation and its later fulfillment remain in the economy transaction ledger.
- The campaign document defaults to town behavior when older data has no mode field.

## Vendor stock

Faction preference determines which faction can trade an item. Vendor stock is a second, narrower server-enforced filter inside that faction. The canonical vendor/category map is stored in `src/data/economyConfig.json` and mirrored in `functions-admin/economyConfig.json` for callable-function validation.

The browser only displays matching stock, but the server independently rejects attempts to buy an item from the wrong vendor.

## Advancing the day

- Only the administrator can advance the campaign day.
- A day cannot advance during an active battle.
- The administrator assigns `0–24` whole hours of sleep to every player.
- A living player heals `ceil(maximum HP × hours / 6)`, capped at maximum HP.
- A living player who sleeps at least five hours receives a daily reset.
- A daily reset clears tracked daily combat uses and sends a versioned reset signal that clears that player's browser-backed social ability cooldowns on their next live profile update.
- Encounter-based resources still reset with encounters; turn- and round-based resources still follow combat turns. Death cannot be healed or reset by sleep.
