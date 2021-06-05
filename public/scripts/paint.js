var drawing_canvas = document.getElementById("drawing-canvas")
var drawing_ctx = drawing_canvas.getContext('2d')

let paint = false;
let draw_color;
let draw_width = 10, erase_width = 10;
let is_drawing = false;
let is_erasing = false;

drawing_canvas.addEventListener("touchstart", start, false);
drawing_canvas.addEventListener("touchmove", drawFunc, false);
drawing_canvas.addEventListener("mousedown", start, false);
drawing_canvas.addEventListener("mousemove", drawFunc, false);

drawing_canvas.addEventListener("touchend", stop, false);
drawing_canvas.addEventListener("mouseup", stop, false);
drawing_canvas.addEventListener("mouseout", stop, false);

function start(event){
    is_drawing = true;
    drawing_ctx.beginPath();
    drawing_ctx.moveTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
    event.preventDefault();
}

function drawFunc(event){
    if (is_drawing && is_erasing && active){
        drawing_ctx.globalCompositeOperation ='destination-out';
        drawing_ctx.lineTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
        drawing_ctx.strokeStyle = "#000";
        drawing_ctx.lineWidth = erase_width;
        drawing_ctx.lineCap = "round";
        drawing_ctx.lineJoin = "round";
        drawing_ctx.stroke();
    } else if (is_drawing && paint && active) {
        drawing_ctx.globalCompositeOperation = 'source-over'
        drawing_ctx.lineTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
        drawing_ctx.strokeStyle = draw_color;
        drawing_ctx.lineWidth = draw_width;
        drawing_ctx.lineCap = "round";
        drawing_ctx.lineJoin = "round";
        drawing_ctx.stroke();
    }
    event.preventDefault();
}

function stop(event){
    if ( is_drawing ) {
        drawing_ctx.stroke()
        drawing_ctx.closePath()
        is_drawing = false;

        if(paint || is_erasing) snapshot();
    }
    event.preventDefault();
}