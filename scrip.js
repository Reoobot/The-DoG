window.addEventListener('load', function(){
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 720;
    let enemies = [];
    let score = 0;

    class InputHandler {
        constructor(){
            this.keys = [];
            window.addEventListener('keydown', e => {
                if ((e.key === 'ArrowDown'
                     || e.key === 'ArrowUp'
                     || e.key === 'ArrowLeft'
                     || e.key === 'ArrowRight')
                    && this.keys.indexOf(e.key) === -1) {
                    this.keys.push(e.key);
                }
            });
            window.addEventListener('keyup', e => {
                if (e.key === 'ArrowDown'
                     || e.key === 'ArrowUp'
                     || e.key === 'ArrowLeft'
                     || e.key === 'ArrowRight'){
                    this.keys.splice(this.keys.indexOf(e.key), 1);
                }
            });
        }
    }

    class Player {
        constructor(gameWidth, gameHeight){
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.width = 200;
            this.height = 200;
            this.x = 0;
            this.y = this.gameHeight - this.height;
            this.image = document.getElementById('playerImage');
            this.frameX = 0;
            this.maxFrame = 5;
            this.frameY = 0;
            this.fps = 20;
            this.frameTimer = 0;
            this.frameInterval = 1000/this.fps;
            this.speed = 0;
            this.vy = 0;
            this.weight = 1;
        }
        draw(context){
            context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height,
                this.width, this.height, this.x, this.y, this.width, this.height);
        }
        update(input, deltaTime){
            // Horizontal movement
            if(this.frameTimer > this.frameInterval){
                if(this.frameX >= this.maxFrame) this.frameX = 0;
                else this.frameX++;
                this.frameTimer = 0;
            } else {
                this.frameTimer += deltaTime;
            }
           
            if(input.keys.indexOf('ArrowRight') > -1){
                this.speed = 5;
            } else if(input.keys.indexOf('ArrowLeft') > -1) {
                this.speed = -5;
            } else {
                this.speed = 0;
            }
            
            // Vertical movement (jumping)
            if(input.keys.indexOf('ArrowUp') > -1 && this.onGround()) {
                this.vy = -20; // Jumping by setting a negative vy value
            }

            this.x += this.speed;
            if(this.x < 0) this.x = 0;
            else if (this.x > this.gameWidth - this.width) 
                this.x = this.gameWidth - this.width;

            // Vertical update
            this.y += this.vy;
            if(!this.onGround()){
                this.vy += 1; // Simulating gravity
                this.maxFrame = 5;
            } else {
                this.vy = 0; // Reset vertical velocity when on the ground
            }
        }
        onGround(){
            return this.y >= this.gameHeight - this.height;
        }
    }

    class Background {
        constructor(gameWidth,gameHeight){
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.image = document.getElementById('backgroundImage');
            this.width = 2400; // Añadido el atributo width
            this.height = 720; // Añadido el atributo height
            this.x = 0;
            this.y = 0;
            this.speed = 7;
        }
        draw(context) {
            context.drawImage(this.image, this.x, this.y,
                this.width, this.height);
            context.drawImage(this.image, this.x + this.width + this.speed, this.y,
                this.width, this.height);
        }
        update(){
            this.x -= this.speed;
            if(this.x < 0 - this.width) this.x =  0; // Corregido aquí
        }
    }
    class Enemy {
        constructor(gameWidth, gameHeight){
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.width = 160;
            this.height = 119;
            this.image = document.getElementById('enemyImage');
            this.x = this.gameWidth;
            this.y = this.gameHeight - this.height;
            this.frameX = 0;
            this.maxFrame = 5;
            this.fps = 20;
            this.frameTimer = 0;
            this.frameInterval = 1000/this.fps;
            this.speed= 8;
            this.markedForDeletion = false;
        }
        draw(context){
            context.drawImage(this.image, this.frameX * this.width, 0, this.width, this.height, this.x, this.y, this.width, this.height);
        }
        update(deltaTime){
            if (this.frameTimer > this.frameInterval)   {
                if (this.frameX >= this.maxFrame) this.frameX = 0;
                else this.frameX++;
                this.frameTimer = 0;
            } else {
                this.frameTimer += deltaTime;
            }
            this.x-= this.speed;
            if(this.x < 0 - this.width) this.markedForDeletion = true;
                score++;
        }
    }
    function handleEnemies(deltaTime){
        if(enemyTimer > enemyInterval + randomEnemyInterval){
            enemies.push(new Enemy(canvas.width,canvas.height));
            randomEnemyInterval = Math.random() + 1000 + 500;
            enemyTimer = 0;
        } else {
            enemyTimer += deltaTime;
        }
        enemies.forEach(enemy => {
            enemy.draw(ctx);
            enemy.update(deltaTime);
        });
        enemies = enemies.filter(enemy => !enemy.markedForDeletion);
    }
    function displayStatusText(context){
        context.font = '40px Helvetica';
        context.fillStyle = 'black'
        context.fillText('Score: ' + score, 20, 50);
        context.fillStyle = 'white'
        context.fillText('Score: ' + score, 20, 52);
    }

    const input = new InputHandler();
    const player = new Player(canvas.width, canvas.height);
    const background = new Background(canvas.width, canvas.height);
    
    let lastTimer = 0;
    let enemyTimer = 0;
    let enemyInterval = 2000;
    let randomEnemyInterval = Math.random() + 1000 + 500;


    function animate(timeStamp) {
        const deltaTime = timeStamp - lastTimer;
        lastTimer = timeStamp;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        background.draw(ctx);
        // background.update();
        player.update(input, deltaTime);
        player.draw(ctx);
        handleEnemies(deltaTime);
        displayStatusText(ctx);
            
            
        requestAnimationFrame(animate);
    }
    animate(0);
});
