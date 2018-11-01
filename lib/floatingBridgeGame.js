var WINDOWBORDERSIZE = 10;
var M = 999999;
var animationDelay = 200;
var isRunning = false;
var simTimer;
var surface;

var maxCols = 40;
var cellWidth;
var cellHeight;
var currentTime = 0;

var cardAdded = false;
var cardDistributed = false;

var spadeUrl = ['images/spade_1.png','images/spade_2.png','images/spade_3.png','images/spade_4.png','images/spade_5.png','images/spade_6.png',
'images/spade_7.png','images/spade_8.png','images/spade_9.png','images/spade_10.png','images/spade_jack.png','images/spade_queen.png','images/spade_king.png'
]

var areas =[{"label":"Bottom Card Area","startRow":20,"numRows":3,"startCol":8,"numCols":26,"color":"#efc734"},
    {"label":"Top Card Area","startRow":2,"numRows":3,"startCol":8,"numCols":26,"color":"#efc734"},
    {"label":"Left Card Area","startRow":3,"numRows":19,"startCol":3,"numCols":4,"color":"#efc734"},
    {"label":"Right Card Area","startRow":3,"numRows":19,"startCol":35,"numCols":4,"color":"#efc734"}
];

var cards = [];

(function(){
    window.addEventListener('resize', redrawWindow());
    simTimer = window.setInterval(simStep, animationDelay);
    redrawWindow()
})()

function toggleSimStep(){
    isRunning = !isRunning;
    console.log('Simulation Status: '+ isRunning);
}

function redrawWindow(){
    isRunning = false; // used by simStep
	window.clearInterval(simTimer); // clear the Timer
	animationDelay = 550 - 200;
	simTimer = window.setInterval(simStep, animationDelay);

    var drawsurface = document.getElementById('surface');
    var titleElement = document.getElementById('title');
    var w = window.innerWidth;
    var h = window.innerHeight;
    var surfaceWidth = (w - 3*WINDOWBORDERSIZE);
    var surfaceHeight = (h - titleElement.offsetHeight - 3*WINDOWBORDERSIZE);
    var currentTime = 0;

    drawsurface.style.width = surfaceWidth + 'px';
    drawsurface.style.height = surfaceHeight + 'px';
    drawsurface.style.left = WINDOWBORDERSIZE/2 + 'px';
    drawsurface.style.top = WINDOWBORDERSIZE/2 + 'px';
    drawsurface.style.border = 'thick solid #efc734';
    drawsurface.innerHTML = '';

    numCols = maxCols;
    cellWidth = surfaceWidth/numCols;
    numRows = Math.ceil(surfaceHeight/cellWidth);
    cellHeight = surfaceHeight/numRows;

    surface = d3.select('#surface');
    surface.selectAll('*').remove();
    surface.style('font-size','100%').style('fill','white');

    var allAreas = surface.selectAll(".areas").data(areas);
    var newAreas = allAreas.enter().append('g').attr('class','areas');

    newAreas.append('rect') //For each new area, append a rectangle to the group
    .attr('x', function(d){return (d.startCol-1)*cellWidth;})
    .attr('y', function(d){return (d.startRow-1)*cellHeight;})
    .attr('width', function(d){return d.numCols*cellWidth;})
    .attr('height', function(d){return d.numRows*cellWidth;})
    .style('fill', function(d){return d.color;})
    .style('stroke','black')
    .style('stroke-width',1)

    updateSurface();
}

function getLocationCell(location){
	var row = location.row;
	var col = location.col;
	var x = (col-1)*cellWidth; //cellWidth is set in the redrawWindow function
	var y = (row-1)*cellHeight; //cellHeight is set in the redrawWindow function
	return {"x":x,"y":y};
}

function updateSurface(){
    var allCards = surface.selectAll('.cards').data(cards);

    var newCards = allCards.enter().append('g').attr('class','card');
    newCards.append('svg:image')
    .attr("x",function(d){var cell= getLocationCell(d.location); return cell.x+"px";})
    .attr("y",function(d){var cell= getLocationCell(d.location); return cell.y+"px";})
    .attr("width", Math.min(cellWidth,cellHeight)*4+"px")
    .attr("height", Math.min(cellWidth,cellHeight)*3+"px")
    .attr("xlink:href",function(d){return spadeUrl[d.number];});

    var images = allCards.selectAll("image");
	// Next we define a transition for each of these image elements.
	// Note that we only need to update the attributes of the image element which change
	images.transition()
	 .attr("x",function(d){var cell= getLocationCell(d.location); return cell.x+"px";})
	 .attr("y",function(d){var cell= getLocationCell(d.location); return cell.y+"px";})
	 .duration(animationDelay).ease('linear'); // This specifies the speed and type of transition we want.
}

function addCards(){
    for(let i = 0; i < 13; i++){
        var newCard = {"suite":"spade", "number":Math.floor(Math.random()*13), "location":{"row":10,"col":maxCols/2-2}}
        cards.push(newCard)
        console.log("Pushing Card")
    }
}

function distributeCards(cardIndex){
    var card = cards[cardIndex];
    var row = card.location.row;
    var col = card.location.col;

    var targetRow = 20;
    var targetCol = 5+2*(cardIndex+1);
    // compute the distance to the target destination
    var rowsToGo = targetRow - row;
    var colsToGo = targetCol - col;
    // set the speed
    var cellsPerStep = 1;
    // compute the cell to move to
    var newRow = row + Math.min(Math.abs(rowsToGo),cellsPerStep)*Math.sign(rowsToGo);
    var newCol = col + Math.min(Math.abs(colsToGo),cellsPerStep)*Math.sign(colsToGo);
    // update the location of the patient
    card.location.row = newRow;
    card.location.col = newCol;
    console.log("Distributing Card")
}

function updateGame(){
    for(let i = 0; i < cards.length; i++){
        distributeCards(i);
    updateSurface();
    }
}

function simStep(){
	//This function is called by a timer; if running, it executes one simulation step 
	//The timing interval is set in the page initialization function near the top of this file
	if (isRunning){ //the isRunning variable is toggled by toggleSimStep
		// Increment current time (for computing statistics)
		currentTime++;
		// Sometimes new agents will be created in the following function
        // In the next function we update each agent
        if(!cardAdded){
            addCards()
            cardAdded = !cardAdded;
        }

		updateGame();
		// Sometimes agents will be removed in the following function
		//removeDynamicAgents();
	}
}



