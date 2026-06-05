function Deck(seed, languagedata, settings, gameprogress, gamedata, resources, random, randomCode, dungeon, subjects, verbs, postprocess) {

	const
		CAMERAS = [
			[
				{ direction:3, x:-1, y:0 }, { direction:0, x:0, y:-1 }, { direction:1, x:1, y:0 }, { direction:2, x:0, y:1 }
			],[
				{ direction:0, x:0, y:-1 }, { direction:1, x:1, y:0 }, { direction:2, x:0, y:1 }, { direction:3, x:-1, y:0 }
			],[
				{ direction:1, x:1, y:0 }, { direction:2, x:0, y:1 }, { direction:3, x:-1, y:0 }, { direction:0, x:0, y:-1 }
			],[
				{ direction:2, x:0, y:1 }, { direction:3, x:-1, y:0 }, { direction:0, x:0, y:-1 }, { direction:1, x:1, y:0 }
			]
		],
		APIS = {
			setAnswer:(id, data)=>{
				if (!answers[id])
					answers[id] = {};

				for (let k in data)
					answers[id][k] = data[k];
			},
			getValidCamerasForCell:(cell)=>{
				return getValidCamerasForCell(cell);
			},
			getCameraFromCell:(cell, camera)=>{
				return getCameraFromCell(cell, camera, false);
			},
			getCardBox:(card, id)=>{
				return getCardBox(card, id);
			},
			findCards:(tags, excludetags, except)=>{
				return findCards(tags, excludetags, except);
			},
			findCard:(tags, excludetags, except)=>{
				return findCards(tags, excludetags, except)[0];
			},
			applyBoxesToCard:(cell, boxes, card)=>{
				return applyBoxesToCard(0, boxes, card, cell, 0, card.atAnyPlace, card.interactionId);
			}
		};

	let
		memory = {},
		answers = {},
		interactions = {},
		meta = { startingCamera:0 },
		deck = [];

	function findCards(tags, excludetags, except) {

		let
			out = [];

		deck.forEach(card=>{

			if (!except || (except.indexOf(card) == -1)) {

				let
					found = true;

				tags.forEach(tag=>{
					if (card.tags.indexOf(tag) == -1)
						found = false;
				})

				if (excludetags)
					excludetags.forEach(tag=>{
						if (card.tags.indexOf(tag) != -1)
							found = false;
					})

				if (found)
					out.push(card);

			}
		})

		return out;
	}

	function getWallCard(direction, except) {
		let
			card = requireWall(0, direction, { type:[ "biomeWall" ], optimizeWallPosition:true }, 0, except);
		return card;
	}

	function structureToTags(structure, direction, chunk, uselinks) {
		let
			tags = [];

		if (structure.id)
			tags.push("id:"+structure.id);
		else
			tags.push("id:none");
		if (settings.optimizeWallPosition && structure.optimizeWallPosition) {
			// Keep these walls at the same position (i.e. keep a wall forward as position 1, etc.)
			// Optimized for 3 walls!
			if (direction < 2)
				tags.push("wallorientation:"+direction);
			else
				tags.push("wallorientation:extra");
		}
		if (structure.tags)
			tags = tags.concat(structure.tags);
		if (uselinks && settings.linkCardsToChunk && (chunk !== undefined))
			tags.push("chunk:"+chunk);
		if (structure.type)
			tags.push("type:"+structure.type.join(":"));
		if (structure.view)
			tags.push("direction:"+structure.view.from+":"+structure.view.to);
		return tags;
	}

	function getCardBox(card, id) {
		if (card.boxById[id])
			return card.boxById[id];
		else {
			let
				box = { id:id, index:{}, items:[], uniques:{} };
			card.boxById[id] = box;
			card.boxes.push(box);
			return box;
		}
	}

	function addCardBoxDirection(card, from, to, direction) {
		let
			box = getCardBox(card, "move"),
			id = from.id+":"+to.id,
			tag = "move:"+id;

		if (card.tags.indexOf(tag) == -1)
			card.tags.push(tag);

		if (!box.index[id]) {
			box.index[id] = true;
			box.items.push({ from:from, to:to, direction:direction });
		}

	}

	function getFakePlace(exclude) {
		let
			fakeId,
			fakeIds = [];

		dungeon.allIds.forEach(id=>{
			if (exclude.indexOf(id) == -1)
				fakeIds.push(id);
		})

		fakeId = random.element(fakeIds);
		exclude.push(fakeId);

		return { id:fakeId };
	}

	function applyBoxesToCard(generatedby,boxes,card,from,destination,atanyplace,interaction) {
		if (card.origins.indexOf(from) == -1)
			card.origins.push(from);
		if (card.destinations.indexOf(destination) == -1)
			card.destinations.push(destination);

		for (let k in boxes) {
			let
				box = getCardBox(card, k);

			if ((box.items.length == 0) || !atanyplace) {
				
				boxes[k].forEach(line=>{
					let
						addline = true;

					if (line.id)
						if (box.uniques[line.id])
							addline = false;
						else
							box.uniques[line.id] = true;

					if (addline) {
						line.generatedBy = generatedby;
						line._origin = from;
						line._destination = destination;
						if (!atanyplace && !line.atAnyPlace)
							line.from = from;
						if (line.ifInteractions !== undefined)
							line.ifInteractions = line.ifInteractions.map(i=>interaction + i);
						box.items.push(line);
					}
				})
			}
		}
	}

	function requireJoint(from, direction, chunk, structure, excludetags, suggesttags, fromtag, except) {

		let
			tags = structureToTags(structure, direction, chunk, true),
			cards = findCards(tags, excludetags, except);

		// If the required card is a joint...
		// Exclude cards that reached the directions limit...

		cards = cards.filter(card=>{
			return (!card.boxById["move"] || (card.boxById["move"].items.length<settings.directionsPerJoint));
		})

		if (settings.avoidFromCardInDirections)
			cards = cards.filter(card=>card.tags.indexOf(fromtag)==-1);

		if (settings.suggestFromCardInDirections) {
			let
				suggested = [];

			// Suggest the same card it's coming from...
			if (fromtag)
				suggested = cards.filter(card=>card.tags.indexOf(fromtag));

			// ...or suggests the cards adjacent...
			if (!suggested.length && suggesttags.length) {
				suggested = cards.filter(card=>{
					let
						isOk = false;
					suggesttags.forEach(tag=>{
						if (card.tags.indexOf(tag) != -1)
							isOk = true;
					})
					return isOk;
				});
			}

			if (suggested.length)
				cards = suggested;
		}

		// Get the card with the less directions, so joint cards are evenly filled.

		cards.sort((a,b)=>{
			let
				v1 = a.boxById["move"] ? a.boxById["move"].items.length : 0,
				v2 = b.boxById["move"] ? b.boxById["move"].items.length : 0;

			if (v1>v2)
				return 1;
			else if (v1<v2)
				return -1;
			else
				return 0;
		});

		return satisfyRequirement(cards[0], tags, from, direction, structure, excludetags, except);
	}

	function requireWall(from, direction, structure, excludetags, except) {
		let
			tags = structureToTags(structure, direction),
			cards = findCards(tags, excludetags, except),
			card = cards[0];

		if (!card && structure.optimizeWallPosition && settings.noWallCards) {
			return { noCard:true };
		}

		// Manages a unique case: when both east and south walls are needed with optimizeWallPosition it creates a
		// wallorientation:extra wall copy as there aren't walls to reuse. It should happen on A only.
		if (!card && settings.optimizeWallPosition && (direction == 3) && (from.id =="A")) {
			// Look for the wallorientation:extra in the exception list
			let
				usedSides = {};

			except.forEach(card=>{
				card.tags.forEach(tag=>{
					if (tag.startsWith("wallorientation:"))
						usedSides[tag.substr(16)] = true;
				})
			});

			if (usedSides["extra"]) {
				// If it's there, uses the missing wall
				if (!usedSides["0"])
					return requireWall(from, 0, structure, excludetags, except);
				else if (!usedSides["1"])
					return requireWall(from, 1, structure, excludetags, except);
				else {
					// Something is wrong...
					debugger;
				}
			} else
				// ...else, create the new wall
				card = 0;
		}

		return satisfyRequirement(card, tags, from, direction, structure, excludetags, except);

	}

	function satisfyRequirement(card, tags, from, direction, structure, excludetags, except) {
		if (!card) {
			card = {
				index:deck.length,
				id:structure.id,
				version:0,
				type:structure.type,
				decorations:structure.decorations,
				flipType:structure.flipType,
				flipDecorations:structure.flipDecorations,
				isInstant:structure.isInstant,
				isAggregate:structure.isAggregate,
				sortByPlace:structure.sortByPlace,
				atAnyPlace:structure.atAnyPlace,
				isCentered:structure.isCentered,
				multiColumn:structure.multiColumn,
				isExit:structure.isExit,
				_exit:structure._exit,
				subplaces:structure.subplaces,
				code:structure.code,
				codeUuid:structure.codeUuid,
				resources:structure.resources,
				interactionId:structure.interactionId,
				keys:structure.keys,
				references:0,
				origins:[],
				generatedBy:[],
				destinations:[],
				tags:tags,
				boxById:{},
				boxes:[]
			}
			deck.push(card);
		}

		if (structure.generatedBy)
			structure.generatedBy.forEach(generatedby=>{
				if (card.generatedBy.indexOf(generatedby) == -1)
					card.generatedBy.push(generatedby);
			});

		if (structure.boxes) {
			applyBoxesToCard(structure.generatedBy,structure.boxes, card, from, from.exits[direction], structure.atAnyPlace,structure.setInteraction ? structure.setInteraction.id : structure.interactionId);
			structure.boxes = 0;
		}

		if (structure.setInteraction) {
			if (structure.setInteraction.isFlipped) {
				interactions[structure.setInteraction.id] = [
					{ card:card, version:1 },
					{ card:card, version:0 }
				];
			}
			structure.setInteraction = 0;
		}

		return card;
	}

	function getValidCamerasForCell(cell,forced) {
		let
			cameras = [];

		CAMERAS.forEach((camera,id)=>{
			let
				opposite = (id+2)%4;

			if ((forced && (forced.indexOf(id)!= -1)) || (!cell.walls[opposite]))
				cameras.push({ direction:id, camera:camera });
		});

		return cameras;
	}

	function generateJointsForCell(cell, forced) {

		let
			cameras,
			avoidTags = [],
			suggestTags = [];

		cell.exits.forEach(exit=>{
			if (exit)
				if (settings.avoidFromCardInDirections)
					avoidTags.push("from:"+exit.id);
				else if (settings.suggestFromCardInDirections)
					suggestTags.push("from:"+exit.id);
		})

		if (settings.doNotReuseStartingCard)
			avoidTags.push("doNotReuse");

		cameras = getValidCamerasForCell(cell, forced);

		return cameras.map(camera=>{
			let
				set = [];

			camera.camera.forEach((view,viewId)=>{
				let
					direction = view.direction,
					card;

				if (cell.walls[direction])  // Create walls ASAP to create initial setup (A1234, facing North)
					card = requireWall(cell, viewId, cell.walls[direction], [], set);
				else if (cell.exits[direction]) {
					let
						cards,
						fromTag = "from:"+cell.id,
						exit = cell.exits[direction];

					// Look for joint card
					cards = findCards([ "move:"+cell.id+":"+exit.id ]);

					if (cards.length) {
						card = cards[0];
					} else {
						// Create a new joint card
						card = requireJoint(cell, viewId, Math.floor(cell.area/2), exit.floor, avoidTags, suggestTags, fromTag, set);
						card.tags.push(fromTag);
						addCardBoxDirection(card, cell, exit, direction );
					}
				}

				set.push(card);

			})

			return set;

		});
	}

	function getCameraFromCell(cell, camera, addreference) {
		let
			out = [];

		camera.forEach((view,viewId)=>{
			let
				cameraDirection = view.direction,
				cards,
				card;

			if (cell.walls[cameraDirection]) 
				card = requireWall(cell, viewId, cell.walls[cameraDirection], [], out);
			else if (cell.exits[cameraDirection]) {
				cards = findCards([ "move:"+cell.id+":"+cell.exits[cameraDirection].id ], 0, out);
				if (cards.length) {
					card = cards[0];
				} else {
					debugger;
				}
			}
			out.push(card);
			if (addreference)
				card.references++;
		})

		return out;
	}

	function findJoint(from, to) {
		let
			cards = findCards([ "move:"+from.id+":"+to.id ]);
		return cards[0];
	}

	function applyGateFlags() {
		dungeon.gateFlags.forEach(flag=>{
			let
				card = findJoint(flag.from, flag.to);

			if (card) {

				if (flag.flag.replaceWith) {
					// Remap movement card with a wall
					let
						replacement = flag.flag.replaceWith,
						gateCard;

					// Create the gate card with the same index
					gateCard = {
						index:card.index,
						id:card.id,
						version:card.version,
						type:replacement.type,
						decorations:replacement.decorations,
						references:card.references,
						_exit:card._exit,
						atAnyPlace:replacement.atAnyPlace,
						isInstant:replacement.isInstant,
						isAggregate:replacement.isAggregate,
						subplaces:replacement.subplaces,
						resources:replacement.resources,
						interactionId:replacement.interactionId,
						origins:[...card.origins],
						generatedBy:[...card.generatedBy],
						destinations:[...card.destinations],
						code:replacement.code,
						codeUuid:replacement.codeUuid,
						keys:replacement.keys,
						tags:[ "gate-"+flag.flag.interactionId ],
						boxById:{},
						boxes:[]
					};

					if (replacement.generatedBy) {
						replacement.generatedBy.forEach(generatedby=>{
							if (card.generatedBy.indexOf(generatedby) == -1)
								card.generatedBy.push(generatedby);
							if (gateCard.generatedBy.indexOf(generatedby) == -1)
								gateCard.generatedBy.push(generatedby);
						});
					}

					card.tags.push("aftergate-"+flag.flag.interactionId);
					card.references = 0;

					if (replacement.boxes) {
						applyBoxesToCard(replacement.generatedBy, replacement.boxes, gateCard, flag.from, flag.to, replacement.atAnyPlace, flag.flag.interactionId);
						replacement.boxes = 0;
					}

					deck.push(gateCard);

					// Change the joint card version
					card.version++;

					// Create a new swap card interaction, to be linked by other cards
					interactions[flag.flag.interactionId] = [
						{ card:gateCard, version:gateCard.version, toCard:card, toVersion:card.version },
						{ card:card, version:card.version, toCard:gateCard, toVersion:gateCard.version }
					];

					if (replacement.mergeGateWith) {
						if (replacement.mergeGateWith.generatedBy)
							replacement.mergeGateWith.generatedBy.forEach(generatedby=>{
								if (card.generatedBy.indexOf(generatedby) == -1)
									card.generatedBy.push(generatedby);
							})
						if (replacement.mergeGateWith.type)
							card.type = replacement.mergeGateWith.type;
						if (replacement.mergeGateWith.boxes) {
							applyBoxesToCard(replacement.mergeGateWith.generatedBy, replacement.mergeGateWith.boxes, card, flag.from, flag.to, card.atAnyPlace, flag.flag.interactionId);
							replacement.mergeGateWith.boxes = 0;
						}
					}
				}

				if (flag.flag.mergeWith) {
					if (flag.flag.mergeWith.generatedBy)
						flag.flag.mergeWith.generatedBy.forEach(generatedby=>{
							if (card.generatedBy.indexOf(generatedby) == -1)
								card.generatedBy.push(generatedby);
						})
					if (flag.flag.mergeWith.type)
						card.type = flag.flag.mergeWith.type;
					if (flag.flag.mergeWith.boxes) {
						applyBoxesToCard(flag.flag.mergeWith.generatedBy,flag.flag.mergeWith.boxes, card, flag.from, flag.to, card.atAnyPlace, flag.flag.interactionId);
						flag.flag.mergeWith.boxes = 0;
					}
				}

				if (flag.flag.addInteractionConditions) {
					card.boxes.forEach(box=>{
						box.items.forEach(item=>{
							item.ifInteractions = flag.flag.addInteractionConditions.map(id=>flag.flag.interactionId+id);
							item.ifInteractionVersions = flag.flag.addInteractionConditionsVersions;
						})
					})
				}

				if (flag.flag.addOverallCondition) {
					card.boxes.forEach(box=>{
						box.items.forEach(item=>{
							if (!item.skipOverallCondition)
								item.condition = (item.condition ? item.condition+" " : "") + flag.flag.addOverallCondition;
						})
					})
				}

			} else {
				debugger;
			}

		})
	}

	function createGateCardFor(generatedby, card, item, subplace, replace) {
		let
			gateCard = {
				index:replace ? card.index : deck.length,
				id:"subplacecard-"+card.id,
				version:replace ? card.version : 0,
				type:subplace.type,
				decorations:subplace.decorations,
				atAnyPlace:subplace.atAnyPlace,
				isInstant:subplace.isInstant,
				isAggregate:subplace.isAggregate,
				subplaces:subplace.subplaces,
				interactionId:subplace.interactionId,
				code:subplace.code,
				codeUuid:subplace.codeUuid,
				isCentered:subplace.isCentered,
				isExit:subplace.isExit,
				references:1,
				origins:[...card.origins],
				generatedBy:[...card.generatedBy],
				destinations:[...card.destinations],
				tags:[ "subplace" ],
				boxById:{},
				boxes:[]
			};

		if (generatedby)
			generatedby.forEach(generatedby=>{
				if (gateCard.generatedBy.indexOf(generatedby) == -1)
					gateCard.generatedBy.push(generatedby);
			});

		if (subplace.boxes) {
			applyBoxesToCard(generatedby, subplace.boxes, gateCard, item._origin, item._destination, subplace.atAnyPlace, item.interactionId);
			subplace.boxes = 0;
		}

		deck.push(gateCard);

		if (replace) {
			card.version++;
		}

		return gateCard;
	}

	function solveBoxesForCard(card) {
		let
			cardPlacesIndex = {},
			cardPlaces = [];

		card.boxes.forEach(box=>{
			box.items.forEach(item=>{
				if (item.from && !cardPlacesIndex[item.from.id]) {
					cardPlacesIndex[item.from.id] = 1;
					cardPlaces.push(item.from.id);
				}
			})
		});

		card.boxes.forEach(box=>{
			box.items.forEach(item=>{
				if (item._debug)
					debugger;

				if (item.to)
					item.camera = getCameraFromCell(item.to, CAMERAS[item.direction], true);
				
				if (item.lockExitWithSubplace && !interactions[card.interactionId]) {
					let
						exit = deck.filter(card=>card.isExit)[0],
						gateCard = createGateCardFor(item.generatedBy, exit, item, card.subplaces[item.lockExitWithSubplace], true);

					item.generatedBy.forEach(generatedby=>{
						if (exit.generatedBy.indexOf(generatedby) == -1)
							exit.generatedBy.push(generatedby);
					})

					interactions[card.interactionId] = [
						{ card:gateCard, version:gateCard.version, toCard:exit, toVersion:exit.version },
						{ card:exit, version:exit.version, toCard:gateCard, toVersion:gateCard.version }
					];

					solveBoxesForCard(gateCard);
				}

				if (item.interactionId) {
					if (item._debug) debugger;
					let
						version =  interactions[item.interactionId][item.interactionVersion || 0];
					item.card = version.card;
					item.toCard = version.toCard;
				}

				if (item.ifInteractions) {
					item.ifInteractions = item.ifInteractions.map((i,pos)=>{
						let
							interaction = interactions[i][item.ifInteractionVersions ? item.ifInteractionVersions[pos] || 0 : 0];
						if (interaction)
							return interaction;
						else {
							console.error("Can't find interaction",i);
							return 0;
						}
					});
				}

				if (item.atFakePlace)
					item.from = getFakePlace(cardPlaces);

				if (item.teleportToRandomPlace || item.teleportToGhost) {
					let
						cells = dungeon.cells.filter(cell=>!cell.isStartingCell && (cell !==item._origin) && (cell.area <= item._origin.area) && (cell.exits.indexOf(cell) == -1)),
						cell = random.element(cells),
						cameras = getValidCamerasForCell(cell),
						camera = random.element(cameras);

					item.to = cell;
					item.camera = getCameraFromCell(cell, camera.camera, false);
					item.direction = camera.direction;

					if (item.teleportToGhost) {
						let
							ghostCard = createGateCardFor(item.generatedBy, card, item, card.subplaces[item.teleportToGhost]),
							ghostWalls = [];
						camera.camera.forEach((side,id)=>{
							if (cell.walls[side.direction])
								ghostWalls.push(id);
						})

						if (ghostWalls.length) {
							item.camera[random.element(ghostWalls)] = ghostCard;
							solveBoxesForCard(ghostCard);
						} else {
							// It shouldn't happen!
							debugger;
						}
					}
				}

				if (item.replaceWithSubplace) {
					let
						subplaceCard;

					// Create the subplace card				
					subplaceCard = createGateCardFor(item.generatedBy, card, item, card.subplaces[item.replaceWithSubplace]);

					subplaceCard.index = card.index;
					subplaceCard.version = card.version+2;

					if (interactions[card.interactionId]) {
						interactions[card.interactionId][0].card = subplaceCard;
						interactions[card.interactionId][0].version = subplaceCard.version;
						interactions[card.interactionId][1].toCard = subplaceCard;
						interactions[card.interactionId][1].toVersion = subplaceCard.version;
					}

					solveBoxesForCard(subplaceCard);

					item.card = card;
					item.toCard = subplaceCard;
				}

				if (item.teleportToSubplace) {
					let
						id = dungeon.ids.length ? random.removeElement(dungeon.ids) : "?",
						walls = [0,1,2],
						except = [],
						gateCard;

					// Create the subplace card				
					gateCard = createGateCardFor(item.generatedBy, card, item, card.subplaces[item.teleportToSubplace]);

					// Create the secluded room

					walls = walls.map(direction=>{
						let
							card = getWallCard(direction, except);
						except.push(card);
						return card;
					});

					item.to = { id:id };
					item.camera = [
						walls[0],
						gateCard,
						walls[1],
						walls[2]
					];

					// Solve the just generated card
					solveBoxesForCard(gateCard);

				}

				if (item.unlockExit) {
					let
						cardVersion = card.version,
						trueExit = createGateCardFor(item.generatedBy, card, item, card._exit, true),
						trueExitVersion = card.version;

					trueExit.version = trueExitVersion;
					card.version = cardVersion;

					item.card = card;
					item.toCard = trueExit;
				}

			})
			
            if (card.sortByPlace)
                box.items.sort((a,b)=>{
                    if (!a.from && !b.from)
                        return 0;
                    else if (a.from && !b.from)
                        return 1;
                    else if (!a.from && b.from)
                        return -1;
                    else if (a.from.id > b.from.id)
                        return 1;
                    else if (a.from.id < b.from.id)
                        return -1;
                    else
                        return 0;
                })
		})

	}

	function debug() {
		let
			VERSIONS = [ "A", "B", "C", "D" ],
			html = dungeon.cells.length+" rooms / "+deck.length+" cards<br><table>";

		deck.forEach(card=>{
			html+="<tr><td style='vertical-align:top"+(card.isSpecial ? ";font-weight:bold" : "")+"'>";
			html+=+card.setIndex+(card.setSymbol == -1 ? "" : "/"+card.setSymbol)+"&lt;"+VERSIONS[card.version]+"&gt; "+card.type.join(", ")+(card.decorations && card.decorations.length ? " (Decorations: "+card.decorations.join(", ")+")":"")+"<br>"
			if (card.isExit)
				html+="<b>EXIT CARD</b><br>";
			html+="<i>"+card.references+" refs.</i>";
			html+="</td><td style='vertical-align:top'>";
			card.generatedBy.forEach(item=>{
				html+="<div style='background-color:#ccc'>"+item.description+"</div>";
			})
			card.boxes.forEach(box=>{
				html+="<b>"+box.id+"</b><br>";
				box.items.forEach(item=>{
					html+="<b>";
					if (item.from)
						html+=item.from.id+": ";
					if (item.ifInteractions)
						html+=item.ifInteractions.map(i=>i.card.index+VERSIONS[i.version]).join(", ")+": ";
					if (item.condition)
						html+=item.condition+" ";
					html+="</b>";
					if (item.line)
						html+=item.line;
					if (item.cutout)
						html+="[CUTOUT:"+item.cutout+"]";
					if (item.card)
						html+="<i>(Swap "+item.card.index+VERSIONS[item.card.version]+" &raquo; "+item.toCard.index+VERSIONS[item.toCard.version]+")</i>";
					if (item.to) {
						html+="->"+item.to.id+" (";
						item.camera.forEach(destcard=>{
							if (destcard.noCard)
								html+="-,";
							else if (destcard.index == card.index)
								html+="<b>["+destcard.setIndex+(card.setSymbol == -1 ? "" : "s"+card.setSymbol)+"]</b>,";
							else
								html+=destcard.setIndex+(card.setSymbol == -1 ? "" : "s"+card.setSymbol)+",";
						})
						html+=")";
					}
					html+="<br>";
				});
			})
			html+="<br><span style='font-size:10px'><i>"+card.tags.join(", ")+"</i></span>";
			html+="</td></tr>";
		})

		html+="</table>";
		return html;
	}

	return {
		cards:deck,
		meta:meta,
		answers:answers,
		build:()=>{
			dungeon.cells.forEach(cell=>{
				let
					forced = [],
					cameras;

				// Force north for game start. No longer needed as the
				// dungeon entrance is now a corridor to the north but
				// it may change... ;)
				if (cell.id == "A")
					forced.push(0);

				cameras = generateJointsForCell(cell, forced);

				if (!meta.startingCamera) {
					meta.startingCamera = cameras[0];
					meta.startingCamera.forEach(card=>{
						if (!card.noCard) {
							card.isStartingCard = true;
							if (settings.doNotReuseStartingCard)
								card.tags.push("doNotReuse");
						}
					})
				}
			})

			applyGateFlags();

			deck.forEach(card=>{
				solveBoxesForCard(card);
			})
			
		},
		getMemory:()=>{
			return memory;
		},
		finalize:(prefix)=>{
			let
				counter = 0,
				indexCache = {},
				setIndex = [];

			deck.sort((a,b)=>{
				if (a.isStartingCard && !b.isStartingCard)
					return -1;
				else if (!a.isStartingCard && b.isStartingCard)
					return 1;
				else if (a.version > b.version)
					return 1;
				else if (a.version < b.version)
					return -1;
				else if (a.isExit && !b.isExit)
					return 1;
				else if (!a.isExit && b.isExit)
					return -1;
				else if (a.isSpecial > b.isSpecial)
					return -1;
				else if (a.isSpecial < b.isSpecial)
					return 1;
				else if (a.references > b.references)
					return -1;
				else if (a.references < b.references)
					return 1;
				else
					return 0;
			});

			deck.forEach(card=>{
				if (card.boxes)
					card.boxes.forEach(box=>{
						box.items.sort((a,b)=>{
							let
								pa = a.order || 0,
								pb = b.order || 0;
							if (pa > pb)
								return 1;
							else if (pa < pb)
								return -1;
							else
								return 0;
						})
					})
			});

			deck.forEach(card=>{
				let
					set;

				if (indexCache[card.index]) {
					set = indexCache[card.index];
				} else {
					set = { index:0, symbol:0 };
					
					switch (settings.setLogic) {
						case SETLOGIC_SIZE:{
							set.symbol = Math.floor(counter / settings.setSize);
							break;
						}
						case SETLOGIC_REFERENCES:{
							set.symbol = card.isStartingCard || (card.references > 5) ? 0 : 1;
							break;
						}
					}

					if (!setIndex[set.symbol])
						setIndex[set.symbol] = 0;
					setIndex[set.symbol]++;

					switch (settings.setMode) {
						case SETMODE_TENS:{
							set.index = setIndex[set.symbol]+((set.symbol+1)*10);
							set.symbol = -1;
							break;
						}
						case SETMODE_MIXED:{
							set.index = setIndex[set.symbol]+(set.symbol*10)-(set.symbol ? 1 : 0);
							break;
						}
						default:{
							set.index = setIndex[set.symbol];
						}
					}

					indexCache[card.index] = set;
					counter++;
				}

				card.setIndex = set.index;
				card.setSymbol = set.symbol;
				card.cardCode = prefix+"-"+card.setIndex+"-"+card.version;
			})

			deck.forEach(card=>{
				if (card.code) {
					let
						lastSeed;

					if (!memory[card.codeUuid])
						memory[card.codeUuid] = {};
					if (!gamedata[card.codeUuid])
						gamedata[card.codeUuid] = {};

					gamedata[card.codeUuid].processed = true;
					lastSeed = gamedata[card.codeUuid].lastSeed;

					let
						interface = {
							isNewSeed:!lastSeed || (lastSeed != seed),
							seed:seed,
							lastSeed:lastSeed,
							languageData:languagedata,
							memory:memory[card.codeUuid],
							persistentMemory:gamedata[card.codeUuid],
							progress:gameprogress,
							resources:resources,
							card:card,
							random:randomCode,
							deck:APIS,
							dungeon:dungeon,
							subjects:subjects,
							verbs:verbs
						};
					card.code(interface);
				}
			})

			if (postprocess)
				postprocess({
					deck:deck,
					dungeon:dungeon,
				});
		},
		debug:()=>{
			return debug();
		}
	}

}
