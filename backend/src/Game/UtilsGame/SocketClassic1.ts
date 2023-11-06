
// import direct_ball from "./ClassicPong/ClassicBall";
// import paddle_left from "./ClassicPong/ClassicPaddle1";
// import paddle_right from "./ClassicPong/ClassicPaddle2";

// // const io = require('socket.io')(4000, {
// //     cors: {
// //         origin: ["http://10.14.10.5:5173"],
// //     },
// // })

// let  players = new Map()

// let  canvas_width;
// let  canvas_height;
// let  pl1 = new Array;
// let   pl2 = new Array;
// let    db = new Array;

// let client_num =0;
// let room = 0;
// let prev_room=0;
// let ROOM_NUM =0;
// let flag_room = 0;
// let start_game =0;

// io.on("connection", connect_client);

// function connect_client(socket)
// {
//     let interval = new Array();
    
//     socket.on ("canvas",async (cnv_x, cnv_y)=>
//     {
//         canvas_width =   await cnv_x;
//         canvas_height =  await cnv_y;
//     });
    
//     socket.on("youcan start", async (pp) =>
//     {
//         client_num++;
//         players.set(pp, client_num);
//         socket.join(room);
//         //console.log(`${client_num}-----------${pp}`);
//         room = await Math.round(client_num/2);
//         socket.emit('playerId', players.get(socket.id), room);
//         //console.log(socket.id);
//         if (prev_room != await room)
//         {
//             pl1[room] = await new paddle_left ;
//             pl2[room] = await new paddle_right;
            
//             db[room] = await new direct_ball;
//             prev_room = await room;
//         }

//         // //console.log(`canvas_width ${canvas_width} canvas_height ${canvas_height}`);
//         pl1[room].canvas_height = await canvas_height;
//         pl2[room].canvas_height = await canvas_height; 
//         pl1[room].paddle_y =  await canvas_height/2;
//         pl2[room].paddle_y = await canvas_height/2;
//         pl1[room].height_paddle = await canvas_height*20/100;
//         pl2[room].height_paddle = await canvas_height*20/100;
            
//         db[room].cnv_w = await canvas_width;
//         db[room].cnv_h = await canvas_height;
//         db[room].ball_x = await canvas_width/2;
//         db[room].ball_y = await canvas_height/2;
        
//         //console.log(`player number ${players.get(socket.id)}`);
//         socket.on("move_paddle_right", (move, num_player,data) =>
//         {
//             room = data;
//             // //console.log(`player number22222 ${room}`);
//             if(num_player % 2 != 0)
//             {
//                 if(move == "up")
//                     pl1[room].move_up()
//                 else if(move == "down")
//                     pl1[room].move_down()
//             }
//             else
//             {
//                 if(move == "up")
//                     pl2[room].move_up()
//                 else if(move == "down")
//                     pl2[room].move_down()
//             }
//         })
//         socket.on("new value room", (data)=>
//         {
//             room = data;
//         })

//         start_game++;
//         flag_room++;
//         if(ROOM_NUM < room && flag_room % 2 == 0)
//             ROOM_NUM = room;
//         if(start_game == 2 )
//         {
//             for(let room_num = 1; room_num <= await ROOM_NUM;room_num++)   
//             {
//                 interval[room_num] = await setInterval(()=>game(room_num),1000/60);    
//             }
//             start_game = 0;
//         }}
//     );

    
//     function game(room_num:number)
//     {
//         db[room_num].p_left = pl1[room_num].paddle_y;
//         db[room_num].p_right = pl2[room_num].paddle_y;
//         const gameState =
//         {
//             room : {id:room_num},
//             ball: { x: db[room_num].ball_x, y: db[room_num].ball_y },
//             paddles: { left: pl1[room_num].paddle_y, right: pl2[room_num].paddle_y },
//             scores: { player1: db[room_num].score_left, player2: db[room_num].score_right },
//             sound :{sound_paddle: db[room_num].sound_padd, sound_wall: db[room_num].sound_wall},
//         };
            
//         db[room_num].mouve_ball(); 
//         if (db[room_num].reset_game_flag)
//         {
//             db[room_num].initial_direction();
//             db[room_num].speed = 1;
//             pl1[room_num].paddle_y =  canvas_height/2;
//             pl2[room_num].paddle_y =  canvas_height/2;
//             db[room_num].ball_x =  canvas_width/2;
//             db[room_num].ball_y =  canvas_height/2;
//             db[room_num].reset_game_flag = 0;
//         }

//         gameState.room.id = room_num;
//         gameState.ball.x = db[room_num].ball_x;
//         gameState.ball.y = db[room_num].ball_y;
//         gameState.paddles.left = pl1[room_num].paddle_y;
//         gameState.paddles.right = pl2[room_num].paddle_y;
//         gameState.scores.player1 = db[room_num].score_l;
//         gameState.scores.player2 = db[room_num].score_r;
//         // gameState.sound.sound_paddle = 0;
//         // gameState.sound.sounf_wall = 0;
    
//         if(db[room_num].sound_pad)
//         {
//             gameState.sound.sound_paddle = 1;
//             db[room_num].sound_pad = 0;
//         }
//         if(db[room_num].sound_wall)
//         {
//             gameState.sound.sound_wall = 1;
//             db[room_num].sound_wall = 0;
//         }
//         if (db[room_num].score_left >= db[room_num].score_max || db[room_num].score_right >= db[room_num].max_score)
//         {
//             clearInterval(interval[room_num]);
//         }
//         io.emit("game_state", gameState);
//     }
    

//     socket.on('disconnect', () =>
//     {
//         //console.log('A player disconnected');
//         // if (players.get(socket.id) % 2 != 0 )
//         //     socket.emit("player1 disconect", "LOSE");
//         // else
//         //     socket.emit("player2 disconect", "WIN");

//         // if (db[room].ball_x !== null && db[room].ball_y !== null)
//         // {
//         //     //console.log("STILL IN THE GAME")
//         // }
//         // else
//         // {
//         //     //console.log(" BenguerirSTILL NOOOOOOOOOT in  THE GAME")
//         //     db[room].reset_game();
//         //   }
//         players.delete(socket.id);
//     });
// }

    

// export default io;
