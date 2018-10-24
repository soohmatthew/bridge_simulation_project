function shuffle_cards() {

    var cardWeights = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
    var cardTypes = ["Spades", "Hearts", "Diamonds", "Clubs"];
    var cards = Array();

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

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function shuffleDeck(shuffleCnt) {
        for(var i = 0; i < shuffleCnt; i++) {
            var rndNo = getRandomInt(0, 51);
            var card = cards[i];
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
    var player_score = []
    for (var player in players_cards){
        var score = 0
        var weight_count = {
            Spades : 0,
            Hearts : 0,
            Diamonds : 0,
            Clubs : 0
        }
        for (var card in players_cards[player]){
            if (players_cards[player][card].cardType == "J") score = score + 1;
            if (players_cards[player][card].cardType == "Q") score = score + 2;
            if (players_cards[player][card].cardType == "K") score = score + 3;
            if (players_cards[player][card].cardType == "A") score = score + 4;
            if (players_cards[player][card].weight == "Spades") weight_count.Spades ++;
            if (players_cards[player][card].weight == "Hearts") weight_count.Hearts ++;
            if (players_cards[player][card].weight == "Diamonds") weight_count.Diamonds ++;
            if (players_cards[player][card].weight == "Clubs") weight_count.Clubs ++;
        }

        for (var weight in weight_count){
            if (weight_count[weight] >= 5) score ++;
        }
        if (score <= 4){player_score.push(true)}
    }
    if (player_score.includes(true)){return true}
    else {return false}
};

function distribute_cards(){
    var cards = shuffle_cards()

    var players_cards = {
        Player1: cards.slice(0,12),
        Player2: cards.slice(13,25),
        Player3: cards.slice(26,38),
        Player4: cards.slice(39,51)
    }
    return players_cards
};

(function distribute_cards_checked(){
    players_cards = distribute_cards()
    while (check_for_wash(players_cards)){
        players_cards = distribute_cards()
    }
    localStorage.setItem(players_cards, players_cards);
    console.log(players_cards)
    return players_cards
})();
