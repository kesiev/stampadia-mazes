function DungeonPrinter(modifiers) {
    
    let
        CARD_LIMIT = 41.5001,
        VERSIONS = [ "A", "B", "C", "D" ],
        ACTIONS = {
            move:"actionMove",
            fakeMove:"actionMove",
            rotate:"actionRotate",
            flip:"actionRotate",
            interact:"actionInteract",
            talk:"actionTalk",
            see:"actionSee",
            teleport:"actionTeleport",
            look:"actionLook",
            none:"actionNone",
        };

    
    function getCardSmallSymbol(settings, addversion, card, position, fromcard) {
        let
            out;
        if (card.noCard)
            return "{symbol symbolCardWall}";
        else switch (settings.deck.setMode) {
            case SETMODE_TENS:{
                if (settings.deck.avoidFromCardInDirections) {
                    out = "{symbol "+(position == 1 ? "symbolCardBorder" : position == 3 ? "symbolCardDashed" : "symbolCardSet0")+" "+card.setIndex+"}";
                } else {
                    out = "{symbol "+(fromcard && (card.index == fromcard.index) ? "symbolCardOutline" : "symbolCardSet0")+" "+card.setIndex+"}";
                }
                break;
            }
            case SETMODE_MIXED:
            case SETMODE_SYMBOLS:{
                if (settings.deck.avoidFromCardInDirections) {
                    out = "{symbol symbolCard"+(card.setSymbol ? "Outline" : "")+"Set"+card.setSymbol+" "+card.setIndex+"}";
                } else {
                    out = "{symbol symbolCard"+(fromcard && (card.index == fromcard.index) ? "Outline" : "")+"Set"+card.setSymbol+" "+card.setIndex+"}";
                }
                break;
            }
        }
        if (addversion !== null)
            out+="{symbol symbolVersion "+VERSIONS[addversion]+"}";
        return out;
    }

    function getCardLargeSymbol(settings, card) {
        switch (settings.deck.setMode) {
            case SETMODE_TENS:{
                return "valueSymbolSet0";
            }
            case SETMODE_MIXED:
            case SETMODE_SYMBOLS:{
                return "valueSymbolSet" + card.setSymbol;
            }
        }
    }

    function printDungeonCard(settings,svg,x,y,biome,card) {

        let
            symbolsSettings={
                modelId:"heroCardLargeText",
                wordSpacing:WORDSPACING,
                lineSpacing:LINESPACING,
                textGap:LARGETEXTGAP,
                verticalAlignment:"center",
                horizontalAlignment:"center"
            },
            cardTextSettings={
                modelId:"heroCardText",
                wordSpacing:WORDSPACING,
                lineSpacing:1.7,
                textGap:TEXTGAP,
                verticalAlignment:"top",
                horizontalAlignment:"left",
                symbolsText:{
                    modelId:"heroCardText",
                    wordSpacing:WORDSPACING,
                    lineSpacing:LINESPACING,
                    textGap:TEXTGAP,
                    verticalAlignment:"center",
                    horizontalAlignment:"center"
                }
            },
            cardPrinter=new CardPrinter(svg,"dungeonCard",x,y),
            cutout,
            cursor,
            cursorY = 0,
            rulers,
            textboxPlaceholder1,
            textboxPlaceholder2,
            cutoutPlaceholder,
            textBoxes = [ { content:"" }, { content:"" } ];
    
        cardPrinter.setEdges("dungeonCardEdges");
        cardPrinter.setBorder("dungeonCardBorder");
        cardPrinter.setLargeSymbolsSize("valueSymbolEdges");
        cardPrinter.setInnerBorderSpacing(INNERBORDERSPACING);
    
        function cleanSide() {
            if (!card.setSymbol)
                cardPrinter.delete([
                    "dungeonCardFrameGray",
                    "dungeonCardFrameGrayLower"
                ])

            cardPrinter.delete([
                "dungeonCardImage",
                "dungeonCardBorder"
            ]);
        }

        function getPlaceholders() {
            imagePlaceholder = cardPrinter.getPlaceholder("dungeonCardImage", 0, true);
            textboxPlaceholder1 = cardPrinter.getPlaceholder("dungeonCardTextbox1");
            textboxPlaceholder2 = cardPrinter.getPlaceholder("dungeonCardTextbox2");
            textboxPlaceholderFull = cardPrinter.getPlaceholder("dungeonCardTextboxFull");
            cutoutPlaceholder = cardPrinter.getPlaceholder("dungeonCardCutout");
        }

        function cleanBorders(all) {
            
            if (all || !settings.border)
                cardPrinter.delete([
                    "dungeonCardDashedBorder"
                ]);

            if (all || !settings.cross) 
                cardPrinter.delete([
                    "dungeonCardCross1",
                    "dungeonCardCross2",
                    "dungeonCardCross3",
                    "dungeonCardCross4",
                    "dungeonCardCross5",
                    "dungeonCardCross6",
                    "dungeonCardCross7",
                    "dungeonCardCross8",
                ]);
        }

        function finalizeTopSide() {
            if (!settings.noCode)
                cardPrinter.printAt("cardCodeText",rulers.cardNumber,card.cardCode);
        }
    
        cardPrinter.startUpperSide();
        rulers = cardPrinter.getDungeonCardRulers();

        getPlaceholders();

        // printSide(settings,data,data.sides[0],true);
        card.type.forEach(type=>{
            if (biome[type])
                biome[type].forEach(layer=>cardPrinter.addStencil(layer,"dungeonCardImage",imagePlaceholder,0));
            else
                cardPrinter.addStencil(type,"dungeonCardImage",imagePlaceholder,0);
        });
        if (card.decorations)
            card.decorations.forEach(type=>{
                if (biome[type])
                    biome[type].forEach(layer=>cardPrinter.addStencil(layer,"dungeonCardImage",imagePlaceholder,0));
                else
                    cardPrinter.addStencil(type,"dungeonCardImage",imagePlaceholder,0);
            });

        if (!card.isTutorial) {
            cardPrinter.addLargeSymbol(getCardLargeSymbol(settings, card),rulers.cardIdSymbol,symbolsSettings,card.setIndex);
            cardPrinter.addLargeSymbol("versionSymbol",rulers.cardVersionSymbol,symbolsSettings,VERSIONS[card.version]);
        }

        if (card.isInstant) {
            cardPrinter.delete([
                "dungeonCardActionTab",
                "dungeonCardActionTabBorder"
            ]);
        } else {
            cardPrinter.delete([
                "dungeonCardInstantTab",
                "dungeonCardInstantTabBorder"
            ]);
        }

        card.boxes.forEach(box=>{

            cardPrinter.replaceWithStencil(ACTIONS[box.id],"dungeonCardActionIcon",0);

            switch (box.id) {
                case "flip":
                case "rotate":{
                    textBoxes = 0;
                    cardPrinter.delete([ "separator" ]);
                    finalizeTopSide();
                    cleanSide();
                    cleanBorders(true);
                    if (card._title)
                        cardPrinter.setTitle(card._title);
                    cardPrinter.delete([
                        "dungeonCardFrameGrayLower"
                    ]);

                    // --- Prepare flipside
                    cardPrinter.startLowerSide();
                    getPlaceholders();
                    card.flipType.forEach(type=>{
                        if (biome[type])
                            biome[type].forEach(layer=>cardPrinter.addStencil(layer,"dungeonCardImage",imagePlaceholder,0));
                        else
                            cardPrinter.addStencil(type,"dungeonCardImage",imagePlaceholder,0);
                    })
                    cardPrinter.addLargeSymbol(getCardLargeSymbol(settings, card),rulers.cardIdSymbol,symbolsSettings,card.setIndex);
                    cardPrinter.addLargeSymbol("versionSymbol",rulers.cardVersionSymbol,symbolsSettings,VERSIONS[card.version+1]);
                    if (box.id == "rotate")
                        cardPrinter.replaceWithStencil("actionRotate","dungeonCardActionIcon",0);
                    else {
                        cardPrinter.delete([
                            "dungeonCardActionIcon",
                            "dungeonCardActionTab",
                            "dungeonCardActionTabBorder"
                        ]);
                    }
                    cardPrinter.delete([
                        "dungeonCardInstantTab",
                        "dungeonCardInstantTabBorder",
                        "separator"
                    ]);
                    cleanSide();
                    cleanBorders();
                    cardPrinter.delete([
                        "dungeonCardFrameGrayLower"
                    ]);
                    break;
                }
                default:{
                    let
                        items = box.items;

                    if (card.isAggregate) {
                        let
                            index = {};

                        items = [];
                        box.items.forEach(item=>{
                            if (item.from) {
                                let
                                    group = (item.condition || "x") +
                                        (item.ifInteractions ? item.ifInteractions.map(i=>getCardSmallSymbol(settings,  i.version, i.card, 0, card)).join(", ") : "x") +
                                        (item.line || "x");
                                if (!index[group])
                                    index[group] = [];
                                index[group].push(item);
                            }
                        });
                        box.items.forEach(item=>{
                            if (item.from) {
                                if (index) {
                                    for (let k in index) {
                                        let
                                            newLine = { froms:[] };
                                        for (let sk in index[k][0])
                                            newLine[sk] = index[k][0][sk];
                                        delete newLine.from;
                                        index[k].forEach(line=>{
                                            newLine.froms.push(line.from);
                                        })
                                        items.push(newLine);
                                    }
                                    index = 0;
                                }
                            } else
                                items.push(item);
                        });
                    }
                    items.forEach((item,row)=>{
                        let
                            textBox = card.multiColumn ? textBoxes[row > 5 ? 1 : 0] : textBoxes[0];

                        if (item.from)
                            textBox.content += "{symbol symbolPosition "+item.from.id+"}: ";
                        if (item.froms) {
                            item.froms.forEach(from=>{
                                textBox.content += "{symbol symbolPosition "+from.id+"}/";
                            });
                            textBox.content = textBox.content.substr(0,textBox.content.length-1)+":";
                        }
                        if (item.ifInteractions)
                            textBox.content+=item.ifInteractions.map(i=>"{spacing -0.85}"+getCardSmallSymbol(settings,  i.version, i.card, 0, card)+"{endspacing}").join(", ")+": ";
                        if (item.condition)
                            textBox.content += item.condition+" ";
                        if (item.line)
                            textBox.content += item.line;
                        if (item.cutout)
                            cutout = item.cutout;
                        if (item.card) {
                            textBox.content += "{spacing -0.85}"+getCardSmallSymbol(settings, item.card.version, item.card, 0, card)+"{endspacing}";
                            textBox.content += "{symbol symbolSwapTo}";
                            textBox.content += "{spacing -0.85}"+getCardSmallSymbol(settings, item.toCard.version, item.toCard, 0, card)+"{endspacing}";
                        }
                        if (item.to) {
                            textBox.content +="{spacing -0.85}{symbol symbolPosition "+item.to.id+"}";
                            item.camera.forEach((subcard,pos)=>{
                                textBox.content +=getCardSmallSymbol(settings, null, subcard, pos, card);
                            })
                            textBox.content += "{endspacing}";
                        }
                        textBox.content += "\n";
                    })
                    break;
                }
            }
        })

        if (cutout)
            cutout.forEach(cut=>{
                switch (cut.type) {
                    case "symbol":{
                        cardPrinter.addStencil(cut.id,"dungeonCardImage",cutoutPlaceholder,0);
                        break;
                    }
                    case "canvas":{
                        cardPrinter.addCanvas(cut.canvas,"dungeonCardImage",cutoutPlaceholder);
                        break;
                    }
                }
            })

        if (textBoxes) {

            if (card.isCentered) {
                cardTextSettings.horizontalAlignment = "center";
                cardTextSettings.verticalAlignment = "center";
            } else {
                cardTextSettings.verticalAlignment = "top";
                cardTextSettings.horizontalAlignment = "left";
            }

            if (textBoxes[0].content) {

                if (textBoxes[1].content.length) {
                    
                    cursor = cardPrinter.addText(cardTextSettings,textboxPlaceholder1,textBoxes[0].content);
                    cursorY = Math.max(cursorY, cursor.cursorY);
                    cursor = cardPrinter.addText(cardTextSettings,textboxPlaceholder2,textBoxes[1].content);
                    cursorY = Math.max(cursorY, cursor.cursorY);

                } else {

                    cursor = cardPrinter.addText(cardTextSettings,textboxPlaceholderFull,textBoxes[0].content);
                    cursorY = Math.max(cursorY, cursor.cursorY);
                    cardPrinter.delete([ "separator" ]);

                }

            }
            
            if (!textBoxes[0].content || card.isTutorial) {
                cardPrinter.delete([
                    "dungeonCardActionIcon",
                    "dungeonCardActionTab",
                    "dungeonCardActionTabBorder",
                    "dungeonCardInstantTab",
                    "dungeonCardInstantTabBorder",
                    "separator"
                ]);
            }

            finalizeTopSide();
            cleanSide();
            cleanBorders();

        }

        if (card._hilight)
            cardPrinter.hilight(1,"#f00");

        if (card._title)
            cardPrinter.setTitle(card._title);

        if (cursorY > CARD_LIMIT) {
            console.warn("Card too long:",card.setIndex,"v",card.version,":",cursorY,">",CARD_LIMIT);
            return false;
        } else {
            return true;
        }
    }

    function printPlaySheet(settings,svg,language,deck) {

        let
            referenceTextSettings={
                modelId:"heroCardText",
                wordSpacing:WORDSPACING,
                lineSpacing:0.75,
                textGap:TEXTGAP,
                verticalAlignment:"top",
                horizontalAlignment:"left",
                symbolsText:{
                    modelId:"heroCardText",
                    wordSpacing:WORDSPACING,
                    lineSpacing:LINESPACING,
                    textGap:TEXTGAP,
                    verticalAlignment:"center",
                    horizontalAlignment:"center"
                }
            },
            cardTextSettings={
                modelId:"heroCardText",
                wordSpacing:WORDSPACING,
                lineSpacing:1.15,
                textGap:TEXTGAP,
                verticalAlignment:"center",
                horizontalAlignment:"left",
                symbolsText:{
                    modelId:"heroCardText",
                    wordSpacing:WORDSPACING,
                    lineSpacing:LINESPACING,
                    textGap:TEXTGAP,
                    verticalAlignment:"center",
                    horizontalAlignment:"center"
                }
            },
            instructionsPlaceholder,
            cardPrinter=new CardPrinter(svg,"playSheet",0,0),
            placeHolders = {
                startTeleport: "{spacing -0.85}{symbol symbolPosition A}"+
                    getCardSmallSymbol(settings, null, deck.meta.startingCamera[0], 0)+
                    getCardSmallSymbol(settings, null, deck.meta.startingCamera[1], 1)+
                    getCardSmallSymbol(settings, null, deck.meta.startingCamera[2], 2)+
                    getCardSmallSymbol(settings, null, deck.meta.startingCamera[3], 3)+
                    "{endspacing}",
                samplePlace: "B",
                sampleTeleport: "{spacing -0.85}{symbol symbolPosition B}"+
                    getCardSmallSymbol(settings, null, deck.cards[1], 0)+
                    getCardSmallSymbol(settings, null, deck.cards[11], 1)+
                    getCardSmallSymbol(settings, null, { noCard:true }, 2)+
                    getCardSmallSymbol(settings, null, deck.cards[3], 3)+
                    "{endspacing}",
                sampleTeleport1: "{spacing -0.85}"+
                    getCardSmallSymbol(settings, null, deck.cards[1], 0)+
                    getCardSmallSymbol(settings, null, deck.cards[11], 1)+
                    "{endspacing}",
                sampleTeleport2:getCardSmallSymbol(settings, null, deck.cards[3], 3)
            };

        function solvePlaceholders(text) {
            return text.replace(/\[\[([^\]]+)\]\]/g,(m,m1)=>placeHolders[m1]);
        }
    
        cardPrinter.setEdges("playSheetEdges");
        cardPrinter.setBorder("playSheetBorder");
        cardPrinter.setLargeSymbolsSize("valueSymbolEdges");
        cardPrinter.setInnerBorderSpacing(INNERBORDERSPACING);

        instructionsPlaceholder = cardPrinter.getPlaceholder("playSheetInstructions");
        teleportPlaceholder = cardPrinter.getPlaceholder("playSheetTeleport");

        cardPrinter.startUpperSide();

        cardPrinter.addText(referenceTextSettings,instructionsPlaceholder,solvePlaceholders(LANGUAGES[language].quickReference));
        cardPrinter.addText(cardTextSettings,teleportPlaceholder,solvePlaceholders(LANGUAGES[language].teleport));
    
        cardPrinter.delete([
            "playSheetBorder",
            "playSheetLowerBox"
        ]);
    }

    this.ACTIONS = ACTIONS;

    this.print=(settings,biome,deck,language,then)=>{

        const template=new SVGTemplate((settings.root||"")+"svg/model.svg",true);
        template.load(()=>{

            let
                cardWidth = CARDWIDTH+CARDSPACING,
                cardHeight = CARDHEIGHT+CARDSPACING,
                borderTop=(SHEETHEIGHT-(CARDHEIGHT*3+CARDSPACING*2))/2,
                borderLeft=(SHEETWIDTH-(CARDWIDTH*3+CARDSPACING*2))/2,
                cardPosition = 0,
                svg = new SVG(template),
                out = {
                    isValid:true,
                    pages:[],
                    invalidCards:[]
                },
                x, y, dx, dy;

            deck.cards.forEach(card=>{

                let
                    isValid;

                if (cardPosition == 9) {
                    svg.finalize();
                    out.pages.push(svg);
                    svg=new SVG(template);
                    cardPosition = 0;
                }

                x=settings.flipX?2-cardPosition%3:cardPosition%3,
                y=Math.floor(cardPosition/3),
                dx=borderLeft+(cardWidth*x),
                dy=borderTop+(cardHeight*y);
                cardPosition++;
                
                isValid =printDungeonCard(settings,svg,dx,dy,biome,card);
                out.isValid &= isValid;
                if (!isValid)
                    out.invalidCards.push(card);
            });

            svg.finalize();
            out.pages.push(svg);

            if (!settings.cardsOnly) {
                svg=new SVG(template);
                printPlaySheet(settings,svg,language,deck);
                svg.finalize();
                out.pages.push(svg);
            }

            then(out);

        });

    }
    
}
