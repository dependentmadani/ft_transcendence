import direct_ball from "./ClassicPong/ClassicBall";
import paddle_left from "./ClassicPong/ClassicPaddle1";
import paddle_right from "./ClassicPong/ClassicPaddle2";


// const io = require('socket.io')(7000, {
//     cors: {
//         origin: ["http://10.14.10.5:5173/"],
//     },
// });

// let players = new Map();
// let canvas_width;
// let canvas_height;
// let pl1 = [];
// let pl2 = [];
// let db = [];

// let client_num = 0;
// let ROOM_NUM = 0;
// let flag_room = 0;
// let prev_room = 0;
// // let room = 0;
// let rooms = {}; 
// let arr = new Array();
// let jojo = 0;
// let map1 = new Map();

// console.log(`HELLO FROM SCRIPT 77777777`);
// io.on("connection", connect_client);

// function connect_client(socket) {
//     let interval = new Array();
//     let room;
//     let pass = false;
//     let count = 0;
//     socket.on("canvas", async (cnv_x, cnv_y, token) => {
//         canvas_width = await cnv_x;
//         canvas_height = await cnv_y;
//         arr.push(token);
        
//         for (let i =0;i < arr.length;i++)
//         {
//             console.log(`|----------|${arr[i]}|`);
//             if (arr[i] == token)
//             {
//               count++;
//             }
//         }

//        if(count <= 2)
//        {
//            if (rooms[token])
//            { 
//                room = rooms[token];
//                pass = true;
              
//            }
//            else
//            {
//                ROOM_NUM++;
//                room = ROOM_NUM;
//                rooms[token] = room;
//                pass = false;
//            }
        
           
//         client_num++;
//         players.set(socket.id, client_num);

//         socket.join(room);
//         if(map1.has(room) === false)
//         {
//             map1.set(room, client_num);
//             jojo = 1;
//             console.log(`JOJO VALUE 11111  ${jojo}`)
//             socket.emit('playerId', players.get(socket.id), room,jojo);
//         }
//         else
//         {
//             jojo = 2;
//             console.log(`JOJO VALUE 22222 ${jojo}`)
//             socket.emit('playerId', players.get(socket.id), room,jojo);
//         }


//         // socket.emit('playerId', players.get(socket.id), room,jojo);1
//         console.log(`Player ${client_num} joined room ${room}`);
//         console.log(`GRADEPLAYER---${jojo} joined room ${room}`);
//         if (prev_room != room)
//         {
//             pl1[room] = await new paddle_left;
//             pl2[room] = await new paddle_right;
//             db[room] = await new direct_ball;
//             prev_room = room;
//         }

//         pl1[room].canvas_height = canvas_height;
//         pl2[room].canvas_height = canvas_height;
//         pl1[room].paddle_y = canvas_height / 2;
//         pl2[room].paddle_y = canvas_height / 2;
//         pl1[room].height_paddle = canvas_height * 20 / 100;
//         pl2[room].height_paddle = canvas_height * 20 / 100;
//         db[room].cnv_w = canvas_width;
//         db[room].cnv_h = canvas_height;
//         db[room].ball_x = canvas_width / 2;
//         db[room].ball_y = canvas_height / 2;

//         socket.on("move_paddle_right", async(move, num_player, data, grade) => {

//             room = await data;
//             if (grade %2 != 0) 
//             {
//                 if (move == "up")
//                     pl1[room].move_up();
//                 else if (move == "down")
//                     pl1[room].move_down();
//             }
//             else if(grade % 2 == 0)
//             {
//                 if (move ==  "up")
//                     pl2[room].move_up();
//                 else if (move ==  "down")
//                     pl2[room].move_down();
//             }
//         });

//         socket.on("new value room", (data) => {
//             room = data;
//         });

//         flag_room++;

//         // let arr = [...map.values()];
//         // console.log(`------------|||||||>>${arr.includes(room)}`);
        

//         // console.log(`${ROOM_NUM}|im herrrre---|${room}---------|${flag_room} `);
//         // if (ROOM_NUM <= room && flag_room % 2 == 0)
//         // {
//             // Check if there are two players in the room to start the game
           
//             startGameIfNeeded(room);
//             // }
//         }
//         });
        
//     function startGameIfNeeded(room_num)
//     {
//         // console.log(`|----------|${count}|`);
//         if (pass && count == 2 )
//         {
//             count = 0;
//             // Start the game only when there are two players in the room
//             interval[room_num] = setInterval(() => game(room_num), 1000 / 60);
//         }
//     }

//     function game(room_num)
//     {
//         db[room_num].p_left = pl1[room_num].paddle_y;
//         db[room_num].p_right = pl2[room_num].paddle_y;
//         const gameState = {
//             room: { id: room_num },
//             ball: { x: db[room_num].ball_x, y: db[room_num].ball_y },
//             paddles: { left: pl1[room_num].paddle_y, right: pl2[room_num].paddle_y },
//             scores: { player1: db[room_num].score_left, player2: db[room_num].score_right },
//             sound: { sound_paddle: db[room_num].sound_padd, sound_wall: db[room_num].sound_wall },
//         };

//         db[room_num].mouve_ball();
//         if (db[room_num].reset_game_flag) {
//             db[room_num].initial_direction();
//             db[room_num].speed = 1;
//             pl1[room_num].paddle_y = canvas_height / 2;
//             pl2[room_num].paddle_y = canvas_height / 2;
//             db[room_num].ball_x = canvas_width / 2;
//             db[room_num].ball_y = canvas_height / 2;
//             db[room_num].reset_game_flag = 0;
//         }

//         gameState.room.id = room_num;
//         gameState.ball.x = db[room_num].ball_x;
//         gameState.ball.y = db[room_num].ball_y;
//         gameState.paddles.left = pl1[room_num].paddle_y;
//         gameState.paddles.right = pl2[room_num].paddle_y;
//         gameState.scores.player1 = db[room_num].score_l;
//         gameState.scores.player2 = db[room_num].score_r;

//         if (db[room_num].sound_pad) {
//             gameState.sound.sound_paddle = 1;
//             db[room_num].sound_pad = 0;
//         }
//         if (db[room_num].sound_wall) {
//             gameState.sound.sound_wall = 1;
//             db[room_num].sound_wall = 0;
//         }
//         if (db[room_num].score_left >= db[room_num].score_max || db[room_num].score_right >= db[room_num].max_score) {
//             clearInterval(interval[room_num]);
//         }
//         io.to(room_num).emit("game_state", gameState);
//     }


//     socket.on('disconnect', () => {
//         console.log('A player disconnected');
//         if (db[room].ball_x !== null && db[room].ball_y !== null) {
//             console.log("STILL IN THE GAME");
//         } else {
//             console.log("Benguerir STILL NOT in THE GAME");
//             db[room].reset_game();
//         }
//         players.delete(socket.id);
//     });
// }

// export default io;


