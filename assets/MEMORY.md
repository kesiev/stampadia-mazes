# Memory

A list of ideas.

## Pending ideas

Improvements that may be made in the future.

 - **BIOMES**: At least 1 more.
 - **VERBS**: Some more?
 - **WORDS**: Some more?
 - **PASSAGES**: 14 more to reach 100.
   - Can't think of anything that's not already in the game, but most of them came from random inspirations.
 - **PASSAGES**: Some more quizzes for the linguist.
   - Maybe the event is already hard enough. Probably multiple runs are needed to get a sentence's meaning.
 - **SPECIALS**: 29 more to reach 50.
   - One-card events are hard to design! Can't think of anything new, but most of them came from random inspirations.
 - **RESOURCES**: At least 3 more.
     - 5 resources/passage * 4 passages/deck + 5 moved to words every deck + 4 resources/special = ~30 resources
     - 30 resources * 1.5 variety = 45 resources
     - Currently, there are 42.
     - Can't find more trinkets that are recognizable in B/W.

## Cooking ideas

Ideas that may need some more design work.

 - **DUNGEON BUILDING**: Limit the complexity of the events in a dungeon (i.e, the dungeon "brains" total - see the dev page)
   - I like the idea that complexity is not regular. It also makes the event spawn probability more even.
 - **PASSAGE**: More dice games to implement bosses (i.e, like the blob, the snake, etc.)
   - I've been looking around for some inspiration, but I think I'm pretty done. Maybe in the future...
 - **PASSAGE**: The printer: play a single-player card game with the Long Term Area cards.
   - A cool idea, but explaining a card game with just symbols is hard! I also considered adding extra card-game symbols and values to the Long Term Area cards when this event spawns (i.e, hearts, diamonds, etc.), but cards are lacking space.
 - **PASSAGE**: The secret passage: move to a non-adjacent cell when moving in a direction.
   - It may be a little confusing, as it's hard for the player to keep the map consistent.
 - **PASSAGE**: Someone appears behind the player.
   - It may require more cards. As it should work as a "fake corridor card" injected into a corridor direction Sight Area arrangement instructions, its disappearance must be implemented, replacing it with a one-way corridor, which may interfere with crossroads.
 - **SPECIAL**: Revive someone/something.
   - Needs a fitting mechanic.
 - **SPECIAL**: A genie
   - Needs a fitting mechanic.
 - **SPECIAL**: An NPC with a monster friend
   - Needs a fitting mechanic.

## Stopped ideas

Ideas that can't be implemented with the current layout/space limits.

 - **QUICK REFERENCE**: The "previously offered resources" (hand palm with no text followed by a symbol) explanation is missing.
   - There is not enough space in the quick reference. It's rarely used ATM.
 - **QUICK REFERENCE**: The cell ticking symbols.
   - There is not enough space in the quick reference. There are a lot, but they are fairly intuitive.
 - **SPECIAL**: Classic memory game: remember a grid/sequence of symbols and guess the right symbol at a given position.
   - Can't think of a way to implement it, placing both the grid/sequence and the question in separate cards of the Forgotten Deck with the current amount of available cards.
 - **SPECIAL**: Fold a card so that 2 symbols are aligned.
   - And then?

## Unused ideas

Currently implemented, not used anywhere.

 - **PASSAGES.data.[x].isAggregate**: aggregate conditions with the same effect.
 - **PASSAGES.data.exitLock** and **PASSAGES.data.[x].boxes.unlockExit**: passages with no other element than an exit replacement.

## Discarded ideas

Ideas that were analyzed but then discarded for design reasons.

 - **PASSAGE**: A treasure room behind a boss
   - ATM area locks are _at the end_ and not _at the beginning_ of a segment by design. Some key rework is needed to implement it.
 - **SPECIAL**: A sequence of teleporters to different zones
   - Unlocked area detection is hard, and the latest dungeon branching structure doesn't need it anymore.
 - **GFX**: Decoration layer on corridors/walls (i.e, lanterns, climbing plants, etc.)
   - Attempted. On black and white cards, the result is too confusing.
 - **SPECIAL**: Fold a card to get a resource
   - I looked for origami that would work well. Folding instructions are hard. Object-shaped origami is way too complex for the player.
 - **SPECIAL**: Cut a card to form a garland
   - I looked for garlands that would work well. Garland instructions are too hard to read for the player and need too much space.
 - **PASSAGE**: Draw a symbol on the map using the letters as dots
   - There already is a passage with similar interaction.
 - **PASSAGE**: Cut the cards (or a shape on it) into 2 identical parts.
   - Errors are quite irreversible!

## Dropped ideas

Once implemented, now removed.

 - **CARD**: Make sure to always have 3 wall cards per deck
   - Wall cards no longer exist: now they are empty spaces. Less fiddling and more cards for the dungeon.
