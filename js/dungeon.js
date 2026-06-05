
function Dungeon(settings, random) {

	const
		COLORS = [ "#fff", "#cff", "#fcf", "#fcc", "#ffc" ],
		DEBUG_CELLSIZE = 30;

	let
		bounds = {x1:0,y1:0,x2:0,y2:0},
		grid = [],
		cells = [],
		ids = [],
		allIds = [],
		gateFlagsIndex = {}
		gateFlags = [];

	for (let i=0;i<settings.ids.length;i++) {
		ids.push(settings.ids[i]);
		allIds.push(settings.ids[i]);
	}

	random.shuffle(ids);
	ids.push("A");

	function getCell(x,y) {
		if (grid[y])
			return grid[y][x];
		else
			return 0;
	}

	function clone(a) {
		return JSON.parse(JSON.stringify(a));
	}

	function addCell(area,x,y,wallType,floorType) {

		let
			cell;

		if (cell = getCell(x,y)) {
			return cell;
		} else {

			cell = {
				id: ids.pop(),
				area:area,
				x:x,
				y:y,
				walls:[],
				exits:[ 0, 0, 0, 0 ],
				marks:{},
				floor:clone(floorType)
			};

			for (let i=0;i<4;i++) {
				let
					wall = clone(wallType);
				wall.optimizeWallPosition = true;
				cell.walls.push(wall);
			}

			if (!grid[y])
				grid[y] = [];

			grid[y][x] = cell;

			if (x<bounds.x1)
				bounds.x1 = x;
			if (x>bounds.x2)
				bounds.x2 = x;
			if (y<bounds.y1)
				bounds.y1 = y;
			if (y>bounds.y2)
				bounds.y2 = y;

			cells.push(cell);

			return cell;

		}
	}

	function joinCells(cell1,cell2,direction) {
		let
			opposite = (direction+2)%4;
		cell1.walls[direction] = 0;
		cell1.exits[direction] = cell2;
		cell2.walls[opposite] = 0;
		cell2.exits[opposite] = cell1;
	}

	function debugWallType(wall) {
		if (wall.type.indexOf("biomeExit") != -1) {
			return "#0ff";
		} else if (wall.type.length>1) {
			return "#f00";
		} else {
			return "#000";
		}
	}

	function stats() {
		let
			stats = { cells:0, enemies:0, fillerEnemies:0, activityCells:0, noActivityCells: 0, minActivities:-1, maxActivities:-1, activitiesMap:[] };
		cells.forEach(cell=>{
			let
				activities = 0;
			stats.cells++;
			cell.walls.forEach(wall=>{
				if (wall) {
					let
						activityWall = wall.type.filter(t=>t!="biomeWall");
					if (activityWall.length)
						activities++;
					if (wall.isEnemy)
						stats.enemies++;
					if (wall.isFillerEnemy)
						stats.fillerEnemies++;
				}
			})
			if (activities) {
				stats.activityCells++;
				if ((stats.minActivities == -1) || (activities<stats.minActivities))
					stats.minActivities = activities;
				if ((stats.maxActivities == -1) || (activities>stats.maxActivities))
					stats.maxActivities = activities;
				if (!stats.activitiesMap[activities])
					stats.activitiesMap[activities] = 0;
				stats.activitiesMap[activities]++;
			} else
				stats.noActivityCells++;
		});

		stats.activityRatio = stats.activityCells / stats.cells;
		return stats;
	}

	function debug() {
		let
			sides = ["top", "right", "bottom", "left"],
			html="<table>";

		for (let y=bounds.y1;y<=bounds.y2;y++) {
			html+="<tr>";
			for (let x=bounds.x1;x<=bounds.x2;x++) {
				let
					title = "",
					cell = getCell(x,y);

				html+="<td style='width:"+DEBUG_CELLSIZE+"px;height:"+DEBUG_CELLSIZE+"px;text-align:center;line-height:"+DEBUG_CELLSIZE+"px;"+
					(cell && cell.marks._debug?"color:"+cell.marks._debug+";font-weight:bold;":"")+
					"background-color:";

				if (cell && cell.marks && cell.marks._debug)
					console.log("DEBUG CELL:",cell);

				if (cell) {
					title = "Area: "+cell.area;
					if (cell.floor.id) {
						title+=" ["+cell.floor.id+"]"
					}
					title+="\n";
					for (let k in cell.marks)
						title+="Mark: "+k+": "+cell.marks[k]+"\n";
					html+=(cell.isStartingCell ? "#0f0" : COLORS[cell.area])+";";

					cell.walls.forEach((wall,id)=>{
						if (wall) {
							let
								validTypes;
							html+="border-"+sides[id]+":4px solid "+debugWallType(cell.walls[id])+";";
							validTypes = wall.type.filter(t=>t!="biomeWall");
							if (validTypes.length)
								title+=sides[id]+": "+(wall.isFillerEnemy ? "[FILLER] " : "") + validTypes.join(",")+": "+(wall.generatedBy.map(a=>a.description).join(", "))+"\n";
						}
					})

					html+="' title='"+title+"'>";
					if (cell.floor.id)
						html+="<span style='display:inline-block;background-color:#000;color:#fff;width:20px;height:20px;line-height:20px'>";
					html+=cell.id;
					if (cell.floor.id)
						html+="</span>";
					html+="</td>";
				} else {
					html+=";border:1px solid #ccc'></td>";
				}
			}
			html+="</td>";
		}
		html+="</table>";
		return html;
	}

	function setGateFlag(from, to, flag) {
		let
			id = from.id+":"+to.id;

		if (gateFlagsIndex[id]) {
			debugger;
		} else {
			gateFlags.push({ from:from, to:to, flag:flag });
		}

	}

	function findRouteToMark(cell, mark, value, area, data, result) {
		if (!data) {
			data = {
				path:[ { direction:-1, cell:cell } ],
				index:{},
				prevdirection:-1,
				found:0
			}
			result = {};
		}
		if (cell.marks[mark] == value) {
			data.found = cell;
			result.data = data;
		} else {
			if ((data.index[cell.id] === undefined) || (data.index[cell.id]>data.path.length)) {
				data.index[cell.id] = data.path.length;
				cell.exits.forEach((exit, direction)=>{
					if (exit && (exit.area <= area)) {
						let
							newData = {
								path:[...data.path],
								index:data.index,
								prevdirection:direction
							};

						newData.path.push({ direction:direction, cell:exit });

						findRouteToMark(exit, mark, value, area, newData, result);
					}
				})
			}
		}
		return result.data;
	}

	return {
		grid:grid,
		bounds:bounds,
		cells:cells,
		gateFlags:gateFlags,
		allIds:allIds,
		ids:ids,
		getCell:(x,y)=>{
			return getCell(x,y)
		},
		addCell:(area,x,y,wallType,floorType)=>{
			return addCell(area,x,y,wallType,floorType);
		},
		joinCells:(cell1,cell2,direction)=>{
			return joinCells(cell1,cell2,direction);
		},
		setGateFlag:(from,to,flag)=>{
			setGateFlag(from,to,flag);
		},
		findRouteToMark:(cell, mark, value, area)=>{
			return findRouteToMark(cell, mark, value, area);
		},
		debug:()=>{
			return debug(); 
		},
		stats:()=>{
			return stats();
		}
	}

}
