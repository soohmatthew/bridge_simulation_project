// Decides who is the player to start bidding
function decide_who_starts(){
    player = Math.ceil(4 * Math.random())
    player = ["Player", String(player)].join('')
    return player
}

// Function takes in current turn, current player, current bid, bid array
// Checks if bid is valid
//     if valid, check if can start
//     if not valid, return invalid
// return Valid / Start / Bid array
function check_bid_validity(current_player, current_bid, bid_array, rebidded){
    let trumps_available = Array()
    let number_available = [1,2,3,4,5]
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

// FOR TESTING:

// const current_player = "Player4"
// const bid_array = [{Player1: "1 Spades"}, {Player2: "2 No Trump"}, {Player3: "5 Diamonds"}]
// const current_bid = "5 No Trump"

// output = check_bid_validity(current_player, current_bid, bid_array, false)

// console.log(output)

    