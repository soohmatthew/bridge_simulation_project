// Decides who is the player to start bidding
function decide_who_starts(){
    player = Math.ceil(4 * Math.random())
    player = ["Player", String(player)].join('')
    return player
}

// Based on the current bid, return the next 5 available bids + option to pass
function available_bids(current_bid){
    var number_available = [1,2,3,4,5]
    var suit_available = ['Clubs', 'Diamonds', 'Hearts', 'Spades', 'No Trump']

    var trumps_available = Array()
    for (var number in number_available){
        for (var suit in suit_available){
            trumps_available.push([String(number_available[number]), suit_available[suit]].join(" "))
        }
    }

    if (current_bid == null){var index_of_current_bid = 0}
    else {var index_of_current_bid = trumps_available.indexOf(current_bid)}

    var trumps_available_output = trumps_available.slice(index_of_current_bid + 1, index_of_current_bid + 6)
    trumps_available_output.push("Pass")
    return trumps_available_output; 
}

function fill_button(current_bid){
    var array_of_labels = available_bids(current_bid)
    for (var id in array_of_labels){
        
    }
    
}

const bid_array = [{Player1 : "Pass",
                    Player2 : "1 Clubs",
                    Player3 : "1 Diamonds",
                    Player4 : "1 Hearts"},
                   {Player1 : "Pass",
                    Player2 : "2 Clubs",
                    Player3 : "2 Diamonds",
                    Player4 : null}]

const turn = 3
const player = 2
const correct_current_bid = "3 Clubs"
const wrong_current_bid = "1 Spades"

function check_bid_validity(turn, player, current_bid, bid_array){
    var number_available = [1,2,3,4,5]
    var suit_available = ['Clubs', 'Diamonds', 'Hearts', 'Spades', 'No Trump']

    var trumps_available = Array()
    for (var number in number_available){
        for (var suit in suit_available){
            trumps_available.push([String(number_available[number]), suit_available[suit]].join(" "))
        }
    }
    console.log(bid_array[turn])
}


