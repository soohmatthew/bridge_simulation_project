

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
    let latest_bid = 0
    if (latest_three_bids_pass_rm.length > 0){
        latest_bid = Object.values(latest_three_bids_pass_rm[latest_three_bids_pass_rm.length-1])[0]
    }
    
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
    let latest_bid_index = -1
    if (latest_bid != 0) {latest_bid_index = trumps_available.indexOf(latest_bid)}

    function find_num_greater(score){return score > latest_bid_index}
    function index_to_card(score){return trumps_available[score]}
    let possible_bids_left = bid_goal_arr_index.filter(find_num_greater).map(index_to_card)
    if (possible_bids_left.length === 0){return "Pass"}
    else {
        best_bid = possible_bids_left[0]
        if (latest_bid != 0){
            best_bid_suite = best_bid.replace(/[0-9] /g, '')
            latest_bid_suite = latest_bid.replace(/[0-9] /g, '');
        if (best_bid_suite === latest_bid_suite){return "Pass"}
        else {return best_bid}
        }
        else {
            best_bid_suite = best_bid.replace(/[0-9] /g, '')
            best_bid = "1 " + best_bid_suite
            return best_bid}
    }
}

function chose_partner(currentBid, cards, bidWinner){
    // Pick the highest card of trump suite that the bidder does not already have
    let current_hand_of_cards = cards[bidWinner]
    let card_scores_for_trump_suite = current_hand_of_cards.filter(x => x.suite === currentBid.suite).map(x => parseInt(x.number))
    const card_range = [...Array(15).keys()]
    card_range.shift()
    card_range.shift()
    let highest_possible = card_range.filter(function(element) {return card_scores_for_trump_suite.indexOf(element) === -1})
    let partner_card = {'suite' : currentBid.suite, 'number': highest_possible[highest_possible.length - 1]}
    return partner_card
}

function card_play_intell(cards, current_player, cardHistory, cardPile, starting_player, currentBid, bidWinner, partnerCard){
    let current_hand_of_cards = cards[current_player]
    const start_suite = cardPile[starting_player].suite
    const trump_suite = currentBid.suite
    let all_cards_played = cardHistory.map(x => Object.values(x)).flat()

    // Count number of cards in each suite
    const suites_count = {};
    
    current_hand_of_cards.map(x => x.suite).forEach(function(x) { suites_count[x] = (suites_count[x] || 0)+1; });

    function cards_of_clubs_suite(card){return card.suite === "Clubs"}
    function cards_of_diamonds_suite(card){return card.suite === "Diamonds"}
    function cards_of_hearts_suite(card){return card.suite === "Hearts"}
    function cards_of_spades_suite(card){return card.suite === "Spades"}

    let highest_cards_of_clubs_suite = Math.max(... current_hand_of_cards.filter(cards_of_clubs_suite).map(x => parseInt(x.number)))
    let highest_cards_of_diamonds_suite = Math.max(... current_hand_of_cards.filter(cards_of_diamonds_suite).map(x => parseInt(x.number)))
    let highest_cards_of_hearts_suite = Math.max(... current_hand_of_cards.filter(cards_of_hearts_suite).map(x => parseInt(x.number)))
    let highest_cards_of_spades_suite = Math.max(... current_hand_of_cards.filter(cards_of_spades_suite).map(x => parseInt(x.number)))

    let lowest_cards_of_clubs_suite = Math.min(... current_hand_of_cards.filter(cards_of_clubs_suite).map(x => parseInt(x.number)))
    let lowest_cards_of_diamonds_suite = Math.min(... current_hand_of_cards.filter(cards_of_diamonds_suite).map(x => parseInt(x.number)))
    let lowest_cards_of_hearts_suite = Math.min(... current_hand_of_cards.filter(cards_of_hearts_suite).map(x => parseInt(x.number)))
    let lowest_cards_of_spades_suite = Math.min(... current_hand_of_cards.filter(cards_of_spades_suite).map(x => parseInt(x.number)))

    let highest_cards_of_each_suite = [{'suite': "Clubs", "number": highest_cards_of_clubs_suite},
                                       {'suite': "Diamonds", "number": highest_cards_of_diamonds_suite},
                                       {'suite': "Hearts", "number": highest_cards_of_hearts_suite},
                                       {'suite': "Spades", "number": highest_cards_of_spades_suite}]

    let lowest_cards_of_each_suite = [{'suite': "Clubs", "number": lowest_cards_of_clubs_suite},
                                       {'suite': "Diamonds", "number": lowest_cards_of_diamonds_suite},
                                       {'suite': "Hearts", "number": lowest_cards_of_hearts_suite},
                                       {'suite': "Spades", "number": lowest_cards_of_spades_suite}]

    const card_range = [...Array(15).keys()]
    card_range.shift()

    // If player is starting the round
    if (starting_player === current_player){
        possible_cards_to_play = []
//     if possible (meaning to say, any cards higher than the highest card has already been thrown), play highest card of the deck.
        for (let i = 0; i < highest_cards_of_each_suite.length; i ++){
            let card_hist_of_certain_suite = all_cards_played.filter(x => x.suite === highest_cards_of_each_suite[i].suite)
            let all_higher_cards = card_hist_of_certain_suite.filter(x => parseInt(x.number) > highest_cards_of_each_suite[i].number)
            let all_higher_cards_num = all_higher_cards.map(x => parseInt(x.number))
            let highest_possible = card_range.filter(function(element) {return all_higher_cards_num.indexOf(element) === -1});
            if (highest_possible[highest_possible.length - 1] === highest_cards_of_each_suite[i].number){possible_cards_to_play.push(highest_cards_of_each_suite[i])}
        }
        if (possible_cards_to_play.length === 1){return possible_cards_to_play[0]}
        //if there are multiple highest cards, play the one that has the least cards played.
        else if (possible_cards_to_play.length > 1){
            let suite_with_min_within_possible_cards = Math.min(... possible_cards_to_play.map(x => x.suite).map(x => suites_count[x]))
            possible_suites_to_play_filtered = []
            let possible_suites = possible_cards_to_play.map(x => x.suite)
            for (suite in possible_suites){
                if (suites_count[possible_suites[suite]] === suite_with_min_within_possible_cards){possible_suites_to_play_filtered.push(possible_suites[suite])}
            }
            let card_to_play = possible_cards_to_play.filter(x => x.suite === possible_suites_to_play_filtered[0])
            return card_to_play[0]}
        //     else if not possible, play the lowest card of the suite in your hand that has the least cards.
        else {
            suite_to_play = []
            for (i in Object.keys(suites_count)){
                if (suites_count[Object.keys(suites_count)[i]] === Math.min(... Object.values(suites_count))){
                    suite_to_play.push(Object.keys(suites_count)[i])
                }
            }
            let card_to_play = lowest_cards_of_each_suite.filter(x => x.suite === suite_to_play[0])
            return card_to_play[0]            
        }
    }
    // If player is not starting the round
    else {
        let playable_cards_of_starting_suite = current_hand_of_cards.filter(x => x.suite === start_suite)
        let partnerKnown = false
        // Check if player himself is partner
        if (current_hand_of_cards.filter(x => x.suite === partnerCard.suite && x.number === partnerCard.number).length === 1){
            partnerKnown = true
            let players = [1,2,3,4]
            var teams = {"bidderTeam" : [],
                         "opponentTeam": []}
            teams.bidderTeam.push(bidWinner)
            teams.bidderTeam.push(current_player)
            teams.opponentTeam = players.filter(x => x != bidWinner && x != current_player)
            
            var player_partner = NaN
            var team = ""
            var opponentTeam = ""
            player_partner = bidWinner 
            team = "bidderTeam";
            opponentTeam = "opponentTeam"}

        // figure out who is your partner (watch for partner card)
        // if partner card is in cardhistory, partners are known
        else if (all_cards_played.filter(x => x.suite === partnerCard.suite && x.number === partnerCard.number).length === 1){
            partnerKnown = true
            let players = [1,2,3,4]
            var teams = {"bidderTeam" : [],
                         "opponentTeam": []}
            for (round in cardHistory){
                for (i in Object.keys(cardHistory[round])){
                    let current_card = cardHistory[round][Object.keys(cardHistory[round])[i]]
                    if (current_card.suite === partnerCard.suite && current_card.suite === partnerCard.suite){
                        bidder_partner = parseInt(Object.keys(cardHistory[round])[i])
                    }
                }
            }
            teams.bidderTeam.push(bidWinner)
            teams.bidderTeam.push(bidder_partner)
            teams.opponentTeam = players.filter(x => x != bidWinner && x != bidder_partner)
            
            var player_partner = NaN
            var team = ""
            var opponentTeam = ""
            if (teams.bidderTeam.includes(current_player)){
                player_partner = teams.bidderTeam.filter(x=> x != current_player)[0]; 
                team = "bidderTeam";
                opponentTeam = "opponentTeam"}
            else if (teams.opponentTeam.includes(current_player)){
                player_partner = teams.opponentTeam.filter(x=> x != current_player)[0]; 
                team = "opponentTeam";
                opponentTeam = "bidderTeam";}
        }
        // if partner is known
        if (partnerKnown){
            // if partner has not played
            if (isNaN(cardPile[player_partner].number)){
                // if out of current suite
                if (playable_cards_of_starting_suite.length === 0){
                    // if have trump card
                    let trump_cards_on_hand = current_hand_of_cards.filter(x => x.suite === trump_suite)
                    if (trump_cards_on_hand.length > 0){
                        // play lowest card of trump suite
                        lowest_card = {"number" : 10000}
                        for (i in trump_cards_on_hand){
                            console.log(parseInt(trump_cards_on_hand[i].number))
                            if (parseInt(trump_cards_on_hand[i].number) < parseInt(lowest_card.number)){
                                console.log('true')
                                lowest_card = trump_cards_on_hand[i]
                            }
                        }
                        return (lowest_card)
                    }
                    // else play lowest card from other suite
                    else {
                        suite_to_play = []
                        for (i in Object.keys(suites_count)){
                            if (suites_count[Object.keys(suites_count)[i]] === Math.min(... Object.values(suites_count))){
                                suite_to_play.push(Object.keys(suites_count)[i])
                            }
                        }
                        let card_to_play = lowest_cards_of_each_suite.filter(x => x.suite === suite_to_play[0])
                        return card_to_play[0]

                    }
                }
                // else if still have current suite
                else {
                    // if player has highest card of suite, play card
                    let all_cards_of_starting_suite_played = all_cards_played.filter(x => x.suite === start_suite).map(x => parseInt(x.number))
                    let list_of_numbers_not_played = card_range.filter(function(element) {return all_cards_of_starting_suite_played.indexOf(element) === -1});
                    for (i in playable_cards_of_starting_suite){
                        if (parseInt(playable_cards_of_starting_suite[i].number) === list_of_numbers_not_played[list_of_numbers_not_played.length - 1]){
                            return playable_cards_of_starting_suite[i]
                        }
                    }
                    // else if player does not have highest card of suite, play lowest card that can beat current card
                    card_scores_to_beat = []
                    for (i in Object.keys(cardPile)){
                        let card_played_in_cardPile = cardPile[Object.keys(cardPile)[i]]
                        if (card_played_in_cardPile.suite === start_suite){card_scores_to_beat.push(parseInt(card_played_in_cardPile.number))}
                    }
                    card_scores_to_beat = card_scores_to_beat.sort((a, b) => a - b)
                    let possible_cards_to_play = playable_cards_of_starting_suite.map(x => parseInt(x.number)).filter(x => x > card_scores_to_beat[card_scores_to_beat.length - 1]).sort((a, b) => a - b)
                    if (possible_cards_to_play.length > 0){
                        let possible_card_to_play = current_hand_of_cards.filter(x => x.number === String(possible_cards_to_play[0]) && x.suite === start_suite)
                        return possible_card_to_play[0]}
                    // else if no card to beat current card, play lowest card
                    else {
                        let smallest_card_number = playable_cards_of_starting_suite.map(x => parseInt(x.number)).sort((a, b) => a - b)
                        let possible_card_to_play = playable_cards_of_starting_suite.filter(x => x.number === String(smallest_card_number[0]))
                        return possible_card_to_play[0]
                    }
                }
            }
            // if partner has played
            else {
                // if out of current suite
                if (playable_cards_of_starting_suite.length === 0){
                // if 0 or 1 opponent played
                    if ((isNaN(cardPile[teams[opponentTeam][0]].number) && isNaN(cardPile[teams[opponentTeam][1]].number)) || (isNaN(cardPile[teams[opponentTeam][0]].number) || isNaN(cardPile[teams[opponentTeam][1]].number))){
                    // if partner's card is highest possible of starting suite
                        let card_hist_of_partner_suite = all_cards_played.filter(x => x.suite === cardPile[player_partner].suite)
                        let all_higher_cards_than_partner = card_hist_of_partner_suite.filter(x => parseInt(x.number) > cardPile[player_partner].number)
                        let all_higher_cards_than_partner_num = all_higher_cards_than_partner.map(x => parseInt(x.number))
                        let highest_possible_for_partner = card_range.filter(function(element) {return all_higher_cards_than_partner_num.indexOf(element) === -1});
                        if (highest_possible_for_partner[highest_possible_for_partner.length - 1] === parseInt(cardPile[player_partner].number) || parseInt(cardPile[player_partner].number) >= 11 || current_hand_of_cards.filter(x => x.suite === trump_suite).length === 0){
                            // partner's card is the highest possible of starting suite OR partner's card is >= 11 (strong card) OR you have no trump card
                            // play lowest card of other non trump suite
                            let smallest_number_of_non_trump_suite = current_hand_of_cards.filter(x => x.suite != start_suite).map(x => parseInt(x.number)).sort((a, b) => a - b)
                            let possible_card_to_play_of_non_trump_suite = current_hand_of_cards.filter(x => x.number === String(smallest_number_of_non_trump_suite[0]) && x.suite != start_suite)
                            return possible_card_to_play_of_non_trump_suite[0]
                        }
                        else {
                            // if partner's card is < 10
                            if (current_hand_of_cards.filter(x => x.suite === trump_suite).length > 0){
                                // if you have trump card, play lowest trump card
                                let smallest_number_of_trump_suite = current_hand_of_cards.filter(x => x.suite === trump_suite).map(x => parseInt(x.number)).sort((a, b) => a - b)
                                let possible_card_to_play_of_trump_suite = current_hand_of_cards.filter(x => x.number === String(smallest_number_of_trump_suite[0]) && x.suite === trump_suite)
                                return possible_card_to_play_of_trump_suite[0]
                            }
                        }
                    }
                    // if 2 opponents played
                    else {
                        // if partner has highest card in cardPile, play lowest of other non trump suite
                        // if partner's card is trump card, only compare among trump cards
                        if (cardPile[player_partner].suite === trump_suite){
                            let card1_to_compare = [cardPile[teams.opponentTeam[0]]].filter(x => x.suite === trump_suite).map(x => parseInt(x.number))
                            let card2_to_compare = [cardPile[teams.opponentTeam[1]]].filter(x => x.suite === trump_suite).map(x => parseInt(x.number))
                            // if partner did not win,
                            if (parseInt(cardPile[player_partner].number) < card1_to_compare[0] || parseInt(cardPile[player_partner].number) < card2_to_compare[0]){
                                let smallest_card_in_trump = current_hand_of_cards.filter(x => x.suite === trump_suite).map(x => parseInt(x.number)).filter(x => x > card1_to_compare[0] || x > card2_to_compare[0]).sort((a, b) => a - b)
                                // if player can win, play said card
                                if (smallest_card_in_trump.length > 0){
                                    let possible_card_to_play = current_hand_of_cards.filter(x => x.suite === trump_suite && x.number === String(smallest_card_in_trump[0]))
                                    return possible_card_to_play[0]
                                }
                                else {
                                    // if player cannot win, play lowest of other non trump suite
                                    let smallest_number_of_non_trump_suite = current_hand_of_cards.filter(x => x.suite != start_suite).map(x => parseInt(x.number)).sort((a, b) => a - b)
                                    let possible_card_to_play_of_non_trump_suite = current_hand_of_cards.filter(x => x.number === String(smallest_number_of_non_trump_suite[0]) && x.suite != start_suite)
                                    return possible_card_to_play_of_non_trump_suite[0]
                                }
                            }
                        }
                        else {
                            // If partner does not have trump
                            // Check if opponent has played trump
                            let card1_to_compare = [cardPile[teams.opponentTeam[0]]].filter(x => x.suite === trump_suite).map(x => parseInt(x.number))
                            let card2_to_compare = [cardPile[teams.opponentTeam[1]]].filter(x => x.suite === trump_suite).map(x => parseInt(x.number))
                            if (card1_to_compare.length > 0 || card2_to_compare.length > 0){
                                // If player can win, play said card
                                let smallest_card_in_trump = current_hand_of_cards.filter(x => x.suite === trump_suite).map(x => parseInt(x.number)).filter(x => x > card1_to_compare[0] || x > card2_to_compare[0]).sort((a, b) => a - b)
                                if (smallest_card_in_trump.length > 0){
                                    let possible_card_to_play = current_hand_of_cards.filter(x => x.suite === trump_suite && x.number === String(smallest_card_in_trump[0]))
                                    return possible_card_to_play[0]
                                }
                                else {
                                    // else if player cannot win, play lowest of other non trump suite
                                    let smallest_number_of_non_trump_suite = current_hand_of_cards.filter(x => x.suite != start_suite).map(x => parseInt(x.number)).sort((a, b) => a - b)
                                    let possible_card_to_play_of_non_trump_suite = current_hand_of_cards.filter(x => x.number === String(smallest_number_of_non_trump_suite[0]) && x.suite != start_suite)
                                    return possible_card_to_play_of_non_trump_suite[0]
                                }
                            }
                            // Partner and opponent did not play trump
                            else {
                                let card1_to_compare = [cardPile[teams.opponentTeam[0]]].filter(x => x.suite === start_suite).map(x => parseInt(x.number))
                                let card2_to_compare = [cardPile[teams.opponentTeam[1]]].filter(x => x.suite === start_suite).map(x => parseInt(x.number))                        // if partner has highest card in cardPile
                                if (cardPile[player_partner].suite === start_suite && cardPile[player_partner].number > card1_to_compare[0] && cardPile[player_partner].number > card2_to_compare[0]){
                                    let smallest_number_of_non_trump_suite = current_hand_of_cards.filter(x => x.suite != start_suite).map(x => parseInt(x.number)).sort((a, b) => a - b)
                                    let possible_card_to_play_of_non_trump_suite = current_hand_of_cards.filter(x => x.number === String(smallest_number_of_non_trump_suite[0]) && x.suite != start_suite)
                                    return possible_card_to_play_of_non_trump_suite[0]
                                }
                                else {
                                // If player can win with trump, play said card
                                let smallest_card_in_trump = current_hand_of_cards.filter(x => x.suite === trump_suite).map(x => parseInt(x.number)).filter(x => x > card1_to_compare[0] || x > card2_to_compare[0]).sort((a, b) => a - b)
                                if (smallest_card_in_trump.length > 0){
                                    let possible_card_to_play = current_hand_of_cards.filter(x => x.suite === trump_suite && x.number === String(smallest_card_in_trump[0]))
                                    return possible_card_to_play[0]
                                }
                                else {
                                    // else if player cannot win, play lowest of other non trump suite
                                    let smallest_number_of_non_trump_suite = current_hand_of_cards.filter(x => x.suite != start_suite).map(x => parseInt(x.number)).sort((a, b) => a - b)
                                    let possible_card_to_play_of_non_trump_suite = current_hand_of_cards.filter(x => x.number === String(smallest_number_of_non_trump_suite[0]) && x.suite != start_suite)
                                    return possible_card_to_play_of_non_trump_suite[0]
                                }
                                }
                            }
                        }
                    }
                }
                // else if still have current suite
                else {
                    // if partner's card is highest possible of starting suite or if partner's card is >= 11
                    let card_hist_of_partner_suite = all_cards_played.filter(x => x.suite === cardPile[player_partner].suite)
                    let all_higher_cards_than_partner = card_hist_of_partner_suite.filter(x => parseInt(x.number) > cardPile[player_partner].number)
                    let all_higher_cards_than_partner_num = all_higher_cards_than_partner.map(x => parseInt(x.number))
                    let highest_possible_for_partner = card_range.filter(function(element) {return all_higher_cards_than_partner_num.indexOf(element) === -1});
                    if (highest_possible_for_partner[highest_possible_for_partner.length - 1] === parseInt(cardPile[player_partner].number) || parseInt(cardPile[player_partner].number) >= 11){
                        //     play lowest card of the suite
                        let smallest_number_of_current_suite = current_hand_of_cards.filter(x => x.suite === start_suite).map(x => parseInt(x.number)).sort((a, b) => a - b)
                        let possible_card_to_play_of_current_suite = current_hand_of_cards.filter(x => x.number === String(smallest_number_of_current_suite[0]) && x.suite === start_suite)
                        return possible_card_to_play_of_current_suite[0]
                    }
                    // else if partner's card is < 10
                    else {
                        //     if you have a card greater than partner's card, play that card
                        let cards_greater_than_partner_current_suite = current_hand_of_cards.filter(x => x.suite === start_suite).filter(x => parseInt(x.number) > parseInt(cardPile[player_partner].number))
                        if (cards_greater_than_partner_current_suite.length > 0){
                            return cards_greater_than_partner_current_suite[0]
                        }
                        else {
                            // else play lowest card of suite
                            let smallest_number_of_current_suite = current_hand_of_cards.filter(x => x.suite === start_suite).map(x => parseInt(x.number)).sort((a, b) => a - b)
                            let possible_card_to_play_of_current_suite = current_hand_of_cards.filter(x => x.number === String(smallest_number_of_current_suite[0]) && x.suite === start_suite)
                            return possible_card_to_play_of_current_suite[0]
                        }
                    }
                }
            }
        }
        // If partner is not known
        else {
            let playable_cards_of_starting_suite = current_hand_of_cards.filter(x => x.suite === start_suite)
            // If out of current suite
            if (playable_cards_of_starting_suite.length === 0){
                let playable_cards_of_trump_suite = current_hand_of_cards.filter(x => x.suite === trump_suite)
                // if have trump card, play lowest card of trump suite
                if (playable_cards_of_trump_suite.length > 0){
                    let smallest_number_of_trump_suite = current_hand_of_cards.filter(x => x.suite === trump_suite).map(x => parseInt(x.number)).sort((a, b) => a - b)
                    let possible_card_to_play_of_trump_suite = current_hand_of_cards.filter(x => x.number === String(smallest_number_of_trump_suite[0]) && x.suite === trump_suite)
                    return possible_card_to_play_of_trump_suite[0]
                }
                else {
                    // else, play lowest card from other suite
                    let smallest_number_of_non_trump_suite = current_hand_of_cards.filter(x => x.suite != trump_suite && x.suite != start_suite).map(x => parseInt(x.number)).sort((a, b) => a - b)
                    let possible_card_to_play_of_non_trump_suite = current_hand_of_cards.filter(x => x.number === String(smallest_number_of_non_trump_suite[0]) && x.suite != trump_suite && x.suite != start_suite)
                    return possible_card_to_play_of_non_trump_suite[0]
                }
            }
            // else if not out of current suite
            else {
                // if current hand has highest card of suite, play highest card of suite
                let card_hist_of_starting_suite = all_cards_played.filter(x => x.suite === start_suite)
                let highest_number_of_starting_suite = current_hand_of_cards.filter(x => x.suite === start_suite).map(x => parseInt(x.number)).sort((a, b) => a - b)
                let all_higher_cards_than_current_hand_played = card_hist_of_starting_suite.filter(x => parseInt(x.number) > highest_number_of_starting_suite[highest_number_of_starting_suite.length - 1])
                let all_higher_cards_than_current_hand_played_num = all_higher_cards_than_current_hand_played.map(x => parseInt(x.number))
                let highest_possible_for_suite = card_range.filter(function(element) {return all_higher_cards_than_current_hand_played_num.indexOf(element) === -1});
                if (all_higher_cards_than_current_hand_played_num[all_higher_cards_than_current_hand_played_num.length - 1] === highest_possible_for_suite[highest_possible_for_suite.length - 1]){
                    let possible_card_to_play_of_starting_suite = current_hand_of_cards.filter(x => x.number === String(highest_possible_for_suite[highest_possible_for_suite.length - 1]) && x.suite === start_suite)
                    return possible_card_to_play_of_starting_suite[0]
                }
                // else, play lowest card of suite
                else {
                    let lowest_number_of_starting_suite = highest_number_of_starting_suite[0]
                    let possible_card_to_play_of_starting_suite = current_hand_of_cards.filter(x => x.number === String(lowest_number_of_starting_suite) && x.suite === start_suite)
                    return possible_card_to_play_of_starting_suite[0]
                }
            }
        }
    }             
}

/////////////////////////////////////////////FOR TESTING//////////////////////////////////

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

// const current_player = 4

// cardPile = {1: {'suite': "Hearts", "number": "2"},
//                 2: {'suite': NaN, "number": NaN},
//                 3: {'suite': "Clubs", "number": "3"},
//                 4: {'suite': "Hearts", "number": "4"}}

// let cardHistory = [{1: {'suite': "Spades", "number": "14"},
//                     2: {'suite': "Spades", "number": "1"},
//                     3: {'suite': "Spades", "number": "12"},
//                     4: {'suite': "Spades", "number": "4"}}, 
//                     {1: {'suite': "Hearts", "number": "3"},
//                     2: {'suite': "Hearts", "number": "13"},
//                     3: {'suite': "Hearts", "number": "14"},
//                     4: {'suite': "Hearts", "number": "4"}}]

// const starting_player = 3

// let currentBid = {'suite':"Clubs",'sets': "1"}

// const bidWinner = 1

// partnerCard = {'suite': "Spades", "number": "10"}

// console.log(card_play_intell(cards, current_player, cardHistory, cardPile, starting_player, currentBid, bidWinner, partnerCard))