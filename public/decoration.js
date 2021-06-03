var sticker = 1;
var sticker_toggle = false;

var sticker_img = []

function preload() {
    for (var i = 0; i < arguments.length; i++) {
        sticker_img[i] = new Image();
        sticker_img[i].src = preload.arguments[i]
    }
}
preload(
    "./sticker-imgs/heart.png",
    "./sticker-imgs/bow.png",
    "./sticker-imgs/cake.png",
    "./sticker-imgs/flower.png",
    "./sticker-imgs/monkey.png",
    "./sticker-imgs/rice-ball.png",
    "./sticker-imgs/sparkles.png",
    "./sticker-imgs/micheal.png"
)
//Select sticker
$('#heart-button').click(() => {
    sticker = 0;
    sticker_toggle = true;
    paint = false;
    is_erasing = false;
    console.log (sticker_toggle)
})

$('#bow-button').click(() => {
    sticker = 1
    sticker_toggle = true;
    paint = false;
    is_erasing = false;
    console.log (sticker_toggle)
})

$('#cake-button').click(() => {
    sticker = 2
    sticker_toggle = true;
    paint = false;
    is_erasing = false;
    console.log (sticker_toggle)
})

$('#flower-button').click(() => {
    sticker = 3
    sticker_toggle = true;
    paint = false;
    is_erasing = false;
    console.log (sticker_toggle)
})

$('#monkey-button').click(() => {
    sticker = 4
    sticker_toggle = true;
    paint = false;
    is_erasing = false;
    console.log (sticker_toggle)
})

$('#rice-button').click(() => {
    sticker = 5
    sticker_toggle = true;
    paint = false;
    is_erasing = false;
    console.log (sticker_toggle)
})

$('#sparkles-button').click(() => {
    sticker = 6
    sticker_toggle = true;
    paint = false;
    is_erasing = false;
    console.log (sticker_toggle)
})

$('#micheal-button').click(() => {
    sticker = 7
    sticker_toggle = true;
    paint = false;
    is_erasing = false;
    console.log (sticker_toggle)
})

$(drawing_canvas).click((e) => {
    if (sticker_toggle == true && active == true){
        drawing_ctx.globalCompositeOperation = 'source-over'
        drawing_ctx.drawImage(sticker_img[sticker], e.pageX - canvas.offsetLeft - 50, e.pageY - canvas.offsetTop - 50, 100, 100)
    }
}) 