// Decides who is the player to start bidding
function decide_who_starts(){
    player = Math.ceil(4 * Math.random())
    player = ["Player", String(player)].join('')
    return player
}

// Based on the current bid, return the next 5 available bids + option to pass
function available_bids(current_bid){
    let number_available = [1,2,3,4,5]
    let suit_available = ['Clubs', 'Diamonds', 'Hearts', 'Spades', 'No Trump']

    let trumps_available = Array()
    for (let number in number_available){
        for (let suit in suit_available){
            trumps_available.push([String(number_available[number]), suit_available[suit]].join(" "))
        }
    }

    if (current_bid == null){let index_of_current_bid = 0}
    else {let index_of_current_bid = trumps_available.indexOf(current_bid)}

    let trumps_available_output = trumps_available.slice(index_of_current_bid + 1, index_of_current_bid + 6)
    trumps_available_output.push("Pass")
    return trumps_available_output; 
}

function fill_button(current_bid){
    let array_of_labels = available_bids(current_bid)
    for (let id in array_of_labels){
        
    }
    
}

const bid_array = [{Player1 : "Pass"},
                   {Player2 : "1 Clubs"},
                   {Player3 : "1 Diamonds"},
                   {Player4 : "1 Hearts"},
                   {Player1 : "Pass"},
                   {Player2 : "Pass"},
                   {Player3 : "2 Diamonds"}]

const correct_current_bid = "3 Clubs"
const current_bid_pass = "Pass"
const wrong_current_bid = "1 Spades"

// Function takes in current turn, current player, current bid, bid array
// Checks if bid is valid
//     if valid, check if can start
//     if not valid, return invalid
// return Valid / Start / Bid array
function check_bid_validity(current_bid, bid_array){
    let trumps_available = Array()
    let number_available = [1,2,3,4,5]
    let suit_available = ['Clubs', 'Diamonds', 'Hearts', 'Spades', 'No Trump']

    for (let number in number_available){
        for (let suit in suit_available){
            trumps_available.push([String(number_available[number]), suit_available[suit]].join(" "))
        }
    }

    // Latest three bids
    let latest_three = bid_array.slice(Math.max(bid_array.length - 3, 0))
    // Latest two bids
    let latest_two = bid_array.slice(Math.max(bid_array.length - 2, 0))

    // Check if the game can start
    if (latest_three.length === 3){
        if (current_bid === "Pass"){
            let latest_two_vals = latest_two.map(x => Object.values(x)[0]);
            function filter_number_of_passes(item){return item === "Pass"}
            if (latest_two.filter(filter_number_of_passes).length === 2){
                // Game can start, because the last three bids were passes
                return true, true, bid_array.push("Pass")
            }
        }
    }
}

check_bid_validity(current_bid_pass, bid_array);