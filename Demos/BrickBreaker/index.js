class Point
{
    constructor(_x, _y)
    {
        this.X = _x;
        this.Y = _y;
    }
    add(_point)
    {
        return new Point(this.X + _point.X, this.Y + _point.Y);
    }
    sub(_point)
    {
        return new Point(this.X - _point.X, this.Y - _point.Y);
    }
    mul(_point)
    {
        return new Point(this.X * _point.X, this.Y * _point.Y);
    }
    div(_point)
    {
        return new Point(this.X / _point.X, this.Y / _point.Y);
    }
}
class Color
{
    constructor(r, g, b, a)
    {
        this.R = r;
        this.G = g;
        this.B = b;
        if (a)
        {
            this.A = a;
        }
        else
        {
            this.A = 255;
        }
    }
}
class Canvas
{
    constructor(id, onRender)
    {
        this._canvas = document.getElementById(id);
        this._canvas.width = window.innerWidth;
        this._canvas.height = window.innerHeight;
        this.Device = this._canvas.getContext("2d");
        this.onRender = onRender;
        window.addEventListener("resize", (e) =>
        {
            this._canvas.width = window.innerWidth;
            this._canvas.height = window.innerHeight;
        });
    }
    render()
    {
        this.clear();
        this.onRender(this);
    }
    clear()
    {
        this.Device.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }
    drawCircle(location, radius, color)
    {
        this.setColor(color);
        this.Device.beginPath();
        this.Device.arc(location.X, location.Y, radius, 0, 2 * Math.PI);
        this.Device.stroke();
    }
    fillCircle(location, radius, color)
    {
        this.setColor(color);
        this.Device.beginPath();
        this.Device.arc(location.X, location.Y, radius, 0, 2 * Math.PI);
        this.Device.fill();
    }
    drawRectangle(location, size, color)
    {
        this.setColor(color);
        this.Device.strokeRect(location.X, location.Y, size.X, size.Y);
    }
    fillRectangle(location, size, color)
    {
        this.setColor(color);
        this.Device.fillRect(location.X, location.Y, size.X, size.Y);
    }
    setColor(color)
    {
        this.Device.fillStyle = "rgba(" + color.R + ", " + color.G + ", " + color.B + ", " + (color.A / 255) + ")";
        this.Device.strokeStyle = "rgba(" + color.R + ", " + color.G + ", " + color.B + ", " + (color.A / 255) + ")";
    }
}
class Ball
{
    constructor(location, radius, color, direction, speed)
    {
        this.location = location;
        this.radius = radius;
        this.color = color;
        this.direction = direction;
        this.speed = speed;
        this.velocity = new Point(0, 0);
    }
    forward()
    {
        let y = Math.sin(this.direction * Math.PI / 180) * this.speed;
        let x = Math.cos(this.direction * Math.PI / 180) * this.speed;
        this.location = this.location.add(new Point(x, y));
    }
    move()
    {
        this.location = this.location.add(this.velocity);
        if (this.location.X <= 0)
        {
            this.velocity.X *= -1;
            this.location.X = 1;
        }
        if (this.location.X >= window.innerWidth)
        {
            this.velocity.X *= -1;
            this.location.X = window.innerWidth - 1;
        }
        if (this.location.Y <= 0)
        {
            this.velocity.Y *= -1;
            this.location.Y = 1;
        }
        if (this.location.Y >= window.innerHeight)
        {
            //this.velocity.Y *= -0.9;
            if (this.velocity.X != 0)
            {
                //this.velocity.X *= 0.9;
            }
            //this.location.Y = window.innerHeight - 1;
        }
        if (Math.abs(this.velocity.X) > 10)
        {
            this.velocity.X = 10 * (this.velocity.X / Math.abs(this.velocity.X));
        }
    }
    render(canvas)
    {
        canvas.fillCircle(this.location, this.radius, this.color);
    }
}
class Brick
{
    constructor(location, size, color)
    {
        this.location = location;
        this.size = size;
        this.color = color;
        this.moving = false;
    }
    collide(ball, forceX)
    {
        let bLoc = ball.location;
        let bSiz = ball.radius;
        let pLoc = this.location;
        let pSiz = this.size;
        if (!this.moving)
        {
            if (bLoc.Y + bSiz >= pLoc.Y - (pSiz.Y / 2))
            {
                if (bLoc.Y - bSiz <= pLoc.Y + (pSiz.Y / 2))
                {
                    let good = false;
                    if (bLoc.X + (bSiz) - 10 >= pLoc.X - (pSiz.X / 2))
                    {
                        if (bLoc.X - (bSiz) + 10 <= pLoc.X + (pSiz.X / 2))
                        {
                            ball.velocity.Y *= -1;
                            ball.velocity.X += forceX;
                            good = true;
                            return true;
                        }
                    }
                    if (!good)
                    {
                        if (bLoc.X + bSiz >= pLoc.X - (pSiz.X / 2))
                        {
                            if (bLoc.X - bSiz <= pLoc.X + (pSiz.X / 2))
                            {
                                if (!this.moving)
                                {
                                    ball.velocity.X *= -1;
                                    return true;
                                }
                                else 
                                {
                                    ball.velocity.Y *= -1;
                                    ball.velocity.X += forceX;
                                    return true;
                                }
                            }
                        }
                    }
                }
            }
        }
        else
        {
            if (bLoc.Y + bSiz >= pLoc.Y - (pSiz.Y / 2))
            {
                if (bLoc.Y - bSiz <= pLoc.Y + (pSiz.Y / 2))
                {
                    if (bLoc.X + (bSiz) >= pLoc.X - (pSiz.X / 2))
                    {
                        if (bLoc.X - (bSiz) <= pLoc.X + (pSiz.X / 2))
                        {
                            ball.velocity.Y *= -1;
                            ball.location.Y = pLoc.Y - pSiz.Y - bSiz - 1;
                            ball.velocity.X += forceX;
                            return true;
                        }
                    }
                }
            }
        }
        if (bLoc.Y >= window.innerHeight + pSiz.Y)
        {
            // Dispatch Event
        }
        return false;
    }
    render(canvas)
    {
        let s = this.location.sub(this.size.div(new Point(2, 2)));
        canvas.fillRectangle(s, this.size, this.color);
    }
}
let mainball;
let paddle;
let bricks = [];
let gravity = 0.5;
let MouseLocation = new Point(0, 0);
let PreviousMouseLocation = new Point(0, 0);
let DeltaMouseLocation = new Point(0, 0);
let previousLoc = [];
function entry()
{
    let canvasObject = new Canvas("renderer", (canvas) =>
    {
        render(canvas);
    });
    mainball = new Ball(new Point(window.innerWidth / 2, 1), 10, new Color(0, 0, 0), 0, 1);
    mainball.velocity = new Point(0, 0);
    let paddleHeight = 20;
    let paddlePadding = 0;
    paddle = new Brick(new Point(0, window.innerHeight - (paddleHeight / 2) - paddlePadding), new Point(250, paddleHeight), new Color(255, 0, 0));
    paddle.moving = true;
    for (let j = 0; j < 5; j++)
    {
        for (let i = 1; i < 5; i++)
        {
            bricks.push(new Brick(new Point((window.innerWidth / 2) - (135 * i) - 10, 300 + (j * 55)), new Point(130, 50), new Color(0, 0, 0)));
            bricks.push(new Brick(new Point((window.innerWidth / 2) + (135 * i) + 10, 300 + (j * 55)), new Point(130, 50), new Color(0, 0, 0)));
        }
    }    
    window.addEventListener("mousemove", (e) =>
    {
        paddle.location.X = e.offsetX;
        MouseLocation = new Point(e.offsetX, e.offsetY);
        DeltaMouseLocation = MouseLocation.sub(PreviousMouseLocation);
        PreviousMouseLocation = new Point(MouseLocation.X, MouseLocation.Y);
    });
    window.addEventListener("resize", () =>
    {
        paddle.location.Y = window.innerHeight - (paddleHeight / 2) - paddlePadding;
    })
    let mainLoop = () =>
    {
        requestAnimationFrame(mainLoop);
        canvasObject.render();
    };
    mainLoop();
    let upLoop = () =>
    {
        requestAnimationFrame(upLoop);
        update();
        DeltaMouseLocation = new Point(0, 0);
    };
    upLoop();
}
function update()
{
    mainball.velocity.Y += gravity;
    mainball.move();
    previousLoc.push(mainball.location);
    paddle.collide(mainball, DeltaMouseLocation.X);
    for (let i = bricks.length - 1; i >= 0; i--)
    {
        if (bricks[i].collide(mainball, 0))
        {
            bricks.splice(i, 1);
        }    
    }    
}
function render(canvas)
{
    for (let i = bricks.length - 1; i >= 0; i--)
    {
        bricks[i].render(canvas);
    }
    for (let i = 0; i < previousLoc.length; i++)
    {
        canvas.drawCircle(previousLoc[i], 2, new Color(0, 0, 0));
    }
    if (previousLoc.length > 100)
    {
        previousLoc.shift();
    }
    mainball.render(canvas);
    paddle.render(canvas);
}