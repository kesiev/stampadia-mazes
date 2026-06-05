const
    DEBUG=false,
    CARDNUMBERSIZE=1.5,
    CARDNUMBERSPACING=0.35,
    CARDWIDTH=64,
    CARDHEIGHT=89,
    SHEETWIDTH=210,
    SHEETHEIGHT=297,
    CARDSPACING=0,
    WORDSPACING=0.5,
    LINESPACING=0,
    TEXTGAP=0.9;
    SMALLTEXTGAP=0.6,
    LARGETEXTGAP=1.1,
    INNERBORDERSPACING=1,
    EMPTYLINESIZE=2,
    SYMBOLDISTANCE=9.5;

let
    SIZERATIO = 1,
    ITALICSPACING = 0;

function CardPrinter(svg,modelid,x,y) {
    let
        side=0,
        containerNode=svg.getById(modelid),
        cardBorderSize=0,
        largeSymbolsSize=0,
        width=0,
        height=0,
        fullCard=0,
        halfCard=0,
        root = svg.node.getElementsByTagName("svg")[0];
        bboxWidth = root.getBBox().width;

    // Firefox gets different sizes

    if (bboxWidth>10000) {
        SIZERATIO = 0.01;
        ITALICSPACING = -1.4;
    }

    function createQrNode(qr,x,y,width,height) {      
        var mc,mr,
            moduleCount=qr.getModuleCount(),
            cells=moduleCount+8,
            cellSize=Math.min(width/cells,height/cells),
            margin = cellSize*4,
            node = document.createElement("path"),
            rect = 'l' + cellSize + ',0 0,' + cellSize +
                ' -' + cellSize + ',0 0,-' + cellSize + 'z ',
            path = "";

        for (r = 0; r < moduleCount; r += 1) {
            mr = y+(r * cellSize + margin);
            for (c = 0; c < moduleCount; c += 1)
                if (qr.isDark(r, c) ) {
                    mc = x+(c*cellSize+margin);
                    path += 'M' + mc + ',' + mr + rect;
                }
        }

        node.setAttribute("style","display:inline;opacity:1;fill:#000000;stroke:none");
        node.setAttribute("d", path);

        return node;
    }

    function createRectangle(x,y,w,h) {

        let
            height=h-(cardBorderSize*2),
            cardInnerBorder = cardBorderSize+largeSymbolsSize+cardBorderInnerSpacing;

        return {
            full:{
                x:x,
                y:y,
                width:w,
                height:h
            },
            content:{
                x:x+cardBorderSize,
                y:y+cardBorderSize,
                width:width-(cardBorderSize*2),
                height:height,
                halfHeight:height/2
            },
            inner:{
                x:x+cardInnerBorder,
                y:y+cardBorderSize,
                width:width-(cardInnerBorder*2),
                height:height,
                halfHeight:height/2
            }
        }
    }

    function calculateSizes() {
        fullCard=createRectangle(0,0,width,height);
        halfCard=createRectangle(0,0,width,height/2);
    }

    function cloneNodeBy(into,id,newid,dx,dy,rotate,before) {
        let org,edgex=0,edgey=0,edgewidth=0,edge,ex,ey;
        if (typeof id == "string") org=svg.getById(id);
        else org=id;
        const copy=svg.copyNode(org);
        if (newid) svg.setId(copy,newid);

        for (let i=0;i<copy.childNodes.length;i++)
            if (copy.childNodes[i].setAttribute) {
                let node=copy.childNodes[i];
                node.removeAttribute("transform");
                if (!edge && (node.tagName=="rect")) {
                    edge=node;
                    edgex=svg.getNum(node,"x");
                    edgey=svg.getNum(node,"y");
                    edgewidth=svg.getNum(node,"width");
                    edgeheight=svg.getNum(node,"height");
                }
            }

        ex=dx-edgex;
        ey=dy-edgey;
        svg.moveNodeAt(copy,0,0);

        if (rotate)
            copy.setAttribute("transform","translate("+ex+","+ey+") rotate("+rotate+","+(edgex+edgewidth/2)+","+(edgey+edgeheight/2)+")");
        else
            copy.setAttribute("transform","translate("+ex+","+ey+")");

        if (edge) copy.removeChild(edge);

        if (before)
            svg.insertBefore(before,copy);
        else if (into)
            into.appendChild(copy);
        else
            svg.insertBefore(org,copy);

        return copy;
    }

    function addRect(box,color,opacity,before) {
        if (opacity === undefined) opacity=1;
        if (color === undefined) color="#ff0000";
        let rect=svg.createNode("rect");
        rect.setAttribute("style","fill:"+color+";fill-opacity:"+opacity);
        rect.setAttribute("width",box.width);
        rect.setAttribute("height",box.height);
        rect.setAttribute("x",box.x);
        rect.setAttribute("y",box.y);
        if (before) {
            let prevnode=svg.getById(before,side);
            side.insertBefore(rect,prevnode);
        } else
            side.appendChild(rect);
    }

    function measureNode(node) {
        let box=node.getBBox();
        return {
            x:box.x*SIZERATIO,
            y:box.y*SIZERATIO,
            width:box.width*SIZERATIO,
            height:box.height*SIZERATIO
        };
    }

    function richPrint(settings,x,y,width,height,text) {

        text=text+"";
        
        let
            node=svg.node,
            orgTextNode=svg.getById(settings.modelId),
            normalTextNode=cloneNodeBy(0,orgTextNode,0,0,0),
            boldTextNode=cloneNodeBy(0,orgTextNode,0,0,0),
            wordSpacing = settings.wordSpacing,
            alignment = settings.horizontalAlignment,
            lineSpacing = settings.lineSpacing,
            word="",
            lines=[],
            lineId=-1,
            cursorX=0,
            cursorY=0,
            oy=0,
            lineHeight=0,
            contentWidth=0,
            contentHeight=0,
            tag=false,
            bold=false,
            i=0;
            
        
        let disableKerning=(node)=>{
            node.setAttribute("style",node.getAttribute("style")+";font-kerning: none;");
        }
        
        let measureSymbol=(node, remove)=>{
            let
                rect=node.querySelector("rect"),
                measure = rect && measureNode(rect);
            if (remove) rect.parentNode.removeChild(rect);
            return measure;
        }

        let setBold=(node)=>{
            let span=node.querySelector("tspan");
            span.setAttribute("style",span.getAttribute("style").replace(/font-family:[^;]+/,"font-family:Garamond"));
            span.setAttribute("style",span.getAttribute("style").replace("font-weight:normal","font-weight:bold"));
        }

        let printWord=()=>{
            if (word) {
                let node=0;
                if (tag) {
                    let parts=word.split(" ");
                    switch (parts[0]) {
                        case "symbol":{
                            node={
                                symbol:parts[1],
                                size:measureSymbol(svg.getById(parts[1])),
                                symbolText:parts[2],
                                symbolYGap:parts[3] ? parseFloat(parts[3]) : 0
                            }
                            break;
                        }
                        case "printat":{
                            let
                                text = word.substr(11+parts[1].length+parts[2].length+parts[3].length);
                            svg.setText(normalTextNode,text);
                            node={
                                cursorX:cursorX,
                                x:parts[1]*1,
                                y:parts[2]*1,
                                lineHeight:parts[3]*1,
                                printAtSize:measureNode(normalTextNode),
                                printAt:text
                            }
                            break;
                        }
                        case "stamp":{
                            node={
                                cursorX:cursorX,
                                stamp:parts[1],
                                x:parts[2]*1,
                                y:parts[3]*1,
                                stampSize:measureSymbol(svg.getById(parts[1])),
                                stampText:parts[4],
                                stampYGap:parts[5] ? parseFloat(parts[5]) : 0
                            }
                            break;
                        }
                        case "path":{
                            node={
                                cursorX:cursorX,
                                path:word.substr(5,word.length-5)
                            };
                            break;
                        }
                        case "emptyarea":{
                            node={
                                size:{ width:parts[1]*1, height:parts[2]*1 }
                            };
                            break;
                        }
                        case "align":{
                            let
                                newAlignment = parts[1];
                            if (newAlignment == "default")
                                newAlignment = settings.horizontalAlignment;
                            alignment = lines[lineId].alignment = newAlignment;
                            break;
                        }
                        case "qrcode":{
                            node={
                                symbol:parts[1],
                                size:measureSymbol(svg.getById(parts[1])),
                                symbolQrCodeType:parts[2]*1,
                                symbolQrCodeCorrection:parts[3],
                                symbolQrCode:word.substr(parts[0].length+parts[1].length+parts[2].length+parts[3].length+4)
                            };
                            break;
                        }
                        case "rect":{
                            node={
                                cursorX:cursorX,
                                absolute:true,
                                rect:true,
                                x:parts[1]*1,
                                y:parts[2]*1,
                                width:parts[3]*1,
                                height:parts[4]*1,
                                color:parts[5] || "#000",
                                opacity:parts[6]*1 || 1
                            };
                            break;
                        }
                        case "tabto":{
                            cursorX=parseFloat(parts[1]);
                            break;
                        }
                        case "spacing":{
                            wordSpacing = parseFloat(parts[1]);
                            cursorX-=wordSpacing
                            break;
                        }
                        case "endspacing":{
                            wordSpacing = settings.wordSpacing;
                            break;
                        }
                        case "linespacing":{
                            lineSpacing = parseFloat(parts[1]);
                            break;
                        }
                        case "endlinespacing":{
                            lineSpacing = settings.lineSpacing;
                            break;
                        }
                        case "bold":{
                            bold=true;
                            break;
                        }
                        case "endbold":{
                            bold=false;
                            break;
                        }
                    }
                } else {
                    let size;
                    if (bold) {
                        svg.setText(boldTextNode,word);
                        size=measureNode(boldTextNode);
                    } else {
                        svg.setText(normalTextNode,word);
                        size=measureNode(normalTextNode);
                    }
                    node={
                        text:word,
                        bold:bold,
                        size:size
                    };
                }
                if (node) {
                    if (node.size) {
                        if (cursorX) cursorX+=wordSpacing;
                        if (cursorX+node.size.width>width)
                            newLine();
                        node.x=cursorX;
                        lineHeight=Math.max(lineHeight,node.size.height);
                        cursorX+=node.size.width;
                    }
                    lines[lineId].boxes.push(node);
                }
                word="";
            }
        }

        let closeLine=()=>{
            lines[lineId].width=cursorX;
            lines[lineId].height=lineHeight;
            contentWidth=Math.max(contentWidth,cursorX);
        }

        let newLine=()=>{
            if (lineId!=-1) closeLine();
            lineId++;
            if (lineId>0) cursorY+=(lineHeight||EMPTYLINESIZE)+lineSpacing;
            cursorX=0;
            lineHeight=0;
            lines.push({
                y:cursorY,
                width:0,
                height:0,
                alignment:alignment,
                boxes:[]
            });
        }

        disableKerning(normalTextNode);
        disableKerning(boldTextNode);

        setBold(boldTextNode);

        newLine();

        while (i<text.length) {
            let ch=text[i];
            switch (ch) {
                case " ":{
                    if (tag) word+=ch;
                    else printWord();
                    break;
                }
                case "\n":{
                    if (!tag) {
                        printWord();
                        newLine();
                    }
                    break;
                }
                case "{":{
                    printWord();
                    tag=true;
                    break;
                }
                case "}":{
                    if (tag) {
                        printWord();
                        tag=false;
                    } else word+=ch;
                    break;
                }
                default:{
                    word+=ch;
                }
            }
            i++;
        }

        if (word) printWord();
        closeLine();
        contentHeight=cursorY+lineHeight;

        switch (settings.verticalAlignment) {
            case "center":{
                oy=y+(height-contentHeight)/2;
                break;
            }
            case "bottom":{
                oy=y+(height-contentHeight);
                break;
            }
            default:{
                oy=y;
            }
        }

        lines.forEach(line=>{
            let ox=0;
            switch (line.alignment) {
                case "center":{
                    ox=x+(width-line.width)/2;
                    break;
                }
                case "right":{
                    ox=x+width-line.width;
                    break;
                }
                default:{
                    ox=x;
                }
            }
            line.boxes.forEach(box=>{
                if (box.size) {
                    let
                        dx=box.x+ox,
                        dy=oy+line.y+(line.height-box.size.height)/2;
                    if (box.text) {
                        let node=cloneNodeBy(side,orgTextNode,0,dx,dy+box.size.height-settings.textGap);
                        disableKerning(node);
                        svg.setText(node,box.text);
                        if (box.bold) setBold(node);
                    }
                    if (box.symbol) {
                        let
                            newnode = cloneNodeBy(side,box.symbol,0,dx,dy);
                        if (box.symbolText)
                            richPrint(settings.symbolsText,dx,dy+box.symbolYGap,box.size.width,box.size.height,box.symbolText);
                        if (box.symbolQrCode) {
                            var
                                qrzone = measureSymbol(newnode, true),
                                qr = qrcode(box.symbolQrCodeType, box.symbolQrCodeCorrection),
                                qrnode;
                            qr.addData(box.symbolQrCode);
                            qr.make();
                            qrnode = createQrNode(qr,qrzone.x,qrzone.y,qrzone.width,qrzone.height);
                            newnode.appendChild(qrnode);
                        }
                    }
                } else if (box.rect)
                    addRect({ x:box.x+box.cursorX+ox, y:oy+line.y+box.y, width:box.width, height:box.height },box.color,box.opacity);
                else if (box.printAt !== undefined) {
                    let
                        dx = box.x+box.cursorX+ox,
                        dy = box.y+line.y+oy+box.lineHeight+box.lineHeight+box.printAtSize.height,
                        node=cloneNodeBy(side,orgTextNode,0,dx,dy);
                    disableKerning(node);
                    svg.setText(node,box.printAt);
                } else if (box.stamp) {
                    let
                        dx = box.x+box.cursorX+ox,
                        dy = box.y+line.y+oy;

                    cloneNodeBy(side,box.stamp,0,dx,dy);
                    if (box.stampText)
                        richPrint(settings.symbolsText,dx,dy+box.stampYGap,box.stampSize.width,box.stampSize.height,box.stampText);
                } else if (box.path) {
                    let
                        dx = box.cursorX+ox,
                        dy = line.y+oy,
                        node = document.createElement("path");
                    node.setAttribute("style","display:inline;opacity:1;fill:#000000;stroke:none");
                    node.setAttribute("transform","translate("+dx+","+dy+")");
                    node.setAttribute("d", box.path);
                    side.appendChild(node);
                }
            });
            
        });
        
        svg.delete(normalTextNode);
        svg.delete(boldTextNode);

        return {
            cursorX:cursorX,
            cursorY:cursorY
        }

    }

    function addCardNumberRulers(rulers) {
        rulers.cardNumber = {
            x:fullCard.full.x+halfCard.full.width-CARDNUMBERSIZE-CARDNUMBERSPACING,
            y:halfCard.content.y + halfCard.content.height-14.5,
            width:CARDNUMBERSIZE,
            height:13,
            angle:90
        };
    }

    this.setText=(parent,id,text)=>{
        let
            node=svg.getById(id,parent);
        if (node) {
            let span=node.querySelector("tspan");
            if (span) span.innerHTML=text;
        }
    }

    this.printAt=(model,area,text)=>{
        let
            measure,newnode,dx,dy,cx,cy,
            template=cloneNodeBy(side,model,0,0,0),
            span=template.querySelector("tspan");
        
        span.innerHTML=text;
        measure=measureNode(template);

        cx=area.x+(area.width/2);
        cy=area.y+(area.height/2);
        dx=-(measure.width/2)+cx;

        if (area.isCardNumber)
            dy=(measure.height/4)+area.y+area.height-(measure.width/2);
        else
            dy=(measure.height/4)+cy;

        newnode = cloneNodeBy(side,model,0,0,0);
        newnode.setAttribute("transform","translate("+dx+","+dy+") rotate("+(area.angle||0)+","+measure.width/2+",-"+measure.height/4+")");
        newnode.querySelector("tspan").innerHTML=text;

        svg.delete(template);

        return newnode;

    }

    this.setEdges=id=>{
        let edgesNode=svg.getById(id);
        width=svg.getNum(edgesNode,"width"),
        height=svg.getNum(edgesNode,"height")
    }

    this.setInnerBorderSpacing=spacing=>{
        cardBorderInnerSpacing=spacing;
    }

    this.setBorder=id=>{
        let borderNode=svg.getById(id);
        cardBorderSize=svg.getNum(borderNode,"x");
    }

    this.setLargeSymbolsSize=id=>{
        let symbolNode=svg.getById(id);
        largeSymbolsSize=svg.getNum(symbolNode,"width");
    }

    this.startUpperSide=()=>{
        side=cloneNodeBy(0,containerNode,0,x,y);
        calculateSizes();
        return side;
    }

    this.startLowerSide=()=>{
        side=cloneNodeBy(0,containerNode,0,x,y,180);
        calculateSizes();
        return side;
    }

    this.getPlaceholder=function(id,parent,keep) {
        let
            node=svg.getById(id,parent||side),
            box={
                x:svg.getNum(node,"x"),
                y:svg.getNum(node,"y"),
                width:svg.getNum(node,"width"),
                height:svg.getNum(node,"height")
            };
        if (!keep)
            node.parentNode.removeChild(node);
        return box;
    }
    
    this.getDungeonCardRulers=(settings)=>{
        let
            rulers={
                cardIdSymbol:{
                    x:halfCard.content.x+0.19,
                    y:halfCard.content.y+0.19,
                    width:largeSymbolsSize,
                    height:largeSymbolsSize
                },
                cardVersionSymbol:{
                    x:halfCard.content.x+halfCard.content.width-largeSymbolsSize-0.5,
                    y:halfCard.content.y+0.19,
                    width:largeSymbolsSize,
                    height:largeSymbolsSize
                },
            };

        addCardNumberRulers(rulers);
        if (DEBUG) {
            addRect(rulers.cardNumber,"#00ff00",0.1);
        }
        return rulers;
    }

    this.addLargeSymbol=(id,box,textsettings,text)=>{
        let symbol=cloneNodeBy(side,id,0,box.x,box.y);
        if (textsettings)
            richPrint(textsettings,box.x,box.y,box.width,box.height,text);
        return symbol;
    }

    this.addStencil=(id,before,box,angle)=>{
        let symbol=cloneNodeBy(side,id,0,box.x,box.y,angle,svg.getById(before,side));
        return symbol;
    }

    this.addCanvas=(canvas,before,box)=>{
        let
            bf = svg.getById(before,side),
            node = document.createElement("image");

        node.setAttribute("width",box.width);
        node.setAttribute("height",box.height);
        node.setAttribute("x",box.x);
        node.setAttribute("y",box.y);
        node.setAttribute("preserveAspectRatio", "none");
        node.setAttribute("href", canvas.toDataURL("image/png"));
        svg.insertBefore(bf,node);
        return node;
    }

    this.replaceWithStencil=(id,beforeid,angle)=>{
        let
            node=svg.getById(beforeid,side),
            box={
                x:svg.getNum(node,"x"),
                y:svg.getNum(node,"y"),
                width:svg.getNum(node,"width"),
                height:svg.getNum(node,"height")
            },
            symbol;
        symbol=cloneNodeBy(side,id,0,box.x,box.y,angle,node);
        node.parentNode.removeChild(node);
        return symbol;
    }

    this.addText=(settings,box,text)=>{
        return richPrint(settings,box.x,box.y,box.width,box.height,text);
    }

    this.addRect=(box,color,opacity,before)=>{
        addRect(box,color,opacity,before);
    }

    this.hilight=(borderwidth, color)=>{
        addRect({ x:0, y:0, width:width, height:borderwidth }, color);
        addRect({ x:0, y:0, width:borderwidth, height:height }, color);
        addRect({ x:width-borderwidth, y:0, width:borderwidth, height:height }, color);
        addRect({ x:0, y:height-borderwidth, width:width, height:borderwidth }, color);
    }

    this.setTitle=(title)=>{
        let
            titleNode = document.createElement("title");
        titleNode.innerHTML = title;
        side.appendChild(titleNode);
    }

    this.setBackgroundColor=(id,color,parent)=>{
        let node=svg.getById(id,parent||side);
        node.setAttribute("style",node.getAttribute("style").replace(/fill:[^;]*/,"fill:"+color));
    }

    this.delete=list=>{
        list.forEach(id=>{
            let node=svg.getById(id,side);
            if (node)
                svg.delete(node);
        })
    }

    this.getSide=()=>side;

}
