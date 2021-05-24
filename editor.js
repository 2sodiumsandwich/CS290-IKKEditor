/**
 * We should probably separate this code into different files
 * and make it look pretty but since this is dev and I'm so insanely 
 * lazy and inefficient this will have to do for now at least i commented
 * some of the code
 */

var canvas = document.getElementById("photo-canvas");
var ctx = canvas.getContext('2d');

//Image width and height on canvas, not natural size
//canX canY are the locations of the image on the canvas, 0,0 being top left
var imageWidth, imageHeight, canX, canY;
var active = false;

var imageData;

// NEW CODEEEEEEEEEEE
console.log("Paint")
//NEW PAINT CODE

var paintToggle = document.getElementById("paint-toggle");
console.log("PaintToggle", paintToggle)
paintToggle.addEventListener("click", paint_Toggle, false);
let paint = false;
console.log("help")
let draw_color = "black";
let draw_width = "10";
let erase_width = "10";
let is_drawing = false;
let is_erasing = false;

function paint_Toggle(){
    if (paint == true){
        paint = false;
    }else if (paint == false){
        paint = true;
    }
}


canvas.addEventListener("touchstart", start, false);
canvas.addEventListener("touchmove", drawFunc, false);
canvas.addEventListener("mousedown", start, false);
canvas.addEventListener("mousemove", drawFunc, false);

canvas.addEventListener("touchend", stop, false);
canvas.addEventListener("mouseup", stop, false);
canvas.addEventListener("mouseout", stop, false);

function start(event){
    is_drawing = true;
    ctx.beginPath();
    ctx.moveTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
    event.preventDefault();
}

function drawFunc(event){
    if (is_drawing && is_erasing && paint){
        ctx.clearRect(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop, erase_width, erase_width)
    }else if (is_drawing && paint) {
        console.log("Drawing")
        ctx.lineTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
        ctx.strokeStyle = draw_color;
        ctx.lineWidth = draw_width;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.stroke();
    }
    event.preventDefault();
}

function stop(event){
    if ( is_drawing ) {
        ctx.stroke()
        ctx.closePath()
        is_drawing = false;
    }
    event.preventDefault();
}

function erase_tool(){
    if (is_erasing == true){
    is_erasing = false;
    }else if (is_erasing == false){
        is_erasing = true;
    }
}

function paint_tool(){
    if (is_erasing == true){
        is_erasing = false;
    }
}

//NEW CODE//

//default values on page load
var brightness = 0, contrast = 0, saturation = 1;

// var sat_slider = document.getElementById("saturation-slider");
// sat_slider.addEventListener("change", layerSaturation, false)


function layerSaturation(pixelArray) {
    // if (pixelArrayvar == undefined){
    //     pixelArrayvar = imageData.data.map((x) => x)
    // }
    
    // let pixelArray = imageData.data.map((x) => x);
    // console.log("PixelArray:", pixelArray)
    // console.log("saturation:", saturation1)
    for(i = 0; i < pixelArray.length; i+=4) {
        
        var r,g,b,hue,sat,max,min;

        r = pixelArray[i] / 255;
        g = pixelArray[i+1] / 255;
        b = pixelArray[i+2] / 255;

        max = Math.max(r, g, b);
        min = Math.min(r, g, b);
    
        if(max - min == 0) {
            hue = 0;
        } else if(max == r) {
            hue = 60 * (0 + (g-b)/(max-min));
        } else if(max == g) {
            hue = 60 * (2 + (b-r)/(max-min));
        } else {
            hue = 60 * (4 + (r-g)/(max-min));
        }
        
        hue = (hue < 0 ? hue + 360: hue)
    
        l = (max + min) / 2
    
        sat = (max - l) / Math.min(l, 1-l);
        sat *= saturation; // this is what we came for
        sat = (sat > 1 ? 1 : sat < 0 ? 0 : sat);
        if (l == 0 || l == 1){
            sat = 0
        }
        
        // console.log("lightness =", l)
        // console.log("sat =", sat)
        // console.log("hue =", hue)
        //back to rgb
        
        var hue_prime = hue / 60
        var contrast2 = (1 - Math.abs(2*l-1)) * sat
        var x = contrast2 * (1 - Math.abs( hue_prime%2 - 1))

        // console.log("sat: ", sat)
        // console.log("Hue:", hue)
        // console.log("hue_prime", hue_prime)
        var R1, G1, B1;
        //conditionals for (R1, G1, B1)
        if(hue_prime == undefined){
            R1 = 0;
            G1 = 0;
            B1 = 0;
        }else if(hue_prime >= 0 && hue_prime < 1){
            R1 = contrast2;
            G1 = x;
            B1 = 0;
        }else if(hue_prime >= 1 && hue_prime < 2){
            R1 = x;
            G1 = contrast2;
            B1 = 0;
        }else if(hue_prime >= 2 && hue_prime < 3){
            R1 = 0;
            G1 = contrast2;
            B1 = x
        }else if(hue_prime >= 3 && hue_prime < 4){
            R1 = 0;
            G1 = x;
            B1 = contrast2;
        }else if(hue_prime >= 4 && hue_prime < 5){
            R1 = x;
            G1 = 0;
            B1 = contrast2;
        }else if(hue_prime >= 5 && hue_prime < 6){
            R1 = contrast2;
            G1 = 0;
            B1 = x;
        }
        // console.log("R1:", R1)
        // console.log("G1", G1)
        // console.log("B1", B1)
        var m = l - (contrast2/2)

        pixelArray[i] = (R1 + m)*255
        pixelArray[i+1] = (G1 + m)*255
        pixelArray[i+2] = (B1 + m)*255

    }
    let tempImageData = new ImageData(pixelArray, imageWidth, imageHeight);

    ctx.putImageData(tempImageData, canX, canY);
    return tempImageData;
}

var pixelArrayvar
var saturation_toggle = false;
//applies the bcs filters on top of the image woo
function draw() {
    let pixelArray = imageData.data.map((x) => x);
    console.log("pixelArray:", pixelArray)

    let a = (259*(255 + contrast)) / (255*(259 - contrast)); //gain equation shamelessly stolen from the internet
    for(i = 0; i < pixelArray.length; i+=4) {
        pixelArray[i]   = a * (pixelArray[i] - 128) + 128 + brightness;
        pixelArray[i+1] = a * (pixelArray[i+1] - 128) + 128 + brightness;
        pixelArray[i+2] = a * (pixelArray[i+2] - 128) + 128 + brightness;
    }

    if (saturation_toggle == true){
        layerSaturation(pixelArray)
    }
    // pixelArrayvar = pixelArray

    let tempImageData = new ImageData(pixelArray, imageWidth, imageHeight);

    ctx.putImageData(tempImageData, canX, canY);
    return tempImageData;
}

//reset form values
function reset() {
    $('#brightness-slider, #contrast-slider, #saturation-slider').val(50)
}
reset();

$(function() {
    //draggable() from jquery UI lib, makes things draggable.
    //TODO make stuff not draggable off screen
    $('#adjustment-tool-bar, #paint-tool-bar, #save-modal, #delete-modal').draggable();

    $('#upload-photo-button').change(function(e) {
        let imagefile = e.target.files[0];
        let fr = new FileReader();

        fr.readAsDataURL(imagefile);
        fr.onload = (e) => {
            let image = new Image();
            image.src = e.target.result;
            //make sure image is loaded b4 using it
            image.onload = function() {
                try {
                    //Scale image to canvas size, maintaining aspect ratio
                    let ar = image.width / image.height;
    
                    imageHeight = canvas.height;
                    imageWidth = parseInt(imageHeight * ar);

                    if(imageWidth > canvas.width) {
                        imageWidth = canvas.width;
                        imageHeight = parseInt(imageWidth / ar);
                    }
                    
                    canX = parseInt((canvas.width - imageWidth) / 2);
                    canY = parseInt((canvas.height - imageHeight) / 2);

                    ctx.drawImage(image, canX, canY, imageWidth, imageHeight);
                    $(".upload-button-container").hide();
                    active = true;

                    imageData = ctx.getImageData(canX, canY, imageWidth, imageHeight);
                }
                catch(err) {
                    console.log(err);
                    alert("Error, file format not accepted")
                }
            }
        }
    })

    /**
     * Paint stuff
     */

    $('#paint-toggle').click(() => {
        $('#paint-tool-bar').toggle();
    })

    /**
     * Adjustment stuff
     */

    $('#adjustment-toggle').click(() => {
        $('#adjustment-tool-bar').toggle();
    })

    

    $('#brightness-slider').on('input', function (e) {
        brightness = (e.target.value - 50)/50 * 128; //turns 0-100 val into an 8 bit val fo calclatodsnd
        saturation_toggle = false
        if(active) draw();
    })

    $('#brightness-slider').on('change', function (e) {
        brightness = (e.target.value - 50)/50 * 128; //turns 0-100 val into an 8 bit val fo calclatodsnd
        saturation_toggle = true
        if(active) draw();
    })

    $('#contrast-slider').on('input', function (e) {
        contrast = (e.target.value - 50)/50 * 128; // same as abv
        saturation_toggle = false;
        if(active) draw();
    })

    $('#contrast-slider').on('change', function (e) {
        contrast = (e.target.value - 50)/50 * 128; // same as abv
        saturation_toggle = true;
        if(active) draw();
    })

    $('#saturation-slider').on('change', function (e) {
        saturation = (e.target.value / 50); //sat is on a scale of 0-2, 1 being default
        saturation_toggle = true;
        if(active) draw();
        console.log("saturation", saturation)
    })

    /**
     * Save stuff
     */

    $('#save-button, .save-modal-close').click(() => {
        if(active) {
            $('#save-modal').toggle();
        } else {
            alert("Canvas is blank");
        }
    })

    $('.delete-button, .delete-button-close').click(() => {
        if(active) {
            $('#delete-modal').toggle();
        } else {
            alert("Canvas is blank");
        }
    })

    $('#delete-button-accept').click(() => {
        //clear canvas, reset other variables here too
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        reset();
        $('#delete-modal').toggle();
        $(".upload-button-container").show();
        active = false;
    })

    $('#save-button-accept').click(() => {
        //temporary scuffed as hell image saving

        //creating a temp canvas since main canvas has different dimensions 
        //and i don't want to f up the styling of the page by changing those dimensions
        let tempCanvas = document.createElement('canvas');
        tempCanvas.width = imageWidth;
        tempCanvas.height = imageHeight;

        let tempCtx = tempCanvas.getContext('2d');
        tempCtx.putImageData(draw(), 0, 0);

        //dataURL is the image
        let dataURL = tempCanvas.toDataURL("image/png");

        /**
         * TEMPORARY PROBABLY
         * create dummy anchor, dl image from there
         **/

        let da = document.createElement('a');
        da.href = dataURL;
        da.download = "gaming.png";
        da.click();

        $('#save-modal').toggle();
    });  
});





