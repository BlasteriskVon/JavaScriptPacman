var game = false;
var numberOfPellets = 0;
var intervalArray = [];
var chaseReturn;
function MovableObject(name, x_Coordinate, y_Coordinate) {
    this.name = name.toLowerCase();
    this.direction;
    if(this.name === "pacman"){
        this.direction = "left";
    }
    this.x_Coordinate = x_Coordinate;
    this.y_Coordinate = y_Coordinate;
    this.picture = $("<img>", {id: name.toLowerCase()});
    this.picture.attr("src", "assets/images/" + name.toLowerCase() + ".png"); //change to gif when updated pics to gifs
    if(this.name === "pacman"){
        this.picture.css("transform", "rotate(180deg");
    }
    this.picture.css({"height":"100%", "width":"100%"});
    this.moveInterval = undefined;
    this.moveUp = function() {
        if($("#" + this.x_Coordinate + "-" + (this.y_Coordinate - 1)).attr("status") != "free"){
            return;
        } else {
        this.y_Coordinate--;
        if(this.name === "pacman") {
            this.picture.css("transform", "rotate(270deg)");
        } else {
            this.direction = "up";
        }
    }
    }
    this.moveDown = function() {
        if($("#" + this.x_Coordinate + "-" + (this.y_Coordinate + 1)).attr("status") != "free"){
            return;
        } else {
        this.y_Coordinate++;
        if(this.name === "pacman"){
            this.picture.css("transform", "rotate(90deg)");
        } else {
            this.direction = "down";
        }
    }
    }
    this.moveLeft = function() {
        if(($("#" + (this.x_Coordinate - 1) + "-" + this.y_Coordinate).attr("status") != "free") && (getLocation(this) != "0-6")){
            return;
        } else {
        if(getLocation(this) === "0-6"){
            this.x_Coordinate = 11;
        } else {
            this.x_Coordinate--;
        }
        if(this.name === "pacman"){
            this.picture.css("transform", "rotate(180deg)");
        } else {
            this.direction = "left";
        }
    }
    }
    this.moveRight = function() {
        if(($("#" + (this.x_Coordinate + 1) + "-" + this.y_Coordinate).attr("status") != "free") && (getLocation(this) != "11-6")){
            return;
        } else {
        if(getLocation(this) === "11-6"){
            this.x_Coordinate = 0;
        } else {
            this.x_Coordinate++;
        }
        if(this.name === "pacman"){
            this.picture.css("transform", "rotate(0deg)");
        } else {
            this.direction = "right";
        }
    }
    }
    intervalArray.push(this);
}

function place(obj, removeObj) {
    if(removeObj){
        removeObject(obj);
    }
    $("#" + getLocation(obj)).append(obj.picture);
}

function removeObject(obj){
    $("#" + obj.picture.attr("id")).remove();
}


function getLocation(obj){
    var location = String(obj.x_Coordinate) + "-" + String(obj.y_Coordinate);
    return location;
}

function startLevel() {
    for(var i = 0;i < intervalArray.length;i++){
        clearInterval(intervalArray[i].moveInterval);
    }
    clearTimeout(chaseReturn);
    numberOfPellets = 0;
    $("#maze").empty();
    $("#status").text("Alright you're starting off! Careful not to get hit!");
    for(var i = 0;i < 12;i++){
        var newRow = $("<div>");
        newRow.addClass("row");
        for(var j = 0;j < 12;j++){
            var newBlock = $("<div>", {id: j + "-" + i});
            newBlock.addClass("col-md-1");
            newBlock.attr("status", "free");
            newBlock.css({"width":"100%", "height":"4em"});
            newBlock.css("background-color", "black");
            newRow.append(newBlock);
        }
        $("#maze").append(newRow);
    }
    var zonesToBlock = ["5-0", "1-1", "3-1", "5-1", "7-1", "9-1", "10-1", "1-3", "3-3", "8-3", "9-3", "10-3", "3-4", "0-5", "1-5", "8-5", "10-5", "11-5", "3-6", "4-6", "5-6" ,"6-6",
    "0-7", "1-7", "5-7", "9-7", "10-7", "11-7", "3-8", "7-8", "1-9", "5-9", "9-9", "10-9", "1-10", "2-10", "4-10", "5-10", "6-10", "8-10", "9-10", "10-10"];
    var noPelletZones = ["5-8", "0-6", "1-6", "10-6", "11-6"];
    var powerPelletZones = ["0-1", "11-1", "0-8", "11-8"];
    var ghostHouseZones = ["5-3", "6-3", "5-4", "6-4"];
    for(var i = 0;i < 12;i++){
        for(var j = 0;j < 12;j++){
            if(zonesToBlock.includes(j + "-" + i)){
                $("#" + j + "-" + i).css("background-color", "blue");
                $("#" + j + "-" + i).attr("status", "blocked");
            } else if(ghostHouseZones.includes(j + "-" + i)){
                $("#" + j + "-" + i).css("background-color", "aquamarine");
                $("#" + j + "-" + i).attr("status", "blocked");
            } else {
                if(powerPelletZones.includes(j + "-" + i)){
                    $("#" + j + "-" + i).css({"background-image":"url('assets/images/powerPellet1.png')", "background-size":"79px 64px"});
                    numberOfPellets++;
                } else {
                    if(!(noPelletZones.includes(j + "-" + i))){
                        $("#" + j + "-" + i).css({"background-image":"url('assets/images/pellet.png')", "background-size":"79px 64px"});
                        numberOfPellets++;
                    }
                }
            }
        }
    }
    var pacman = new MovableObject("Pacman", 5, 8);
    place(pacman, true);
    pacman.moveInterval = setInterval(function() {
        switch(pacman.direction) {
            case "up":
                pacman.moveUp();
                place(pacman, true);
                if($("#" + getLocation(pacman)).css("background-image") != "none"){
                    console.log($("#" + getLocation(pacman)).css("background-image"));
                    if($("#" + getLocation(pacman)).css("background-image").indexOf("powerPellet1.png") != -1){
                        if(blinky.mode != "eaten"){
                            blinkyFrightened();
                        }
                    }
                    $("#" + getLocation(pacman)).css("background-image", "none");
                    numberOfPellets--;
                    gotAllPellets();
                }
                ateGhost();
                ghostCatch();
                break;
            case "down":
                pacman.moveDown();
                place(pacman, true);
                if($("#" + getLocation(pacman)).css("background-image") != "none"){
                    console.log($("#" + getLocation(pacman)).css("background-image"));
                    if($("#" + getLocation(pacman)).css("background-image").indexOf("powerPellet1.png") != -1){
                        if(blinky.mode != "eaten"){
                            blinkyFrightened();
                        }
                    }
                    $("#" + getLocation(pacman)).css("background-image", "none");
                    numberOfPellets--;
                    gotAllPellets();
                }
                ateGhost();
                ghostCatch();
                break;
            case "left":
                pacman.moveLeft();
                place(pacman, true);
                if($("#" + getLocation(pacman)).css("background-image") != "none"){
                    console.log($("#" + getLocation(pacman)).css("background-image"));
                    if($("#" + getLocation(pacman)).css("background-image").indexOf("powerPellet1.png") != -1){
                        if(blinky.mode != "eaten"){
                            blinkyFrightened();
                        }
                    }
                    $("#" + getLocation(pacman)).css("background-image", "none");
                    numberOfPellets--;
                    gotAllPellets();
                }
                ateGhost();
                ghostCatch();
                break;
            case "right":
                pacman.moveRight();
                place(pacman, true);
                if($("#" + getLocation(pacman)).css("background-image") != "none"){
                    console.log($("#" + getLocation(pacman)).css("background-image"));
                    if($("#" + getLocation(pacman)).css("background-image").indexOf("powerPellet1.png") != -1){
                        if(blinky.mode != "eaten"){
                            blinkyFrightened();
                        }
                    }
                    $("#" + getLocation(pacman)).css("background-image", "none");
                    numberOfPellets--;
                    gotAllPellets();
                }
                ateGhost();
                ghostCatch();
                break;
            default:
                break;
        }
    }, 300);
    var blinky = new MovableObject("Blinky", 5, 2);
    place(blinky, true);
    blinky.mode = "";
    blinkyChase();
    
    game = true;
    $(document).keyup(function(event) {
        if(game) {
            switch(event.which){
                case 37: //left
                    if($("#" + (pacman.x_Coordinate - 1) + "-" + pacman.y_Coordinate).attr("status") === "free"){
                        pacman.direction = "left";
                    }
                    break;
                case 38: //up
                    if($("#" + pacman.x_Coordinate + "-" + (pacman.y_Coordinate - 1)).attr("status") === "free"){
                        pacman.direction = "up";
                    }
                    break;
                case 39: //right
                    if($("#" + (pacman.x_Coordinate + 1) + "-" + pacman.y_Coordinate).attr("status") === "free"){
                        pacman.direction = "right";
                    }
                    break;
                case 40: //down
                    if($("#" + pacman.x_Coordinate + "-" + (pacman.y_Coordinate + 1)).attr("status") === "free"){
                        pacman.direction = "down";
                    }
                    break;
                default:
                    break;
            }
        }
    });
    function ghostCatch() {
        if((getLocation(pacman) === getLocation(blinky)) && blinky.mode === "chase"){
            lose();
        } else {
            return;
        }
    }
    function lose(){
        $("#status").text("YOU HAVE BEEN CAPTURED. RED GHOST AI IS THE SUPERIOR INTELLIGENCE (click \"Start Game\" to try again)");
        clearInterval(blinky.moveInterval);
        removeObject(blinky);
        clearInterval(pacman.moveInterval);
        pacman.picture.css("filter", "grayscale(100%)");
        game = false;
    }
    function gotAllPellets() {
        if(numberOfPellets === 0){
            win();
        }
    }
    function win() {
        $("#status").text("Great job! You collected all the pellets all without losing a single life! Unless you did lose a life and clicked Start Game to restart... Hmm... I gotta add a life counter");
        clearInterval(blinky.moveInterval);
        removeObject(blinky);
        clearInterval(pacman.moveInterval);
        game = false;
    }
    function blinkyChase() {
        clearInterval(blinky.moveInterval);
        blinky.mode = "chase";
        blinky.picture.css("filter", "none");
        switch(blinky.direction){
            case "up":
                blinky.moveDown();
                place(blinky, true);
                break;
            case "down":
                blinky.moveUp();
                place(blinky, true);
                break;
            case "left":
                blinky.moveRight();
                place(blinky, true);
                break;
            case "right":
                blinky.moveLeft();
                place(blinky, true);
                break;
            default:
                break;
        }
        blinky.moveInterval = setInterval(function() {
            var targetZone = {
                x_Coordinate: pacman.x_Coordinate,
                y_Coordinate: pacman.y_Coordinate
            }
            var up = {
                name: "up",
                x_Coordinate: blinky.x_Coordinate,
                y_Coordinate: blinky.y_Coordinate - 1,
                distance: undefined
            }
            var down = {
                name: "down",
                x_Coordinate: blinky.x_Coordinate,
                y_Coordinate: blinky.y_Coordinate + 1,
                distance: undefined
            }
            var left = {
                name: "left",
                x_Coordinate: blinky.x_Coordinate - 1,
                y_Coordinate: blinky.y_Coordinate,
                distance: undefined
            }
            var right = {
                name: "right",
                x_Coordinate: blinky.x_Coordinate + 1,
                y_Coordinate: blinky.y_Coordinate,
                distance: undefined
            }
            var movements = [up, down, right, left];
            switch(blinky.direction){
                case "up":
                    movements.splice(movements.indexOf(down), 1);
                    break;
                case "down":
                    movements.splice(movements.indexOf(up), 1);
                    break;
                case "left":
                    movements.splice(movements.indexOf(right), 1);
                    break;
                case "right":
                    movements.splice(movements.indexOf(left), 1);
                    break;
                default:
                    break;
            } //removes opposite movements so no turning around
            for(var i = 0;i < movements.length;i++){
                if($("#" + getLocation(movements[i])).attr("status") != "free"){
                    if(!((getLocation(blinky)==="0-6" && movements[i].name === "left") || (getLocation(blinky)==="11-6" && movements[i].name === "right"))){
                        movements.splice(i, 1);
                        i--;
                    }
                    
                }
            } //removes movements to spots that aren't open
            
            for(var i = 0;i < movements.length;i++){
                var distanceSquared = Math.pow((targetZone.x_Coordinate - movements[i].x_Coordinate), 2) + Math.pow((targetZone.y_Coordinate - movements[i].y_Coordinate), 2);
                movements[i].distance = Math.sqrt(distanceSquared);
            } //gets the distance between the directions and the target
            for(var i = 0;i < movements.length;i++){
                for(var j = 1;j < movements.length;j++){
                    if(movements[j-1].distance > movements[j].distance){
                        var temp = movements[j-1];
                        movements[j-1] = movements[j];
                        movements[j] = temp;
                    }
                }
            }//should bubble sort the movements array from smallest to largest
            switch(movements[0]){
                case up:
                    blinky.moveUp();
                    place(blinky, true);
                    ghostCatch();
                    break;
                case down:
                    blinky.moveDown();
                    place(blinky, true);
                    ghostCatch();
                    break;
                case left:
                    blinky.moveLeft();
                    place(blinky, true);
                    ghostCatch();
                    break;
                case right:
                    blinky.moveRight();
                    place(blinky, true);
                    ghostCatch();
                    break;
                default:
                    break;
            }
    
        }, 400);
    }
    function blinkyFrightened() {
        clearInterval(blinky.moveInterval);
        clearTimeout(chaseReturn);
        blinky.mode = "frightened";
        blinky.picture.css("filter", "hue-rotate(90deg)");
        $("#status").text("Oh snap son you got a Power Pellet! Now you can eat this guy!");
        switch(blinky.direction){
            case "up":
                blinky.moveDown();
                place(blinky, true);
                break;
            case "down":
                blinky.moveUp();
                place(blinky, true);
                break;
            case "left":
                blinky.moveRight();
                place(blinky, true);
                break;
            case "right":
                blinky.moveLeft();
                place(blinky, true);
                break;
            default:
                break;
        }
        blinky.moveInterval = setInterval(function() {
            var targetZone = {
                x_Coordinate: 10,
                y_Coordinate: 1
            }
            var up = {
                name: "up",
                x_Coordinate: blinky.x_Coordinate,
                y_Coordinate: blinky.y_Coordinate - 1,
                distance: undefined
            }
            var down = {
                name: "down",
                x_Coordinate: blinky.x_Coordinate,
                y_Coordinate: blinky.y_Coordinate + 1,
                distance: undefined
            }
            var left = {
                name: "left",
                x_Coordinate: blinky.x_Coordinate - 1,
                y_Coordinate: blinky.y_Coordinate,
                distance: undefined
            }
            var right = {
                name: "right",
                x_Coordinate: blinky.x_Coordinate + 1,
                y_Coordinate: blinky.y_Coordinate,
                distance: undefined
            }
            var movements = [up, down, right, left];
            switch(blinky.direction){
                case "up":
                    movements.splice(movements.indexOf(down), 1);
                    break;
                case "down":
                    movements.splice(movements.indexOf(up), 1);
                    break;
                case "left":
                    movements.splice(movements.indexOf(right), 1);
                    break;
                case "right":
                    movements.splice(movements.indexOf(left), 1);
                    break;
                default:
                    break;
            } //removes opposite movements so no turning around
            for(var i = 0;i < movements.length;i++){
                if($("#" + getLocation(movements[i])).attr("status") != "free"){
                    if(!((getLocation(blinky)==="0-6" && movements[i].name === "left") || (getLocation(blinky)==="11-6" && movements[i].name === "right"))){
                        movements.splice(i, 1);
                        i--;
                    }
                    
                }
            } //removes movements to spots that aren't open
            
            for(var i = 0;i < movements.length;i++){
                var distanceSquared = Math.pow((targetZone.x_Coordinate - movements[i].x_Coordinate), 2) + Math.pow((targetZone.y_Coordinate - movements[i].y_Coordinate), 2);
                movements[i].distance = Math.sqrt(distanceSquared);
            } //gets the distance between the directions and the target
            for(var i = 0;i < movements.length;i++){
                for(var j = 1;j < movements.length;j++){
                    if(movements[j-1].distance > movements[j].distance){
                        var temp = movements[j-1];
                        movements[j-1] = movements[j];
                        movements[j] = temp;
                    }
                }
            }//should bubble sort the movements array from smallest to largest
            switch(movements[0]){
                case up:
                    blinky.moveUp();
                    place(blinky, true);
                    ateGhost();
                    break;
                case down:
                    blinky.moveDown();
                    place(blinky, true);
                    ateGhost();
                    break;
                case left:
                    blinky.moveLeft();
                    place(blinky, true);
                    ateGhost();
                    break;
                case right:
                    blinky.moveRight();
                    place(blinky, true);
                    ateGhost();
                    break;
                default:
                    break;
            }
    
        }, 450);
        chaseReturn = setTimeout(function() {
            if((blinky.mode === "frightened") && (game === true)){
                $("#status").text("Oh, the Power Pellet's worn off. Now he's pissed.");
                blinkyChase();
            }
        }, 6000);

    }
    function blinkyEaten() {
        clearInterval(blinky.moveInterval);
        blinky.mode = "eaten";
        blinky.picture.css("filter", "grayscale(100%)");
        $("#status").text("Good job! You ate him! Now he'll be back with a vengence! Vengeance? Dang it I forgot how to spell the word.... Screw it, now he wants revenge!");
        switch(pacman.direction){
            case "up":
                blinky.moveUp();
                place(blinky, true);
                break;
            case "down":
                blinky.moveDown();
                place(blinky, true);
                break;
            case "left":
                blinky.moveLeft();
                place(blinky, true);
                break;
            case "right":
                blinky.moveRight();
                place(blinky, true);
                break;
            default:
                break;
        }
        blinky.moveInterval = setInterval(function() {
            var targetZone = {
                x_Coordinate: 5,
                y_Coordinate: 2
            }
            var up = {
                name: "up",
                x_Coordinate: blinky.x_Coordinate,
                y_Coordinate: blinky.y_Coordinate - 1,
                distance: undefined
            }
            var down = {
                name: "down",
                x_Coordinate: blinky.x_Coordinate,
                y_Coordinate: blinky.y_Coordinate + 1,
                distance: undefined
            }
            var left = {
                name: "left",
                x_Coordinate: blinky.x_Coordinate - 1,
                y_Coordinate: blinky.y_Coordinate,
                distance: undefined
            }
            var right = {
                name: "right",
                x_Coordinate: blinky.x_Coordinate + 1,
                y_Coordinate: blinky.y_Coordinate,
                distance: undefined
            }
            var movements = [up, down, right, left];
            switch(blinky.direction){
                case "up":
                    movements.splice(movements.indexOf(down), 1);
                    break;
                case "down":
                    movements.splice(movements.indexOf(up), 1);
                    break;
                case "left":
                    movements.splice(movements.indexOf(right), 1);
                    break;
                case "right":
                    movements.splice(movements.indexOf(left), 1);
                    break;
                default:
                    break;
            } //removes opposite movements so no turning around
            for(var i = 0;i < movements.length;i++){
                if($("#" + getLocation(movements[i])).attr("status") != "free"){
                    if(!((getLocation(blinky)==="0-6" && movements[i].name === "left") || (getLocation(blinky)==="11-6" && movements[i].name === "right"))){
                        movements.splice(i, 1);
                        i--;
                    }
                    
                }
            } //removes movements to spots that aren't open
            
            for(var i = 0;i < movements.length;i++){
                var distanceSquared = Math.pow((targetZone.x_Coordinate - movements[i].x_Coordinate), 2) + Math.pow((targetZone.y_Coordinate - movements[i].y_Coordinate), 2);
                movements[i].distance = Math.sqrt(distanceSquared);
            } //gets the distance between the directions and the target
            for(var i = 0;i < movements.length;i++){
                for(var j = 1;j < movements.length;j++){
                    if(movements[j-1].distance > movements[j].distance){
                        var temp = movements[j-1];
                        movements[j-1] = movements[j];
                        movements[j] = temp;
                    }
                }
            }//should bubble sort the movements array from smallest to largest
            switch(movements[0]){
                case up:
                    blinky.moveUp();
                    place(blinky, true);
                    if(getLocation(blinky) === "5-2"){
                        blinkyChase();
                    }
                    break;
                case down:
                    blinky.moveDown();
                    place(blinky, true);
                    if(getLocation(blinky) === "5-2"){
                        blinkyChase();
                    }
                    break;
                case left:
                    blinky.moveLeft();
                    place(blinky, true);
                    if(getLocation(blinky) === "5-2"){
                        blinkyChase();
                    }
                    break;
                case right:
                    blinky.moveRight();
                    place(blinky, true);
                    if(getLocation(blinky) === "5-2"){
                        blinkyChase();
                    }
                    break;
                default:
                    break;
            }
    
        }, 350);
    }
    function ateGhost() {
        if((getLocation(pacman) === getLocation(blinky)) && (blinky.mode === "frightened") ){
            blinkyEaten();
        }
    }
}


var titlePic = $("<img>");
titlePic.attr("src", "assets/images/crappyTitle.png");
titlePic.css({"width":"100%", "height":"47em"});
$("#maze").append(titlePic);
$("#status").text("Use the arrow keys to move! Click the \"Start Game\" button to begin!");
$("#startBtn").on("click", startLevel);