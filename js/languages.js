LANGUAGES={
    EN:{
        notes:"Best on Firefox/Chrome",
        language:"Language",
        settings:"Settings",
        by:"by",
        sourcesAt:"Sources at",
        pleaseWait:"Please wait...",
        learnHowToPlay:"Learn how to play",
        confirm:"OK",
        printMode:"Print mode",
        printModes:{
            default:{
                label:"With dashed lines",
                description:"Build the cards cutting along the dashed lines. Best for scissors.",
            },
            doublesidedcross:{
                label:"With crosshairs",
                description:"Build the cards cutting from crosshair to crosshair. Best for cutters with ruler.",
            }
        },
        attemptPrefix:"Attempt #",
        savedData:"Saved data",
        savedDataExport:"Export",
        savedDataImport:"Import",
        savedDataImported:"Saved data imported!",
        savedDataWarn:"The save file you're importing is for version {saveVersion} of the game while you're playing version {gameVersion}. If imported, the game may not function properly. Do you want to continue?",
        savedDataError:"It looks like this save file is corrupt, invalid, or unreadable. Please, try with another one!",
        attemptSuffix:"<span class='accent'>.y</span>",
        tips:"<span class='accent'>Print</span> <a class='downloadlink' href='#'>this PDF</a>, <span class='accent'>read</span> <a target=_blank href='manuals/manual-EN.pdf'>this manual</a>, and <span class='accent'>delve</span> into the darkness <span class='accent'>with your own eyes</span>.",
        learnHowToPlayTheGame:"Learn how to play {title}!",
        theGameManual:"The Game Manual",
        theTutorialDeck:"The Tutorial Dungeon",
        tutorialDeck:"If you want some help for your first adventure, you can print, cut, and play {tutorialLink}this tutorial dungeon{endTutorialLink}. Start reading the <span class='accent'>Welcome!</span> card and keep {manualLink}the game manual{endManualLink} aside. It will help you learn the basics of the game as you venture through your first maze!",
        faqs:"FAQs",
        creditsSentence:"You are the greatest explorer of all time!",
        creditsThanks:"Thanks to Bianca, Preuk, all the Stampadia crawlers out there...and YOU!",
        faqsList:[
            {
                section:"Game Rules",
                questions:[
                    {
                        q:"I have the feeling that something is missing from the manual!",
                        a:"Really? Maybe you could write that down somewhere..."
                    },
                ]
            },
            {
                section:"Saved Data",
                questions:[
                    {
                        q:"What are the Saved data Export and Import functions found in the settings for?",
                        a:"As you download new adventures from the same browser, you'll notice that the dungeon will remember you. If you want to move the {accent}dungeon's memories{endAccent} from one browser or device to another, or if you use the browser in private mode but still want the dungeon to remember you, you can export and import its memories as you wish. If you always download adventures from the same browser on the same device, you won't need it.",
                    },
                    {
                        q:"Hey! What about my privacy?",
                        a:"The data is anonymous, saved {accent}in your browser{endAccent}, and {accent}on the device you download the adventures from{endAccent}. It doesn't end anywhere else!",
                    },
                    {
                        q:"Are these dungeon memories that important?",
                        a:"No! Downloaded adventures contain the same elements for all players, regardless of their dungeon memories. However, some of them may refer to adventures previously downloaded from the same device and browser..."
                    }
                ]
            },
            {
                section:"More",
                questions:[
                    {
                        q:"How you're monetizing this game?",
                        a:"{title} is one of my hobby projects and, as for the {anchor}https://github.com/kesiev{anchorBody}others{endAnchor}, I'm working on it in my spare time and it is released as opensource. I'm used to paying for hosting my stuff without getting anything back. So, yeah. I'm OK. If you find something I do that you like it's more than enough for me.",
                    },
                    {
                        q:"I'd like to play this game first chapter!",
                        a:"You can play {accent}Chronicles of Stampadia{endAccent}! Every day there is a new adventure to print and play with a pencil, an eraser, two dice, and a small token. You can find that {anchor}https://www.kesiev.com/stampadia{anchorBody}here{endAnchor}.",
                    },
                    {
                        q:"I'd like to play this game with cards!",
                        a:"You can play the second chapter {accent}Travelers of Stampadia{endAccent}! Explore randomly generated dungeons and lands every day and play your cards wisely to triumph! You can find that {anchor}https://www.kesiev.com/stampadia-travelers{anchorBody}here{endAnchor}.",
                    },
                    {
                        q:"I'd like to play something strategic!",
                        a:"You can play the third chapter {accent}Generals of Stampadia{endAccent}! Deploy your units and beat the Sacred Printer in a tight card battle! You can find that {anchor}https://www.kesiev.com/stampadia-generals{anchorBody}here{endAnchor}.",
                    },
                    {
                        q:"I have more questions!",
                        a:"Don't worry! There's a Discord server {anchor}https://discord.gg/EDYP2N4RMn{anchorBody}here{endAnchor} - we talk about everything Stampadia there and you may ask questions about the rules in the #mos3d-general channel.",
                    },
                ],
            },
        ],
        readTheManual:"Read {manualLink}this manual{endManualLink} to learn everything you need to <span class='accent'>delve</span> into the darkness <span class='accent'>with your own eyes</span>!",
        tutorial:{
            cardsPosition:[
                [ "card ", " in the upper left", "no card in the upper left" ],
                [ ", card ", " in the upper middle", ", no in to the upper middle" ],
                [ ", card ", " in the upper right", ", no card in the upper right" ],
                [ ", and card ", " in the lower middle", ", and no in to the lower middle" ]
            ],
            intro:[
                "{bold}Welcome!{endbold} Form the Forgotten Deck (1) looking at the cards top right and making a face-down deck with all of the non-A cards, the Long Term Area (2) sorting the dark bordered cards in a grid, and the Short Term Area (3) sorting the remaining cards in a row. Leave space for the Sight (4) and the Hippocampus Areas (5). Place the Map (6) and the Character Sheet (7). Tick 6 health, 1 sword, and 1 gold on it. Place card 1A at the Sight Area top center (8): you always start facing North, and 1A is what you see ahead!"
            ],
            start:[
                "At the entrance you only see this corridor. To travel it, move this card to the Hippocampus Area, place the token on the current cell name (A) on this card, and arrange the Sight Area slots following the instructions after the colon: {cardsPosition}. Replaced cards return to their areas. We move from cell {from} to cell {destination}, so update the map..."
            ],
            corridor:[
                "Want to go this way? Replace the Hippocampus Area card with this one, place the token below, and update the Sight Area. Eyes on the map!"
            ],
            "lever-1":[
                "There is a lever here! We may perform a Use action (the hand icon on the tab) to pull it. We are at cell {from}, so the condition before the colon is met: if card {fromCard} is in any area, swap it with the {toCard} card in the face down Forgotten Deck. Don't hesitate to take a look at the illustrations of the cards we're swapping - we've opened a barrier somewhere! {bold}Clank!{endbold}"
            ],
            "lever-2":[
                "There is a chest here! We may perform a Use action (the hand icon on the tab) to open it. We are at cell {from}, so the condition before the colon is met: find an empty inventory row on the Character Sheet and draw a shovel on the first box, then tick the leftmost numbered empty cell. If there already is a shovel row, skip the drawing step. If there already is a ticked cell, skip that too. Now we have exactly one shovel!"
            ],
            "gate-1":[
                "A closed barrier is blocking this way. Maybe there is a way to open it..."
            ],
            "gate-2":[
                "Some rubble is blocking this way. We may perform a Use action (the hand icon on the tab) to remove them. These two lines are optional, as their conditions end with a \"?\". Do we have 1 shovel tick to erase to tick 2 coins and swap the {fromCard} card with the {toCard} card? Do we want to erase 2 health ticks to swap the cards only?"
            ],
            "gate-1-v2":[
                "The barrier blocking this passage is now open! We can walk towards it as for normal corridors, replacing the Hippocampus Area card with this one, placing the token below, and updating the Sight Area. Oh, and updating the map too!"
            ],
            "gate-2-v2":[
                "We managed to clear the rubble! Now we can go this way as for normal corridors, replacing the Hippocampus Area card with this one, placing the token below, and updating the Sight Area. Oh, and updating the map too!"
            ],
            "dungeonenemies":[
                "A star-shaped tab! Activate this card right after arranging the Sight Area! This enemy is attacking - no time for explanations! Use the Character Sheet and decode the rules! Stuck? Check the Our Translations game manual chapter!",
                "",
                "",
                "",
                "",
                ""
            ],
            "exit-2":[
                "This is the tutorial dungeon exit! We may perform a Move action (the arrow icon on the tab) to move through it and end the game! Now you know how to explore, interact, and fight... but there's much more to learn in the game manual and much to discover in the dungeons!"
            ]
        },
        quickReference:
            "{bold}Start{endbold}: split {symbol symbolVersion A} cards {bold}face up{endbold}, the rest aside {bold}face down{endbold}. +6{symbol symbolResourceLife}, +1{symbol symbolResourceGold}, +1{symbol symbolResourceAttack}, {symbol actionTeleport}.\n"+
            "{symbol manualSeparator}"+
            "{symbol actionMove} / {symbol actionInteract} / {symbol actionTalk} / {symbol actionTeleport} / {symbol actionLook}: You {bold}may{endbold} read this box.{tabto 63.5}"+
            "{symbol actionRotate}: You {bold}may{endbold} flip the card upside down.\n"+
            "{symbol symbolInstant}: You {bold}must{endbold} read these boxes in any order {bold}right after{endbold} arranging the cards.\n"+
            "{symbol manualSeparator}"+
            "{bold}A: B{endbold} : If you {bold}can do{endbold} A, do B.{tabto 63}"+
            "{bold}A? B{endbold} : If you {bold}can and want to do{endbold} A, do B.\n"+
            "{spacing -0.85}{symbol symbolCardBorder 1}{symbol symbolVersion A}{endspacing}{bold}: B{endbold} : If card {spacing -0.85}{symbol symbolCardBorder 1}{symbol symbolVersion A}{endspacing} is {bold}face up{endbold}, do B.{tabto 63}"+
            "{bold}{symbol symbolPosition N}: B{endbold} : If you are in position N, do B.\n"+
            "{bold}A, B{endbold} : If A {bold}and{endbold} B / do A {bold}and then{endbold} B.{tabto 45}"+
            "{bold}A / B{endbold} : If A {bold}or{endbold} B / do A {bold}or{endbold} B.{tabto 81.5}"+
            "{symbol startLoop}A{symbol endLoop}{symbol times}3: Repeat A 3 times.\n"+
            "{symbol manualSeparator}"+
            "{symbol symbolRollDie} / {spacing -0.85}{symbol symbolRollDie}{symbol symbolRollDie}{symbol symbolRollDie}{endspacing}: Roll 1 new die / 3 new dice.{tabto 57.5}"+
            "{spacing -0.85}{symbol symbolLock}{symbol symbolDieValue}{symbol symbolDieValue}{endspacing}: Lock 2 dice, they can't be rerolled.\n"+
            "{symbol symbolRollOtherDice} / 0~5 {symbol symbolRollOtherDice} : Reroll all / from 0 to 5 dice.{tabto 57.5}"+
            "{symbol symbolDieValue} / {symbol symbolDieValue 3}: A die with any value / a 3.\n"+
            "{symbol symbolSum}{spacing -0.85}{symbol symbolDieValue 4}{symbol symbolDieValue A}{symbol symbolDieValue A}{symbol symbolAllDice}{symbol symbolDieValue}{endspacing} : The sum of a set of dice.{tabto 57.5}"+
            "{spacing -0.85}{symbol symbolDieValue A}{symbol symbolDieValue A}{symbol symbolDieValue A}{endspacing} : 3 dice with the same value.\n"+
            "{spacing -0.85}{symbol symbolRemove}{symbol symbolDieValue}{symbol symbolDieValue}{endspacing}: Remove 2 dice, they are no longer in game.{tabto 75}"+
            "{spacing -0.85}{symbol symbolAllDice}{symbol symbolDieValue}{endspacing}: All remaining dice.\n"+
            "{symbol symbolForEvery}{spacing -0.85}{symbol symbolDieValue 4}{symbol symbolDieValue 5}{endspacing}{bold}: B{endbold}: For every 4 + 5 dice pairs you can form {bold}without reusing any die{endbold}, do B.\n"+
            "{symbol manualSeparator}"+
            "{bold}Resources{endbold}: {bold}Add{endbold}: tick the leftmost empty box first. {bold}Lose{endbold}: clear the rightmost ticked box first.\n"+
            "+2 {symbol symbolFish} / -2 {symbol symbolFish} / {symbol setValue}2 {symbol symbolFish}: Add 2 / lose 2 / add or lose {symbol symbolFish} until you have 2 {symbol symbolFish}.\n"+
            "+2{symbol th}{symbol symbolFish} / -2{symbol th}{symbol symbolFish} : Tick / clear the 2nd {symbol symbolFish} box.{tabto 65}"+
            "{symbol symbolOffer 0~5 -1.1}{symbol symbolResourceAttack}: Offer (lose) from 0 to 5 {symbol symbolResourceAttack}.\n"+
            "-2 {symbol symbolFish}{bold}: B{endbold}: If 2 {symbol symbolFish} or more, lose 2 and do B.{tabto 65}"+
            "{bold}A:{endbold} -2 {symbol symbolFish} : If A, lose 2 {symbol symbolFish} as possible.\n"+
            "{symbol symbolFish} / {symbol symbolFish} > 2 / 2{symbol th}{symbol symbolFish}: If you have at least 1 / more than 2 / the 2nd box of {symbol symbolFish} ticked.\n"+
            "{symbol manualSeparator}"+
            "[[sampleTeleport]]: Move to position [[samplePlace]] and arrange cards [[sampleTeleport1]], empty space, [[sampleTeleport2]].\n"+
            "{spacing -0.85}{symbol symbolCardBorder 1}{symbol symbolVersion A}{endspacing}{symbol symbolSwapTo}{spacing -0.85}{symbol symbolCardBorder 1}{symbol symbolVersion B}{endspacing}: If card {spacing -0.85}{symbol symbolCardBorder 1}{symbol symbolVersion A}{endspacing} is {bold}face up{endbold}, flip face down and swap with {spacing -0.85}{symbol symbolCardBorder 1}{symbol symbolVersion B}{endspacing} {bold}face up{bold}.",
        teleport: "[[startTeleport]], facing North"
    }
}