const
	// ---
	// Design guidelines:
	// - Coordinates puzzles must start from 1,1: first horizontal position, then vertical position
	//
	// Debugging:
	// - Debug tools are at "assets/dev/".
	// - Add "#_debug" to the homepage to enable debug mode on homepage.
	// - Add "_debug:true" to SPECIALS or PASSAGES to force them spawning and hilight their cards.
	// - Add "markCell:{ _debug:true }" on PASSAGES paths to mark cells on the debug tool map.
	// ---
	CONFIG = {
		TITLE:"Mazes of Stampadia 3D",
		AUTHOR:"KesieV",
		SHORTTITLE:"MOS3D",
		BOOKNAME:"Mazes of Stampadia",
		VERSION:"0.1b",
		LEARNURL:"https://www.kesiev.com/stampadia-mazes/learn.html",
		SOURCESURL:"https://github.com/kesiev/stampadia-mazes",
		HOMEPAGEURL:"https://www.kesiev.com/stampadia-mazes/",
		TUTORIALDUNGEONURL:"kesiev.com/stampadia-mazes/learn.html",
		SETTINGSKEY:"_mos3ds",
		PROGRESSKEY:"_mos3dp",
		GAMEDATAKEY:"_mos3dd",
		SAVEDATA_EXTENSION:"mos3d",
		SAVEDATA_PREFIX:"mos3s-",
		STARTYEAR:2026,
		LANGUAGES:[
			{ id:"EN", label:"English" }
		],
		PRINT_MODES:[ "default", "doublesidedcross" ]
	},
	PRINT_MODES = {
		default:{ border:true },
		doublesidedcross:{ cross:true }
	},
	ENEMIES_ID = "dungeonenemies",
	LINE_KILLPLAYER = "-4 {symbol symbolResourceLife}", // It used to be -7 but, as deadly events spawn at last, you've a chance to survive...
	LINE_PUNISHPLAYER = "-1 {symbol symbolResourceLife}",
	SETLOGIC_NONE = 0, // No set splitting
	SETLOGIC_SIZE = 1, // Sets split by fixed size
	SETLOGIC_REFERENCES = 2, // Sets splitted by references (i.e., high usage/low usage)
	SETMODE_SYMBOLS = 1, // Use symbols to indicate cards sets
	SETMODE_TENS = 2, // Use tens to indicate cards sets
	SETMODE_MIXED = 3, // Use both tens and symbols to indicate cards sets
	ONLYFORAREA_FIRST = [ 0 ],
	ONLYFORAREA_EARLY = [ 0, 1 ],
	ONLYFORAREA_MIDDLE = [ 1, 2 ],
	ONLYFORAREA_LATER = [ 2, 3 ],
	ONLYFORAREA_TELEPORTERS = [ 1, 2, 3 ],
	ONLYFORAREA_DEADLY = [ 3 ],
	ONLYFORAREA_LAST = [ 3 ],
	COMBATRULES = { id:"combatrules", order:-100, atAnyPlace:true, line:"{symbol symbolRollDie} + {symbol symbolOffer 0~5 -1.1}{symbol symbolResourceAttack} = {symbol symbolStrength}"},
	COMBATRULES_CURSE = { id:"combatrulesprize1", order:-99, atAnyPlace:true, condition:"-1{symbol symbolResourceSkull}:", line:"-1{symbol symbolStrength}" },
	COMBATRULES_LOOTGOLD = { id:"combatrulesprize2", order:-98, atAnyPlace:true, condition:"{symbol symbolStrength} > 3:", line:"+1{symbol symbolResourceGold}" },
	COMBATRULES_SMALLWOUND = { id:"combatrulessmallwound", order:-97, atAnyPlace:true, condition:"{symbol symbolStrength} = 1:", line:"-1{symbol symbolResourceLife}" },
	COMBATRULES_LOOTATTACK = { id:"combatrulesprize3", order:-96, atAnyPlace:true, condition:"{symbol symbolStrength} < 3:", line:"+1{symbol symbolResourceAttack}" },
	SWITCHES = [
		[
			[ [ "biomeWall" ], [ "imageElementStatueA" ] ],
			[ [ "biomeWall" ], [ "imageElementStatueB" ] ]
		],[
			[ [ "biomeWall" ], [ "imageElementStatueB" ] ],
			[ [ "biomeWall" ], [ "imageElementStatueA" ] ]
		]
	],
	TYPE_BARRIER = [ [ "biomeCorridorBackdrop" ], [ "imageElementBarrier" ] ],
	TYPE_CHEST = [ [ "biomeWall" ], [ "imageElementChest" ] ],
	TYPE_BARS = [ [ "biomeCorridorBackdrop" ], [ "imageElementBars" ] ],
	GENERATOR = {
		dungeon:{
			// Excluded similar letters:
			// A: Starting position, looks an arrow pointing north.
			// N: Same as Zz
			// P: Same as p, b, d when rotated
			// U: Same as Cc
			// W: Same as M
			// c: Same as CU
			// f: Same as F
			// i: Same as I
			// j: May be confused with I
			// k: Same as K
			// l: Same as I
			// o: Same as O
			// p: Same as p, b, d when rotated
			// q: Same as p, b, d when rotated
			// s: Same as S
			// u: Same as U
			// v: Same as V
			// x: Same as X
			// y: Same as Y
			// z: Same as ZN
			// w: Same as WM
			ids: "BCDEFGHIJKLMOQRSTVXYZaeghmnrt"
		},
		crawler:{},
		deck:{
			directionsPerJoint:12,
			setLogic:SETLOGIC_REFERENCES,
			setSize:4,
			setMode:SETMODE_MIXED,
			// optimizeWallPosition:true,
			avoidFromCardInDirections:true,
			// suggestFromCardInDirections:true,
			// linkCardsToChunk:true, // NOTE: No true advantage, needs fixes on area-to-area gates
			noWallCards:true
		},
		enemyTypes:[
			[ "biomeWall", "imageElementSkeleton" ],
			[ "biomeWall", "imageElementWarrior" ],
			[ "biomeWall", "imageElementDevil" ]
		],
		enemies:[
			[
				{
					description:"The level 1 enemy: A standard enemy that consumes health",
					sortByPlace:true,
					multiColumn:true,
					isInstant:true,
					boxes:{ see:[
						COMBATRULES,
						COMBATRULES_CURSE,
						COMBATRULES_LOOTGOLD,
						COMBATRULES_LOOTATTACK,
						{ condition:"{symbol symbolStrength} < 3:", line:"-1{symbol symbolResourceLife}", battleMeta:{ level:3, life:1, skull:0 }}
					] }
				},{
					description:"The level 1 debuffer: An enemy that curses the player",
					sortByPlace:true,
					multiColumn:true,
					isInstant:true,
					boxes:{ see:[
						COMBATRULES,
						COMBATRULES_CURSE,
						COMBATRULES_LOOTGOLD,
						COMBATRULES_LOOTATTACK,
						{ condition:"{symbol symbolStrength} < 4:", line:"+1{symbol symbolResourceSkull}", battleMeta:{ level:4, life:0, skull:1 }}
					] }
				}
			],[
				{
					description:"The level 2 enemy: A standard enemy that consumes health",
					sortByPlace:true,
					multiColumn:true,
					isInstant:true,
					boxes:{ see:[
						COMBATRULES,
						COMBATRULES_CURSE,
						COMBATRULES_LOOTGOLD,
						COMBATRULES_LOOTATTACK,
						{ condition:"{symbol symbolStrength} < 4:", line:"-1{symbol symbolResourceLife}", battleMeta:{ level:4, life:1, skull:0 }}
					] }
				}
			],[
				{
					description:"The level 3 enemy: A standard enemy that consumes health",
					sortByPlace:true,
					multiColumn:true,
					isInstant:true,
					boxes:{ see:[
						COMBATRULES,
						COMBATRULES_CURSE,
						COMBATRULES_LOOTGOLD,
						COMBATRULES_LOOTATTACK,
						{ condition:"{symbol symbolStrength} < 5:", line:"-1{symbol symbolResourceLife}", battleMeta:{ level:5, life:1, skull:0 }}
					] }
				}
			]
		],
		structure:[
			{
				// There already is an entrance cell
				crawlFor:5, exitsMap:[ 1, 4 ], addPassage:[ 0, 1 ]
			},{
				crawlFor:7, exitsMap:[ 1, 1, 4 ], addPassage:[ 0, 2 ]
			},{
				crawlFor:6, exitsMap:[ 1, 4, 4 ], addPassage:[ 0, 3 ]
			},{
				crawlFor:6, exitsMap:[ 1, 1, 4 ], addPassage:[ 3, 4 ]
			},{
				crawlFor:5, exitsMap:[ 1, 1, 4 ],
				addExit:true,
				addEnemies:[
					// --- The enemy card only fits 8 enemies in total
					[],
					[
						{ level:0, at:0.5 }
					],[
						{ level:1, at:0.5 },
						{ level:0, atDeadEnds:1 }
					],[
						{ level:2, at:0.5 },
						{ level:1, atDeadEnds:1 }
					],[
						{ level:1, at:0.5 },
						{ level:1, at:0.5 },
						{ level:2, at:0.5 }
					]
				],
				addScatter:true
			}
		]
	},
	PUNCTUATIONS = [ ".", "...", "?", "!" ],
	VERBS=[
		"symbolFight",
		"symbolLook",
		"symbolRun",
		"symbolWalk",
		"symbolRest",
		"symbolWinning",
		"symbolDirect",
		"symbolSwearing",
		"symbolExercise",
		"symbolSurprise",
		"symbolWait",
		"symbolStop",
		"symbolLuck",
		"symbolSteal",
		"symbolMirror",
		"symbolTurn",
		"symbolWrite",
		"symbolBreak",
		"symbolEat",
		"symbolDrink",
		"symbolGrab",
		"symbolPick",
	],
	SUBJECTS = [
		"symbolPrinter",
		"symbolPerson",
		"symbolGroup",
		"symbolHome",
		"symbolWrongPerson",
		"symbolRightPerson",
		"symbolYou",
		"symbolExit",
		"symbolHoly",
		"symbolScroll",
		"symbolRich",
		"symbolGhost",
		"symbolCat",
		"symbolInfinity",
		"symbolBox",
		"symbolMonster",
		"symbolStats",
	],
	SETS = {
		ME:[ "symbolSwearing" ],
		YOU:[ "symbolYou" ],
		EAT:[ "symbolEat" ],
		DRINK:[ "symbolDrink" ],
		TOOLS:[
			"symbolResourceScrewdriver",
			"symbolResourceWrench",
			"symbolResourceHammer"
		],
		MONEY:[
			"symbolResourceGem"
		],
		GRAB:[
			"symbolSteal",
			"symbolDirect",
			"symbolGrab",
		],
		FOOD:[
			"symbolResourceApple",
			"symbolResourceCandy",
			"symbolResourcePasta",
			"symbolResourceChicken",
			"symbolResourceCherries",
			"symbolResourceBanana",
			"symbolResourceMuffin",
			"symbolResourceWatermelon",
			"symbolResourceShrimp",
			"symbolResourcePineapple"
		],
		DRINKS:[
			"symbolResourceWater",
			"symbolResourceTeapot",
			"symbolResourceMug",
		],
		DRAW:[
			"symbolResourcePencil",
			"symbolResourceBrush",
			"symbolResourceCompass",
			"symbolResourceStamp",
			"symbolResourceRuler"
		],
		SEND:[
			"symbolResourceGift",
			"symbolResourceLetter",
			"symbolResourceStamp",
			"symbolBox",
		]
	},
	RESOURCES = [
		"symbolResourceApple",
		"symbolResourceGem",
		"symbolResourceRing",
		"symbolResourceHammer",
		"symbolResourcePencil",
		"symbolResourceFlower",
		"symbolResourceWateringCan",
		"symbolResourceConch",
		"symbolResourceYarn",
		"symbolResourceTeddy",
		"symbolResourceCandy",
		"symbolResourceBell",
		"symbolResourceGift",
		"symbolResourcePotion",
		"symbolResourceBone",
		"symbolResourcePasta",
		"symbolResourceEggplant",
		"symbolResourceShrimp",
		"symbolResourceWatermelon",
		"symbolResourceMuffin",
		"symbolResourceBanana",
		"symbolResourceChicken",
		"symbolResourcePineapple",
		"symbolResourceCherries",
		"symbolResourceCog",
		"symbolResourceScrew",
		"symbolResourceLetter",
		"symbolResourceBrush",
		"symbolResourceCompass",
		"symbolResourceStamp",
		"symbolResourcePushpin",
		"symbolResourceWrench",
		"symbolResourceScrewdriver",
		"symbolResourceInkbottle",
		"symbolResourceRuler",
		"symbolResourceBook",
		"symbolResourceTeapot",
		"symbolResourceFan",
		"symbolResourceDaruma",
		"symbolResourceRook",
		"symbolResourceLeaf",
		"symbolResourceMug",
	],
	ROSETTASTONE_QUESTIONS = [
		{ text:"[[YOU]]{symbol symbolFight}{symbol symbolBreak}?", answer:[ SETS.ME, SETS.TOOLS ] },
		{ text:"[[YOU]]{symbol symbolRich}{symbol symbolRich}?", answer:[ SETS.GRAB, SETS.MONEY ] },
		{ text:"[[YOU]][[EAT]]?", answer:[ SETS.GRAB, SETS.FOOD ] },
		{ text:"[[YOU]][[DRINK]]?", answer:[ SETS.GRAB, SETS.DRINKS ] },
		{ text:"[[YOU]][[FOOD]]?", answer:[ SETS.ME, SETS.EAT ] },
		{ text:"[[YOU]][[DRINKS]]?", answer:[ SETS.ME, SETS.DRINK ] },
		{ text:"[[ME]]{symbol symbolExit}{symbol symbolPerson}...", answer:[ SETS.YOU, SETS.SEND ] },
	],
	BIOMES = [
		{
			biomeWall:[ "imageWallBricks" ],
			biomeCorridor:[ "imageElementFloorStone", "imageElementCorridorStone" ],
			biomeCorridorBackdrop:[ "imageElementFloorStone", "imageElementCorridorBackdrop" ],
			biomeExit:[ "imageElementOutsideMountain", "imageElementFloorStone", "imageElementGateStone", "imageElementFocus" ]
		},{
			biomeWall:[ "imageWallGrass" ],
			biomeCorridor:[ "imageElementFloorGrass", "imageElementCorridorStone" ],
			biomeCorridorBackdrop:[ "imageElementFloorGrass", "imageElementCorridorBackdrop" ],
			biomeExit:[ "imageElementOutsideMountain", "imageElementFloorGrass", "imageElementGateGrass", "imageElementFocus" ]
		},{
			biomeWall:[ "imageWallRocks" ],
			biomeCorridor:[ "imageElementFloorRocks", "imageElementCorridorStone" ],
			biomeCorridorBackdrop:[ "imageElementFloorRocks", "imageElementCorridorBackdrop" ],
			biomeExit:[ "imageElementOutsideMountain", "imageElementFloorRocks", "imageElementGateMine", "imageElementFocus" ]
		},{
			biomeWall:[ "imageWallAztec" ],
			biomeCorridor:[ "imageElementFloorAztec", "imageElementCorridorStone" ],
			biomeCorridorBackdrop:[ "imageElementFloorAztec", "imageElementCorridorBackdrop" ],
			biomeExit:[ "imageElementOutsideMountain", "imageElementFloorAztec", "imageElementGateAztec", "imageElementFocus" ]
		}
	],
	EXITS = [
		{
			description:"The way out: The classic exit",
			id:"exit",
			type:[ [ "biomeExit" ] ],
			atAnyPlace:true,
			isCentered:true,
			isExit:true,
			boxes:[
				{ fakeMove:[
					{ line:"{symbol symbolCrownLarge}\n{symbol symbolYou}{symbol symbolExit}{symbol symbolHoly}{symbol symbolPrinter}! {symbol symbolYou}{symbol symbolCrown}!\n{symbol symbolRuler}\n{symbol symbolResourceGold}+{symbol symbolResourceLife}[[endGameBonuses]]-{symbol symbolResourceSkull} = {symbol symbolVictoryPoints}" }
				] }
			]
		}
	],
	SPECIALS = [
		{
			uuid:"S0",
			description:"The mysterious stone: An unreadable stone telling a story",
			scatterAmount:1,
			id:true,
			type:[
				[ "biomeWall" ],
				[ "imageElementStone" ]
			],
			atAnyPlace:true,
			code:(I)=>{
				let
					editor = HELPERS.newBoxEditor(I, I.card, "look"),
					dialogue = HELPERS.newDialogue(I);

				for (let i=0;i<4;i++)
					editor.add({ line:dialogue.makeLine(1+I.random.integer(3)) });

				editor.add({ line:"{symbol textSeparator}" });
				editor.add({ line:dialogue.makeLine(1+I.random.integer(1)) });
			}
		},{
			uuid:"S1",
			description:"The mimic: Fight to earn gold",
			scatterAmount:1,
			id:true,
			type:TYPE_CHEST,
			atAnyPlace:true,
			boxes:[{
				interact:[
					COMBATRULES,
					COMBATRULES_CURSE,
					COMBATRULES_LOOTGOLD,
					{ condition:"{symbol symbolStrength} > 5:", line:"+1{symbol symbolResourceGold}" },
					{ condition:"{symbol symbolStrength} < 6:", line:"-1{symbol symbolResourceLife}"}
				]
			}]
		},{
			uuid:"S2",
			description:"The cursed cup: Set your curse to 1",
			scatterAmount:1,
			id:true,
			type:[
				[ "biomeWall" ],
				[ "imageElementPedestal" ],
				[ "imageElementChalice" ]
			],
			atAnyPlace:true,
			boxes:[{
				interact:[
					{ line:"{symbol setValue}1{symbol symbolResourceSkull}" }
				]
			}]
		},{
			uuid:"S3",
			description:"The strength cup: Set your attack to 1",
			scatterAmount:1,
			id:true,
			type:[
				[ "biomeWall" ],
				[ "imageElementPedestal" ],
				[ "imageElementChalice" ]
			],
			atAnyPlace:true,
			boxes:[{
				interact:[
					{ line:"{symbol setValue}1{symbol symbolResourceAttack}" }
				]
			}]
		},{
			uuid:"S4",
			description:"The mapping monk: It reads the map for you",
			scatterAmount:1,
			id:true,
			type:[
				[ "biomeWall" ],
				[ "imageElementNpc" ]
			],
			code:(I)=>{
				let
					WORD_MAXLENGTH = 4,
					editor = HELPERS.newBoxEditor(I, I.card, "talk"),
					dialogue = HELPERS.newDialogue(I);
					words = [],
					word = "",
					text = "";

				for (let y=I.dungeon.bounds.y1;y<=I.dungeon.bounds.y2;y++) {
					for (let x=I.dungeon.bounds.x1;x<=I.dungeon.bounds.x2;x++) {
						let
							letter = I.dungeon.grid[y] && I.dungeon.grid[y][x] ? I.dungeon.grid[y][x].id : 0;

						if (letter)
							word+=letter;
						
						if ((!letter && word) || (word.length>=WORD_MAXLENGTH)) {
							words.push(word);
							word = "";
						}
					}
					if (word) {
						words.push(word);
						word = "";
					}
				}

				for (let i=0;i<3;i++) {
					if (words.length)
						editor.add({ line:"\""+dialogue.makeUniqueSentence(true)+" "+I.random.removeElement(words)+dialogue.makePunctuations()+"\"" });
				}
			},
			atAnyPlace:true,
			boxes:[{
				talk:[{}]
			}]
		},{
			uuid:"S5",
			description:"The gift: It gives you a resource you won't need for a reason",
			scatterAmount:1,
			id:true,
			type:[
				[ "biomeWall" ],
				[ "imageElementNpc" ]
			],
			requireResources:[ "gift" ],
			atAnyPlace:true,
			code:(I)=>{
				let
					editor = HELPERS.newBoxEditor(I, I.card, "talk"),
					dialogue = HELPERS.newDialogue(I);

				editor.add({ line:dialogue.makeLine(3) });
				editor.add({ line:"{symbol textSeparator}" });
				editor.add({ line:"{symbol setValue}1"+I.card.resources.gift.symbol });
			}
		},{
			uuid:"S6",
			description:"The risky cup: It may randomly make you rich and strong or poor and weak",
			scatterAmount:1,
			id:true,
			type:[
				[ "biomeWall" ],
				[ "imageElementPedestal" ],
				[ "imageElementChalice" ]
			],
			requireResources:[ "flag" ],
			atAnyPlace:true,
			boxes:[{
				interact:[
					{ line:"{symbol symbolRollDie}" },
					{ condition:"{symbol symbolDieValue} > 3: +1{symbol th}[[resource:flag]]:", line:"+1{symbol symbolResourceGold}, +1{symbol symbolResourceLife}" },
					{ condition:"{symbol symbolDieValue} < 3: +1{symbol th}[[resource:flag]]:", line:"-1{symbol symbolResourceGold}, +1{symbol symbolResourceSkull}" }
				]
			}]
		},{
			uuid:"S7",
			description:"The blessed cup: Decide a prize",
			scatterAmount:1,
			id:true,
			type:[
				[ "biomeWall" ],
				[ "imageElementPedestal" ],
				[ "imageElementChalice" ]
			],
			requireResources:[ "flag" ],
			atAnyPlace:true,
			boxes:[{
				interact:[
					{ condition:"+1{symbol th}[[resource:flag]]?", line:"+1{symbol symbolResourceGold}" },
					{ condition:"+1{symbol th}[[resource:flag]]?", line:"+1{symbol symbolResourceLife}" },
					{ condition:"+1{symbol th}[[resource:flag]]?", line:"+1{symbol symbolResourceAttack}" },
					{ condition:"+1{symbol th}[[resource:flag]]?", line:"{symbol setValue}0{symbol symbolResourceSkull}" }
				]
			}]
		},{
			uuid:"S8",
			description:"The cat: You can pet the cat - just once",
			scatterAmount:1,
			id:true,
			switchType:[
				[
					[ [ "biomeWall" ], [ "imageElementCat1" ] ],
					[ [ "biomeWall" ], [ "imageElementCat2" ] ]
				]
			],
			boxes:[
				{ flip:[] }
			]
		},{
			uuid:"S9",
			description:"The pin-point: Pay gold to get where the exit is",
			scatterAmount:1,
			id:true,
			type:[
				[ "biomeWall" ],
				[ "imageElementCube" ]
			],
			atAnyPlace:true,
			code:(I)=>{
				let
					exit = 0,
					editor = HELPERS.newBoxEditor(I, I.card, "talk"),
					message;

				I.dungeon.cells.forEach(cell=>{
					if (cell.isExit)
						exit = cell;
				})

				message = exit.id+" @ "+exit.x+","+exit.y;

				editor.add({ condition:"-1{symbol symbolResourceGold}?", line:"{qrcode symbolQrCode 1 L Billy: "+message});

				I.deck.setAnswer("pinPoint", { message:message });
			}
		},{
			uuid:"S10",
			description:"The cook: Trade gold with health",
			scatterAmount:1,
			id:true,
			type:[
				[ "biomeWall" ],
				[ "imageElementNpc" ]
			],
			requireResources:[ "gift" ],
			atAnyPlace:true,
			boxes:[
				{ talk:[
					{ line:"\"{symbol symbolYou}{symbol symbolEat}? {symbol symbolSwearing}{symbol symbolRightPerson}!\"" },
					{ line:"{symbol textSeparator}" },
					{ condition:"-1{symbol symbolResourceGold}?", line:"+1{symbol symbolResourceLife}" }
				] }
			],
		},{
			uuid:"S11",
			description:"The bartender: Trade gold with strength",
			scatterAmount:1,
			id:true,
			type:[
				[ "biomeWall" ],
				[ "imageElementNpc" ]
			],
			requireResources:[ "gift" ],
			atAnyPlace:true,
			boxes:[
				{ talk:[
					{ line:"\"{symbol symbolYou}{symbol symbolDrink}? {symbol symbolSwearing}{symbol symbolRightPerson}!\"" },
					{ line:"{symbol textSeparator}" },
					{ condition:"-1{symbol symbolResourceGold}?", line:"+2{symbol symbolResourceAttack}" }
				] }
			],
		},{
			uuid:"S12",
			description:"The shaman: Trade curse with strength",
			scatterAmount:1,
			id:true,
			type:[
				[ "biomeWall" ],
				[ "imageElementNpc" ]
			],
			requireResources:[ "gift" ],
			atAnyPlace:true,
			boxes:[
				{ talk:[
					{ line:"\"{symbol symbolYou}{symbol symbolResourceSkull}? {symbol symbolSwearing}{symbol symbolTurn}{symbol symbolResourceAttack}...\"" },
					{ line:"{symbol textSeparator}" },
					{ condition:"-2{symbol symbolResourceSkull}?", line:"+1{symbol symbolResourceAttack}" }
				] }
			],
		},{
			uuid:"S13",
			description:"The loot box: Pay for a random item",
			scatterAmount:1,
			id:true,
			type:TYPE_CHEST,
			atAnyPlace:true,
			multiColumn:true,
			requireResources:[ "nothing" ],
			boxes:[{
				interact:[
					{ condition:"-1{symbol symbolResourceGold}:", line:"{symbol symbolRollDie}" },
					{ condition:"{symbol symbolDieValue 1}:", line:"+1{symbol symbolResourceSkull}" },
					{ condition:"{symbol symbolDieValue 2}:", line:"+1[[resource:nothing]]" },
					{ condition:"{symbol symbolDieValue 3}:", line:"+1{symbol symbolResourceAttack}" },
					{ condition:"{symbol symbolDieValue 4}:", line:"+1{symbol symbolResourceLife}" },
					{ condition:"{symbol symbolDieValue 5}:", line:"+1{symbol symbolResourceGold}" },
					{ condition:"{symbol symbolDieValue 6}:", line:"+2{symbol symbolResourceGold}" },
				]
			}]
		},{
			uuid:"S14",
			description:"The loading computer: Progresses every time you meet it, giving different bonuses",
			scatterAmount:1,
			id:true,
			type:[
				[ "biomeWall" ],
				[ "imageElementComputer" ]
			],
			atAnyPlace:true,
			requireResources:[ "flag" ],
			code:(I)=>{
				const
					CARD_WIDTH = 57.8,
					BAR_BORDER = 0.5,
					BAR_SPACING = 0.5,
					BAR_SIZE = 5,
					BAR_X = BAR_BORDER+BAR_SPACING,
					BAR_WIDTH = CARD_WIDTH-BAR_X*2,
					BAR_HEIGHT = (BAR_SIZE+BAR_X*2),
					BONUSES = [
						{ isInstant:false, prize:"-1{symbol symbolResourceSkull}" },
						{ isInstant:false, prize:"+1{symbol symbolResourceLife}" },
						{ isInstant:false, prize:"+1{symbol symbolResourceGold}" },
						{ isInstant:false, prize:"-2{symbol symbolResourceSkull}" },
						{ isInstant:false, prize:"+2{symbol symbolResourceLife}" },
						{ isInstant:false, prize:"+2{symbol symbolResourceGold}" },
						{ isInstant:true, prize:"+1{symbol symbolResourceSkull}" },
						{ isInstant:true, prize:"+2{symbol symbolResourceSkull}" },
						{ isInstant:false, prize:"+3{symbol symbolResourceGold}" }
					];

				let
					progress,
					bonus,
					out="",
					editor = HELPERS.newBoxEditor(I, I.card, "interact");

				if (I.isNewSeed) {
					if (I.persistentMemory.step === undefined)
						I.persistentMemory.step = 0;
					else
						I.persistentMemory.step = (I.persistentMemory.step+1) % BONUSES.length;
				}

				progress = Math.max(I.persistentMemory.step/(BONUSES.length-1),0.025);
				bonus = BONUSES[I.persistentMemory.step];
				I.card.isInstant = bonus.isInstant;

				out+="{rect 0 0 "+(CARD_WIDTH)+" "+BAR_BORDER+"}"
				out+="{rect 0 0 "+(BAR_BORDER)+" "+(BAR_HEIGHT)+"}";
				out+="{rect 0 "+(BAR_SIZE+BAR_X*2-BAR_BORDER)+" "+(CARD_WIDTH)+" "+(BAR_BORDER)+"}";
				out+="{rect "+(CARD_WIDTH-BAR_BORDER)+" 0 "+(BAR_BORDER)+" "+(BAR_HEIGHT)+"}";
				out+="{rect "+(BAR_X)+" "+(BAR_X)+" "+(BAR_WIDTH*progress)+" "+(BAR_SIZE)+"}";
				out+="{emptyarea "+(CARD_WIDTH)+" "+(BAR_HEIGHT)+"}";

				editor.add({ line:out });
				editor.add({ line:"{symbol textSeparator}" });
				editor.add({ condition:"+1{symbol th}"+I.card.resources.flag.symbol+":", line:bonus.prize+", \"{symbol symbolNote1}{symbol symbolNote2}{symbol symbolNote1}\"" });
			}
		},{
			uuid:"S15",
			description:"The amulets: Cut an amulet or consume one of them to get a bonus",
			scatterAmount:1,
			id:true,
			type:[
				[ "biomeWall" ],
				[ "imageElementStone" ]
			],
			atAnyPlace:true,
			requireResources:[ "flag" ],
			code:(I)=>{
				const
					AMULETS = [
						{ cutout:"amuletRhombus", outline:"amuletRhombusOutline" }, // It's the Rhombus from the COS tutorial!
						{ cutout:"amuletStar", outline:"amuletStarOutline" },
						{ cutout:"amuletParallelogram", outline:"amuletParallelogramOutline" },
						{ cutout:"amuletPentagon", outline:"amuletPentagonOutline" },
					],
					EFFECTS = [
						"+1{symbol symbolResourceGold}",
						"+1{symbol symbolResourceAttack}",
						"+1{symbol symbolResourceLife}",
						"-1{symbol symbolResourceSkull}",
						"+2{symbol symbolResourceGold}",
						"+2{symbol symbolResourceAttack}",
						"+2{symbol symbolResourceLife}",
						"-2{symbol symbolResourceSkull}",
					],
					EFFECTS_PER_AMULET = 2,
					CARD_WIDTH = 57.8,
					AMULET_SIZE = 30;

				let
					amuletIndexBag = { elements:[] },
					cutoutAmulet,
					outlineAmulet,
					outlineAmuletEffect,
					editor = HELPERS.newBoxEditor(I, I.card, "interact"),
					out = "";

				if (I.persistentMemory.effects === undefined) {
					let
						effectsBag = { elements:[] };

					I.persistentMemory.effects = [];

					for (let i=0;i<EFFECTS.length;i++)
						effectsBag.elements.push(i);
					AMULETS.forEach(_=>{
						let
							set = [];
						for (let i=0;i<EFFECTS_PER_AMULET;i++)
							set.push(I.random.bagPick(effectsBag));
						I.persistentMemory.effects.push(set);
					})
				}

				for (let i=0;i<AMULETS.length;i++)
					amuletIndexBag.elements.push(i);

				cutoutAmulet = I.random.bagPick(amuletIndexBag);
				outlineAmulet = I.random.bagPick(amuletIndexBag);
				outlineAmuletEffect = I.random.integer(EFFECTS_PER_AMULET);

				outlineAmuletEffect = EFFECTS[I.persistentMemory.effects[outlineAmulet][outlineAmuletEffect]];
				outlineAmulet = AMULETS[outlineAmulet].outline;
				cutoutAmulet = AMULETS[cutoutAmulet].cutout;

				out += "{stamp symbolOrBar 28.4 0}";
				out += "{stamp "+cutoutAmulet+" 0 2.76}";
				out += "{stamp "+outlineAmulet+" 31 2.76}";
				out += "{emptyarea 57 31}\n{tabto 35}"+outlineAmuletEffect+", {symbol symbolTrashCan}{symbol symbolThisUp}";

				editor.add({ line:out });
			}
		},{
			uuid:"S16",
			description:"The titan: Trade health with a lot of strength",
			scatterAmount:1,
			id:true,
			type:[
				[ "biomeWall" ],
				[ "imageElementStatueGod3" ]
			],
			atAnyPlace:true,
			boxes:[
				{ interact:[
					{ line:"\"{symbol symbolYou}{symbol symbolHoly}{symbol symbolSwearing}? {symbol symbolYou}{symbol symbolStrength}!\"" },
					{ line:"{symbol textSeparator}" },
					{ condition:"-2{symbol symbolResourceLife}:", line:"+6{symbol symbolResourceAttack}" }
				] }
			],
		},{
			uuid:"S17",
			description:"The mother: Trade strength with full strength",
			scatterAmount:1,
			id:true,
			type:[
				[ "biomeWall" ],
				[ "imageElementStatueGod1" ]
			],
			atAnyPlace:true,
			boxes:[
				{ interact:[
					{ line:"\"{symbol symbolYou}{symbol symbolHoly}{symbol symbolSwearing}? {symbol symbolYou}{symbol symbolResourceLife}!\"" },
					{ line:"{symbol textSeparator}" },
					{ condition:"-3{symbol symbolResourceAttack}:", line:"+6{symbol symbolResourceLife}" }
				] }
			],
		},{
			uuid:"S18",
			description:"The artist: Trade full curse with gold",
			scatterAmount:1,
			id:true,
			type:[
				[ "biomeWall" ],
				[ "imageElementStatueGod2" ]
			],
			requireResources:[ "prize" ],
			atAnyPlace:true,
			boxes:[
				{ interact:[
					{ line:"\"{symbol symbolYou}{symbol symbolHoly}{symbol symbolSwearing}? {symbol symbolYou}{symbol symbolResourceGold}!\"" },
					{ line:"{symbol textSeparator}" },
					{ condition:"+1{symbol th}[[resource:prize]], -6{symbol symbolResourceSkull}:", line:"+6{symbol symbolResourceGold}" }
				] }
			],
		},{
			uuid:"S19",
			description:"The temptress: Trade health with random prize",
			scatterAmount:1,
			id:true,
			type:[
				[ "biomeWall" ],
				[ "imageElementStatueGod4" ]
			],
			requireResources:[ "prize" ],
			atAnyPlace:true,
			boxes:[
				{ interact:[
					{ line:"\"{symbol symbolYou}{symbol symbolHoly}{symbol symbolSwearing}? {symbol symbolYou}{symbol symbolLuck}!\"" },
					{ line:"{symbol textSeparator}" },
					{ condition:"-1{symbol symbolResourceLife}?", line:"{symbol symbolRollDie}" },
					{ condition:"{symbol symbolDieValue 2}/{symbol symbolDieValue 3}:", line:"+3{symbol symbolResourceAttack}" },
					{ condition:"{symbol symbolDieValue 4}/{symbol symbolDieValue 5}:", line:"+3{symbol symbolResourceLife}" },
					{ condition:"{symbol symbolDieValue 6}:", line:"+3{symbol symbolResourceGold}" },
				] }
			],
		},{
			uuid:"S20",
			description:"The stats sage: It gives you mysterious stats and a staff roll",
			scatterAmount:1,
			id:true,
			type:[
				[ "biomeWall" ],
				[ "imageElementNpc" ]
			],
			atAnyPlace:true,
			code:(I)=>{
				let
					CREDITS = [
						"{symbol textSeparator}",
						"{align center}"+I.languageData.creditsSentence,
						"{align center}"+I.languageData.creditsThanks
					],
					DATES = [
						{ label:"{symbol symbolCake}{symbol symbolScroll}{symbol symbolWrite}", month:4, day:26, description:"Birthday: KesieV" },
						{ label:"{symbol symbolCake}{symbol symbolScroll}{symbol symbolWrite}{symbol symbolWrite}", month:3, day:21, description:"Birthday: Bianca" },
						{ label:"{symbol symbolCake}{symbol symbolPrinter}", month:7, day:19, description:"Birthday: Stampadia" },
						{ label:"{symbol symbolResourceCandy}", month:12, day:25, description:"Christmas" },
					],
					editor = HELPERS.newBoxEditor(I, I.card, "talk"),
					nearestDate,
					daysToGo;

				DATES.forEach(date=>{
					let
						today = new Date(),
						year = today.getFullYear(),
						next= new Date(year, date.month-1, date.day),
						days;

					today.setHours(0, 0, 0, 0);
					if (today>next)
						next.setFullYear(year+1);
					days = Math.round((next-today)/8.64e7);

					if (!nearestDate || (daysToGo>days)) {
						nearestDate = date;
						daysToGo = days;
					}
				});

				editor.add({ line:"\"{symbol symbolSwearing}{symbol symbolScroll}{symbol symbolWrite}{symbol symbolYou}{symbol symbolVictoryPoints}!\""});
				editor.add({ line:"{symbol textSeparator}"});

				if (daysToGo) {
					editor.add({ condition:"{symbol symbolReply}{symbol symbolDate}"+nearestDate.label+"?", line:"\"-"+daysToGo+"{symbol symbolDate}\"" })
				} else {
					editor.add({ condition:"{symbol symbolReply}{symbol symbolDate}?", line:"\""+nearestDate.label+"! {symbol symbolParty}{symbol symbolParty}!\"" })
				}

				editor.add({ condition:"{symbol symbolReply}{symbol symbolSwearing}{symbol symbolWait}{symbol symbolWait}{symbol symbolWait}?", line:"\"{symbol symbolYou}{symbol symbolWait}"+I.progress.plays+"\"" })

				if (I.progress.completion >= 1) {
					CREDITS.forEach(line=>editor.add({ line:line }));
				} else {
					editor.add({ condition:"{symbol symbolReply}{symbol symbolSwearing}{symbol symbolDone}?", line:"\"{symbol symbolYou}{symbol symbolDone}"+Math.floor(I.progress.completion*100)+"%\"" } );
				}
			}
		}
	],
	PASSAGES = [
		{
			_tutorial:1,
			uuid:"0",
			description:"The classic lever: Pull the lever to open the door",
			data:{
				path:[
					[
						{
							id:true,
							type:[
								[ "biomeWall" ],
								[ "imageElementLever" ]
							],
							sortByPlace:true,
							boxes:[
								{ interact:[
									{ interactionId:0 },
									{ atFakePlace:true, interactionId:0 },
									{ atFakePlace:true, interactionId:0 }
								] },
							]
						}
					]
				],
				lock:[
					{
						id:true,
						type:TYPE_BARS
					}
				]
			}
		},{
			_tutorial:3,
			uuid:"1",
			description:"The escort: Find the lost NPC and bring it to its friend",
			data:{
				path:[
					[
						{
							id:true,
							setInteraction:true,
							switchType:[
								[
									[ [ "biomeWall" ], [ "imageElementNpc" ] ],
									[ [ "biomeWall" ] ]
								]
							],
							boxes:[
								{ flip:[] }
							]
						}
					]
				],
				lock:[
					{
						id:true,
						newInteraction:true,
						type:[
							[ "biomeCorridorBackdrop" ],
							[ "imageElementNpc" ]
						],
						atAnyPlace:true,
						boxes:[
							{ talk:[
								{ line:"\"{symbol symbolLook}{symbol symbolPerson}!{symbol symbolYou}{symbol symbolRun}{symbol symbolLook}{symbol symbolPerson}?\"" },
								{ line:"{symbol textSeparator}" },
								{
									ifInteractions:[ -1 ],
									interactionId:1
								}
							] }
						],
						mergeGateWith:{
							id:true,
							type:[
								[ "biomeCorridor" ],
								[ "imageElementNpcs" ]
							],
							boxes:[
								{ move:[
									{ order:-100, atAnyPlace:true, line:"\"{symbol symbolRightPerson}{symbol symbolRightPerson}! {symbol symbolYou}{symbol symbolHoly}!\""},
									{ order:-99, atAnyPlace:true, line:"{symbol textSeparator}" }
								]}
							]
						}
					}
				]
			}
		},{
			uuid:"2",
			description:"The dice bowling game: Knock down a dice tower to open the door",
			data:{
				path:[
					[
						{
							id:true,
							type:[
								[ "biomeWall" ],
								[ "imageElementArcade" ]
							],
							atAnyPlace:true,
							boxes:[
								{ interact:[
									{ line:"{symbol schemaDiceBowling}"},
									{ ifInteractions:[ 0 ], condition:"{symbol symbolStrength} = 0:", line:"+1{symbol symbolResourceSkull}" },
									{ ifInteractions:[ 0 ], condition:"{symbol symbolStrength} = 4:", line:"+2" },
									{ condition:"{symbol symbolStrength} > 0:", interactionId:0 },
								] },
							]
						}
					]
				],
				lock:[
					{
						id:true,
						type:TYPE_BARS
					}
				]
			}
		},{
			uuid:"3",
			description:"The dice target game: Roll the die near the edge to open the door",
			data:{
				path:[
					[
						{
							id:true,
							type:[
								[ "biomeWall" ],
								[ "imageElementArcade" ]
							],
							atAnyPlace:true,
							boxes:[
								{ interact:[
									{ line:"{symbol schemaDiceTarget}"},
									{ ifInteractions:[ 0 ], condition:"{symbol symbolStrength} > 4:", line:"+1{symbol symbolResourceAttack}" },
									{ ifInteractions:[ 0 ], condition:"{symbol symbolStrength} = 8:", line:"+3{symbol symbolResourceGold}" },
									{ ifInteractions:[ 0 ], condition:"{symbol symbolStrength} > 6:", interactionId:0 },
								] },
							]
						}
					]
				],
				lock:[
					{
						id:true,
						type:TYPE_BARS
					}
				]
			}
		},{
			uuid:"4",
			description:"The helpful cube: A mysterious and yet familiar cube will open a door for you scanning a QR-Code",
			data:{
				path:[
					[
						{
							id:true,
							type:[
								[ "biomeWall" ],
								[ "imageElementCube" ]
							],
							atAnyPlace:true,
							code:(I)=>{
								let
									VERSIONS="ABCD",
									editor = HELPERS.newBoxEditor(I, I.card, "talk"),
									message;

								message = editor.models[0].card.setIndex+VERSIONS[editor.models[0].card.version]+
									" -> "+
									editor.models[0].toCard.setIndex+VERSIONS[editor.models[0].toCard.version];

								editor.add({ line:"{qrcode symbolQrCode 1 L Anne: "+message });

								I.deck.setAnswer("helpfulCube", { message:message });
							},
							boxes:[
								{ talk:[ { interactionId:0 } ] },
							]
						}
					]
				],
				lock:[
					{
						id:true,
						type:TYPE_BARS
					}
				]
			}
		},{
			uuid:"5",
			description:"The same-value dice game: Play a game, win resources, and pay to open the door",
			data:{
				path:[
					[
						{
							id:true,
							type:[
								[ "biomeWall" ],
								[ "imageElementNpc" ]
							],
							requireResources:[ "prize" ],
							atAnyPlace:true,
							boxes:[
								{ talk:[
									{ line:"{spacing -0.85}{symbol symbolRollDie}{symbol symbolRollDie}{symbol symbolRollDie}{symbol symbolRollDie}{symbol symbolRollDie}{endspacing}, 0~5{symbol symbolRollOtherDice}"},
									{ condition:"{spacing -0.85}{symbol symbolDieValue A}{symbol symbolDieValue A}{symbol symbolDieValue A}{endspacing}:", line:"+1[[resource:prize]]"},
									{ condition:"{spacing -0.85}{symbol symbolDieValue A}{symbol symbolDieValue A}{symbol symbolDieValue A}{symbol symbolDieValue A}{endspacing}:", line:"+1[[resource:prize]]"},
									{ condition:"{spacing -0.85}{symbol symbolDieValue A}{symbol symbolDieValue A}{symbol symbolDieValue A}{symbol symbolDieValue A}{symbol symbolDieValue A}{endspacing}:", line:"+2[[resource:prize]]"},
									{ condition:"-3[[resource:prize]]?", line:"+1{symbol symbolResourceAttack}" },
									{ condition:"-5[[resource:prize]]?", interactionId:0 }
								] }
							],
						}
					]
				],
				lock:[
					{
						id:true,
						type:TYPE_BARS
					}
				]
			}
		},{
			uuid:"6",
			description:"The dice-locking game: Play a game, win resources, and pay to open the door",
			data:{
				path:[
					[
						{
							id:true,
							type:[
								[ "biomeWall" ],
								[ "imageElementNpc" ]
							],
							requireResources:[ "prize" ],
							atAnyPlace:true,
							boxes:[
								{ talk:[
									{ line:"{spacing -0.85}{symbol symbolRollDie}{symbol symbolRollDie}{symbol symbolRollDie}{symbol symbolRollDie}{symbol symbolRollDie}{endspacing}, {symbol startLoop}{spacing -0.85}{symbol symbolLock}{symbol symbolDieValue}{endspacing}, {symbol symbolRollOtherDice}{symbol endLoop}{symbol times}4" },
									{ condition:"{symbol symbolSum}{spacing -0.85}{symbol symbolAllDice}{symbol symbolDieValue}{endspacing} > 18:", line:"+1[[resource:prize]]"},
									{ condition:"{symbol symbolSum}{spacing -0.85}{symbol symbolAllDice}{symbol symbolDieValue}{endspacing} > 20:", line:"+1[[resource:prize]]"},
									{ condition:"{symbol symbolSum}{spacing -0.85}{symbol symbolAllDice}{symbol symbolDieValue}{endspacing} > 24:", line:"+2[[resource:prize]]"},
									{ condition:"-3[[resource:prize]]?", line:"+1{symbol symbolResourceAttack}" },
									{ condition:"-5[[resource:prize]]?", interactionId:0 }
								] }
							]
						}
					]
				],
				lock:[
					{
						id:true,
						type:TYPE_BARS
					}
				]
			}
		},{
			uuid:"7",
			description:"The dice pattern game: Play a game, win resources, and pay to open the door",
			data:{
				path:[
					[
						{
							id:true,
							type:[
								[ "biomeWall" ],
								[ "imageElementNpc" ]
							],
							requireResources:[ "prize" ],
							atAnyPlace:true,
							boxes:[
								{ talk:[
									{ line:"{spacing -0.85}{symbol symbolRollDie}{symbol symbolRollDie}{symbol symbolRollDie}{symbol symbolRollDie}{symbol symbolRollDie}{endspacing}, {symbol startLoop}0~5{symbol symbolRollOtherDice}{symbol endLoop}{symbol times}3"},
									{ condition:"{symbol symbolSum}{spacing -0.85}{symbol symbolDieValue 4}{symbol symbolDieValue 5}{symbol symbolDieValue 6}{symbol symbolAllDice}{symbol symbolDieValue}{endspacing} > 21:", line:"+1[[resource:prize]]"},
									{ condition:"{symbol symbolSum}{spacing -0.85}{symbol symbolDieValue 4}{symbol symbolDieValue 5}{symbol symbolDieValue 6}{symbol symbolAllDice}{symbol symbolDieValue}{endspacing} > 23:", line:"+1[[resource:prize]]"},
									{ condition:"{symbol symbolSum}{spacing -0.85}{symbol symbolDieValue 4}{symbol symbolDieValue 5}{symbol symbolDieValue 6}{symbol symbolAllDice}{symbol symbolDieValue}{endspacing} > 24:", line:"+2[[resource:prize]]"},
									{ condition:"-3[[resource:prize]]?", line:"+1{symbol symbolResourceAttack}" },
									{ condition:"-5[[resource:prize]]?", interactionId:0 }
								] }
							]
						}
					]
				],
				lock:[
					{
						id:true,
						type:TYPE_BARS
					}
				]
			}
		},{
			uuid:"8",
			description:"The no-3 dice game: Play a game, win resources, and pay to open the door",
			data:{
				path:[
					[
						{
							id:true,
							type:[
								[ "biomeWall" ],
								[ "imageElementNpc" ]
							],
							requireResources:[ "prize" ],
							atAnyPlace:true,
							boxes:[
								{ talk:[
									{ line:"{spacing -0.85}{symbol symbolRollDie}{symbol symbolRollDie}{symbol symbolRollDie}{symbol symbolRollDie}{symbol symbolRollDie}{endspacing}, {symbol startLoop}{spacing -1}{symbol symbolRemove}{symbol symbolforEvery}{symbol symbolDieValue 3}{endspacing}, 1~5{symbol symbolRollOtherDice}{symbol endLoop}{symbol times}2"},
									{ condition:"{symbol symbolSum}{spacing -0.85}{symbol symbolAllDice}{symbol symbolDieValue}{endspacing} > 12:", line:"+1[[resource:prize]]"},
									{ condition:"{symbol symbolSum}{spacing -0.85}{symbol symbolAllDice}{symbol symbolDieValue}{endspacing} > 16:", line:"+1[[resource:prize]]"},
									{ condition:"{symbol symbolSum}{spacing -0.85}{symbol symbolAllDice}{symbol symbolDieValue}{endspacing} > 20:", line:"+2[[resource:prize]]"},
									{ condition:"-3[[resource:prize]]?", line:"+1{symbol symbolResourceAttack}" },
									{ condition:"-5[[resource:prize]]?", interactionId:0 }
								] }
							]
						}
					]	
				],
				lock:[
					{
						id:true,
						type:TYPE_BARS
					}
				]
			}
		},{
			uuid:"9",
			description:"The dice golf game: Build a straight in 3 attempts or less",
			data:{
				path:[
					[
						{
							id:true,
							type:[
								[ "biomeWall" ],
								[ "imageElementNpc" ]
							],
							requireResources:[ "prize" ],
							atAnyPlace:true,
							boxes:[
								{ talk:[
									{ line:"{spacing -0.85}{symbol symbolRollDie}{symbol symbolRollDie}{symbol symbolRollDie}{symbol symbolRollDie}{symbol symbolRollDie}{endspacing}, {symbol startLoop}0~5{symbol symbolRollOtherDice}{symbol endLoop}{symbol times}3"},
									{ condition:"{spacing -0.85}{symbol symbolDieValue 1}{symbol symbolDieValue 2}{symbol symbolDieValue 3}{endspacing}:", line:"+1[[resource:prize]]"},
									{ condition:"{spacing -0.85}{symbol symbolDieValue 2}{symbol symbolDieValue 3}{symbol symbolDieValue 4}{endspacing}:", line:"+1[[resource:prize]]"},
									{ condition:"{spacing -0.85}{symbol symbolDieValue 3}{symbol symbolDieValue 4}{symbol symbolDieValue 5}{endspacing}:", line:"+1[[resource:prize]]"},
									{ condition:"{spacing -0.85}{symbol symbolDieValue 4}{symbol symbolDieValue 5}{symbol symbolDieValue 6}{endspacing}:", line:"+1[[resource:prize]]"},
									{ condition:"-5[[resource:prize]]?", line:"+1{symbol symbolResourceAttack}, ", interactionId:0 }
								] }
							],
						}
					]
				],
				lock:[
					{
						id:true,
						type:TYPE_BARS
					}
				]
			}
		},{
			uuid:"10",
			description:"The no-7 game: Remove pairs which sum is 7, score the rest",
			data:{
				path:[
					[
						{
							id:true,
							type:[
								[ "biomeWall" ],
								[ "imageElementNpc" ]
							],
							requireResources:[ "prize" ],
							atAnyPlace:true,
							boxes:[
								{ talk:[
									{ line:"{spacing -0.85}{symbol symbolRollDie}{symbol symbolRollDie}{symbol symbolRollDie}{symbol symbolRollDie}{symbol symbolRollDie}{endspacing}" },
									{ line:"{symbol startLoop}0~5{symbol symbolRollOtherDice}, {symbol symbolRemove}{spacing -0.85}{symbol symbolSum}{symbol symbolDieValue}{symbol symbolDieValue}{endspacing} = 7{symbol endLoop}{symbol times}3"},
									{ condition:"{symbol symbolSum}{spacing -0.85}{symbol symbolAllDice}{symbol symbolDieValue}{endspacing} > 11:", line:"+1[[resource:prize]]"},
									{ condition:"{symbol symbolSum}{spacing -0.85}{symbol symbolAllDice}{symbol symbolDieValue}{endspacing} > 13:", line:"+1[[resource:prize]]"},
									{ condition:"{symbol symbolSum}{spacing -0.85}{symbol symbolAllDice}{symbol symbolDieValue}{endspacing} > 15:", line:"+1[[resource:prize]]"},
									{ condition:"-5[[resource:prize]]?", line:"+1{symbol symbolResourceAttack}, ", interactionId:0 }
								] }
							],
						}
					]
				],
				lock:[
					{
						id:true,
						type:TYPE_BARS
					}
				]
			}
		},{
			uuid:"11",
			description:"The blackjack game: Add dice but do not bust 13",
			data:{
				path:[
					[
						{
							id:true,
							type:[
								[ "biomeWall" ],
								[ "imageElementNpc" ]
							],
							requireResources:[ "prize" ],
							atAnyPlace:true,
							boxes:[
								{ talk:[
									{ line:"{spacing -0.85}{symbol symbolRollDie}{symbol symbolRollDie}{endspacing}, {symbol startLoop}{symbol symbolRollDie}{symbol endLoop}{symbol times}3" },
									{ condition:"{symbol symbolSum}{spacing -0.85}{symbol symbolAllDice}{symbol symbolDieValue}{endspacing} = 13:", line:"+1[[resource:prize]]"},
									{ condition:"{symbol symbolSum}{spacing -0.85}{symbol symbolAllDice}{symbol symbolDieValue}{endspacing} = 12~13:", line:"+1[[resource:prize]]"},
									{ condition:"{symbol symbolSum}{spacing -0.85}{symbol symbolAllDice}{symbol symbolDieValue}{endspacing} = 11~13:", line:"+1[[resource:prize]]"},
									{ condition:"-3[[resource:prize]]?", line:"+1{symbol symbolResourceAttack}" },
									{ condition:"-5[[resource:prize]]?", interactionId:0 }
								] }
							],
						}
					]
				],
				lock:[
					{
						id:true,
						type:TYPE_BARS
					}
				]
			}
		},{
			uuid:"12",
			description:"The mountain game: Cross all of the numbers to win gold",
			data:{
				path:[
					[
						{
							id:true,
							type:[
								[ "biomeWall" ],
								[ "imageElementNpc" ]
							],
							atAnyPlace:true,
							boxes:[
								{ talk:[
									{ line:"{symbol startLoop}{spacing -0.85}{symbol symbolRollDie}{symbol symbolRollDie}{endspacing}, {symbol symbolCrossOut}{symbol symbolDieValue} / {symbol symbolCrossOut}{symbol symbolSum}{spacing -0.85}{symbol symbolDieValue}{symbol symbolDieValue}{endspacing}{symbol endLoop}{symbol times}12"},
									{ line:"{symbol gridMountain}" },
									{ ifInteractions:[ 0 ], condition:"{symbol symbolTickedSquares} = 12:", line:"+2{symbol symbolResourceGold}"},
									{ ifInteractions:[ 0 ], condition:"{symbol symbolTickedSquares} > 9:", line:"+1{symbol symbolResourceGold}"},
									{ ifInteractions:[ 0 ], line:"+1{symbol symbolResourceAttack}, ", interactionId:0 }
								] }
							],
						}
					]
				],
				lock:[
					{
						id:true,
						type:TYPE_BARS
					}
				]
			}
		},{
			uuid:"13",
			description:"The math on map: Draw digits of a sum connecting map positions and give the right answer",
			onlyForArea:ONLYFORAREA_DEADLY, // This may kill you!
			tags:[ "deadly" ],
			data:{
				lock:[
					{
						id:true,
						type:[
							[ "biomeWall" ],
							[ "imageElementCompass" ]
						],
						atAnyPlace:true,
						requireResources:[ "item1", "item2", "item3", "item4" ],
						code:(I)=>{
							let
								SYMBOLS = [ "0","1","2","3","4","5","6","7","8","9" ],
								WRONGANSWERS = [],
								cell = I.card.destinations[0],
								value1 = I.random.integer(10),
								value2 = ((1+I.random.integer(9))*10)+I.random.integer(10),
								sum = value1+value2,
								clearQuestion = value1+" + "+value2,
								answers = [],
								drawing = HELPERS.makeDrawingGrids(I, cell.area);

							answers.push({ isRight:true, label:sum+"?"});

							for (let i=1;i<20;i++) {
								WRONGANSWERS.push(i);
								WRONGANSWERS.push(-i);
							}

							I.random.shuffle(WRONGANSWERS);

							WRONGANSWERS.forEach(delta=>{
								if (answers.length<4 && (sum+delta>0))
									answers.push({ isRight:false, label:(sum+delta)+"?"});
							})

							HELPERS.makeLockQuiz(
								I, "mathOnMapQuiz",
								"interact",
								[ I.card.resources.item1, I.card.resources.item2, I.card.resources.item3, I.card.resources.item4 ],
								drawing.getSymbols(clearQuestion,SYMBOLS),
								[],
								answers,
								LINE_KILLPLAYER
							);

							I.deck.setAnswer("mathOnMapQuiz", { clearQuestion:clearQuestion });
						},
						boxes:[
							{ interact:[{ interactionId:0 }] }
						]
					}
				],
				specialsAmount:1
			}
		},{
			uuid:"14",
			description:"The incomprehensible dialogue: What does the NPC say?",
			data:{
				path:[
					[
						{
							id:true,
							type:[
								[ "biomeWall" ],
								[ "imageElementNpc" ]
							],
							atAnyPlace:true,
							code:(I)=>{
								let
									editor = HELPERS.newBoxEditor(I, I.card, "talk"),
									dialogue = HELPERS.newDialogue(I);

								editor.add({ line:"\""+dialogue.makeLine(3)+"\"" });
								editor.add({ line:"{symbol textSeparator}" });
								editor.add({ condition:"{symbol symbolReply}"+dialogue.makeUniqueSentence()+"?", line:"\""+dialogue.makeLine(2, true)+"\"" });
								editor.addFromModel(0, { condition:"{symbol symbolReply}"+dialogue.makeUniqueSentence()+"?", line:"\""+dialogue.makeUniqueSentence()+"\", ", interactionId:0 });
							},
							boxes:[
								{ talk:[{ interactionId:0 }] }
							]
						}
					]
				],
				lock:[
					{
						id:true,
						type:TYPE_BARS
					}
				]
			}
		},{
			_tutorial:2,
			uuid:"15",
			description:"The rubbles: Find a shovel or use your health to remove rubble",
			data:{
				path:[
					[
						{
							id:true,
							type:TYPE_CHEST,
							sortByPlace:true,
							boxes:[
								{ interact:[
									{ line:"{symbol setValue}1{symbol symbolResourceShovel}"},
									{ atFakePlace:true, line:"{symbol setValue}1{symbol symbolResourceShovel}"},
									{ atFakePlace:true, line:"{symbol setValue}1{symbol symbolResourceShovel}"},
									{ atFakePlace:true, line:"{symbol setValue}1{symbol symbolResourceShovel}"},
									{ atFakePlace:true, line:"{symbol setValue}1{symbol symbolResourceShovel}"},
									{ atFakePlace:true, line:"{symbol setValue}1{symbol symbolResourceShovel}"},
								] }
							]
						}
					]
				],
				lock:[
					{
						id:true,
						type:[
							[ "biomeCorridorBackdrop" ],
							[ "imageElementRubble" ]
						],
						atAnyPlace:true,
						boxes:[
							{ interact:[
								{ condition:"-1{symbol symbolResourceShovel}?", line:"+2{symbol symbolResourceGold}, ", interactionId:0 },
								{ condition:"-2{symbol symbolResourceLife}?", interactionId:0}
							] }
						],
					}
				]
			}
		},{
			uuid:"16",
			description:"The merchant and the lost item: Buy stuff and give the right resource to an NPC blocking the way",
			data:{
				path:[
					[
						{
							id:true,
							type:[
								[ "biomeWall" ],
								[ "imageElementNpc" ]
							],
							requireResources:[ "item1", "item2" ],
							atAnyPlace:true,
							boxes:[
								{ talk:[
									{ line:"\"{symbol symbolYou}{symbol symbolResourceGold}? {symbol symbolWalk}{symbol symbolRightPerson}!\"" },
									{ line:"{symbol textSeparator}" },
									{ condition:"-1{symbol symbolResourceGold}?", line:"+1[[resource:item1]]" },
									{ condition:"-1{symbol symbolResourceGold}?", line:"+1[[resource:item2]]" },
									{ condition:"-2{symbol symbolResourceGold}?", line:"+1{symbol symbolResourceLife}" },
									{ condition:"-2{symbol symbolResourceGold}?", line:"+1{symbol symbolResourceAttack}" },
								] }
							],
							
						}
					]
				],
				lock:[
					{
						id:true,
						type:[
							[ "biomeCorridorBackdrop" ],
							[ "imageElementNpc" ]
						],
						boxes:[
							{ talk:[
								{ atAnyPlace:true, line:"\"{symbol symbolYou}{symbol symbolStop}... {symbol symbolYou}{symbol symbolHoly}?\"" },
								{ atAnyPlace:true, line:"{symbol textSeparator}" },
								{ atAnyPlace:true, condition:"{symbol symbolResourceGold} = 0:", line:"+1{symbol symbolResourceGold}" },
								{ condition:"-1[[resource:item1]]?", line:"\"{symbol symbolYou}{symbol symbolRun}!\", ", interactionId:0 },
								{ atFakePlace:true, condition:"-1[[resource:item2]]?", line:"\"{symbol symbolYou}{symbol symbolRun}!\", ", interactionId:0 },
							] },
							{ talk:[
								{ atAnyPlace:true, line:"\"{symbol symbolYou}{symbol symbolStop}... {symbol symbolYou}{symbol symbolHoly}?\"" },
								{ atAnyPlace:true, line:"{symbol textSeparator}" },
								{ atAnyPlace:true, condition:"{symbol symbolResourceGold} = 0:", line:"+1{symbol symbolResourceGold}" },
								{ atFakePlace:true, condition:"-1[[resource:item1]]?", line:"\"{symbol symbolYou}{symbol symbolRun}!\", ", interactionId:0 },
								{ condition:"-1[[resource:item2]]?", line:"\"{symbol symbolYou}{symbol symbolRun}!\", ", interactionId:0 },
							] }
						],
						mergeGateWith:{
							id:true,
							type:[
								[ "biomeCorridor" ],
								[ "imageElementSideNpc" ]
							],
							boxes:[
								{ move:[
									{ order:-100, atAnyPlace:true, line:"\"{symbol symbolYou}{symbol symbolHoly}!\""},
									{ order:-99, atAnyPlace:true, line:"{symbol textSeparator}" }
								]}
							]
						}
					}
				]
			}
		},{
			uuid:"17",
			description:"The composite key: Find the requested resources to open the door",
			data:{
				path:[
					[
						{
							id:true,
							type:TYPE_CHEST,
							sortByPlace:true,
							requireResources:[ "item1" ],
							boxes:[
								{ interact:[
									{ line:"{symbol setValue}1[[resource:item1]]" },
									{ atFakePlace:true, line:"{symbol setValue}1[[resource:item1]]" },
									{ atFakePlace:true, line:"{symbol setValue}1[[resource:item1]]" }
								] }
							]
						},{
							id:true,
							type:TYPE_CHEST,
							sortByPlace:true,
							requireResources:[ "item2" ],
							boxes:[
								{ interact:[
									{ line:"{symbol setValue}1[[resource:item2]]"},
									{ atFakePlace:true, line:"{symbol setValue}1[[resource:item2]]" },
									{ atFakePlace:true, line:"{symbol setValue}1[[resource:item2]]" }
								] }
							]
						}
					]
				],
				lock:[
					{
						id:true,
						type:[
							[ "biomeCorridorBackdrop" ],
							[ "imageElementBars" ],
							[ "imageElementPedestal" ]
						],
						atAnyPlace:true,
						boxes:[
							{ interact:[
								{ condition:"-1[[resource:item1]], -1[[resource:item2]]:", interactionId:0 }
							] }
						]
					}
				]
			}
		},{
			uuid:"18",
			description:"The locked chest: Find the key, open the chest, and deliver the item",
			data:{
				path:[
					[
						{
							id:true,
							type:TYPE_CHEST,
							sortByPlace:true,
							requireKeys:[ "key1" ],
							requireResources:[ "item1" ],
							boxes:[
								{ interact:[
									{ condition:"[[key:key1]]:", line:"{symbol setValue}1[[resource:item1]]" },
									{ atFakePlace:true, condition:"[[key:key1]]:", line:"{symbol setValue}1[[resource:item1]]" },
									{ atFakePlace:true, condition:"[[key:key1]]:", line:"{symbol setValue}1[[resource:item1]]" },
								] }
							]
						}
					]
				],
				lock:[
					{
						id:true,
						type:[
							[ "biomeCorridorBackdrop" ],
							[ "imageElementNpc" ]
						],
						atAnyPlace:true,
						boxes:[
							{ talk:[
								{ line:"\"{symbol symbolLook}[[resource:item1]]... {symbol symbolSurprise}{symbol symbolPin}[[resource:item1]]?\"" },
								{ line:"{symbol textSeparator}" },
								{ line:"+[[key:key1]]" },
								{ condition:"-1[[resource:item1]]:", interactionId:0 }
							] }
						],
						mergeGateWith:{
							id:true,
							type:[
								[ "biomeCorridor" ],
								[ "imageElementSideNpc" ]
							],
							boxes:[
								{ move:[
									{ order:-100, atAnyPlace:true, line:"\"[[resource:item1]]! [[resource:item1]]!\""},
									{ order:-99, atAnyPlace:true, line:"{symbol textSeparator}" }
								]}
							]
						}
					}
				]
			}
		},{
			uuid:"19",
			description:"The thief: Find the stolen goods and deliver them to NPC",
			data:{
				path:[
					[
						{
							id:true,
							type:[
								[ "biomeWall" ],
								[ "imageElementFairy" ]
							],
							sortByPlace:true,
							requireResources:[ "item1" ],
							boxes:[
								{ interact:[
									COMBATRULES,
									COMBATRULES_CURSE,
									{ condition:"{symbol symbolStrength} > 2:", line:"+1{symbol th}[[resource:item1]]" },
								] }
							]
						},{
							id:true,
							type:[
								[ "biomeWall" ],
								[ "imageElementFairy" ]
							],
							sortByPlace:true,
							boxes:[
								{ interact:[
									COMBATRULES,
									COMBATRULES_CURSE,
									{ condition:"{symbol symbolStrength} > 2:", line:"+2{symbol th}[[resource:item1]]" },
									{ atFakePlace:true, condition:"{symbol symbolStrength} > 2:", line:"+2{symbol th}[[resource:item1]]" },
								] }
							]
						},{
							id:true,
							type:[
								[ "biomeWall" ],
								[ "imageElementFairy" ]
							],
							sortByPlace:true,
							boxes:[
								{ interact:[
									COMBATRULES,
									COMBATRULES_CURSE,
									{ condition:"{symbol symbolStrength} > 2:", line:"+3{symbol th}[[resource:item1]]" }
								] }
							]
						}
					]
				],
				lock:[
					{
						id:true,
						type:[
							[ "biomeCorridorBackdrop" ],
							[ "imageElementNpc" ]
						],
						atAnyPlace:true,
						boxes:[
							{ talk:[
								{ line:"\"{symbol symbolSteal}[[resource:item1]][[resource:item1]][[resource:item1]]...\"" },
								{ line:"{symbol textSeparator}" },
								{ condition:"[[resource:item1]] = 3:", interactionId:0 }
							] }
						],
						mergeGateWith:{
							id:true,
							type:[
								[ "biomeCorridor" ],
								[ "imageElementSideNpc" ]
							],
							boxes:[
								{ move:[
									{ order:-100, atAnyPlace:true, line:"\"{symbol symbolYou}{symbol symbolStop}{symbol symbolSteal}! [[resource:item1]][[resource:item1]][[resource:item1]]!\""},
									{ order:-99, atAnyPlace:true, line:"{symbol textSeparator}" }
								]}
							]
						}
					}
				]
			}
		},{
			uuid:"20",
			description:"The sequence: Beat enemies in order to gain goods and deliver them to NPC",
			data:{
				path:[
					[
						{
							id:true,
							type:[
								[ "biomeWall" ],
								[ "imageElementFairy" ]
							],
							sortByPlace:true,
							requireResources:[ "item1" ],
							isInstant:true,
							boxes:[
								{ see:[
									COMBATRULES,
									COMBATRULES_CURSE,
									{ condition:"{symbol symbolStrength} > 2: +1{symbol th}[[resource:item1]]:", line:"+1{symbol symbolResourceGold}" },
								] }
							]
						},{
							id:true,
							type:[
								[ "biomeWall" ],
								[ "imageElementFairy" ]
							],
							sortByPlace:true,
							isInstant:true,
							boxes:[
								{ see:[
									COMBATRULES,
									COMBATRULES_CURSE,
									{ condition:"1{symbol th}[[resource:item1]]: {symbol symbolStrength} > 2: +2{symbol th}[[resource:item1]]:", line:"+1{symbol symbolResourceGold}" },
								] }
							]
						},{
							id:true,
							type:[
								[ "biomeWall" ],
								[ "imageElementFairy" ]
							],
							sortByPlace:true,
							isInstant:true,
							boxes:[
								{ see:[
									COMBATRULES,
									COMBATRULES_CURSE,
									{ condition:"2{symbol th}[[resource:item1]]: {symbol symbolStrength} > 2: +3{symbol th}[[resource:item1]]:", line:"+1{symbol symbolResourceGold}" },
									{ atFakePlace:true, condition:"2{symbol th}[[resource:item1]]: {symbol symbolStrength} > 2: +3{symbol th}[[resource:item1]]:", line:"+1{symbol symbolResourceGold}" },
								] }
							]
						}
					]
				],
				lock:[
					{
						id:true,
						type:[
							[ "biomeCorridorBackdrop" ],
							[ "imageElementNpc" ]
						],
						atAnyPlace:true,
						boxes:[
							{ talk:[
								{ line:"\"{symbol symbolSteal}[[resource:item1]][[resource:item1]][[resource:item1]]...\"" },
								{ line:"{symbol textSeparator}" },
								{ condition:"[[resource:item1]] = 3:", interactionId:0 }
							] }
						],
						mergeGateWith:{
							id:true,
							type:[
								[ "biomeCorridor" ],
								[ "imageElementSideNpc" ]
							],
							boxes:[
								{ move:[
									{ order:-100, atAnyPlace:true, line:"\"{symbol symbolYou}{symbol symbolStop}{symbol symbolSteal}! [[resource:item1]][[resource:item1]][[resource:item1]]!\""},
									{ order:-99, atAnyPlace:true, line:"{symbol textSeparator}" }
								]}
							]
						}
					}
				]
			}
		},{
			uuid:"21",
			description:"The oracle: Get random blessings/punishments or offer the right item to pass",
			data:{
				path:[
					[
						{
							id:true,
							type:TYPE_CHEST,
							sortByPlace:true,
							requireResources:[ "item1" ],
							boxes:[
								{ interact:[
									{ line:"{symbol setValue}1[[resource:item1]]" },
									{ atFakePlace:true, line:"{symbol setValue}1[[resource:item1]]" },
									{ atFakePlace:true, line:"{symbol setValue}1[[resource:item1]]" }
								] }
							]
						}
					]
				],
				lock:[
					{
						id:true,
						type:[
							[ "biomeWall" ],
							[ "imageElementStoneWall" ]
						],
						atAnyPlace:true,
						boxes:[
							{ interact:[
								{ line:"{symbol symbolRollDie}" },
								{ condition:"{symbol symbolDieValue 1}:", line:"-1{symbol symbolResourceLife}" },
								{ condition:"{symbol symbolDieValue} < 3:", line:"+1{symbol symbolResourceSkull}" },
								{ condition:"{symbol symbolDieValue} > 4:", line:"+1{symbol symbolResourceGold}" },
								{ condition:"{symbol symbolDieValue 6}:", line:"+1{symbol symbolResourceAttack}" },
								{ condition:"-1[[resource:item1]]:", interactionId:0 },
							] }
						]
					}
				]
			}
		},{
			uuid:"22",
			description:"The sacrifice: Trade key resources or offer the right item to pass",
			data:{
				path:[
					[
						{
							id:true,
							type:TYPE_CHEST,
							sortByPlace:true,
							requireResources:[ "item1" ],
							boxes:[
								{ interact:[
									{ line:"{symbol setValue}1[[resource:item1]]" },
									{ atFakePlace:true, line:"{symbol setValue}1[[resource:item1]]" },
									{ atFakePlace:true, line:"{symbol setValue}1[[resource:item1]]" }
								] }
							]
						}
					]
				],
				lock:[
					{
						id:true,
						type:[
							[ "biomeWall" ],
							[ "imageElementStoneWall" ]
						],
						atAnyPlace:true,
						boxes:[
							{ interact:[
								{ condition:"[[resource:item1]] = 0:", line:"+1{symbol symbolResourceSkull}" },
								{ condition:"-2{symbol symbolResourceLife}?", line:"+4{symbol symbolResourceGold}" },
								{ condition:"-1{symbol symbolResourceGold}?", line:"-1{symbol symbolResourceSkull}" },
								{ condition:"-2{symbol symbolResourceGold}?", line:"+1{symbol symbolResourceAttack}" },
								{ condition:"-2{symbol symbolResourceAttack}?", line:"+1{symbol symbolResourceLife}" },
								{ condition:"[[resource:item1]]:", interactionId:0 },
							] }
						]
					}
				]
			}
		},{
			uuid:"23",
			description:"The bounty: Pay for passing or defeat an enemy",
			data:{
				path:[
					[
						{
							id:true,
							type:[
								[ "biomeWall" ],
								[ "imageElementBoss" ]
							],
							atAnyPlace:true,
							requireResources:[ "item1" ],
							boxes:[
								{ interact:[
									COMBATRULES,
									COMBATRULES_CURSE,
									COMBATRULES_LOOTATTACK,
									COMBATRULES_SMALLWOUND,
									{ condition:"{symbol symbolStrength} > 4: +1{symbol th}[[resource:item1]]:", line:"+2{symbol symbolResourceGold}" },
								] }
							]
						}
					]
				],
				lock:[
					{
						id:true,
						type:[
							[ "biomeCorridorBackdrop" ],
							[ "imageElementNpc" ]
						],
						atAnyPlace:true,
						boxes:[
							{ talk:[
								{ line:"\"{symbol symbolYou}{symbol symbolFight}{symbol symbolWrongPerson}? ...{symbol symbolYou}{symbol symbolRich}{symbol symbolSwearing}{symbol symbolFight}?\"" },
								{ line:"{symbol textSeparator}" },
								{ condition:"-4{symbol symbolResourceGold}?", interactionId:0 },
								{ condition:"1{symbol th}[[resource:item1]]?", interactionId:0 },
							] }
						]
					}
				]
			}
		},{
			uuid:"24",
			description:"The bloody gambler: Bet your health to pass",
			data:{
				path:[
					[
						{
							id:true,
							type:[
								[ "biomeWall" ],
								[ "imageElementNpc" ]
							],
							atAnyPlace:true,
							boxes:[
								{ talk:[
									{ line:"\"...\"" },
									{ line:"{symbol textSeparator}" },
									{ line:"{symbol symbolOffer 1~3 -1.1}{symbol symbolResourceLife} + {symbol symbolRollDie} = {symbol symbolStrength}" },
									{ condition:"{symbol symbolStrength} = 2:", line:"+1{symbol symbolResourceLife}" },
									{ condition:"{symbol symbolStrength} > 3:", line:"+{symbol symbolOffer}{symbol symbolResourceLife}" },
									{ condition:"{symbol symbolStrength} > 5:", line:"+1{symbol symbolResourceLife}" },
									{ condition:"{symbol symbolStrength} > 4:", interactionId:0 },
								] }
							]
						}
					]
				],
				lock:[
					{
						id:true,
						type:TYPE_BARS
					}
				]
			}
		},{
			uuid:"25",
			description:"The teleporter: Unlock the door but teleport to a random place",
			onlyForArea:ONLYFORAREA_TELEPORTERS, // The more cells the teleport have, the better the effect.
			data:{
				path:[
					[
						{
							id:true,
							type:[
								[ "biomeWall" ],
								[ "imageElementTeleport" ]
							],
							sortByPlace:true,
							boxes:[
								{ teleport:[
									{ atAnyPlace:true, interactionId:0 },
									{ teleportToRandomPlace:true },
									{ atFakePlace:true, teleportToRandomPlace:true },
									{ atFakePlace:true, teleportToRandomPlace:true },
								] }
							]
						}
					]
				],
				lock:[
					{
						id:true,
						type:TYPE_BARS
					}
				]
			}
		},{
			uuid:"26",
			description:"The scary room: Teleport to a scary unmapped place to unlock the door",
			onlyForArea:ONLYFORAREA_TELEPORTERS, // The more cells the teleport have, the better the effect.
			data:{
				path:[
					[
						{
							id:true,
							requireKeys:[ "key1" ],
							type:[
								[ "biomeWall" ],
								[ "imageElementTeleport" ]
							],
							sortByPlace:true,
							subplaces:{
								hiddenRoom:[
									{
										id:true,
										type:[
											[ "biomeWall" ],
											[ "imageElementStoneWall" ]
										],
										atAnyPlace:true,
										boxes:[
											{ teleport:[
												{ line:"{symbol symbolRollDie}" },
												{ condition:"{symbol symbolDieValue 1}:", line:"-1{symbol symbolResourceLife}" },
												{ condition:"{symbol symbolDieValue} < 3:", line:"+2{symbol symbolResourceSkull}" },
												{ condition:"{symbol symbolDieValue} > 4:", line:"+2{symbol symbolResourceGold}" },
												{ condition:"{symbol symbolDieValue 6}:", line:"+2{symbol symbolResourceAttack}" },
												{ line:"+[[key:key1]], ", teleportToRandomPlace:true },
											] }
										]
									}
								]
							},
							boxes:[
								{ teleport:[
									{ teleportToSubplace:"hiddenRoom" },
									{ atFakePlace:true, teleportToRandomPlace:true },
									{ atFakePlace:true, teleportToRandomPlace:true },
									{ atFakePlace:true, teleportToRandomPlace:true },
								] }
							]
						}
					]
				],
				lock:[
					{
						id:true,
						keepOriginalGate:true,
						addOverallCondition:"[[key:key1]]:",
						type:TYPE_BARRIER
					}
				]
			}
		},{
			uuid:"27",
			description:"The ghost: Teleport to a ghost in the map, fight it, and unlock the door",
			data:{
				lock:[
					{
						id:true,
						type:[
							[ "biomeCorridorBackdrop" ],
							[ "imageElementNpc" ]
						],
						atAnyPlace:true,
						subplaces:{
							ghost:[
								{
									id:true,
									type:[
										[ "biomeWall" ],
										[ "imageElementGhost" ]
									],
									atAnyPlace:true,
									isInstant:true,
									boxes:[
										{ see:[
											COMBATRULES,
											COMBATRULES_CURSE,
											COMBATRULES_LOOTGOLD,
											COMBATRULES_LOOTATTACK,
											{ condition:"{symbol symbolStrength} < 5:", line:"-1{symbol symbolResourceLife}"},
											{ line:"+1{symbol symbolResourceSkull}, ", interactionId:0 },
										] }
									]
								}
							]
						},
						boxes:[
							{ talk:[
								{ line:"\"{symbol symbolSurprise}{symbol symbolSwearing}{symbol symbolGhost}... {symbol symbolYou}{symbol symbolRun}{symbol symbolLook}?\"" },
								{ line:"{symbol textSeparator}" },
								{ condition:"{symbol symbolReply}{symbol symbolRun}{symbol symbolLook}:", teleportToGhost:"ghost" },
								{ condition:"{symbol symbolReply}{symbol symbolSurprise}:", line:"\"{symbol symbolSurprise}{symbol symbolGhost}!\"" },
							] }
						],
						mergeGateWith:{
							id:true,
							type:[
								[ "biomeCorridor" ],
								[ "imageElementSideNpc" ]
							],
							boxes:[
								{ move:[
									{ order:-100, atAnyPlace:true, line:"\"{symbol symbolYou}{symbol symbolLook}{symbol symbolGhost}?!\""},
									{ order:-99, atAnyPlace:true, line:"{symbol textSeparator}" }
								]}
							]
						}
					}
				]
			}
		},{
			uuid:"28",
			description:"The compass puzzle: Sum card numbers at a given direction at given cells",
			onlyForArea:ONLYFORAREA_DEADLY, // This may kill you!
			tags:[ "deadly" ],
			data:{
				lock:[
					{
						id:true,
						type:[
							[ "biomeWall" ],
							[ "imageElementCompass" ]
						],
						atAnyPlace:true,
						requireResources:[ "item1", "item2", "item3", "item4" ],
						code:(I)=>{

							let
								cell = I.card.destinations[0],
								cells = [],
								directions = [{},{},{},{}];

							// Calculate available cells for the puzzle
							I.dungeon.cells.forEach(dc=>{
								if (!dc.isStartingCell && (dc.area < cell.area)) {
									let
										validCamera = I.deck.getValidCamerasForCell(dc)[0].camera,
										camera = I.deck.getCameraFromCell(dc, validCamera);

									if (cells.indexOf(dc.id) == -1)
										cells.push(dc.id);

									validCamera.forEach((side,pos)=>{
										directions[side.direction][dc.id]=camera[pos].noCard ? 0 : camera[pos].setIndex;
									})
									
								}
							})

							// If there are at least 3 cells...
							if (cells.length > 2) {
								let
									totals,
									cellsCopy = [...cells],
									selectedCells = [],
									options = [];

								// Select 3 of them...
								for (let i=0;i<3;i++)
									selectedCells.push(I.random.removeElement(cellsCopy));

								// Calculate totals for all directions...
								totals = directions.map((_,direction)=>{
									let
										total = 0;
									selectedCells.forEach(cell=>{
										total += directions[direction][cell];
									})
									return total;
								})

								// Discard quizzes with the same answer...
								totals.forEach((total,side)=>{
									let
										subtotals = totals.filter((a,id)=>totals.indexOf(a) == id);
									if (totals.length>2)
										options.push({ side:side, answer:totals[side], subtotals:subtotals});
								})

								// Select a quiz from the valid set and creates the quiz.
								if (options.length) {
									let
										option = I.random.element(options),
										answers = option.subtotals.map(total=>{
											return { isRight:total == option.answer, label:total+"?" }
										});

									HELPERS.makeLockQuiz(
										I, "compassSumQuiz",
										"interact",
										[ I.card.resources.item1, I.card.resources.item2, I.card.resources.item3, I.card.resources.item4 ],
										"{symbol symbolPosition "+selectedCells[0]+"}+{symbol symbolPosition "+selectedCells[1]+"}+{symbol symbolPosition "+selectedCells[2]+"} = ?",
										[
											[ "imageElementCompassNorth", "imageElementCompassEast", "imageElementCompassSouth", "imageElementCompassWest" ][option.side]
										],
										answers,
										LINE_KILLPLAYER
									);

									I.deck.setAnswer("compassSumQuiz",{ option:option, directions:directions })

								}

							}
						},
						boxes:[
							{ interact:[{ interactionId:0 }] }
						]
					}
				],
				specialsAmount:1
			}
		},{
			uuid:"29",
			description:"The word search puzzle: Find the letters sequence in the map",
			onlyForArea:ONLYFORAREA_DEADLY, // This may kill you!
			tags:[ "deadly" ],
			data:{
				lock:[
					{
						id:true,
						type:[
							[ "biomeWall" ],
							[ "imageElementCompass" ]
						],
						atAnyPlace:true,
						requireResources:[ "item1", "item2", "item3", "item4" ],
						code:(I)=>{
							let
								DIRECTIONS = [ {x:0, y:-1}, {x:1, y:-1}, {x:1, y:0}, {x:1, y:1}, {x:0, y:1}, {x:-1, y:1}, {x:-1, y:0}, {x:-1, y:-1} ],
								WORDLENGTHS = [ 4, 3, 2 ],
								WRONGANSWERS = 3,
								cell = I.card.destinations[0],
								map = HELPERS.makeMap(I, cell.area),
								words = [],
								answers = [];

							I.random.shuffle(map.letters);

							for (let y=map.y1;y<=map.y2;y++) {
								for (let x=map.x1;x<=map.x2;x++) {
									DIRECTIONS.forEach(direction=>{
										WORDLENGTHS.forEach(len=>{
											let
												lx = x, ly = y,
												isValid = true,
												word = "";

											if (!words[len])
												words[len] = [];
											for (let j=0;j<len;j++) {
												if (map.grid[ly] && map.grid[ly][lx]) {
													word+=map.grid[ly][lx];
												} else {
													isValid = false;
												}
												lx+=direction.x;
												ly+=direction.y;
											}
											if (isValid && (words[len].indexOf(word) == -1))
												words[len].push(word);
										})
										
									})
								}
							}

							WORDLENGTHS.forEach(len=>{
								if (!answers.length && words[len].length) {
									let
										set = words[len],
										rightAnswer = I.random.element(set),
										wrongAnswer,
										wrongBag = { elements:map.letters };

									answers.push({ isRight:true, label:rightAnswer+"?"});

									for (let j=0;j<WRONGANSWERS;j++) {
										do {
											delete wrongBag.list;
											wrongAnswer = "";
											for (let i=0;i<len;i++)
												wrongAnswer+=I.random.bagPick(wrongBag);
										} while (set.indexOf(wrongAnswer) != -1);

										set.push(wrongAnswer);
										answers.push({ isRight:false, label:wrongAnswer+"?"});
									}
								}
							});

							HELPERS.makeLockQuiz(
								I, "wordSearchQuiz",
								"interact",
								[ I.card.resources.item1, I.card.resources.item2, I.card.resources.item3, I.card.resources.item4 ],
								"{symbol symbolLook}{symbol symbolYou}{symbol symbolScroll}...",
								[],
								answers,
								LINE_KILLPLAYER
							);
						},
						boxes:[
							{ interact:[{ interactionId:0 }] }
						]
					}
				],
				specialsAmount:1
			}
		},{
			uuid:"30",
			description:"The mirrors puzzle: Find the corners sequence from the light to the door",
			onlyForArea:ONLYFORAREA_DEADLY, // This may kill you!
			tags:[ "deadly"],
			data:{
				path:[
					[
						{
							atArea:[-1],
							id:true,
							markCell:{
								eventMirrorsPuzzleEmitter:1
							},
							type:[
								[ "biomeWall" ],
								[ "imageElementStoneWall" ],
								[ "imageElementStoneWallLight" ],
							],
						}
					]
				],
				lock:[
					{
						id:true,
						type:[
							[ "biomeWall" ],
							[ "imageElementStoneWall" ]
						],
						atAnyPlace:true,
						requireResources:[ "item1", "item2", "item3", "item4" ],
						code:(I)=>{
							let
								WRONGANSWERS = I.random.shuffle([ -1, 1, -2, 2, -3, 3 ]),
								cell = I.card.destinations[0],
								origin = I.card.origins[0],
								route = I.dungeon.findRouteToMark(origin,"eventMirrorsPuzzleEmitter",1, cell.area-1),
								corners = 1,
								cornersList = [],
								answers = [];

							route.path.forEach((step,id)=>{
								if (route.path[id-1] && (step.direction != route.path[id-1].direction)) {
									cornersList.push(route.path[id-1].cell.id);
									corners++;
								}
							})

							answers.push({ isRight:true, label:corners+"?"});

							WRONGANSWERS.forEach(delta=>{
								if (answers.length<4 && (corners+delta>0))
									answers.push({ isRight:false, label:(corners+delta)+"?"});
							})

							HELPERS.makeLockQuiz(
								I, "mirrorsQuiz",
								"interact",
								[ I.card.resources.item1, I.card.resources.item2, I.card.resources.item3, I.card.resources.item4 ],
								"{symbol symbolSwearing}{symbol symbolMirror}, {symbol symbolExit}{symbol symbolMirror}...",
								[],
								answers,
								LINE_KILLPLAYER
							);

							I.deck.setAnswer("mirrorsQuiz",{ from:cell.id, cornersList:cornersList })

						},
						boxes:[
							{ interact:[{ interactionId:0 }] }
						]
					}
				]
			}
		},{
			uuid:"31",
			description:"The dead end puzzle: Count the dead ends so far",
			onlyForArea:ONLYFORAREA_DEADLY, // This may kill you!
			tags:[ "deadly"],
			data:{
				lock:[
					{
						id:true,
						type:[
							[ "biomeWall" ],
							[ "imageElementStoneWall" ]
						],
						atAnyPlace:true,
						requireResources:[ "item1", "item2", "item3", "item4" ],
						code:(I)=>{
							let
								WRONGANSWERS = I.random.shuffle([ -1, 1, -2, 2, -3, 3 ]),
								cell = I.card.destinations[0],
								deadEndCount = 0,
								deadEnds = [],
								answers = [];

							I.dungeon.cells.forEach(dc=>{
								if (dc.area < cell.area) {
									let
										walls = 0;
									dc.walls.forEach(wall=>{
										if (wall)
											walls++;
									});
									if (walls == 3) {
										deadEnds.push(dc.id);
										deadEndCount++;
									}
								}
							})

							answers.push({ isRight:true, label:deadEndCount+"?"});

							WRONGANSWERS.forEach(delta=>{
								if (answers.length<4 && (deadEndCount+delta>0))
									answers.push({ isRight:false, label:(deadEndCount+delta)+"?"});
							})

							HELPERS.makeLockQuiz(
								I, "deadEndQuiz",
								"interact",
								[ I.card.resources.item1, I.card.resources.item2, I.card.resources.item3, I.card.resources.item4 ],
								"{symbol symbolStop}{symbol symbolSurprise}... {symbol symbolYou}{symbol symbolTurn}{symbol symbolWalk}!",
								[],
								answers,
								LINE_KILLPLAYER
							);

							I.deck.setAnswer("deadEndQuiz",{ deadEnds:deadEnds });

						},
						boxes:[
							{ interact:[{ interactionId:0 }] }
						]
					}
				],
				specialsAmount:1
			}
		},{
			uuid:"32",
			description:"The poisoned dungeon: Scatter poison around the dungeon",
			onlyForArea:ONLYFORAREA_FIRST, // A free early exit...
			tags:[ "scatter" ],
			data:{
				scatter:[
					{
						scatterUniformAmount:5,
						id:true,
						isInstant:true,
						type:[
							[ "biomeWall" ],
							[ "imageElementPoison" ]
						],
						atAnyPlace:true,
						boxes:[ { see:[
							{ line:"+1{symbol symbolResourceSkull}" },
							{ condition:"-3{symbol symbolResourceSkull}: {symbol symbolRollDie}<4:", line:"-1{symbol symbolResourceLife}" },
						] } ]
					}
				],
				specialsAmount:1
			}
		},{
			uuid:"33",
			description:"The traps: Walking around the dungeon may spring traps",
			onlyForArea:ONLYFORAREA_FIRST, // A free early exit...
			tags:[ "scatter" ],
			data:{
				scatter:[
					{
						scatterUniformAmount:5,
						id:true,
						isInstant:true,
						type:[
							[ "biomeWall" ],
							[ "imageElementSnakeWallTrap" ]
						],
						atAnyPlace:true,
						boxes:[ { see:[
							{ condition:"{symbol symbolRollDie} > 3:", line:"+1{symbol symbolTrap}" },
							{ condition:"-3{symbol symbolTrap}: {symbol symbolRollDie} < 4:", line:"-1{symbol symbolResourceLife}" },
						] } ]
					}
				],
				specialsAmount:1
			}
		},{
			uuid:"34",
			description:"The collectathon: Collect end game bonuses around the dungeon",
			onlyForArea:ONLYFORAREA_FIRST, // A free first early...
			tags:[ "scatter" ],
			data:{
				scatter:[
					{
						scatterUniformAmount:6,
						requireResources:[ "collectible" ],
						id:true,
						multiColumn:true,
						sortByPlace:true,
						addEndGameBonuses:[ "collectible" ],
						type:TYPE_CHEST,
						boxes:[ { interact:[
							{ line:"+[[index]]{symbol th}[[resource:collectible]]" },
							{ atFakePlace:true, line:"+[[index]]{symbol th}[[resource:collectible]]" },
						] } ]
					}
				],
				specialsAmount:1
			}
		},{
			uuid:"35",
			description:"The illusions: You see passages that aren't there.",
			onlyForArea:ONLYFORAREA_FIRST, // A free early exit...
			tags:[ "scatter" ],
			data:{
				scatter:[
					{
						scatterUniformAmount:8,
						id:true,
						type:[["biomeCorridor"]],
						multiColumn:true,
						boxes:[ { move:[
							{ atFakePlace:true, teleportToRandomPlace:true },
						] } ]
					}
				],
				specialsAmount:1
			}
		},{
			uuid:"36",
			description:"The classic switch: Flip it to open the door",
			data:{
				path:[
					[
						{
							id:true,
							setInteraction:true,
							switchType:SWITCHES,
							boxes:[
								{ rotate:[] }
							]
						}
					]
				],
				lock:[
					{
						id:true,
						keepOriginalGate:true,
						addInteractionConditions:[ 0 ],
						type:TYPE_BARRIER
					}
				],
				specialsAmount:1
			}
		},{
			uuid:"37",
			description:"The double switch: Flip it to open the door",
			data:{
				path:[
					[
						{
							id:true,
							setInteraction:true,
							newInteraction:true,
							switchType:SWITCHES,
							boxes:[
								{ rotate:[] }
							]
						},{
							id:true,
							setInteraction:true,
							switchType:SWITCHES,
							boxes:[
								{ rotate:[] }
							]
						}
					]
				],
				lock:[
					{
						id:true,
						keepOriginalGate:true,
						addInteractionConditions:[ 0, -1 ],
						addInteractionConditionsVersions:[ 0, 0 ],
						type:TYPE_BARRIER
					},{
						id:true,
						keepOriginalGate:true,
						addInteractionConditions:[ 0, -1 ],
						addInteractionConditionsVersions:[ 0, 1 ],
						type:TYPE_BARRIER
					},{
						id:true,
						keepOriginalGate:true,
						addInteractionConditions:[ 0, -1 ],
						addInteractionConditionsVersions:[ 1, 0 ],
						type:TYPE_BARRIER
					}
				]
			}
		},{
			uuid:"38",
			description:"The backtrack: Open a chest you've previously found to open the door",
			onlyForArea:[ 2, 3 ],
			data:{
				path:[
					[
						{
							atArea:[ -1 ],
							requireKeys:[ "key1" ],
							requireResources:[ "amulet" ],
							id:true,
							type:TYPE_CHEST,
							atAnyPlace:true,
							boxes:[
								{ interact:[
									{ condition:"[[key:key1]]:", line:"{symbol setValue}1[[resource:amulet]]" }
								] }
							]
						}
					]
				],
				lock:[
					{
						id:true,
						keepOriginalGate:true,
						addOverallCondition:"[[resource:amulet]]:",
						type:TYPE_BARRIER,boxes:[
							{ move:[
								{ order:-100, atAnyPlace:true, skipOverallCondition:true, line:"+[[key:key1]]"}
							] }
						]
					}
				],
				specialsAmount:1
			}
		},{
			uuid:"39",
			description:"The trap switch: Flip it to disable traps",
			onlyForArea:ONLYFORAREA_EARLY, // As it can be passed without exploring, it can spawn as early hazard only.
			data:{
				path:[
					[
						{
							id:true,
							setInteraction:true,
							switchType:SWITCHES,
							boxes:[
								{ rotate:[] }
							]
						}
					]
				],
				lock:[
					{
						id:true,
						keepOriginalGate:true,
						type:[
							[ "biomeCorridorBackdrop" ],
							[ "imageElementTrap" ]
						],
						boxes:[
							{ move:[
								{ order:-100, ifInteractions:[ 0 ], ifInteractionVersions:[ 1 ], atAnyPlace:true, condition:"{symbol symbolRollDie} < 4:", line:"-2{symbol symbolResourceLife}"}
							] }
						]
					}
				],
				specialsAmount:1
			}
		},{
			uuid:"40",
			description:"The toll: Pay with gold or with life to pass",
			onlyForArea:ONLYFORAREA_EARLY, // As it can be passed without exploring, it can spawn as early hazard only.
			data:{
				lock:[
					{
						id:true,
						type:[
							[ "biomeCorridorBackdrop" ],
							[ "imageElementNpc" ]
						],
						atAnyPlace:true,
						boxes:[
							{ talk:[
								{ line:"\"{symbol symbolYou}{symbol symbolRich}? {symbol symbolYou}{symbol symbolHoly}?\"" },
								{ line:"{symbol textSeparator}" },
								{ line:"-2{symbol symbolResourceGold}? \"{symbol symbolYou}{symbol symbolRich}\", ",interactionId:0 },
								{ line:"-2{symbol symbolResourceLife}? \"{symbol symbolYou}{symbol symbolHoly}\", ",interactionId:0 },
							] }
						]
					}
				],
				specialsAmount:1
			}
		},{
			uuid:"41",
			description:"The mid-boss: Fight a strong enemy to gain gold, freedom, or death",
			onlyForArea:ONLYFORAREA_EARLY, // As it can be passed without exploring, it can spawn as early hazard only.
			data:{
				lock:[
					{
						id:true,
						type:[
							[ "biomeCorridorBackdrop" ],
							[ "imageElementBoss" ]
						],
						atAnyPlace:true,
						isInstant:true,
						boxes:[
							{ interact:[
								COMBATRULES,
								COMBATRULES_CURSE,
								{ condition:"{symbol symbolStrength} < 3:", line:"-1{symbol symbolResourceAttack}" },
								{ condition:"{symbol symbolStrength} < 4:", line:"-1{symbol symbolResourceLife}" },
								{ condition:"{symbol symbolStrength} > 5:", line:"+1{symbol symbolResourceGold}" },
								{ condition:"{symbol symbolStrength} > 4:", line:"+1{symbol symbolResourceGold}, ", interactionId:0 },
							] }
						]
					}
				],
				specialsAmount:1
			}
		},{
			uuid:"42",
			description:"The locked exit: Collect all items to open the exit",
			onlyForArea:ONLYFORAREA_FIRST, // A free early exit...
			tags:[ "exitlock", "scatter" ],
			data:{
				scatter:[
					{
						scatterUniformAmount:5,
						requireResources:[ "collectible" ],
						id:true,
						sortByPlace:true,
						type:TYPE_CHEST,
						subplaces:{
							lockedExit:[
								{
									id:true,
									type:TYPE_BARS
								}
							]
						},
						boxes:[ { interact:[
							{ line:"+[[index]]{symbol th}[[resource:collectible]]" },
							{ order:100, id:"exitrule", atAnyPlace:true, condition:"[[resource:collectible]] = 5:", lockExitWithSubplace:"lockedExit", interactionId:0 },
						] } ]
					}
				]
			}
		},{
			uuid:"43",
			description:"The final boss: Fight the boss guarding the exit",
			onlyForArea:ONLYFORAREA_FIRST, // A free early exit...
			tags:[ "exitlock", "scatter" ],
			data:{
				scatter:[
					{
						scatterUniformAmount:3,
						requireResources:[ "bonusitem", "bossphase" ],
						id:true,
						sortByPlace:true,
						type:TYPE_CHEST,
						subplaces:{
							bossBattle:[
								{
									id:true,
									type:[
										[ "biomeCorridorBackdrop" ],
										[ "imageElementBoss" ]
									],
									atAnyPlace:true,
									isInstant:true,
									boxes:[ { interact:[
										COMBATRULES,
										{ condition:"[[resource:bossphase]] = 0, {symbol symbolStrength} < 3:", line:"-1{symbol symbolResourceLife}" },
										{ condition:"[[resource:bossphase]] = 1, {symbol symbolStrength} < 4:", line:"-1{symbol symbolResourceLife}" },
										{ condition:"[[resource:bossphase]] = 2, {symbol symbolStrength} < 5:", line:"-1{symbol symbolResourceLife}" },
										{ line:"+1[[resource:bossphase]]"},
										{ condition:"[[resource:bossphase]] = 3:", line:"+3{symbol symbolResourceGold}, ", interactionId:0 }
									] } ]
								}
							]
						},
						boxes:[ { interact:[
							{ condition:"+[[index]]{symbol th}[[resource:bonusitem]]:", line:"+1{symbol symbolResourceAttack}", lockExitWithSubplace:"bossBattle" },
							{ atFakePlace:true, condition:"+[[index]]{symbol th}[[resource:bonusitem]]:", line:"+1{symbol symbolResourceAttack}" },
						] } ]
					}
				]
			}
		},{
			uuid:"44",
			description:"The arrows puzzle: Answer with the correct arrows sequence, following the cells alphabetical order",
			onlyForArea:ONLYFORAREA_DEADLY, // This may kill you!
			tags:[ "scatter", "deadly" ],
			data:{
				path:[
					[
						{
							id:true,
							type:[
								[ "biomeWall" ],
								[ "imageElementStone" ],
							],
							tags:[ "arrowPuzzleCard" ],
							multiColumn:true,
							boxes:[
								{ look:[
									{ line:"1" },
									{ atFakePlace:true, line:"1" },
									{ atFakePlace:true, line:"1" }
								] },
							]
						},{
							id:true,
							type:[
								[ "biomeWall" ],
								[ "imageElementStone" ],
							],
							tags:[ "arrowPuzzleCard" ],
							multiColumn:true,
							boxes:[
								{ look:[
									{ line:"2" },
									{ atFakePlace:true, line:"2" },
									{ atFakePlace:true, line:"2" }
								] },
							]
						},{
							atArea:[-1],
							id:true,
							type:[
								[ "biomeWall" ],
								[ "imageElementStone" ],
							],
							tags:[ "arrowPuzzleCard" ],
							multiColumn:true,
							boxes:[
								{ look:[
									{ line:"3" },
									{ atFakePlace:true, line:"3" },
									{ atFakePlace:true, line:"3" }
								] },
							]
						},{
							atArea:[-2],
							id:true,
							type:[
								[ "biomeWall" ],
								[ "imageElementStone" ],
							],
							tags:[ "arrowPuzzleCard" ],
							multiColumn:true,
							boxes:[
								{ look:[
									{ line:"4" },
									{ atFakePlace:true, line:"4" },
									{ atFakePlace:true, line:"4" }
								] },
							]
						}
					]
				],
				lock:[
					{
						id:true,
						type:[
							[ "biomeWall" ],
							[ "imageElementCompass" ]
						],
						atAnyPlace:true,
						requireResources:[ "item1", "item2", "item3", "item4" ],
						code:(I)=>{
							let
								SYMBOLS = [ "{symbol symbolArrowNorth}", "{symbol symbolArrowEast}", "{symbol symbolArrowSouth}", "{symbol symbolArrowWest}" ],
								fakeBag = { elements:SYMBOLS },
								hintsCard = I.deck.findCard([ "arrowPuzzleCard" ]),
								index = {},
								places = [],
								answers = [];

							hintsCard.boxes.forEach(box=>{
								box.items.forEach(item=>{
									if (!item.atFakePlace && item.from && (places.indexOf(item.from.id) == -1))
										places.push(item.from.id);
								})
							})

							places.sort();

							do {
								let
									answer = { list:[], label:"" };

								for (let i=0;i<4;i++) {
									let
										symbol = SYMBOLS[I.random.integer(4)];
									answer.list.push("\""+symbol+"\"");
									answer.label+=symbol;
								}

								if (!index[answer.label]) {
									index[answer.label] = true;
									answer.label+="?";
									answer.isRight = answers.length == 0;
									answers.push(answer);
								}
							} while (answers.length<4);

							hintsCard.boxes.forEach(box=>{
								box.items.forEach(item=>{
									if (item.from)
										if (item.atFakePlace)
											item.line = "\""+I.random.bagPick(fakeBag)+"\"";
										else
											item.line = answers[0].list[places.indexOf(item.from.id)];
								})
							})

							HELPERS.makeLockQuiz(
								I, "arrowsQuiz",
								"interact",
								[ I.card.resources.item1, I.card.resources.item2, I.card.resources.item3, I.card.resources.item4 ],
								SYMBOLS.join(", ")+"?",
								[],
								answers,
								LINE_KILLPLAYER
							);

							I.deck.setAnswer("arrowsQuiz", { places:places });
							
						},
						boxes:[
							{ interact:[{ interactionId:0 }] }
						]
					}
				]
			}
		},{
			uuid:"45",
			description:"The stones orientation puzzle: Answer with the correct orientation sequence, where you found a stone",
			onlyForArea:ONLYFORAREA_DEADLY, // This may kill you!
			tags:[ "scatter", "deadly" ],
			data:{
				path:[
					[
						{
							id:true,
							type:[
								[ "biomeWall" ],
								[ "imageElementStone" ],
							],
							tags:[ "stoneOrientationCard" ],
							markCell:{
								stoneOrientationPuzzleCell:1
							},
							requireResources:[ "symbol" ],
							multiColumn:true,
							boxes:[
								{ look:[
									{ line:"\"[[resource:symbol]]\"" },
									{ atFakePlace:true, line:"\"[[resource:symbol]]\"" },
									{ atFakePlace:true, line:"\"[[resource:symbol]]\"" }
								] },
							]
						},{
							id:true,
							type:[
								[ "biomeWall" ],
								[ "imageElementStone" ],
							],
							tags:[ "stoneOrientationCard" ],
							markCell:{
								stoneOrientationPuzzleCell:1
							},
							multiColumn:true,
							boxes:[
								{ look:[
									{ line:"\"[[resource:symbol]]\"" },
									{ atFakePlace:true, line:"\"[[resource:symbol]]\"" },
									{ atFakePlace:true, line:"\"[[resource:symbol]]\"" }
								] },
							]
						},{
							atArea:[-1],
							id:true,
							type:[
								[ "biomeWall" ],
								[ "imageElementStone" ],
							],
							tags:[ "stoneOrientationCard" ],
							markCell:{
								stoneOrientationPuzzleCell:1
							},
							multiColumn:true,
							boxes:[
								{ look:[
									{ line:"\"[[resource:symbol]]\"" },
									{ atFakePlace:true, line:"\"[[resource:symbol]]\"" },
									{ atFakePlace:true, line:"\"[[resource:symbol]]\"" }
								] },
							]
						},{
							atArea:[-2],
							id:true,
							type:[
								[ "biomeWall" ],
								[ "imageElementStone" ],
							],
							tags:[ "stoneOrientationCard" ],
							markCell:{
								stoneOrientationPuzzleCell:1
							},
							multiColumn:true,
							boxes:[
								{ look:[
									{ line:"\"[[resource:symbol]]\"" },
									{ atFakePlace:true, line:"\"[[resource:symbol]]\"" },
									{ atFakePlace:true, line:"\"[[resource:symbol]]\"" }
								] },
							]
						}
					]
				],
				lock:[
					{
						id:true,
						type:[
							[ "biomeWall" ],
							[ "imageElementCompass" ]
						],
						atAnyPlace:true,
						requireResources:[ "item1", "item2", "item3", "item4" ],
						code:(I)=>{
							let
								SYMBOLS = [ "{symbol symbolArrowNorth}", "{symbol symbolArrowEast}", "{symbol symbolArrowSouth}", "{symbol symbolArrowWest}" ],
								places = [],
								answers = [],
								rightAnswer,
								answersIndex = {};

							I.dungeon.cells.forEach(cell=>{
								if (cell.marks.stoneOrientationPuzzleCell) {
									cell.walls.forEach((wall,direction)=>{
										if (wall && wall.tags && wall.tags.indexOf("stoneOrientationCard")!=-1)
											places.push({ id:cell.id, arrow:SYMBOLS[direction] });
									})
								}
							});

							places.sort((a,b)=>{
								if (a.id > b.id)
									return 1;
								else if (a.id < b.id)
									return -1;
								else
									return 0;
							});

							rightAnswer = places.map(place=>place.arrow).join("");
							answersIndex[rightAnswer] = true;

							answers.push({ isRight:true, label:rightAnswer+"?" });

							do {
								let
									wrongAnswer = "";
								for (let j=0;j<4;j++)
									wrongAnswer += I.random.element(SYMBOLS);
								if (!answersIndex[wrongAnswer]) {
									answersIndex[wrongAnswer] = true;
									answers.push({ isRight:false, label:wrongAnswer+"?" });
								}
							} while (answers.length<4);

							HELPERS.makeLockQuiz(
								I, "stonesOrientationQuiz",
								"interact",
								[ I.card.resources.item1, I.card.resources.item2, I.card.resources.item3, I.card.resources.item4 ],
								SYMBOLS.join(", ")+"?",
								[],
								answers,
								LINE_KILLPLAYER
							);

							I.deck.setAnswer("stonesOrientationQuiz", { places:places });
							
						},
						boxes:[
							{ interact:[{ interactionId:0 }] }
						]
					}
				]
			}
		},{
			uuid:"46",
			description:"The race: Run to the door and reach it in time",
			data:{
				path:[
					[
						{
							id:true,
							markCell:{
								eventRaceStart:1
							},
							type:[
								[ "biomeWall" ],
								[ "imageElementNpc" ]
							],
							atAnyPlace:true,
							boxes:[
								{ talk:[
									{ line:"\"{symbol symbolYou}{symbol symbolRun}{symbol symbolStopwatch}! {symbol symbolYou}{symbol symbolWinning}?\"" },
									{ line:"{symbol textSeparator}" },
									{ line:"{symbol symbolStopwatch}{symbol symbolInteractionReset}" },
									{ line:"{symbol symbolStopwatch}{symbol symbolInteractionStart}" }
								] }
							]
						}
					]
				],
				lock:[
					{
						id:true,
						addInteractionConditions:[ 0 ],
						isInstant:true,
						atAnyPlace:true,
						type:[
							[ "biomeCorridorBackdrop" ],
							[ "imageElementNpc" ]
						],
						code:(I)=>{
							let
								editor = HELPERS.newBoxEditor(I, I.card, "see"),
								origin = I.card.origins[0],
								cell = I.card.destinations[0],
								route = I.dungeon.findRouteToMark(origin,"eventRaceStart",1, cell.area-1),
								slowTime = 30 * route.path.length,
								mediumTime = 20 * route.path.length,
								fastTime = 10 * route.path.length;

							editor.add({ condition:"{symbol symbolStopwatch}{symbol symbolInteractionStart}:", line:"{symbol symbolStopwatch}{symbol symbolInteractionStop}, {symbol symbolStrength} = {symbol symbolStopwatch}" });
							editor.add({ condition:"{symbol symbolStrength} > "+HELPERS.formatSeconds(slowTime)+" :", line:"+1{symbol symbolResourceSkull}"  } );
							editor.add({ condition:"{symbol symbolStrength} < "+HELPERS.formatSeconds(fastTime)+" :", line:"+2{symbol symbolResourceGold}" } );
							editor.addFromModel(0, { condition:"{symbol symbolStrength} < "+HELPERS.formatSeconds(mediumTime)+" :" } );
						},
						boxes:[
							{ see:[
								{ interactionId:0 }
							] }
						],
						mergeGateWith:{
							id:true,
							type:[
								[ "biomeCorridor" ],
								[ "imageElementSideNpc" ]
							],
							boxes:[
								{ move:[
									{ order:-100, atAnyPlace:true, line:"\"{symbol symbolYou}{symbol symbolRun}{symbol symbolRun}{symbol symbolRun}!\""},
									{ order:-99, atAnyPlace:true, line:"{symbol textSeparator}" }
								]}
							]
						}
					}
				]
			}
		},{
			uuid:"47",
			description:"The block stacking game: Roll for tetraminoes, rotate them, and place them on a grid",
			data:{
				path:[
					[
						{
							id:true,
							type:[
								[ "biomeWall" ],
								[ "imageElementArcade" ]
							],
							atAnyPlace:true,
							boxes:[
								{ interact:[
									{ line:"{symbol schemaDiceBlockStacker}"},
									{ ifInteractions:[ 0 ], condition:"{symbol symbolTickedSquares} > 17:", line:"+2{symbol symbolResourceGold}" },
									{ interactionId:0 },
								] },
							]
						}
					]
				],
				lock:[
					{
						id:true,
						type:TYPE_BARS
					}
				]
			}
		},{
			uuid:"48",
			description:"The snake boss: Make the boss weaker and kill it at the exit",
			onlyForArea:ONLYFORAREA_FIRST, // A free early exit...
			tags:[ "exitlock", "scatter" ],
			data:{
				scatter:[
					{
						scatterUniformAmount:4,
						requireResources:[ "health" ],
						id:true,
						sortByPlace:true,
						type:[
							[ "biomeWall" ],
							[ "imageElementSnakeBody" ]
						],
						multiColumn:true,
						subplaces:{
							lockedExit:[
								{
									id:true,
									type:[
										[ "biomeWall" ],
										[ "imageElementSnakeHead" ]
									],
									atAnyPlace:true,
									isInstant:true,
									boxes:[ { interact:[
										COMBATRULES,
										COMBATRULES_CURSE,
										{ condition:"{symbol symbolStrength} < 4:", line:"-1{symbol symbolResourceLife}" },
										{ condition:"{symbol symbolStrength} > 4:", line:"+1{symbol symbolResourceGold}" },
										{ line:"+1[[resource:health]]" },
										{ condition:"[[resource:health]] = 6:", interactionId:0 },
									] } ]
								}
							]
						},
						boxes:[ { interact:[
							COMBATRULES,
							COMBATRULES_CURSE,
							{ condition:"{symbol symbolStrength} > 3:", line:"[[index]]{symbol th}[[resource:health]]" },
							{ atFakePlace:true, condition:"{symbol symbolStrength} > 3:", line:"[[index]]{symbol th}[[resource:health]]",  lockExitWithSubplace:"lockedExit" },
						] } ]
					}
				]
			}
		},{
			uuid:"49",
			// --- They are Erian and Finn!
			description:"The jumbotron: Use 2 cards to read the door open message",
			data:{
				path:[
					[
						{
							id:true,
							type:[
								[ "biomeWall" ],
								[ "imageElementCube" ]
							],
							requireKeys:[ "key1" ],
							atAnyPlace:true,
							code:(I)=>{
								let
									editor = HELPERS.newBoxEditor(I, I.card, "interact");
								editor.add({ line:"+" + I.card.keys.key1}),
								editor.addDotMatrixGuide();
							},
							boxes:[
								{ interact:[ ] },
							]
						}
					]
				],
				lock:[
					{
						id:true,
						type:[
							[ "biomeWall" ],
							[ "imageElementCube" ]
						],
						atAnyPlace:true,
						code:(I)=>{
							let
								VERSIONS="ABCD",
								editor = HELPERS.newBoxEditor(I, I.card, "talk"),
								cardIndex = editor.models[0].card.setIndex,
								message = 
									(Math.floor(cardIndex/10)).toString() +
									(cardIndex%10) +
									VERSIONS[editor.models[0].card.version] +
									VERSIONS[editor.models[0].toCard.version];

							editor.add({ condition:I.card.keys.key1 +":" });
							editor.addDotMatrixFromText(message);
							I.deck.setAnswer("jumbotron", { message:message });
						},
						boxes:[
							{ talk:[ { interactionId:0 } ] },
						]
					}
				]
			}
		},{
			uuid:"50",
			description:"The Rosetta Stone: Guess best fitting answer for a dialogue",
			data:{
				path:[
					[
						{
							id:true,
							type:[
								[ "biomeWall" ],
								[ "imageElementStone" ],
							],
							tags:[ "rosettaStoneCard" ],
							markCell:{
								stoneOrientationPuzzleCell:1
							},
							requireResources:[ "symbol" ],
							multiColumn:true,
							boxes:[
								{ look:[
									{ line:"0" },
									{ line:"1" },
								] },
							]
						},{
							id:true,
							type:[
								[ "biomeWall" ],
								[ "imageElementStone" ],
							],
							tags:[ "rosettaStoneCard" ],
							markCell:{
								stoneOrientationPuzzleCell:1
							},
							multiColumn:true,
							boxes:[
								{ look:[
									{ line:"2" },
									{ line:"3" },
								] },
							]
						},{
							id:true,
							type:[
								[ "biomeWall" ],
								[ "imageElementStone" ],
							],
							tags:[ "rosettaStoneCard" ],
							markCell:{
								stoneOrientationPuzzleCell:1
							},
							multiColumn:true,
							boxes:[
								{ look:[
									{ line:"4" },
									{ line:"5" },
								] },
							]
						},
					]
				],
				lock:[
					{
						id:true,
						type:[
							[ "biomeWall" ],
							[ "imageElementNpc" ]
						],
						atAnyPlace:true,
						requireResources:[ "input" ],
						code:(I)=>{
							var
								question = I.random.element(ROSETTASTONE_QUESTIONS),
								stoneCards = I.deck.findCard([ "rosettaStoneCard" ]),
								wrongAnswers = [],
								rightAnswer,
								availableWords = [],
								wrongAnswersCount = 6-question.answer.length,
								words = [];

							words = VERBS.concat(SUBJECTS).concat(RESOURCES);

							rightAnswer = question.answer.map(word=>{
								let
									selectedWord = I.random.element(word);
								word.forEach(option=>{
									let
										pos = words.indexOf(option);
									if (pos != -1)
										words.splice(pos,1);
								})
								availableWords.push(selectedWord);
								return selectedWord;
							});

							for (let i=0;i<wrongAnswersCount;i++)
								availableWords.push(I.random.removeElement(words));

							I.random.shuffle(availableWords);

							availableWords.forEach((word,id)=>{
								wrongAnswers.push({ outcome:rightAnswer.indexOf(word) == -1 ? LINE_PUNISHPLAYER : "+1{symbol symbolResourceGold}", label:(id+1)+"{symbol th}"+I.card.resources.input.symbol });
							});

							stoneCards.boxes.forEach(box=>{
								box.items.forEach(item=>{
									let
										id = item.line*1;
									if (item.from) {
										item.condition = "\"{symbol symbolWrite}{symbol "+availableWords[id]+"}\"?"
										item.line = "+"+(id+1)+"{symbol th}"+I.card.resources.input.symbol+"/-"+(id+1)+"{symbol th}"+I.card.resources.input.symbol;
									}
								})
							})

							HELPERS.makeLockQuiz(
								I, "theRosettaStoneQuiz",
								"talk",
								0,
								"\""+question.text.replace(/\[\[([^\]]+)\]\]/g,(m,m1)=>"{symbol "+I.random.element(SETS[m1])+"}")+" {symbol symbolYou}{symbol symbolReply}!\"",
								[],
								I.card.resources.input.symbol+" = "+rightAnswer.length+"?",
								wrongAnswers
							);

							I.deck.setAnswer("theRosettaStoneQuiz", { question:question, rightAnswer:rightAnswer });

						},
						boxes:[
							{ talk:[{ interactionId:0 }] }
						]
					}
				]
			}
		},{
			uuid:"51",
			description:"The tangram: Cut tangram pieces from a card and form a shape in front of a door to open it",
			data:{
				path:[
					[
						{
							id:true,
							type:[
								[ "biomeWall" ],
								[ "imageElementScroll" ]
							],
							atAnyPlace:true,
							boxes:[
								{ interact:[
									{ cutout:[ { type:"symbol", id:"cutoutHalf" }, { type:"symbol", id:"cutoutTangram" } ] }
								] },
							]
						}
					]
				],
				lock:[
					{
						id:true,
						type:[
							[ "biomeCorridorBackdrop" ],
							[ "imageElementNpc" ]
						],
						atAnyPlace:true,
						boxes:[
							{ talk:[
								{ line:"\"{symbol symbolYou}{symbol symbolOperate}!\"" },
								{ line:"{symbol textSeparator}" },
								{ line:"{symbol tangramPuzzle1}" },
								{ condition:"{symbol symbolDone}:", interactionId:0 }
							] },{ talk:[
								{ line:"\"{symbol symbolYou}{symbol symbolOperate}!\"" },
								{ line:"{symbol textSeparator}" },
								{ line:"{symbol tangramPuzzle2}" },
								{ condition:"{symbol symbolDone}:", interactionId:0 }
							] },{ talk:[
								{ line:"\"{symbol symbolYou}{symbol symbolOperate}!\"" },
								{ line:"{symbol textSeparator}" },
								{ line:"{symbol tangramPuzzle3}" },
								{ condition:"{symbol symbolDone}:", interactionId:0 }
							] },{ talk:[
								{ line:"\"{symbol symbolYou}{symbol symbolOperate}!\"" },
								{ line:"{symbol textSeparator}" },
								{ line:"{symbol tangramPuzzle4}" },
								{ condition:"{symbol symbolDone}:", interactionId:0 }
							] },{ talk:[
								{ line:"\"{symbol symbolYou}{symbol symbolOperate}!\"" },
								{ line:"{symbol textSeparator}" },
								{ line:"{symbol tangramPuzzle5}" },
								{ condition:"{symbol symbolDone}:", interactionId:0 }
							] }
						],
						mergeGateWith:{
							id:true,
							type:[
								[ "biomeCorridor" ],
								[ "imageElementSideNpc" ]
							],
							boxes:[
								{ move:[
									{ order:-100, atAnyPlace:true, line:"\"{symbol symbolYou}{symbol symbolOperate}{symbol symbolDone}!\""},
									{ order:-99, atAnyPlace:true, line:"{symbol textSeparator}" }
								]}
							]
						}
					}
				]
			}
		},{
			uuid:"52",
			description:"The bug: Collect an interaction icon as resource and fix a glitched card",
			data:{
				path:[
					[
						{
							id:true,
							type:[
								[ "biomeWall" ],
								[ "imageElementStoneWall" ]
							],
							requireResources:[ "glitch1", "glitch2" ],
							atAnyPlace:true,
							boxes:[
								{ interact:[
									{ line:"+1{symbol actionInteract}" }
								] }
							]
						}
					]
				],
				lock:[
					{
						id:true,
						type:[
							[ "biomeWall" ],
							[ "imageElementBug" ]
						],
						atAnyPlace:true,
						boxes:[
							{ none:[
								{ line:"{symbol symbolRollDie}" },
								{ condition:"{symbol symbolDieValue 1}:", line:"+1{symbol symbolResourceSkull}" },
								{ condition:"{symbol symbolDieValue 7}:", line:"+3{symbol symbolResourceLife}" },
								{ condition:"{symbol symbolDieValue 8}:", line:"+5{symbol symbolResourceGold}" },
								{ condition:"{symbol symbolDieValue 9}:", line:"+99{symbol symbolResourceAttack}" },
								{ interactionId:0 }
							] }
						]
					},{
						id:true,
						type:[
							[ "biomeWall" ],
							[ "imageElementBug" ]
						],
						atAnyPlace:true,
						boxes:[
							{ none:[
								{ line:"{spacing -0.85}{symbol symbolRollDie}{symbol symbolRollDie}{symbol symbolRollDie}{symbol symbolRollDie}{symbol symbolRollDie}{symbol symbolRollDie}{symbol symbolRollDie}{symbol symbolRollDie}{endspacing}" },
								{ line:"{symbol startLoop}0~5{symbol symbolRollOtherDice}{symbol endLoop}{symbol times}938" },
								{ condition:"-1[[resource:glitch1]]?", line:"+99{symbol symbolResourceAttack}" },
								{ condition:"-8[[resource:glitch2]]?", line:"+200{symbol symbolResourceGold}" },
								{ condition:"-1{symbol symbolResourceGold}?", line:"+1{symbol symbolResourceLife}" },
								{ interactionId:0 }
							] }
						]
					},{
						id:true,
						type:[
							[ "biomeWall" ],
							[ "imageElementBug" ]
						],
						atAnyPlace:true,
						boxes:[
							{ none:[
								{ line:"{align center}[[resource:glitch1]][[resource:glitch2]][[resource:glitch1]][[resource:glitch2]][[resource:glitch1]]" },
								{ line:"{align center}[[resource:glitch1]][[resource:glitch2]][[resource:glitch1]][[resource:glitch2]][[resource:glitch1]]" },
								{ line:"{align center}[[resource:glitch1]][[resource:glitch1]][[resource:glitch1]][[resource:glitch1]][[resource:glitch1]]" },
								{ line:"{align center}[[resource:glitch2]][[resource:glitch1]][[resource:glitch1]][[resource:glitch1]][[resource:glitch2]]" },
								{ line:"{align center}[[resource:glitch1]][[resource:glitch2]][[resource:glitch2]][[resource:glitch2]][[resource:glitch1]]" },
								{ line:"{align center}", interactionId:0 }
							] }
						]
					}
				]
			}
		},{
			uuid:"53",
			description:"The falling ball: Follow the broken path of a falling ball, guess where it falls, and open the door",
			tags:[ "deadly" ],
			onlyForArea:ONLYFORAREA_DEADLY, // This may kill you!
			data:{
				path:[
					[
						{
							id:true,
							tags:[ "fallingBallCard" ],
							type:[
								[ "biomeWall" ],
								[ "imageElementStoneWall" ]
							],
							boxes:[
								{ interact:[] }
							]
						}
					]
				],
				lock:[
					{
						id:true,
						type:[
							[ "biomeWall" ],
							[ "imageElementStoneWall" ]
						],
						atAnyPlace:true,
						requireResources:[ "progress", "item1", "item2", "item3", "item4" ],
						code:(I)=>{
							let
								sliceSize = 2,
								slices = 4,
								rows = sliceSize*slices,
								quiz = HELPERS.makeBallFallQuiz(I, 4, rows),
								boxEditors = [ I.deck.findCard([ "fallingBallCard" ]), I.card ].map(card=>HELPERS.newBoxEditor(I, card, "interact")),
								prizes = [ I.card.resources.item1, I.card.resources.item2, I.card.resources.item3, I.card.resources.item4 ],
								wrongItems = prizes.filter((item,id)=>id!=quiz.ballEnd);

							for (let i=0;i<slices;i++) {
								let
									boxEditor = boxEditors[i%boxEditors.length];
								boxEditor.add({condition:"+"+(i+1)+"{symbol th}"+I.card.resources.progress.symbol+"?"});
								boxEditor.addBallFallQuiz(quiz, prizes, sliceSize*i, sliceSize);
							}

							boxEditors[1].addFromModel(0,{ condition:prizes.map(a=>a.symbol).join("/")+":"});
							HELPERS.makeLockPunishmentQuiz(I,"fallingBallQuiz",wrongItems,LINE_KILLPLAYER);

							I.deck.setAnswer("fallingBallQuiz", { render:quiz.render });
						},
						boxes:[
							{ interact:[{ interactionId:0 }] }
						]
					}
				]
			}
		},{
			uuid:"54",
			description:"The puzzle: Cut puzzle pieces to form a resource icon image and use it to open the door",
			resources:[
				{ type:"image", id:"jigsaw1", url:"resources/jigsaw1.png" },
				{ type:"image", id:"jigsaw2", url:"resources/jigsaw2.png" },
				{ type:"image", id:"jigsaw3", url:"resources/jigsaw3.png" },
			],
			data:{
				path:[
					[
						{
							id:true,
							tags:[ "jigsawCard" ],
							type:[
								[ "biomeWall" ],
								[ "imageElementScroll" ]
							],
							atAnyPlace:true,
						}
					]
				],
				lock:[
					{
						id:true,
						type:[
							[ "biomeCorridorBackdrop" ],
							[ "imageElementNpc" ]
						],
						atAnyPlace:true,
						code:(I)=>{
							const
								PUZZLES = [
									{ resource:"jigsaw1", solution:"{symbol symbolJigsaw1}" },
									{ resource:"jigsaw2", solution:"{symbol symbolJigsaw2}" },
									{ resource:"jigsaw3", solution:"{symbol symbolJigsaw3}" },
								],
								PIECES_X = 3,
								PIECES_Y = 3;

							let
								jigsawCard = I.deck.findCard([ "jigsawCard" ]),
								jigsawEditor = HELPERS.newBoxEditor(I, jigsawCard, "interact"),
								editor = HELPERS.newBoxEditor(I, I.card, "talk"),
								puzzle = I.random.element(PUZZLES),
								puzzleImage = I.resources.get(puzzle.resource),
								canvas;

							canvas = HELPERS.makeJigsaw(I, puzzleImage, PIECES_X, PIECES_Y);

							jigsawEditor.add({ cutout:[ { type:"symbol", id:"cutoutHalf" }, { type:"canvas", canvas:canvas }]});
							editor.add({ line:"\"{symbol symbolSwearing}{symbol symbolBreak}{symbol symbolScroll}... {symbol symbolYou}{symbol symbolHoly}?\""});
							editor.add({ line:"{symbol textSeparator}" });
							editor.addFromModel(0,{ condition:puzzle.solution+":" });
						},
						boxes:[
							{ talk:[
								{ interactionId:0 }
							] }
						]
					}
				]
			}
		},{
			uuid:"55",
			description:"The two-headed monster: Cut both heads at the same time to damage it",
			data:{
				path:[
					[
						{
							id:true,
							type:[
								[ "biomeWall" ],
								[ "imageElementBossTwoHeads" ]
							],
							atAnyPlace:true,
							requireResources:[ "health" ],
							boxes:[
								{ interact:[
									{ line:"{spacing -0.85}{symbol symbolRollDie}{symbol symbolRollDie}{symbol symbolRollDie}{symbol symbolRollDie}{symbol symbolRollDie}{endspacing}, {symbol startLoop}0~5{symbol symbolRollOtherDice}{symbol endLoop}{symbol times}4"},
									{ condition:"{spacing -0.85}{symbol symbolDieValue A}{symbol symbolDieValue A}{symbol symbolDieValue B}{symbol symbolDieValue B}{symbol symbolDieValue C}{endspacing}:", line:"{symbol symbolDieValue C} + {symbol symbolOffer 0~5 -1.1}{symbol symbolResourceAttack} = {symbol symbolStrength}"},
									{ condition:"{symbol symbolStrength} < 4:", line:"-1{symbol symbolResourceLife}, +1{symbol symbolResourceAttack}"},
									{ condition:"{symbol symbolStrength} > 3:", line:"+1[[resource:health]]"},
									{ condition:"{symbol symbolStrength} > 4:", line:"+1[[resource:health]], +1{symbol symbolResourceGold}"},
									{ condition:"-4[[resource:health]]:", interactionId:0 }
								] },
							]
						}
					]
				],
				lock:[
					{
						id:true,
						type:TYPE_BARS
					}
				]
			}
		},{
			uuid:"56",
			description:"The warehouse: Trade some resources with the NPC at the door to open it",
			data:{
				path:[
					[
						{
							id:true,
							type:[
								[ "biomeWall" ],
								[ "imageElementCrates" ]
							],
							atAnyPlace:true,
							requireResources:[ "goods1", "goods2", "goods3", "flag" ],
							boxes:[
								{ interact:[
									{ line:"{spacing -0.85}{symbol symbolRollDie}{symbol symbolRollDie}{symbol symbolRollDie}{endspacing}, {symbol startLoop}0~2{symbol symbolRollOtherDice}{symbol endLoop}{symbol times}2"},
									{ condition:"[[resource:flag]] = 0: {symbol symbolforEvery}{symbol symbolDieValue 1}/{symbol symbolDieValue 2}:", line:"+1[[resource:goods1]]"},
									{ condition:"[[resource:flag]] = 0: {symbol symbolforEvery}{symbol symbolDieValue 3}/{symbol symbolDieValue 4}:", line:"+1[[resource:goods2]]"},
									{ condition:"[[resource:flag]] = 0: {symbol symbolforEvery}{symbol symbolDieValue 5}/{symbol symbolDieValue 6}:", line:"+1[[resource:goods3]]"},
									{ condition:"[[resource:flag]] = 0:", line:"+1[[resource:flag]]" }
								] },
							]
						}
					]
				],
				lock:[
					{
						id:true,
						type:[
							[ "biomeCorridorBackdrop" ],
							[ "imageElementNpc" ]
						],
						atAnyPlace:true,
						boxes:[
							{ talk:[
								{ line:"\"{symbol symbolYou}{symbol symbolRun}{symbol symbolGrab}{symbol symbolBox}{symbol symbolPin}! {symbol symbolGrab}[[resource:flag]]... [[resource:goods1]]...\"" },
								{ line:"{symbol textSeparator}" },
								{ condition:"{symbol symbolforEvery}[[resource:goods1]]:", line:"-1[[resource:goods1]], +1{symbol symbolResourceGold}" },
								{ condition:"{symbol symbolforEvery}[[resource:goods2]]:", line:"-1[[resource:goods2]], +1{symbol symbolResourceAttack}" },
								{ condition:"{symbol symbolforEvery}[[resource:goods3]]:", line:"-1[[resource:goods3]], +1{symbol symbolResourceSkull}" },
								{ condition:"-1[[resource:flag]]:", interactionId:0 }
							] },
							{ talk:[
								{ line:"\"{symbol symbolYou}{symbol symbolRun}{symbol symbolGrab}{symbol symbolBox}{symbol symbolPin}! {symbol symbolGrab}[[resource:flag]]... [[resource:goods1]]...\"" },
								{ line:"{symbol textSeparator}" },
								{ condition:"{symbol symbolforEvery}[[resource:goods1]]:", line:"-1[[resource:goods1]], +1{symbol symbolResourceGold}" },
								{ condition:"{symbol symbolforEvery}[[resource:goods2]]:", line:"-1[[resource:goods2]], +1{symbol symbolResourceLife}" },
								{ condition:"{symbol symbolforEvery}[[resource:goods3]]:", line:"-1[[resource:goods3]], +1{symbol symbolResourceSkull}" },
								{ condition:"-1[[resource:flag]]:", interactionId:0 }
							] },
							{ talk:[
								{ line:"\"{symbol symbolYou}{symbol symbolRun}{symbol symbolGrab}{symbol symbolBox}{symbol symbolPin}! {symbol symbolGrab}[[resource:flag]]... [[resource:goods1]]...\"" },
								{ line:"{symbol textSeparator}" },
								{ condition:"{symbol symbolforEvery}[[resource:goods1]]:", line:"-1[[resource:goods1]], +1{symbol symbolResourceGold}" },
								{ condition:"{symbol symbolforEvery}[[resource:goods2]]:", line:"-1[[resource:goods2]], +1{symbol symbolResourceSkull}" },
								{ condition:"{symbol symbolforEvery}[[resource:goods3]]:", line:"-1[[resource:goods3]], +1{symbol symbolResourceAttack}" },
								{ condition:"-1[[resource:flag]]:", interactionId:0 }
							] },
							{ talk:[
								{ line:"\"{symbol symbolYou}{symbol symbolRun}{symbol symbolGrab}{symbol symbolBox}{symbol symbolPin}! {symbol symbolGrab}[[resource:flag]]... [[resource:goods1]]...\"" },
								{ line:"{symbol textSeparator}" },
								{ condition:"{symbol symbolforEvery}[[resource:goods1]]:", line:"-1[[resource:goods1]], +1{symbol symbolResourceGold}" },
								{ condition:"{symbol symbolforEvery}[[resource:goods2]]:", line:"-1[[resource:goods2]], +1{symbol symbolResourceSkull}" },
								{ condition:"{symbol symbolforEvery}[[resource:goods3]]:", line:"-1[[resource:goods3]], +1{symbol symbolResourceLife}" },
								{ condition:"-1[[resource:flag]]:", interactionId:0 }
							] }
						],
						mergeGateWith:{
							id:true,
							type:[
								[ "biomeCorridor" ],
								[ "imageElementSideNpc" ]
							],
							boxes:[
								{ move:[
									{ order:-100, atAnyPlace:true, line:"\"{symbol symbolYou}{symbol symbolBox}{symbol symbolHoly}!\""},
									{ order:-99, atAnyPlace:true, line:"{symbol textSeparator}" }
								]}
							]
						}
					}
				]
			}
		},{
			uuid:"57",
			description:"The hunt: Hunt enemies to gather resources, make a recipe, and open the door",
			data:{
				path:[
					[
						{
							id:true,
							type:[
								[ "biomeWall" ],
								[ "imageElementBoar" ]
							],
							multiColumn:true,
							requireResources:[ "resource1", "resource2", "resource3", "flag" ],
							boxes:[
								{ interact:[
									COMBATRULES,
									COMBATRULES_CURSE,
									COMBATRULES_SMALLWOUND,
									{ condition:"{symbol symbolStrength} > 3:", line:"{symbol setValue}1[[resource:resource1]]" },
									{ atFakePlace:true, condition:"{symbol symbolStrength} > 3:", line:"{symbol setValue}1[[resource:resource1]]" }
								] },
							]
						},{
							id:true,
							type:[
								[ "biomeWall" ],
								[ "imageElementBoar" ]
							],
							multiColumn:true,
							boxes:[
								{ interact:[
									COMBATRULES,
									COMBATRULES_CURSE,
									COMBATRULES_SMALLWOUND,
									{ condition:"{symbol symbolStrength} > 3:", line:"{symbol setValue}1[[resource:resource2]]" },
									{ atFakePlace:true, condition:"{symbol symbolStrength} > 3:", line:"{symbol setValue}1[[resource:resource2]]" }
								] },
							]
						},{
							id:true,
							type:[
								[ "biomeWall" ],
								[ "imageElementBoar" ]
							],
							multiColumn:true,
							boxes:[
								{ interact:[
									COMBATRULES,
									COMBATRULES_CURSE,
									COMBATRULES_SMALLWOUND,
									{ condition:"{symbol symbolStrength} > 3:", line:"{symbol setValue}1[[resource:resource3]]" },
									{ atFakePlace:true, condition:"{symbol symbolStrength} > 3:", line:"{symbol setValue}1[[resource:resource3]]" }
								] },
							]
						}
					]
				],
				lock:[
					{
						id:true,
						type:[
							[ "biomeCorridorBackdrop" ],
							[ "imageElementNpc" ]
						],
						atAnyPlace:true,
						boxes:[
							{ talk:[
								{ line:"\"{symbol symbolWinning}! {symbol symbolYou}{symbol symbolRun}{symbol symbolWrongPerson}{symbol symbolEat}?\"" },
								{ line:"{symbol textSeparator}" },
								{ condition:"-1[[resource:resource1]], -1[[resource:resource2]]:", line:"{symbol setValue}1[[resource:flag]], +2{symbol symbolResourceGold}" },
								{ condition:"-1[[resource:resource1]], -1[[resource:resource3]]:", line:"{symbol setValue}1[[resource:flag]], +1{symbol symbolResourceAttack}, +1{symbol symbolResourceLife}" },
								{ condition:"-1[[resource:resource2]], -1[[resource:resource3]]:", line:"{symbol setValue}1[[resource:flag]], +1{symbol symbolResourceSkull}" },
								{ condition:"[[resource:flag]]:", interactionId:0 }
							] },
							{ talk:[
								{ line:"\"{symbol symbolWinning}! {symbol symbolYou}{symbol symbolRun}{symbol symbolWrongPerson}{symbol symbolEat}?\"" },
								{ line:"{symbol textSeparator}" },
								{ condition:"-1[[resource:resource1]], -1[[resource:resource2]]:", line:"{symbol setValue}1[[resource:flag]], +1{symbol symbolResourceSkull}" },
								{ condition:"-1[[resource:resource1]], -1[[resource:resource3]]:", line:"{symbol setValue}1[[resource:flag]], +2{symbol symbolResourceGold}" },
								{ condition:"-1[[resource:resource2]], -1[[resource:resource3]]:", line:"{symbol setValue}1[[resource:flag]], +1{symbol symbolResourceAttack}, +1{symbol symbolResourceLife}" },
								{ condition:"[[resource:flag]]:", interactionId:0 }
							] },
							{ talk:[
								{ line:"\"{symbol symbolWinning}! {symbol symbolYou}{symbol symbolRun}{symbol symbolWrongPerson}{symbol symbolEat}?\"" },
								{ line:"{symbol textSeparator}" },
								{ condition:"-1[[resource:resource1]], -1[[resource:resource2]]:", line:"{symbol setValue}1[[resource:flag]], +1{symbol symbolResourceAttack}, +1{symbol symbolResourceLife}" },
								{ condition:"-1[[resource:resource1]], -1[[resource:resource3]]:", line:"{symbol setValue}1[[resource:flag]], +1{symbol symbolResourceSkull}" },
								{ condition:"-1[[resource:resource2]], -1[[resource:resource3]]:", line:"{symbol setValue}1[[resource:flag]], +2{symbol symbolResourceGold}" },
								{ condition:"[[resource:flag]]:", interactionId:0 }
							] }
						],
						mergeGateWith:{
							id:true,
							type:[
								[ "biomeCorridor" ],
								[ "imageElementSideNpc" ]
							],
							boxes:[
								{ move:[
									{ order:-100, atAnyPlace:true, line:"\"{symbol symbolEat}{symbol symbolEat}{symbol symbolEat}!\""},
									{ order:-99, atAnyPlace:true, line:"{symbol textSeparator}" }
								]}
							]
						}
					}
				]
			}
		},{
			uuid:"58",
			description:"The card game: Collect cards, challenge the guardian, and open the door",
			onlyForArea:ONLYFORAREA_LATER, // Card packet are scattered around
			tags:[ "scatter" ],
			data:{
				path:[
					[
						{
							atArea:[-1],
							id:true,
							type:[
								[ "biomeWall" ],
								[ "imageElementChest" ]
							],
							boxes:[
								{ interact:[
									{ condition:"+1{symbol th}{symbol symbolBoosterPack}:", line:"+{symbol symbolRollDie}{symbol th}{symbol symbolTradingCard}" },
								] }
							]
						},{
							atArea:[-2],
							id:true,
							type:[
								[ "biomeWall" ],
								[ "imageElementChest" ]
							],
							boxes:[
								{ interact:[
									{ condition:"+2{symbol th}{symbol symbolBoosterPack}:", line:"+{symbol symbolRollDie}{symbol th}{symbol symbolTradingCard}" },
								] }
							]
						},{
							atArea:[-2],
							id:true,
							type:[
								[ "biomeWall" ],
								[ "imageElementChest" ]
							],
							boxes:[
								{ interact:[
									{ condition:"+3{symbol th}{symbol symbolBoosterPack}:", line:"+{symbol symbolRollDie}{symbol th}{symbol symbolTradingCard}" },
								] }
							]
						},{
							id:true,
							type:[
								[ "biomeWall" ],
								[ "imageElementChest" ]
							],
							boxes:[
								{ interact:[
									{ condition:"+4{symbol th}{symbol symbolBoosterPack}:", line:"+{symbol symbolRollDie}{symbol th}{symbol symbolTradingCard}" },
								] }
							]
						},{
							id:true,
							type:[
								[ "biomeWall" ],
								[ "imageElementChest" ]
							],
							boxes:[
								{ interact:[
									{ condition:"+5{symbol th}{symbol symbolBoosterPack}:", line:"+{symbol symbolRollDie}{symbol th}{symbol symbolTradingCard}" },
								] }
							]
						},{
							id:true,
							type:[
								[ "biomeWall" ],
								[ "imageElementChest" ]
							],
							boxes:[
								{ interact:[
									{ condition:"+6{symbol th}{symbol symbolBoosterPack}:", line:"+{symbol symbolRollDie}{symbol th}{symbol symbolTradingCard}" },
								] }
							]
						}
					]
				],
				lock:[
					{
						id:true,
						type:[
							[ "biomeCorridorBackdrop" ],
							[ "imageElementNpc" ]
						],
						atAnyPlace:true,
						boxes:[
							{ talk:[
								{ line:"\"{symbol symbolYou}{symbol symbolStop}! {symbol symbolSwearing}{symbol symbolBreak}{symbol symbolYou}{symbol symbolTradingCard}{symbol symbolTradingCard}!\"" },
								{ line:"{symbol textSeparator}" },
								{ condition:"{symbol symbolBoosterPack}: -{symbol symbolRollDie}{symbol th}{symbol symbolTradingCard}:", line:"+1{symbol symbolResourceGold}" },
								{ condition:"{symbol symbolBoosterPack}: -{symbol symbolRollDie}{symbol th}{symbol symbolTradingCard}:", line:"+1{symbol symbolResourceAttack}" },
								{ condition:"{symbol symbolBoosterPack}: -{symbol symbolRollDie}{symbol th}{symbol symbolTradingCard}:", line:"+1{symbol symbolResourceSkull}" },
								{ condition:"{symbol symbolBoosterPack}:",interactionId:0 }
							] },{ talk:[
								{ line:"\"{symbol symbolYou}{symbol symbolStop}! {symbol symbolSwearing}{symbol symbolBreak}{symbol symbolYou}{symbol symbolTradingCard}{symbol symbolTradingCard}!\"" },
								{ line:"{symbol textSeparator}" },
								{ condition:"{symbol symbolBoosterPack}: -{symbol symbolRollDie}{symbol th}{symbol symbolTradingCard}:", line:"+1{symbol symbolResourceGold}" },
								{ condition:"{symbol symbolBoosterPack}: -{symbol symbolRollDie}{symbol th}{symbol symbolTradingCard}:", line:"+1{symbol symbolResourceGold}" },
								{ condition:"{symbol symbolBoosterPack}: -{symbol symbolRollDie}{symbol th}{symbol symbolTradingCard}:", line:"+1{symbol symbolResourceSkull}" },
								{ condition:"{symbol symbolBoosterPack}:",interactionId:0 }
							] },{ talk:[
								{ line:"\"{symbol symbolYou}{symbol symbolStop}! {symbol symbolSwearing}{symbol symbolBreak}{symbol symbolYou}{symbol symbolTradingCard}{symbol symbolTradingCard}!\"" },
								{ line:"{symbol textSeparator}" },
								{ condition:"{symbol symbolBoosterPack}: -{symbol symbolRollDie}{symbol th}{symbol symbolTradingCard}:", line:"+1{symbol symbolResourceGold}" },
								{ condition:"{symbol symbolBoosterPack}: -{symbol symbolRollDie}{symbol th}{symbol symbolTradingCard}:", line:"+1{symbol symbolResourceLife}" },
								{ condition:"{symbol symbolBoosterPack}: -{symbol symbolRollDie}{symbol th}{symbol symbolTradingCard}:", line:"+1{symbol symbolResourceSkull}" },
								{ condition:"{symbol symbolBoosterPack}:",interactionId:0 }
							] },
						],
						mergeGateWith:{
							id:true,
							type:[
								[ "biomeCorridor" ],
								[ "imageElementSideNpc" ]
							],
							boxes:[
								{ move:[
									{ order:-100, atAnyPlace:true, line:"\"{symbol symbolYou}{symbol symbolStrength}{symbol symbolTradingCard}!\""},
									{ order:-99, atAnyPlace:true, line:"{symbol textSeparator}" }
								]}
							]
						}
					}
				]
			}
		},{
			uuid:"59",
			description:"The self portrait: Draw your avatar to unlock the door",
			data:{
				path:[
					[
						{
							id:true,
							type:[
								[ "biomeWall" ],
								[ "imageElementMirror" ]
							],
							atAnyPlace:true,
							boxes:[
								{ look:[
									{ line:"\"{symbol symbolYou}{symbol symbolWrite}{symbol symbolMirror}...\"" },
									{ line:"{symbol textSeparator}" },
									{ condition:"{symbol symbolDone}:", interactionId:0 }
								] },
							]
						}
					]
				],
				lock:[
					{
						id:true,
						type:[
							[ "biomeCorridorBackdrop" ],
							[ "imageElementNpc" ]
						],
						atAnyPlace:true,
						boxes:[
							{ talk:[
								{ line:"\"{symbol symbolYou}{symbol symbolWrongPerson}{symbol symbolMirror}... {symbol symbolYou}{symbol symbolWrongPerson}{symbol symbolGroup}...\"" }
							] }
						],
					}
				]
			}
		},{
			uuid:"60",
			description:"The maze: Draw a line to reach the maze exit and unlock the door",
			data:{
				path:[
					[
						{
							id:true,
							type:[
								[ "biomeWall" ],
								[ "imageElementScroll" ]
							],
							atAnyPlace:true,
							code:(I)=>{
								let
									editor = HELPERS.newBoxEditor(I, I.card, "interact"),
									maze = HELPERS.generateMaze(I, 20, 10);

								editor.addMaze(maze);
								editor.addFromModel(0, { line:"{align right}" });
							},
							boxes:[
								{ interact:[ { interactionId:0 } ] },
							]
						}
					]
				],
				lock:[
					{
						id:true,
						type:TYPE_BARS
					}
				]
			}
		},{
			uuid:"61",
			description:"The intricate machine: Understand the high-low game, play it, and unlock the door",
			data:{
				path:[
					[
						{
							id:true,
							type:[
								[ "biomeWall" ],
								[ "imageElementComputer" ]
							],
							requireResources:[ "high", "low", "tries" ],
							atAnyPlace:true,
							boxes:[
								{ interact:[
									{ condition:"-1[[resource:tries]]:", line:"{symbol symbolOffer 0~3 -1.1}{symbol symbolResourceGold}, \"{symbol symbolNote1}{symbol symbolNote2}{symbol symbolNote1}\"" },
									{ line:"{symbol symbolRollDie} = {symbol symbolStrength}, +1[[resource:high]]/+1[[resource:low]], {symbol symbolRollDie}"},
									{ condition:"-1[[resource:high]]: {symbol symbolDieValue} > {symbol symbolStrength}:", line:"+{symbol symbolOffer}{symbol symbolResourceGold}{symbol times}2"},
									{ condition:"-1[[resource:low]]: {symbol symbolDieValue} < {symbol symbolStrength}:", line:"+{symbol symbolOffer}{symbol symbolResourceGold}{symbol times}2"},
									{ condition:"{symbol symbolDieValue} = {symbol symbolStrength}:", line:"+{symbol symbolOffer}{symbol symbolResourceGold}"},
									{ condition:"[[resource:tries]] = 0:", line:"\"{symbol symbolNote2}{symbol symbolNote2}\", ", interactionId:0 }
								] }
							],
						}
					]
				],
				lock:[
					{
						id:true,
						type:[
							[ "biomeWall" ],
							[ "imageElementNpc" ]
						],
						atAnyPlace:true,
						boxes:[
							{ talk:[
								{ line:"\"{symbol symbolYou}{symbol symbolRightPerson}! {symbol symbolRun}{symbol symbolLuck}! {symbol symbolRich}{symbol symbolRich}!\"" },
								{ line:"{symbol textSeparator}" },
								{ condition:"[[resource:tries]] = 0: +3[[resource:tries]], +3{symbol symbolResourceGold}" },
							] }
						],mergeGateWith:{
							id:true,
							type:[
								[ "biomeCorridor" ],
								[ "imageElementSideNpc" ]
							],
							boxes:[
								{ move:[
									{ order:-100, atAnyPlace:true, line:"\"{symbol symbolYou}{symbol symbolRich}{symbol symbolRich}?\""},
									{ order:-99, atAnyPlace:true, line:"{symbol textSeparator}" }
								]}
							]
						}
					}
				]
			}
		},{
			uuid:"62",
			description:"The map shape puzzle: Guess the shape of the map so far",
			onlyForArea:ONLYFORAREA_DEADLY, // This may kill you!
			tags:[ "deadly" ],
			data:{
				lock:[
					{
						id:true,
						type:[
							[ "biomeWall" ],
							[ "imageElementCompass" ]
						],
						atAnyPlace:true,
						requireResources:[ "item1", "item2", "item3" ],
						code:(I)=>{
							const
								BORDER_SIZE = 0.256,
								SYMBOL_SIZE = 5,
								PADDING = 0.1,
								PADDING_2 = PADDING*2,
								CARD_WIDTH = 58,
								BOX_SIZE = 1,
								DIRECTIONS = [ {x:0, y:-1}, {x:1, y:0}, {x:0, y:1}, {x:-1, y:0} ],
								MIN_MUTATIONS = 1,
								RANGE_MUTATIONS = 2,
								MAP_WIDTH = 18,
								MAP_HEIGHT = 18,
								OPTIONS = 3,
								SHAPE_SIZE = MAP_WIDTH * BOX_SIZE,
								SHAPE_SPACING = SHAPE_SIZE+(CARD_WIDTH-(SHAPE_SIZE*OPTIONS))/(OPTIONS-1),
								SYMBOL_SPACING = (SHAPE_SIZE-SYMBOL_SIZE)/2;

							let
								cell =  I.card.destinations[0],
								map = HELPERS.makeMap(I, cell.area),
								padx = Math.floor((MAP_WIDTH-(map.x2-map.x1))/2),
								pady = Math.floor((MAP_HEIGHT-(map.y2-map.y1))/2),
								shape = [],
								versions = [],
								emptyline = [],
								prizes = [ I.card.resources.item1, I.card.resources.item2, I.card.resources.item3 ],
								answers = [],
								text = "{symbol symbolTurn}... {symbol symbolLook}...\n";

							// --- Create the shape from the map

							for (let i=0;i<MAP_WIDTH;i++)
								emptyline.push(0);

							for (let i=0;i<pady;i++)
								shape.push(emptyline);

							for (let y=map.y1;y<=map.y2;y++) {
								let
									row = [];
								for (let x=map.x1;x<=map.x2;x++)
									if (map.grid[y] && map.grid[y][x])
										row.push(1);
									else
										row.push(0);
								for (let i=0;i<padx;i++)
									row.unshift(0);

								do {
									row.push(0);
								} while (row.length<MAP_WIDTH);
								
								shape.push(row);
							}

							do {
								shape.push(emptyline);
							} while (shape.length<MAP_HEIGHT);

							// --- Create different alternatives

							versions.push({ isRight:true, shape:shape });

							for (let i=0;i<OPTIONS-1;i++) {
								let
									mutated = {},
									version = JSON.parse(JSON.stringify(shape)),
									times = MIN_MUTATIONS+I.random.integer(RANGE_MUTATIONS);

								for (let j=0;j<times;j++) {
									let
										mutation,
										mutations = { remove:[], add:[] };

									version.forEach((row,y)=>{
										row.forEach((cell,x)=>{
											let
												adjacent = 0,
												id = x+"-"+y;

											if (!mutated[id]) {

												DIRECTIONS.forEach(direction=>{
													if (version[y+direction.y] && version[y+direction.y][x+direction.x])
														adjacent++;
												})
													
												if (cell) {
													if (adjacent == 1)
														mutations.remove.push({ set:0, x:x, y:y, id:id });
												} else {
													if (adjacent)
														mutations.add.push({ set:1, x:x, y:y, id:id });
												}

											}
										})
									})

									if (mutations.remove.length)
										mutation = I.random.bool() ? I.random.element(mutations.remove) : I.random.element(mutations.add);
									else
										mutation = I.random.element(mutations.add);

									version[mutation.y][mutation.x] = mutation.set;
									mutated[mutation.id] = true;
								}

								versions.push({ isRight:false, shape:version });
							}

							// --- Shuffle
							I.random.shuffle(versions);

							// --- Rotate
							versions.forEach((version,id)=>{
								let
									times = I.random.integer(3);
								for (let i=0;i<times;i++) {
									let
										newShape = [];
									version.shape.forEach((row,y)=>{
										row.forEach((cell,x)=>{
											let
												dx = MAP_WIDTH-y-1,
												dy = x;
											if (!newShape[dy])
												newShape[dy] = [];
											newShape[dy][dx] = cell;
										});
									})
									version.shape = newShape;
								}
							})

							// --- Render options & prepare answers
							versions.forEach((version,id)=>{
								let
									ox = id*SHAPE_SPACING;
									
								text+="{rect "+ox+" 0 "+BORDER_SIZE+" "+SHAPE_SIZE+"}";
								text+="{rect "+ox+" 0 "+SHAPE_SIZE+" "+BORDER_SIZE+"}";
								text+="{rect "+(ox+SHAPE_SIZE-BORDER_SIZE)+" 0 "+BORDER_SIZE+" "+SHAPE_SIZE+"}";
								text+="{rect "+ox+" "+(SHAPE_SIZE-BORDER_SIZE)+" "+SHAPE_SIZE+" "+BORDER_SIZE+"}";
								version.shape.forEach((row,y)=>{
									row.forEach((cell,x)=>{
										if (cell)
											text+="{rect "+(ox+x*BOX_SIZE-PADDING)+" "+(y*BOX_SIZE-PADDING)+" "+(BOX_SIZE+PADDING_2)+" "+(BOX_SIZE+PADDING_2)+"}";
									})
								})
								text += "{stamp "+prizes[id].id+" "+(ox+SYMBOL_SPACING)+" "+(SHAPE_SIZE+1)+"}";

								answers.push({ isRight:version.isRight });
							})

							text+="{emptyarea "+(CARD_WIDTH-1)+" "+(SHAPE_SIZE+SYMBOL_SIZE+1)+"}";

							HELPERS.makeLockQuiz(
								I, "mapShapeQuiz",
								"interact",
								prizes,
								text,
								[],
								answers,
								LINE_KILLPLAYER
							);
						},
						boxes:[
							{ interact:[{ interactionId:0 }] }
						]
					}
				],
				specialsAmount:1
			}
		},{
			uuid:"63",
			description:"The match-3 game: Roll for pairs, rotate them, and draw them on a grid",
			data:{
				path:[
					[
						{
							id:true,
							type:[
								[ "biomeWall" ],
								[ "imageElementArcade" ]
							],
							atAnyPlace:true,
							boxes:[
								{ interact:[
									{ line:"{symbol schemaDiceMatchThree}"},
									{ ifInteractions:[ 0 ], condition:"{symbol symbolforEvery}{spacing -0.25}{symbol symbolSquare A}{symbol symbolSquare A}{symbol symbolSquare A}{endspacing}{symbol symbolAnyDirection}:", line:"+1{symbol symbolResourceGold}" },
									{ interactionId:0 },
								] },
							]
						}
					]
				],
				lock:[
					{
						id:true,
						type:TYPE_BARS
					}
				]
			}
		},{
			uuid:"64",
			description:"The eye: If you gaze long into an abyss, the abyss also gazes into you",
			onlyForArea:ONLYFORAREA_LAST, // Less exploration here as both 2 cards are used at the same place.
			data:{
				lock:[
					{
						id:true,
						type:[
							[ "biomeCorridor" ]
						],
						atAnyPlace:true,
						subplaces:{
							bossBattle:[
								{
									id:true,
									type:[
										[ "biomeCorridorBackdrop" ],
										[ "imageElementEyeball" ]
									],
									atAnyPlace:true,
									isInstant:true,
									boxes:[ { see:[
										COMBATRULES,
										{ condition:"{symbol symbolStrength} < 3:", line:"-1{symbol symbolResourceLife}" },
										{ condition:"{symbol symbolStrength} = 3:", line:"+1{symbol symbolResourceSkull}" },
										{ condition:"{symbol symbolStrength} > 4:", line:"+1{symbol symbolResourceGold}" },
										{ condition:"{symbol symbolStrength} > 5:", line:"+1{symbol symbolResourceGold}" },
										{ interactionId:0 }
									] } ]
								}
							]
						},
						boxes:[
							{ look:[
								{ replaceWithSubplace:"bossBattle" }
							] },
						],
						mergeGateWith:{
							id:true,
							type:[
								[ "biomeCorridor" ],
								[ "imageElementInvisible" ],
							],
							boxes:[
								{ move:[
									{ order:-100, atAnyPlace:true, line:"{symbol symbolMirror}..."}
								]}
							]
						}
					}
				]
			}
		},{
			uuid:"65",
			description:"The zombie: Stay silent for 5 seconds to pass over the zombie",
			data:{
				path:[
					[
						{
							id:true,
							type:[
								[ "biomeWall" ],
								[ "imageElementChest" ]
							],
							boxes:[
								{ interact:[
									{ line:"{symbol setValue}1{symbol symbolGun}" },
									{ atFakePlace:true, line:"{symbol setValue}1{symbol symbolGun}" },
									{ atFakePlace:true, line:"{symbol setValue}1{symbol symbolGun}" },
								] }
							]
						}
					]
				],
				lock:[
					{
						id:true,
						type:[
							[ "biomeCorridorBackdrop" ],
							[ "imageElementZombie" ]
						],
						atAnyPlace:true,
						isInstant:true,
						boxes:[
							{ see:[
								{ line:"{symbol symbolYou}{symbol symbolMute}00' 05\"..." },
								{ line:"{symbol textSeparator}" },
								{ condition:"{symbol symbolYou}{symbol symbolNoise}:", line:"-1{symbol symbolResourceLife}" },
								{ condition:"{symbol symbolGun}:", line:"+1{symbol symbolResourceGold}, ", interactionId:0 }
							] }
						]
					}
				]
			}
		},{
			uuid:"66",
			description:"The armor: Pierce the armor to damage it, defeat to open the door",
			data:{
				path:[
					[
						{
							id:true,
							type:[
								[ "biomeWall" ],
								[ "imageElementArmor" ]
							],
							requireResources:[ "health" ],
							atAnyPlace:true,
							boxes:[
								{ interact:[
									{ line:"{spacing -0.85}{symbol symbolRollDie}{symbol symbolRollDie}{symbol symbolRollDie}{symbol symbolRollDie}{symbol symbolRollDie}{endspacing}, {symbol startLoop}0~3{symbol symbolRollOtherDice}{symbol endLoop}{symbol times}3"},
									{ condition:"[[resource:health]] < 4: {symbol symbolSum}{spacing -0.85}{symbol symbolDieValue 6}{symbol symbolDieValue 6}{symbol symbolAllDice}{symbol symbolDieValue}{endspacing} > 26:", line:"+1{symbol symbolResourceGold}"},
									{ condition:"[[resource:health]] < 4: {symbol symbolSum}{spacing -0.85}{symbol symbolDieValue 6}{symbol symbolDieValue 6}{symbol symbolAllDice}{symbol symbolDieValue}{endspacing} < 19:", line:"-1{symbol symbolResourceLife}"},
									{ condition:"[[resource:health]] < 4: {symbol symbolSum}{spacing -0.85}{symbol symbolDieValue 6}{symbol symbolDieValue 6}{symbol symbolAllDice}{symbol symbolDieValue}{endspacing} > 22:", line:"+1[[resource:health]]"},
									{ condition:"[[resource:health]] = 4:", interactionId:0 }
								] }
							]
						}
					]
				],
				lock:[
					{
						id:true,
						type:TYPE_BARS
					}
				]
			}
		},{
			uuid:"67",
			description:"The fire element: Damage it balancing fire, defeat to open the door",
			data:{
				path:[
					[
						{
							id:true,
							type:[
								[ "biomeWall" ],
								[ "imageElementFireElement" ]
							],
							requireResources:[ "hits" ],
							atAnyPlace:true,
							boxes:[
								{ interact:[
									COMBATRULES,
									{ condition:"{symbol symbolStrength} = 1:", line:"-1{symbol symbolResourceLife}, +1{symbol symbolResourceAttack}"},
									{ condition:"{symbol symbolStrength} = 1/3/5:", line:"+1{symbol symbolFire}"},
									{ condition:"{symbol symbolStrength} > 4:", line:"+1[[resource:hits]]"},
									{ condition:"-2{symbol symbolFire}:", line:"-1{symbol symbolResourceLife}, +1{symbol symbolResourceAttack}"},
									{ condition:"[[resource:hits]] = 3:", line:"+2{symbol symbolResourceGold}, ", ifInteractions:[ 0 ], interactionId:0 }
								] }
							]
						}
					]
				],
				lock:[
					{
						id:true,
						type:TYPE_BARS
					}
				]
			}
		},{
			uuid:"68",
			description:"The slime: Split it multiple times to eliminate it",
			data:{
				path:[
					[
						{
							id:true,
							type:[
								[ "biomeWall" ],
								[ "imageElementBlob" ]
							],
							requireResources:[ "hits" ],
							atAnyPlace:true,
							boxes:[
								{ interact:[
									{ line:"{spacing -0.85}{symbol symbolRollDie}{symbol symbolRollDie}{symbol symbolRollDie}{symbol symbolRollDie}{symbol symbolRollDie}{endspacing}, {symbol startLoop}0~3{symbol symbolRollOtherDice}{symbol endLoop}{symbol times}3"},
									{ condition:"[[resource:hits]] = 2: {symbol symbolSum}{spacing -0.85}{symbol symbolDieValue 1}{symbol symbolDieValue 1}{symbol symbolDieValue 1}{symbol symbolAllDice}{symbol symbolDieValue}{endspacing} > 10:", line:"+1[[resource:hits]]"},
									{ condition:"[[resource:hits]] = 1: {symbol symbolSum}{spacing -0.85}{symbol symbolDieValue 3}{symbol symbolDieValue 3}{symbol symbolAllDice}{symbol symbolDieValue}{endspacing} > 18:", line:"+1[[resource:hits]]"},
									{ condition:"[[resource:hits]] = 0: {symbol symbolSum}{spacing -0.85}{symbol symbolDieValue 6}{symbol symbolAllDice}{symbol symbolDieValue}{endspacing} > 20:", line:"+1[[resource:hits]]"},
									{ condition:"{symbol symbolSum}{spacing -0.85}{symbol symbolAllDice}{symbol symbolDieValue}{endspacing} < 10:", line:"-1{symbol symbolResourceLife}"},
									{ ifInteractions:[ 0 ], condition:"[[resource:hits]] = 3:", line:"+3{symbol symbolResourceGold}, ", interactionId:0 }
								] }
							]
						}
					]
				],
				lock:[
					{
						id:true,
						type:TYPE_BARS
					}
				]
			}
		},{
			uuid:"69",
			description:"The stargazer puzzle: Join the starts to find the right shape and unlock the door",
			onlyForArea:ONLYFORAREA_DEADLY, // This may kill you!
			tags:[ "deadly" ],
			data:{
				path:[
					[
						{
							atArea:[-1],
							id:true,
							type:[
								[ "biomeWall" ],
								[ "imageElementScroll" ],
							],
							tags:[ "constellationPuzzleCard" ],
							code:(I)=>{
								const
									SHAPES = [
										[
											"...3",
											"2...",
											"1...",
											"...4",
										],[
											"1..4",
											"....",
											"2...",
											"...3",
										],[
											"1..4",
											"....",
											"...3",
											"2...",
										],[
											"1...",
											"...4",
											"...3",
											"2...",
										],[
											"1...",
											"...4",
											"....",
											"2..3",
										],[
											"...4",
											"1...",
											"....",
											"2..3",
										],[
											"...4",
											"....",
											"1...",
											"2..3",
										],[
											"1...",
											"....",
											"...4",
											"2..3",
										],[
											"1...",
											"...4",
											"2...",
											"...3",
										],[
											"...4",
											"1...",
											"...3",
											"2...",
										]
									],
									OPTIONS = 4,
									SYMBOL_SIZE = 5,
									CARD_WIDTH = 58,
									CARD_HEIGHT = 39,
									GRID_DISTANCE = 5,
									GRID_WIDTH = 4,
									GRID_HEIGHT = 4,
									GRID_FLOAT = 0.5,
									GRID_FLOAT2 = GRID_FLOAT*2,
									SHAPE_X = SYMBOL_SIZE/(GRID_WIDTH-1),
									SHAPE_Y = SYMBOL_SIZE/(GRID_HEIGHT-1),
									GRID_PAD = GRID_DISTANCE+SYMBOL_SIZE,
									GRID_SIZE = GRID_WIDTH*GRID_PAD-GRID_DISTANCE,
									GRID_OX = (CARD_WIDTH-GRID_SIZE)/2,
									GRID_OY = (CARD_HEIGHT-GRID_SIZE)/2,
									GRID_CELLS = GRID_WIDTH * GRID_HEIGHT;

								let
									editor = HELPERS.newBoxEditor(I, I.card, "look"),
									cells = [],
									text = "",
									shapesBag = { elements:SHAPES },
									options = [],
									mode = I.random.bool(),
									question,
									answers = [];

								for (let i=0;i<GRID_CELLS;i++)
									cells.push(i+1);

								I.random.shuffle(cells);

								for (let i=0;i<OPTIONS;i++) {
									let
										shape = I.random.bagPick(shapesBag),
										sequence = [],
										points = [],
										shifts = 0;

									shape.forEach((row,y)=>{
										for (let x=0;x<row.length;x++) {
											if (row[x]!=".") {
												let
													index = (y*GRID_WIDTH)+x,
													position = parseInt(row[x])-1;
												points[position] = { x:x*SHAPE_X, y:y*SHAPE_Y };
												sequence[position] = cells[index];
											}
										}
									});

									shifts = I.random.integer(sequence.length);

									for (let i=0;i<shifts;i++)
										sequence.push(sequence.shift());

									options.push({
										symbol:HELPERS.makePath(points)+"{emptyarea "+SYMBOL_SIZE+" "+SYMBOL_SIZE+"}",
										shape:shape,
										sequence:sequence,
									})

								}

								if (mode) {
									options.forEach((option,id)=>{
										if (!id)
											question = option.symbol+"?";
										answers.push({ isRight:id == 0, label:HELPERS.makeSequencePuzzle(I,option.sequence)+"?" });
									});
								} else {
									options.forEach((option,id)=>{
										if (!id)
											question = HELPERS.makeSequencePuzzle(I,option.sequence)+"?";
										answers.push({ isRight:id == 0, label:option.symbol+"?" });
									});
								}

								for (let i=0;i<GRID_CELLS;i++) {
									let
										dx = GRID_OX+(i%GRID_WIDTH)*GRID_PAD,
										dy = GRID_OY+Math.floor(i/GRID_WIDTH)*GRID_PAD;

									text += "{stamp symbolStar "+(dx+I.random.float()*GRID_FLOAT2-GRID_FLOAT)+" "+(dy+I.random.float()*GRID_FLOAT2-GRID_FLOAT)+" "+cells[i]+" -1.1}";
								}

								I.memory.question = question;
								I.memory.answers = answers;
								I.memory.shape = shapesBag;

								editor.add({ line:text });
								
							},
							boxes:[
								{ look:[] },
							]
						}
					]
				],
				lock:[
					{
						id:true,
						type:[
							[ "biomeWall" ],
							[ "imageElementCompass" ]
						],
						atAnyPlace:true,
						requireResources:[ "item1", "item2", "item3", "item4" ],
						code:(I)=>{
							HELPERS.makeLockQuiz(
								I, "constellationQuiz",
								"interact",
								[ I.card.resources.item1, I.card.resources.item2, I.card.resources.item3, I.card.resources.item4 ],
								I.memory.question,
								[],
								I.memory.answers,
								LINE_KILLPLAYER
							);

							I.deck.setAnswer("constellationQuiz", { shape:I.memory.shape });
							
						},
						boxes:[
							{ interact:[{ interactionId:0 }] }
						]
					}
				]
			}
		},{
			uuid:"70",
			description:"The haunted dungeon: Eliminate invisible enemies to unlock the door",
			onlyForArea:ONLYFORAREA_LAST,
			tags:[ "scatter" ],
			data:{
				path:[
					[
						{
							id:true,
							requireResources:[ "item1" ],
							type:[
								[ "biomeWall" ],
								[ "imageElementInvisible" ],
							],
							multiColumn:true,
							isInstant:true,
							requireResources:[ "item" ],
							boxes:[
								{ see:[
									COMBATRULES,
									{ condition:"{symbol symbolStrength} > 3:", line:"+1[[resource:item]]" },
									{ atFakePlace:true, condition:"{symbol symbolStrength} > 3:", line:"+1[[resource:item]]" },
								] }
							]
						},{
							atArea:[-1],
							id:true,
							type:[
								[ "biomeWall" ],
								[ "imageElementInvisible" ]
							],
							multiColumn:true,
							isInstant:true,
							boxes:[
								{ see:[
									COMBATRULES,
									{ condition:"{symbol symbolStrength} > 3:", line:"+1[[resource:item]]" },
									{ atFakePlace:true, condition:"{symbol symbolStrength} > 3:", line:"+1[[resource:item]]" },
								] }
							]
						},{
							atArea:[-2],
							id:true,
							type:[
								[ "biomeWall" ],
								[ "imageElementInvisible" ]
							],
							multiColumn:true,
							isInstant:true,
							boxes:[
								{ see:[
									{ condition:"{symbol symbolStrength} > 3:", line:"+1[[resource:item]]" },
									{ atFakePlace:true, condition:"{symbol symbolStrength} > 3:", line:"+1[[resource:item]]" },
								] }
							]
						},{
							atArea:[-2],
							id:true,
							type:[
								[ "biomeWall" ],
								[ "imageElementInvisible" ]
							],
							multiColumn:true,
							isInstant:true,
							boxes:[
								{ see:[
									COMBATRULES,
									{ atFakePlace:true, condition:"{symbol symbolStrength} > 3:", line:"+1[[resource:item]]" },
									{ atFakePlace:true, condition:"{symbol symbolStrength} > 3:", line:"+1[[resource:item]]" },
								] }
							]
						},{
							atArea:[-1],
							id:true,
							type:[
								[ "biomeWall" ],
								[ "imageElementInvisible" ]
							],
							multiColumn:true,
							isInstant:true,
							boxes:[
								{ see:[
									COMBATRULES,
									{ condition:"{symbol symbolStrength} > 3:", line:"+1[[resource:item]]" },
									{ atFakePlace:true, condition:"{symbol symbolStrength} > 3:", line:"+1[[resource:item]]" },
								] }
							]
						},{
							id:true,
							type:[
								[ "biomeWall" ],
								[ "imageElementInvisible" ]
							],
							multiColumn:true,
							isInstant:true,
							boxes:[
								{ see:[
									{ atFakePlace:true, condition:"{symbol symbolStrength} > 3:", line:"+1[[resource:item]]" },
								] }
							]
						}
					]
				],
				lock:[
					{
						id:true,
						type:[
							[ "biomeCorridorBackdrop" ],
							[ "imageElementBars" ],
							[ "imageElementPedestal" ]
						],
						atAnyPlace:true,
						boxes:[
							{ interact:[
								{ condition:"-4[[resource:item]]:", interactionId:0 }
							] }
						]
					}
				]
			}
		},{
			uuid:"71",
			description:"The converter: Convert resources to unlock the door",
			onlyForArea:ONLYFORAREA_LAST,
			tags:[ "scatter" ],
			data:{
				path:[
					[
						{
							id:true,
							requireResources:[ "item1", "item2", "item3", "counter" ],
							type:[
								[ "biomeWall" ],
								[ "imageElementChest" ]
							],
							multiColumn:true,
							boxes:[
								{ interact:[
									{ line:"+1{symbol th}[[resource:item1]]" },
									{ atFakePlace:true, line:"+1{symbol th}[[resource:item1]]" },
								] }
							]
						},{
							atArea:[-1],
							id:true,
							type:[
								[ "biomeWall" ],
								[ "imageElementChest" ]
							],
							multiColumn:true,
							boxes:[
								{ interact:[
									{ line:"+1{symbol th}[[resource:item2]]" },
									{ atFakePlace:true, line:"+1{symbol th}[[resource:item2]]" },
								] }
							]
						},{
							atArea:[-2],
							id:true,
							type:[
								[ "biomeWall" ],
								[ "imageElementChest" ]
							],
							multiColumn:true,
							boxes:[
								{ interact:[
									{ line:"+1{symbol th}[[resource:item3]]" },
									{ atFakePlace:true, line:"+1{symbol th}[[resource:item3]]" },
								] }
							]
						},{
							atArea:[-2],
							id:true,
							type:[
								[ "biomeWall" ],
								[ "imageElementChest" ]
							],
							multiColumn:true,
							boxes:[
								{ interact:[
									{ line:"+2{symbol th}[[resource:item1]]" },
									{ atFakePlace:true, line:"+2{symbol th}[[resource:item1]]" },
								] }
							]
						},{
							atArea:[-1],
							id:true,
							type:[
								[ "biomeWall" ],
								[ "imageElementChest" ]
							],
							multiColumn:true,
							boxes:[
								{ interact:[
									{ line:"+2{symbol th}[[resource:item2]]" },
									{ atFakePlace:true, line:"+2{symbol th}[[resource:item2]]" },
								] }
							]
						},{
							id:true,
							type:[
								[ "biomeWall" ],
								[ "imageElementChest" ]
							],
							multiColumn:true,
							boxes:[
								{ interact:[
									{ line:"+2{symbol th}[[resource:item3]]" },
									{ atFakePlace:true, line:"+2{symbol th}[[resource:item3]]" },
								] }
							]
						}
					]
				],
				lock:[
					{
						id:true,
						type:[
							[ "biomeWall" ],
							[ "imageElementComputer" ]
						],
						atAnyPlace:true,
						boxes:[
							{ interact:[
								{ line:"\"{symbol symbolNote1}{symbol symbolNote2}{symbol symbolNote1}\"" },
								{ condition:"-2[[resource:item1]]:", line:"+1[[resource:counter]], +1{symbol symbolResourceGold}" },
								{ condition:"-1[[resource:item1]], -1[[resource:item2]]:", line:"+1[[resource:counter]], +2{symbol symbolResourceAttack}" },
								{ condition:"-1[[resource:item2]], -1[[resource:item3]]:", line:"+1[[resource:counter]], {symbol setValue}0{symbol symbolResourceSkull}" },
								{ condition:"-2[[resource:item3]]:", line:"+1[[resource:counter]], +1{symbol symbolResourceLife}" },
								{ condition:"-4[[resource:counter]]:", interactionId:0 }
							] }
						],
						mergeGateWith:{
							id:true,
							type:[
								[ "biomeCorridor" ]
							],
							boxes:[
								{ move:[
									{ order:-100, atAnyPlace:true, line:"\"{symbol symbolNote1}{symbol symbolNote2}{symbol symbolNote1}{symbol symbolNote2}{symbol symbolNote1}{symbol symbolNote1}{symbol symbolNote1}\""}
								]}
							]
						}
					}
				]
			}
		},{
			uuid:"72",
			description:"The rotating password: The password changes every run and you have to input the previous one",
			onlyForArea:ONLYFORAREA_DEADLY, // This may kill you!
			tags:[ "deadly" ],
			data:{
				path:[
					[
						{
							id:true,
							type:[
								[ "biomeWall" ],
								[ "imageElementScroll" ],
							],
							tags:[ "rotatingPasswordCard" ],
							boxes:[
								{ look:[] },
							]
						}
					]
				],
				lock:[
					{
						id:true,
						type:[
							[ "biomeWall" ],
							[ "imageElementCompass" ]
						],
						atAnyPlace:true,
						requireResources:[ "item1", "item2", "item3", "item4" ],
						code:(I)=>{
							const
								OPTIONS = 3,
								COUNT = OPTIONS+2,
								SYMBOLS = [ "{symbol symbolArrowNorth}", "{symbol symbolArrowEast}", "{symbol symbolArrowSouth}", "{symbol symbolArrowWest}" ];

							let
								hintsCard = I.deck.findCard([ "rotatingPasswordCard" ]),
								hintcardEditor = HELPERS.newBoxEditor(I, hintsCard, "look"),
								currentPassword,
								idx = {},
								answers = [],
								passwords = [];

							// --- Do not generate the current or next password
							if (I.persistentMemory.current)
								idx[I.persistentMemory.current.join(",")] = true;
							if (I.persistentMemory.next)
								idx[I.persistentMemory.next.join(",")] = true;

							do {
								let
									passidx,
									password = [];
								for (let j=0;j<OPTIONS+1;j++)
									password.push(I.random.integer(SYMBOLS.length));

								passidx = password.join(",");
								if (!idx[passidx]) {
									passwords.push(password);
									idx[passidx] = true;
								}
							} while (passwords.length<COUNT)

							if (I.isNewSeed) {
								if (I.persistentMemory.current === undefined) {
									I.persistentMemory.isStarted = true;
									I.persistentMemory.current = passwords[OPTIONS+1];
								} else {
									delete I.persistentMemory.isStarted;
									I.persistentMemory.current = I.persistentMemory.next;
								}
								I.persistentMemory.next = passwords[OPTIONS];
							}

							answers.push({ isRight:true, label:I.persistentMemory.current.map(s=>SYMBOLS[s]).join("")+"?" });
							for (let i=0;i<OPTIONS;i++)
								answers.push({ isRight:false, label:passwords[i].map(s=>SYMBOLS[s]).join("")+"?" });

							if (I.persistentMemory.isStarted)
								hintcardEditor.add({ condition:"{symbol symbolPassword}{symbol symbolDate}?", line:I.persistentMemory.current.map(s=>SYMBOLS[s]).join("") });
							else
								hintcardEditor.add({ condition:"{symbol symbolPassword}{symbol symbolDate}?", line:"{symbol symbolSquiggle}" } );
							hintcardEditor.add({ condition:"{symbol symbolPassword}{symbol symbolDate}{symbol symbolInteractionReset}?", line:I.persistentMemory.next.map(s=>SYMBOLS[s]).join("") });

							HELPERS.makeLockQuiz(
								I, "rotatingPasswordQuiz",
								"interact",
								[ I.card.resources.item1, I.card.resources.item2, I.card.resources.item3, I.card.resources.item4 ],
								"{symbol symbolWrite}{symbol symbolDate}{symbol symbolPassword}",
								[],
								answers,
								LINE_KILLPLAYER
							);
							I.deck.setAnswer("rotatingPasswordQuiz", { nextAnswer:I.persistentMemory.next.map(s=>SYMBOLS[s]).join("") });
						},
						boxes:[
							{ interact:[{ interactionId:0 }] }
						]
					}
				]
			}
		},{
			uuid:"73",
			description:"The nonogram: Solve a nonogram puzzle and open the door",
			tags:[ "deadly" ],
			onlyForArea:ONLYFORAREA_DEADLY, // This may kill you!
			data:{
				path:[
					[
						{
							id:true,
							tags:[ "nonogramPuzzleCard" ],
							type:[
								[ "biomeWall" ],
								[ "imageElementScroll" ]
							],
						}
					]
				],
				lock:[
					{
						id:true,
						type:[
							[ "biomeWall" ],
							[ "imageElementCompass" ]
						],
						atAnyPlace:true,
						requireResources:[ "item1", "item2", "item3", "item4" ],
						code:(I)=>{
							let
								CARD_WIDTH = 57.8,
								GRID_WIDTH = 8,
								GRID_HEIGHT = 7,
								CELL_SIZE = 4,
								CELL_BORDER = 0.256,
								CELL_MARGIN = 2,
								GRID_X = (CARD_WIDTH-(GRID_WIDTH*CELL_SIZE))/2,
								CENTER_CELL = 0.35,
								CENTER_X = Math.floor(GRID_WIDTH*CENTER_CELL),
								CENTER_WIDTH = GRID_WIDTH-(CENTER_X*2),
								CENTER_Y = Math.floor(GRID_HEIGHT*CENTER_CELL),
								CENTER_HEIGHT = GRID_HEIGHT-(CENTER_Y*2);

							let
								nonogramCard = I.deck.findCard([ "nonogramPuzzleCard" ]),
								nonogramEditor = HELPERS.newBoxEditor(I, nonogramCard, "interact"),
								nonogram = HELPERS.makeValidNonogram(I, GRID_WIDTH, GRID_HEIGHT),
								line = "",
								centerCells = [],
								answers = [],
								grid = [];

							for (let x=0;x<=GRID_WIDTH;x++)
								line+="{rect "+(GRID_X+x*CELL_SIZE)+" "+(0)+" "+(CELL_BORDER)+" "+(CELL_SIZE*GRID_HEIGHT+CELL_BORDER)+" #ccc}";

							for (let y=0;y<=GRID_HEIGHT;y++)
								line+="{rect "+(GRID_X)+" "+(y*CELL_SIZE)+" "+(CELL_SIZE*GRID_WIDTH)+" "+(CELL_BORDER)+" #ccc}";

							for (let j=0;j<GRID_HEIGHT;j++)
								line+="{printat "+(GRID_X+GRID_WIDTH*CELL_SIZE+CELL_MARGIN)+" "+(j*CELL_SIZE)+" -0.2 "+nonogram.rows[j].join(" ")+"}";

							for (let j=0;j<GRID_WIDTH;j++)
								nonogram.columns[j].forEach((value,y)=>{
									line+="{printat "+(GRID_X+j*CELL_SIZE+1)+" "+(GRID_HEIGHT*CELL_SIZE+CELL_MARGIN+(y*3))+" -1 "+value+"}";
								});

							nonogram.grid.forEach(row=>{
								let
									line = "";
								row.forEach(cell=>{
									line+=cell ? "#" : "." ;
								})
								grid.push(line);
							})

							for (let y=0;y<CENTER_HEIGHT;y++)
								for (let x=0;x<CENTER_WIDTH;x++)
									centerCells.push({ x:CENTER_X+x, y:CENTER_Y+y });

							for (let i=0;i<4;i++) {
								let
									cell = I.random.removeElement(centerCells),
									value = nonogram.grid[cell.y][cell.x];

								if (i!=0)
									value = !value;

								answers.push({ isRight:i==0, label:(cell.x+1)+","+(cell.y+1)+" = {symbol "+(value ? "symbolTickedSquare" : "symbolEmptySquare")+"}?" })
							}

							nonogramEditor.add({ line:line });

							HELPERS.makeLockQuiz(
								I, "nonogramQuiz",
								"interact",
								[ I.card.resources.item1, I.card.resources.item2, I.card.resources.item3, I.card.resources.item4 ],
								"{symbol symbolTickedSquare}... {symbol symbolEmptySquare}...",
								[],
								answers,
								LINE_KILLPLAYER
							);

							I.deck.setAnswer("nonogramQuiz", { grid:grid });
						},
						boxes:[
							{ interact:[{ interactionId:0 }] }
						]
					}
				]
			}
		},{
			uuid:"74",
			description:"The fishing waterfall: Fish more or lose all your fish",
			data:{
				path:[
					[
						{
							id:true,
							type:[
								[ "biomeWall" ],
								[ "imageElementWaterfall" ]
							],
							atAnyPlace:true,
							boxes:[
								{ interact:[
									{ condition:"{symbol symbolFish} = 0:", line:"{symbol setValue}1{symbol symbolFishingRod}"},
									{ line:"{symbol startLoop}{tabto 7}{symbol symbolRollDie}" },
									{ condition:"{tabto 7}{symbol symbolFishingRod}: {symbol symbolDieValue 1}:", line:"{symbol setValue}1{symbol symbolFish}, {symbol setValue}0{symbol symbolFishingRod}" },
									{ condition:"{tabto 7}{symbol symbolFishingRod}:", line:"+1{symbol symbolFish}{tabto 47.5}{symbol endLoop}{symbol times}1~4" },
									{ ifInteractions:[ 0 ], condition:"{symbol symbolforEvery}{symbol symbolFish}:", line:"+1{symbol symbolResourceGold}" },
									{ interactionId:0 }
								] }
							],
						}
					]
				],
				lock:[
					{
						id:true,
						type:TYPE_BARS
					}
				]
			}
		},{
			uuid:"75",
			description:"The procedural pantheon: Donate the right thing to the right god",
			data:{
				path:[
					[
						{
							id:true,
							type:[
								[ "biomeWall" ]
							],
							tags:[ "pantheonCard" ],
							boxes:[
								{ look:[] },
							]
						}
					]
				],
				lock:[
					{
						id:true,
						type:[
							[ "biomeWall" ]
						],
						atAnyPlace:true,
						requireResources:[ "item1", "item2", "item3", "item4" ],
						code:(I)=>{
							const
								GODS = [
									"imageElementStatueGod1",
									"imageElementStatueGod2",
									"imageElementStatueGod3",
									"imageElementStatueGod4"
								],
								DONATIONS = [
									{ action:"-1{symbol symbolResourceLife}", symbol:"{symbol symbolResourceLife}" },
									{ action:"-1{symbol symbolResourceAttack}", symbol:"{symbol symbolResourceAttack}" },
									{ action:"-1{symbol symbolResourceGold}", symbol:"{symbol symbolResourceGold}" },
									{ action:"+1{symbol symbolResourceSkull}", symbol:"{symbol symbolResourceSkull}" },
								],
								GIFTS = [
									{ action:"+2{symbol symbolResourceLife}", symbol:"{symbol symbolResourceLife}" },
									{ action:"+2{symbol symbolResourceAttack}", symbol:"{symbol symbolResourceAttack}" },
									{ action:"+2{symbol symbolResourceGold}", symbol:"{symbol symbolResourceGold}" },
									{ action:"-2{symbol symbolResourceSkull}", symbol:"{symbol symbolResourceSkull}" },
								],
								PUNISHMENTS = [
									{ action:"-1{symbol symbolResourceLife}" },
									{ action:"-1{symbol symbolResourceAttack}" },
									{ action:"-1{symbol symbolResourceGold}" },
									{ action:"+1{symbol symbolResourceSkull}" },
									{ action:"-2{symbol symbolResourceAttack}" },
									{ action:"-2{symbol symbolResourceGold}" },
									{ action:"+2{symbol symbolResourceSkull}" },
								];

							let
								pantheonCard = I.deck.findCard([ "pantheonCard" ]),
								pantheonCardEditor = HELPERS.newBoxEditor(I, pantheonCard, "look"),
								godsBag = { elements:[] },
								punishmentsBag = { elements:PUNISHMENTS },
								dialogue = HELPERS.newDialogue(I),
								hintType,
								hintGod,
								currentGod,
								items = [ I.card.resources.item1, I.card.resources.item2, I.card.resources.item3, I.card.resources.item4 ],
								answers = [],
								question = [];

							if (!pantheonCard.setIndex)
								debugger;

							if (I.persistentMemory.gods === undefined) {
								let
									donationsBag = { elements:[] },
									giftsBag = { elements:[] };

								DONATIONS.forEach((_,id)=>donationsBag.elements.push(id));
								GIFTS.forEach((_,id)=>giftsBag.elements.push(id));

								I.persistentMemory.gods = [];
								GODS.forEach(god=>{
									I.persistentMemory.gods.push([ I.random.bagPick(donationsBag), I.random.bagPick(giftsBag) ]);
								})
							}

							GODS.forEach((_,id)=>godsBag.elements.push(id));
							hintGod = I.random.bagPick(godsBag);
							currentGod = I.random.bagPick(godsBag);
							hintType = I.random.bool();

							// --- Hint card
							pantheonCard.decorations=[ GODS[hintGod] ];

							for (let i=0;i<4;i++)
								pantheonCardEditor.add({ line:dialogue.makeLine(1+I.random.integer(3)) });
							pantheonCardEditor.add({ line:"{symbol textSeparator}" });
							if (hintType)
								pantheonCardEditor.add({ line:"{symbol symbolExit}"+DONATIONS[I.persistentMemory.gods[hintGod][0]].symbol });
							else
								pantheonCardEditor.add({ line:"{symbol symbolTurn}"+GIFTS[I.persistentMemory.gods[hintGod][1]].symbol });

							// --- Gate card

							DONATIONS.forEach((donation,id)=>{
								question.push(donation.action+"? +1"+items[id].symbol);
								if (id == I.persistentMemory.gods[currentGod][0])
									answers.push({ outcome:GIFTS[I.persistentMemory.gods[currentGod][1]].action, label:"1"+items[id].symbol });
								else
									answers.push({ outcome:I.random.bagPick(punishmentsBag).action, label:"1"+items[id].symbol });
							})

							HELPERS.makeLockQuiz(
								I, "pantheonQuiz",
								"interact",
								0,
								"\"{symbol symbolYou}{symbol symbolExit}{symbol symbolSwearing}...\"",
								[ GODS[currentGod] ],
								question.join("\n")+"\n",
								answers
							);

							I.deck.setAnswer("pantheonQuiz", {
								hintGod:hintGod,
								hintGodData:I.persistentMemory.gods[hintGod],
								currentGod:currentGod,
								currentGodData:I.persistentMemory.gods[currentGod],
							});
						},
						boxes:[
							{ interact:[{ interactionId:0 }] }
						]
					}
				]
			}
		},{
			uuid:"76",
			description:"The trading: Trade items until you get the right one",
			data:{
				path:[
					[
						{
							id:true,
							requireResources:[ "item1", "item2", "item3", "item4" ],
							type:[
								[ "biomeWall" ],
								[ "imageElementNpc" ]
							],
							boxes:[
								{ talk:[
									{ condition:"[[resource:item1]] = 0?", line:"+1[[resource:item1]]" }
								] }
							]
						},{
							id:true,
							type:[
								[ "biomeWall" ],
								[ "imageElementNpc" ]
							],
							boxes:[
								{ talk:[
									{ condition:"-1[[resource:item1]]?", line:"+1[[resource:item2]]" }
								] }
							]
						},{
							id:true,
							type:[
								[ "biomeWall" ],
								[ "imageElementNpc" ]
							],
							boxes:[
								{ talk:[
									{ condition:"-1[[resource:item2]]?", line:"+1[[resource:item3]]" },
									{ condition:"-2[[resource:item2]]?", line:"+1[[resource:item3]], +1{symbol symbolResourceAttack}" },
								] }
							]
						},{
							id:true,
							type:[
								[ "biomeWall" ],
								[ "imageElementNpc" ]
							],
							boxes:[
								{ talk:[
									{ condition:"-1[[resource:item3]]?", line:"+1[[resource:item4]]" },
									{ condition:"-2[[resource:item3]]?", line:"+3{symbol symbolResourceGold}" },
								] }
							]
						}
					]
				],
				lock:[
					{
						id:true,
						keepOriginalGate:true,
						addOverallCondition:"[[resource:item4]]:",
						type:TYPE_BARRIER
					}
				],
				specialsAmount:1
			}
		},{
			uuid:"77",
			description:"The plumber: Collect bonuses in question mark blocks scattered around to open the door",
			onlyForArea:ONLYFORAREA_LAST,
			tags:[ "scatter" ],
			data:{
				path:[
					[
						{
							id:true,
							type:[
								[ "biomeWall" ],
								[ "imageElementQuestionMark" ],
							],
							requireResources:[ "flag" ],
							boxes:[
								{ interact:[
									{ condition:"+1{symbol th}[[resource:flag]]: {symbol symbolRollDie} > 2:",  line:"+2{symbol symbolResourceGold}" }
								] },
							]
						},{
							id:true,
							type:[
								[ "biomeWall" ],
								[ "imageElementQuestionMark" ],
							],
							boxes:[
								{ interact:[
									{ condition:"+2{symbol th}[[resource:flag]]: {symbol symbolRollDie} > 2:",  line:"+1{symbol symbolResourceGold}, +1{symbol symbolResourceAttack}" }
								] },
							]
						},{
							atArea:[-1],
							id:true,
							type:[
								[ "biomeWall" ],
								[ "imageElementQuestionMark" ],
							],
							boxes:[
								{ interact:[
									{ condition:"+3{symbol th}[[resource:flag]]: {symbol symbolRollDie} > 2:",  line:"+1{symbol symbolResourceGold}, +1{symbol symbolResourceLife}" }
								] },
							]
						},{
							atArea:[-1],
							id:true,
							type:[
								[ "biomeWall" ],
								[ "imageElementQuestionMark" ],
							],
							boxes:[
								{ interact:[
									{ condition:"+4{symbol th}[[resource:flag]]: {symbol symbolRollDie} > 2:",  line:"+1{symbol symbolResourceGold}, -1{symbol symbolResourceSkull}" }
								] },
							]
						},{
							atArea:[-2],
							id:true,
							type:[
								[ "biomeWall" ],
								[ "imageElementQuestionMark" ],
							],
							boxes:[
								{ interact:[
									{ condition:"+5{symbol th}[[resource:flag]]: {symbol symbolRollDie} > 2:",  line:"+1{symbol symbolResourceGold}, +1{symbol symbolResourceLife}" }
								] },
							]
						},{
							atArea:[-3],
							id:true,
							type:[
								[ "biomeWall" ],
								[ "imageElementQuestionMark" ],
							],
							boxes:[
								{ interact:[
									{ condition:"+6{symbol th}[[resource:flag]]: {symbol symbolRollDie} > 2:",  line:"+1{symbol symbolResourceGold}, +1{symbol symbolResourceAttack}" }
								] },
							]
						}
					]
				],
				lock:[
					{
						id:true,
						keepOriginalGate:true,
						addOverallCondition:"[[resource:flag]] > 4:",
						type:TYPE_BARRIER
					}
				],
				specialsAmount:1
			}
		},{
			uuid:"78",
			description:"The russian doll: Explore a maze moving from crossed cells to win bonus and malus",
			data:{
				path:[
					[
						{
							id:true,
							type:[
								[ "biomeWall" ],
								[ "imageElementScroll" ]
							],
							atAnyPlace:true,
							code:(I)=>{
								let
									BORDER_SIZE = 0.256,
									SYMBOL_SIZE = 5,
									PADDING_SIZE = 0.65,
									CELL_SIZE = SYMBOL_SIZE+(PADDING_SIZE*2),
									MAZES = [
										[
											"####X####",
											"#...#...#",
											"#...#...#",
											"#########",
										],[
											"##!.X.!##",
											"#...#...#",
											"#...#...#",
											"#########",
										],[
											"####X####",
											"#...#...#",
											"#...#...#",
											"#!.!#!.!#",
										],[
											"X.!!#.###",
											"#.!.###.#",
											"#.......#",
											"#########",
										],[
											"......###",
											"####..#.!",
											"!..##X#.!",
											"####..###",
										],[
											"X.###.###",
											"#.#.#.#.!",
											"#.#.#.#.!",
											"###.###.!",
										],[
											"####..!.!",
											"#..######",
											"#..X....#",
											"#########",
										],[
											"X##!...#!",
											".#...###.",
											".#####.#!",
											".....!...",
										]
									],
									ICONS = [ "symbolResourceLife", "symbolResourceSkull", "symbolResourceGold", "symbolResourceAttack" ],
									GOODICONS = [ "symbolResourceLife", "symbolResourceGold", "symbolResourceAttack" ],
									SPREAD = [ 0, 1 ],
									iconsBag = { elements:ICONS },
									spreadBag = { elements:SPREAD },
									editor = HELPERS.newBoxEditor(I, I.card, "interact"),
									maze = I.random.element(MAZES),
									out = "";

								maze.forEach((row,y)=>{
									for (let x=0;x<row.length;x++) {
										let
											cell = row[x],
											dx = x*CELL_SIZE,
											dy = y*CELL_SIZE;

										if (cell != ".") {
											out+="{rect "+(dx)+" "+(dy)+" "+(CELL_SIZE)+" "+(BORDER_SIZE)+" #ccc}";
											out+="{rect "+(dx)+" "+(dy)+" "+(BORDER_SIZE)+" "+(CELL_SIZE)+" #ccc}";
											out+="{rect "+(dx)+" "+(dy+CELL_SIZE)+" "+(CELL_SIZE+BORDER_SIZE)+" "+(BORDER_SIZE)+" #ccc}";
											out+="{rect "+(dx+CELL_SIZE)+" "+(dy)+" "+(BORDER_SIZE)+" "+(CELL_SIZE)+" #ccc}";
										}
										switch (cell) {
											case "#":{
												if (I.random.bagPick(spreadBag))
													out +="{stamp "+(I.random.bagPick(iconsBag))+" "+(dx+PADDING_SIZE)+" "+(dy+PADDING_SIZE)+"}";
												break;
											}
											case "!":{
												out +="{stamp "+(I.random.element(GOODICONS))+" "+(dx+PADDING_SIZE)+" "+(dy+PADDING_SIZE)+"}";
												break;
											}
											case "X":{
												out +="{stamp symbolFullTick "+(dx+PADDING_SIZE)+" "+(dy+PADDING_SIZE)+"}";
												break;
											}
										}
									}
								})

								out += "{emptyarea "+(CELL_SIZE*maze[0].length)+" "+(CELL_SIZE*maze.length)+"}";

								editor.add({ condition:"{symbol symbolTickedSquares} < 6:", line:"{symbol symbolRollDie}, {symbol symbolSteps}: {symbol symbolCrossOut}: +1{symbol symbolTickedSymbolSquare}"});
								editor.add({ line:out });
								editor.addFromModel(0, { condition:"{symbol symbolTickedSquares} = 6:" });
							},
							boxes:[
								{ interact:[ { interactionId:0 } ] },
							]
						}
					]
				],
				lock:[
					{
						id:true,
						type:TYPE_BARS
					}
				]
			}
		},{
			uuid:"79",
			description:"The monsterdex: Sum stats from enemies in previous zones",
			onlyForArea:ONLYFORAREA_LAST, // The more the enemies, the better
			data:{
				lock:[
					{
						id:true,
						type:[
							[ "biomeWall" ],
							[ "imageElementNpcBoss" ]
						],
						atAnyPlace:true,
						requireResources:[ "item1", "item2", "item3", "item4" ],
						code:(I)=>{
							const
								OPTIONS = 4,
								DELTA = [ -1, 1 ],
								STATSLIST = [
									{ id:"skull", question:"{symbol symbolSum}{symbol symbolMonster}{symbol symbolResourceSkull}" },
									{ id:"life", question:"{symbol symbolSum}{symbol symbolMonster}{symbol symbolResourceLife}" },
									{ id:"level", question:"{symbol symbolSum}{symbol symbolMonster}{symbol symbolStrength}" },
									{ id:"times", question:"{symbol symbolSum}{symbol symbolMonster}{symbol symbolResourceAttack}" },
								];

							let
								monsterCard = I.deck.findCard([ "id:"+ENEMIES_ID ]),
								cell = I.card.destinations[0],
								stats = { life:0, skull:0, level:0, times:0 },
								value,
								stat,
								statsBag = { elements:STATSLIST },
								answers = [],
								positions = [],
								cells = [];

							// Calculate available cells for the puzzle
							I.dungeon.cells.forEach(dc=>{
								if (!dc.isStartingCell && (dc.area < cell.area)) {
									dc.walls.forEach((el,side)=>{
										if (el.id == ENEMIES_ID) {
											el.generatedBy.forEach(generator=>{
												if (generator.boxes.see)
													generator.boxes.see.forEach(line=>{
														if (line.battleMeta) {
															positions.push({ atCell:dc.id, side:side, battleMeta:line.battleMeta});
															stats.times++;
															if (line.battleMeta.life)
																stats.life += line.battleMeta.life;
															if (line.battleMeta.skull)
																stats.skull += line.battleMeta.skull;
															if (line.battleMeta.level)
																stats.level += line.battleMeta.level;
														}
													})
												})
											}
									});						
								}
							});

							stat = I.random.bagPick(statsBag);
							answers.push({ isRight:true, label:stat.question+" = "+stats[stat.id]+"?" });

							for (let i=1;i<OPTIONS;i++) {
								let
									delta = I.random.element(DELTA);
								stat = I.random.bagPick(statsBag);
								value = stats[stat.id]+delta;
								if (value < 0)
									value = stats[stat.id]+2;
								answers.push({ isRight:false, label:stat.question+" = "+value+"?" });
							}

							HELPERS.makeLockQuiz(
								I, "monstersQuiz",
								"talk",
								[ I.card.resources.item1, I.card.resources.item2, I.card.resources.item3, I.card.resources.item4 ],
								"\"{symbol symbolSwearing}{symbol symbolScroll}{symbol symbolMonster}{symbol symbolCardBorder "+monsterCard.setIndex+"}{symbol symbolStats}! {symbol symbolYou}{symbol symbolLook}...\"",
								[],
								answers,
								LINE_KILLPLAYER
							);

							I.deck.setAnswer("monstersQuiz", { positions:positions, stats:stats });

						},
						boxes:[
							{ talk:[{ interactionId:0 }] }
						]
					}
				],
				specialsAmount:1
			}
		},{
			uuid:"80",
			description:"The sides jigsaw: Compose the puzzle and guess the right tile position",
			onlyForArea:ONLYFORAREA_DEADLY, // This may kill you!
			tags:[ "deadly" ],
			resources:[
				// Jigsaw1 excluded as it's the scissors image and it can be confusing in this puzzle.
				{ type:"image", id:"star", url:"resources/star.png" },
				{ type:"image", id:"jigsaw2", url:"resources/jigsaw2.png" },
				{ type:"image", id:"jigsaw3", url:"resources/jigsaw3.png" },
				{ type:"image", id:"symbol1", url:"resources/symbol1.png" },
				{ type:"image", id:"symbol2", url:"resources/symbol2.png" },
				{ type:"image", id:"symbol3", url:"resources/symbol3.png" },
				{ type:"image", id:"symbol4", url:"resources/symbol4.png" },
				{ type:"image", id:"symbol5", url:"resources/symbol5.png" },
				{ type:"image", id:"symbol6", url:"resources/symbol6.png" },
				{ type:"image", id:"symbol7", url:"resources/symbol7.png" },
				{ type:"image", id:"symbol8", url:"resources/symbol8.png" },
				{ type:"image", id:"symbol9", url:"resources/symbol9.png" },
				{ type:"image", id:"symbol10", url:"resources/symbol10.png" },
				{ type:"image", id:"symbol11", url:"resources/symbol11.png" },
				{ type:"image", id:"symbol12", url:"resources/symbol12.png" },
				{ type:"image", id:"symbol13", url:"resources/symbol13.png" },
			],
			data:{
				path:[
					[
						{
							id:true,
							tags:[ "jigsawCard" ],
							type:[
								[ "biomeWall" ],
								[ "imageElementScroll" ]
							],
							atAnyPlace:true,
						}
					]
				],
				lock:[
					{
						id:true,
						type:[
							[ "biomeCorridorBackdrop" ],
							[ "imageElementNpc" ]
						],
						atAnyPlace:true,
						requireResources:[ "item1", "item2", "item3", "item4" ],
						code:(I)=>{
							const
								OPTIONS = 4,
								SYMBOLS = [
									"jigsaw2",
									"jigsaw3",
									"symbol1",
									"symbol2",
									"symbol3",
									"symbol4",
									"symbol5",
									"symbol6",
									"symbol7",
									"symbol8",
									"symbol9",
									"symbol10",
									"symbol11",
									"symbol12",
									"symbol13",
								],
								IMAGE_WIDTH = 440,
								IMAGE_HEIGHT = 440,
								SYMBOL_SIZE = 70,
								PIECES_X = 3,
								PIECES_Y = 3,
								STAR_MARGIN = 40,
								HSYMBOL_SIZE = Math.floor(SYMBOL_SIZE/2),
								CELL_SIZE_X = Math.floor(IMAGE_WIDTH/PIECES_X),
								CELL_SIZE_Y = Math.floor(IMAGE_WIDTH/PIECES_Y),
								CELL_DX = Math.floor((CELL_SIZE_X-SYMBOL_SIZE)/2),
								CELL_DY = Math.floor((CELL_SIZE_Y-SYMBOL_SIZE)/2),
								SYMBOL_DELTA = Math.floor(SYMBOL_SIZE/2);

							let
								jigsawCard = I.deck.findCard([ "jigsawCard" ]),
								jigsawEditor = HELPERS.newBoxEditor(I, jigsawCard, "interact"),
								symbolsBag = { elements:SYMBOLS },
								star = I.resources.get("star"),
								puzzleCanvas = document.createElement("canvas"),
								ctx = puzzleCanvas.getContext("2d"),
								answerX = I.random.integer(PIECES_X),
								answerY = I.random.integer(PIECES_Y),
								answersIndex = {},
								answers = [],
								canvas;

							answersIndex[answerX+"-"+answerY] = true;
							answers.push({ isRight:true, label:(answerX+1)+","+(answerY+1)+"?" });

							puzzleCanvas.width = IMAGE_WIDTH;
							puzzleCanvas.height = IMAGE_HEIGHT;
							ctx.lineWidth = 5;

							ctx.drawImage(
								star.image,
								0,0,star.width,star.height,
								answerX*CELL_SIZE_X+STAR_MARGIN,
								answerY*CELL_SIZE_Y+STAR_MARGIN,
								CELL_SIZE_X-STAR_MARGIN*2,
								CELL_SIZE_Y-STAR_MARGIN*2
							);

							for (let y=0;y<=PIECES_Y;y++)
								for (let x=0;x<=PIECES_X;x++) {
									let
										ox = x*CELL_SIZE_X+CELL_DX,
										oy = y*CELL_SIZE_Y-SYMBOL_DELTA,
										ox1 = x*CELL_SIZE_X-SYMBOL_DELTA,
										oy1 = y*CELL_SIZE_Y+CELL_DY,
										symbol = I.random.bagPick(symbolsBag),
										symbol1 = I.random.bagPick(symbolsBag),
										resource = I.resources.get(symbol),
										resource1 = I.resources.get(symbol1),
										angleInRadians = Math.PI*0.5*I.random.integer(4),
										angleInRadians1 = Math.PI*0.5*I.random.integer(4);

									ctx.translate(ox+HSYMBOL_SIZE, oy+HSYMBOL_SIZE);
									ctx.rotate(angleInRadians);

									ctx.drawImage(
										resource.image,
										0, 0, resource.width, resource.height,
										-HSYMBOL_SIZE, -HSYMBOL_SIZE, SYMBOL_SIZE, SYMBOL_SIZE
									);

									ctx.rotate(-angleInRadians);
									ctx.translate(-ox-HSYMBOL_SIZE,-oy-HSYMBOL_SIZE);

									ctx.translate(ox1+HSYMBOL_SIZE, oy1+HSYMBOL_SIZE);
									ctx.rotate(angleInRadians1);

									ctx.drawImage(
										resource1.image,
										0, 0, resource1.width, resource1.height,
										-HSYMBOL_SIZE, -HSYMBOL_SIZE, SYMBOL_SIZE, SYMBOL_SIZE
									);

									ctx.rotate(-angleInRadians1);
									ctx.translate(-ox1-HSYMBOL_SIZE,-oy1-HSYMBOL_SIZE);

								}

							do {
								let
									x = I.random.integer(PIECES_X),
									y = I.random.integer(PIECES_Y),
									id = x+"-"+y;

								if (!answersIndex[id])
									answers.push({ isRight:false, label:(x+1)+","+(y+1)+"?" });
							} while (answers.length < OPTIONS);

							canvas = HELPERS.makeJigsaw(I, puzzleCanvas, PIECES_X, PIECES_Y);

							jigsawEditor.add({ cutout:[ { type:"symbol", id:"cutoutHalf" }, { type:"canvas", canvas:canvas }]});
							HELPERS.makeLockQuiz(
								I, "sideJigsawQuiz",
								"talk",
								[ I.card.resources.item1, I.card.resources.item2, I.card.resources.item3, I.card.resources.item4 ],
								"\"{symbol symbolSwearing}{symbol symbolScroll}{symbol symbolBreak}... {symbol symbolLook}{symbol symbolLargeStar}?\"",
								[],
								answers,
								LINE_KILLPLAYER
							);
						},
						boxes:[
							{ talk:[
								{ interactionId:0 }
							] }
						]
					}
				]
			}
		},{
			uuid:"81",
			description:"The army: Gather an army of dice and bonuses and beat the boss",
			data:{
				path:[
					[
						{
							id:true,
							type:[
								[ "biomeWall" ],
								[ "imageElementNpcsGroup" ]
							],
							atAnyPlace:true,
							requireResources:[ "itemDice", "itemBonus" ],
							boxes:[
								{ talk:[
									{ line:"\"{symbol symbolSwearing}{symbol symbolStrength}! {symbol symbolSwearing}{symbol symbolGroup}{symbol symbolYou}!\"" },
									{ line:"{symbol textSeparator}" },
									{ condition:"[[resource:itemDice]] + [[resource:itemBonus]] < 5:", line:"{symbol symbolRollDie}" },
									{ condition:"[[resource:itemDice]] + [[resource:itemBonus]] < 5: {symbol symbolDieValue} < 3?", line:"+1[[resource:itemBonus]]" },
									{ condition:"[[resource:itemDice]] + [[resource:itemBonus]] < 5: {symbol symbolDieValue} > 3?", line:"+1[[resource:itemDice]]" },
									{ condition:"[[resource:itemDice]] + [[resource:itemBonus]] < 5: -1{symbol symbolResourceGold} / +1{symbol symbolResourceSkull}?", line:"+1[[resource:itemDice]]" },
								] }
							],
						}
					]
				],
				lock:[
					{
						id:true,
						type:[
							[ "biomeWall" ],
							[ "imageElementBoss" ]
						],
						atAnyPlace:true,
						boxes:[
							{ interact:[
								{ line:"{symbol symbolOffer 0~5 -1.1}[[resource:itemDice]]{symbol symbolRollDie} + ({symbol symbolOffer 0~5 -1.1}[[resource:itemBonus]]{symbol times}2) = {symbol symbolStrength}" },
								{ condition:"{symbol symbolStrength} < 16?", line:"-1{symbol symbolResourceLife}" },
								{ condition:"{symbol symbolStrength} > 15?", line:"+1{symbol symbolResourceGold}" },
								{ condition:"{symbol symbolStrength} > 16?", line:"+1{symbol symbolResourceGold}, -1{symbol symbolResourceSkull}" },
								{ condition:"{symbol symbolStrength} > 17?", line:"+2{symbol symbolResourceGold}, +1{symbol symbolResourceAttack}" },
								{ interactionId:0 },
							] }
						]
					}
				]
			}
		},{
			uuid:"82",
			description:"The horses race: Bet on a horse and win prizes",
			data:{
				path:[
					[
						{
							id:true,
							type:[
								[ "biomeWall" ],
								[ "imageElementArcade" ]
							],
							requireResources:[ "bet", "play" ],
							atAnyPlace:true,
							boxes:[
								{ interact:[
									{ condition:"[[resource:bet]] = 0:", line:"+1{symbol th}[[resource:bet]]/+2{symbol th}[[resource:bet]]/+3{symbol th}[[resource:bet]], +1[[resource:play]]" },
									{ condition:"[[resource:play]]: {symbol symbolforEvery}{symbol symbolHorse}:", line:"{symbol startLoop}+1{symbol symbolTickedSquare}{symbol endLoop}{symbol times}{symbol symbolRollDie}" },
									{ line:"{symbol schemaHorseRace}"},
									{ condition:"[[resource:play]]: {symbol symbolTickedSquare}{symbol symbolGoal}: {symbol startLoop}{symbol symbolHorse}{symbol symbolGoal}{symbol endLoop}{symbol th}[[resource:bet]]:", line:"+3{symbol symbolResourceGold}" },
									{ condition:"[[resource:play]]: {symbol symbolTickedSquare}{symbol symbolGoal}:", line:"-1[[resource:play]],", interactionId:0 },
								] },
							]
						}
					]
				],
				lock:[
					{
						id:true,
						type:TYPE_BARS
					}
				]
			}
		},{
			uuid:"83",
			description:"The keepers: Convince them you're good to let them leave the passage",
			data:{
				path:[
					[
						{
							id:true,
							type:[
								[ "biomeWall" ],
								[ "imageElementNpc" ]
							],
							requireResources:[ "itemTrust", "itemAttempts" ],
							boxes:[
								{ talk:[
									{ id:"sentence", atAnyPlace:true, line:"\"{symbol symbolYou}{symbol symbolHoly}? {symbol symbolSwearing}{symbol symbolMirror}{symbol symbolWrongPerson}{symbol symbolYou}...\"" },
									{ id:"separator", atAnyPlace:true, line:"{symbol textSeparator}" },
									{ condition:"{symbol symbolReply}: +1{symbol th}[[resource:itemAttempts]]: {symbol symbolRollDie}>2:", line:"+1[[resource:itemTrust]], +1{symbol symbolResourceGold}" }
								] }
							],
						},{
							id:true,
							type:[
								[ "biomeWall" ],
								[ "imageElementNpc" ]
							],
							boxes:[
								{ talk:[
									{ id:"sentence", atAnyPlace:true, line:"\"{symbol symbolYou}{symbol symbolHoly}? {symbol symbolSwearing}{symbol symbolMirror}{symbol symbolWrongPerson}{symbol symbolYou}...\"" },
									{ id:"separator", atAnyPlace:true, line:"{symbol textSeparator}" },
									{ condition:"{symbol symbolReply}: +2{symbol th}[[resource:itemAttempts]]: {symbol symbolRollDie}>2:", line:"+1[[resource:itemTrust]], +1{symbol symbolResourceAttack}" }
								] }
							],
						},{
							id:true,
							type:[
								[ "biomeWall" ],
								[ "imageElementNpc" ]
							],
							boxes:[
								{ talk:[
									{ id:"sentence", atAnyPlace:true, line:"\"{symbol symbolYou}{symbol symbolHoly}? {symbol symbolSwearing}{symbol symbolMirror}{symbol symbolWrongPerson}{symbol symbolYou}...\"" },
									{ id:"separator", atAnyPlace:true, line:"{symbol textSeparator}" },
									{ condition:"{symbol symbolReply}: +3{symbol th}[[resource:itemAttempts]]: {symbol symbolRollDie}>2:", line:"+1[[resource:itemTrust]], +1{symbol symbolResourceLife}" }
								] }
							],
						},{
							id:true,
							type:[
								[ "biomeWall" ],
								[ "imageElementNpc" ]
							],
							boxes:[
								{ talk:[
									{ id:"sentence", atAnyPlace:true, line:"\"{symbol symbolYou}{symbol symbolHoly}? {symbol symbolSwearing}{symbol symbolMirror}{symbol symbolWrongPerson}{symbol symbolYou}...\"" },
									{ id:"separator", atAnyPlace:true, line:"{symbol textSeparator}" },
									{ condition:"{symbol symbolReply}: +4{symbol th}[[resource:itemAttempts]]: {symbol symbolRollDie}>2:", line:"+1[[resource:itemTrust]], -1{symbol symbolResourceSkull}" }
								] }
							],
						}
					]
				],
				lock:[
					{
						id:true,
						type:[
							[ "biomeCorridorBackdrop" ],
							[ "imageElementNpcsGroup" ]
						],
						atAnyPlace:true,
						boxes:[
							{ talk:[
								{ line:"\"{symbol symbolYou}{symbol symbolHoly}? {symbol symbolGroup}{symbol symbolReply}{symbol symbolYou}{symbol symbolWrongPerson}...\"" },
								{ line:"{symbol textSeparator}" },
								{ condition:"{symbol symbolReply}{symbol symbolSwearing}{symbol symbolHoly}: {symbol symbolRollDie} + [[resource:itemTrust]] = {symbol symbolStrength}" },
								{ condition:"{symbol symbolStrength} > 5:", line:"\"{symbol symbolYou}{symbol symbolHoly}!\", ", interactionId:0 },
								{ condition:"{symbol symbolStrength} < 6:", line:"\"{symbol symbolYou}{symbol symbolWrongPerson}!\", +1{symbol symbolResourceSkull}" }
							] }
						],
						mergeGateWith:{
							id:true,
							type:[
								[ "biomeCorridor" ],
								[ "imageElementNpcs" ]
							],
							boxes:[
								{ move:[
									{ order:-100, atAnyPlace:true, line:"\"{symbol symbolHoly}...\""},
									{ order:-99, atAnyPlace:true, line:"{symbol textSeparator}" }
								]}
							]
						}
					}
				]
			}
		},{
			uuid:"84",
			description:"The crystal cave: Gather some crystals to drill an exit",
			data:{
				path:[
					[
						{
							id:true,
							type:[
								[ "biomeWall" ],
								[ "imageElementCrystals" ]
							],
							requireResources:[ "itemProgress" ],
							multiColumn:true,
							boxes:[
								{ interact:[
									{ line:"+1{symbol th}{symbol symbolCrystal}" },
									{ condition:"{symbol symbolRollDie}>3:", line:"+2{symbol th}{symbol symbolCrystal}" },
									{ atFakePlace:true, line:"+1{symbol th}{symbol symbolCrystal}" },
									{ atFakePlace:true, condition:"{symbol symbolRollDie}>3:", line:"+2{symbol th}{symbol symbolCrystal}" },
								] }
							],
						},{
							id:true,
							type:[
								[ "biomeWall" ],
								[ "imageElementCrystals" ]
							],
							multiColumn:true,
							boxes:[
								{ interact:[
									{ line:"+3{symbol th}{symbol symbolCrystal}" },
									{ condition:"{symbol symbolRollDie}>3:", line:"+4{symbol th}{symbol symbolCrystal}" },
									{ atFakePlace:true, line:"+3{symbol th}{symbol symbolCrystal}" },
									{ atFakePlace:true, condition:"{symbol symbolRollDie}>3:", line:"+4{symbol th}{symbol symbolCrystal}" },
								] }
							],
						}
					]
				],
				lock:[
					{
						id:true,
						type:[
							[ "biomeWall" ],
							[ "imageElementRubble" ],
							[ "imageElementNpc" ]
						],
						atAnyPlace:true,
						boxes:[
							{ talk:[
								{ line:"\"{symbol symbolYou}{symbol symbolCrystal}{symbol symbolSwearing}, {symbol symbolSwearing}{symbol symbolPick}!\"" },
								{ line:"{symbol textSeparator}" },
								{ condition:"-2{symbol symbolCrystal}:", line:"+1[[resource:itemProgress]]" },
								{ condition:"-3[[resource:itemProgress]]:", line:"+3{symbol symbolResourceGold},", interactionId:0 },
							] }
						],
						mergeGateWith:{
							id:true,
							type:[
								[ "biomeCorridor" ],
								[ "imageElementSideNpc" ]
							],
							boxes:[
								{ move:[
									{ order:-100, atAnyPlace:true, line:"\"{symbol symbolCrystal}{symbol symbolStrength}! {symbol symbolCrystal}{symbol symbolBreak}!\""},
									{ order:-99, atAnyPlace:true, line:"{symbol textSeparator}" }
								]}
							]
						}
					}
				]
			}
		},{
			uuid:"85",
			description:"The arm wrestling: Challenge an unusually strong NPC at arm wrestling and open the door",
			data:{
				path:[
					[
						{
							id:true,
							type:[
								[ "biomeWall" ],
								[ "imageElementNpcStrong" ]
							],
							requireResources:[ "playerStrength", "npcStrength" ],
							atAnyPlace:true,
							boxes:[
								{ talk:[
									{ line:"\"{symbol symbolSwearing}{symbol symbolStrength}{symbol symbolStrength}! {symbol symbolYou}?\"" },
									{ condition:"{spacing -0.85}{symbol symbolRollDie}{symbol symbolRollDie}{endspacing}, {symbol symbolforEvery}{symbol symbolDieValue}>4:", line:"+1[[resource:npcStrength]]"},
									{ condition:"-1{symbol symbolResourceAttack}:", line:"+1[[resource:playerStrength]]" },
									{ condition:"{spacing -0.85}{symbol symbolRollDie}{symbol symbolRollDie}{endspacing}, {symbol symbolforEvery}{symbol symbolDieValue}>4:", line:"+1[[resource:playerStrength]]"},
									{ ifInteractions:[ 0 ], condition:"[[resource:playerStrength]] = 6:", line:"\"{symbol symbolYou}{symbol symbolStrength}!\", +2{symbol symbolResourceGold}, +2{symbol symbolResourceAttack}"},
									{ condition:"[[resource:playerStrength]] = 6 / [[resource:npcStrength]] = 6:", interactionId:0 },
								] },
							]
						}
					]
				],
				lock:[
					{
						id:true,
						type:TYPE_BARS
					}
				]
			}
		}
	];