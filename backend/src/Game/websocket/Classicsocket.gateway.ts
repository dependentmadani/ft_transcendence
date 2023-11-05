
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server,Namespace } from 'socket.io';

import direct_ball from "../UtilsGame/ClassicPong/ClassicBall";
import paddle_left from "../UtilsGame/ClassicPong/ClassicPaddle1";
import paddle_right from "../UtilsGame/ClassicPong/ClassicPaddle2";
import { GameService } from "../game.service"
import { HistoryService } from '../history/history.service';
import { historyDto } from "../history/dto/create-history.dto"

console.log(`HELLO FROM SCRIPT CLASSIC___________RANDOM`);
@WebSocketGateway({
  namespace: '/ClassicRandom',
  cors: {
        origin: ["http://localhost:5173"]
        }
})


export class ClassicSocketGateway
{
  constructor(private gameService: GameService, private historyService: HistoryService,private histor1:historyDto,private histor2:historyDto) {}

  @WebSocketServer() server: Server;

  // private players = new Map();
  private canvas_width;
  private canvas_height;
  private pl1 = [];
  private pl2 = [];
  private ball = [];
  private ROOM_NUM = 0;
  private prev_room = 0;
  private room;
  private rooms = new Map<string, Set<number>>();
  private interval = new Array();
  private pass = true;
  private count = 0;
  private client_id = 0;
  private profileID1:number = 0;
  private profileID2:number = 0
  private players = new Map< number ,number>()
  private PosPlayers = new Map< number ,number>();
  private name:string;
  private client_name =  new Map<number,string>;


  @SubscribeMessage('canvas')
  async handleCanvas(client, data)
  {
     const cnv_x = await data[0];
     const cnv_y = await data[1];
    this.canvas_width =   await cnv_x;
    this.canvas_height =  await cnv_y;
    
  }
  @SubscribeMessage('youcan start')
  async handleyoucanstart(client, user)
  {
      this.client_id = await user[0];
      this.name = await user[1];
      this.client_name.set(this.client_id,this.name);
      
      console.log(`|${this.client_name}|------------|${this.client_id}|`)

      // console.log(`>>>>>>>>>>>>>>>>>${this.PosPlayers.has(this.client_id)}`);
      if(!this.PosPlayers.has(this.client_id))
      {


  if(this.count <= 2)
   {
    
      if (this.rooms.has(this.room) && !this.pass) 
      {
        this.pass = true;
        this.profileID2 = this.client_id;
        this.count++;
        this.rooms.get(this.room).add(this.client_id);
        this.players.set(client.id, this.client_id);
        this.PosPlayers.set(this.client_id, 2);
        client.emit('playerId', 2 , this.room);

      // console.log(`ALREADY EXIST------111----||||${ this.room}`);
    }
    else
    {
      this.ROOM_NUM++;
      this.room = this.ROOM_NUM;
      this.pass = false;
      this.count++;
      this.rooms.set(this.room, new Set([this.client_id]));
      this.players.set(client.id, this.client_id);
      this.PosPlayers.set(this.client_id, 1);
      this.profileID1 = this.client_id;
      client.emit('playerId', 1 , this.room);

      }
      client.join(this.room);
      if (this.profileID1 && this.profileID2)
      {
        this.server.to(this.room).emit('ProfilesID', this.profileID1, this.profileID2);
  
        this.profileID1 = 0;
        this.profileID2 = 0;
      }
    }
      
      console.log(`Player ${this.client_id} joined room ${this.room}`);
 
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
@SubscribeMessage('new value room')
async handlenewvalueroom(client, data)
  {
    this.room = await data;
    if(this.canvas_height && this.canvas_width)
      this.startGameIfNeeded(this.room,client.id);
  }
  @SubscribeMessage('move_paddle')
   async handleMovePaddleRight(client, Data)
    {
        let move = Data[0];
        let grade = Data[1];
        let  data_room = Data[2];
        this.room = await data_room;

        // console.log(`${grade}|-----------|${move}`)
        
        if (grade % 2 != 0) 
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

 
      async startGameIfNeeded(room_num, client)
      {
        if (this.pass && this.count == 2 )
        {
          this.count = 0;
          this.interval[room_num] = await setInterval(() => this.game(room_num, client), 1000 / 60);
        }
      }


      async game(room_num, client)
      {
        this.ball[room_num].p_left = this.pl1[room_num].paddle_y;
        this.ball[room_num].p_right = this.pl2[room_num].paddle_y;
        const gameState = {
          // console.log(`|----------|${room_num}|`);
          room: { id: room_num },
          profileID1:{},
          profileID2:{},
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
    if (this.ball[room_num].score_left >= this.ball[room_num].score_max || this.ball[room_num].score_right >= this.ball[room_num].max_score)
    {

      const roomSet = this.rooms.get(room_num);
     
        if (roomSet)
        {
            let roomArray = Array.from(roomSet);
            let firstValue  = roomArray[0];
            let secondValue = roomArray[1]; 
      
      if(this.ball[room_num].score_left > this.ball[room_num].score_right)
      {
        this.gameService.updateInfoGame(firstValue, true);
        this.gameService.updateInfoGame(secondValue , false);
      }
      else
      {
        this.gameService.updateInfoGame(firstValue, false);
        this.gameService.updateInfoGame(secondValue, true);
      }
      this.histor1.my_score = this.ball[room_num].score_left 
      this.histor1.opp_score  = this.ball[room_num].score_right;
      this.histor1.opp_name = this.client_name.get(secondValue);
      this.historyService.createResultGame(firstValue,this.histor1);
      console.log(` ${firstValue}---------1111---|${this.histor1.my_score }|----111--------|${this.histor1.opp_score}|----1111-------| ${this.histor1.opp_name}`)
    
      this.histor2.my_score = this.ball[room_num].score_right;
      this.histor2.opp_score  = this.ball[room_num].score_left ;
      this.histor2.opp_name = this.client_name.get(firstValue);
      this.historyService.createResultGame(secondValue,this.histor2);
      console.log(`${secondValue}|-----------222---|${this.histor2.my_score }|------222------|${this.histor2.opp_score}|-----2222------| ${this.histor2.opp_name}`)
      
    }
        clearInterval(this.interval[room_num]);

        const clientId = this.players.get(client); 
     
        let sett = this.rooms.get(room_num);

        for (let item of sett)
        {
          for (let [key, value] of this.players)
          {
            if (value === item)
            {
              this.players.delete(key);
              this.PosPlayers.delete(value);
            }
          }
        }
        // console.log(`${sett.values()}`);
        this.rooms.delete(room_num);
    }
    
   this.server.to(room_num).emit("game_state", gameState);
  }
  @SubscribeMessage('playerDisconnect')
  handlePlayerDisconnect(client,data)
  {
    const clientId = data;
    const room = this.getRoomByClientId(clientId);

    console.log(`---1111---disconnect ${clientId}`)

    if (room)
    {
      if (this.PosPlayers.get(clientId) == 1)
        this.ball[room].score_r = this.ball[room].score_max;
      else 
        this.ball[room].score_l = this.ball[room].score_max;
    }

  }
  
@SubscribeMessage('disconnect')
  handleDisconnect(client)
  {
    const clientId = this.players.get(client.id);
    const room = this.getRoomByClientId(clientId);

    console.log(`---3333---disconnect ${clientId}`)

    if (room)
    {
      if (this.PosPlayers.get(clientId) == 1)
        this.ball[room].score_r = this.ball[room].score_max;
      else 
        this.ball[room].score_l = this.ball[room].score_max;
    }

  }
 
 
   getRoomByClientId(clientId: number)
  {
   for (const [room, playerIds] of this.rooms)
   {
     if (playerIds.has(clientId))
     {
       return room;
     }
   }
 }

}
