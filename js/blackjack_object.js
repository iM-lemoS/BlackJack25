// Blackjack object

/**
 * Class that represents the Blackjack game.
 */
class Blackjack {
    // Constant that defines the maximum points to avoid busting in Blackjack
    static MAX_POINTS = 25;
    // Constant that defines the point threshold at which the dealer must stand
    static DEALER_MAX_TURN_POINTS = 21;

    /**
     * Creates an instance of Blackjack and initializes the deck.
     */
    constructor() {
        this.dealerCards = []; // Array to hold the dealer's cards
        this.playerCards = []; // Array to hold the player's cards
        this.dealerTurn = false; // Flag to indicate if it's the dealer's turn to play

        // State of the game with information about the outcome
        this.state = {
            gameEnded: false, // Indicates whether the game has ended
            playerWon: false, // Indicates if the player has won
            dealerWon: false, // Indicates if the dealer has won
            playerBusted: false, // Indicates if the player has exceeded MAX_POINTS
            dealerBusted: false // Indicates if the dealer has exceeded MAX_POINTS
        };

        // Initialize the deck of cards
        this.deck = this.shuffle(this.newDeck()); // Create and shuffle a new deck
    }

    /**
     * Creates a new deck of cards.
     * @returns {Card[]} - An array of cards.
     */
    newDeck() {
        const suits = ['hearts', 'diamonds', 'clubs', 'spades']; // Defines the suits of the cards
        const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king', 'ace']; // Defines the values of the cards
        const deck = []; // Initializes the deck of cards

        for (const suit of suits) {
            for (const value of values) {
                deck.push({ suit, value }); // Adds the cards to the deck
            }
        }

        return deck; // Returns the deck of cards
    }

    /**
     * Shuffles the deck of cards.
     * @param {Card[]} deck - The deck of cards to be shuffled.
     * @returns {Card[]} - The shuffled deck.
     */
    shuffle(deck) {
        let indices = []; // Initializes the indices array
        for (let i = 0; i < deck.length; i++) {
            indices.push(i); // Adds the indices to the array
        }
        let deckBaralhado = []; // Initializes the shuffled deck

        for (let i = 0; i < deck.length; i++) {
            const randomIndex = Math.floor(Math.random() * indices.length); // Gets a random index
            
            deckBaralhado.push(deck[indices[randomIndex]]); // Adds the card to the shuffled deck

            indices.splice(randomIndex, 1); // Removes the used index
        }

        return deckBaralhado; // Returns the shuffled deck
    }

    /**
     * Returns the dealer's cards.
     * @returns {Card[]} - An array containing the dealer's cards.
     */
    getDealerCards() {
        return this.dealerCards.slice(); // Return a copy of the dealer's cards
    }

    /**
     * Returns the player's cards.
     * @returns {Card[]} - An array containing the player's cards.
     */
    getPlayerCards() {
        return this.playerCards.slice(); // Return a copy of the player's cards
    }

    /**
     * Sets whether it is the dealer's turn to play.
     * @param {boolean} val - Value indicating if it's the dealer's turn.
     */
    setDealerTurn(val) {
        this.dealerTurn = val; // Update the dealer's turn status
    }

    /**
     * Calculates the total value of the provided cards.
     * @param {Card[]} cards - Array of cards to be evaluated.
     * @returns {number} - The total value of the cards.
     */
    getCardsValue(cards) {
        let total = 0; // Initializes the total value of the cards
        let cardsComANoFim = cards.slice(); // Creates a copy of the cards

        for (let i = 0; i < cardsComANoFim.length; i++) {
            if (cardsComANoFim[i].value === 'ace') {
                let ace = cardsComANoFim.splice(i, 1)[0]; // Removes the ace from the array
                cardsComANoFim.push(ace); // Adds the ace to the end of the array
            }
        }
        
        function valorDaCarta(valor) {
            if (valor === '2' || valor === '3' || valor === '4' || valor === '5' || valor === '6' || valor === '7' || valor === '8' || valor === '9' || valor === '10') { 
                return parseInt(valor); // Returns the value of the card
            } else if (valor === 'jack' || valor === 'queen' || valor === 'king') {
                return 10; // Returns the value of the card
            } else if (valor === 'ace') {
                return 11; // Returns the value of the card
            }
            return 0; // Returns 0 if the card is not recognized
        }

        for (let i = 0; i < cardsComANoFim.length; i++) {
            if (cardsComANoFim[i].value === 'ace' && total >= 15) {
                total -= 10; // Subtracts 10 from the total if the card is an ace and the total is greater than or equal to 15
            }
            total += valorDaCarta(cardsComANoFim[i].value); // Adds the value of the card to the total
        }

        return total;
    }

    /**
     * Executes the dealer's move by adding a card to the dealer's array.
     * @returns {Object} - The game state after the dealer's move.
     */
    dealerMove() {
        this.dealerCards.push(this.deck.pop()); // Adds the last card of the deck to the dealer's array
    }

    /**
     * Executes the player's move by adding a card to the player's array.
     * @returns {Object} - The game state after the player's move.
     */
    playerMove() {  
        this.playerCards.push(this.deck.pop()); // Adds the last card of the deck to the player's array
    }

    /**
     * Checks the game state based on the dealer's and player's cards.
     * @param {string} string - Defines if is the dealer's turn (the rules are different in this case).
     * @returns {Object} - The updated game state.
     */
    getGameState(string = '') {
        let cartasDoJogador = this.getCardsValue(this.playerCards); // Gets the value of the player's cards
        let cartasDoDealer = this.getCardsValue(this.dealerCards); // Gets the value of the dealer's cards  

        if (cartasDoJogador == 25) {
            this.state = {
                gameEnded: true,
                playerWon: true,
                dealerWon: false,
                playerBusted: false,
                dealerBusted: false
            };
        }
        else if (cartasDoJogador > 25) {
            this.state = {
                gameEnded: true,
                playerWon: false,
                dealerWon: true,
                playerBusted: true,
                dealerBusted: false
            };
        }
        else if (cartasDoDealer == 25) {
            this.state = {
                gameEnded: true,
                playerWon: false,
                dealerWon: true,
                playerBusted: false,
                dealerBusted: false
            };
        }
        else if (cartasDoDealer > 25) {
            this.state = {
                gameEnded: true,
                playerWon: true,
                dealerWon: false,
                playerBusted: false,
                dealerBusted: true
            };
        }
        else if (cartasDoJogador == cartasDoDealer) {
            this.state = {
                gameEnded: true,
                playerWon: false,
                dealerWon: false,
                playerBusted: false,
                dealerBusted: false
            };
        }
        else if (string == 'dealer<25')  {
            if (cartasDoDealer > cartasDoJogador) {
                this.state = {
                    gameEnded: true,
                    playerWon: false,
                    dealerWon: true,
                    playerBusted: false,
                    dealerBusted: false
                }
            }
            else if (cartasDoDealer == cartasDoJogador) {
                this.state = {
                    gameEnded: true,
                    playerWon: false,
                    dealerWon: false,
                    playerBusted: false,
                    dealerBusted: false
                }
            }
            else if (cartasDoDealer < cartasDoJogador) {
                this.state = {
                    gameEnded: true,
                    playerWon: true,
                    dealerWon: false,
                    playerBusted: false,
                    dealerBusted: false
                }
            }
        }
        return this.state; // Returns the game state
    }
}
