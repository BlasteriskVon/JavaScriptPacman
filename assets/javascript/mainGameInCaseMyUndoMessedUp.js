var game = false;
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
    $("#maze").empty();
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
                } else {
                    if(!(noPelletZones.includes(j + "-" + i))){
                        $("#" + j + "-" + i).css({"background-image":"url('assets/images/pellet.png')", "background-size":"79px 64px"});
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
                $("#" + getLocation(pacman)).css("background-image", "none");
                pacman.moveUp();
                place(pacman, true);
                break;
            case "down":
                $("#" + getLocation(pacman)).css("background-image", "none");
                pacman.moveDown();
                place(pacman, true);
                break;
            case "left":
                $("#" + getLocation(pacman)).css("background-image", "none");
                pacman.moveLeft();
                place(pacman, true);
                break;
            case "right":
                $("#" + getLocation(pacman)).css("background-image", "none");
                pacman.moveRight();
                place(pacman, true);
                break;
            default:
                break;
        }
    }, 400);
    var blinky = new MovableObject("Blinky", 5, 2);
    blinky.targetZone = {
        x_Coordinate: 0,
        y_Coordinate: 0
    }
    blinky.up = {
        x_Coordinate: 0,
        y_Coordinate: 0,
        distance: undefined
    }
    blinky.down = {
        x_Coordinate: 0,
        y_Coordinate: 0,
        distance: undefined
    }
    blinky.left = {
        x_Coordinate: 0,
        y_Coordinate: 0,
        distance: undefined
    }
    blinky.right = {
        x_Coordinate: 0,
        y_Coordinate: 0,
        distance: undefined
    }

    place(blinky, true);
    blinky.moveInterval = setInterval(function() {
        blinky.targetZone.x_Coordinate = pacman.x_Coordinate;
        blinky.targetZone.y_Coordinate = pacman.y_Coordinate;
        
        console.log(getLocation(blinky.targetZone));
        blinky.up.x_Coordinate = blinky.x_Coordinate;
        blinky.up.y_Coordinate = blinky.y_Coordinate - 1;

        blinky.down.x_Coordinate = blinky.x_Coordinate;
        blinky.down.y_Coordinate = blinky.y_Coordinate + 1;

        blinky.left.x_Coordinate = blinky.x_Coordinate - 1;
        blinky.left.y_Coordinate = blinky.y_Coordinate;

        blinky.right.x_Coordinate = blinky.x_Coordinate + 1;
        blinky.right.y_Coordinate = blinky.y_Coordinate;

        var movements = [blinky.up, blinky.down, blinky.right, blinky.left];
        switch(blinky.direction){
            case "up":
                movements.splice(movements.indexOf(blinky.down), 1);
                break;
            case "down":
                movements.splice(movements.indexOf(blinky.up), 1);
                break;
            case "left":
                movements.splice(movements.indexOf(blinky.right), 1);
                break;
            case "right":
                movements.splice(movements.indexOf(blinky.left), 1);
                break;
            default:
                break;
        } //removes opposite movements so no turning around
        console.log(movements.length);
        for(var i = 0;i < movements.length;i++){
            if($("#" + getLocation(movements[i])).attr("status") != "free"){
                movements.splice(i, 1);
                i--;
            }
        } //removes movements to spots that aren't open
        console.log(movements.length);
        
        for(var i = 0;i < movements.length;i++){
            var distanceSquared = Math.pow((blinky.targetZone.x_Coordinate - movements[i].x_Coordinate), 2) + Math.pow((blinky.targetZone.y_Coordinate - movements[i].y_Coordinate), 2);
            movements[i].distance = Math.sqrt(distanceSquared);
            console.log(movements[i].distance);
        } //gets the distance between the directions and the target
        for(var i = 0;i < movements.length;i++){
            for(var j = 1;j < movements.length;j++){
                if(movements[j-1] < movements[j]){
                    var temp = movements[j-1];
                    movements[j-1] = movements[j];
                    movements[j] = temp;
                }
            }
        }//should bubble sort the movements array from smallest to largest
        switch(movements[0]){
            case blinky.up:
                blinky.moveUp();
                place(blinky, true);
                console.log(blinky.direction);
                break;
            case blinky.down:
                blinky.moveDown();
                place(blinky, true);
                console.log(blinky.direction);
                break;
            case blinky.left:
                blinky.moveLeft();
                place(blinky, true);
                console.log(blinky.direction);
                break;
            case blinky.right:
                blinky.moveRight();
                place(blinky, true);
                console.log(blinky.direction);
                break;
            default:
                break;
        }

    }, 400);
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
}




startLevel();