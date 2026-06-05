let DEBUGTOOLS = {
	DEVMODE_OFF:0,
	DEVMODE_ON:1,
	DEVMODE_TUTORIAL:2,
	generatePdf:(cb, filename, pages, doc, id)=>{

		if (!id) id=0;

		if (!doc)
			doc = new jspdf.jsPDF({
				orientation: 'p',
				unit: 'mm'
			});

		if (pages[id]) {

			if (id>0) doc.addPage();

			let pdfNode = document.createElement("div");
			pdfNode.innerHTML=pages[id].getSVG();
			const svgElement = pdfNode.firstElementChild;
			svgElement.getBoundingClientRect();
			doc.svg(svgElement).then(()=>DEBUGTOOLS.generatePdf(cb,filename,pages,doc,id+1));

		} else  {

			const a = document.createElement("a");
			document.body.appendChild(a);
			a.style.display = "none";
			const blob = new Blob([doc.output('arraybuffer')], {
				type: "application/pdf"
			});
			const url = window.URL.createObjectURL(blob);
			a.href = url;
			a.download = filename;
			a.click();
			document.body.removeChild(a);
			busy=false;
			cb("done");

		}
	},
	makeCalendar:(resources,from,to)=>{
		
		let
			DAYMSEC = 1000*60*60*24,
			date = new Date(),
			tmpdate = new Date(date.getFullYear(),date.getMonth(),date.getDate(),1,0,0),
			tmpdateMsec = tmpdate.getTime(),
			language = "EN",
			generation,
			todaySeed = Generator.getTodaySeed(),
			calendar = [];

		function pad(n) {
			if (n<10)
				return "0"+n;
			else
				return n;
		}

		for (let i=from;i<=to;i++) {
			let
				seed = todaySeed+i,
				dateMsec = tmpdateMsec+(i*DAYMSEC),
				date = new Date(dateMsec),
				row = {
					seed:seed,
					delta:i,
					date:date,
					dateMsec:dateMsec,
					dateString:date.getFullYear()+"-"+pad(date.getMonth()+1)+"-"+pad(date.getDate()),
					generation:Generator({
						generator:GENERATOR,
						passages:PASSAGES,
						specials:SPECIALS,
						resources:resources,
						gameData:{},
						gameProgress:FAKEPROGRESS,
					}, language, seed)
				};
			calendar.push(row);
		}

		return calendar;

	},
	explorer:(devmode, root, resources, prefix, out, autorender, seeddelta, destdatestring)=>{
		const
			DAYMSEC = 1000*60*60*24,
			FAKEPROGRESS = {plays:0,e:[],"completion":0,"lastSeed":-1 };

		let
			generation,
			collapsableId = 0,
			html = "",
			tmpHtml,
			printout,
			bar1,
			bar2,
			calendar,
			nowdate = new Date(),
			random = new Random(Math.random()*10000);

		if (!seeddelta)
			seeddelta = 0;

		nowdate = new Date(nowdate.getFullYear(),nowdate.getMonth(),nowdate.getDate(),1,0,0);

		function pad(n) {
			if (n<10)
				return "0"+n;
			else
				return n;
		}

		function makeButton(parent, label, cb) {
			let
				button = document.createElement("button");
			button.innerHTML = label;
			button.onclick = cb;
			parent.appendChild(button);
		}

		function render(root, printout) {
			let
				printer = new DungeonPrinter();

			printer.print({
				border:true,
				deck:GENERATOR.deck,
				root:root,
			},random.element(BIOMES),generation.deck,language,(result)=>{
				DEBUGTOOLS.printPreview(printout, prefix+generation.basename, result);
			});
		}

		function makeCollapsable(title,html) {
			let
				id = "_collapse"+(collapsableId++),
				out = "";

			if (html) {	
				out = "<div style='margin:5px 0;border:2px solid #000;border-radius:5px;padding:5px'>";
				out += "<div style='user-select:none;background-color:#000;color:#fff;padding:5px;cursor:pointer;font-weight:bold' onclick='document.getElementById(\""+id+"\").style.display=document.getElementById(\""+id+"\").style.display == \"none\" ? \"block\" : \"none\"'>"+title+"</div>";
				out += "<div id='"+id+"' style='display:none'>"+html+"</div>";
				out +="</div>"
			}

			return out;
		}

		function dumpJson(str) {
			let
				items = 0,
				out="<table>";
			for (let k in str) {
				items++;
				out+="<tr><td style='vertical-align:top'><b>"+k+":</b></td><td><tt>"+htmlEntities(JSON.stringify(str[k], null,"  "))+"</tt></td></tr>";
			}
			out+="</table>";
			return items ? out : "";
		}

		function htmlEntities(rawStr) {
			return rawStr === undefined ? "" : rawStr.replace(/[\u00A0-\u9999<>\&]/g, function(i) {
				return '&#'+i.charCodeAt(0)+';';
			}).replace(/\n/g,"<br>").replace(/ /g,"&nbsp;");
		}

		if (destdatestring) {
			let
				destdateparts = destdatestring.split("-").map(a=>parseInt(a)),
				destdate = new Date(destdateparts[0],destdateparts[1]-1,destdateparts[2],1,0,0);
			seeddelta = Math.floor((destdate.getTime()-nowdate.getTime())/DAYMSEC);
		}

		let
			language = "EN",
			datemsec = nowdate.getTime()+(seeddelta*DAYMSEC),
			date = new Date(datemsec),
			seed=Math.floor(datemsec/DAYMSEC),
			datestring =  date.getFullYear()+"-"+pad(date.getMonth()+1)+"-"+pad(date.getDate()),
			button = document.createElement("input");

		switch (devmode) {
			case DEBUGTOOLS.DEVMODE_OFF:{
				out.innerHTML = "<span style='padding:5px;background-color:#0f0;color:#000;font-size:10px;margin-right:10px'>EXPLORER</span>";
				break;
			}
			case DEBUGTOOLS.DEVMODE_ON:{
				out.innerHTML = "<span style='padding:5px;background-color:#f00;color:#fff;font-size:10px;margin-right:10px'>DEVMODE</span>";
				break;
			}
		}
		
		out.innerHTML= "<span id='bar1'></span> Day: <input id='calendar' type='date' value='"+datestring+"'> (seed:"+seed+") <span id='bar2'></span>"+
			"<hr><div id='printout'></id>";

		bar1 = document.getElementById("bar1");
		bar2 = document.getElementById("bar2");
		calendar = document.getElementById("calendar");
		printout = document.getElementById("printout");

		makeButton(bar1,"Today", ()=>{ DEBUGTOOLS.explorer(devmode, root, resources, prefix, out,autorender,  0, 0) });
		makeButton(bar1,"&laquo;", ()=>{ DEBUGTOOLS.explorer(devmode, root, resources, prefix, out, autorender, seeddelta-1, 0) });
		makeButton(bar2,"&raquo;", ()=>{ DEBUGTOOLS.explorer(devmode, root, resources, prefix, out, autorender, seeddelta+1, 0) });
		makeButton(bar2,"Random", ()=>{ DEBUGTOOLS.explorer(devmode, root, resources, prefix, out, autorender, Math.floor(Math.random()*100000), 0) });
		calendar.onchange=()=>{ DEBUGTOOLS.explorer(devmode, root, resources, prefix, out, autorender, 0,calendar.value) };

		console.log("---","Generating seed",seed,"day",datestring);

		generation = Generator({
			_debug:devmode == DEBUGTOOLS.DEVMODE_ON,
			_logs:devmode == DEBUGTOOLS.DEVMODE_ON,
			_tutorial:devmode == DEBUGTOOLS.DEVMODE_TUTORIAL,
			_postProcess:devmode == DEBUGTOOLS.DEVMODE_TUTORIAL ? TUTORIAL_POSTPROCESS : false,
			generator:devmode == DEBUGTOOLS.DEVMODE_TUTORIAL ? TUTORIAL_GENERATOR : GENERATOR,
			passages:PASSAGES,
			specials:SPECIALS,
			resources:resources,
			gameData:{},
			gameProgress:FAKEPROGRESS,
		}, language, seed);

		generation.deck.cards.forEach(card=>{
			let
				title = card.generatedBy.map(generatedby=>generatedby.description).join("\n");
			card._title = title || "(Maze card)";
			if (devmode)
				card.generatedBy.forEach(generatedby=>{
					if (generatedby._debug)
						card._hilight = true;
				})
		})

		html+=generation.dungeon.debug();

		html += makeCollapsable("Result",dumpJson({
			basename:generation.basename,
			isOk:generation.isOk,
			attempts:generation.attempts,
			packAttemptsLeft:generation.packAttemptsLeft
		}));

		tmpHtml = "<ul>";
		generation.selectedEvents.forEach(event=>{
			tmpHtml+="<li><b>Area "+event.area+"</b>: ["+event.event.uuid+"] <span style='"+(devmode && event.event._debug ? "color:#f00" : "")+"'>"+event.event.description+"</span></li>";
		})
		tmpHtml +="</ul>";
		html += makeCollapsable("Events",tmpHtml)
		
		if (generation.selectedSpecials.length) {
			tmpHtml = "<ul>";
			generation.selectedSpecials.forEach(event=>{
				tmpHtml+="<li>["+event.uuid+"] <span style='"+(devmode && event._debug ? "color:#f00" : "")+"'>"+event.description+"</span></li>";
			})
			tmpHtml +="</ul>";
			html += makeCollapsable("Specials",tmpHtml)
		}

		html += makeCollapsable("Generation", dumpJson(generation.dungeon.stats()));
		html += makeCollapsable("Answers", dumpJson(generation.deck.answers));
		html += makeCollapsable("Deck", generation.deck.debug());
		html += makeCollapsable("Memory", dumpJson(generation.deck.getMemory()));
		html += makeCollapsable("Saved data", dumpJson(generation.gameData));
		html += "<h2>Pages</h2>";

		printout.innerHTML = html;

		if (autorender) {
			render(root, printout);
		} else {

			button.type = "button";
			button.value = "Render";
			button.onclick = ()=>{
				button.parentNode.removeChild(button);
				render(root, printout);
			}
			printout.appendChild(button);

		}
	},
	printPreview:(root, basename, result)=>{

		let
			resultDiv = document.createElement("div"),
			printButton = document.createElement("input");

		resultDiv.style.padding="5px";
		resultDiv.style.margin="5px 0";

		if (result.isValid) {
			resultDiv.style.backgroundColor = "#0f0";
			resultDiv.innerHTML = "Print successful";
		} else {
			resultDiv.style.backgroundColor = "#f00";
			resultDiv.innerHTML = "Invalid print for cards: "+(result.invalidCards.map(card=>card.setIndex+"v"+card.version).join(", "));
		}

		printButton.type = "button";
		printButton.value= "Print";
		printButton.onclick=()=>{ DEBUGTOOLS.generatePdf(()=>{}, basename+".pdf", result.pages ) }
		root.appendChild(printButton);
		root.appendChild(document.createElement("hr"));

		root.insertBefore(resultDiv,root.childNodes[0]);
		
		result.pages.forEach((page,id)=>{
			let
				downloadButton = document.createElement("input"),
				div = document.createElement("div");
			div.style.display="inline-block";
			div.style.border = "1px solid #000";
			div.style.boxShadow = "1px 1px 2px #000";
			div.style.margin = "10px 0";

			root.appendChild(document.createElement("hr"));
			downloadButton.type = "button";
			downloadButton.value="Download SVG Page "+(id+1);
			downloadButton.onclick=()=>{ page.downloadSVG(basename+"-page"+(id+1)+".svg") }
			root.appendChild(downloadButton);
			root.appendChild(document.createElement("hr"));

			div.innerHTML = page.getSVG();
			root.appendChild(div);
		})
	}
}