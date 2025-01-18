/**
 * This section based on this StackOverflow answer: https://stackoverflow.com/a/63560582
 * Modifications were made to properly escape out the HTML markup
 * This is where the XMLSerializer comes into play
 * After the image is created, it replaces the source in the hidden element for download
 */
window.addEventListener("load", doit, false);
window.addEventListener("keyup", updateTxt,false);
var canvas;
var ctx;
var tempImg;

function doit() {
    let previewDiv = document.getElementById('previewImage');
    let serializer = new XMLSerializer();
    let source = document.getElementById('mgs-codec');
    let style = document.getElementsByTagName('style');

    canvas = document.createElement('canvas');
    ctx = canvas.getContext('2d');

    ctx.clearRect(0,0, canvas.width, canvas.height);

    canvas.width=700;
    canvas.height=480;

    tempImg = new Image();

    tempImg.src = 'data:image/svg+xml,' + encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="700" height="480">
        <style type="text/css">${style.item(0).innerText}</style>
            <foreignObject style="width:700px;height:480px;">
            ${serializer.serializeToString(source)}
            </foreignObject>
        </svg>
    `);

    tempImg.hidden = true;

    if(previewDiv.hasChildNodes()){
        previewDiv.replaceChildren(tempImg);
    } else{
        previewDiv.appendChild(tempImg);
    }
}

function saveAsPng(){
    ctx.drawImage(tempImg, 0, 0);
    var a  = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = uuidv4() + '.png';
    a.click();
}

/**
 * Credits to akinuri for the base code to convert image to base64
 * https://github.com/akinuri/image-to-base64
 */

let leftImg = $('#left-input');
let rightImg = $('#right-input');

function leftBtn_Click(){
    document.getElementById('left-input').click();
}

function rightBtn_Click(){
    document.getElementById('right-input').click();
}

leftImg.change(function(){
    if(this.files.length){
        convertImgToBase64(this.files[0], (base64) => {
            let img = document.getElementById('actor1');
            img.src = base64;
            doit();
        });
    }
});

rightImg.change(function(){
    if(this.files.length){
        convertImgToBase64(this.files[0], (base64) => {
            let img = document.getElementById('actor2');
            img.src = base64;
            doit();
        });
    }
});

function updateTxt(){
    let textInput = document.getElementById('codecTxt');
    let codecInput = document.getElementById('callTxt');
    let val = textInput.value.toString();
    if(val !== ''){
        codecInput.innerHTML = `<p>${textInput.value}</p>`
    }
}

function convertImgToBase64(file, callback){
    let reader = new FileReader();
    reader.onloadend = function () {
        callback(reader.result);
    };
    reader.readAsDataURL(file);
}

function uuidv4() {
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
      (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
    );
}