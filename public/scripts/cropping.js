let cropping = false;
let cropX1, cropY1, cropX2, cropY2;

$(function() {
    $("#drawing-canvas").mousedown(function (e) {
        cropX1 = e.clientX - canvas.offsetLeft;
        cropY1 = e.clientY - canvas.offsetTop
    })
    
    $("#drawing-canvas").mouseup(function (e) {
        //for easier calculations, set x1,y1 to top left and x2,y2 to bottom right
        if(e.clientX - canvas.offsetLeft < cropX1) {
            cropX2 = cropX1;
            cropX1 = e.clientX - canvas.offsetLeft;
        } else {
            cropX2 = e.clientX - canvas.offsetLeft;
        } 
        if(e.clientY - canvas.offsetTop < cropY1) {
            cropY2 = cropY1;
            cropY1 = e.clientY - canvas.offsetTop;
        } else {
            cropY2 = e.clientY - canvas.offsetTop;
        } 
        if(cropping) crop();
    })
})

function crop() {
    let x1, x2, y1, y2;
    x1 = (cropX1 < canX ? 0 : cropX1 - canX);
    x2 = (cropX2 > canX + imageWidth ? imageWidth : cropX2 - canX)
    y1 = (cropY1 < canY ? 0 : cropY1 - canY)
    y2 = (cropY2 > canY + imageHeight ? imageHeight : cropY2 - canY)

    let newWidth = x2 - x1;
    let newHeight = y2 - y1;

    if(newWidth > 0 && newHeight > 0) {
        let ar = newWidth / newHeight;
        let oldWidth = imageWidth;
        let oldHeight = imageHeight;
        let oldCanX= canX; 
        let oldCanY = canY;

        imageHeight = canvas.height;
        imageWidth = parseInt(imageHeight * ar);

        if(imageWidth > canvas.width) {
            imageWidth = canvas.width;
            imageHeight = parseInt(imageWidth / ar);
        }

        canX = parseInt((canvas.width - imageWidth) / 2);
        canY = parseInt((canvas.height - imageHeight) / 2);
        
        let tempcan = document.createElement('canvas');
        let tempctx = tempcan.getContext('2d');
        tempcan.width = oldWidth;
        tempcan.height = oldHeight;
        tempctx.putImageData(ctx.getImageData(oldCanX, oldCanY, oldWidth, oldHeight), 0, 0);

        let tempimg = new Image(oldWidth, oldHeight);

        tempimg.src = tempcan.toDataURL();

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        tempimg.onload = function () {
            ctx.drawImage(tempimg, x1, y1, newWidth, newHeight, canX, canY, imageWidth, imageHeight)
            imageData = ctx.getImageData(canX, canY, imageWidth, imageHeight);
        }

        tempctx.clearRect(0, 0, tempcan.width, tempcan.height);
        tempctx.putImageData(drawing_ctx.getImageData(oldCanX, oldCanY, oldWidth, oldHeight), 0, 0);

        let tempDrawingImg = new Image(oldWidth, oldHeight);

        tempDrawingImg.src = tempcan.toDataURL();

        drawing_ctx.globalCompositeOperation = 'source-over';
        drawing_ctx.clearRect(0, 0, drawing_canvas.width, drawing_canvas.height);
        tempDrawingImg.onload = function () {
            drawing_ctx.drawImage(tempDrawingImg, x1, y1, newWidth, newHeight, canX, canY, imageWidth, imageHeight)
            snapshot();
        }

        cropping = false;
    }
}