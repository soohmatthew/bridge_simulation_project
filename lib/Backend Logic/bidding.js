// Function takes in current turn, current player, current bid, bid array
// Checks if bid is valid
//     if valid, check if can start
//     if not valid, return invalid
// return Valid / Start / Bid array

function check_bid_validity(current_player, current_bid, bid_array, rebidded){
    let trumps_available = Array()
    let number_available = [1,2,3,4,5,6,7]
    let suit_available = ['Clubs', 'Diamonds', 'Hearts', 'Spades', 'No Trump']

    for (let number in number_available){
        for (let suit in suit_available){
            trumps_available.push([String(number_available[number]), suit_available[suit]].join(" "))
        }
    }
    trumps_available.unshift("Pass")

    if (rebidded == true){
        bid_array.splice(-1,1)
    }

    if (bid_array.length === 0){
        latest_bid = {}
        latest_bid[current_player] = current_bid
        bid_array.push(latest_bid)
        console.log("valid, don't start")
        return [true, false, bid_array]
    }

    // Latest three bids
    let latest_three = bid_array.slice(Math.max(bid_array.length - 3, 0))
    // Latest two bids
    let latest_two = bid_array.slice(Math.max(bid_array.length - 2, 0))
    let latest_two_vals = latest_two.map(x => Object.values(x)[0]);

    // Check if the game can start
    if (latest_three.length === 3){
        if (current_bid === "Pass"){
            function filter_number_of_passes(item){return item === "Pass"}
            // If the last 2 cards have been consecutive passes
            if (latest_two_vals.filter(filter_number_of_passes).length === 2){
                latest_bid = {}
                latest_bid[current_player] = "Pass"
                bid_array.push(latest_bid)
                // Game can start, because the last three bids were passes
                console.log("valid, start")
                return [true, true, bid_array];
            }
            // If the last 2 cards have NOT been consecutive passes
            else {
                latest_bid = {}
                latest_bid[current_player] = current_bid
                bid_array.push(latest_bid)
                console.log("valid, don't start")
                return [true, false, bid_array];
            }
        }
        else {            
            let latest_three_vals_index = latest_three.map(x => trumps_available.indexOf(Object.values(x)[0]));
            current_latest_bid = Math.max(... latest_three_vals_index)
            trumps_available_output = trumps_available.slice(current_latest_bid + 1)
            if (trumps_available_output.includes(current_bid)){
                // Bid is valid, if it is in the list of trumps available after the latest bid
                latest_bid = {}
                latest_bid[current_player] = current_bid
                bid_array.push(latest_bid)
                console.log("valid, don't start")
                return [true, false, bid_array];
            }
            else {
                console.log("not valid, don't start")
                // Bid invalid otherwise, return original array.
                return [false, false, bid_array];
            }
        }
    }
    // If there are less than 3 cards, there is no need to check if we can start
    else {
        if (current_bid === "Pass"){
            latest_bid = {}
            latest_bid[current_player] = current_bid
            bid_array.push(latest_bid)
            console.log("valid, don't start")
            return [true, false, bid_array];
        }
        else {
            // Check if bid is valid
            // Check last 3 cards to get highest value
            let latest_three_vals_index = latest_three.map(x => trumps_available.indexOf(Object.values(x)[0]));
            current_latest_bid = Math.max(... latest_three_vals_index)
            trumps_available_output = trumps_available.slice(current_latest_bid + 1)
            if (trumps_available_output.includes(current_bid)){
                // Bid is valid, if it is in the list of trumps available after the latest bid
                latest_bid = {}
                latest_bid[current_player] = current_bid
                bid_array.push(latest_bid)
                console.log("valid, don't start")
                return [true, false, bid_array];
            }
            else {
                console.log("not valid, don't start")
                // Bid invalid otherwise, return original array.
                return [false, false, bid_array];
            }
        }
    }
}

function check_partner_validity(bid_winner, cards, chosen_partner_number, chosen_partner_suite){
    let bid_winner_cards = cards[bid_winner]
    let possible_partners = [1,2,3,4]
    possible_partners.splice(possible_partners.indexOf(bid_winner), 1);
    function card_in_own_deck(card){return card.number === chosen_partner_number && card.suite === chosen_partner_suite}
    // If checks if card is in own deck
    let card_in_own_deck_length = bid_winner_cards.filter(card_in_own_deck).length
    if (card_in_own_deck_length > 0){
        return ([null, false])}
    else {for (let partner = 0; partner < possible_partners.length; partner++) {
            let possible_partner_card = cards[possible_partners[partner]]
            if (possible_partner_card.filter(card_in_own_deck).length > 0){
                return ([possible_partners[partner], true])}
        }}
}

function check_if_able_to_play_card(current_player, starting_player, currentBid, cardPile, card_chosen, cards){
    let trump = currentBid.suite
    let players = [1,2,3,4]
    let players_cards = cards[current_player]
    console.log(players_cards)
    // check how many players have played
    function count_players_played(player){return cardPile[player].suite}
    number_of_players_played = players.filter(count_players_played).length
    // If he is the first player
    if (current_player === starting_player){
        //     if trump is broken
        if (trumpBroken){return true} //         he can play whatever card he wants
        else {if (trump === card_chosen.suite){
                alert("Trump has not been broken yet!")  // if he plays trump: ALERT
                return false}
              else {return true}} //else he can play only suites that are not trump
    }
    else {
        // From the second player onwards, he has to play the suite of the first card thrown
        if (card_chosen.suite === cardPile[starting_player].suite){return true}
        else { // check if he still has a card of that suite
            function extract_suite(card){return card.suite === cardPile[starting_player].suite}
            if (players_cards.filter(extract_suite).length > 0){ // If we can still find a card of the starting suite in the current player's deck
                alert("You still have a card of the " + cardPile[starting_player].suite + " suite!")
                return false
            }
            else { // He does not have the starting suite anymore
                if (card_chosen.suite === trump){ // If he throws trump, trump is broken
                    trumpBroken = true 
                    return true
                }
                else {return true}
            }
        } 
    }
}

function determine_player_won(currentBid, starting_player, card_pile){
    let trump = currentBid.suite
    let first_card_thrown = card_pile[starting_player].suite
    let players = [1,2,3,4]
    // Find for any trump cards in card pile
    function trump_card_present(player){return card_pile[player].suite === trump}
    let get_list_of_trump_cards = players.filter(trump_card_present)
    // If people play the trump card in the round, we only need to compare which trump cards in the cardPile is the highest, ignore the first_card_throw
    if (get_list_of_trump_cards.length > 0){
        let get_list_of_scores = get_list_of_trump_cards.map(i => parseInt(card_pile[i].number))
        let highest_score = Math.max.apply(null, get_list_of_scores)
        function player_with_best_score(player){return parseInt(card_pile[player].number) === highest_score}
        let winner = get_list_of_trump_cards.filter(player_with_best_score)
        return winner
    }
    else {
        // If there are no trumps, then we just look at the highest of the starting suite
        function hold_same_as_first_card_thrown(player){return card_pile[player].suite === first_card_thrown}
        let get_list_of_same_suite_cards = players.filter(hold_same_as_first_card_thrown)
        let get_list_of_scores = get_list_of_same_suite_cards.map(i => parseInt(card_pile[i].number))
        let highest_score = Math.max.apply(null, get_list_of_scores)
        function player_with_best_score(player){return parseInt(card_pile[player].number) === highest_score}
        let winner = get_list_of_same_suite_cards.filter(player_with_best_score)
        return winner[0]
    }
}

function has_anyone_won(bidder, partner, currentBid, current_score){
    function filter_opponent_players(player){if (player != partner && player != bidder) {return (true)} else {return (false)}}

    let bidder_score_goal = parseInt(currentBid.sets) + 6
    let opponent_score_goal = 8 - parseInt(currentBid.sets)
    let opponent_players = [1,2,3,4].filter(filter_opponent_players)
    let bidder_team_score = current_score[bidder] + current_score[partner]
    let opponent_team_score = [current_score[opponent_players[0]], current_score[opponent_players[1]]].reduce(function(a, b) { return a + b; }, 0)

    if (bidder_team_score >= bidder_score_goal){return "bidder"}
    else if (opponent_team_score >= opponent_score_goal){return "opponent"}
    else {return false}
}



/////////////////////////////////////////////////// TESTING ////////////////////////////////////////////////////////

// var maxCols = 40;
// var initLocations = {
//     1:{"row":12,"col":maxCols/2-2},
//     2:{"row":10,"col":maxCols/2+0.5},
//     3:{"row":8,"col":maxCols/2-2},
//     4:{"row":8,"col":maxCols/2-4.9}
// };
// var players_cards = distribute_cards_checked(initLocations)
// var cards = {1:players_cards["Player1"],
//              2:players_cards["Player2"],
//              3:players_cards["Player3"],
//              4:players_cards["Player4"]};

// var bid_winner = 1

// console.log(check_partner_validity(bid_winner, cards, "14", "Spades"))

// // DETERMINE IF ANYONE WON

// let bidder = 2
// let partner = 3
// let current_score = {1:1,2:1,3:1,4:7}
// var currentBid = {'suite':"Clubs",'sets': "1"};

// //console.log(has_anyone_won(bidder, partner, currentBid, current_score))

// // DETERMINE WHO WON//

// let cardPile = {1: {'suite': "Spades", "number": "14"},
//                 2: {'suite': "Hearts", "number": "1"},
//                 3: {'suite': "Diamonds", "number": "12"},
//                 4: {'suite': "Hearts", "number": "3"}}

// const starting_player = 2

// //console.log(determine_player_won(currentBid, starting_player, cardPile))
// const current_player1 = 3

// const starting_player1 = 2

// var currentBid1 = {'suite':"Clubs",'sets': "1"};

// let cardPile1 = {1: {'suite': NaN, "number": NaN},
//                 2: {'suite': "Hearts", "number": "14"},
//                 3: {'suite': NaN, "number": NaN},
//                 4: {'suite': NaN, "number": NaN}}

// card_chosen1 = {'suite': "Spades", "number": "1"}

// trump_broken = false

// let players_cards1 = distribute_cards_checked(initLocations)
// var cards1 = {1:players_cards["Player1"],
//              2:players_cards["Player2"],
//              3:players_cards["Player3"],
//              4:players_cards["Player4"]};

// console.log(check_if_able_to_play_card(current_player1, starting_player1, currentBid1, cardPile1, card_chosen1, cards1))
// console.log(trump_broken)
