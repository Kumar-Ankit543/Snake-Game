function init(){
    canvas = document.getElementById('mycanvas');
    W = H = canvas.width = canvas.height = 670;
    pen = canvas.getContext('2d');
    cs = 30;
    gameover = false;
    didCollide = false;
    foodMusic = new Audio('Assets/Music/food.mp3');
    moveMusic = new Audio('Assets/Music/move.mp3');
    gameOverMusic = new Audio('Assets/Music/gameover.mp3');
    //score values
    let hiscore = localStorage.getItem("highscore");
    if(hiscore === null){
        hiscoreval = 0;
        localStorage.setItem("highscore", JSON.stringify(hiscoreval))
    }
    else{
        hiscoreval = JSON.parse(hiscore);
        highScore.innerHTML = "High Score: " + hiscore;
    }

    score = 0;
    //creating food image
    food_image = new Image();
    food_image.src = 'Assets/apple.jpg'

    food = getRandomFood();
   

    snake = {
        init_len: 5,
        color: 'blue',
        cells: [],
        direction: 'right',

        createSnake: function(){
            for(var i = this.init_len; i>0; i--)
                this.cells.push({x:i,y:5});
        },
        drawSnake: function(){
            for(var i = 0; i<this.cells.length; i++){
                pen.fillStyle = this.color;
                pen.fillRect(this.cells[i].x*cs,this.cells[i].y*cs,cs-2,cs-2);
            }
        },
        updateSnake:function(){
            //if snake has eaten the food then increase the length
            var headX = this.cells[0].x;
            var headY = this.cells[0].y;
            if(headX==food.x && headY==food.y){  //head and food cordiantes collide
                food = getRandomFood();
                foodMusic.play();
                score = score+5;
                if(score>hiscoreval){
                    hiscoreval = score;
                    localStorage.setItem("highscore", JSON.stringify(hiscoreval));
                    highScore.innerHTML = "High Score: " + hiscoreval;
                }
                scoreBox.innerHTML = "Score: " + score;
            } 
            else{
                this.cells.pop();
            }
            
            
            var nextX,nextY;
            if(this.direction == 'right'){
                nextX = headX + 1;
                nextY = headY;
            }
            else if(this.direction == 'left'){
                nextX = headX -1;
                nextY = headY;
            }
            else if(this.direction == 'down'){
                nextX = headX;
                nextY = headY + 1;
            }
            else{
                nextX = headX;
                nextY = headY - 1;
            }
            this.cells.unshift({x:nextX,y:nextY});

            //logic that if snake goes out then gameover
            var lastX = Math.round(W/cs);
            var lastY = Math.round(H/cs);
            if(this.cells[0].y<0 || this.cells[0].x<0 || this.cells[0].y>lastY || this.cells[0].x>lastX){
                gameover = true;
            }
            //if snake collides
            for(let i=4; i<this.cells.length; i++){
                if(this.cells[i].x==this.cells[0].x && this.cells[i].y==this.cells[0].y )
                    didCollide = true;
            }
        },
       
    };
    snake.createSnake();
    //add a event listener on Document object
    function keyPressed(e){
        if(e.key=='ArrowRight'){
            snake.direction = 'right';
            moveMusic.play();
        }
        else if(e.key=='ArrowLeft'){
            snake.direction = 'left';
            moveMusic.play();
        }
        else if(e.key=='ArrowDown'){
            snake.direction = 'down';
            moveMusic.play();
        }
        else{
            snake.direction = 'up';
            moveMusic.play();
        }
    }
    document.addEventListener('keydown',keyPressed);
}

function draw(){
    //erase the old frame
    pen.clearRect(0,0,W,H);
    snake.drawSnake();
    pen.fillStyle = food.color;
    pen.drawImage(food_image,food.x*cs,food.y*cs,cs,cs);
    pen.fillStyle = 'blue';
    pen.font = '30px Roboto';
    pen.fillText(score,10,20);
}

function update(){
    snake.updateSnake();
}

function getRandomFood(){
    var foodX = Math.round(Math.random()*(W-cs)/cs);
    var foodY = Math.round(Math.random()*(H-cs)/cs);

    var food = {
        x: foodX,
        y: foodY,
        color: 'red',
    }
    return food;
}

function gameloop(){
    if(gameover==true || didCollide==true){
        gameOverMusic.play();
        clearInterval(f);
        alert("Game Over ", score);
        return;
    }
    draw();
    update();

}

init();
var f = setInterval(gameloop,100);
