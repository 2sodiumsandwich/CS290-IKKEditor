var brightness = 0, contrast = 0, saturation = 1;
var saturation_toggle = false;

function adjust(pixelArray) {
    //gain equation shamelessly stolen from the internet
    let a = (259*(255 + contrast)) / (255*(259 - contrast)); 
    for(i = 0; i < pixelArray.length; i+=4) {
        pixelArray[i]   = a * (pixelArray[i] - 128) + 128 + brightness;
        pixelArray[i+1] = a * (pixelArray[i+1] - 128) + 128 + brightness;
        pixelArray[i+2] = a * (pixelArray[i+2] - 128) + 128 + brightness;
    }

    //Applies once a change is made in any slider
    if (saturation_toggle == true){
        layerSaturation(pixelArray)
    }
}

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
