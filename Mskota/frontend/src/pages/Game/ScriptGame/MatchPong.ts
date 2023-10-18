
import {io} from 'socket.io-client'

export function ping_pong(canvas :any, leftCallback:any , rightCallback:any)
{
    if(canvas)
    {
        let ctx:any = canvas.getContext('2d');
        let start:any = document.getElementById('ButtonStart');
        let switchMusic:any = document.getElementById('music_switch');
        let switchSound:any = document.getElementById('sound_switch');
        // let genrate_room = 0;
        
        let paddle_sound = new Audio();
        let ball_sound = new Audio();
  
        let music = new Audio();
        let MusicValue:boolean = true;
        let SoundValue:boolean = true;
        let play_start:number = 0;
        
        let img = new Image();
        let img_win = new Image();
        let img_lose = new Image();
        
        img_lose.src = "/src/assets/img/lose.jpg";
        img_win.src = "/src/assets/img/win.jpg";
        
        ball_sound.src = "/src/assets/sounds/beeep.ogg";
        paddle_sound.src = "/src/assets/sounds/Pop.ogg" ;
        music.src = "/src/assets/sounds/hxh.mp3";
        img.src = "/src/assets/img/tenis.jpg"
        
        const socket = io('http://10.14.10.1:5000');
        
        start.addEventListener('click',()=> 
        {
            start.style.display = 'none';
            play_start++;
            
            socket.emit("youcan start",socket.id);
            console.log(`start\\\\\\${play_start}`)
        })
        
        switchMusic.addEventListener('change', () =>
        {
            MusicValue = switchMusic.checked;
        });
        
        switchSound.addEventListener('change', () => 
        {
            SoundValue = switchSound.checked;
            console.log(`||||||||| switch |||||||||${SoundValue}`)
        });
        
        socket.on('connect',()=>
        {
            console.log(`canvas_width ${canvas.width} canvas_height ${canvas.height}` );
            document.addEventListener("mousemove", handleMouseMove);
            socket.emit("canvas",canvas.width, canvas.height);
            
            console.log(socket.id)
        })
        let player:number;
        let clientRoom:number = 0;
        let max_room:number = 0;
        let prev_right_y:number = 0;

        socket.on("playerId",(play,data) =>
        {
            player = play;
            clientRoom = data;
        
            // if(vaccant == 1)
                // roomcallback(newROOM);
            // console.log(`99999999999999999${RoomRef}`)
            if(max_room < clientRoom)
                max_room = clientRoom;
            socket.emit("new value room", clientRoom);
        })
     
        function handleMouseMove(event: MouseEvent)
        {
            console.log(`this id of the player:${player}`);
            
            if (event.clientY > prev_right_y)
            {
                console.log("down_RIGHT");
                socket.emit("move_paddle_right", "down",player, clientRoom);
            }
            else if (event.clientY < prev_right_y)
            {
                console.log("up_Right");
                socket.emit("move_paddle_right", "up",player, clientRoom);
            }
            prev_right_y = event.clientY;
        }
        
        class paddle_left
        {
            height_paddle:number = canvas.height*20/100;
            width_paddle:number = canvas.width*1.5/100;
            x:number = 0;
            y:number = canvas.height/2 ;
            draw()
            {
                ctx.beginPath();
                ctx.fillStyle = 'white'
                ctx.fillRect(this.x, this.y, this.width_paddle, this.height_paddle);
                ctx.fill();
                ctx.closePath()
            }
            get paddle_x()
            {
                return this.x;
            }
            get paddle_y()
            {
                return this.y;
            }
            set paddle_x(nb)
            {
                this.x=nb;
            }
            set paddle_y(nb)
            {
                this.y=nb;
            }
        }

        class paddle_right
        {
            height_paddle:number = canvas.height*20/100;
            width_paddle:number = canvas.width*1.5/100;
            y:number = canvas.height/2 ;
            x:number = canvas.width - this.width_paddle;
            draw()
            {
                ctx.beginPath();
                ctx.fillStyle = 'white'
                ctx.fillRect(this.x, this.y, this.width_paddle, this.height_paddle);
                ctx.fill();
                ctx.closePath()
            }
            get paddle_x()
            {
                return this.x;
            }
            get paddle_y()
            {
                return this.y;
            }
            set paddle_x(nb)
            {
                this.x=nb;
            }
            set paddle_y(nb)
            {
                this.y=nb;
            }
        }
/*############################# BALL ##############################*/

        // socket.on("ball_position",(pos_x,pos_y)=>{
        //     bl.ball_x = pos_x;
        //     bl.ball_y = pos_y;
        //     // console.log(`ball_pos_x: ${bl.ball_x} ball_pos_y: ${bl.ball_y}`);
        // })


        // let speed =1;
        
        class ball
        {
            flag:number = 0;
            num:number = Math.floor(Math.random()*4);
            x:number = canvas.width/2;
            y:number = canvas.height/2;
            direction_x:number = 0;
            direction_y:number = 0;
            flag_paddle:number = 0
            ball_size = canvas.width*1.5/100;
            sound_wall:number=0;
            sound_paddles:number=0;
            draw()
            {
                ctx.fillStyle = 'yellow';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.ball_size, 0 , 2 * Math.PI);
                ctx.fill();
                ctx.closePath()
                this.flag++;   
            }
      
            get ball_x()
            {
                return this.x;
            }
            get ball_y()
            {
                return this.y;
            }
            set ball_x(nb:number){
                this.x = nb;
            }
            set ball_y(nb:number)
            {
                this.y = nb;;
            }
            get random_num()
            {
                return this.num;
            }
            set random_num(nb:number)
            {
                this.num = nb;
            }
            get sound_walls()
            {
                return this.sound_wall;
            }
            set sound_walls(nb:number)
            {
                this.sound_wall = nb;
            }
            get  sound_paddle()
            {
                return this.sound_paddles;
            }
            set sound_paddle(nb:number)
            {
                this.sound_paddles = nb;
            }
        }

/*############################# BALL ##############################*/
        var pl1 = new paddle_left;
        var pl2 = new paddle_right;
        var bl = new ball;

        class score
        {
            score_left:number = 0;
            score_right:number = 0;
            update_score()
            {
                socket.on("score",(l,r)=>{
                    this.score_left = l;
                    this.score_right = r;
                })
    
                // const textWidth = ctx.measureText(this.score_left).width;
                // this.write_txt(this.score_left, (canvas.width - textWidth)*0.4, (canvas.height - canvas.height*85/100))

             
                // const ttWidth = ctx.measureText(this.score_right).width;
                // this.write_txt(this.score_right,(canvas.width - ttWidth)*0.57, (canvas.height - canvas.height*85/100))

                if(this.score_left == 5 || this.score_right == 5)
                {
                    if (player % 2 != 0)
                    {
                         if(this.score_left == 5)
                         {
                            console.log("hello mother fucker ------111")
                            ctx.drawImage(img_win, 0, 0, canvas.width, canvas.height);
                            // const ttWidth = ctx.measureText("YOU WIN").width;
                            // this.write_txt("YOU WIN",(canvas.width/4 - ttWidth/2), canvas.height/5)
                        }
                        else
                        {
                            console.log("hello mother fucker ------2222")
                            ctx.drawImage(img_lose, 0, 0, canvas.width, canvas.height);
                            // const ttWidth = ctx.measureText("YOU LOSE").width;
                            // this.write_txt("YOU LOSE",(canvas.width/4 - ttWidth/2), canvas.height/5)
                        }
                    }
                    if (player % 2 == 0)
                    {
                        if (this.score_right == 5)
                        {
                            console.log("hello mother fucker -----3333")
                            ctx.drawImage(img_win, 0, 0, canvas.width, canvas.height);
                            // const ttWidth = ctx.measureText("YOU WIN").width ;
                            // this.write_txt("YOU WIN",(3*canvas.width/4 - ttWidth/2), canvas.height/5)
                        }
                        else
                        {
                            console.log("hello mother fucker -----4444")
                            ctx.drawImage(img_lose, 0, 0, canvas.width, canvas.height);
                            // const ttWidth = ctx.measureText("YOU LOSE").width ;
                            // this.write_txt("YOU LOSE",(3*canvas.width/4 - ttWidth/2), canvas.height/5)
                        }
    
                    }
               }
                // if(flag_pl1)
                // {
                //     console.log(`pl1----msg----------${msg_pl1}-`);
                //     if (msg_pl1 === "WIN")
                //         ctx.drawImage(img_win, 0, 0, canvas.width, canvas.height);
                //     else
                //         ctx.drawImage(img_lose, 0, 0, canvas.width, canvas.height);
                // }
              
                // if (flag_pl2)
                // {
                //     console.log(`pl2--------msg------${msg_pl2}-`);
                //     if (msg_pl2 === "WIN")
                //         ctx.drawImage(img_win, 0, 0, canvas.width, canvas.height);
                //     else
                //         ctx.drawImage(img_lose, 0, 0, canvas.width, canvas.height);
                // }
            }
            write_txt(msg:any,xx:number,yy:number)
            {
                ctx.beginPath();
                ctx.font = "100px solid";
                ctx.lineWidth = 2
                ctx.fillStyle = 'white';
                ctx.fillText(msg, xx, yy);
                ctx.closePath()
            }

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
            
        var sc = new score;
        class game
        {
            start()
            {
                pl1.draw();
                pl2.draw();
            }
        }
        var p = new game
        let stop = 0;
        socket.on("player1 disconect",(msg)=>
        {
            stop++;
            console.log(`msg----------------------|`);
            if (msg === "WIN")
                ctx.drawImage(img_win, 0, 0, canvas.width, canvas.height);
            else
                ctx.drawImage(img_lose, 0, 0, canvas.width, canvas.height);
        })
      
        socket.on("player2 disconect",(msg)=>
        {
            stop++;
            console.log(`msg----------------------|`);
            if (msg === "WIN")
                ctx.drawImage(img_win, 0, 0, canvas.width, canvas.height);
            else
                ctx.drawImage(img_lose, 0, 0, canvas.width, canvas.height)
        })

        socket.on("game_state",(gameState)=>
        {
            const room = gameState.room.id;
            if (room === clientRoom)
            {
                pl1.paddle_y = gameState.paddles.left
                pl2.paddle_y = gameState.paddles.right
                sc.score_left = gameState.scores.player1
                leftCallback(sc.score_left);
                sc.score_right = gameState.scores.player2
                rightCallback(sc.score_right);
                bl.ball_x = gameState.ball.x
                bl.ball_y = gameState.ball.y
                bl.sound_paddle = gameState.sound.sound_paddle;
                bl.sound_walls = gameState.sound.sound_wall;
                // console.log(`${SoundValue}|---1111----|${ bl.sound_paddle}|`);
                // console.log(`${SoundValue}|--2222-----|${ bl.sound_paddle}|`);
                if(SoundValue && bl.sound_walls)
                {
                    ball_sound.play();
                }
                if(SoundValue && bl.sound_paddle)
                {
                    paddle_sound.play();
                }
            }
        })

        function render()
        {

            if(MusicValue)
                music.play();
            else
                music.pause();
            ctx.clearRect(0,0,canvas.width,canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            p.start()
            bl.draw();
            sc.update_score()
        }
        
        let msPrev = performance.now()
        const fps = 60
        const msPerFrame = 1000 / fps
        let frames = 0
        animate()
        function animate() 
        {
            requestAnimationFrame(animate)
            const msNow = performance.now()
            const msPassed = msNow - (msPrev)
            
            if (msPassed < msPerFrame)
                return;
            
            const excessTime = msPassed % msPerFrame
            msPrev = msNow - excessTime
            if (play_start && !stop)
                render()
            
            frames++
        }

        //   setInterval(() => {
        //     console.log(frames)
        //     frames=0
        //   }, 1000)
        // console.log("hello world!")
    }
}