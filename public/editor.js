//required for our database
console.log(firebase);
var firebaseConfig = {
    apiKey: "AIzaSyD8dBeEkJ_T9MXoobgEJYLDYnxtTJ7N3K0",
    authDomain: "cs290-ikkeditor.firebaseapp.com",
    projectId: "cs290-ikkeditor",
    storageBucket: "cs290-ikkeditor.appspot.com",
    messagingSenderId: "1091468535905",
    appId: "1:1091468535905:web:8d1ee2b54193b3f362e220"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
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

//default values on page load
var brightness = 0, contrast = 0, saturation = 1;

function layerSaturation(pixelArray) {
    //no.
}

//applies the bcs filters on top of the image woo
function draw() {
    let pixelArray = imageData.data.map((x) => x);

    let a = (259 * (255 + contrast)) / (255 * (259 - contrast)); //gain equation shamelessly stolen from the internet
    for (i = 0; i < pixelArray.length; i += 4) {
        pixelArray[i] = a * (pixelArray[i] - 128) + 128 + brightness;
        pixelArray[i + 1] = a * (pixelArray[i + 1] - 128) + 128 + brightness;
        pixelArray[i + 2] = a * (pixelArray[i + 2] - 128) + 128 + brightness;
    }


    layerSaturation(pixelArray);

    let tempImageData = new ImageData(pixelArray, imageWidth, imageHeight);

    ctx.putImageData(tempImageData, canX, canY);
    return tempImageData;
}

//reset form values
function reset() {
    $('#brightness-slider, #contrast-slider, #saturation-slider').val(50)
}
reset();

$(function () {
    //draggable() from jquery UI lib, makes things draggable.
    //TODO make stuff not draggable off screen
    $('#adjustment-tool-bar, #paint-tool-bar, #save-modal, #delete-modal').draggable();

    $('#upload-photo-button').change(function (e) {
        let imagefile = e.target.files[0];
        let fr = new FileReader();

        fr.readAsDataURL(imagefile);
        fr.onloadend = (e) => {
            let image = new Image();
            image.src = e.target.result;
            //make sure image is loaded b4 using it
            image.onloadend = function () {
                try {
                    //Scale image to canvas size, maintaining aspect ratio
                    let ar = image.width / image.height;

                    imageHeight = canvas.height;
                    imageWidth = parseInt(imageHeight * ar);

                    if (imageWidth > canvas.width) {
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
                catch (err) {
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
        brightness = (e.target.value - 50) / 50 * 128; //turns 0-100 val into an 8 bit val fo calclatodsnd
        if (active) draw();
    })

    $('#contrast-slider').on('input', function (e) {
        contrast = (e.target.value - 50) / 50 * 128; // same as abv
        if (active) draw();
    })

    $('#saturation-slider').on('input', function (e) {
        saturation = (e.target.value / 50); //sat is on a scale of 0-2, 1 being default
        if (active) draw();
    })

    /**
     * Save stuff
     */

    $('#save-button, .save-modal-close').click(() => {
        if (active) {
            $('#save-modal').toggle();
        } else {
            alert("Canvas is blank");
        }
    })

    $('.delete-button, .delete-button-close').click(() => {
        if (active) {
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

        //image.src is the image
        var image = new Image();
        image.id = "pic";
        image.src = tempCanvas.toDataURL();
        const ref = firebase.storage().ref();

        const title = document.getElementById("title-text-input").value;
        const author = document.getElementById("name-text-input").value;
        ref.child('pics/' + author + '-' + title).putString(image.src, 'data_url').then(function (snapshot) {
            console.log("uploaded data_url string");
            alert("image uploaded");
        }).then(() => {
            ref.child('pics/' + author + '-' + title).getDownloadURL().then((urllink) => {
                var db = firebase.firestore();
                db.collection("photoStor").add({
                    author: document.getElementById("name-text-input").value,
                    description: document.getElementById("desc-text-input").value,
                    imageurl: urllink,
                    title: document.getElementById("title-text-input").value
                }).then((docRef) => {
                    console.log("Document written with ID: ", docRef.id);
                })
            })
        });
        
        //  let da = document.createElement('a');
        //  da.href = dataURL;
        //  da.download = "gaming.png";
        //  da.click();

        $('#save-modal').toggle();
    });
});