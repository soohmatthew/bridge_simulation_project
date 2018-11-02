

function shuffle_cards() {

    let cardWeights = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14"];
    let cardTypes = ["Spades", "Hearts", "Diamonds", "Clubs"];
    let cards = Array();

    function card(cardType, weight) {
        this.cardType = cardType;
        this.weight = weight;
    }

    function CreateDeck() {
        cardTypes.forEach(function (weight) {
            cardWeights.forEach(function (type) {
                cards.push(new card(type, weight));
            });
        });
    }

    function getRandomInt(min, max) {return Math.floor(Math.random() * (max - min + 1)) + min;}

    function shuffleDeck(shuffleCnt) {
        for(let i = 0; i < shuffleCnt; i++) {
            let rndNo = getRandomInt(0, 51);
            let card = cards[i];
            cards[i] = cards[rndNo];
            cards[rndNo] = card;
        }
    }

    CreateDeck();
    shuffleDeck(getRandomInt(10, 25));
    return cards;
};

function check_for_wash(players_cards){
    //Point System: If player has 4 points or less, the cards will be reshuffled.
    //Jack = 1 point
    //Queen = 2 points
    //King = 3 points
    //Ace = 4 points
    //5 cards of the same kind = 1 point
    let player_score = []
    for (let player in players_cards){
        let score = 0
        let weight_count = {
            Spades : 0,
            Hearts : 0,
            Diamonds : 0,
            Clubs : 0
        }
        for (let card in players_cards[player]){
            if (players_cards[player][card].cardType == "11") score = score + 1;
            if (players_cards[player][card].cardType == "12") score = score + 2;
            if (players_cards[player][card].cardType == "13") score = score + 3;
            if (players_cards[player][card].cardType == "14") score = score + 4;
            if (players_cards[player][card].weight == "Spades") weight_count.Spades ++;
            if (players_cards[player][card].weight == "Hearts") weight_count.Hearts ++;
            if (players_cards[player][card].weight == "Diamonds") weight_count.Diamonds ++;
            if (players_cards[player][card].weight == "Clubs") weight_count.Clubs ++;
        }

        for (let weight in weight_count){
            if (weight_count[weight] >= 5) score ++;
        }
        if (score <= 4){player_score.push(true)}
    }
    if (player_score.includes(true)){return true}
    else {return false}
};

function distribute_cards(){
    let cards = shuffle_cards()

    let players_cards = {
        Player1: cards.slice(0,12),
        Player2: cards.slice(13,25),
        Player3: cards.slice(26,38),
        Player4: cards.slice(39,51)
    }
    return players_cards
};

const initial_location = {Player1 : {row: 1, column : 1},
                          Player2 : {row: 2, column : 2},
                          Player3 : {row: 3, column : 3},
                          Player4 : {row: 4, column : 4}};

console.log(initial_location)

function distribute_cards_checked(initial_location){
    players_cards = distribute_cards()
    while (check_for_wash(players_cards)){
        players_cards = distribute_cards()
    }
    // localStorage.setItem(players_cards, players_cards);
    for (let player in players_cards){
        for (let card_num in players_cards[player]){
            players_cards[player][card_num]['Location'] = initial_location[player]
        }
    } 
    console.log(players_cards)
    return players_cards
};

distribute_cards_checked(initial_location)


