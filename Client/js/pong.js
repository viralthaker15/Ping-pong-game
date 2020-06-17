const cvs = document.getElementById("pong")
const ctx = cvs.getContext("2d")
//loading the sound
let hit = new Audio()
let wall = new Audio()
let user1Score = new Audio()
let user2Score = new Audio()

hit.src = "sounds/hit.mp3"
wall.src = "sounds/wall.mp3"
user1Score.src = "sounds/user1Score.mp3"
user2Score.src = "sounds/user2Score.mp3"

//Creating the User bar and User data
const User1 = {

    width : 10 , 
    height : 100 ,
    //position coordinates of left-top edge
    x : 0 ,
    y : cvs.height/2 - 50, // [cvs.height/2 - height/2 ] here height is 100 to place the bar center point in the center of canvas
    color : "BLUE" , 
    score : 0
}

//Creating the Comp / Other User bar and User data
const User2 = {

    width : 10 , 
    height : 100 ,
    //position coordinates of left-top edge
    x : cvs.width - 10 ,
    y : cvs.height/2 - 50 , //to place the bar center point in the center of canvas
    color : "BLUE" , 
    score : 0
}

//creating ball
const ball = {

    x : cvs.width/2 ,
    y : cvs.height/2 ,
    radius : 10 ,
    speed : 5 ,
    velocityX : 5 ,
    velocityY : 5 ,
    color : "RED"
}


// create the net
const net = {
    x : cvs.width/2 - 1 ,  // so it will be centered of canvas and width is 2 so half of it is 1 so we minus 1
    y : 0 ,                // so it will start from top which canvas y = 0
    width : 2 , 
    height : 10 , 
    color : "WHITE"
}

//to draw rect in canvas function
drawRect = (x , y , w , h , color) => {
    ctx.fillStyle = color 
    ctx.fillRect(x,y,w,h)
}

//to draw circle in canvas function
drawCircle = (x , y , r , color) => {

    ctx.fillStyle = color 
    ctx.beginPath()
    ctx.arc( x , y , r , 0 , 2*Math.PI , false)
    //ctx.closePath()
    ctx.fill()
}

// draw Text in canvas function
drawText = ( text , x , y , color) => {
    ctx.fillStyle = color
    ctx.font = "45px fantasy"
    ctx.fillText(text , x , y)
}

//draw Net in canvas function
drawNet = () => {

    for(let i = 0 ; i <= cvs.height ; i=i+15)
        drawRect(net.x , net.y + i , net.width , net.height , net.color)
}

document.addEventListener('mousemove' , (evt) => {
    let rect = cvs.getBoundingClientRect()
    User1.y = evt.clientY - rect.top - User1.height/2 //
})

//collision checking function

collision = (b,p) => {

    p.top = p.y
    p.bottom = p.y + p.height
    p.right = p.x + p.width
    p.left = p.x

    b.top = b.y - b.radius
    b.bottom = b.y + b.radius
    b.left = b.x - b.radius
    b.right = b.x + b.radius


    return b.bottom > p.top && b.top < p.bottom && b.left < p.right && b.right > p.left
    //if all these are true then and then only collision func will return true
    //these all only become true if ball is collided with Bar in range
}

resetBall = () => {
    ball.x = cvs.width/2
    ball.y = cvs.height/2

    ball.speed = 5
    ball.velocityX = -velocityX //inverting directions to opposite side who won 
}


render = () => {

    //clear the canvas 
    drawRect( 0 , 0 , cvs.width , cvs.height , "BLACK")

    // draw the net
    drawNet()

    //draw score
    drawText(User1.score , cvs.width/4 , cvs.height/5 ,"WHITE")
    drawText(User2.score , 3*cvs.width/4 , cvs.height/5 ,"WHITE")

    //draw the user bars
    drawRect(User1.x , User1.y , User1.width , User1.height , User1.color)
    drawRect(User2.x , User2.y , User2.width , User2.height , User2.color)

    //draw the Ball
    drawCircle(ball.x , ball.y , ball.radius , ball.color)
}

// Update function : position , movement , score ,....
update = () => {

    //updating the score and resetting if someone wins
    if(ball.x - ball.radius < 0){
        //User2 wins
        user2Score.play()
        User2.score++
        resetBall()
    }
    else if(ball.x + ball.radius > cvs.width){
        //User1 wins
        user1Score.play()
        User1.score++
        resetBall()
    }

    ball.x = ball.x + ball.velocityX
    ball.y = ball.y + ball.velocityY

    let botLevel = 0.1
    // If its a single player we need to design a simple AI for bot player
    User2.y = User2.y + (ball.y - (User2.y + User2.height/2)) * botLevel // so ball will always be the center of the bar by doing this if level is 0

    if(ball.y + ball.radius > cvs.height || ball.y - ball.radius < 0){
        ball.velocityY = -ball.velocityY
        wall.play()
    }
    // lets check who is hitting the ball    
    let player = (ball.x + ball.radius < cvs.width/2) ? User1 : User2

    if(collision(ball,player))
    {
        let direction = (ball.x +ball.radius < cvs.width/2) ? 1 : -1
        hit.play()
        //here we can manipulate directions with sin cosine otherwise the ball directions arr pretty much predictable
        //where the ball is hitting the player bar
        let collidePoint = (ball.y - (player.y + player.height/2))

        //here collidepoint gives value in -50 0 and 50 for edges and center lets normalize it to -1 0 1
        collidePoint = collidePoint / (player.height/2)

        //calculate the cosine and sine values for directions so we can change the velocity
        let angleRad = collidePoint * (Math.PI/4)       //if ball hits edge it will go 45 degree upward or downward

        //changing the velocity
        ball.velocityX = direction * ball.speed + Math.cos(angleRad)
        ball.velocityY = direction * ball.speed + Math.sin(angleRad)

        //we also increase the speed of the ball whenever it hits the Bar
        ball.speed = ball.speed + 0.1
    } 
}

//Game Initialization
game = () => {
    update()
    render()
}
const fps = 60
setInterval(game , 1000/fps)