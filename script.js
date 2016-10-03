

var e = {}, // A container for DOM elements
    reader = new FileReader(),
    image = new Image(),
    ctxt = null, // For canvas' 2d context
    render = null, // For a function to render memes
    get = function(id) {
        // Short for document.getElementById()
        return document.getElementById(id);
    };
// Get elements (by id):
e.ifile = get("ifile");
e.box = get("box");
e.quote = get("quote");
e.author = get("author");
e.bc = get("backgroundColor"); //background color;
e.tc = get("TextColor");
e.downloadLink = get("downloadLink");

// canvas related variables
var canvas = document.getElementById("c");
var ctx = canvas.getContext("2d");

// Load basic color background on cavas:
window.onload = function() {
    canvas.width = Math.min(500, window.innerWidth - 20);
    canvas.height = Math.min(500, window.innerWidth - 20);
    canvas.style.background = 'white';
    image.src = canvas.toDataURL('image/png');
}

// variables used to get mouse position on the canvas
var $canvas = $("#c");
var canvasOffset = $canvas.offset();
var offsetX = canvasOffset.left;
var offsetY = canvasOffset.top;
var scrollX = $canvas.scrollLeft();
var scrollY = $canvas.scrollTop();

// variables to save last mouse position
// used to see how far the user dragged the mouse
// and then move the text by that distance
var startX;
var startY;

// an array to hold text objects
var texts = [];

// this var will hold the index of the hit-selected text
var selectedText = -2
var currentIndex = -2;

// clear the canvas & redraw all texts ============================


// test if x,y is inside the bounding box of texts[textIndex]
function textHittest(x, y, textIndex) {
    var text = texts[textIndex];
    return (x >= text.x &&
        x <= text.x + text.width &&
        y >= text.y - text.height &&
        y <= text.y);
}

// handle mousedown events
// iterate through texts[] and see if the user
// mousedown'ed on one of them
// If yes, set the selectedText to the index of that text
function handleMouseDown(e) {
    e.preventDefault();
    startX = parseInt(e.clientX - offsetX);
    //  console.log(startX);
    startY = parseInt(e.clientY - offsetY);
    //  console.log(startY);

    // Put your mousedown stuff here
    //  for (var i = 0; i < texts.length; i++) {
    //  if (textHittest(startX, startY, i)) {
    selectedText = currentIndex;
    // }
    // }
}

// done dragging
function handleMouseUp(e) {
    e.preventDefault();
    selectedText = -2;
}

// also done dragging
function handleMouseOut(e) {
    e.preventDefault();
    selectedText = -2;
}
// handle mousemove events
// calc how far the mouse has been dragged since
// the last mousemove event and move the selected text
// by that distance
function handleMouseMove(e) {

    if (selectedText < -1) { return; }
    e.preventDefault();
    mouseX = parseInt(e.clientX - offsetX);
    mouseY = parseInt(e.clientY - offsetY);

    // Put your mousemove stuff here
    var dx = mouseX - startX;
    var dy = mouseY - startY;
    startX = mouseX;
    startY = mouseY;

    var text = texts[selectedText];
    text.x += dx;
    text.y += dy;
    draw();


}

// listen for mouse events
$("#c").mousedown(function(e) { handleMouseDown(e); });
$("#c").mousemove(function(e) { handleMouseMove(e); });
$("#c").mouseup(function(e) { handleMouseUp(e); });
$("#c").mouseout(function(e) { handleMouseOut(e); });

var submitted = false;
$("#submit").click(function() {

    submitted = true;
    // calc the y coordinate for this text on the canvas
    var y = texts.length * 50 + 100;

    // if the text part is not empty, create a Text Object and store it in an array
    if ($("#theText").val().trim() != "") {
        var textSettings = { text: $("#theText").val(), x: 240, y: y, color: e.tc.value, fontSize: fontSize.value, strokeSize: 2, strokeColor: strokeColor.value };
        var text = new Text(textSettings);

        // calc the size of this text for hit-testing purposes
        //   text.width = ctx.measureText(text.text).width;
        //  text.height = 40;

        // put this new text in the texts array
        texts.push(text);

        // redraw everything
        draw();

        createLineButton(texts.length - 1, $("#theText").val(), function() {
            MarkCurrentButton();
        });
        theText.value = "";



    }

});

var lineButtons = [];

function createLineButton(textNumberInTextArray, textOnButton, callback) {
    var button = document.createElement("button");
    button.innerHTML = textOnButton.substring(0, 10); //Sets a limit for the button size
    button.setAttribute("id", "lineButton");

    // 2. Append somewhere
    var body = get("textObjectsArea");
    body.appendChild(button);

    // 3. Move the newest text immediately and push the new button to an array of buttons
    currentIndex = textNumberInTextArray;
    lineButtons.push(button);

    // 4. Add event handler
    button.addEventListener("click", function() {
        alert("Selected text number " + (textNumberInTextArray + 1));
        currentIndex = textNumberInTextArray

        MarkCurrentButton();

    });

    if (typeof callback === typeof Function)
        callback();
}

function MarkCurrentButton() {

    //Change text and background color of the button so you could know whats marked
    // Unmark the rest of the buttons
    for (var i = 0; i < lineButtons.length; i++) {
        if (i == currentIndex) {
            lineButtons[i].style.background = "#000000";
            lineButtons[i].style.color = "#ffffff";
        }
        else {
            lineButtons[i].style.background = "#ffffff";
            lineButtons[i].style.color = "#000000";
        }
    }

}

//Finished Text Dragging Here ======================================================

function DisplayText(line, x, y, fontSize) {
    for (; fontSize >= 0; fontSize -= 1) {
        ctx.font = "bold " + fontSize + "pt Impact, Charcoal, sans-serif";
        if (ctx.measureText(line).width < canvas.width - 10) {
            ctx.fillText(line, x, y);
            ctx.strokeText(line, x, y);
            break;
            //nothing
        }
    }
}

var theText = get('theText');
var fontSize = get('FontSize');
var strokeSize = get('strokeSize');
var strokeColor = get('strokeColor');

var textValue = $("#theText").val();
var previousBackgroundColor = "#".concat(e.tc.value);

function draw() {
    textValue = submitted ? "" : $("#theText").val();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#".concat(e.bc.value);
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fill();

    ctx.textAlign = "center";
    ctx.strokeStyle = "#".concat(strokeColor.value);
    ctx.lineWidth = Math.min(strokeSize.value, 10);
    ctx.fillStyle = "#".concat(e.tc.value);

    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    // Draw the text before approval
    DisplayText(textValue, canvas.width / 2, canvas.height / 10, fontSize.value);
    ctx.textBaseline = "top";

    for (var i = 0; i < texts.length; i++) {
        var text = texts[i];
        ctx.fillText(text.text, text.x, text.y);
        ctx.strokeText(text.text, text.x, text.y);
        
    }

    submitted = false;
    e.downloadLink.href = canvas.toDataURL("image/jpeg");
}



e.ifile.onchange = function() {
    //   isFirstImageChanged = true;
    console.log("file changed");
    image.src = "";
    reader.readAsDataURL(e.ifile.files[0]);
    reader.onload = function() {
        image.src = reader.result;
        image.onload = function() {
            draw();
            e.box.style.display = "";
            //   e.bc.value = "";
        };
    };
};

e.bc.addEventListener('change', draw, false);
e.tc.addEventListener('change', draw, false);
strokeColor.addEventListener('change', draw, false);

theText.onkeyup = draw;
fontSize.onkeyup = draw;
strokeSize.onkeyup = draw;
strokeColor.onkeyup = draw;
