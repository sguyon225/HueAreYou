var hexcode = "#";
var invertHex = "#"
var rgb = [];
var invertRGB = [];

// Makes a new color and sets it to the background color
function newColor(){
    for(let i=0;i<6;i++){
        hexcode=hexcode+randomNumber();
    }            
    document.getElementById("body").style.backgroundColor = hexcode;

    hexToRGB();
    invertColor(); 

    console.log("hex: "+hexcode);
    console.log("invert hex: "+invertHex);
    console.log("rgb: "+rgb);
}

// Inverts the color
function invertColor(){
    let invRGB = [255-rgb[0], 255-rgb[1], 255-rgb[2]];

    invertHex = "#"+invRGB[0].toString(16).padStart(2, '0')+invRGB[1].toString(16).padStart(2, '0')+invRGB[2].toString(16).padStart(2, '0');
    document.getElementsByClassName("text")[0].style.color = invertHex;
    document.getElementById("submit").style.backgroundColor = invertHex;
}

// Converts from hexcode to RGB values
function hexToRGB(){
    let hexArr = hexcode.split("");

    let redHex = (hexArr[1]+hexArr[2]);
    let red = parseInt(redHex, 16);

    let greenHex = (hexArr[3]+hexArr[4]);
    let green = parseInt(greenHex, 16);
    
    let blueHex = (hexArr[5]+hexArr[6]);
    let blue = parseInt(blueHex, 16);

    rgb = [red, green, blue];
}

// Sets the rgb boxes' background color to their part of the hexcode
function setRGB(){
    let hexArr = hexcode.split("");
    document.getElementById("red").style.backgroundColor = "#"+hexArr[1]+hexArr[2]+"0000";
    document.getElementById("green").style.backgroundColor = "#00"+hexArr[3]+hexArr[4]+"00";
    document.getElementById("blue").style.backgroundColor = "#0000"+hexArr[5]+hexArr[6];

    // If background color is too dark, set text to white
    if(rgb[0]<127.5){
        document.getElementById("red").style.color = "white";
    }
    if(rgb[1]<127.5){
        document.getElementById("green").style.color = "white";
    }
    if(rgb[2]<127.5){
        document.getElementById("blue").style.color = "white";
    }
}

// makes random number from 0 to 15 and returns it in hexcode
function randomNumber(){
    let num=Math.floor((Math.random()*100)) % 16;
    if(num>9){
        num=num.toString(16).toUpperCase();
    }
    return num;
}

// Checks hexcode against input
function check(code){
    console.log("check: "+hexcode+" = "+code)
    for(let i=1; i<7; i++){
        checkInput(code, i)
    }
}

// Checks the input against the correct answer, changes input's color based on result.
function checkInput(code, index){
    code = code.split("");
    let hex = hexcode.split("");
    let hexInputs = document.querySelectorAll(".digit");
    let distance = parseInt(code[index], 16)-parseInt(hex[index], 16);
    let input = hexInputs[index-1];

    // Remove any previous colors
    try{input.classList.remove("down")}catch{}
    try{input.classList.remove("up")}catch{}
    try{input.classList.remove("close")}catch{}

    // Set Placeholder value to previous guess
    input.placeholder=code[index];

    // Validate guess
    if(code[index] == hexcode[index]){
        // If hex value is correct
        input.classList.add("correct");
    }else if( Math.abs(distance) < 5){
        //If hex value is within 5
        input.classList.add("close");
        if(distance<0){
            // Above
            input.classList.add("up");
            console.log(distance);
        }else{
            // Below
            input.classList.add("down");
        }
    }
}

// Updates the RGB values when Hexcode is inputted
function updateRGB(hexInputs, rgbInputs){
    let red="";
    let green="";
    let blue="";

    // Make sure both hex digits are there, parses the hex into decimal
    if (hexInputs[0].value!="" && hexInputs[1].value!=""){
        red = parseInt(hexInputs[0].value+hexInputs[1].value, 16);
    }
    if (hexInputs[2].value && hexInputs[3].value){
        green = parseInt(hexInputs[3].value+hexInputs[2].value, 16);
    }
    if (hexInputs[4].value && hexInputs[5].value){
        blue = parseInt(hexInputs[4].value+hexInputs[5].value, 16);
    }
    // Inputs the updated hex value into the corresponding RGB box 
    if(red!=""){
        if(red == "NaN"){
            red = ""
        }
        rgbInputs[1].value = red;
    }else{
        rgbInputs[1].value = "";
    }
    if(green!=""){
        if(green == "NaN"){
            green = ""
        }
        rgbInputs[3].value = green;
    }else{
        rgbInputs[3].value = "";
    }
    if(blue!=""){
        if(blue == "NaN"){
            blue = ""
        }
        rgbInputs[5].value = blue;
    }else{
        rgbInputs[5].value = "";
    }
}
// Toggles help menu
function helpMenu(){
    document.getElementById("help").classList.toggle("active");
}

//Event listeners
document.addEventListener("DOMContentLoaded", function() {    
    const hexInputs = document.querySelectorAll(".digit");
    const rgbInputs = document.getElementById("rgb").childNodes;

    // Submission with enter
    document.addEventListener("keypress", (e) => {
        if (e.key === 'Enter') {
            let code = "#"+Array.from(hexInputs).map(i => i.value).join('');
            if(code.length == 7){
                check(code);
            }
        }
    });
    
    // Event Listeners for the hexcode inputs
    hexInputs.forEach((input, index) => {
        // Input Cleaning - Makes sure you can only input valid characters
        input.addEventListener("beforeinput", (e) => {
            const value = e.data?.toUpperCase();
            if (e.inputType === "insertText" && !/^[A-F0-9]$/.test(value)) {
                e.preventDefault();
            }
        });
        // Validates the input and updates the RGB boxes at the bottom
        input.addEventListener("input", (e) => {
            // Input validation
            const value = e.target.value.toUpperCase().replace(/[^A-F0-9]/g, "");
            if (value) {
                e.target.value = value;

                if (index < hexInputs.length - 1) {
                    hexInputs[index + 1].focus();
                }
            }
            updateRGB(hexInputs, rgbInputs);
        });

        // Backspace
        input.addEventListener("keydown", (e) => {
            if (e.key === "Backspace") {
                e.preventDefault();
                if (input.value) {
                    input.value = "";
                } else if (index > 0) {
                    hexInputs[index - 1].focus();
                    hexInputs[index - 1].value = "";
                }
            }
            updateRGB(hexInputs, rgbInputs);
        });

        // Delete
        input.addEventListener("keydown", (e) => {
            if (e.key === "Delete") {
                e.preventDefault();
                if (input.value) {
                    input.value = "";
                } else if (index < 5) {
                    hexInputs[index + 1].focus();
                    hexInputs[index + 1].value = "";
                }
            }
            updateRGB(hexInputs, rgbInputs);
        });

        // Left Arrow
        input.addEventListener("keydown", (e) => {
            if (e.key === "ArrowLeft" && index > 0) {
                hexInputs[index - 1].focus();
            }
        });

        // Right Arrow
        input.addEventListener("keydown", (e) => {
            if (e.key === "ArrowRight" && index < 5) {
                hexInputs[index + 1].focus();
            }
        });

        // .focus to select value when filled box is entered
        input.addEventListener("focus", () => {
            setTimeout(() => input.setSelectionRange(0, 1), 0);
        });
    });

    // Event Listeners for RGB Inputs
    rgbInputs.forEach((input, index) =>{
        // Validates input to be just numbers
        input.addEventListener("input", (e) => {
            e.target.value = e.target.value.replace(/\D/, "");
            
            let popup = document.getElementById("popup");
            let color = input.classList[0]
            let colorPop = document.getElementsByClassName(color)[1];

            // Popup "too big" warning if value > 255
            if(input.value>255){
                console.log(colorPop)
                colorPop.classList.add("show");
            }else{
                colorPop.classList.remove("show");
            }
            // Convert input to hexcode. If input is empty, don't display NaN
            let val = parseInt(input.value).toString(16).padStart(2, '0').toUpperCase()
            if(val == "NAN"){
                val = "  ";
            }
            val = val.split("");

            // Update Hexcode inputs based on rgb inputs
            if(color == "red"){
                hexInputs[0].value = val[0];
                hexInputs[1].value = val[1];
            }else if(color == "green"){
                hexInputs[2].value = val[0];
                hexInputs[3].value = val[1];
            }else if(color == "blue"){
                hexInputs[4].value = val[0];
                hexInputs[5].value = val[1];
            }
        });
    })

    start()
});

// Starts the site generation process
function start(){
    newColor();
    setRGB();
}