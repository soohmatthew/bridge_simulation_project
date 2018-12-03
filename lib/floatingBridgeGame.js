var WINDOWBORDERSIZE = 10;
var simulation = false;
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
var cardHistory = [];
var setWins = {1:0,2:0,3:0,4:0};
var suites = ['Spade','Hearts','Diamonds','Clubs'];
var completedTurns = [];
var startGame = false;
var partnerChosen = false;
var gameOver = false;
var initPlayer = NaN;
var winningPair = NaN;
var partnerPlayer = NaN;
var trumpBroken = false;
var bidWinner = NaN;
var partnerCard = {'suite':NaN,'number':NaN};

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
    {"label":"Left Card Area","startRow":5,"numRows":15,"startCol":3.5,"numCols":3.5,"color":"#f5f5f5"},
    {"label":"Right Card Area","startRow":5,"numRows":15,"startCol":35,"numCols":3.5,"color":"#f5f5f5"}
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

var playerIndicators = [{'player':1,'orientation':'bottom','location':{"row":19.5,"col":31}},
{'player':2,'orientation':'left','location':{"row":13,"col":7.5}},
{'player':3,'orientation':'top','location':{"row":7,"col":10}},
{'player':4,'orientation':'right','location':{"row":13,"col":33.5}}]

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
    .attr('rx','20')
    .attr('ry','20')
    .attr('opacity','0.1')
    .style('fill', function(d){return d.color;})
    .style('stroke','black')
    .style('stroke-width','5');

surface.append('g').attr('class','playerIndicators')

function createPlayerIndicator(){
    switch(currentPlayer){
        case 1:
            playerIndicators[0].player = 1;
            playerIndicators[1].player = 2;
            playerIndicators[2].player = 3;
            playerIndicators[3].player = 4;
        break;
        case 2:
            playerIndicators[0].player = 2;
            playerIndicators[1].player = 3;
            playerIndicators[2].player = 4;
            playerIndicators[3].player = 1;
        break;
        case 3:
            playerIndicators[0].player = 3;
            playerIndicators[1].player = 4;
            playerIndicators[2].player = 1;
            playerIndicators[3].player = 2;
        break;
        case 4:
            playerIndicators[0].player = 4;
            playerIndicators[1].player = 1;
            playerIndicators[2].player = 2;
            playerIndicators[3].player = 3;
        break;
    };
    surface.select('.playerIndicators').selectAll('text').remove();
    surface.select('.playerIndicators').selectAll().data(playerIndicators).enter().append('text')
        .attr("x",function(d){var cell= getLocationCell(d.location); return cell.x+"px";})
        .attr("y",function(d){var cell= getLocationCell(d.location); return cell.y+"px";})
        .attr('font-size','84px')
        .attr('fill','white')
        .attr('font-weight',"bold")
        .attr('opacity','0.2')
        .text(function(d) {return d.player;});
}

createPlayerIndicator(currentPlayer);

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
    document.getElementById("biddingFormContainer").style.display = "block";
    document.getElementById("gameButtonContainer").style.display = "block";
}

function distributeCardsS(){
    distributeCards();
    simulation = true;
    document.getElementById("biddingFormContainer").style.display = "none";
    document.getElementById("gameButtonContainer").style.display = "none";
    document.getElementById("gameButtonContainerS").style.display = "block";
}

surface.append('text')
    .attr('class','currentPlayer')
    .attr("x",function(d){return (maxCols/2-1)*cellWidth+"px";})
    .attr("y",function(d){return 5*cellHeight+"px";})
    .attr('font-size','20px')
    .attr('fill','white')
    .attr('font-weight',"bold")
    .attr('text-anchor','middle')
    .text(function(d) {return 'Current Player: ' + currentPlayer;});

surface.append('text')
    .attr('class','currentBid')
    .attr("x",function(d){return (maxCols/2-1)*cellWidth+"px";})
    .attr("y",function(d){return 6*cellHeight+"px";})
    .attr('font-size','20px')
    .attr('fill','white')
    .attr('font-weight',"bold")
    .attr('text-anchor','middle')
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
                    createPlayerIndicator(currentPlayer);
                    changeCardLocations();
                }
            }
        }
    }
    if(startGame && !gameOver){
        if(!partnerChosen){
            bidWinner = (currentPlayer%4)+1;
            document.getElementById("biddingFormContainer").style.display = "none";
            generateScoreBoard();
            document.getElementById("partnerFormContainer").style.display = "block";
            initPlayer = (currentPlayer%4)+1;
        };
        if(cardPlayed[currentPlayer] || !partnerChosen) {
            turn[currentPlayer]++;
            if(cardPlayed[1] && cardPlayed[2] && cardPlayed[3] && cardPlayed[4] && partnerChosen){
                setWinner = determine_player_won(currentBid, initPlayer, cardPile); //Find a way to incorporate trumpBroken inside this
                setWins[setWinner] += 1;
                cardHistory.push(clone(cardPile));
                surface.select('.scoreBoard').select('.player' + setWinner + 'score').text(function(d) {return 'Player ' + setWinner + ' Sets Won: ' + setWins[setWinner];});
                for(i = 1; i < 5; i++){
                    cardPile[i] = NaN;
                    cardPlayed[i] = false;
                };
                if(has_anyone_won(bidWinner, partnerPlayer, currentBid, setWins)){
                    gameOver = true;
                    winningPair = has_anyone_won(bidWinner, partnerPlayer, currentBid, setWins);
                };
                clearPlayedCards();
                if(gameOver){ // If game is over, remove next player button and display who is the winner and who is the bidder's partner
                    document.getElementById("gameButtonContainer").style.display = "none";
                    surface.append('text')
                        .attr('class','currentPlayer')
                        .attr("x",function(d){return (maxCols/2-1)*cellWidth+"px";})
                        .attr("y",function(d){return 12*cellHeight+"px";})
                        .attr('font-size','64px')
                        .attr('fill','white')
                        .attr('font-weight',"bold")
                        .attr('text-anchor','middle')
                        .attr('stroke','black')
                        .attr('stroke-width',2.5)
                        .text(function(d) {return 'The ' + winningPair + ' has won!';});
                    surface.append('text')
                        .attr('class','currentPlayer')
                        .attr("x",function(d){return (maxCols/2-1)*cellWidth+"px";})
                        .attr("y",function(d){return 14*cellHeight+"px";})
                        .attr('font-size','50px')
                        .attr('fill','white')
                        .attr('font-weight',"bold")
                        .attr('text-anchor','middle')
                        .attr('stroke','black')
                        .attr('stroke-width',2.5)
                        .text(function(d) {return "The bidder's partner is " + partnerPlayer;});
                }
                currentPlayer = setWinner;
                initPlayer = setWinner;
                //console.log(cardHistory);
                console.log(completedTurns);
            } else {
                changeCardPileLocation();
                currentPlayer = (currentPlayer%4)+1;
            }
            console.log(currentPlayer);
            createPlayerIndicator();
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
    var info = document.getElementById('partnerForm');
    let check_partner_result = check_partner_validity(bidWinner, cards, info[1].value, info[0].value)
    if(check_partner_result[1]){
        partnerChosen = true;
        partnerCard.suite = info[0].value;
        partnerCard.suite = info[1].value;
        document.getElementById("partnerFormContainer").style.display = "none";
        partnerPlayer = check_partner_result[0];
    } else {
        alert('You are not allowed to choose yourself!')
    }
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
            if(check_if_able_to_play_card(currentPlayer, initPlayer, currentBid, cardPile, {'suite':suite,'number':number}, cards)){ // Matthew's function for check if able to play card
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
            } else {
                alert('Not allowed to play this card!')
            }
        }
    }
}

function clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}

//Functions and variables below are for simulation
testBids = [{"Player1":"1 Spades"},{"Player2":"2 Spades"},{"Player3":"3 Diamonds"},{"Player4":"3 Hearts"},{"Player1":"3 Spades"},{"Player2":"4 Clubs"},{"Player3":"Pass"},{"Player4":"Pass"},{"Player1":"Pass"}];

function autoBid() {
    n = 0;

    while(!startGame && n < testBids.length ) {
        // In this part we call a function to produce a bid given the current player's cards
        newBid = bidding_intell(cards,currentPlayer,bidArray);
        console.log(newBid)
        newBid = testBids[n];
        bidArray.push(newBid);
        if(bidArray[bidArray.length - 1]["Player" + String(currentPlayer)] != 'Pass'){
            let current_bid_from_bidArray = Object.values(bidArray[bidArray.length - 1])[0]
            currentBid.suite = current_bid_from_bidArray.split(" ")[1];
            currentBid.sets = current_bid_from_bidArray.split(" ")[0];
        }
        turn[currentPlayer]++;
        currentPlayer = (currentPlayer%4)+1;
        n++;
    }
    surface.select('.currentBid').text(function(d) {return 'Suite: ' + currentBid.suite + '  |  ' + 'Sets: ' + currentBid.sets;});
    
    // Create Player Names for table heading
    pNames = [];
    for(i=1;i<5;i++){
        pNames.push({'PName':'Player '+i})
    }
    
    rearrangeBids = []
    roundsof4 = Math.ceil(testBids.length/4);
    for(i=0;i < roundsof4;i++){
        roundBid = [];
        if(i < roundsof4-1){l = 4}else{l = testBids.length%4};
        for(j=0;j<l;j++){
            roundBid.push({'bid':bidArray[i*4+j]['Player'+(j+1)]})
        }
        rearrangeBids.push({'round':roundBid});
    }
    console.log(rearrangeBids)

    bidWinner = 2; //Need to properly set bid winner also
    currentPlayer = bidWinner;

    // Style the table using CSS
    surface.append("foreignObject")
        .attr('class','bidTableContainer')
        .attr('id','bidTableContainer')
        .attr("width", 500)
        .attr("height", 80*roundsof4)
        .attr('x','32.5%')
        .attr('y','37.5%')
        
    surface.select('.bidTableContainer').append('xhtml:div')
        .attr('class','bidTableHeader')
        .text(function(d){return "Bidding Results"})
    surface.select('.bidTableContainer').append("xhtml:table");
    var bidTable = surface.select('.bidTableContainer').select('table').attr('width','100%').attr('height','70%');
    
    bidTable.append('thead').append('tr').selectAll().data(pNames).enter().append('td').text(function(d){return d.PName;})
    bidTable.append('tbody').selectAll().data(rearrangeBids).enter().append('tr').selectAll().data(function(d){return d.round}).enter().append('td').text(function(d){return d.bid});
    
    document.getElementById("gameButtonContainerS").style.display = "none";
    document.getElementById("gameButtonContainerSP").style.display = "block";
    surface.select('.currentPlayer').text('Current Player: ' + currentPlayer);
}


function autoPlay() {
    function updatePlayer(){
        surface.select('.currentPlayer').text('Current Player: ' + currentPlayer);
    }
    initPlayer = bidWinner
    d3.select('.bidTableContainer').remove();
    generateScoreBoard();
    chose_partner(currentBid, cards, bidWinner)
    // partnerPlayer = f(x); //Input the intelligence to choose the player partner
    partnerPlayer = 1;
    partnerChosen = true;
    var executePlay = ()=>playCardAuto();
    var executeUpdate = ()=>updatePlayer();
    var executeBidWinnerCheck = ()=>allocateBidWinner();
    var executeCardIDAdd =()=>cardID++;
    cardID = 0;
    playCardAuto();
    //Round 1
    var wait = ms => new Promise((r, j)=>setTimeout(r, ms));
    wait(1*1000-1).then(executeUpdate)
    wait(1*1000).then(executePlay)

    var wait = ms => new Promise((r, j)=>setTimeout(r, ms));
    wait(2*1000-1).then(executeUpdate)
    wait(2*1000).then(executePlay)

    var wait = ms => new Promise((r, j)=>setTimeout(r, ms));
    wait(3*1000-1).then(executeUpdate)
    wait(3*1000).then(executePlay)

    var wait = ms => new Promise((r, j)=>setTimeout(r, ms));
    wait(4*1000-1).then(executeBidWinnerCheck)
    wait(4*1000).then(executeUpdate)

    //Round 2
    var wait = ms => new Promise((r, j)=>setTimeout(r, ms));
    wait(5*1000-1).then(executeCardIDAdd)
    wait(5*1000-1).then(executeUpdate)
    wait(5*1000).then(executePlay)

    var wait = ms => new Promise((r, j)=>setTimeout(r, ms));
    wait(6*1000-1).then(executeUpdate)
    wait(6*1000).then(executePlay)

    var wait = ms => new Promise((r, j)=>setTimeout(r, ms));
    wait(7*1000-1).then(executeUpdate)
    wait(7*1000).then(executePlay)

    var wait = ms => new Promise((r, j)=>setTimeout(r, ms));
    wait(8*1000-1).then(executeUpdate)
    wait(8*1000).then(executePlay)

    var wait = ms => new Promise((r, j)=>setTimeout(r, ms));
    wait(9*1000-1).then(executeBidWinnerCheck)
    wait(9*1000).then(executeUpdate)
    
    //Round 3
    var wait = ms => new Promise((r, j)=>setTimeout(r, ms));
    wait(10*1000-1).then(executeCardIDAdd)
    wait(10*1000-1).then(executeUpdate)
    wait(10*1000).then(executePlay)

    var wait = ms => new Promise((r, j)=>setTimeout(r, ms));
    wait(11*1000-1).then(executeUpdate)
    wait(11*1000).then(executePlay)

    var wait = ms => new Promise((r, j)=>setTimeout(r, ms));
    wait(12*1000-1).then(executeUpdate)
    wait(12*1000).then(executePlay)

    var wait = ms => new Promise((r, j)=>setTimeout(r, ms));
    wait(13*1000-1).then(executeUpdate)
    wait(13*1000).then(executePlay)

    var wait = ms => new Promise((r, j)=>setTimeout(r, ms));
    wait(14*1000-1).then(executeBidWinnerCheck)
    wait(14*1000).then(executeUpdate)

    //Round 4
    var wait = ms => new Promise((r, j)=>setTimeout(r, ms));
    wait(15*1000-1).then(executeCardIDAdd)
    wait(15*1000-1).then(executeUpdate)
    wait(15*1000).then(executePlay)

    var wait = ms => new Promise((r, j)=>setTimeout(r, ms));
    wait(16*1000-1).then(executeUpdate)
    wait(16*1000).then(executePlay)

    var wait = ms => new Promise((r, j)=>setTimeout(r, ms));
    wait(17*1000-1).then(executeUpdate)
    wait(17*1000).then(executePlay)

    var wait = ms => new Promise((r, j)=>setTimeout(r, ms));
    wait(18*1000-1).then(executeUpdate)
    wait(18*1000).then(executePlay)

    var wait = ms => new Promise((r, j)=>setTimeout(r, ms));
    wait(19*1000-1).then(executeBidWinnerCheck)
    wait(19*1000).then(executeUpdate)

    //Round 5
    var wait = ms => new Promise((r, j)=>setTimeout(r, ms));
    wait(20*1000-1).then(executeCardIDAdd)
    wait(20*1000-1).then(executeUpdate)
    wait(20*1000).then(executePlay)

    var wait = ms => new Promise((r, j)=>setTimeout(r, ms));
    wait(21*1000-1).then(executeUpdate)
    wait(21*1000).then(executePlay)

    var wait = ms => new Promise((r, j)=>setTimeout(r, ms));
    wait(22*1000-1).then(executeUpdate)
    wait(22*1000).then(executePlay)

    var wait = ms => new Promise((r, j)=>setTimeout(r, ms));
    wait(23*1000-1).then(executeUpdate)
    wait(23*1000).then(executePlay)

    var wait = ms => new Promise((r, j)=>setTimeout(r, ms));
    wait(24*1000-1).then(executeBidWinnerCheck)
    wait(24*1000).then(executeUpdate)

    //Round 6
    var wait = ms => new Promise((r, j)=>setTimeout(r, ms));
    wait(25*1000-1).then(executeCardIDAdd)
    wait(25*1000-1).then(executeUpdate)
    wait(25*1000).then(executePlay)

    var wait = ms => new Promise((r, j)=>setTimeout(r, ms));
    wait(26*1000-1).then(executeUpdate)
    wait(26*1000).then(executePlay)

    var wait = ms => new Promise((r, j)=>setTimeout(r, ms));
    wait(27*1000-1).then(executeUpdate)
    wait(27*1000).then(executePlay)

    var wait = ms => new Promise((r, j)=>setTimeout(r, ms));
    wait(28*1000-1).then(executeUpdate)
    wait(28*1000).then(executePlay)

    var wait = ms => new Promise((r, j)=>setTimeout(r, ms));
    wait(29*1000-1).then(executeBidWinnerCheck)
    wait(29*1000).then(executeUpdate)

    //Round 7
    var wait = ms => new Promise((r, j)=>setTimeout(r, ms));
    wait(30*1000-1).then(executeCardIDAdd)
    wait(30*1000-1).then(executeUpdate)
    wait(30*1000).then(executePlay)

    var wait = ms => new Promise((r, j)=>setTimeout(r, ms));
    wait(31*1000-1).then(executeUpdate)
    wait(31*1000).then(executePlay)

    var wait = ms => new Promise((r, j)=>setTimeout(r, ms));
    wait(32*1000-1).then(executeUpdate)
    wait(32*1000).then(executePlay)

    var wait = ms => new Promise((r, j)=>setTimeout(r, ms));
    wait(33*1000-1).then(executeUpdate)
    wait(33*1000).then(executePlay)

    var wait = ms => new Promise((r, j)=>setTimeout(r, ms));
    wait(34*1000-1).then(executeBidWinnerCheck)
    wait(34*1000).then(executeUpdate)

   /* while(turnCounter <= 10){
        wait((timeCounter-1)*1000).then(executeTurnUpdate)
        wait((timeCounter-1)*1000).then(executeTimeUpdate)
        if(turnCounter%4!=0){
            var wait = ms => new Promise((r, j)=>setTimeout(r, ms));
            wait(timeCounter*1000-1).then(executeUpdate)
            wait(timeCounter*1000).then(executePlay)
            wait(timeCounter*1000).then(updateTimeCounters)
        }
        var wait = ms => new Promise((r, j)=>setTimeout(r, ms));
        wait(timeCounter*1000-1).then(executeBidWinnerCheck)
        wait(timeCounter*1000).then(executeUpdate)
    }*/
}

function allocateBidWinner(){
    setWinner = determine_player_won(currentBid, initPlayer, cardPile)
    setWins[setWinner] += 1;
    cardHistory.push(clone(cardPile));
    surface.select('.scoreBoard').select('.player' + setWinner + 'score').text(function(d) {return 'Player ' + setWinner + ' Sets Won: ' + setWins[setWinner];});
    for(i = 1; i < 5; i++){
        cardPile[i] = NaN;
        cardPlayed[i] = false;
    };
    if(has_anyone_won(bidWinner, partnerPlayer, currentBid, setWins)){
        gameOver = true;
        winningPair = has_anyone_won(bidWinner, partnerPlayer, currentBid, setWins);
    };
    clearPlayedCards();
    if(gameOver){ // If game is over, remove next player button and display who is the winner and who is the bidder's partner
        document.getElementById("gameButtonContainer").style.display = "none";
        surface.append('text')
            .attr('class','currentPlayer')
            .attr("x",function(d){return (maxCols/2-1)*cellWidth+"px";})
            .attr("y",function(d){return 12*cellHeight+"px";})
            .attr('font-size','64px')
            .attr('fill','white')
            .attr('font-weight',"bold")
            .attr('text-anchor','middle')
            .attr('stroke','black')
            .attr('stroke-width',2.5)
            .text(function(d) {return 'The ' + winningPair + ' has won!';});
        surface.append('text')
            .attr('class','currentPlayer')
            .attr("x",function(d){return (maxCols/2-1)*cellWidth+"px";})
            .attr("y",function(d){return 14*cellHeight+"px";})
            .attr('font-size','50px')
            .attr('fill','white')
            .attr('font-weight',"bold")
            .attr('text-anchor','middle')
            .attr('stroke','black')
            .attr('stroke-width',2.5)
            .text(function(d) {return "The bidder's partner is " + partnerPlayer;});
    }
    currentPlayer = setWinner;
    initPlayer = setWinner;
}

function playCardAuto(){
    ID = cardID;
    chosenCard = cards[currentPlayer].filter(function(d){return d.id == ID;})[0]
    suite = chosenCard.suite;
    number = chosenCard.number;
    function filterCard(card){
        return card.id != ID;
    }
    cardPile[currentPlayer] = {'suite':suite,'number':number};
    if(currentPlayer!= 1){
        d3.select('.player' + currentPlayer + 'Cards').selectAll('image').filter(function(d){return d.id == cards[currentPlayer].length-1;}).transition().duration(1000).style('opacity',0).remove() // Remove the card image
    } else {
        d3.select('.player1Cards').selectAll('image').filter(function(d){return d.id == ID;}).transition().duration(1000).style('opacity',0).remove() // Remove the card image for player 1
    }
    cards[currentPlayer] = cards[currentPlayer].filter(filterCard); // Remove the card from the original pile

    cardPile[currentPlayer] = {'suite':suite,'number':number,'location':NaN,'orientation':NaN};
    //Decide location and orientation based on the current player
    switch(currentPlayer){
        case 1:
            cardPile[currentPlayer].orientation = "bottom";
            cardPile[currentPlayer].location = initLocations[1];
        break;
        case 2:
            cardPile[currentPlayer].orientation = "left";
            cardPile[currentPlayer].location = initLocations[2];
        break;
        case 3:
            cardPile[currentPlayer].orientation = "top";
            cardPile[currentPlayer].location = initLocations[3];
        break;
        case 4:
            cardPile[currentPlayer].orientation = "right";
            cardPile[currentPlayer].location = initLocations[4];
        break;
    }
    // Lay the played card out in the centre of the board
    d3.select('.player' + currentPlayer + 'PlayedCard').selectAll().data([cardPile[currentPlayer]]).enter().append('svg:image')
        .attr("x",function(d){var cell= getLocationCell(d.location); return cell.x+"px";})
        .attr("y",function(d){var cell= getLocationCell(d.location); return cell.y+"px";})
        .attr("width", Math.min(cellWidth,cellHeight)*4+"px")
        .attr("height", Math.min(cellWidth,cellHeight)*3+"px")
        .attr("xlink:href",function(d){return cardsUrl[d.suite][Number(d.number)];})
        .style('opacity',0)
        
    if(cardPile[currentPlayer].orientation == "right"){
        d3.select('.player' + String(currentPlayer) + 'PlayedCard').selectAll('image').attr("transform", d3Transform().rotate(-90,20.5*cellWidth,6.25*cellHeight));
    }
    if(cardPile[currentPlayer].orientation == "left"){
        d3.select('.player' + String(currentPlayer) + 'PlayedCard').selectAll('image').attr("transform", d3Transform().rotate(90,18*cellWidth,7.5*cellHeight));
    }

    d3.select('.player' + currentPlayer + 'PlayedCard').selectAll('image').transition().duration(1000).style('opacity',1);
    completedTurns.push(currentPlayer);
    cardPlayed[currentPlayer] = true;
    console.log(cards);
    console.log(cardPile);
    if(cardPlayed[1] && cardPlayed[2] && cardPlayed[3] && cardPlayed[4]){

    } else {
        currentPlayer = (currentPlayer%4)+1;
    }
    
}


function autoPlayNA(){
    alert('This function is not available yet!')
}