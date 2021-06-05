//How many undo actions are saved
const CACHE_SIZE = 20;

let undoCache = [];
let redoCache = [];
let snapshotToggle = true;

function snapshot() {
    if(undoCache.length > 0) redoCache = [];
    //need to store adjustment values, paint array, main canvas
    undoCache.push({
        "imageData": imageData,
        "drawingArray": drawing_ctx.getImageData(0, 0, canvas.width, canvas.height).data.map((x) => x),
        "canW": canX,
        "canH": canY,
        "imgW": imageWidth,
        "imgH": imageHeight,
        "sat": saturation,
        "cont": contrast,
        "bright": brightness
    })

    //if undoCache is above a certain size, delete oldest entry
    if(undoCache.length > CACHE_SIZE) {
        undoCache.shift();
    }
}

function undo() {
    if(undoCache.length > 1) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        redoCache.push(undoCache.pop());
        let undoData = undoCache[undoCache.length - 1];

        canX = undoData.canW;
        canY = undoData.canH;
        imageHeight = undoData.imgH;
        imageWidth = undoData.imgW;

        saturation = undoData.sat;
        contrast = undoData.cont;
        brightness = undoData.bright;
        
        $('#brightness-slider').val((brightness/128) * 50 + 50);
        $('#contrast-slider').val((contrast/128) * 50 + 50);
        $('#saturation-slider').val(saturation * 50);

        saturation_toggle = true;

        imageData = undoData.imageData;

        let tempImg = new ImageData(undoData.drawingArray, canvas.width, canvas.height)
        drawing_ctx.putImageData(tempImg, 0, 0);

        if(undoCache.length == 0) snapshot();
        draw();
    } else {
        snapshot();
    }
}

function redo() {
    if(redoCache.length > 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let redoData = redoCache.pop();

        canX = redoData.canW;
        canY = redoData.canH;
        imageHeight = redoData.imgH;
        imageWidth = redoData.imgW;

        saturation = redoData.sat;
        contrast = redoData.cont;
        brightness = redoData.bright;
        
        $('#brightness-slider').val((brightness/128) * 50 + 50);
        $('#contrast-slider').val((contrast/128) * 50 + 50);
        $('#saturation-slider').val(saturation * 50);

        saturation_toggle = true;

        imageData = redoData.imageData;

        let tempImg = new ImageData(redoData.drawingArray, canvas.width, canvas.height)
        drawing_ctx.putImageData(tempImg, 0, 0);

        undoCache.push(redoData);
        draw();
    } 
}