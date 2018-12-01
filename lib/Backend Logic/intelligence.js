/////////////////////////// For testing /////////////////////////////////////////////////////////////
// let bidArray = [{Player1: "1 Spades"}, {Player2: "Pass"}, {Player3: "2 Spades"}, {Player4: "Pass"}] 
// const maxCols = 40
// var initLocations = {
//     1:{"row":12,"col":maxCols/2-2},
//     2:{"row":10,"col":maxCols/2+0.5},
//     3:{"row":8,"col":maxCols/2-2},
//     4:{"row":8,"col":maxCols/2-4.9}
// }

// let players_cards = distribute_cards_checked(initLocations)
// var cards = {1:players_cards["Player1"],
//              2:players_cards["Player2"],
//              3:players_cards["Player3"],
//              4:players_cards["Player4"]};

// const current_player = 1

function bidding_intell(cards, current_player, bidArray){
    let cards_player_holds = cards[current_player]

    let card_score_raw = {"Spades": 0,
                      "Hearts": 0,
                      "Clubs" : 0,
                      "Diamonds" : 0}

    let card_score_w_card_count = {"Spades": 0,
                      "Hearts": 0,
                      "Clubs" : 0,
                      "Diamonds" : 0}

    // Count strength of each suite
    // Ace - 4 points
    // K -3
    // Q - 2
    // J - 1
    // No. of cards in hand (n) = n points

    function score(card){
        if (parseInt(card.number) >= 10){card_score_raw[card.suite] = card_score_raw[card.suite] + parseInt(card.number) - 9}
        return card.suite
    }
    function score_with_suite_count(card){
        if (parseInt(card.number) >= 10){card_score_w_card_count[card.suite] = card_score_w_card_count[card.suite] + parseInt(card.number) - 9}
        card_score_w_card_count[card.suite] = card_score_w_card_count[card.suite]
        return card.suite
    }
    cards_player_holds.map(score)
    let card_count_array = cards_player_holds.map(score_with_suite_count)
    var  card_count = {};
    card_count_array.forEach(function(i) { card_count[i] = (card_count[i]||0) + 1;});
    function add_to_card_score_w_card_count(suite){
        if (card_count[suite] >= 5){
            card_score_w_card_count[suite] = card_score_w_card_count[suite] + card_count[suite]}
        return suite}
    Object.keys(card_count).map(add_to_card_score_w_card_count)

    // Maximum that bidder should bid for each suite
    let bid_goal = {"Spades": 0,
                     "Hearts": 0,
                     "Clubs" : 0,
                     "Diamonds" : 0,
                     "No Trump" : 0}

    // Check if player should try and play no trump
    let sum_of_raw_card_scores = Object.values(card_score_raw).reduce((a, b) => a + b, 0)
    if (Object.values(card_score_raw).filter(score => score >= 2).length === 4){
        // If each suite has a card score of more than or equals to 2, bid the min card score of all the suites
        bid_goal["No Trump"] = Math.min.apply(Math, Object.values(card_score_raw))
    }
    if (sum_of_raw_card_scores >= 16){
        // If total card scores is greater than 16, should try and bid for trump
        bid_goal["No Trump"] = Math.floor((sum_of_raw_card_scores - 16)/2)
    }
    // Calculate bid for suites based on card score with card count
    let suit_available = ['Clubs', 'Diamonds', 'Hearts', 'Spades']
    function apply_bid_rounding(suite){
        bid_goal[suite] = Math.round(card_score_w_card_count[suite] * 0.2161+0.1328)
    }
    suit_available.map(apply_bid_rounding)

    // Choose bid based on current bid
    latest_three_bids = bidArray.slice(Math.max(bidArray.length -3, 0))
    // Filter out the passes
    let latest_three_bids_pass_rm = latest_three_bids.filter(x => Object.values(x)[0] != "Pass")
    // Latest bid (ASSUMING THAT IF THERE ARE 3 PASSES, THAT THE GAME WILL START, AND FUNCTION WILL NOT BE CALLED)
    let latest_bid = Object.values(latest_three_bids_pass_rm[latest_three_bids_pass_rm.length-1])[0]
    // Priority of what to bid
    let bid_goal_arr = []
    for (var key in Object.keys(bid_goal)){
        if (bid_goal[Object.keys(bid_goal)[key]] != 0){
        bid_goal_arr.push(String(bid_goal[Object.keys(bid_goal)[key]]) + " " + Object.keys(bid_goal)[key])
    }
}
    let trumps_available = Array()
    let trumps_available_numbers = [1,2,3,4,5,6,7]
    let trumps_available_suites = ['Clubs', 'Diamonds', 'Hearts', 'Spades', 'No Trump']

    for (let number in trumps_available_numbers){
        for (let suit in trumps_available_suites){
            trumps_available.push([String(trumps_available_numbers[number]), trumps_available_suites[suit]].join(" "))
        }
    }
    function index_of_arr(card){return trumps_available.indexOf(card)}
    let bid_goal_arr_index = bid_goal_arr.map(index_of_arr).sort()
    let latest_bid_index = trumps_available.indexOf(latest_bid)

    function find_num_greater(score){return score > latest_bid_index}
    function index_to_card(score){return trumps_available[score]}
    let possible_bids_left = bid_goal_arr_index.filter(find_num_greater).map(index_to_card)

    if (possible_bids_left.length === 0){return "Pass"}
    else {
        best_bid = possible_bids_left[0]
        best_bid_suite = best_bid.replace(/[0-9] /g, '')
        latest_bid_suite = latest_bid.replace(/[0-9] /g, '');
        if (best_bid_suite === latest_bid_suite){return "Pass"}
        else {return best_bid}
    }
}
