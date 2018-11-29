function shuffle_cards() {

    let cardWeights = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14"];
    let cardTypes = ["Spades", "Hearts", "Diamonds", "Clubs"];
    let cards = Array();

    function card(number, suite) {
        this.number = number;
        this.suite = suite;
    }

    function CreateDeck() {
        cardTypes.forEach(function (suite) {
            cardWeights.forEach(function (type) {
                cards.push(new card(type, suite));
            });
        });
    }

    //Credits: Fisher-Yates (aka Knuth) Shuffle (https://github.com/Daplie/knuth-shuffle/blob/master/index.js)
    function ShuffleDeck(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle
    while (0 !== currentIndex) {

        // Pick a remaining element
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
    }

    CreateDeck();
    cards = ShuffleDeck(cards);
    return cards;
};

// Checks for wash
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
        let suite_count = {
            Spades : 0,
            Hearts : 0,
            Diamonds : 0,
            Clubs : 0
        }
        for (let card in players_cards[player]){
            if (players_cards[player][card].number == "11") score = score + 1;
            if (players_cards[player][card].number == "12") score = score + 2;
            if (players_cards[player][card].number == "13") score = score + 3;
            if (players_cards[player][card].number == "14") score = score + 4;
            if (players_cards[player][card].suite == "Spades") suite_count.Spades ++;
            if (players_cards[player][card].suite == "Hearts") suite_count.Hearts ++;
            if (players_cards[player][card].suite == "Diamonds") suite_count.Diamonds ++;
            if (players_cards[player][card].suite == "Clubs") suite_count.Clubs ++;
        }

        for (let suite in suite_count){
            if (suite_count[suite] >= 5) score ++;
        }
        if (score <= 4){player_score.push(true)}
    }
    if (player_score.includes(true)){return true}
    else {return false}
};

// Distributes cards among 4 players
function distribute_cards(){
    let cards = shuffle_cards()
    let players_cards = {
        Player1: cards.slice(0,13),
        Player2: cards.slice(13,26),
        Player3: cards.slice(26,39),
        Player4: cards.slice(39,52)
    }
    return players_cards
};

// Will redistribute cards if there is a wash. Will also rearrange order of cards by suit, by number
function distribute_cards_checked(initial_location){
    let players_cards = distribute_cards()
    while (check_for_wash(players_cards)){
        players_cards = distribute_cards()
    }
    for (let player in players_cards){
        for (let card_num in players_cards[player]){
            players_cards[player][card_num]['location'] = initial_location[player.replace("Player", "")]
        }
    }

    function filterByClubs(item){return item.suite === "Clubs"}
    function filterByDiamonds(item){return item.suite === "Diamonds"}
    function filterByHearts(item){return item.suite === "Hearts"}
    function filterBySpades(item){return item.suite === "Spades"}

    const sort_asc = (a,b) => {return parseInt(a.number) - parseInt(b.number)};

    for (let player in players_cards){
        // Rearrange cards by suit
        let clubs_cards = players_cards[player].filter(filterByClubs)
        let diamond_cards = players_cards[player].filter(filterByDiamonds)
        let hearts_cards = players_cards[player].filter(filterByHearts)
        let spades_cards = players_cards[player].filter(filterBySpades)

        // Rearrange cards in ascending order, by suit
        clubs_cards = clubs_cards.sort(sort_asc)
        diamond_cards = diamond_cards.sort(sort_asc)
        hearts_cards = hearts_cards.sort(sort_asc)
        spades_cards = spades_cards.sort(sort_asc)

        players_cards[player] = clubs_cards.concat(diamond_cards, hearts_cards, spades_cards)
    }
    return players_cards
};

//~~~~~ something similar to if __name__ == "__main__": ~~~~~

// const initial_location = {Player1 : {row: 1, column : 1},
//                           Player2 : {row: 2, column : 2},
//                           Player3 : {row: 3, column : 3},
//                           Player4 : {row: 4, column : 4}};

// distribute_cards_checked(initial_location)