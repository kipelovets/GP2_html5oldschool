//-------------------------------------------------------
// Base class for the game object
//-------------------------------------------------------

// Parameters
var screenHeight      = 640,
    screenWidth       = 960,
    carsPerSecond     = 0.4,
    carSpaceThreshold = 1.0,
    carsThreshold     = 0.5,
    roadWidth         = 200,
    offroadWidth      = 80,
    roads             = 4,
    // Car
    carHeight         = 189,
    bearHeight        = 200,

    stage = 0
    ;

var Bear = function () {
    this.spriteLeft = new Sprite({
        "baseUrl"  : "res/gfx/"
        , "fps"    : 60
        , "frames" : [
            'walk_left/1.png', // 0
            'walk_left/2.png',
            'walk_left/3.png',
            'walk_left/4.png',
            'walk_left/5.png',
            'walk_left/6.png',
            'walk_left/7.png',
            'walk_left/8.png',
            'walk_left/9.png',
            'walk_left/10.png',
            'walk_left/11.png',
            'walk_left/12.png',
            'walk_left/13.png',
            'walk_left/14.png',
            'walk_left/15.png',
            'walk_left/16.png',
            'walk_left/17.png',
            'walk_left/18.png',
            'walk_left/19.png'
        ]})
    this.spriteRight = new Sprite({
        "baseUrl"  : "res/gfx/"
        , "fps"    : 60
        , "frames" : [
            'walk_right/1.png', // 19
            'walk_right/2.png',
            'walk_right/3.png',
            'walk_right/4.png',
            'walk_right/5.png',
            'walk_right/6.png',
            'walk_right/7.png',
            'walk_right/8.png',
            'walk_right/9.png',
            'walk_right/10.png',
            'walk_right/11.png',
            'walk_right/12.png',
            'walk_right/13.png',
            'walk_right/14.png',
            'walk_right/15.png',
            'walk_right/16.png',
            'walk_right/17.png',
            'walk_right/18.png',
            'walk_right/19.png',
        ]})

    var x = 0, 
        y = 340, 
        face = -1,  // -1 - left, 1 - right
        dx = 0, 
        sprite = this.spriteLeft, 
        walking = false

    this.moveLeft = function () {
        if (!walking && x > 0) {
            sprite = this.spriteLeft
            sprite.reset()
            walking = true
            face = -1
        }
    }

    this.moveRight = function () {
        if (!walking && x < roads - 1) {
            sprite = this.spriteRight
            sprite.reset()
            walking = true
            face = 1
        }
    }

    this.draw = function () {
        sprite.draw(offroadWidth + x * roadWidth + face * dx, y)
    }

    this.update = function (tickperframe) {
        sprite.update(tickperframe)
        if (walking) {
            var walkTime = 0.3, 
                walkSpeed = roadWidth / walkTime
            dx += walkSpeed * tickperframe / 1000
            if (dx >= roadWidth) {
                walking = 0
                dx = 0
                x += face
            }
        }
    }

    this.collide = function (car) {
        return car.getX() == x && (car.y + carHeight >= y + 100) && (car.y < y + bearHeight)
    }

    this.near = function (car) {
        return (Math.abs(car.getX() - x) == 1) && (car.y + carHeight >= y + 100) && (car.y < y + bearHeight)
    }
}

var Car = function () {
    this.sprites = [
        new Sprite({
            "baseUrl"  : "res/gfx/car/"
            , "fps"    : 24
            , "frames" : ['car1.png']
        }),
        new Sprite({
            "baseUrl"  : "res/gfx/car/"
            , "fps"    : 24
            , "frames" : ['car2.png']
        })
    ]

    var sprite = this.sprites[Math.floor(Math.random() * this.sprites.length)]

    this.x = 80 + 200 * Math.floor(Math.random() * 3)
    this.y = - carHeight
    this.speed = 200 * (1 + gameElapsed / 100) + Math.floor(Math.random() * 150 * (1 + gameElapsed / 180))

    this.isOut = false

    this.hasFreeSpace = function () {
        return this.y > sprite.height * carSpaceThreshold
    }

    this.getX = function () {
        return (this.x - offroadWidth) / roadWidth
    }

    this.draw = function () {
        sprite.draw(this.x, this.y)
    }

    this.update = function (tickperframe) {
        sprite.update(tickperframe) 
        this.y += this.speed * tickperframe / 1000
        if (this.y > screenHeight) {
            this.isOut = true;
        }
    }
}

var sounds = {},
    bear = new Bear(),
    cars = [],
    bg,
    logo,
    bgPos = 0,
    lifeImage,
    startTime = new Date
    ;

Game = function () {

}

Game.prototype.Load = function () {

    bg = new Image()
    bg.src = 'res/gfx/road.png'

    lifeImage = new Image()
    lifeImage.src = 'res/gfx/heart.png'

    logo = new Image()
    logo.src = 'res/gfx/logo.jpg'

    sounds.roar = new buzz.sound('res/snd/roar.mp3')
    sounds.horn = new buzz.sound('res/snd/horn.mp3')
    sounds.car = new buzz.sound('res/snd/car.mp3')

    // // load sound
    // this.SoundJump = new buzz.sound("res/jump.ogg");
    // this.SoundJump.play();

    // // load ambient music and play it
    // this.SoundAmbient = new buzz.sound("res/sound.ogg");
    // this.SoundAmbient.loop().play();

    // // set up creature
    // this.creatureImg = new Image();
    // this.creatureImg.src = 'res/creature.png';

    // this.creaturePos = new Vec2(canvas.width / 2, canvas.height / 2);

    // // set up girl
    // this.girlPos = new Vec2(0, canvas.height / 2);
}

var carsElapsed = 0,
    lifes = 3,
    pause = false,
    gameElapsed = 0
    ;

Game.prototype.Calculate = function () {
    if (lifes <= 0 || pause || stage != 1) {
        return
    }

    gameElapsed += secperframe

    bgPos = (bgPos + tickperframe / 12) % screenHeight
    bear.update(tickperframe)

    // Cars
    carsElapsed += secperframe
    var dice = Math.random() * carsElapsed * carsPerSecond * (1 + gameElapsed / 180)
    if (dice > carsThreshold) {
        carsElapsed = 0
        var spaces = [], i, count = 0
        for (i = offroadWidth; i < screenWidth - offroadWidth; i += roadWidth) {
            spaces[count++] = true
        }
        for (i in cars) {
            spaces[cars[i].getX()] &= cars[i].hasFreeSpace()
        }
        var j = Math.floor(Math.random() * spaces.length)
        for (i = 0; i < count; i++) {
            if (spaces[(j + i) % count]) {
                var car = new Car()
                car.x = offroadWidth + ((j + i) % count) * roadWidth
                cars.push(car)
                break
            }
        }

        if (Math.random() > 0.9 && sounds.cat.isPaused()) {
            sounds.car.stop()
            sounds.car.play()
        }
    }

    i = 0
    while (i < cars.length) {
        cars[i].update(tickperframe)
        if (cars[i].isOut) {
            cars.splice(i, 1)
        } else {
            i++
        }
    }

    // Collision
    i = 0
    while (i < cars.length) {
        if (bear.collide(cars[i])) {
            lifes--
            cars.splice(i, 1)
            sounds.roar.stop()
            sounds.roar.play()
            if (lifes == 0) {
                document.getElementById('twitterIframe').style.display = 'block'
                document.getElementById('twitterIframe').src = 'https://platform.twitter.com/widgets/tweet_button.html?size=large&text=My BearIT score is ' + Math.floor(gameElapsed) + ' %23geekparty'
            }
            break
        }
        if (bear.near(cars[i]) && Math.random() > 0.1 && sounds.horn.isPaused()) {
            sounds.horn.stop()
            sounds.horn.play()
        }
        i++
    }
}

var x = 0;

Game.prototype.Render = function () {

    ctx.drawImage(bg, 0, 0, bg.width, bg.height, 0, bgPos, bg.width, bg.height)
    if (bgPos > 0) {
        ctx.drawImage(bg, 0, 0, bg.width, bg.height, 0, bgPos - bg.height, bg.width, bg.height)
    }

    if (stage == 0) {
        ctx.drawImage(logo, 0, 0, logo.width, logo.height, 0, 0, logo.width, logo.height)
        return
    }

    if (lifes <= 0) {
        ctx.font = "100px Georgia"
        ctx.fillStyle = '#ff0000'
        ctx.fillText("Game Over", 200, 300)

        ctx.font = "80px Georgia"
        ctx.fillText(Math.floor(gameElapsed), 200, 500)
        return
    }

    var i
    for (i in cars) {
        cars[i].draw()
    }

    bear.draw()

    for (i = 0; i < lifes; i++) {
        ctx.drawImage(lifeImage, 0, 0, lifeImage.width, lifeImage.height, 915, 264 + i*44, lifeImage.width, lifeImage.height)
    }

    ctx.font = "20px Georgia"
    ctx.fillText(Math.floor(gameElapsed), 5, 620)
}

//---------------------------------------------
// mouse input

Game.prototype.onmousedown = function (e) {

    // get pos from event e
    // this.creaturePos.x = e.layerX;
    // this.creaturePos.y = e.layerY;

    // play sound
    // this.SoundJump.stop();
    // this.SoundJump.play();
    
    if (stage == 0) {
        stage = 1
        return
    }

    if (lifes == 0) {
        document.getElementById('twitterIframe').style.display = 'none'
        lifes = 3
        return
    }

    if (e.clientX < (canvas.offsetLeft + canvas.width / 2)) {
        bear.moveLeft()
    } else {
        bear.moveRight()
    }

}
Game.prototype.onmousemove = function (e) {
}
Game.prototype.onmouseup = function (e) {
}

//---------------------------------------------
// keyboard input

Game.prototype.onkeydown = function (e) {

    if (stage == 0) {
        stage = 1
        return
    }

    if (lifes == 0) {
        document.getElementById('twitterIframe').style.display = 'none'
        lifes = 3
        return
    }

    switch (e.which) {
        case 37: //left
            bear.moveLeft()
            ok = true
            break;
        case 39: // right
            bear.moveRight()
            break;
        case 38: //up
        case 40: //down
        case 32: // space
            pause = !pause
    }

    // this.SoundJump.stop();
    // this.SoundJump.play();
}

Game.prototype.onkeypress = function (e) {


}
   
Game.prototype.onkeyup = function (e) {

}




