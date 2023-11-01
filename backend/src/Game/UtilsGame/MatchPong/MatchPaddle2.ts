export default class paddle_right
{
    canvas_height:number =0;
    x:number = 0;
    y:number = this.canvas_height/2;
    speed = 1;
    height_paddle = this.canvas_height*20/100;
    move_up(){
        if(this.y - this.speed < 0)
            this.y  = this.speed;
        this.y -= this.speed;
    }
    move_down(){
        if(this.y+this.speed + this.height_paddle >= this.canvas_height)
            this.y  = this.canvas_height - (this.height_paddle + this.speed);
        this.y += this.speed;
        // console.log(` ${this.canvas_height}this.y ${this.y}`)
    }
    get cnv_h(){
        return this.canvas_height;
    }
    set cnv_h(nb:number)
    {
        this.canvas_height = nb;
    }
    get paddle_x(){
        return this.x;
    }
    get paddle_y(){
        return this.y;
    }
    set paddle_x(nb){
        this.x=nb;
    }
    set paddle_y(nb){
        this.y=nb;
    }
    get paddle_h(){
        return this.height_paddle;
    }
    set paddle_h(nb){
        this.height_paddle = nb;
    }      
}