function Crawler(settings,random,dungeon,resources) {

	const
		BOUNDS = { x1:-10, y1:-10, x2:10, y2:10 },
		DIRECTIONS = [ { direction:0, x:0, y:-1 }, { direction:1, x:1, y:0 }, { direction:2, x:0, y:1 }, { direction:3, x:-1, y:0 } ],
		LIMIT_WALLS = 1;

	let
		resourcesBag = { elements:[] },
		keysBag = { elements:[] },
		toScatter = [],
		toExitLocks = [],
		exits = [],
		entrances = [],
		endGameBonuses = [],
		interactionId = 0;

	resources.forEach(resource=>{
		resourcesBag.elements.push({ id:resource, symbol:"{symbol "+resource+"}" });
	})

	for (let i=0;i<6;i++)
		keysBag.elements.push((i+1)+"{symbol th}{symbol symbolResourceKey}");

	function clone(a) {
		return JSON.parse(JSON.stringify(a));
	}

	function getOptions(area, skipstartingcell) {
		let
			options = [];

		dungeon.cells.forEach(cell=>{

			if ((!skipstartingcell || !cell.isStartingCell) && (cell.area == area)) {
				let
					walls = cell.walls.filter(w=>w).length;

				if (walls > LIMIT_WALLS) {
					DIRECTIONS.forEach(direction=>{
						let
							dx = cell.x+direction.x,
							dy = cell.y+direction.y;

						if (
							cell.walls[direction.direction].isCrawlable &&
							((cell.exitDirection === undefined) || (cell.exitDirection == direction.direction)) &&
							(dx>BOUNDS.x1) && (dx<BOUNDS.x2) && (dy>BOUNDS.y1) && (dx<BOUNDS.y2)
						) {
							let
								destCell = dungeon.getCell(dx,dy);

							if (!destCell) {
								options.push({ from:cell, to:direction });
							}
						}
					})
				}
			}

		})

		return options;

	}

	function crawlDistancesFrom(cell,index,distance) {
		if (!index) {
			index = {};
			distance = 0;
		}
		if (!index[cell.id]) {
			index[cell.id] = { cell:cell, distance:distance };
			cell.exits.forEach(exit=>{
				if (exit)
					crawlDistancesFrom(exit,index,distance+1);
			})
		} else if ((index[cell.id].distance == undefined) || (index[cell.id].distance>distance)) {
			index[cell.id].distance = distance;
		}

		return index;
	}

	function getCellsByDistance(cell) {
		let
			results = [],
			index = crawlDistancesFrom(cell);
		for (let k in index) {
			results.push({ cell:index[k].cell, distance:index[k].distance });
		}
		results.sort((a,b)=>{
			if (a.distance > b.distance)
				return -1;
			else if (a.distance < b.distance)
				return 1;
			else
				return 0;
		})

		return results;
	}

	function getWalls(area,cell,exclude) {
		let
			results = getCellsByDistance(cell),
			walls = [];

		results.forEach(result=>{
			let
				cell = result.cell,
				cellResult = [];

			if (!cell.isStartingCell && ((area == -1) || (cell.area == area)) && (!exclude || (exclude.indexOf(cell) == -1))) {
				cell.walls.forEach((wall,direction)=>{
					if (wall && !wall.id)
						cellResult.push({ cell:cell, direction:direction });
				})
			}

			if (cellResult.length)
				walls.push(cellResult);

		})

		return walls;

	}

	function getDeadEndWalls(area, exclude) {
		let
			deadends = [];

		dungeon.cells.forEach(cell=>{
			if ((cell.area == area) && (exclude.indexOf(cell) == -1)) {
				let
					deadend = [];

				cell.walls.forEach((wall,direction)=>{
					if (wall && wall.isCrawlable)
						deadend.push({ cell:cell, direction:direction })
				})

				if (deadend.length > 2)
					deadends.push(deadend);
			}
		})

		return deadends;
	}

	function getRandomFarWall(walls, limit) {
		let
			index = random.integer(Math.min(walls.length,limit)),
			cell = walls.splice(index,1)[0];
		return random.element(cell);
	}
	
	function solveLine(text, resources, keys, index) {
		return text.replace(/\[\[([^\]]+)\]\]/g,(m,m1)=>{
			let
				parts = m1.split(":");
			switch (parts[0]) {
				case "resource":{
					if (resources[parts[1]] === undefined)
						debugger;
					return resources[parts[1]].symbol;
				}
				case "key":{
					if (keys[parts[1]] === undefined)
						debugger;
					return keys[parts[1]];
				}
				case "index":{
					return index;
				}
				case "endGameBonuses":{
					// Solved at last
					return m;
				}
				default:{
					debugger;
				}
			}
		});
	}

	function generateType(typemodel) {
		return typemodel.map(set=>random.element(set));
	}

	function generateFromModel(generatedby, model, prefix, interactionId, resources, keys, index, skiprequire) {
		let
			copy = clone(model);

		copy.generatedBy = [ generatedby ];
		
		if (copy.boxes)
			copy.boxes = random.element(copy.boxes);

		if (copy.type)
			copy.type = generateType(copy.type);

		if (copy.atArea)
			copy.atArea = random.element(model.atArea);

		if (copy.id)
			copy.id = prefix+"-"+interactionId;

		if (!skiprequire && copy.requireResources) {
			copy.requireResources.forEach(resource=>{
				resources[resource] = random.bagPick(resourcesBag);
			})
		}

		if (!skiprequire && copy.requireKeys) {
			copy.requireKeys.forEach(key=>{
				keys[key] = random.bagPick(keysBag);
			})
		}

		if (!skiprequire && copy.addEndGameBonuses)
			copy.addEndGameBonuses.forEach(bonus=>{
				if (endGameBonuses.indexOf(resources[bonus]) == -1)
					endGameBonuses.push({ generatedBy:generatedby, resource:resources[bonus] });
			})

		if (copy.switchType) {
			let
				switchType = random.element(copy.switchType);
			copy.type = generateType(switchType[0]);
			copy.flipType = generateType(switchType[1]);
		}

		if (model.lockData)
			copy.lockData = generateFromModel(generatedby, random.element(model.lockData), "lock-", interactionId, resources, keys);
		
		if (model.addOverallCondition)
			copy.addOverallCondition = solveLine(model.addOverallCondition, resources, keys, index);

		if (copy.boxes)
			for (let k in copy.boxes) {
				copy.boxes[k].forEach(item=>{
					if (item.interactionId !== undefined)
						item.interactionId = interactionId + item.interactionId;
					if (item.line)
						item.line = solveLine(item.line, resources, keys, index);
					if (item.condition)
						item.condition = solveLine(item.condition, resources, keys, index);
				})
			}

		if (model.subplaces)
			for (let k in model.subplaces)
				copy.subplaces[k] = generateFromModel(generatedby, random.element(model.subplaces[k]), "subplace", interactionId, resources, keys);

		if (model.code) {
			copy.codeUuid = generatedby.uuid;
			copy.code = model.code;
		}

		copy.interactionId = interactionId;
		copy.resources = resources;
		copy.keys = keys;

		return copy;
	}

	function setWall(cell, direction, wall) {
		cell.walls[direction] = wall;
		if (wall.markCell)
			for (let k in wall.markCell)
				cell.marks[k] = wall.markCell[k];
	}

	return {
		addExit:(exitmodel,fromArea)=>{
			let
				walls = getWalls(fromArea, random.element(entrances[fromArea])),
				exitLock = toExitLocks[0],
				wall = random.element(walls[0]),
				exit = generateFromModel(exitmodel, exitmodel, "exit", interactionId);

			wall.cell.isExit = true;

			if (exitLock) {
				let
					lock = generateFromModel(exitLock.generatedBy, exitLock.model, "exitlock", exitLock.interactionId, exitLock.resources, exitLock.keys);
				lock._exit = exit;
				setWall(wall.cell, wall.direction, lock);
			} else
				setWall(wall.cell, wall.direction, exit);
			
			return { wall:wall, model:exit };
		},
		finalizeExit:(exit)=>{
			let
				boxes = exit.model.boxes,
				exitPlaceholders = {
					endGameBonuses:""
				};

			if (endGameBonuses)
				endGameBonuses.forEach(bonus=>{
					exitPlaceholders.endGameBonuses +="+"+bonus.resource.symbol;
					if (exit.model.generatedBy.indexOf(bonus.generatedBy) == -1)
						exit.model.generatedBy.push(bonus.generatedBy);
				})

			for (let k in boxes) {
				boxes[k].forEach(item=>{
					item.line = item.line.replace(/\[\[([^\]]+)\]\]/g,(m,m1)=>{
						return exitPlaceholders[m1];
					});
				});
			}

		},
		addEntrance:(wallType, floorType)=>{
			let
				cell = dungeon.addCell(0,0,0,wallType,floorType);
			cell.isStartingCell = true;
			cell.exitsLeft = 1;
			cell.exitDirection = 0;
		},
		addEnemies:(fromArea,type,at,enemyset)=>{
			let
				usedCells = [],
				walls;

			if (exits[fromArea]) {
				walls = getWalls(fromArea, random.element(exits[fromArea]));
			} else {
				walls = getWalls(fromArea, random.element(entrances[fromArea])).reverse();
			}

			if (walls.length >= at.length) {
				
				at.forEach(instruction=>{
					if (instruction.atDeadEnds) {
						let
							deadEnds = getDeadEndWalls(fromArea, usedCells);

						for (let i=0;i<instruction.atDeadEnds;i++) {
							if (deadEnds.length) {
								let
									deadend = random.removeElement(deadEnds),
									wall = random.element(deadend),
									newEnemy = clone(enemyset[instruction.level]);

								newEnemy.generatedBy = [ enemyset[instruction.level] ];
								newEnemy.id = ENEMIES_ID;

								newEnemy.isFillerEnemy = true;
								newEnemy.isEnemy = true;
								newEnemy.type = type;
								setWall(wall.cell, wall.direction, newEnemy);
							}
						}
					} else {
						let
							index = Math.floor(instruction.at*(walls.length-1)),
							cellWall = walls.splice(index,1)[0],
							wall = random.element(cellWall),
							newEnemy = clone(enemyset[instruction.level]);

						newEnemy.generatedBy = [ enemyset[instruction.level] ];
						newEnemy.id = ENEMIES_ID;

						usedCells.push(wall.cell);
						newEnemy.type = type;
						newEnemy.isEnemy = true;
						setWall(wall.cell, wall.direction, newEnemy);
					}
				});

				return true;
			} else {
				debugger;
				return false;
			}
		},
		addScatter:(exit)=>{

			let
				isOk = true;

			toScatter.forEach(scatterData=>{
				let
					model = scatterData.model,
					walls = getWalls(-1,exit.wall.cell),
					validWalls = [],
					index;

				walls.forEach(set=>{
					set = set.filter(wall=>wall.cell.walls[wall.direction].isCrawlable);
					if (set.length)
						validWalls.push(set);
				})

				if (model.scatterUniformAmount) {

					let
						step = Math.floor(validWalls.length/(model.scatterUniformAmount+1));

					if (step && (step*model.scatterUniformAmount<=validWalls.length)) {
						for (let i=1;i<=model.scatterUniformAmount;i++) {
							let
								wall = random.element(validWalls[i*step]),
								scatter = generateFromModel(scatterData.generatedBy, model, "scatter", scatterData.interactionId, scatterData.resources, scatterData.keys, i, i>1);

							if (scatterData.scatteredBy)
								scatter.generatedBy.push(scatterData.scatteredBy);

							setWall(wall.cell, wall.direction, scatter);
							index+=step;
						}
					} else
						isOk = false;

				} else if (model.scatterAmount) {
					if (model.scatterAmount<=validWalls.length) {
						for (let i=1;i<=model.scatterAmount;i++) {
							let
								wall = random.element(random.removeElement(validWalls)),
								scatter = generateFromModel(scatterData.generatedBy, model, "scatter", scatterData.interactionId, scatterData.resources, scatterData.keys, i, i>1);

							if (scatterData.scatteredBy)
								scatter.generatedBy.push(scatterData.scatteredBy);

							setWall(wall.cell, wall.direction, scatter);
						}
					} else
						isOk = false;
				} else
					isOk = false;

			})

			return isOk;
		},
		addDoor:(exitbag, specialsbag, selectedspecials, inArea, fromArea, toArea, wallType, floorType, generatedby)=>{
			let
				options = getOptions(fromArea, true);

			if (options.length) {
				let
					pathModels = generatedby.data.path ? random.element(generatedby.data.path) : 0,
					lockModel = generatedby.data.lock ? random.element(generatedby.data.lock) : 0,
					scatterModel = generatedby.data.scatter ? random.element(generatedby.data.scatter) : 0,
					exitLockModel = generatedby.data.exitLock ? random.element(generatedby.data.exitLock) : 0,
					wall,
					usedCells = [],
					resources = {},
					keys = {},
					option = random.element(options),
					destCell = dungeon.addCell(toArea,option.from.x+option.to.x,option.from.y+option.to.y,wallType, floorType);

				dungeon.joinCells(option.from,destCell,option.to.direction);
				destCell.exitsLeft = random.bagPick(exitbag);

				if (!exits[fromArea])
					exits[fromArea] = [];
				if (!entrances[toArea])
					entrances[toArea] = [];

				exits[fromArea].push(option.from);
				entrances[toArea].push(destCell);

				interactionId++;

				if (pathModels) {
					let
						isOk = true;

					pathModels.forEach((levermodel,subid)=>{
						if (isOk) {
							let
								walls,
								lever = generateFromModel(generatedby, levermodel, "lever", interactionId, resources, keys);

							if (lever.setInteraction)
								lever.setInteraction = { id:interactionId, isFlipped:true };

							if (lever.newInteraction)
								interactionId++;

							walls = getWalls(inArea + (lever.atArea || 0), option.from, usedCells);
							if (walls.length) {
								wall = getRandomFarWall(walls, 2);
								usedCells.push(wall.cell);
								setWall(wall.cell, wall.direction, lever);
							} else
								isOk = false;
						}
					});

					if (!isOk)
						return false;

				}

				if (lockModel) {
					let
						lock = generateFromModel(generatedby, lockModel, "lock", interactionId, resources, keys);

					if (lock.newInteraction)
						interactionId++;

					if (lock.mergeGateWith)
						lock.mergeGateWith = generateFromModel(generatedby, lock.mergeGateWith, "mergedlock", interactionId, resources, keys);

					destCell.floor = { id:"gate-"+interactionId, type:destCell.floor.type, sortByPlace:true }; // Makes this gate unique, not merged with other gates.
					if (lock.keepOriginalGate) {
						dungeon.setGateFlag(option.from, destCell, {
							interactionId:interactionId,
							addInteractionConditions:lock.addInteractionConditions,
							addInteractionConditionsVersions:lock.addInteractionConditionsVersions,
							addOverallCondition:lock.addOverallCondition,
							mergeWith:lock,
							resources:resources
						} ); 
					} else
						dungeon.setGateFlag(option.from, destCell, { interactionId:interactionId, replaceWith:lock } );
				}

				if (scatterModel)
					toScatter.push({ generatedBy:generatedby, model:scatterModel, interactionId:interactionId, resources:resources, keys:keys });

				if (exitLockModel)
					toExitLocks.push({ generatedBy:generatedby, model:exitLockModel, interactionId:interactionId, resources:resources, keys:keys });

				if (generatedby.data.specialsAmount)
					for (let i=0;i<generatedby.data.specialsAmount;i++) {
						let
							special = random.bagPick(specialsbag);
						interactionId++;
						selectedspecials.push(special);
						toScatter.push({ scatteredBy:generatedby, generatedBy:special, model:special, interactionId:interactionId, resources:{}, keys:{} });
					}

				return true;

			} else {
				return false;
			}

		},
		crawl:(exitbag, fromArea, toArea, wallType, floorType)=>{
			let
				oldoptions = getOptions(fromArea),
				options;

			options = oldoptions.filter(cell=>cell.from.isStartingCell || (cell.from.exitsLeft>0))

			if (options.length) {
				let
					option = random.element(options),
					destCell;

				if (option.from.exitsLeft)
					option.from.exitsLeft--;
				destCell = dungeon.addCell(toArea,option.from.x+option.to.x,option.from.y+option.to.y,wallType, floorType);
				dungeon.joinCells(option.from,destCell,option.to.direction);
				destCell.exitsLeft = random.bagPick(exitbag);

				return true;

			} else {
				return false;
			}

		}
	}
}
