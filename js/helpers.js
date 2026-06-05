let HELPERS={
	// --- Manipulate existing box actions
	newBoxEditor:(I, card, interaction, keep)=>{
		let
			GUIDE_SIZE = 0.5,
			GUIDE_MARGIN = 4,
			GUIDE_TICKHEIGHT = 3,
			DOT_SIZE = 1,
			DOT_SPACING = 0.49,
			DOTAREA_SIZE = DOT_SIZE+DOT_SPACING*2,
			box = I.deck.getCardBox(card, interaction),
			models = box.items;

		if (!keep)
			box.items = [];

		function createDotMatrix(x,y,frames) {
			let
				image = "",
				framesCount = frames.length,
				frameWidth = frames[0].length,
				frameHeight = frames[0][0].length,
				blockWidth = DOTAREA_SIZE*framesCount,
				guideHeight = (DOTAREA_SIZE*frameHeight)+GUIDE_MARGIN*2,
				schemeWidth = frameWidth*blockWidth+DOTAREA_SIZE,
				schemeX = x+DOTAREA_SIZE,
				schemeY = y+GUIDE_MARGIN;

			image+="{rect "+(x)+" "+(y)+" "+(DOTAREA_SIZE)+" "+(guideHeight)+"}";
			image+="{rect "+(x)+" "+(y)+" "+(schemeWidth)+" "+(GUIDE_SIZE)+"}";
			image+="{rect "+(x)+" "+(y+guideHeight-GUIDE_SIZE)+" "+(schemeWidth)+" "+(GUIDE_SIZE)+"}";

			frames.forEach((frame,idframe)=>{
				if (idframe % 2 == 0)
					image+="{rect "+(x+(DOTAREA_SIZE*idframe))+" "+(y)+" "+DOTAREA_SIZE+" "+GUIDE_TICKHEIGHT+"}";
				frame.forEach((line,y)=>{
					for (let x=0;x<line.length;x++) {
						if (line[x]!=" ")
							image+="{rect "+(schemeX+(DOTAREA_SIZE*idframe)+(blockWidth*x)+DOT_SPACING)+" "+(schemeY+DOTAREA_SIZE*y+DOT_SPACING)+" "+(DOT_SIZE) +" "+(DOT_SIZE)+"}";
					}
				})
			});

			image+="{emptyarea "+(x+schemeWidth)+" "+(y+guideHeight)+"}";
			return image;
		}

		function createDotMatrixGuide(x,y,framesCount,frameWidth,frameHeight) {
			let
				image = "",
				blockWidth = DOTAREA_SIZE*framesCount,
				guideHeight = (DOTAREA_SIZE*frameHeight)+GUIDE_MARGIN*2,
				schemeWidth = frameWidth*blockWidth,
				schemeX = x+DOTAREA_SIZE+DOTAREA_SIZE,
				barWidth = blockWidth-DOTAREA_SIZE;

			image+="{rect "+(x)+" "+(y)+" "+(DOTAREA_SIZE)+" "+(guideHeight)+"}";
			image+="{rect "+(x)+" "+(y)+" "+(schemeWidth)+" "+(GUIDE_MARGIN)+"}";
			image+="{rect "+(x)+" "+(y+guideHeight-GUIDE_MARGIN)+" "+(schemeWidth)+" "+(GUIDE_MARGIN)+"}";

			for (let i=0;i<frameWidth;i++) {
				image+="{rect "+(schemeX+(blockWidth*i))+" "+(y)+" "+(barWidth) +" "+(guideHeight)+"}";
			}

			image+="{emptyarea "+(x+schemeWidth)+" "+(y+guideHeight)+"}";
			return image;
		}

		function createBallFallQuiz(quiz,prizes,fromrow,rows) {
			const
				CARDWIDTH = 57.5,
				BALLSIZE = 3,
				LINEWIDTH = 1,
				LINEHEIGHT = 3,
				BRIDGEWIDTH = 0.5,
				LINEMIDDLE = (LINEHEIGHT-BRIDGEWIDTH)/2,
				COLUMNGAP = 9;

			let
				areaWidth = COLUMNGAP*(quiz.lanes-1)+LINEWIDTH,
				ox = (CARDWIDTH-areaWidth)/2,
				oy = fromrow == 0 ? BALLSIZE : 0,
				torow = fromrow+rows,
				prizeY = (rows*LINEHEIGHT)+1,
				image = "";

			if (!fromrow) {
				let
					ballX = ox + (quiz.ballStart*COLUMNGAP) - (BALLSIZE-LINEWIDTH)/2;

				image += "{rect "+ballX+" 0 "+(BALLSIZE)+" "+(BALLSIZE)+"}";
			}

			for (let i=fromrow;i<torow;i++) {
				let
					joints = quiz.schema[i],
					y = oy+((i-fromrow)*LINEHEIGHT);

				for (let i=0;i<quiz.lanes;i++) {
					let
						x = ox+(i*COLUMNGAP);
					image += "{rect "+x+" "+y+" "+(LINEWIDTH)+" "+(LINEHEIGHT)+"}";
					if (joints[i])
						image += "{rect "+x+" "+(y+LINEMIDDLE)+" "+(COLUMNGAP)+" "+(BRIDGEWIDTH)+"}";
				}
			}

			if (torow == quiz.schema.length) {
				prizes.forEach((prize,id)=>{
					let
						prizeX = ox + (id*COLUMNGAP) - (5-LINEWIDTH)/2;
					image += "{stamp "+prize.id+" "+(prizeX)+" "+(prizeY)+"}";
				})
				oy+=LINEHEIGHT+2.5;
			}

			image+="{emptyarea "+(CARDWIDTH)+" "+(oy+LINEHEIGHT*rows)+"}";

			return image;
		}

		function createMaze(maze) {
			const
				ICONSIZE = 3,
				CELLSIZE = 2.85,
				HALFCELL = CELLSIZE / 2,
				LINESIZE = 0.5;

			let
				mazeWidth = maze.width*CELLSIZE,
				mazeHeight = maze.height*CELLSIZE,
				image = "{stamp symbolWrite "+(HALFCELL)+" 0 }{rect "+(CELLSIZE)+" "+ICONSIZE+" "+(mazeWidth-CELLSIZE)+" "+(LINESIZE)+"}{rect 0 "+ICONSIZE+" "+(LINESIZE)+" "+(mazeHeight)+"}";

			for (let x=0;x<maze.width; x++)
				for (let y=0;y<maze.height; y++) {
					if (!maze.vert[x][y])
						image+="{rect "+((x+1)*CELLSIZE)+" "+(y*CELLSIZE+ICONSIZE)+" "+LINESIZE+" "+(CELLSIZE+LINESIZE)+"}";
					if (!maze.horz[x][y] && ((y != maze.height-1) || (x != maze.width-1)))
						image+="{rect "+(x*CELLSIZE)+" "+((y+1)*CELLSIZE+ICONSIZE)+" "+(CELLSIZE+LINESIZE)+" "+LINESIZE+"}";
				}

			image+="{emptyarea "+(mazeWidth)+" "+(mazeHeight+ICONSIZE+0.2)+"}";
			return image;
		}

		return {
			card:card,
			box:box,
			models:models,
			add:(line)=>{
				box.items.push(line);
			},
			prepend:(line)=>{
				box.items.unshift(line);
			},
			addFromModel:(model, line)=>{
				for (let k in models[model])
					line[k] = models[model][k];
				box.items.push(line);
			},
			addDotMatrixFromText:(text)=>{
				let
					frames = [];
				for (let i=0;i<text.length;i++) {
					let
						frame = HELPERS.DOTMATRIX_FRAMES[text[i]];
					if (frame)
						frames.push(frame);
					else {
						// Can't find frame
						debugger;
					}
				}
				box.items.push({ line:createDotMatrix(0,0,frames) });
			},
			addBallFallQuiz:(quiz,prizes,fromrow,torow)=>{
				box.items.push({ line:createBallFallQuiz(quiz,prizes,fromrow,torow) });
			},
			addMaze:(maze)=>{
				box.items.push({ line:createMaze(maze) });
			},
			addDotMatrix:(frames)=>{
				box.items.push({ line:createDotMatrix(0,0,frames) });
			},
			addDotMatrixGuide:(framesCount,frameWidth,frameHeight)=>{
				if (!framesCount)
					framesCount = 4;
				if (!frameWidth)
					frameWidth = HELPERS.DOTMATRIX_FRAMES.A[0].length;
				if (!frameHeight)
					frameHeight = HELPERS.DOTMATRIX_FRAMES.A.length;
				box.items.push({ line:createDotMatrixGuide(0,0,framesCount,frameWidth,frameHeight) });
			},
			prependFromModel:(model, line)=>{
				for (let k in models[model])
					line[k] = models[model][k];
				box.unshift.push(line);
			}
		}
	},
	// --- Create random dialogues
	newDialogue:(I, subjects, verbs, punctuations)=>{
		let
			uniqueSentences = [],
			verbsBag = { elements:I.verbs },
			subjectsBag = { elements: I.subjects };

		if (!verbs) {
			verbs = [];
			for (let i=0;i<3;i++)
				verbs.push(I.random.bagPick(verbsBag));
		}

		if (!subjects) {
			subjects = [];
			for (let i=0;i<3;i++)
				subjects.push(I.random.bagPick(subjectsBag));
		}

		if (!punctuations)
			punctuations = PUNCTUATIONS;

		verbs.forEach(verb=>{
			subjects.forEach(subject=>{
				uniqueSentences.push("{symbol "+verb+"}{symbol "+subject+"}");
			})
		})

		return {
			makePunctuations:()=>{
				return I.random.element(punctuations);
			},
			makeLine:(length, unique)=>{
				let
					sentences = [];
				for (let i=0;i<length;i++)
					if (unique)
						sentences.push(I.random.removeElement(uniqueSentences)+I.random.element(punctuations));
					else
						sentences.push("{symbol "+I.random.element(verbs)+"}{symbol "+I.random.element(subjects)+"}"+I.random.element(punctuations));
				return sentences.join(" ");
			},
			makeUniqueSentence:(addpunctuation)=>{
				return I.random.removeElement(uniqueSentences)+(addpunctuation ? I.random.element(punctuations) : "");
			}
		}
	},
	// --- Turn a lock into a quiz
	makeLockQuiz:(I, quizId, cardinteraction, items, question, lockcardtypes, answers, punishment, prize)=>{
		let
			quizData = { question:question, wrongAnswers:[] },
			rightItem = items ? I.random.removeElement(items) : 0,
			anyItem = [],
			wrongItems = [],
			afterQuiz = [],
			lockCardEditor = HELPERS.newBoxEditor(I, I.card, cardinteraction),
			gateCardEditor = HELPERS.newBoxEditor(I, I.deck.findCard([ "aftergate-"+I.card.interactionId ]), "move", true);

		gateCardEditor.card.multiColumn = true;

		if (lockcardtypes)
			I.card.decorations = lockcardtypes;

		I.random.shuffle(answers);

		lockCardEditor.add({ line:question });
		
		if (typeof answers == "string") {
			lockCardEditor.addFromModel(0, { condition:answers });
		} else {
			answers.forEach(answer=>{
				let
					item;

				if (answer.isRight) {
					quizData.rightAnswer = answer.label;
					quizData.rightItem = rightItem;
					item = rightItem;
				} else {
					quizData.wrongAnswers.push(answer.label);
					item = I.random.removeElement(items);
					wrongItems.push(item);
				}

				anyItem.push(item.symbol);

				if (answer.label)
					lockCardEditor.add({ condition:answer.label, line:"+1"+item.symbol });
			})
			lockCardEditor.addFromModel(0, { condition:anyItem.join("/")+":" });
		}

		if (punishment)
			if (typeof punishment == "string") {
				wrongItems.forEach(item=>{
					afterQuiz.push({ condition:"-1"+item.symbol+":", line:punishment });
				})
				if (prize)
					afterQuiz.push({ condition:"-1"+rightItem.symbol+":", line:prize });
				I.random.shuffle(afterQuiz);
			} else
				punishment.forEach((punishment,id)=>{
					afterQuiz.unshift({ condition:"-"+punishment.label+":", line:punishment.outcome });
				})

		afterQuiz.forEach(entry=>{
			gateCardEditor.prepend(entry);
		})

		I.deck.setAnswer(quizId, quizData);
	},
	// --- Turn a lock in a punishment
	makeLockPunishmentQuiz:(I, quizId, wrongitems, punishment)=>{
		let
			gateCardEditor = HELPERS.newBoxEditor(I, I.deck.findCard([ "aftergate-"+I.card.interactionId ]), "move", true);

		wrongitems.forEach(item=>{
			gateCardEditor.prepend({ condition:"-1"+item.symbol+":", line:punishment});
		})

		I.deck.setAnswer(quizId, { wrongItems:wrongitems });
	},
	// --- Creates a grid with a map of a dungeon segment with stats
	makeMap:(I, arealimit)=>{
		let
			out = {
				grid:[],
				letters:[],
				x1:0, y1:0,
				x2:0, y2:0,
			};

		I.dungeon.cells.forEach(dc=>{
			if ((dc.area < arealimit)) {
				if (!out.grid[dc.y])
					out.grid[dc.y] = [];
				out.grid[dc.y][dc.x] = dc.id;
				if (out.letters.indexOf(dc.id) == -1)
					out.letters.push(dc.id);
				out.x1 = Math.min(out.x1,dc.x);
				out.x2 = Math.max(out.x2,dc.x);
				out.y1 = Math.min(out.y1,dc.y);
				out.y2 = Math.max(out.y2,dc.y);
			}
		});

		return out;
	},
	// --- Look for grids in the map to draw symbols
	makeDrawingGrids:(I, arealimit)=>{
		let
			map = HELPERS.makeMap(I, arealimit),
			grids = [];

		for (let y=map.y1;y<=map.y2;y++) {
			let
				combinations = 0,
				possibleColumns = [];

			for (let x=map.x1;x<=map.x2;x++) {
				if (map.grid[y] && map.grid[y][x])
					possibleColumns.push(x);
			}

			combinations = Math.pow(2, possibleColumns.length);

			for (let i=1;i<combinations;i++) {
				let
					grid = [],
					row = possibleColumns.filter((x,id)=>i&(1<<id));

				for (let y1=y;y1<=map.y2;y1++) {
					let
						newRow = [],
						isValidRow = true;
					row.forEach(x=>{
						if (map.grid[y1] && map.grid[y1][x])
							newRow.push({ x:x, y:y1, id:map.grid[y1][x] });
						else
							isValidRow = false;
					});
					if (isValidRow)
						grid.push(newRow);
				}

				// --- Add a grid
				if (!grids[row.length])
					grids[row.length] = [];
				if (!grids[row.length][grid.length])
					grids[row.length][grid.length] = [];
				grids[row.length][grid.length].push(grid);

			}
		}

		function getSymbol(symbol) {
			let
				out = false;

			if (HELPERS.GRID_SYMBOLS[symbol]) {
				let
					setFound = [];

				HELPERS.GRID_SYMBOLS[symbol].forEach(symbolset=>{
					let
						validGrids = [];

					grids.forEach((set,width)=>{
						if (width>=symbolset.size[0])
							set.forEach((subset,height)=>{
								if (height>=symbolset.size[1]) {
									validGrids = validGrids.concat(subset);
								}
							})
					});

					if (validGrids.length)
						setFound.push({ symbolSet:symbolset, validGrids:validGrids });
				})

				if (setFound.length) {

					let
						set = I.random.element(setFound),
						grid = I.random.element(set.validGrids),
						symbolSet = set.symbolSet,
						coords = I.random.element(symbolSet.coords),
						gridHeight = grid.length,
						gridWidth = grid[0].length,
						matchRows = [ 0 ], matchCols = [ 0 ];

					if (gridWidth>2) {
						let
							available = [],
							pick = [];

						for (let i=1;i<gridWidth-1;i++)
							available.push(i);

						for (let i=0;i<gridWidth-2;i++)
							pick.push(I.random.removeElement(available));

						pick.sort();
						pick.forEach(element=>matchCols.push(element));
					}

					if (gridHeight>2) {
						let
							available = [],
							pick = [];

						for (let i=1;i<gridHeight-1;i++)
							available.push(i);

						for (let i=0;i<gridHeight-2;i++)
							pick.push(I.random.removeElement(available));

						pick.sort();
						pick.forEach(element=>matchRows.push(element));
					}

					if (gridWidth>1)
						matchCols.push(gridWidth-1);

					if (gridHeight>1)
						matchRows.push(gridHeight-1);

					out = "";

					if (I.random.bool())
						coords = coords.reverse();

					coords.forEach(coord=>{
						out+=grid[matchRows[coord[1]]][matchCols[coord[0]]].id;
					})

				}

			}

			return out;
		}

		return {
			getSymbol:(symbol)=>{
				return getSymbol(symbol);
			},
			getSymbols:(text, allowed)=>{
				const
					SEPARATOR = "{emptyarea 0.4 1}",
					SEPARATOR_LENGTH = SEPARATOR.length;

				let
					prevSymbol = false,
					out = "";

				text = (text+"").trim();
				for (let i=0;i<text.length;i++) {
					let
						letter = text[i];
					if ((!allowed || (allowed.indexOf(letter)!=-1))) {
						let
							symbol = getSymbol(letter);

						if (prevSymbol == 3)
							out += SEPARATOR;

						prevSymbol = 1;

						if (symbol)
							out += symbol;
						else {
							out += letter;
							prevSymbol = 3;
						}

						out += SEPARATOR;
					} else {
						if ((prevSymbol == 1) && (letter == " "))
							out = out.substr(0,out.length-SEPARATOR_LENGTH) + letter;
						else
							out += letter;
						prevSymbol = letter == " " ? 2 : 3;
					}
				}

				if (prevSymbol == 1)
					out = out.substr(0,out.length-SEPARATOR_LENGTH)

				return out;
			}
		}
	},
	// --- Makes a falling ball quiz
	makeBallFallQuiz:(I, lanes, rows)=>{
		let
			render = [],
			schema = [],
			ballStart = I.random.integer(lanes),
			ballEnd = ballStart;

		function rpt(t,x) {
			let
				o ="";
			for (let i=0;i<t;i++)
				o+=x;
			return o;
		}

		for (let i=0;i<rows;i++) {
			let
				joints = [],
				i = 0;

			do {
				if (I.random.bool()) {
					joints[i]=true;
					i+=2;
				} else
					i++;
			} while (i<lanes-1);
			schema.push(joints);
		}

		schema.forEach(joints=>{
			if (joints[ballEnd])
				ballEnd++;
			else if (joints[ballEnd-1])
				ballEnd--;
		});

		render.push(rpt(3*ballStart," ")+"O");
		schema.forEach((joints,id)=>{
			let
				line = "";
			for (let i=0;i<lanes;i++)
				if (joints[i])
					line+="|--";
				else
					line+="|  ";
			render.push(line);		
		})
		render.push(rpt(3*ballEnd," ")+"O");

		return {
			lanes:lanes,
			schema:schema,
			ballStart:ballStart,
			ballEnd:ballEnd,
			render:render
		}
	},
	// --- Format time
	formatSeconds:(seconds)=>{
		let
			secs = (seconds%60)
		return Math.floor(seconds/60)+"' "+(secs ? secs > 9 ? secs : "0"+secs : "00")+"\"";
	},
	// --- Generate a maze
	generateMaze:function generate(I,width,height) {

        let
            n=width*height-1,
            toVisit = [],
            vert = [],
            horz = [],
            here= { x:I.random.integer(width), y:I.random.integer(height) },
            path= [ here ],
            next,
            directions;
    
        for (let j= 0; j<=width; j++) {
            vert[j]= [];
            horz[j]= [];
            toVisit[j] = [];
            for (let k= 0; k<height; k++)
                toVisit[j].push(true);
        }

        toVisit[here.x][here.y]=false;

        while (n) {

            directions = [];

            [
                { x:here.x+1, y:here.y},
                { x:here.x-1, y:here.y},
                { x:here.x, y:here.y+1},
                { x:here.x, y:here.y-1}
            ].forEach(dest=>{
                if ((dest.x>=0) && (dest.y>=0) && (dest.x<width) && (dest.y<height) && (toVisit[dest.x][dest.y]))
                    directions.push(dest);
            });

            if (directions.length) {

                next = I.random.element(directions);
                n = n-1;
                toVisit[next.x][next.y]= false;
                if (next.x == here.x)
                    horz[next.x][(next.y+here.y-1)/2]= true;
                else
                    vert[(next.x+here.x-1)/2][next.y]= true;
                here = next;
                path.push(here);

            } else 
                here = path.pop();

        }

        return { width: width, height: height, horz: horz, vert: vert };

    },
	// --- Makes a path
	makePath:(points)=>{
		return "{path "+points.map((dot,id)=>(id ? "l" : "M")+" "+(dot.x-(points[id-1] ? points[id-1].x : 0))+","+(dot.y-(points[id-1] ? points[id-1].y : 0))).join(" ")+" z}";
	},
	// --- Makes a numbers sequence puzzle
	makeSequencePuzzle:(I,sequence)=>{
		let
			value,
			mode = I.random.bool(),
			out = "";

		sequence.forEach((num,id)=>{
			if (id) {
				let
					split = value / num,
					times = num / value,
					options = [];
				options.push(num>value ? "+"+(num-value) : "-"+(value-num));
				if (Math.floor(times) == times)
					options.push("{symbol times}"+times);
				if (Math.floor(split) == split)
					options.push(":"+split);
				out += I.random.element(options);
				if (!mode)
					value = num;
			} else {
				out = num;
				value = num;
				if (mode)
					out+="{symbol startLoop}";
			}
		})

		if (mode)
			out+="{symbol endLoop}";

		return out;
	},
	// --- Validate a nonogram (adapted from: https://github.com/philipknott/nonogram-solver/)
	validateNonogram:(game)=>{
		let
			height = game.rows.length,
			width = game.columns.length,
			field = [],
			rows = [],
			columns = [];

		function getOptions(arr, size) {
			let
				options = [],
				startingIndices = [],
				sum = 0,
				dec = [];

			if (arr.length == 1) {
				let
					num = size - arr[0] + 1;
				for (let i = 0; i < num; i++) {
					let
						temp = new Array(size).fill(0);
					for (let j = 0; j < arr[0]; j++)
						temp[i + j] = 1;
					options.push(temp);
				}
				return options;
			}

			for (let i = arr.length - 1; i >= 0; i--) {
				let
					temp = 0;
				for (let j = 0; j < i; j++) {
					temp += Number(arr[j]);
				}
				temp += i;
				startingIndices.push(temp);
			}
			startingIndices.reverse();

			arr.forEach(e => { sum += Number(e); });
			let
				base = size - sum - (arr.length - 1) + 1;

			if (base == 1) {
				let
					only = [];

				arr.forEach(e => {
					for (let i = 0; i < e; i++) { only.push(1); }
					only.push(0);
				})
				only.pop();
				options.push(only);
				return options;
			}

			for (let i = 0; i < Math.pow(base, arr.length); i++) {
				let
					result = i.toString(base);

				let
					good = true;
				for (let i = 1; i < result.length; i++) {
					if (parseInt(result.charAt(i), base) < parseInt(result.charAt(i - 1), base)) {
						good = false;
						break;
					}
				}
				if (good) {
					result = result.padStart(arr.length, '00000000000000000000');
					result = result.split('');
					for (let j = 0; j < result.length; j++)
						result[j] = parseInt(result[j], base);
					dec.push(result);
				}
			}

			dec.forEach(d => {
				let temp = new Array(size).fill(0);

				for (let i = 0; i < arr.length; i++) {
					let startpos = startingIndices[i] + d[i];

					for (let j = 0; j < arr[i]; j++) {
						temp[j + startpos] = 1;
					}
				}
				options.push(temp);
			})

			return options;
		}

		function solve() {

			let
				actionDone,
				isComplete = () => {
					for (let i = 0; i < rows.length; i++) {
						if (rows[i].options.length != 1) {
							return false;
						}
					}
					for (let i = 0; i < columns.length; i++) {
						if (columns[i].options.length != 1) {
							return false;
						}
					}
					return true;
				}

			do {

				actionDone = false;
				
				rows.forEach((row, ri, rows) => {
					for (let i = 0; i < width; i++) {
						if (field[ri][i] == 1 || field[ri][i] == 2) {
							for (let oi = row.options.length - 1; oi >= 0; oi--) {
								if (row.options[oi][i] == (field[ri][i] == 1 ? 0 : 1)) {
									rows[ri].options.splice(oi, 1);
									actionDone = true;
									continue;
								}
							}
						}
					}

					for (let i = 0; i < width; i++) {
						let
							fill = true,
							nofill = true,
							set;

						row.options.forEach(o => {
							o[i] == 0 ? fill = false : nofill = false;
						})

						set = fill ? 1 : nofill ? 2 : 0;

						if (field[ri][i] != set) {
							field[ri][i] = set;
							actionDone = true;
						}
					}
				})

				columns.forEach((col, ci, columns) => {

					for (let i = 0; i < height; i++) {
						if (field[i][ci] == 1 || field[i][ci] == 2) {
							for (let oi = col.options.length - 1; oi >= 0; oi--) {
								if (col.options[oi][i] == (field[i][ci] == 1 ? 0 : 1)) {
									columns[ci].options.splice(oi, 1);
									actionDone = true;
									continue;
								}
							}
						}
					}

					for (let i = 0; i < height; i++) {
						let
							fill = true,
							nofill = true,
							set;

						col.options.forEach(o => {
							o[i] == 0 ? fill = false : nofill = false;
						})

						set = fill ? 1 : nofill ? 2 : 0;
						if (field[i][ci] != set) {
							field[i][ci] = set;
							actionDone = true;
						}
					}
				})

			} while (!isComplete() && actionDone);

			return actionDone ? field : 0;

		}

		for (let i=0;i<height;i++) {
			let
				temp = [];
			for (let j=0;j<width;j++)
				temp.push(0);
			field.push(temp);
		}

		game.rows.forEach(row=>{
			rows.push({
				header: row,
				options: getOptions(row, width)
			})
		})

		game.columns.forEach(col=>{
			columns.push({
				header:col,
				options:getOptions(col, height)
			})
		})

		return solve();
	},
	// --- Makes a nonogram
	makeNonogram:(I,w,h)=>{
		let
			columns = [],
			rows = [],
			grid = [];

		for (let j=0;j<h;j++) {
			let
				row = [];
			for (let i=0;i<w;i++)
				row.push(I.random.bool());
			grid.push(row);
		}

		for (let j=0;j<h;j++) {
			let
				n = true,
				idx = 0,
				line = [];
			for (let i=0;i<w;i++)
				if (grid[j][i])
					if (n) {
						line[idx]=1;
						n = false;
					} else
						line[idx]++;
				else if (!n) {
					idx++;
					n = true;
				}
			rows.push(line);
		}

		for (let j=0;j<w;j++) {
			let
				n = true,
				idx = 0,
				line = [];
			for (let i=0;i<h;i++)
				if (grid[i][j])
					if (n) {
						line[idx]=1;
						n = false;
					} else
						line[idx]++;
				else if (!n) {
					idx++;
					n = true;
				}
			columns.push(line);
		}

		return {
			grid:grid,
			rows:rows,
			columns:columns
		};
	},
	// --- Make valid nonogram
	makeValidNonogram:(I,w,h)=>{
		let
			nonogram;

		do {
			nonogram = HELPERS.makeNonogram(I,w,h);
		} while (!HELPERS.validateNonogram(nonogram));

		return nonogram;
	},
	// --- Make jigsaw puzzle
	makeJigsaw:(I,image,piecesx,piecesy,canvaswidth,canvasheight)=>{

		if (!canvaswidth)
			canvaswidth = 630;

		if (!canvasheight)
			canvasheight = 440;

		let
			rawimage = image.image || image,
			canvas = document.createElement("canvas"),
			ctx = canvas.getContext("2d"),
			ox = Math.floor((canvaswidth-image.width)/2),
			oy = canvasheight-image.height,
			pieceWidth = image.width/piecesx,
			pieceHeight = image.height/piecesy,
			hPieceWidth = pieceWidth/2,
			hPieceHeight = pieceHeight/2,
			pieces = [],
			piecesCount = piecesx * piecesy;

		for (let i=0;i<piecesCount;i++)
			pieces.push(i);

		I.random.shuffle(pieces);

		canvas.width = canvaswidth;
		canvas.height = canvasheight;
		ctx.lineWidth = 5;
		ctx.setLineDash([5,5]);

		pieces.forEach((piece,id)=>{
			let
				cx = ox+(id%piecesx)*pieceWidth,
				cy = oy+Math.floor(id/piecesy)*pieceWidth,
				angleInRadians = Math.PI*0.5*I.random.integer(4);

			ctx.translate(cx+hPieceWidth, cy+hPieceHeight);
			ctx.rotate(angleInRadians);

			ctx.drawImage(
				rawimage,
				(piece%piecesx)*pieceWidth,
				Math.floor(piece/piecesy)*pieceHeight,
				pieceWidth,
				pieceHeight,
				-hPieceWidth, -hPieceHeight, pieceWidth, pieceHeight
			);

			ctx.rotate(-angleInRadians);
			ctx.translate(-cx-hPieceWidth, -cy-hPieceHeight);
		})

		for (let i=0;i<=piecesx;i++) {
			let
				dx = ox+(i*pieceWidth);
			ctx.beginPath();
			ctx.moveTo(dx,oy);
			ctx.lineTo(dx,oy+image.height);
			ctx.stroke();
		}

		for (let i=0;i<=piecesy;i++) {
			let
				dy = oy+(i*pieceHeight);
			ctx.beginPath();
			ctx.moveTo(ox,dy);
			ctx.lineTo(ox+image.width,dy);
			ctx.stroke();
		}
		return canvas;
	},
	DOTMATRIX_FRAMES:{
		"0":[
			"  ###  ",
			" #   # ",
			" #   # ",
			" #   # ",
			" #   # ",
			" #   # ",
			"  ###  ",
		],
		"1":[
			"   #   ",
			" ###   ",
			"   #   ",
			"   #   ",
			"   #   ",
			"   #   ",
			"  ###  ",
		],
		"2":[
			"  ###  ",
			" #   # ",
			"     # ",
			"    #  ",
			"   #   ",
			"  #    ",
			" ##### ",
		],
		"3":[
			" ####  ",
			"     # ",
			"     # ",
			"  ###  ",
			"     # ",
			"     # ",
			" ####  ",
		],
		"4":[
			"   ##  ",
			"  # #  ",
			" #  #  ",
			" ##### ",
			"    #  ",
			"    #  ",
			"    #  ",
		],
		"5":[
			" ##### ",
			" #     ",
			" #     ",
			" ####  ",
			"     # ",
			"     # ",
			" #### ",
		],
		"6":[
			"  ###  ",
			" #     ",
			" #     ",
			" ####  ",
			" #   # ",
			" #   # ",
			"  ### ",
		],
		"7":[
			" ##### ",
			"     # ",
			"     # ",
			"    #  ",
			"   #   ",
			"  #    ",
			" #     ",
		],
		"8":[
			"  ###  ",
			" #   # ",
			" #   # ",
			"  ###  ",
			" #   # ",
			" #   # ",
			"  ###  ",
		],
		"9":[
			"  ###  ",
			" #   # ",
			" #   # ",
			"  #### ",
			"     # ",
			"     # ",
			"  ###  ",
		],
		"A":[
			"  ###  ",
			" #   # ",
			" #   # ",
			" ##### ",
			" #   # ",
			" #   # ",
			" #   # ",
		],
		"B":[
			" ####  ",
			" #   # ",
			" #   # ",
			" ####  ",
			" #   # ",
			" #   # ",
			" ####  ",
		],
		"C":[
			"  #### ",
			" #     ",
			" #     ",
			" #     ",
			" #     ",
			" #     ",
			"  #### ",
		],
		"D":[
			" ###   ",
			" #  #  ",
			" #   # ",
			" #   # ",
			" #   # ",
			" #  #  ",
			" ###   ",
		],
	},
	// --- Grid symbols MUST have a 2x2 variant.
	GRID_SYMBOLS:{
		"0":[
			{ size:[ 2, 2 ], coords:[
				[ [ 0, 0 ], [ 0, 1 ], [ 1, 1 ], [ 1, 0 ], [ 0, 0 ] ]
			] },
			{ size:[ 3, 3 ], coords:[
				[ [ 1, 0 ], [ 2, 1 ], [ 1, 2 ], [ 0, 1 ], [ 1, 0 ] ]
			] },
		],
		"1":[
			{ size:[ 1, 2 ], coords:[
				[ [ 0, 0 ], [ 0, 1 ] ]
			]},
			{ size:[ 2, 3 ], coords:[
				[ [ 0, 1 ], [ 1, 0 ],  [ 1, 2 ] ]
			]},
			{ size:[ 3, 3 ], coords:[
				[ [ 0, 1 ], [ 1, 0 ],  [ 1, 2 ], [ 0, 2 ], [ 2, 2 ] ]
			]}
		],
		"2":[
			{ size:[ 2, 2 ], coords:[
				[ [ 0, 0 ], [ 1, 0 ], [ 0, 1 ], [ 1, 1 ] ]
			]},
			{ size:[ 2, 3 ], coords:[
				[ [ 0, 0 ], [ 1, 0 ], [ 1, 1 ], [ 0, 1 ], [ 0, 2 ], [ 1, 2 ] ]
			]}
		],
		"3":[
			{ size:[ 2, 2 ], coords:[
				[ [ 0, 0 ], [ 1, 0 ], [ 0, 1 ], [ 1, 0 ], [ 1, 1 ] ]
			]},
			{ size:[ 2, 3 ], coords:[
				[ [ 0, 0 ], [ 1, 0 ], [ 0, 1 ], [ 1, 2 ], [ 0, 2 ] ]
			]},
			{ size:[ 2, 3 ], coords:[
				[ [ 0, 0 ], [ 1, 0 ], [ 1, 1 ], [ 0, 1 ], [ 1, 1 ], [ 1, 2 ], [ 0, 2 ] ]
			]},
			{ size:[ 2, 5 ], coords:[
				[ [ 0, 0 ], [ 1, 1 ], [ 0, 2 ], [ 1, 3 ], [ 0, 4 ] ]
			]},
			
		],
		"4":[
			{ size:[ 2, 2 ], coords:[
				[ [ 1, 1 ], [ 0, 0 ], [ 0, 1 ], [ 1, 0 ] ]
			]},
			{ size:[ 2, 3 ], coords:[
				[ [ 0, 0 ], [ 0, 1 ], [ 1, 1 ], [ 1, 2 ], [ 1, 0 ] ]
			]},
			{ size:[ 2, 3 ], coords:[
				[ [ 1, 2 ], [ 1, 0 ], [ 0, 1 ], [ 1, 1 ] ]
			]}
		],
		"5":[
			{ size:[ 2, 2 ], coords:[
				[ [ 1, 0 ], [ 0, 0 ], [ 1, 1 ], [ 0, 1 ] ]
			]},
			{ size:[ 2, 3 ], coords:[
				[ [ 1, 0 ], [ 0, 0 ], [ 0, 1 ], [ 1, 1 ], [ 1, 2 ], [ 0, 2 ] ]
			]}
		],
		"6":[
			{ size:[ 2, 2 ], coords:[
				[ [ 1, 0 ], [ 0, 0 ], [ 0, 1 ], [ 1, 1 ], [ 0, 0 ] ]
			]},
			{ size:[ 2, 3 ], coords:[
				[ [ 1, 0 ], [ 0, 0 ], [ 0, 2 ], [ 1, 2 ], [ 1, 1 ], [ 0, 1 ] ]
			]},
			{ size:[ 2, 3 ], coords:[
				[ [ 0, 0 ], [ 0, 2 ], [ 1, 2 ], [ 1, 1 ], [ 0, 1 ] ]
			]}
		],
		"7":[
			{ size:[ 2, 2 ], coords:[
				[ [ 0, 0 ], [ 1, 0 ], [ 1, 1 ] ],
				[ [ 0, 0 ], [ 1, 0 ], [ 0, 1 ] ],
			]}
		],
		"8":[
			{ size:[ 2, 2 ], coords:[
				[ [ 0, 0 ], [ 1, 0 ], [ 0, 1 ], [ 1, 1 ], [ 0, 0 ] ]
			]},
			{ size:[ 2, 4 ], coords:[
				[ [ 0, 0 ], [ 1, 0 ], [ 1, 1 ], [ 0, 2 ], [ 0, 3 ], [ 1, 3 ], [ 1, 2 ], [ 0, 1 ], [ 0, 0 ] ]
			]}
		],
		"9":[
			{ size:[ 2, 2 ], coords:[
				[ [ 0, 1 ], [ 1, 1 ], [ 1, 0 ], [ 0, 0 ], [ 1, 1 ] ]
			]},
			{ size:[ 2, 3 ], coords:[
				[ [ 1, 1 ], [ 0, 0 ], [ 1, 0 ], [ 1, 2 ] ]
			]},
			{ size:[ 2, 3 ], coords:[
				[ [ 1, 1 ], [ 0, 1 ], [ 0, 0 ], [ 1, 0 ], [ 1, 2 ], [ 0, 2 ] ]
			]}
		]
	},
};
