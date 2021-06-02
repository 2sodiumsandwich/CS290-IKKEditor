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
var db = firebase.firestore();

var images = document.getElementsByClassName("image-button");
var storage = firebase.storage();
var listRef = storage.ref().child("pics");
var pictures = [];
var imagedata = [];

db.collection("photoStor").get().then((querySnapshot) => {
  querySnapshot.forEach((doc) => {
    imagedata.push(doc.data());
    //var gsReference = storage.refFromURL(imageurl);
  });

  for (var i = 0; i < images.length; i++) {
    images[i].addEventListener('click', function () {
      document.getElementById("show-up").style.display = "unset";
      document.getElementById("modal-backdrop").style.display = "unset";
    });
    console.log(querySnapshot);
    images[i].id = i;
    console.log(images[i].id);
  }
}).then(() => {
  imagedata.forEach((currentDoc, i) => {
    itemRef = storage.refFromURL(currentDoc.imageurl);
    itemRef.getDownloadURL().then((url) => {
      console.log(url);
      imagedata[i].image = url;
      var img = document.getElementById(i);
      img.setAttribute('src', url);
    })
  })
});

function closeModal() {
  document.getElementById("show-up").style.display = "none";
  document.getElementById("modal-backdrop").style.display = "none";

  document.getElementsByClassName("modal-button accept")[0].id = "none";
}

function downloadImage(id) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var downloadUrl = URL.createObjectURL(xhttp.response);
      var a = document.createElement("a");
      document.body.appendChild(a);
      a.style = "display: none";
      a.href = downloadUrl;
      a.download = imagedata[id].title;
      a.click();
    }
  };
  xhttp.open("GET", imagedata[id].image, true);
  xhttp.responseType = "blob";
  xhttp.send();
}

function openImage(id) {
  //print everything in imageurl[id]
  document.getElementById("author").innerHTML = imagedata[id].author;
  document.getElementById("title").innerHTML = imagedata[id].title;
  document.getElementById("description").innerHTML = imagedata[id].description;
  document.getElementById("image").setAttribute('src', imagedata[id].image);

  document.getElementsByClassName("modal-button accept")[0].id = id;
}