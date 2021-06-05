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

var canvas = document.getElementById("photo-canvas");
var ctx = canvas.getContext('2d');

//Image width and height on canvas, not natural size
//canX canY are the locations of the image on the canvas, 0,0 being top left
var imageWidth, imageHeight, canX, canY;
var imageData;
var active = false;

function draw() {
    let pixelArray = imageData.data.map((x) => x);
    adjust(pixelArray)
    
    let tempImageData = new ImageData(pixelArray, imageWidth, imageHeight);
    ctx.putImageData(tempImageData, canX, canY);
    return tempImageData;
}

//reset form values
function reset() {
    $('#brightness-slider, #contrast-slider, #saturation-slider').val(50)
    $('#paint-slider, #eraser-slider').val(10)
    $('#color-picker').val('#000000');
    draw_color = '#000000';
    draw_width = 10;
    erase_width = 10;
    undoCache = [];
    redoCache = [];
}
reset();

$(function() {
    $('#upload-photo-button').change(function(e) {
        let imagefile = e.target.files[0];
        let fr = new FileReader();

        fr.readAsDataURL(imagefile);
        fr.onload = (e) => {
            let image = new Image();
            image.src = e.target.result;
            //Make sure image is loaded before using it
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
                    
                    //canX canY are offsets from the canvas, not canvas width / height
                    canX = parseInt((canvas.width - imageWidth) / 2);
                    canY = parseInt((canvas.height - imageHeight) / 2);

                    ctx.drawImage(image, canX, canY, imageWidth, imageHeight);
                    $(".upload-button-container").hide();
                    active = true;

                    imageData = ctx.getImageData(canX, canY, imageWidth, imageHeight);

                    snapshot();
                }
                catch(err) {
                    console.log(err);
                    alert("Error, file format not accepted")
                }
            }
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
                
                const ref = firebase.storage().ref();

                const title = document.getElementById("title-text-input").value;
                const author = document.getElementById("name-text-input").value;
                ref.child('pics/' + author + '-' + title).putString(final_image, 'data_url').then(function (e) {
                    console.log("uploaded data_url string");
                    $('.success-prompt').show();
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
                        $('#name-text-input, #desc-text-input, #title-text-input').val("");
                    })
                });
                
            }
        }
        
        $('#save-modal').toggle();
    });  
});



