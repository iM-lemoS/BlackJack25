// Blackjack OOP

let game = null; // Stores the current instance of the game
let botoes = ['card', 'stand', 'new_game', 'costumizeCards', 'costumizeBackground']; // Array of buttons
let blackCards = true; // Indicates whether the cards are black

/**
 * Function to debug and display the state of the game object.
 * @param {Object} obj - The object to be debugged.
 */
function debug(obj) {
    document.getElementById('debug').innerHTML = JSON.stringify(obj); // Displays the state of the object as JSON
}

/**
 * Initializes the game buttons.
 */
function buttonsInitialization() {
    document.getElementById('card').disabled = false; // Enables the button to draw a card
    document.getElementById('stand').disabled = true; // Disables the button to stand
    document.getElementById('new_game').disabled = false; // Enables the button for a new game
}

/**
 * Finalizes the buttons after the game ends.
 */
function finalizeButtons() {
    document.getElementById('card').disabled = true; // Disables the button to draw a card
    document.getElementById('stand').disabled = true; // Disables the button to stand
    document.getElementById('new_game').disabled = false; // Enables the button for a new game
}

/**
 * Clears the page to start a new game.
 */
function clearPage() {
    document.getElementById('player').innerHTML = ''; // Clears the player's cards
    document.getElementById('dealer').innerHTML = ''; // Clears the dealer's cards
    document.getElementById('dealer-title').innerHTML = 'Dealer'; // Resets the dealer's title
    document.getElementById('player-title').innerHTML = 'Player'; // Resets the player's title
}

/**
 * Starts a new game of Blackjack.
 */
function newGame() {
    game = new Blackjack(); // Creates a new instance of the Blackjack game
    clearPage(); // Clears the page to start a new game
    buttonsInitialization(); // Initializes the game buttons
    
    game.shuffle(game.newDeck()); // Shuffles the deck of cards
    game.dealerMove(); // Causes the dealer to draw a card
    game.playerMove(); // Causes the player to draw a card
    game.dealerMove(); // Causes the dealer to draw a card

    printCard('dealer', game.getDealerCards()[0]); // Prints the first card of the dealer
    printCard('dealer', game.getDealerCards(), false, true); // Prints the dealer's second card face down
    printCard('player', game.getPlayerCards()[0]); // Prints the first card of the player

    debug(game); // Displays the current state of the game for debugging
}

/**
 * Displays all the cards in the game.
 */
function displayAllCards() {
    let dealerCards = game.getDealerCards(); // Gets the dealer's cards
    let playerCards = game.getPlayerCards(); // Gets the player's cards

    document.getElementById('dealer').innerHTML = ''; // Clears the dealer's cards on the page
    document.getElementById('player').innerHTML = ''; // Clears the player's cards on the page

    for (let i = 0; i < dealerCards.length; i++) {
        printCard('dealer', dealerCards[i]); // Prints the dealer's cards on the page
    }

    for (let i = 0; i < playerCards.length; i++) {
        printCard('player', playerCards[i]); // Prints the player's cards on the page
    }
}

/**
 * Calculates and displays the final score of the game.
 * @param {Object} state - The current state of the game.
 */
function finalScore(state) {
    if (state.gameEnded) {
        let totalDealer = game.getCardsValue(game.getDealerCards()); // Gets the total value of the dealer's cards
        let totalPlayer = game.getCardsValue(game.getPlayerCards()); // Gets the total value of the player's cards

        if (state.dealerWon) {
            document.getElementById('dealer-title').innerHTML = `Dealer: GANHOU com ${totalDealer}`; // Updates the dealer's title
            document.getElementById('player-title').innerHTML = `Player: Perdeu com ${totalPlayer}`; // Updates the player's title

        } 
        else if (state.playerWon == true) {
            document.getElementById('dealer-title').innerHTML = `Dealer: Perdeu com ${totalDealer}`; // Updates the dealer's title
            document.getElementById('player-title').innerHTML = `Player: GANHOU com ${totalPlayer}`; // Updates the player's title
        }
        else if (!state.dealerWon && !state.playerWon) {
            document.getElementById('dealer-title').innerHTML = `Dealer: Empatou com ${totalDealer}`; // Updates the dealer's title
            document.getElementById('player-title').innerHTML = `Player: Empatou com ${totalPlayer}`; // Updates the player's title
        }
        
        displayAllCards(); // Displays all the cards in the game
    }
}

/**
 * Updates the dealer's state in the game.
 */
function updateDealer() {
    let dealerCards = game.getDealerCards(); // Gets the dealer's cards

    for (let i = 0; i < dealerCards.length; i++) {
        if (i == 0) {
            printCard('dealer', dealerCards[i], true, false); // Prints the dealer's cards on the page and substitutes the first card
        }
        else {
            printCard('dealer', dealerCards[i]); // Prints the dealer's cards on the page
        }
    }

    finalizeButtons(); // Finalizes the buttons after the game ends
}

/**
 * Updates the player's state in the game.
 * @param {Object} state - The current state of the game.
 */
function updatePlayer(state) {
    let playerCards = game.getPlayerCards(); // Gets the player's cards

    for (let i = 0; i < playerCards.length; i++) {
        if (i == 0) {
            printCard('player', playerCards[i], true, false); // Prints the player's cards on the page and substitutes the first card
        }
        else {
            printCard('player', playerCards[i]); // Prints the player's cards on the page
        }
    }

    let ganhouPerdeu = state.playerWon || state.dealerWon;
    if (ganhouPerdeu) {
        finalizeButtons(); // Finalizes the buttons after the game ends
        finalScore(state); // Displays the final score of the game
    }
}

/**
 * Causes the dealer to draw a new card.
 * @returns {Object} - The game state after the dealer's move.
 */
function dealerNewCard() {
    dealerFinish(); // Finishes the dealer's turn
    debug(game); // Displays the current state of the game for debugging
}

/**
 * Causes the player to draw a new card.
 * @returns {Object} - The game state after the player's move.
 */
function playerNewCard() {
    game.playerMove(); // Causes the player to draw a new card
    updatePlayer(game.getGameState()); // Updates the player's state in the game

    if (game.getPlayerCards().length === 2) {
        document.getElementById('stand').disabled = false; // Enables the button to stand
    }

    debug(game); // Displays the current state of the game for debugging
}

/**
 * Finishes the dealer's turn.
 */
function dealerFinish() {
    let dealerCards = game.getDealerCards(); // Gets the dealer's cards
    let playerCards = game.getPlayerCards(); // Gets the player's cards

    while ((game.getCardsValue(dealerCards) < 21) && (!game.getGameState().gameEnded)) {
        game.dealerMove(); // Causes the dealer to draw a new card
        updateDealer(game.getGameState()); // Updates the dealer's state in the game
    }

    if (game.getCardsValue(dealerCards) <= 25) {
        if (game.getCardsValue(dealerCards) > game.getCardsValue(playerCards)) {
            game.getGameState('dealer<25'); // Updates the dealer's state in the game if the dealer's cards are less than 25
        }
        else if (game.getCardsValue(dealerCards) == game.getCardsValue(playerCards)) {
            game.getGameState('dealer<25'); // Updates the dealer's state in the game if the dealer's cards are equal to the player's cards
        }
        else if (game.getCardsValue(dealerCards) < game.getCardsValue(playerCards)) {
            game.getGameState('dealer<25'); // Updates the dealer's state in the game if the dealer's cards are less than the player's cards
        }
    }
    else {
        game.getGameState(); // Updates the dealer's state in the game 
    }
    
    finalizeButtons(); // Finalizes the buttons after the game ends
    finalScore(game.getGameState()); // Displays the final score of the game
}

/**
 * Prints the card in the graphical interface.
 * @param {HTMLElement} element - The element where the card will be displayed.
 * @param {Card} card - The card to be displayed.
 * @param {boolean} [replace=false] - Indicates whether to replace the existing image.
 * @param {boolean} [showBack=false] - Indicates whether to show the back of the card.
 * @param {boolean} [black=true] - Indicates whether to use black cards.
 */
function printCard(element, card, replace = false, showBack = false) {
    let back = '';
    let imagePath = '';
    let imgTag = '';

    const smallScreen = window.matchMedia("(max-height: 729.6px)"); // Checks if the screen is small
    const mediumScreen = window.matchMedia("(max-height: 945px)"); // Checks if the screen is medium
    
    if (blackCards) {
        if (smallScreen.matches) {
            back = `<img src="https://im-lemos.github.io/BlackJack25/img/png_black_gold/card_back.png" alt="card back" style="width:125px; height:180px;" />`; // Sets the back of the card for small screens
            imagePath = `https://im-lemos.github.io/BlackJack25/img/png_black_gold/${card.value}_of_${card.suit}.png`; // Sets the image path for small screens
            imgTag = `<img src="${imagePath}" alt="${card.value} of ${card.suit}" style="width:125px; height:180px;" />`; // Sets the image tag for small screens
        }
        else if (mediumScreen.matches) {
            back = `<img src="https://im-lemos.github.io/BlackJack25/img/png_black_gold/card_back.png" alt="card back" style="width:174px; height:250px;" />`; // Sets the back of the card for medium screens 
            imagePath = `https://im-lemos.github.io/BlackJack25/img/png_black_gold/${card.value}_of_${card.suit}.png`; // Sets the image path for medium screens
            imgTag = `<img src="${imagePath}" alt="${card.value} of ${card.suit}" style="width:174px; height:250px;" />`; // Sets the image tag for medium screens
        }
    }
    else {
        if (smallScreen.matches) {
            back = `<img src="https://im-lemos.github.io/BlackJack25/img/png/card_back.png" alt="card back" style="width:125px; height:180px;" />`; // Sets the back of the card for small screens
            imagePath = `https://im-lemos.github.io/BlackJack25/img/png/${card.value}_of_${card.suit}.png`; // Sets the image path for small screens
            imgTag = `<img src="${imagePath}" alt="${card.value} of ${card.suit}" style="width:125px; height:180px;" />`; // Sets the image tag for small screens
        }
        else if (mediumScreen.matches) {
            back = `<img src="https://im-lemos.github.io/BlackJack25/img/png/card_back.png" alt="card back" style="width:174px; height:250px;" />`; // Sets the back of the card for medium screens
            imagePath = `https://im-lemos.github.io/BlackJack25/img/png/${card.value}_of_${card.suit}.png`; // Sets the image path for medium screens
            imgTag = `<img src="${imagePath}" alt="${card.value} of ${card.suit}" style="width:174px; height:250px;" />`; // Sets the image tag for medium screens
        }
    }

    if (showBack) {
        document.getElementById(element).innerHTML += back; // Displays the back of the card on the page
    }
    else {
        if (replace) {
            document.getElementById(element).innerHTML = imgTag; // Replaces the existing image with the new image
        } else {
            document.getElementById(element).innerHTML += imgTag; // Adds the new image to the existing image
        }
    }
}

/** 
 * Method to get the hover effect of the buttons
 */
function hoverEffect(id, backgroundColor1, color1, backgroundColor2, color2) {
    const botao = document.getElementById(id); // Gets the button

    botao.addEventListener("mouseover", function() { // Adds a mouseover event to the button
        botao.style.backgroundColor = backgroundColor1; // Changes the background color of the button
        botao.style.color = color1; // Changes the text color of the button
    });

    botao.addEventListener("mouseout", function() { // Adds a mouseout event to the button
        botao.style.backgroundColor = backgroundColor2; // Changes the background color of the button
        botao.style.color = color2; // Changes the text color of the button
    });
}

/**
 * Generic function to change the background of the game.
 */
function mudarFundo(fundo, corTitulo, corBotaoBackground, corBotaoTexto, hoverParams) {
    document.body.style.backgroundImage = `url(../img/background/${fundo}.png)`; // Defines the background of the game

    document.getElementById('dealer-title').style.color = corTitulo; // Defines the color of the dealer's title
    document.getElementById('player-title').style.color = corTitulo; // Defines the color of the player's title
    document.getElementById('title-blackjack').style.color = corTitulo; // Defines the color of the game title

    for (let i = 0; i < botoes.length; i++) {
        const botao = document.getElementById(botoes[i]); // Gets the button
        botao.style.backgroundColor = corBotaoBackground; // Defines the background color of the button
        botao.style.color = corBotaoTexto; // Defines the text color of the button
        hoverEffect(botoes[i], ...hoverParams); // Applies the hover effect to the button
    }
}

/**
 * Changes the background to green.
 */
function fundoVerde() {
    mudarFundo('GREEN', 'white', 'red', 'white', ['#870000', 'black', 'red', 'white']);
}

/**
 * Changes the background to red.
 */
function fundoVermelho() {
    mudarFundo('RED', 'white', 'black', 'white', ['white', '#870000', 'black', 'white']);
}

/**
 * Changes the background to white.
 */
function fundoBranco() {
    mudarFundo('WHITE', 'black', 'black', 'white', ['#870000', 'black', 'black', 'white']);
}

/**
 * Changes the background to black.
 */
function fundoPreto() {
    mudarFundo('BLACK', 'white', 'white', 'red', ['#870000', 'white', 'white', 'red']);
}

/**
 * Changes the background to gold.
 */
function fundoDourado() {
    mudarFundo('GOLD', '#a28c40', 'black', '#a28c40', ['white', '#a28c40', 'black', '#a28c40']);
}


/**
 * Changes the cards to the color White.
 */
function cartasBrancas() {
    blackCards = false; // Changes the cards to the color White
    newGame(); // Starts a new game
}

/**
 * Changes the cards to the color Black.
 */
function cartasPretas() {
    blackCards = true; // Changes the cards to the color Black
    newGame(); // Starts a new game
}

