var WINDOWBORDERSIZE = 10;
var maxCols = 40;
var cellWidth;
var cellHeight;
var turn = {1:0,2:0,3:0,4:0};
var currentPlayer = 1;
var bidRound = 1;
var currentBid = {'suite':NaN,'sets':NaN};
var bidArray = [];
var cardPile = {1:NaN,2:NaN,3:NaN,4:NaN};
var cardPlayed = {1:false,2:false,3:false,4:false};
var setWins = {1:0,2:0,3:0,4:0};
var suites = ['Spade','Hearts','Diamonds','Clubs'];
var completedTurns = [];
var startGame = false;
var partnerChosen = false;
var gameOver = false;

const cardBackUrl = 'images/back-silver.png';
var cardsUrl ={'Spades':{14:'images/spade_1.png',2:'images/spade_2.png',3:'images/spade_3.png',4:'images/spade_4.png',5:'images/spade_5.png',6:'images/spade_6.png',
7:'images/spade_7.png',8:'images/spade_8.png',9:'images/spade_9.png',10:'images/spade_10.png',11:'images/spade_jack.png',12:'images/spade_queen.png',13:'images/spade_king.png'
},'Hearts':{14:'images/heart_1.png',2:'images/heart_2.png',3:'images/heart_3.png',4:'images/heart_4.png',5:'images/heart_5.png',6:'images/heart_6.png',
7:'images/heart_7.png',8:'images/heart_8.png',9:'images/heart_9.png',10:'images/heart_10.png',11:'images/heart_jack.png',12:'images/heart_queen.png',13:'images/heart_king.png'
},'Diamonds':{14:'images/diamond_1.png',2:'images/diamond_2.png',3:'images/diamond_3.png',4:'images/diamond_4.png',5:'images/diamond_5.png',6:'images/diamond_6.png',
7:'images/diamond_7.png',8:'images/diamond_8.png',9:'images/diamond_9.png',10:'images/diamond_10.png',11:'images/diamond_jack.png',12:'images/diamond_queen.png',13:'images/diamond_king.png'
},'Clubs':{14:'images/club_1.png',2:'images/club_2.png',3:'images/club_3.png',4:'images/club_4.png',5:'images/club_5.png',6:'images/club_6.png',
7:'images/club_7.png',8:'images/club_8.png',9:'images/club_9.png',10:'images/club_10.png',11:'images/club_jack.png',12:'images/club_queen.png',13:'images/club_king.png'
}};

var cardNames = {2:'Two',3:'Three',4:'Four',5:'Five',6:'Six',7:'Seven',8:'Eight',9:'Nine',10:'Ten',11:'Jack',12:'Queen',13:'King',14:'Ace'};

var areas =[{"label":"Bottom Card Area","startRow":20,"numRows":3,"startCol":8,"numCols":26,"color":"#f5f5f5"},
    {"label":"Top Card Area","startRow":2,"numRows":3,"startCol":8,"numCols":26,"color":"#f5f5f5"},
    {"label":"Left Card Area","startRow":5,"numRows":15,"startCol":3,"numCols":4,"color":"#f5f5f5"},
    {"label":"Right Card Area","startRow":5,"numRows":15,"startCol":35,"numCols":4,"color":"#f5f5f5"}
];

var initLocations = {
    1:{"row":12,"col":maxCols/2-2},
    2:{"row":10,"col":maxCols/2+0.5},
    3:{"row":8,"col":maxCols/2-2},
    4:{"row":8,"col":maxCols/2-4.9}
};
let players_cards = distribute_cards_checked(initLocations)
var cards = {1:players_cards["Player1"],
             2:players_cards["Player2"],
             3:players_cards["Player3"],
             4:players_cards["Player4"]};

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
    surface.append('g').attr('class','player' + player + 'PlayedCard');
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
        // Record the ID of the cards
        cards[1][i]['id'] = i;
        cards[2][i]['id'] = i;
        cards[3][i]['id'] = i;
        cards[4][i]['id'] = i;
    }
    console.log("Distributing Cards");
    d3.select('.player1Cards').selectAll('image').data(cards[1]).transition()
        .duration(2000)
        .attr("x",function(d){var cell= getLocationCell(d.location); return cell.x+"px";})
        .attr("y",function(d){var cell= getLocationCell(d.location); return cell.y+"px";})
        .attr("xlink:href",function(d){return cardsUrl[d.suite][Number(d.number)];})
    for(let i = 2; i < 5; i++){
        d3.select('.player' + i + 'Cards').selectAll('image').data(cards[i]).transition()
            .duration(2000)
            .attr("x",function(d){var cell= getLocationCell(d.location); return cell.x+"px";})
            .attr("y",function(d){var cell= getLocationCell(d.location); return cell.y+"px";});
    }
    
    document.getElementById("distributeButtonContainer").style.display = "none";
    surface.select('.bidding').transition().duration(2000).style('opacity',1);
    surface.select('.nextPlayer').transition().duration(2000).style('opacity',1);
    surface.select('.revealCards').transition().duration(2000).style('opacity',1);
}

surface.append('text')
    .attr('class','currentPlayer')
    .attr("x",function(d){return (maxCols/2-2.5)*cellWidth+"px";})
    .attr("y",function(d){return 5*cellHeight+"px";})
    .attr('font-size','20px')
    .attr('fill','white')
    .attr('font-weight',"bold")
    .text(function(d) {return 'Current Player: ' + currentPlayer;});

surface.append('text')
    .attr('class','currentBid')
    .attr("x",function(d){return (maxCols/2-3)*cellWidth+"px";})
    .attr("y",function(d){return 6*cellHeight+"px";})
    .attr('font-size','20px')
    .attr('fill','white')
    .attr('font-weight',"bold")
    .text(function(d) {return 'Suite: ' + currentBid.suite + '  |  ' + 'Sets: ' + currentBid.sets;});

// Begin Bidding Process
function bid(current_bid){
    console.log(current_bid);
    // Create player name
    let player_name = "Player" + String(currentPlayer)

    //check that number of times the player bids is the same as the number of turns, if they are not equal, it means the player rebidded
    function no_of_times_player_bid(item){return "Player" + String(currentPlayer) in item}
    if(bidArray.filter(no_of_times_player_bid).length == turn[currentPlayer]){
        //returns Valid / Start / Bid array
        output = check_bid_validity(player_name, current_bid, bidArray, false)
        startGame = output[1]
        //If bid valid
        if (output[0] == true){bidArray = output[2]}
        else{alert("Invalid Bid!")}
    }
    else {output = check_bid_validity(player_name, current_bid, bidArray, true)
    if (output[0] == true){bidArray = output[2]}
    else{alert("Invalid Bid!")};
    }
    console.log(bidArray);
}

function activateCards(){
    d3.select('.player1Cards').selectAll('image')
        .attr('onclick',function(d){return "playCard(" + '"' + String(d.suite) + '"' + "," + String(d.number) + "," + String(d.id) +")"}); //This function will only be used when the game is played
    }

function changeCardPileLocation(){
    for(let i = 0; i < completedTurns.length%4; i++){
        p = Math.floor(completedTurns.length/4)*4+i;
        switch(cardPile[completedTurns[p]].orientation){
            case "bottom":
                cardPile[completedTurns[p]].orientation = "right";
                cardPile[completedTurns[p]].location = initLocations[4];
            break;
            case "right":
                cardPile[completedTurns[p]].orientation = "top";
                cardPile[completedTurns[p]].location = initLocations[3];
            break;
            case "top":
                cardPile[completedTurns[p]].orientation = "left";
                cardPile[completedTurns[p]].location = initLocations[2];
            break;
            // If the card is left we do not rotate back to the bottom because the round would have ended.
        }
        d3.select('.player' + completedTurns[p] + 'PlayedCard').selectAll('image').remove();
    }
    for(let i = 0; i < completedTurns.length%4; i++){
        p = Math.floor(completedTurns.length/4)*4+i;
        d3.select('.player' + String(completedTurns[p]) + 'PlayedCard').selectAll().data([cardPile[completedTurns[p]]]).enter().append('svg:image')
            .attr("x",function(d){var cell= getLocationCell(d.location); return cell.x+"px";})
            .attr("y",function(d){var cell= getLocationCell(d.location); return cell.y+"px";})
            .attr("width", Math.min(cellWidth,cellHeight)*4+"px")
            .attr("height", Math.min(cellWidth,cellHeight)*3+"px")
            .attr("xlink:href",function(d){return cardsUrl[d.suite][Number(d.number)];})
        if(cardPile[completedTurns[p]].orientation == "right"){
            d3.select('.player' + String(completedTurns[p]) + 'PlayedCard').selectAll('image').attr("transform", d3Transform().rotate(-90,20.5*cellWidth,6.25*cellHeight));
        }
        if(cardPile[completedTurns[p]].orientation == "left"){
            d3.select('.player' + String(completedTurns[p]) + 'PlayedCard').selectAll('image').attr("transform", d3Transform().rotate(90,18*cellWidth,7.5*cellHeight));
        }
    }
}

function nextPlayer(){
    // Check if the startgame is true
    if(!startGame) {
        var info = document.getElementById('biddingForm');
        // Create current bid
        if (info[0].value != "Pass"){
            current_bid = info[1].value + " " + info[0].value;
            msg = 'You are bidding for ' + info[1].value + ' ' + info[0].value
        } else {
            current_bid = "Pass";
            msg = 'You are passing the bid';
        }
        if (confirm(msg)) {
            bid(current_bid);
            function no_of_times_player_bid(item){return "Player" + String(currentPlayer) in item}
            if(bidArray.filter(no_of_times_player_bid).length == turn[currentPlayer]+1){
                if(bidArray[bidArray.length - 1]["Player" + String(currentPlayer)] != 'Pass'){
                    let current_bid_from_bidArray = Object.values(bidArray[bidArray.length - 1])[0]
                    currentBid.suite = current_bid_from_bidArray.split(" ")[1];
                    currentBid.sets = current_bid_from_bidArray.split(" ")[0];
                    surface.select('.currentBid').text(function(d) {return 'Suite: ' + currentBid.suite + '  |  ' + 'Sets: ' + currentBid.sets;});
                }            
                turn[currentPlayer]++;
                if(!startGame){
                    currentPlayer = (currentPlayer%4)+1;
                    changeCardLocations();
                }
            }
        }
    }
    if(startGame && !gameOver){
        if(!partnerChosen){
            generateScoreBoard();
            document.getElementById("partnerFormContainer").style.display = "block";
        };
        if(cardPlayed[currentPlayer] || !partnerChosen) {
            turn[currentPlayer]++;
            if(cardPlayed[1] && cardPlayed[2] && cardPlayed[3] && cardPlayed[4] && partnerChosen){
                setWinner = Math.ceil(Math.random()*4); //winner(cardPile)
                setWins[setWinner] += 1;
                surface.select('.scoreBoard').select('.player' + setWinner + 'score').text(function(d) {return 'Player ' + setWinner + ' Sets Won: ' + setWins[setWinner];});
                for(i = 1; i < 5; i++){
                    cardPile[i] = NaN;
                    cardPlayed[i] = false;
                };
                clearPlayedCards();
                currentPlayer = setWinner;
            } else {
                changeCardPileLocation();
                currentPlayer = (currentPlayer%4)+1;
            }
            changeCardLocations();
            createDummyCards();
            activateCards();
        } else {
            alert('You have not played a card')
        }
    }
}

function clearPlayedCards(){
    for(i = 1;i < 5; i++){
        d3.select('.player' + i + 'PlayedCard').selectAll('image').remove()
    }
}

function createDummyCards(){
    t = Math.floor(completedTurns.length/4);
    e = completedTurns.length%4;
    dummyCards = {2:[],3:[],4:[]};
    ee = [0,0,0];
    if(e >= 1){
        ee[0] = 1;
        if(e >= 2){
            ee[1] = 1;
            if(e >= 3){
                ee[2] = 1;
            };
        };
    };
    for(let i = 0; i < 13-t-ee[0]; i++){
        dummyCards[4].push({'location':{'row':21.5,'col':7+(i+1)}})
    }
    for(let i = 0; i < 13-t-ee[1]; i++){
        dummyCards[3].push({'location':{'row':2,'col':5+2*(i+1)}})
    }
    for(let i = 0; i < 13-t-ee[2]; i++){
        dummyCards[2].push({'location':{'row':21.5,'col':14.5+(i+1)}})
    }
    for(player = 2; player < 5; player++){
        d3.select('.player' + player + 'Cards').selectAll('image').remove()
        d3.select('.player' + player + 'Cards').selectAll().data(dummyCards[player]).enter().append('svg:image')
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
}

function changeCardLocations(){
    d3.select('.player1Cards').selectAll('image').remove()
    //Change Card Locations
    for(let i = 0; i < cards[currentPlayer].length; i++){
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

function submitPartnerChoice(){
    document.getElementById("partnerFormContainer").style.display = "none";
    var info = document.getElementById('partnerForm');
    partnerChosen = true;
    console.log(info[0].value);
    console.log(info[1].value);
}

function revealCards(){
    d3.select('.player1Cards').selectAll('image').data(cards[currentPlayer]).transition()
        .duration(2000)
        .attr("xlink:href",function(d){return cardsUrl[d.suite][Number(d.number)];});
}

function generateScoreBoard(){
    surface.append('g').attr('class','scoreBoard')
    surface.select('.scoreBoard').append('text')
        .attr("x",function(d){return (maxCols*0.85)*cellWidth+"px";})
        .attr("y",function(d){return 2*0.5*cellHeight+"px";})
        .attr('font-size','20px')
        .attr('fill','white')
        .attr('font-weight',"bold")
        .text(function(d) {return 'Player Scoreboard';});
    for(i = 1;i < 5; i++){
    surface.select('.scoreBoard').append('text')
        .attr('class','player' + i + 'score')
        .attr("x",function(d){return (maxCols*0.87)*cellWidth+"px";})
        .attr("y",function(d){return (2.4+i)*0.5*cellHeight+"px";})
        .attr('font-size','12px')
        .attr('text-align','center')
        .attr('fill','white')
        .attr('font-weight',"bold")
        .text(function(d) {return 'Player ' + i + ' Sets Won: ' + setWins[i];});
    }
}

function playCard(suite, number, ID){
    if (!cardPlayed[currentPlayer] && partnerChosen) {
        if (confirm('You are playing the ' + cardNames[number] + ' of ' + suite)) {
            function filterCard(card){
                return card.id != ID;
            }
            cardPile[currentPlayer] = {'suite':suite,'number':number};
            d3.select('.player1Cards').selectAll('image').filter(function(d){return d.id == ID;}).transition().duration(1000).style('opacity',0).remove() // Remove the card image
            cards[currentPlayer] = cards[currentPlayer].filter(filterCard); // Remove the card from the original pile
            cardPile[currentPlayer] = {'suite':suite,'number':number,'location':initLocations[1],'orientation':'bottom'};
            // Lay the played card out in the centre of the board
            d3.select('.player' + currentPlayer + 'PlayedCard').selectAll().data([cardPile[currentPlayer]]).enter().append('svg:image')
                .attr("x",function(d){var cell= getLocationCell(d.location); return cell.x+"px";})
                .attr("y",function(d){var cell= getLocationCell(d.location); return cell.y+"px";})
                .attr("width", Math.min(cellWidth,cellHeight)*4+"px")
                .attr("height", Math.min(cellWidth,cellHeight)*3+"px")
                .attr("xlink:href",function(d){return cardsUrl[d.suite][Number(d.number)];})
                .style('opacity',0)
                .transition()
                .duration(2000)
                .style('opacity',1);
            completedTurns.push(currentPlayer);
            cardPlayed[currentPlayer] = true;
            console.log(cardPlayed);
        }
    }
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

// Begin Bidding Process
function bid(){
    var info = document.getElementById('biddingForm');
    console.log(info[1].value)
    console.log(bidArray)
    console.log(turn)
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
    if(bidArray[currentPlayer].length == turn[currentPlayer]+1){
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
    } else {
        alert('You have not bidded')
    }
}

*/
