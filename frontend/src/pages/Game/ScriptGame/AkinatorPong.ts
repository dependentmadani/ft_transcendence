
export function ping_pong(canvas : any,leftCallback:any , rightCallback:any) {
    if(canvas)
    {
        var ctx:any = canvas.getContext('2d');
        let start:any = document.getElementById('ButtonStart');
        let switchMusic:any = document.getElementById('music_switch');
        let switchSound:any = document.getElementById('sound_switch');
        let ExitGame:any = document.getElementById('ExitGame');
      
         

        let MusicValue:boolean = true;
        let SoundValue:boolean = true;
        let ExitValue:boolean = false;
        
        let play_start = 0;

        start.addEventListener('click',()=> {
            start.style.display = 'none';
            play_start++;
            console.log(`start\\\\\\${play_start}`)
        })

        switchMusic.addEventListener('change', () => {
            MusicValue = switchMusic.checked;
        });
        switchSound.addEventListener('change', () => {
            SoundValue = switchSound.checked;
            console.log(`||||||||| switch |||||||||${SoundValue}`)
        });
        ExitGame.addEventListener('click', () => {
            ExitValue = ExitGame.id;

            console.log(`||||||||| EXIT |||||||||${ExitValue}`)
        });

        let  img = new Image();
        let img_win = new Image();
         let img_lose = new Image();
        let paddle_sound = new Audio();
        let ball_sound = new Audio();
        let music = new Audio();

        img_lose.src = "/src/assets/img/lose.jpg";
        img_win.src = "/src/assets/img/win.jpg";

        ball_sound.src = "/src/assets/sounds/beeep.ogg";
        paddle_sound.src = "/src/assets/sounds/Pop.ogg" 
        music.src = "/src/assets/sounds/Arabesque.mp3";
        
        img.src = "/src/assets/img/castle.png";
        let speed_paddle:number =20;
        window.addEventListener('keydown', handlePlayerKeyPress);
        function handlePlayerKeyPress(event: any) 
        {
            if (event.keyCode === 40) 
            {
                console.log("down")
                if( pl2.paddle_y + speed_paddle + pl2.paddle_h<= canvas.height)
                {
                    
                    pl2.paddle_y+=speed_paddle;
                }
                
            }
            else if (event.keyCode === 38)
            {
                console.log("up")
                if( pl2.paddle_y >= speed_paddle)
                {
                    pl2.paddle_y-=speed_paddle;
                }
            } 
        }
   
        class paddle_left
        {
            height_paddle:number = canvas.height * 20/100;
            width_paddle:number = canvas.width * 1.5/100;
            x:number = 0;
            y:number = (canvas.height/2) ;
            draw(X:number,Y:number)
            {
                this.x = X
                this.y = Y
                ctx.fillStyle = "yellow"
                ctx.beginPath();
                
                // ctx.drawImage(img_paddle_left, this.x, this.y, this.width_paddle, this.height_paddle);
                ctx.fillRect(this.x, this.y, this.width_paddle, this.height_paddle);
                ctx.fill();
                ctx.closePath()
            }
            
            get paddle_x(){
                return this.x;
            }
            get paddle_y(){
                return this.y;
            }
            set paddle_y(nb:number){
                this.y=nb;
            }
            get paddle_h(){
                return this.height_paddle;
            }
            set paddle_h(nb){
                    this.height_paddle = nb;
                } 
                get paddle_w(){
                    return this.width_paddle;
                }
                
            }
            class paddle_right
            {
                height_paddle:number = canvas.height * 20/100;
                width_paddle:number = canvas.width * 1.5/100;
                y:number = canvas.height/2 ;
                x:number = canvas.width ;
                
                draw(X:number, Y:number)
                {
                    this.x = X
                    this.y = Y
                    ctx.fillStyle = 'yellow';
                    ctx.beginPath();
                    ctx.fillRect(this.x, this.y, this.width_paddle, this.height_paddle);
                    ctx.fill();
                    ctx.closePath()
                }
                
                get paddle_x(){
                    return this.x;
            }
            get paddle_y(){
                return this.y;
            }
            set paddle_y(nb:number){
                this.y=nb;
            }
            get paddle_h(){
                return this.height_paddle;
            }
            set paddle_h(nb){
                this.height_paddle = nb;
            }
            get paddle_w(){
                return this.width_paddle;
            }
        }
        
        class ball
        {
            flag:number = 0;
            num:number = 0;
            x:number = canvas.width/2;
            y:number = canvas.height/2;
            direction_x:number = 0;
            direction_y:number = 0;
            first_mouve:number = 0
            speed:number=3;
            ball_size = canvas.width*1.5/100;

            draw(){
                if(!this.first_mouve)
                this.mouveball();
            this.first_mouve++;
            this.check_colision()
            rb.robot_mouve();
            this.x += this.direction_x*this.speed;
            this.y += this.direction_y*this.speed;
            
            this.ball_paddle();
            sc.left_score
            if (this.flag)
            {
                this.mouveball();
                this.reset_ball()
                this.flag = 0;
            }
            
            ctx.beginPath();
            ctx.fillStyle = "yellow"
            ctx.strokeStyle ="black"
            ctx.arc(this.x, this.y,this.ball_size,0,Math.PI*4);
            ctx.arc(this.x, this.y,this.ball_size,0,Math.PI*4);
            ctx.fill();
            ctx.stroke();
            ctx.closePath();
        
        }
        ball_paddle(){
            if (this.x - (this.ball_size + pl1.paddle_w + this.speed)  < 0 && this.y + this.ball_size >= pl1.paddle_y && this.y - this.ball_size <= pl1.paddle_y + pl1.paddle_h)
            {
                if (SoundValue)
                    paddle_sound.play();
                this.x =  pl1.paddle_w + this.ball_size;
                this.direction_x *= -1;
                this.direction_y = (this.y - (pl1.paddle_y + pl1.paddle_h/2)) / pl1.paddle_h/2; 
                // this.flag_paddle = 0;
                this.speed++
                // console.log(`this.x: ${this.x}| this.y: ${this.y}| padle1_y: ${pl1.paddle_y} `)
            }
            else if (this.x + this.ball_size +this.speed > canvas.width -  pl2.paddle_w && this.y + this.ball_size >= pl2.paddle_y && this.y - this.ball_size <= pl2.paddle_y + pl2.paddle_h)
            {
                if (SoundValue)
                paddle_sound.play();
                this.x = (canvas.width - pl2.paddle_w) - this.ball_size;
                this.direction_x *= -1;
                this.direction_y = (this.y - (pl2.paddle_y + pl2.paddle_h/2)) / pl2.paddle_h/2;
                // this.flag_paddle = 0;
                this.speed++
                console.log(`this.x: ${this.x}| this.y: ${this.y}| padle2_y: ${pl2.paddle_y} pladle2_y: ${pl2.paddle_x} `)

            } 
                else if (this.x < this.ball_size || this.x > canvas.width-this.ball_size)
                {
                    if(bl.ball_x < this.ball_size)
                    {
                        sc.right_score++;
                        rightCallback(sc.right_score);
                    }
                    else if (bl.ball_x > canvas.width -this.ball_size )
                    {
                        sc.left_score++;
                        leftCallback(sc.left_score);

                    }
                    this.flag++;
                }
    }
            
            mouveball()
            {
                this.num = Math.floor(Math.random()*4);
                if(this.num == 0)
                {
                    this.direction_x = 1;
                    this.direction_y = 1;
                }
                else if(this.num == 1)
                {
                    this.direction_x = -1;
                    this.direction_y = 1;
                }
                else if (this.num == 2)
                {
                    this.direction_x = 1;
                    this.direction_y = -1;
                }
                else
                {
                    this.direction_x = -1;
                    this.direction_y = -1;
                }

            }
            check_colision()
            {
                // this.flag=0;
                if (this.y - this.ball_size < 0 || this.y >= canvas.height - this.ball_size)
                {
                    if (SoundValue)
                        ball_sound.play();
                    this.direction_y*=-1;
                    // this.speed+=2;
                }
            }
            reset_ball(){
                // this.num = Math.floor(Math.random()*4);
                this.x = canvas.width/2;
                this.y = canvas.height/2;
                pl1.paddle_y = canvas.height/2;
                pl2.paddle_y = canvas.height/2;
                
                // this.draw()
                this.flag = 0;
                this.speed = 3;
                
                rb.flag_delta =0;
            }
            get ball_x()
            {
                return this.x;
            }
                get ball_y()
                {
                    return this.y;
                }
                get random_num()
                {
                    return this.num ;
                }
                set random_num(nb:number)
                {
                    this.num = nb;
                }
                get ball_speed()
                {
                    return this.speed;
                }
                get direct_x()
                {
                    return  this.direction_x;
                }
                get direct_y()
                {
                return  this.direction_y;
            }
        }
        
        var bl = new ball;
  
        class score
        {
            score_left:number = 0;
            score_right:number = 0;
           
            
            get left_score()
            {
                return this.score_left;
            }
            get right_score()
            {
                return this.score_right;
            }
            set left_score(nb:number){
                this.score_left = nb;
            }
            set right_score(nb:number){
                this.score_right = nb;
            }
        }
        class robot
        {
            delta_x:number=0;
            delta_y:number=0;
            b:number = 0;
            hold_x:number=0;
            hold_y:number=0;
            flag:number=0;
            flag_delta:number=0;
            
            robot_mouve()
            {   
                if(bl.ball_x <= canvas.width/2)
                {
                    if(pl1.paddle_y + pl1.paddle_h <= bl.ball_y + bl.ball_size)
                        pl1.paddle_y+=6;
                    if(pl1.paddle_y  +6 >= bl.ball_y )
                        pl1.paddle_y-=6;
                }
               
            }
            get robot_flag()
            {
                return this.flag;
            }
            set robot_flag(nb:number)
            {
                this.flag = nb;
            }
        }
        let rb = new robot;
        class game {
            start() {
                
                pl1.draw(0, pl1.paddle_y);
                pl2.draw(canvas.width - pl2.width_paddle, pl2.paddle_y);
            }
        }
        img.onload = function () {
            canvas.width = img.width;  
            canvas.height = img.height;
            
            animate();
        }
  
        let pl1 = new paddle_left;
        let pl2 = new paddle_right;
        let p = new game
        let sc = new score;
        
        function render() 
        {
            
            if(ExitValue)
            {
                MusicValue = false;
               SoundValue = false;
               sc.left_score = 5;
            }
            if(MusicValue)
                music.play();
            else
                music.pause();
            ctx.clearRect(0, 0, canvas.width,canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            if(sc.left_score < 5 && sc.right_score < 5)
            {
                p.start()
                bl.draw();
            }
            else if(sc.left_score == 5)
                ctx.drawImage(img_lose, 0, 0, canvas.width, canvas.height);
            else if(sc.right_score == 5)
                ctx.drawImage(img_win, 0, 0, canvas.width, canvas.height);

        }
        
        let msPrev = performance.now()
        const fps = 60
        const msPerFrame = 1000 / fps
        let frames = 0
        function animate() {
            requestAnimationFrame(animate)
            const msNow = performance.now()
            const msPassed = msNow - (msPrev)
            
            if (msPassed < msPerFrame) return
            
            const excessTime = msPassed % msPerFrame
            msPrev = msNow - excessTime
            if(play_start)
                render()
            
            frames++
        }
    }

}