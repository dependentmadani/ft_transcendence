
export default class  direct_ball
{
    flag;
    p_left;
    p_right;
    canvas_width:number;
    canvas_height:number ;
    x:number ;
    y:number;
   
    num;
    direction_x ;
    direction_y ;
    speed;

    score_left:number ;
    score_right:number ;
    max_score:number ;
    reset_game_flag:number;

    height_paddle;
    width_paddle;
    ball_size;
    sound_wall:number;
    sound_padd:number;
    constructor()
    {
        this.flag = 0;
        this.p_left = 0;
        this.p_right = 0;
        this.canvas_width = 0;
        this.canvas_height = 0;
        this.x =  this.canvas_width/2;
        this.y =  this.canvas_height/2;
        this.num = Math.floor(Math.random() * 4);
     
        this.speed = 1;
        this.score_left = 0;
        this.score_right = 0;
        this.max_score= 5;
        this.reset_game_flag = 0; 
        this.height_paddle = this.canvas_height*20/100;
        this.width_paddle = this.canvas_width*1.5/100;
        this.ball_size = this.canvas_width*1.5/100;
        this.sound_padd = 0;
        this.sound_wall = 0;    
    }

    mouve_ball()
    {
        this.height_paddle = this.canvas_height*20/100;
        this.width_paddle = this.canvas_width*1.5/100;
        this.ball_size = this.canvas_width*2/100;

        this.check_colision();
        this.ball_paddle_colision();

        if (this.x > 0 && this.x < this.canvas_width)
        {
            this.x += this.direction_x*this.speed;
            this.y += this.direction_y*this.speed;
        }
        else
        {
            this.reset_game_flag++;
        }
    }
    restart_game()
    {
        
        this.score_left = 0;
        this.score_right = 0;
        this.speed = 1;
        this.x =  this.canvas_width/2;
        this.y =  this.canvas_height/2;
    }
    check_colision()
    {
        if (this.y   <= this.ball_size/2 || this.y > this.canvas_height-this.ball_size/2)
        { 
            this.direction_y*=-1;
            this.sound_wall++;
            
            // console.log(`--|${this.canvas_height}|-------------|${this.y}|-----------`)
            // this.speed++;
        }
        // console.log(`2__##${this.width_paddle}########################${this.height_paddle}#######`)
    }
    ball_paddle_colision()
    {
        if (this.x - this.ball_size/2 < this.width_paddle && this.y + this.ball_size/2 >= this.p_left && this.y  <= this.p_left + this.height_paddle)
        {
            // console.log(`1__####${0}#####/#################${this.x}#######`)
            this.x =  this.width_paddle + this.ball_size/2;
            this.direction_x *= -1;
            this.direction_y = (this.y - (this.p_left + this.height_paddle/2)) / this.height_paddle/2;
            this.speed++;
            this.sound_padd++;
            
            // this.flag_paddle = 0;
        }
        else if (this.x + (this.ball_size/2+this.width_paddle) > this.canvas_width  && this.y +this.ball_size/2 >= this.p_right && this.y  <= this.p_right + this.height_paddle)
        {
            // console.log(`2__##${this.x}######${this.x}#############${this.y}##########${this.x}#######`)
            this.x = (this.canvas_width - this.width_paddle) - this.ball_size/2;
            this.direction_x *= -1;
            this.direction_y = (this.y - (this.p_right + this.height_paddle/2)) / this.height_paddle/2;
            this.speed++;
            this.sound_padd++;
        
            
            // this.flag_paddle = 0;
        }
        else if(this.x <= 0)
        {
            // console.log("SCOREEEEEEEEEEEEEEE LEFT")
            this.score_right++;
        }
        else if(this.x >= this.canvas_width)
        {
            this.score_left++;
            // console.log("SCOREEEEEEEEEEEEEEE RIGHT");
        }
    }
            
    initial_direction()
    {
        this.num = Math.floor(Math.random() * 4);
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
        
    get ball_x()
    {
        return this.x;
    }
    
    get ball_y()
    {
        return this.y;
    }
    
    set ball_x(xx){
        this.x = xx;
    }
    
    set ball_y(yy)
    {
        this.y = yy;
    }
        
    get random_num()
    {
        return this.num ;
    }
    set random_num(nb:number)
    {
        this.num = nb;
    }
  
    get dir_x()
    {
        return this.direction_x;
    }
    get dir_y()
    {
        return this.direction_y;
    }
        
    get cnv_h()
    {
        return this.canvas_height;
    }

    set cnv_h(nb:number)
    {
        this.canvas_height = nb;
    }
    get cnv_w()
    {
        return this.canvas_width;
    }

    set cnv_w(nb:number)
    {
        this.canvas_width = nb;
    }

    get padd_left()
    {
        return this.padd_left;
    }
        
    set padd_left(nb)
    {
        this.padd_left = nb;
    }
    
    get padd_right()
    {
        return this.p_right;
    }

    set padd_right(nb)
    {
        this.p_right = nb;
    }
    get score_l()
    {
        return this.score_left;
    }
    get score_r()
    {
        return this.score_right;
    }
    get score_max()
    {
        return this.max_score;
    }
    get sound_wal()
    {
        return this.sound_wall;
    }

    set sound_wal(nb)
    {
        this.sound_wall = nb;
    }
    get sound_pad()
    {
        return this.sound_padd;
    }

    set sound_pad(nb)
    {
        this.sound_padd = nb;
    }
}