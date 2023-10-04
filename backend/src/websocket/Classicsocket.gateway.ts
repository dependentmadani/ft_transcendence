import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

import direct_ball from "../SocketGame/ClassicPong/ClassicBall";
import paddle_left from "../SocketGame/ClassicPong/ClassicPaddle1";
import paddle_right from "../SocketGame/ClassicPong/ClassicPaddle2";
import { ConsoleLogger } from '@nestjs/common';


console.log(`HELLO FROM SCRIPT 77777777`);
@WebSocketGateway(4000, {     cors: {
  origin: ["http://10.14.10.1:5173"],
},})


export class ClassicSocketGateway
{
  @WebSocketServer() server: Server;

  private players = new Map();
  private canvas_width;
  private canvas_height;
  private pl1 = [];
  private pl2 = [];
  private ball = [];
  
  private client_num = 0;
  private ROOM_NUM = 0;
  private flag_room = 0;
  private prev_room = 0;
  private room;
  private rooms = {}; 
  private arr = new Array();
  private jojo = 0;
  private map1 = new Map();

  private interval = new Array();
  private pass = false;
  private count = 0;
  private random = Math.random().toString(36).substring(2, 7);


  @SubscribeMessage('canvas')
  async handleCanvas(client, data)
  {
     const cnv_x = data[0];
     const cnv_y = data[1];
    this.canvas_width =   await cnv_x;
    this.canvas_height =  await cnv_y;
   
  }

  @SubscribeMessage('youcan start')
  async handleyoucanstart(client, sock_id)
  {
   
   if(this.count <= 2)
   {
       if (this.rooms[this.random])
       { 
        this.room = this.rooms[this.random];
        this.pass = true;
        this.random = Math.random().toString(36).substring(2, 7);
        this.count++;  
       }
       else
       {
        this.ROOM_NUM++;
        this.room = this.ROOM_NUM;
        this.rooms[this.random] = this.room;
        this.pass = false;
        this.count++;
       }
    
       
       this.client_num++;
       this.players.set(client.id, this.client_num);

    client.join(this.room);
    if(this.map1.has(this.room) === false)
    {
      this.map1.set(this.room, this.client_num);
      this.jojo = 1;
        client.emit('playerId', this.players.get(client.id), this.room,this.jojo);
    }
    else
    {
        this.jojo = 2;
          console.log(`JOJO VALUE 22222 ${this.jojo}`)
          client.emit('playerId', this.players.get(client.id), this.room, this.jojo);
      }
    
    
      // socket.emit('playerId', players.get(socket.id), room,jojo);1
      console.log(`Player ${this.client_num} joined room ${this.room}`);
      console.log(`GRADEPLAYER---${this.jojo} joined room ${this.room}`);
    if (this.prev_room != this.room)
    {
          this.pl1[this.room] = await new paddle_left;
          this.pl2[this.room] = await new paddle_right;
          this.ball[this.room] = await new direct_ball;
          this.prev_room = this.room;
      }
    
      this.pl1[this.room].canvas_height = this.canvas_height;
      this.pl2[this.room].canvas_height = this.canvas_height;
      this.pl1[this.room].paddle_y = this.canvas_height / 2;
      this.pl2[this.room].paddle_y = this.canvas_height / 2;
      this.pl1[this.room].height_paddle = this.canvas_height * 20 / 100;
      this.pl2[this.room].height_paddle = this.canvas_height * 20 / 100;
      this.ball[this.room].cnv_w = this.canvas_width;
      this.ball[this.room].cnv_h = this.canvas_height;
      this.ball[this.room].ball_x = this.canvas_width / 2;
      this.ball[this.room].ball_y = this.canvas_height / 2;
    
    }
  }
  
  @SubscribeMessage('move_paddle')
   async handleMovePaddleRight(client, Data)
    {
        let move = Data[0];
        let grade = Data[1];
        let  data_room = Data[2];
        this.room = await data_room;

        // console.log(`${grade}|-----------|${move}`)
        
        if (grade %2 != 0) 
        {
            if (move == "up")
            this. pl1[this.room].move_up();
            else if (move == "down")
            this.pl1[this.room].move_down();
        }
        else if(grade % 2 == 0)
        {
            if (move ==  "up")
            this. pl2[this.room].move_up();
            else if (move ==  "down")
            this.pl2[this.room].move_down();
        }
    }


    @SubscribeMessage('new value room')
    async handlenewvalueroom(client, data)
      {
        this.room = data;
        this.flag_room++;
        this.startGameIfNeeded(this.room);
      }
 
      startGameIfNeeded(room_num)
      {
        if (this.pass && this.count == 2 )
        {
          this.count = 0;
          
          this.interval[room_num] = setInterval(() => this.game(room_num), 1000 / 60);
        }
      }
      
      
      async game(room_num)
      {
        this.ball[room_num].p_left = this.pl1[room_num].paddle_y;
        this.ball[room_num].p_right = this.pl2[room_num].paddle_y;
        const gameState = {
          // console.log(`|----------|${room_num}|`);
          room: { id: room_num },
          ball: { x: this.ball[room_num].ball_x, y: this.ball[room_num].ball_y },
        paddles: { left: this.pl1[room_num].paddle_y, right: this.pl2[room_num].paddle_y },
        scores: { player1: this.ball[room_num].score_left, player2: this.ball[room_num].score_right },
        sound: { sound_paddle: this.ball[room_num].sound_padd, sound_wall: this.ball[room_num].sound_wall },
    };

    this.ball[room_num].mouve_ball();
    if (this.ball[room_num].reset_game_flag) {
        this.ball[room_num].initial_direction();
        this.ball[room_num].speed = 1;
        this.pl1[room_num].paddle_y = this.canvas_height / 2;
        this.pl2[room_num].paddle_y = this.canvas_height / 2;
        this.ball[room_num].ball_x = this.canvas_width / 2;
        this.ball[room_num].ball_y = this.canvas_height / 2;
        this.ball[room_num].reset_game_flag = 0;
    }

    gameState.room.id = room_num;
    gameState.ball.x = this.ball[room_num].ball_x;
    gameState.ball.y = this.ball[room_num].ball_y;
    gameState.paddles.left = this.pl1[room_num].paddle_y;
    gameState.paddles.right = this.pl2[room_num].paddle_y;
    gameState.scores.player1 = this.ball[room_num].score_l;
    gameState.scores.player2 = this.ball[room_num].score_r;

    if (this.ball[room_num].sound_pad) {
        gameState.sound.sound_paddle = 1;
        this.ball[room_num].sound_pad = 0;
    }
    if (this.ball[room_num].sound_wall) {
        gameState.sound.sound_wall = 1;
        this.ball[room_num].sound_wall = 0;
    }
    if (this.ball[room_num].score_left >= this.ball[room_num].score_max || this.ball[room_num].score_right >= this.ball[room_num].max_score) {
        clearInterval(this.interval[room_num]);
    }
   this.server.emit("game_state", gameState);
  }


  handleDisconnect(client)
  {
  }
}
