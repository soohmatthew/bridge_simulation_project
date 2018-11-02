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

console.log(available_bids("2 Clubs"))
