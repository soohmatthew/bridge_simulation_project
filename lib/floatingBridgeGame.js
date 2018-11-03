var WINDOWBORDERSIZE = 10;
var maxCols = 40;
var cellWidth;
var cellHeight;
var turn = {1:0,2:0,3:0,4:0};
var currentPlayer = 1;
var bidRound = 1;
var currentBid = {'suite':NaN,'sets':NaN};
var bidArray = {1:[],2:[],3:[],4:[]};

var suites = ['Spade','Hearts','Diamonds','Clubs'];

const cardBackUrl = 'images/back-silver.png'
var spadeUrl = ['images/spade_1.png','images/spade_2.png','images/spade_3.png','images/spade_4.png','images/spade_5.png','images/spade_6.png',
'images/spade_7.png','images/spade_8.png','images/spade_9.png','images/spade_10.png','images/spade_jack.png','images/spade_queen.png','images/spade_king.png'
];

var areas =[{"label":"Bottom Card Area","startRow":20,"numRows":3,"startCol":8,"numCols":26,"color":"#efc734"},
    {"label":"Top Card Area","startRow":2,"numRows":3,"startCol":8,"numCols":26,"color":"#efc734"},
    {"label":"Left Card Area","startRow":5,"numRows":15,"startCol":3,"numCols":4,"color":"#efc734"},
    {"label":"Right Card Area","startRow":5,"numRows":15,"startCol":35,"numCols":4,"color":"#efc734"}
];

var cards = {1:[],2:[],3:[],4:[]};
var initLocations = {1:{"row":12,"col":maxCols/2-2},
2:{"row":10,"col":maxCols/2+0.5},
3:{"row":8,"col":maxCols/2-2},
4:{"row":8,"col":maxCols/2-4.9}
};

// Surface Attributes
var drawsurface = document.getElementById('surface');
var titleElement = document.getElementById('title');
var w = window.innerWidth;
var h = window.innerHeight;
var surfaceWidth = (w - 3*WINDOWBORDERSIZE);
var surfaceHeight = (h - titleElement.offsetHeight - 3*WINDOWBORDERSIZE);
var currentTime = 0;

numCols = maxCols;
cellWidth = surfaceWidth/numCols;
numRows = Math.ceil(surfaceHeight/cellWidth);
cellHeight = surfaceHeight/numRows;

drawsurface.style.width = surfaceWidth + 'px';
drawsurface.style.height = surfaceHeight + 'px';
drawsurface.style.left = WINDOWBORDERSIZE/2 + 'px';
drawsurface.style.top = WINDOWBORDERSIZE/2 + 'px';
drawsurface.style.border = 'thick solid #efc734';

surface = d3.select('#surface');

// Draw areas
surface.append('g').attr('class', 'playerAreas')
d3.select('.playerAreas').selectAll().data(areas).enter().append('rect')
    .attr('x', function(d){return (d.startCol-1)*cellWidth;})
    .attr('y', function(d){return (d.startRow-1)*cellHeight;})
    .attr('width', function(d){return d.numCols*cellWidth;})
    .attr('height', function(d){return d.numRows*cellWidth;})
    .style('fill', function(d){return d.color;});

function getLocationCell(location){
	var row = location.row;
	var col = location.col;
	var x = (col-1)*cellWidth; //cellWidth is set in the redrawWindow function
	var y = (row-1)*cellHeight; //cellHeight is set in the redrawWindow function
	return {"x":x,"y":y};
}

//Shuffle and Place Cards for All Players
function shufflePlaceCards(player){
    for(let i = 0; i < 13; i++){
        var newCard = {"suite":"spade", "number":Math.floor(Math.random()*13), "location":initLocations[player]};
        cards[player].push(newCard);
        console.log("Pushing Card");
    }
    surface.append('g').attr('class','player' + player + 'Cards')
    d3.select('.player' + player + 'Cards').selectAll().data(cards[player]).enter().append('svg:image')
        .attr("x",function(d){var cell= getLocationCell(d.location); return cell.x+"px";})
        .attr("y",function(d){var cell= getLocationCell(d.location); return cell.y+"px";})
        .attr("width", Math.min(cellWidth,cellHeight)*4+"px")
        .attr("height", Math.min(cellWidth,cellHeight)*3+"px")
        .attr("xlink:href",function(d){return cardBackUrl;})
    if(player == 2){
        d3.select('.player' + player + 'Cards').selectAll('image').attr("transform", d3Transform().rotate(90,18*cellWidth,7.5*cellHeight))
    }
    if(player == 4){
        d3.select('.player' + player + 'Cards').selectAll('image').attr("transform", d3Transform().rotate(-90,20.5*cellWidth,6.25*cellHeight))
    }
}

for(i = 1; i < 5; i++){
    shufflePlaceCards(i);
}

function distributeCards(){
    for(let i = 0; i < 13; i++){
        cards[1][i]['location'] = {'row':20,'col':5+2*(i+1)};
        cards[2][i]['location'] = {'row':21.5,'col':14.5+(i+1)};
        cards[3][i]['location'] = {'row':2,'col':5+2*(i+1)};
        cards[4][i]['location'] = {'row':21.5,'col':7+(i+1)};
    }
    console.log("Distributing Cards");
    d3.select('.player1Cards').selectAll('image').data(cards[1]).transition()
        .duration(2000)
        .attr("x",function(d){var cell= getLocationCell(d.location); return cell.x+"px";})
        .attr("y",function(d){var cell= getLocationCell(d.location); return cell.y+"px";})
        .attr("xlink:href",function(d){return spadeUrl[d.number];})
    for(let i = 2; i < 5; i++){
        d3.select('.player' + i + 'Cards').selectAll('image').data(cards[i]).transition()
            .duration(2000)
            .attr("x",function(d){var cell= getLocationCell(d.location); return cell.x+"px";})
            .attr("y",function(d){var cell= getLocationCell(d.location); return cell.y+"px";});
    }
    
    surface.select('.start').transition().duration(2000).style('opacity',0).remove(); //Remove the distribute button
    surface.select('.bidding').transition().duration(2000).style('opacity',1);
    surface.select('.nextPlayer').transition().duration(2000).style('opacity',1);
    surface.select('.revealCards').transition().duration(2000).style('opacity',1);
}

surface.append('text')
    .attr('class','currentPlayer')
    .attr("x",function(d){return (maxCols/2-3)*cellWidth+"px";})
    .attr("y",function(d){return 5*cellHeight+"px";})
    .attr('font-size','20px')
    .text(function(d) {return 'Current Player: ' + currentPlayer;});

surface.append('text')
    .attr('class','currentBid')
    .attr("x",function(d){return (maxCols/2-3)*cellWidth+"px";})
    .attr("y",function(d){return 6*cellHeight+"px";})
    .attr('font-size','20px')
    .text(function(d) {return 'Suite: ' + currentBid.suite + '  |  ' + 'Sets: ' + currentBid.sets;});

// Begin Bidding Process
function bid(){
    var info = document.getElementById('biddingForm');
    if(bidArray[currentPlayer].length == turn[currentPlayer]){
        if(info[0].value != 'Pass'){
            bidArray[currentPlayer].push({'suite':info[0].value,'sets':parseInt(info[1].value)});
        } else {
            bidArray[currentPlayer].push('Pass');
        };
    } else {
    if(info[0].value != 'Pass'){
            bidArray[currentPlayer][turn[currentPlayer]].suite = info[0].value;
            bidArray[currentPlayer][turn[currentPlayer]].sets = parseInt(info[1].value);
        } else {
            bidArray[currentPlayer][turn[currentPlayer]] = 'Pass';
        }
    };
    console.log(bidArray);
}

function nextPlayer(){
    if(bidArray[currentPlayer][turn[currentPlayer]] != 'Pass'){
        currentBid.suite = bidArray[currentPlayer][turn[currentPlayer]].suite;
        currentBid.sets = bidArray[currentPlayer][turn[currentPlayer]].sets;
        surface.select('.currentBid').text(function(d) {return 'Suite: ' + currentBid.suite + '  |  ' + 'Sets: ' + currentBid.sets;});
    }
    turn[currentPlayer]++;
    currentPlayer = (currentPlayer%4)+1;
    d3.select('.player1Cards').selectAll('image').remove()
    //Change Card Locations
    for(let i = 0; i < 13; i++){
        cards[currentPlayer][i]['location'] = {'row':20,'col':5+2*(i+1)};
    }
    d3.select('.player1Cards').selectAll().data(cards[currentPlayer]).enter().append('svg:image')
        .attr("x",function(d){var cell= getLocationCell(d.location); return cell.x+"px";})
        .attr("y",function(d){var cell= getLocationCell(d.location); return cell.y+"px";})
        .attr("width", Math.min(cellWidth,cellHeight)*4+"px")
        .attr("height", Math.min(cellWidth,cellHeight)*3+"px")
        .attr("xlink:href",function(d){return cardBackUrl;})
    surface.select('.currentPlayer').text(function(d) {return 'Current Player: ' + currentPlayer;});
}

function revealCards(){
    d3.select('.player1Cards').selectAll('image').data(cards[currentPlayer]).transition()
        .duration(2000)
        .attr("xlink:href",function(d){return spadeUrl[d.number];})
}

/*


//Shuffle and Distribute Cards for p2
for(let i = 0; i < 13; i++){
    var newCard = {"suite":"spade", "number":Math.floor(Math.random()*13), "location":{"row":10,"col":maxCols/2+0.5}}
    player2Cards.push(newCard)
    console.log("Pushing Card")
}

surface.append('g').attr('class','player2Cards')
d3.select('.player2Cards').selectAll().data(player2Cards).enter().append('svg:image')
    .attr("x",function(d){var cell= getLocationCell(d.location); return cell.x+"px";})
    .attr("y",function(d){var cell= getLocationCell(d.location); return cell.y+"px";})
    .attr("width", Math.min(cellWidth,cellHeight)*4+"px")
    .attr("height", Math.min(cellWidth,cellHeight)*3+"px")
    .attr("transform", d3Transform().rotate(90,18*cellWidth,7.5*cellHeight)) //750,300))
    .attr("xlink:href",function(d){return cardBackUrl;});

for(let i = 0; i < 13; i++){
    cards[2][i]['location']['row'] = 21.5;
    cards[2][i]['location']['col'] = 14.5+(i+1);
}

d3.select('.player2Cards').selectAll('image').data(cards[2]).transition()
    .duration(2000)
    .attr("x",function(d){var cell= getLocationCell(d.location); return cell.x+"px";})
    .attr("y",function(d){var cell= getLocationCell(d.location); return cell.y+"px";});

//Shuffle and Distributuon for p3
for(let i = 0; i < 13; i++){
    var newCard = {"suite":"spade", "number":Math.floor(Math.random()*13), "location":{"row":8,"col":maxCols/2-4.9}}
    player3Cards.push(newCard)
    console.log("Pushing Card")
}

surface.append('g').attr('class','player3Cards')
d3.select('.player3Cards').selectAll().data(player3Cards).enter().append('svg:image')
    .attr("x",function(d){var cell= getLocationCell(d.location); return cell.x+"px";})
    .attr("y",function(d){var cell= getLocationCell(d.location); return cell.y+"px";})
    .attr("width", Math.min(cellWidth,cellHeight)*4+"px")
    .attr("height", Math.min(cellWidth,cellHeight)*3+"px")
    .attr("transform", d3Transform().rotate(-90,20.5*cellWidth,6.25*cellHeight))
    .attr("xlink:href",function(d){return cardBackUrl;});

for(let i = 0; i < 13; i++){
    player3Cards[i]['location']['row'] = 21.5;
    player3Cards[i]['location']['col'] = 7+(i+1);
}

d3.select('.player3Cards').selectAll('image').data(player3Cards).transition()
    .duration(2000)
    .attr("x",function(d){var cell= getLocationCell(d.location); return cell.x+"px";})
    .attr("y",function(d){var cell= getLocationCell(d.location); return cell.y+"px";});

//Shuffle and Distribution for p4
for(let i = 0; i < 13; i++){
    var newCard = {"suite":"spade", "number":Math.floor(Math.random()*13), "location":{"row":8,"col":maxCols/2-2}}
    player4Cards.push(newCard)
    console.log("Pushing Card")
}

surface.append('g').attr('class','player4Cards')
d3.select('.player4Cards').selectAll().data(player4Cards).enter().append('svg:image')
    .attr("x",function(d){var cell= getLocationCell(d.location); return cell.x+"px";})
    .attr("y",function(d){var cell= getLocationCell(d.location); return cell.y+"px";})
    .attr("width", Math.min(cellWidth,cellHeight)*4+"px")
    .attr("height", Math.min(cellWidth,cellHeight)*3+"px")
    .attr("xlink:href",function(d){return cardBackUrl;});

for(let i = 0; i < 13; i++){
    player4Cards[i]['location']['row'] = 2;
    player4Cards[i]['location']['col'] = 5+2*(i+1);;
}

d3.select('.player4Cards').selectAll('image').data(player4Cards).transition()
    .duration(2000)
    .attr("x",function(d){var cell= getLocationCell(d.location); return cell.x+"px";})
    .attr("y",function(d){var cell= getLocationCell(d.location); return cell.y+"px";});


*/
