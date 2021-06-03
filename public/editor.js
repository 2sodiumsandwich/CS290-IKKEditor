/**
 * We should probably separate this code into different files
 * and make it look pretty but since this is dev and I'm so insanely 
 * lazy and inefficient this will have to do for now at least i commented
 * some of the code
 */

 var canvas = document.getElementById("photo-canvas");
 var ctx = canvas.getContext('2d');
 
 var drawing_canvas = document.getElementById("drawing-canvas")
 var drawing_ctx = drawing_canvas.getContext('2d')
 //Image width and height on canvas, not natural size
 //canX canY are the locations of the image on the canvas, 0,0 being top left
 var imageWidth, imageHeight, canX, canY;
 var active = false;
 
 var imageData;
 
 // NEW CODEEEEEEEEEEE
 //NEW PAINT CODE
 
 let paint = false;
 let draw_color = "black";
 let draw_width = "10";
 let erase_width = "10";
 let is_drawing = false;
 let is_erasing = false;
 

 drawing_canvas.addEventListener("touchstart", start, false);
 drawing_canvas.addEventListener("touchmove", drawFunc, false);
 drawing_canvas.addEventListener("mousedown", start, false);
 drawing_canvas.addEventListener("mousemove", drawFunc, false);
 
 drawing_canvas.addEventListener("touchend", stop, false);
 drawing_canvas.addEventListener("mouseup", stop, false);
 drawing_canvas.addEventListener("mouseout", stop, false);
 
 let paint_array = [];
 let index = -1;

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
        

        // drawing_ctx.clearRect(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop, erase_width, erase_width)
     }else if (is_drawing && paint && active) {
         drawing_ctx.globalCompositeOperation = 'source-over'
         console.log("Drawing")
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
     }
     if( event.type != 'mouseout' ){
        paint_array.push(drawing_ctx.getImageData(0, 0, canvas.width, canvas.height));
        index += 1;
    }
     event.preventDefault();
 }

 //NEW CODE//
 
 //default values on page load
 var brightness = 0, contrast = 0, saturation = 1;
 
 // var sat_slider = document.getElementById("saturation-slider");
 // sat_slider.addEventListener("change", layerSaturation, false)
 
 
 function layerSaturation(pixelArray) {
     // RGB to HSL to RGB, look at documentation 
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
     
         var hue_prime = hue / 60
         var contrast2 = (1 - Math.abs(2*l-1)) * sat
         var x = contrast2 * (1 - Math.abs( hue_prime%2 - 1))
 
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
 
     let a = (259*(255 + contrast)) / (255*(259 - contrast)); //gain equation shamelessly stolen from the internet
     for(i = 0; i < pixelArray.length; i+=4) {
         pixelArray[i]   = a * (pixelArray[i] - 128) + 128 + brightness;
         pixelArray[i+1] = a * (pixelArray[i+1] - 128) + 128 + brightness;
         pixelArray[i+2] = a * (pixelArray[i+2] - 128) + 128 + brightness;
     }
     
     //Applies once a change is made in any slider
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
     $('#adjustment-tool-bar, #paint-tool-bar, #save-modal, #delete-modal, #decoration-tool-bar').draggable();
    
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
    
    $('#paint-button').click(() => {
        console.log("paint")
        paint = !paint;
        is_erasing = false;
        sticker_toggle = false;
    });
    
    $('#erase-button').click(() => {
        is_erasing = !is_erasing;
        paint = false;
        sticker_toggle = false;
    });
    
    $('#color-picker').on('change', function (e) {
        draw_color = $(this).val(); 
        console.log($(this).val());
    })
    
    $('#paint-slider').on('input', function (e) {
        draw_width = e.target.value == 0 ? 1 : e.target.value;
    })
    
    $('#eraser-slider').on('input', function (e) {
        erase_width = e.target.value;
    })
     /**
      * Adjustment stuff
      */
 
     $('#adjustment-toggle').click(() => {
         $('#adjustment-tool-bar').toggle();
     })

     $('#decoration-toggle').click(() => {
         $('#decoration-tool-bar').toggle();
         if (sticker_toggle == true){
             sticker_toggle = false
         }
     })
 
     
 
     $('#brightness-slider').on('input', function (e) {
         brightness = (e.target.value - 50)/50 * 128; //turns 0-100 val into an 8 bit val fo calclatodsnd
         saturation_toggle = false
         if(active) draw();
     })
 
     $('#contrast-slider').on('input', function (e) {
         contrast = (e.target.value - 50)/50 * 128; // same as abv
         saturation_toggle = false;
         if(active) draw();
     })

     //The change listeners are here for the sake of making draw more streamline, so saturation only applies once per change and doesn't freeze.
     $('#brightness-slider').on('change', function (e) {
        brightness = (e.target.value - 50)/50 * 128; //turns 0-100 val into an 8 bit val fo calclatodsnd
        saturation_toggle = true
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
         drawing_ctx.clearRect(0, 0, canvas.width, canvas.height);
         reset();
         $('#delete-modal').toggle();
         $(".upload-button-container").show();
         active = false;
     })

     $('#save-button-accept').click(() => {
         //temporary scuffed as hell image saving
 
         //creating a temp canvas since main canvas has different dimensions 
         //and i don't want to f up the styling of the page by changing those dimensions
         let tempCanvas1 = document.createElement('canvas');
         let tempCanvas2 = document.createElement('canvas');
         tempCanvas1.width = imageWidth;
         tempCanvas1.height = imageHeight;
         tempCanvas2.width = imageWidth;
         tempCanvas2.height = imageHeight;

        console.log("tempcanvas1", tempCanvas1);
        console.log("tempcanvas2", tempCanvas2);

         let tempCtx1 = tempCanvas1.getContext('2d');
         tempCtx1.putImageData(draw(), 0, 0);
         let tempCtx2 = tempCanvas2.getContext('2d');
         tempCtx2.putImageData(drawing_ctx.getImageData(canX, canY, canvas.width, canvas.height), 0, 0);

 
         //dataURL is the image
         let dataURL1 = tempCanvas1.toDataURL("image/png");
         let dataURL2 = tempCanvas2.toDataURL("image/png")
 
         /**
          * TEMPORARY PROBABLY
          * create dummy anchor, dl image from there
          **/
         //Goal is to merge the two images drawn on each canvas together.
         var imageObj1 = new Image();
         var imageObj2 = new Image();

         let tempCanvas3 = document.createElement('canvas');
         tempCanvas3.width = canvas.width;
         tempCanvas3.height = canvas.height;
         let tempCtx3 = tempCanvas3.getContext('2d')
         var final_image;

         console.log("dataURL:", dataURL1)
         imageObj1.src = dataURL1;
         //Both images are drawn on a canvas and the final canvas is saved as an image creating the merge effect
         imageObj1.onload = function() {
            tempCtx3.drawImage(imageObj1, canX, canY, imageWidth, imageHeight);
            imageObj2.src = dataURL2;
            imageObj2.onload = function () {
                tempCtx3.drawImage(imageObj2, canX, canY, imageWidth, imageHeight);
                final_image = tempCanvas3.toDataURL("image/png");
                
                let da = document.createElement('a');
                da.href = final_image
                da.download = "gaming.png";
                da.click();
            }
         }
    
         $('#save-modal').toggle();
     });  
 });
 