let Generator = function(settings, language, seed) {
	let
		generator = settings.generator,
		attempts = 0,
		isOk = true;

	function clone(a) {
		return JSON.parse(JSON.stringify(a));
	}

	if (seed < 0) {
		seed = Math.floor(Math.random()*1000000);
	}

	if (!seed)
        seed=Generator.getTodaySeed();

    if (settings._logs) {
		console.log(settings.passages.length,"events.");
		console.warn("SEED",seed);
	}

	// --- Generate the dungeon
	let
		languageData = LANGUAGES[language],
		basename = CONFIG.SHORTTITLE+"-"+seed,
		randomPrepare = new Random(seed),
		randomCrawler = new Random(seed),
		randomDungeon = new Random(seed),
		randomDeck = new Random(seed),
		randomCode = new Random(seed),
		enemyType = randomDungeon.element(generator.enemyTypes),
		subjects = [...SUBJECTS],
		resources = [...RESOURCES],
		biome = randomDungeon.element(BIOMES),
		packAttempts = settings.packAttempts || -1,
		generateAttempts = settings.generateAttempts || -1,
		deck,
		dungeon,
		selectedEvents = [],
		selectedSpecials,
		debugPassages,
		availablePassages = [...settings.passages],
		selectedPassages = {},
		passageTags = {},
		lastGameData,
		specials,
		working;

	// --- Some resources will become words for this run.
	for (let i=0;i<5;i++)
		subjects.push(randomPrepare.removeElement(resources));

	// --- Prepare debug lists
	if (settings._debug) {
		debugPassages = availablePassages.filter(passage=>passage._debug);
		if (!debugPassages.length)
			debugPassages = 0;
		specials = settings.specials.filter(special=>special._debug);
		if (!specials.length)
			specials = settings.specials;
	} else if (settings._tutorial) {		
		debugPassages = availablePassages.filter(passage=>passage._tutorial);
		debugPassages.sort((a,b)=>{
			if (a._tutorial > b._tutorial)
				return 1;
			else if (a._tutorial < b._tutorial)
				return -1;
			else
				return 0;
		})
		specials = settings.specials.filter(special=>special._tutorial);
	} else
		specials = settings.specials;

	// --- Randomly picks the passages to fill the list
	do {

		let
			passage;

		working = false;

		if (debugPassages) {
			if (settings._tutorial) {
				if (debugPassages.length == 0)
					console.error("Not enough tutorial events");
				else
					passage = debugPassages.shift();
			} else {
				passage = randomPrepare.removeElement(debugPassages);
				availablePassages.splice(availablePassages.indexOf(passage),1);
				if (debugPassages.length == 0)
					debugPassages = 0;
			}
		} else {
			passage = randomPrepare.removeElement(availablePassages);
		}

		if (passage.tags)
			passage.tags.forEach(tag=>{
				if (passageTags[tag])
					working = true;
			})

		if (!working)
			generator.structure.forEach((area,areaid)=>{
				if (area.addPassage && !selectedPassages[areaid]) {
					if (passage && (!passage.onlyForArea || (passage.onlyForArea.indexOf(areaid)!=-1))) {
						selectedPassages[areaid] = passage;
						selectedEvents.push({ area:areaid, event:passage });
						if (passage.tags)
							passage.tags.forEach(tag=>{
								passageTags[tag] = true;
							});
						passage = 0;
					} else
						working = true;
				}
			});

	} while (working);

	do {

		attempts++;

		do {
			let
				specialsBag = { elements:specials },
				enemySet = [],
				crawler;

			if (settings._logs) {
				console.log("Attempting dungeon...");
			}

			selectedSpecials = [];
			isOk = true;

			dungeon = new Dungeon(generator.dungeon, randomDungeon);
			crawler = new Crawler(generator.crawler, randomCrawler, dungeon, resources);

			crawler.addEntrance({ type:[ "biomeWall" ], isCrawlable:true }, { type:[ "biomeCorridor" ], sortByPlace:true, multiColumn:true });
			
			generator.enemies.forEach((set,level)=>{
				let
					enemy = clone(randomDungeon.element(set));

				enemySet[level] = enemy;
			});

			generator.structure.forEach((area,areaid)=>{

				let
					exitBag = { elements:area.exitsMap },
					exit;

				if (isOk) {
					for (let i=0;i<area.crawlFor-1;i++)
						isOk &= crawler.crawl(exitBag, areaid,areaid,{ type:[ "biomeWall" ], isCrawlable:true }, { type:[ "biomeCorridor" ], sortByPlace:true, multiColumn:true });
				}

				if (isOk && area.addPassage)
					isOk &= crawler.addDoor(exitBag, specialsBag, selectedSpecials, areaid,area.addPassage[0],area.addPassage[1],{ type:[ "biomeWall" ], isCrawlable:true }, { type:[ "biomeCorridor" ], sortByPlace:true, multiColumn:true }, selectedPassages[areaid]);

				if (isOk && area.addExit)
					exit = crawler.addExit(randomDungeon.element(EXITS),areaid);

				if (isOk && area.addEnemies)
					for (let i=0;i<=areaid;i++)
						isOk &= crawler.addEnemies(i,enemyType,area.addEnemies[i],enemySet);

				if (isOk && area.addScatter)
					isOk &= crawler.addScatter(exit);

				if (exit)
					crawler.finalizeExit(exit);

			});

			if (!isOk)
				generateAttempts--;

		} while (!isOk && (generateAttempts != 0));

		if (settings._logs) {
			console.log("Attempting deck...");
		}

		// --- Generate the deck

		if (isOk) {
			lastGameData = clone(settings.gameData);
			deck = new Deck(seed, languageData, generator.deck, settings.gameProgress, lastGameData, settings.resources, randomDeck, randomCode, dungeon, subjects, VERBS, settings._postProcess);
			deck.build();

			isOk = deck.cards.length <= 18;
		}
		
		if (!isOk)
			packAttempts--;

	} while (!isOk && (packAttempts != 0));

	deck.finalize(CONFIG.SHORTTITLE+"-"+seed);

	// --- Print the deck

	return {
		seed:seed,
		basename:basename,
		isOk:isOk,
		packAttemptsLeft:packAttempts,
		settings:settings,
		selectedEvents: selectedEvents,
		selectedSpecials: selectedSpecials,
		gameData:lastGameData,
		attempts: attempts,
		biome:biome,
		dungeon:dungeon,
		deck:deck
	}
}

Generator.getTodaySeed = ()=>{
	const
		DAYMSEC = 1000*60*60*24;

	let
		tmpdate = new Date(); 

	tmpdate = new Date(tmpdate.getFullYear(),tmpdate.getMonth(),tmpdate.getDate(),1,0,0);
    seed=Math.floor(tmpdate.getTime()/DAYMSEC);
    return seed;
}