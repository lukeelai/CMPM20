//Initializing Canvas
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var w = 400; //window.innerWidth;
var h = 400; //window.innerHeight;
var cw = 10; //cell width
var d;
var food;
var score;
var snake_array; //an array of cells to make up the snake
var life = 3; //bad food array

function init() {
    d = "right"; //default direction
    create_snake();
    create_food(); //create good
    create_nasty(); //create bad food
    score = 0; //display the score

    //Lets move the snake now using a timer which will trigger the paint function
    //every 60ms
    if (typeof game_loop != "undefined") clearInterval(game_loop);
    game_loop = setInterval(paint, 60);
    
}
init();//intialize

function create_snake() {
    var length = 2; //Length of the snake
    snake_array = [];
    for (var i = length - 1; i >= 0; i--) {
        //Create snake starting on the top left
        snake_array.push({
            x: i,
            y: 0
        });
    }
}

function create_food() {
    food = {
        x: Math.round(Math.random() * (w - cw) / cw),
        y: Math.round(Math.random() * (h - cw) / cw)
    };
    //Create a cell with x/y between 0-39 because there are 40(400/10) positions accross the rows and columns
}

function create_nasty() {
        nasty = ({
            x: Math.round(Math.random() * (w - cw) / cw),
            y: Math.round(Math.random() * (h - cw) / cw)
        });
}

function paint() {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "black";
    ctx.strokeRect(0, 0, w, h);
    
    //Position of the head cell
    var nx = snake_array[0].x;
    var ny = snake_array[0].y;
    
    //Direction based movement
    if (d == "right") nx++; 
    else if (d == "left") nx--; 
    else if (d == "up") ny--; 
    else if (d == "down") ny++; 
    
    //Restart game if collided with self or wall
    if (nx == -1 || nx == w / cw || ny == -1 || ny == h / cw || check_collision(nx, ny, snake_array)) {
        //restart game
        init();
        life--;
        //create_snake();
        return;
    }
    //When snake eats food
    if (nx == food.x && ny == food.y && snake_array.length <= 10 ) {
        var tail = {
            x: nx,
            y: ny
        };
        score++;
        //Create new food
        create_food();
    } else if (nx == food.x && ny == food.y && snake_array.length > 10 && life == 3) {
        var tail = {
            x: nx,
            y: ny
        };
        score+= 2;
        //Create new food
        create_food();
    }else if (nx == food.x && ny == food.y && snake_array.length > 10 && life < 3) {
        var tail = {
            x: nx,
            y: ny
        };
        score++;
        //Create new food
        create_food();
    }else {
        var tail = snake_array.pop(); //pops out the last cell
        tail.x = nx;
        tail.y = ny;
    }
    
    //restart if eats red block
    if(nx == nasty.x && ny == nasty.y){
        life--;
        create_nasty();
    }
    
    //lose lives, game over
    if(life == 0){
        init();
        life = 3;
        return;
    }
    snake_array.unshift(tail); //makes tail as the first cell

    for (var i = 0; i < snake_array.length; i++) {
        var c = snake_array[i];
        //Lets paint 10px wide cells
        paint_cell(c.x, c.y);
    }

    //Paints the food
    paint_cell(food.x, food.y);
    
    //Paints the score
    var score_text = "Score: " + score;
    ctx.fillStyle = "black";
    ctx.fillText(score_text, 5, h - 5);
    
    //Paints the lives
    var life_text = "Lives: " + life;
    ctx.fillText(life_text, 350, w - 385);
    
    //Paints the bad food
    while(score >= 2){
        paint_nasty(nasty.x,nasty.y); //create more somehow    
        return;
    }
    //if eat 2 good food, get rid of one bad food
}

//Paint cells
function paint_cell(x, y) {
    var partay = 'rgb('+
    Math.floor(Math.random()*255)+','+
    Math.floor(Math.random()*255)+','+
    Math.floor(Math.random()*255)+')';//partay
    ctx.fillStyle = "blue";
    ctx.fillRect(x * cw, y * cw, cw, cw);
    if(snake_array.length > 10 && life ==3){
    ctx.strokeStyle = partay;
    }
    ctx.strokeRect(x * cw, y * cw, cw, cw);
}

//Paint bad food
function paint_nasty(x,y){
    ctx.fillStyle = "red";
    ctx.fillRect(x * cw, y * cw, cw, cw);
    ctx.strokeStyle = "white";
    ctx.strokeRect(x * cw, y * cw, cw, cw);
}

function check_collision(x, y, array) {
        //Check if the provided x/y coordinates exist in an array of cells or not
        for (var i = 0; i < array.length; i++) {
            if (array[i].x == x && array[i].y == y) 
                return true;
        }
        return false;
    }

//Get the directions
window.onkeydown = function(e){
    var key = e.which;
    if (key == "37" && d != "right") d = "left";
    else if (key == "38" && d != "down") d = "up";
    else if (key == "39" && d != "left") d = "right";
    else if (key == "40" && d != "up") d = "down";
};
