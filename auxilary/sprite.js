// ----------------------------------------
// sprite.js - very simple sprite class. 
// You can modify it for your needs
//-----------------------------------------


!function(){

    Sprite = function( config )
    {
        this.initialize(config);
    }
    
    Sprite.prototype.initialize = function(config)
    {
    
        this.frame = 0
        this.frames = [];
        this.valid  = false;
        this.currentFrame = 0;
        this.timer = 0;
        this.fps = config.fps;
    
    
        var waiting = config.frames.length;
        var that  = this;
    
    
        for (frame in config.frames)
        {
            var img = new Image();
            this.frames.push(img);
    
            img.onload = function()
            {
                waiting--;
    
                if (waiting <=0) {
                    that.valid = true;
                    if (config.onload) {
                        config.onload.call(that)
                    }
                    that.currentFrame = that.frames[0]
                }
            }
            img.src = config.baseUrl + "/" +config.frames[frame];
        }
    }
    
    
    Sprite.prototype.update = function(dt)
    {
        if (!this.valid) return;
    
        this.timer += dt;
    
        var frame = Math.floor( this.timer / (1000/this.fps) ) % this.frames.length;
        this.currentFrame=this.frames[frame];
    }

    Sprite.prototype.reset = function () {
        this.times = 0
        this.currentFrame = this.frames[0]
    }
    
    Sprite.prototype.draw = function (x, y, w, h) {
        if (!this.valid) return;
        if(arguments.length==2)   ctx.drawImage(this.currentFrame, x, y);
        else   ctx.drawImage(this.currentFrame, x, y, w, h);
    }

    window.Sprite = Sprite;
}()
