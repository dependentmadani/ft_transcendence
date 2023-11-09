import axios from 'axios';
import {io} from 'socket.io-client'

export function ping_pong(canvas : any, leftCallback:any , rightCallback:any, client_id:number, profileID1:any, profileID2:any)
{
    if(canvas)
    {
        let ctx:any = canvas.getContext('2d');
        let start:any = document.getElementById('ButtonStart');
        let switchSound:any = document.getElementById('sound_switch');
        let ExitGame:any = document.getElementById('ExitGame');
        
        let paddle_sound = new Audio();
        let ball_sound = new Audio();
        let SoundValue:boolean = true;
        let play_start = 0;
        let img_lose = new Image();
        let UserName:string;

        let ExitValue:boolean = false;
        img_lose.src = "/src/assets/img/lose.jpg";
        
        ball_sound.src = "/src/assets/sounds/beeep.ogg";
        paddle_sound.src = "/src/assets/sounds/Pop.ogg";
        
        
        const socket = io(`http://${import.meta.env.VITE_BACK_ADDRESS}/ClassicRandom`);
        
        socket.emit("canvas",canvas.width, canvas.height);

        axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/users/me`, { withCredentials: true })
        .then((res)=>{
            UserName = res.data?.username;
            // console.log(`1~~~~~~~~~~~|${res.data?.username}`)
        }).catch(()=>{  
            // console.log('Error fetching user data for ProfileID1', error);
        })
            
        start.addEventListener('click',() => 
        {
            start.style.display = 'none';
            play_start++;

            socket.emit("youcan start", client_id, UserName);
            // console.log(`start\\\\\\${client_id}`)
        })
        switchSound.addEventListener('change', () => 
        {
            SoundValue = switchSound.checked;
       
        });
        ExitGame.addEventListener('click', () => {
            ExitValue = ExitGame.id;
            socket.emit("playerDisconnect",client_id);
            // console.log(`||||||||| EXIT |||||||||${ExitValue}`)
        });
        socket.on('connect',()=>
        {
            // console.log(`canvas_width ${canvas.width} canvas_height ${canvas.height}`);
            window.addEventListener('keydown', handlePlayerKeyPress);
            // console.log(client_id)
        })
        let player:number;
        let clientRoom:number =0;
        let max_room = 0;
        socket.on("playerId",(play, data) =>
        {
            player = play;
            clientRoom = data;
            if(max_room < clientRoom)
            max_room = clientRoom;
        socket.emit("new value room", clientRoom);
    })
        function drawline()
        {
            const l = canvas.width / 2;
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.moveTo(l, 0);
            ctx.lineTo(l, canvas.height);
            ctx.stroke();
        }
        function handlePlayerKeyPress(event: any)
        {
            // console.log(`this id of the player:${player}`)  
            if (event.keyCode === 40) 
            { 
                // console.log("down_RIGHT")
                socket.emit("move_paddle","down", player, clientRoom);
            }
            else if (event.keyCode === 38) 
            {
                // console.log("up_Right")
                socket.emit("move_paddle","up",player, clientRoom);
            }
        }
        socket.on("ProfilesID", (prfl1, prfl2)=>
        {
            profileID1(prfl1);
            profileID2(prfl2);
            // console.log(`${prfl1}|------PROFILE-------|${prfl2}`)
        })

        class paddle_left
        {
            height_paddle:number = canvas.height*20/100;
            width_paddle:number = canvas.width*1.5/100;
            x:number = 0;
            y:number = canvas.height/2 ;
            draw()
            {
                ctx.beginPath();
                ctx.fillStyle = 'rgb(208, 205, 205)'
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
                ctx.fillStyle = 'rgb(208, 205, 205)'
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
        
    
        class ball
        {
            x:number = canvas.width/2;
            y:number = canvas.height/2;
            direction_x:number = 0;
            direction_y:number = 0;
            flag_paddle:number = 0
            ball_size = canvas.width*2/100;
            sound_wall:number=0;
            sound_paddles:number=0;

            draw()
            {
                ctx.beginPath();
                ctx.fillStyle = 'rgb(208, 205, 205)'
                ctx.fillRect(this.x, this.y, this.ball_size, this.ball_size);
                ctx.fill();
                ctx.closePath()
            }
            
            get ball_x(){
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
    const font = `clamp(10px, 10vw, 100px)`
    class score
    {
        score_left:number = 0;
        score_right:number = 0;
        update_score()
        {
            socket.on("score",(l, r)=>
            {
                this.score_left = l;
                this.score_right = r;
            })
            
            const textWidth = ctx.measureText(this.score_left).width;
            this.write_txt(this.score_left, (canvas.width - textWidth)*0.4, (canvas.height - canvas.height*85/100))
            
            const ttWidth = ctx.measureText(this.score_right).width;
            this.write_txt(this.score_right,(canvas.width - ttWidth)*0.6, (canvas.height - canvas.height*85/100))
            if(this.score_left == 5 || this.score_right == 5)
            {
                if (player % 2 != 0)
                {
                     if(this.score_left == 5)
                     {
                     
                        const ttWidth = ctx.measureText("YOU WIN").width;
                        this.write_txt("YOU WIN",(canvas.width/4 - ttWidth/2), canvas.height/3)
                        stopAnimation()
                    }
                    else
                    {
                        
                        const ttWidth = ctx.measureText("YOU LOSE").width;
                        this.write_txt("YOU LOSE",(canvas.width/4 - ttWidth/2), canvas.height/3)
                        stopAnimation()
                    }
                }
                if (player % 2 == 0)
                {
                    if (this.score_right == 5)
                    {
                      
                        const ttWidth = ctx.measureText("YOU WIN").width ;
                        this.write_txt("YOU WIN",(3*canvas.width/4 - ttWidth/2), canvas.height/3)
                        stopAnimation()
                    }
                    else
                    {
                       
                        const ttWidth = ctx.measureText("YOU LOSE").width ;
                        this.write_txt("YOU LOSE",(3*canvas.width/4 - ttWidth/2), canvas.height/3)
                        stopAnimation()
                    }

                }
           }
            
        }
        write_txt(msg:any,xx:number,yy:number)
        {
            ctx.beginPath();
            ctx.font = `${font} solid `;
            ctx.lineWidth = 5
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

    socket.on("game_state",(gameState)=>
    {
        // console.log(`msg----------------------|${gameState.paddles.left}`);
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
    var p = new game()

    if(ExitValue)
    {
        SoundValue = false;
        // socket.emit("playerDisconnect",client_id);
        
    }

    socket.on('disconnect', () => {
        // console.log("Disconnected from the server");
    
        stopAnimation();
      
    });
    function render()
    {
        ctx.clearRect(0,0,canvas.width,canvas.height);
        drawline()
        
        p.start()
        bl.draw();
        sc.update_score()
    }

    let msPrev = performance.now()
    const fps = 60
    const msPerFrame = 1000 / fps
    let frames = 0
    let animationId = 0;
    animate()
    function stopAnimation() {
        cancelAnimationFrame(animationId);
    }
    function animate()
    {
        animationId =  requestAnimationFrame(animate)
        const msNow = performance.now()
        const msPassed = msNow - (msPrev)
        
        if (msPassed < msPerFrame)
            return;
        const excessTime = msPassed % msPerFrame
        msPrev = msNow - excessTime
        if(play_start)
            render();
        
        frames++
    }
}
}
