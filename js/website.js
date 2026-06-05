function Website() {

	const
		DEBUG = window.location.hash == "#_debug";

	let
		generation,
		resources,
		downloadLink,
		isDownloadAvailable,
		settings,
		progress,
		gameData,
		currentLanguageId,
		currentLanguage,
		nodeTopBar,
		nodeConfirmBar,
		nodeSettings,
		nodeFooter,
		nodeSettingsContent,
		nodeBox,
		nodeHeader,
		nodeTitle,
		nodeTips,
		nodeDiskContainer,
		nodePleaseWait;

	// --- All

	function getCreditsLine() {
		return currentLanguage.notes + " - "+
			CONFIG.TITLE+" "+CONFIG.VERSION+" - "+
			"&copy; "+(CONFIG.STARTYEAR == CONFIG.STARTYEAR ? CONFIG.STARTYEAR : CONFIG.STARTYEAR + "-" + CONFIG.startYear )+" "+
			currentLanguage.by+" "+CONFIG.AUTHOR+" - " +
			currentLanguage.sourcesAt +" <a target=\"_blank\" href=\""+CONFIG.SOURCESURL+"\">" + CONFIG.SOURCESURL.replace("https://","") + "</a> - "+
			"<a href=\"learn.html\">" + currentLanguage.learnHowToPlay + "</a>";
	}

	// --- Play

	function generatePdf(cb, filename, pages, doc, id) {

		if (!id) id=0;

		if (!doc)
			doc = new jspdf.jsPDF({
				orientation: 'p',
				unit: 'mm'
			});

		if (pages[id]) {

			if (id>0) doc.addPage();

			let
				pdfNode = document.createElement("div");
				
			pdfNode.innerHTML=pages[id].getSVG();
			const svgElement = pdfNode.firstElementChild;
			svgElement.getBoundingClientRect();
			doc.svg(svgElement).then(()=>generatePdf(cb,filename,pages,doc,id+1));

		} else {

			downloadLink = document.createElement("a");
			downloadLink.style.display = "none";
			const blob = new Blob([doc.output('arraybuffer')], {
				type: "application/pdf"
			});
			const url = window.URL.createObjectURL(blob);
			downloadLink.href = url;
			downloadLink.download = filename;
			cb();

		}

	}

	function progressUpdate() {
		let
			dataToClean = [],
			uuids = [];

		// --- Update game process

		PASSAGES.forEach(passage=>uuids.push(passage.uuid));
		SPECIALS.forEach(special=>uuids.push(special.uuid));

		if (generation.seed != progress.lastSeed) {
			progress.lastSeed = generation.seed;
			progress.plays++;
		}
		
		generation.selectedEvents.forEach(selectedEvent=>{
			let
				uuid = selectedEvent.event.uuid;
			if (progress.e.indexOf(uuid) == -1)
				progress.e.push(uuid);
		})

		generation.selectedSpecials.forEach(selectedSpecial=>{
			let
				uuid = selectedSpecial.uuid;
			if (progress.e.indexOf(uuid) == -1)
				progress.e.push(uuid);
		})

		progress.e = progress.e.filter(e=>uuids.indexOf(e)!=-1);
		progress.completion = progress.e.length / uuids.length;

		nodeProgress.style.width = (progress.completion*100)+"%";

		// --- Update game data

		gameData = generation.gameData;

		for (let k in gameData) {
			let
				clean = true;
			for (let i in gameData[k])
				if ((i!="lastSeed") && (i!="processed")) {
					clean = false;
					break;
				}
			if (clean)
				dataToClean.push(k);
			else if (gameData[k].processed) {
				delete gameData[k].processed;
				gameData[k].lastSeed = generation.seed;
			}
		}

		dataToClean.forEach(k=>delete gameData[k]);

		saveSettings();
	}

	function download() {
		progressUpdate();
		document.body.appendChild(downloadLink);
		downloadLink.click();
		document.body.removeChild(downloadLink);
	}

	function startDownload() {
		if (isDownloadAvailable) {
			if (downloadLink)
				download();
			else {
				let
					printer = new DungeonPrinter();

				isDownloadAvailable = false;
				nodeTopBar.className = "";
				nodeBox.className = "";
				nodeDiskContainer.className = "working";
				nodePleaseWait.className = "show";
				
				setTimeout(()=>{

					let
						printMode = PRINT_MODES[settings.printMode],
						printSettings = {
							deck:GENERATOR.deck
						};

					for (let k in printMode)
						printSettings[k] = printMode[k];

					generation = Generator({
						_debug:DEBUG,
						generator:GENERATOR,
						passages:PASSAGES,
						specials:SPECIALS,
						resources:resources,
						gameData:gameData,
						gameProgress:progress,
					}, currentLanguageId, 0);

					printer.print(printSettings, generation.biome, generation.deck, currentLanguageId, (result)=>{
						generatePdf(()=>{
							download();
							setTimeout(()=>{
								isDownloadAvailable = true;
								nodeTopBar.className = "show";
								nodeBox.className = "show";
								nodeDiskContainer.className = "show";
								nodePleaseWait.className = "";
							},500);
						}, generation.basename+".pdf", result.pages)
					})

				},500);

			}
		}
	}

	function loadSettings() {
	    if (localStorage) {
			if (localStorage[CONFIG.SETTINGSKEY]) {
				try {
					settings = JSON.parse(localStorage[CONFIG.SETTINGSKEY]);
				} catch(e) {}
			}
			if (localStorage[CONFIG.PROGRESSKEY]) {
				try {
					progress = JSON.parse(localStorage[CONFIG.PROGRESSKEY]);
				} catch(e) {}
			}
			if (localStorage[CONFIG.GAMEDATAKEY]) {
				try {
					gameData = JSON.parse(localStorage[CONFIG.GAMEDATAKEY]);
				} catch(e) {}
			}
		}

	    if (!settings) settings={};
		if (!progress) progress={};
		if (!gameData) gameData={};
		if (!progress.plays) progress.plays=0;
		if (!progress.e) progress.e=[];
		if (!progress.completion) progress.completion=0;
		if (!progress.lastSeed) progress.lastSeed=-1;

	    if (!settings.printMode || (CONFIG.PRINT_MODES.indexOf(settings.printMode) == -1))
	    	settings.printMode = "default";

	    if (!settings.language) {
	        let
	            defaultLanguage="EN",
	            userLang = navigator.language || navigator.userLanguage;

	        if (userLang) {
	            userLang=userLang.split("-")[0].toLowerCase();
	            CONFIG.LANGUAGES.forEach(language=>{
	            	if (language.id == userLang)
	            		defaultLanguage = language.id;
	            })
	        }
	        settings.language = defaultLanguage;
	    }
	}

	function saveSettings() {
	    if (localStorage) {
	    	localStorage[CONFIG.SETTINGSKEY]=JSON.stringify(settings);
			localStorage[CONFIG.PROGRESSKEY]=JSON.stringify(progress);
			localStorage[CONFIG.GAMEDATAKEY]=JSON.stringify(gameData);
		}
	}

	function createNode(parent,type,className,content) {
        let node=document.createElement(type);
        if (className) node.className=className;
        if (content) node.innerHTML=content;
        if (parent) parent.appendChild(node);
        return node;
    }

	function openSettings() {
		let
			box,
			button,
			row,
			printModeSelector,
			printModeDescription;

		nodeSettingsContent.innerHTML = "";
		nodeTopBar.className = "";
		nodeBox.className = "";
		nodeConfirmBar.className = "show";
		nodeSettingsMessage.className = "show";
		nodeDiskContainer.className = "settings";

		createNode(nodeSettingsContent,"span","header accent",currentLanguage.settings);
		row=createNode(nodeSettingsContent,"div");
		createNode(row,"span",0,currentLanguage.printMode+": ");
		printModeSelector=createNode(row,"select");
		CONFIG.PRINT_MODES.forEach(printmode=>{
			let
				option = createNode(printModeSelector,"option",0,currentLanguage.printModes[printmode].label);
            option.value=printmode;
		})
		printModeDescription = createNode(nodeSettingsContent,"div","notes");

		printModeSelector.onchange=()=>{
			if (settings.printMode != printModeSelector.value) {
				downloadLink = 0;
				settings.printMode = printModeSelector.value;
				saveSettings();
			}
			printModeDescription.innerHTML = currentLanguage.printModes[settings.printMode].description;
		}

        printModeSelector.value = settings.printMode;
        printModeSelector.onchange();

		createNode(nodeSettingsContent,"div","separator");
		createNode(nodeSettingsContent,"span",0,currentLanguage.savedData+": ");
		box = createNode(nodeSettingsContent,"div");

		button = createNode(box,"input",0);
		button.type = "button";
		button.value = currentLanguage.savedDataExport;
		button.onclick = exportSave;

		button = createNode(box,"input",0);
		button.type = "button";
		button.value = currentLanguage.savedDataImport;
		button.onclick = ()=>{
			importSave(
				()=>{
					alert(currentLanguage.savedDataImported);
					setLanguage();
				},
				()=>{
					alert(currentLanguage.savedDataError);
				},
				(saveVersion, gameVersion, ok)=>{
					let
						result,
						message = currentLanguage.savedDataWarn
							.replace(/\{gameVersion\}/g, gameVersion)
							.replace(/\{saveVersion\}/g, saveVersion);

					result = confirm(message);
					if (result)
						ok();
				}
			);
		}

        isDownloadAvailable = false;
	}

	function setLanguage(language) {
		let
			links;

		if (language) {
			currentLanguageId = language;
			currentLanguage = LANGUAGES[language];
		}
		nodeSettings.innerHTML = currentLanguage.settings;
		nodeConfirm.innerHTML = currentLanguage.confirm;
		nodeFooter.innerHTML = getCreditsLine();

		nodeHeader.innerHTML = CONFIG.TITLE;
		nodeTitle.innerHTML = (DEBUG ? "DEBUG #" : currentLanguage.attemptPrefix)+Generator.getTodaySeed()+currentLanguage.attemptSuffix;
		nodeTips.innerHTML = currentLanguage.tips;
		nodePleaseWait.innerHTML = currentLanguage.pleaseWait;

		nodeTopBar.className = "show";
		nodeConfirmBar.className = "";
		nodeSettingsMessage.className = "";
		nodeBox.className = "show";
		nodeDiskContainer.className = "show";
		nodePleaseWait.className = "";
		nodeProgress.style.width = (progress.completion*100)+"%";

		links = document.getElementsByClassName("downloadlink");

		for (let i=0;i<links.length;i++)
			links[i].onclick = ()=>{ startDownload() };

		isDownloadAvailable = true;
	}

	function cyrb53(str, seed = 0) {
        let
            h1 = 0xdeadbeef ^ seed,
            h2 = 0x41c6ce57 ^ seed;
        for(let i = 0, ch; i < str.length; i++) {
            ch = str.charCodeAt(i);
            h1 = Math.imul(h1 ^ ch, 2654435761);
            h2 = Math.imul(h2 ^ ch, 1597334677);
        }
        h1  = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
        h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
        h2  = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
        h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
        return 4294967296 * (2097151 & h2) + (h1 >>> 0);
    };

	function leftPad (value, len, padding) {
		let
			ret = value ? value.toString() : "0";
		if (!padding)
			padding = "0";
		while (ret.length<len)
			ret = padding+ret;
		return ret;
	}

	function exportSave() {
		let
			now = new Date(),
			data = JSON.stringify({
				v:CONFIG.VERSION,
				t:CONFIG.SHORTTITLE,
				d:{
					progress:progress,
					gameData:gameData
				}
			}),
			checksum = cyrb53(data),
			serialized = btoa(checksum+"|"+data),
			a = document.createElement("a"),
			blob = new Blob([serialized], { type: "text/plain" }),
			url = window.URL.createObjectURL(blob);

		document.body.appendChild(a);
		a.style.display = "none";
		a.href = url;
		a.download =
			CONFIG.SAVEDATA_PREFIX+
			CONFIG.VERSION.replace(/\./g,"_")+
			"-"+
			leftPad(now.getFullYear(),4)+
			leftPad(now.getMonth()+1,2)+
			leftPad(now.getDate(),2)+
			"-"+
			leftPad(now.getHours(),2)+
			"_"+
			leftPad(now.getMinutes(),2)+
			"."+CONFIG.SAVEDATA_EXTENSION;
		a.click();
		document.body.removeChild(a);
    }

	function importSave(onloaded,onerror,onwarning) {
		let
			input = document.createElement("input");

		input.style.display = "none";
		input.setAttribute("type","file");                                
		input.setAttribute("accept","."+CONFIG.SAVEDATA_EXTENSION);

		input.onchange=(e)=>{
			let
				data = input.files[0];

			if (data instanceof File) {

				let
					reader = new FileReader();
				
				reader.onloadend = (e)=>{
					debugger;
					if (e.target && e.target.result) {
						let
							isOk,
							isWarning,
							dataObject,
							unserialized;

						try {
							unserialized = atob(e.target.result);
						} catch (e) {
							console.warn(e);
							unserialized = 0;
						}

						if (unserialized) {
							let
								splitterPos = unserialized.indexOf("|");

							if (splitterPos != 1) {
								let
									dataChecksum = parseInt(unserialized.substr(0,splitterPos)),
									data = unserialized.substr(splitterPos+1),
									checksum = cyrb53(data);

								if (dataChecksum == checksum) {
									try {
										dataObject = JSON.parse(data);
									} catch(e) {
										console.warn(e);
										dataObject = 0;
									}
									if (dataObject && dataObject.v && dataObject.t && dataObject.d) {
										if (dataObject.t == CONFIG.SHORTTITLE) {
											isOk = true;
											if (dataObject.v != CONFIG.VERSION)
												isWarning = true;
										}
									}
								}   
							}
						}

						if (isOk) {
							if (isWarning)
								onwarning(
									dataObject.v, CONFIG.VERSION,
									()=>{
										progress = dataObject.d.progress;
										gameData = dataObject.d.gameData;
										saveSettings();
										onloaded();
									}
								);
							else {
								progress = dataObject.d.progress;
								gameData = dataObject.d.gameData;
								saveSettings();
								onloaded();
							}
						} else
							onerror();
					} else
						onerror();
				}

				reader.readAsText(data);

			} else
				onerror();
			document.body.removeChild(input);
		}
		input.oncancel=()=>{
			document.body.removeChild(input);
		}
		document.body.appendChild(input);
		input.click();
	}

	// --- Learn

	function formatText(text) {
        return text.replace(/\{title\}/g,"<span class=\"accent\">"+CONFIG.TITLE+"</span>")
            .replace(/\{anchor\}/g,"<a target=\"_blank\" href=\"")
            .replace(/\{anchorBody\}/g,"\">")
            .replace(/\{endAnchor\}/g,"</a>")
            .replace(/\{manualLink\}/g,"<a target=\"_blank\" href=\""+manualLink+"\">")
            .replace(/\{endManualLink\}/g,"</a>")
            .replace(/\{tutorialLink\}/g,"<a target=\"_blank\" href=\""+tutorialLink+"\">")
            .replace(/\{endTutorialLink\}/g,"</a>")
            .replace(/\{accent\}/g,"<span class=\"accent\">")
            .replace(/\{endAccent\}/g,"</span>")
            .replace(/\{header\}/g,"<span class=\"header\">")
            .replace(/\{endHeader\}/g,"</span>");
    }

	function setLearnLanguage(lang) {
		
        let
            faqHtml="",
            translatables = document.getElementsByClassName("translatable"),
            manualLinks = document.getElementsByClassName("manualLink");

		currentLanguageId = lang;
		currentLanguage = LANGUAGES[lang];

		manualLink = "manuals/manual-"+currentLanguageId+".pdf";
		tutorialLink = "manuals/tutorial-"+currentLanguageId+".pdf";
		document.title = CONFIG.TITLE + " - " + currentLanguage.learnHowToPlay;
		
		for (let i=0;i<translatables.length;i++)
			translatables[i].innerHTML = formatText(currentLanguage[translatables[i].id]);
		
		for (let i=0;i<manualLinks.length;i++)
			manualLinks[i].href = manualLink;

		document.getElementById("credits").innerHTML = getCreditsLine();

		currentLanguage.faqsList.forEach(faq=>{
			faqHtml+="<h2>"+faq.section+"</h2>";
			faq.questions.forEach(question=>{
				faqHtml+="<div class=\"q\">Q: "+formatText(question.q)+"</div>";
				faqHtml+="<div class=\"a\">A: "+formatText(question.a)+"</div>";
			});
		});

		document.getElementById("faqsbox").innerHTML=faqHtml;

	}

	return {
		learn:()=>{
			loadSettings();
			setLearnLanguage(settings.language);
		},
		play:()=>{
			isDownloadAvailable = false;
			loadSettings();

			nodeSettings = document.getElementById("settings");
			nodeTopBar = document.getElementById("topbar");
			nodeFooter = document.getElementById("footer");
			nodeSettingsContent = document.getElementById("settingsmessagecontent");
			nodeSettingsMessage = document.getElementById("settingsmessage");
			nodeConfirmBar = document.getElementById("confirmbar");
			nodeConfirm = document.getElementById("confirm");
			nodeBox = document.getElementById("box");
			nodeProgress = document.getElementById("progress");
			nodeHeader = document.getElementById("header");
			nodeTitle = document.getElementById("title");
			nodeTips = document.getElementById("tips");
			nodeDiskContainer = document.getElementById("diskcontainer");
			nodePleaseWait = document.getElementById("pleasewait");

			resources = new Resources();

			resources.load(()=>{
				setTimeout(()=>{
					nodeSettings.onclick=()=>{
						openSettings();
					}
					nodeConfirm.onclick=()=>{
						setLanguage();
					}
					
					setLanguage("EN");				
				},1000);
			});
		}
	}
}