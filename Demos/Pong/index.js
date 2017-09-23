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
function entry()
{
    let canvasObject = new Canvas("renderer", (canvas) =>
    {
        render(canvas);
    });
    let mainLoop = () =>
    {
        requestAnimationFrame(mainLoop);
        update();
        canvasObject.render();
    };
    mainLoop();
}
function update()
{

}
function render(canvas)
{
    canvas.fillRectangle(new Point(0, 0), new Point(10, 10), new Color(0, 0, 0));
}