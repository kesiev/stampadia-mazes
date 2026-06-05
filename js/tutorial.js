const
	TUTORIAL_GENERATOR = {
		dungeon:{
			ids: "BCDEFGHIJKLMOQRSTVXYZaeghmnrt"
		},
		crawler:{},
		deck:{
			doNotReuseStartingCard:true,
			directionsPerJoint:4,
			setLogic:SETLOGIC_REFERENCES,
			setSize:4,
			setMode:SETMODE_MIXED,
			avoidFromCardInDirections:true,
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
			]
		],
		structure:[
			{
				crawlFor:4, exitsMap:[ 1, 4 ], addPassage:[ 0, 1 ]
			},{
				crawlFor:4, exitsMap:[ 1, 4, 4 ], addPassage:[ 0, 2 ]
			},{
				crawlFor:5, exitsMap:[ 1, 1, 4 ],
				addExit:true,
				addEnemies:[
					[],
					[
						{ level:0, at:0.5 }
					],[
						{ level:0, at:0.5 },
					],[
						{ level:1, at:0.5 },
						{ level:1, at:0.5 },
					]
				],
				addScatter:true
			}
		]
	},
	TUTORIAL_SEED = "1980-01-01",
	TUTORIAL_VERSION = "0.1b",
	TUTORIAL_POSTPROCESS = (I)=>{
		const
			VERSIONS = [ "A", "B", "C", "D" ],
			TUTORIAL = LANGUAGES.EN.tutorial;

		I.deck.unshift({
			atAnyPlace:true,
			boxes:[
				{ id:"none", items:[] }
			],
			isTutorial:true,
			generatedBy:[],
			type:[ "imageTutorial" ],
			tags:[ "id:intro" ],
			id:"intro",
			setIndex:0,
			setSymbol:0,
			version:0,
		});

		I.deck.forEach(card=>{
			console.log(card);

			let
				addRuler = true,
				boxes,
				inject,
				placeholders = {};

			if (card.boxes.length) {
				card.boxes[0].items = card.boxes[0].items.filter(a=>!a.atFakePlace);
				boxes = card.boxes[0].items;
				boxes.forEach(line=>{
					if (line.line) {
						line.line = line.line.replace(/\{symbol symbolCrownLarge\}\n/g,"");
						if (card.isCentered) {
							line.line = "{align center}"+line.line;
						}
					}
					if (line.to) {
						placeholders.destination = line.to.id;
						placeholders.cardsPosition = "";	
						for (let i=0;i<4;i++)
							placeholders.cardsPosition += line.camera[i].setIndex ? TUTORIAL.cardsPosition[i][0] + line.camera[i].setIndex + TUTORIAL.cardsPosition[i][1] : TUTORIAL.cardsPosition[i][2];
					}
					if (line.from) {
						placeholders.from = line.from.id;
					}
					if (line.card)
						placeholders.fromCard = line.card.setIndex+VERSIONS[line.card.version];
					if (line.toCard)
						placeholders.toCard = line.toCard.setIndex+VERSIONS[line.toCard.version];
				})
			}

			switch (card.index) {
				case 0:{ // Start
					inject = LANGUAGES.EN.tutorial.start;
					break;
				}
				default:{
					let
						keyId;

					if (!card.id)
						keyId = "corridor";
					else
						keyId = card.id+(card.version ? "-v"+(card.version+1) : "");

					if (TUTORIAL[keyId])
						inject = TUTORIAL[keyId];

					if ((keyId == "dungeonenemies") || (keyId == "intro"))
						addRuler = false;
				}
			}
			
			card.isCentered = false;
			card.cardCode = "TUTORIAL-"+TUTORIAL_VERSION+"-"+card.setIndex+"-"+card.version;

			if (inject) {
				if (!boxes) {
					card.boxes = [
						{
							id:"look",
							items:[]
						}
					];
					boxes = card.boxes[0].items;
				}
				if (addRuler)
					boxes.unshift({ line:"{symbol textSeparator}" });
				for (let i=inject.length-1;i>=0;i--) {
					let
						text = inject[i];
					text = text.replace(/\{([^}]+)\}/g, (m,m1)=>{
						return placeholders[m1] ? placeholders[m1] : m;
					});
					boxes.unshift({ line:"{linespacing 0}"+text+"{endlinespacing}" });
				}
			}
		})
	};