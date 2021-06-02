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
    console.log("heart")
    if (paint == true){
        paint = false;
    }
    if (sticker_toggle == false){
        sticker_toggle = true;
    }
})

$('#bow-button').click(() => {
    sticker = 1
    if (paint == true){
        paint = false;
    }
    if (sticker_toggle == false){
        sticker_toggle = true;
    }
})

$('#cake-button').click(() => {
    sticker = 2
    if (paint == true){
        paint = false;
    }
    if (sticker_toggle == false){
        sticker_toggle = true;
    }
})

$('#flower-button').click(() => {
    sticker = 3
    if (paint == true){
        paint = false;
    }
    if (sticker_toggle == false){
        sticker_toggle = true;
    }
})

$('#monkey-button').click(() => {
    sticker = 4
    if (paint == true){
        paint = false;
    }
    if (sticker_toggle == false){
        sticker_toggle = true;
    }
})

$('#rice-button').click(() => {
    sticker = 5
    if (paint == true){
        paint = false;
    }
    if (sticker_toggle == false){
        sticker_toggle = true;
    }
})

$('#sparkles-button').click(() => {
    sticker = 6
    if (paint == true){
        paint = false;
    }
    if (sticker_toggle == false){
        sticker_toggle = true;
    }
})

$('#micheal-button').click(() => {
    sticker = 7
    if (paint == true){
        paint = false;
    }
    if (sticker_toggle == false){
        sticker_toggle = true;
    }
})


// heartImage.src = "https://cdn.pixabay.com/photo/2016/03/31/18/20/heart-1294292_960_720.png"
//     heartImage.onload = function() {
//         bartImage.src = "https://cdn.pixabay.com/photo/2016/04/04/22/27/bart-1308411_960_720.png"
//         bartImage.onload = function(){

//         }
//     }
$(drawing_canvas).click((e) => {
    if (sticker_toggle == true && active == true){
        drawing_ctx.drawImage(sticker_img[sticker], e.pageX - canvas.offsetLeft - 50, e.pageY - canvas.offsetTop - 50, 100, 100)
    }
}) 