
var view = {
    
    displayMessage: function(msg){
        
        var message= document.getElementById("messageArea");
        
        message.innerHTML = msg;
    },
    
    
    displayHit: function(location){
        
        var loc = document.getElementById(location);
        
        this.displayMessage("YOU HIT");
        
        loc.setAttribute("class", "hit");
    },
    
    
    displayMiss: function(location){
        
        var loc = document.getElementById(location);
        
        loc.setAttribute("class", "miss");
    }
}


var model = {
    
    boardSize: 7,
    
    numShips: 3,
    
    shipsSunk: 0,
    
    shipLength: 3,
    
    ships: [{locations: [0, 0, 0], hits: ["","",""]},
           
            {locations: [0, 0, 0], hits: ["","",""]},
            
            {locations: [0, 0, 0], hits:["","",""]}],
    
    
    fire: function(guess){
        
        for(var i=0; i < this.numShips; i++){
            
            var ship = this.ships[i];
            
            var index = ship.locations.indexOf(guess);
            
            if(index >= 0){
                
                view.displayHit(guess);
                
                ship.hits[index] = "hit";
                
                    if(this.isSunk(ship)){
                    
                        view.displayMessage("You Sunk My Battleship");
                    
                        this.shipsSunk++;
                    
                    }
                
                return true;
                
            }
            
            
        }
        
        view.displayMiss(guess);
            
        view.displayMessage("YOU MISSED");
        
        return false;
    },
    
    
    isSunk: function(ship){
        
        for(var i=0; i < this.shipLength; i++){
        
            if(ship.hits[i] !== "hit"){
                
                return false;
                
            }
            
        }
        
        return true;
        
    },
    
    
    generateShipLocations: function(){
        
        var locations;
        
        for(var i = 0; i < this.numShips; i++){
            
            do{
                
                locations = this.generateShip();
                
            } while(this.collision(locations));
            
            this.ships[i].locations = locations;
        }
    },
    
    
    generateShip: function(){
        
        var direction = Math.floor(Math.random() * 2);
        
        var row , col;
        
        
        if(direction === 1){
            
            row = Math.floor(Math.random() * this.boardSize);
            
            col = Math.floor(Math.random() * (this.boardSize - this.shipLength));
        }
        
        else{
            
            row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
            
            col = Math.floor(Math.random() * this.boardSize);
        }
        
        var newShipLocations = [];
        
        
        for(var i = 0; i < this.shipLength; i++){
            
            if(direction === 1){
                
                newShipLocations.push(row + "" + (col+i));
            }
            
            else{
                
                newShipLocations.push((row+i) + "" + col);
            }
        }
        
        return newShipLocations;
        
        
    },
    
    
    
    collision: function(locations){
        
        for(var i = 0; i < this.numShips; i++){
            
            var ship = this.ships[i];
            
            for(var j = 0; j < locations.length; j++){
                
                if(ship.locations.indexOf(locations[j]) >= 0){
                    
                    return true;
                }
            }
        }
        
        return false;
    }
    
    
    
};


var controller = {
    
    guesses: 0,
    
    parseGuess:function(guess){
        
        if(guess === null || guess.length !== 2){
            
            alert("Oops! Put Some Valid Guess");
        }
        
        else{
            
            var alphabet = ["A", "B", "C", "D", "E", "F", "G"];
            
            var firstChar = guess.charAt(0)
            
            var row = alphabet.indexOf(firstChar);
            
            var column = guess.charAt(1);
            
            if(isNaN(row) || isNaN(column)){
                
                alert("Oops! That isn't on the board!");
            }
        
            else if(row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize){
                
                alert("Oops! That's off the board!");
            }
            
            else{
                
                return row + column;
            }
            
        }
        
        return null;
    },
    
    
    processGuess:function(guess){
        
        var location = this.parseGuess(guess);
        
        if(location){
            
            this.guesses++
            
            var hit = model.fire(location);
            
            
            if(hit && model.shipsSunk === model.numShips){
                
                view.displayMessage("Congrats! You Sank All My Battlships, in "+ this.guesses + " Guesses");
            }
        }
    }
    
};


function inIt(){
    
    var fireButton = document.getElementById("fireButton");
    
    fireButton.onclick = handleFireButton;
    
    var guessInput = document.getElementById("guessInput");
    
    guessInput.onkeypress = handleKeyPress;
    
    model.generateShipLocations();
    
}

function handleKeyPress(e){
    
    var fireButton = document.getElementById("fireButton");
    
    if(e.keyCode === 13){
        
        fireButton.click();
        
        // Here an KeyboardEvent is assigning to 'e'. Whose type is Object.
        
        return false; 
    }
    
}

function handleFireButton(){
    
    var guessInput = document.getElementById("guessInput");
    
    var guess = guessInput.value;
    
    controller.processGuess(guess);
    
    guessInput.value = "";
}

window.onload = inIt;





