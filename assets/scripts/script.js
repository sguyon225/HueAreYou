var hexcode = "#";
var invertHex = "#"
var rgb = [];
var invRGB = [];
var guesses = 0;

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
    console.log("invert rgb: "+invRGB);
}

// makes random number from 0 to 15 and returns it in base 16
function randomNumber(){
    let num=Math.floor((Math.random()*100)) % 16;
    if(num>9){
        num=num.toString(16).toUpperCase();
    }
    return num;
}

// Inverts the color
function invertColor(){
    invRGB = [255-rgb[0], 255-rgb[1], 255-rgb[2]];

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

// Sets the rgb boxes and submit button colors
function setColors(){
    // Sets RGB boxes their part of the Hexcode
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

    // Set the submit button text color to white if it's too dark
    let dark = 0;
    let veryDark = 0;
    let light = false;
    for(color in invRGB){
        if(invRGB[color]<100){  
            dark++;
        }else if(invRGB[color]<70){
            veryDark++;
        }else if(invRGB[color]>150){
            light=true;
        }
    }
    
    if (!light && dark>=2 || veryDark>2){
        document.getElementById("submit").style.color = "white";
    }
}

// Checks hexcode against input
function check(){
    let hexInputs = document.querySelectorAll(".digit");
    let code = "#"+Array.from(hexInputs).map(i => i.value).join('');
    if(code.length == 7){
        for(let i=1; i<7; i++){
            checkInput(code, i)
        }
        addHistory()
        if (code == hexcode){
            win()
        }
        guesses++;
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
        input.setAttribute("disabled", "true")
    }else if( Math.abs(distance) < 5){
        //If hex value is within 5
        input.classList.add("close");
        if(distance<0){
            // Above
            input.classList.add("up");
        }else{
            // Below
            input.classList.add("down");
        }
    }
}

// Makes Guess history
function addHistory(){
    let guess = document.getElementById("guess").children;
    let above = document.getElementById("above").children;
    let below = document.getElementById("below").children;
    for (let i=0; i<6; i++){
        let digit=guess[i+1].firstChild;
        console.log(above[i].textContent)
        if(digit.classList.contains("close")){
            // If new guess is closer
            if (digit.classList.contains("down")){
                let current = above[i].textContent;
                if(current=="" || parseInt(current, 16)>parseInt(digit.value, 16)){
                    above[i].textContent = digit.value;
                    above[i].classList.add("close")
                }
            }else{
                let current = below[i].textContent;
                if(current=="" || parseInt(current, 16)<parseInt(digit.value, 16)){
                    below[i].textContent = digit.value;
                    below[i].classList.add("close")
                }
            }
        }
        // If guess is correct
        else if(digit.classList.contains("correct")){
            try{above[i].classList.remove("close")}catch(e){}
            above[i].textContent = "";

            try{below[i].classList.remove("close")}catch(e){}
            below[i].textContent = "";
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
        red = parseInt(hexInputs[0].value+hexInputs[1].value, 16)+"";
    }
    if (hexInputs[2].value && hexInputs[3].value){
        green = parseInt(hexInputs[2].value+hexInputs[3].value, 16)+"";
    }
    if (hexInputs[4].value && hexInputs[5].value){
        blue = parseInt(hexInputs[4].value+hexInputs[5].value, 16)+"";
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

// Toggles menu
function toggleMenu(menu){
    menu.classList.toggle("active");
}

// Toggles the help menu
function helpMenu(){
    toggleMenu(document.getElementById("help"));
}

// Toggles the win game menu
function win(){
    let average = 0;
    let total = guesses;
    let games = 1;
    if(!localStorage.getItem("guesses")){
        localStorage.setItem("guesses",guesses);
        localStorage.setItem("gamesPlayed",games);
    }else{
        total = parseInt(localStorage.getItem("guesses"))+guesses;
        games = parseInt(localStorage.getItem("gamesPlayed"))+1;
        localStorage.setItem("guesses", total);
        localStorage.setItem("gamesPlayed", games);
    }
    average = total/games;

    let triesPlural = "guesses"
    let gamesPlural = "games"
    if(guesses==1){
        triesPlural = "guess"
    }
    if(games==1){
        gamesPlural = "game"
    }
    let guessNum = document.createTextNode("You solved the puzzle in "+guesses+" "+triesPlural+"!");
    let averages = document.createTextNode("You now have an average of "+Number(average.toFixed(2))+" guesses per game, over "+games+" "+gamesPlural+".");
    document.getElementById("guesses").appendChild(guessNum);
    
    document.getElementById("avg").appendChild(averages);

    makeWinMenu();

    toggleMenu(document.getElementById("win"));

    document.getElementById("game").style.display = "none";
    document.getElementById("helpButton").style.display = "none";
}

// Populates the win menu with correct answers
function makeWinMenu(){
    let hexGuess = document.getElementById("guess");
    let rgbGuess = document.getElementById("rgb");
    let menu = document.getElementById("answers");

    menu.appendChild(hexGuess);
    menu.appendChild(rgbGuess);
}

// Makes help menu close when clicking off of it or pressing escape
function setHelpMenu(){
    // Close help menu when clicking background
    
    let menu = document.getElementById("help");
    let isActive = false;
    let activationDelay = false;

    const observer = new MutationObserver(() => {
        if (menu.classList.contains('active')) {
            activationDelay = true;
            isActive = true;

            setTimeout(() => {
                activationDelay = false;
            }, 100);
        } else {
            isActive = false;
        }
    });

    observer.observe(menu, { attributes: true, attributeFilter: ['class'] });

    document.addEventListener('click', (e) => {
        const clickedOutside = !menu.contains(e.target);

        if (isActive && !activationDelay && clickedOutside) {
            toggleMenu(menu);
        }
    });

    document.addEventListener("keydown", (e) => {
        if (isActive && e.key === 'Escape') {
            toggleMenu(menu);
        }
    });
}

//Event listeners
document.addEventListener("DOMContentLoaded", function() {    
    const hexInputs = document.querySelectorAll(".digit");
    const rgbInputs = document.getElementById("rgb").childNodes;

    // Submission when pressing enter
    document.addEventListener("keypress", (e) => {
        if (e.key === 'Enter') {
            check()
            let selected = document.activeElement;
            selected.blur()
        }
    });
    
    // Event Listeners for the hexcode inputs
    hexInputs.forEach((input, index) => {
        // Input Cleaning
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

                let nextIndex = index + 1;
                while (nextIndex <= 5) {
                    let nextInput = hexInputs[nextIndex];
                    if (!nextInput.disabled && !nextInput.readOnly) {
                        nextInput.focus();
                        break;
                    }
                    nextIndex++;
                }
            }
            updateRGB(hexInputs, rgbInputs);
        });

        // Keys to move back and forth
        input.addEventListener("keydown", (e) => {
            if (e.key === "Backspace") {
                e.preventDefault();
                if (input.value) {
                    input.value = "";
                } else{
                    let prevIndex = index - 1;
                    while (prevIndex >= 0) {
                    let prevInput = hexInputs[prevIndex];
                    if (!prevInput.disabled) {
                        prevInput.focus();
                        prevInput.value = "";
                        break;
                    }
                    prevIndex--;
                }
                }
            }else if (e.key === "Delete") {
                e.preventDefault();
                if (input.value) {
                    input.value = "";
                } else{
                    let nextIndex = index + 1;
                    while (nextIndex <= 5) {
                        let nextInput = hexInputs[nextIndex];
                        if (!nextInput.disabled && !nextInput.readOnly) {
                            nextInput.focus();
                            nextInput.value = "";
                            break;
                        }
                        nextIndex++;
                    }
                }
            }else if (e.key === "ArrowLeft") {
                let prevIndex = index - 1;
                while (prevIndex >= 0) {
                    let prevInput = hexInputs[prevIndex];
                    if (!prevInput.disabled) {
                        prevInput.focus();
                        break;
                    }
                    prevIndex--;
                }
            }else if (e.key === "ArrowRight") {
                let nextIndex = index + 1;
                while (nextIndex <= 5) {
                    let nextInput = hexInputs[nextIndex];
                    if (!nextInput.disabled && !nextInput.readOnly) {
                        nextInput.focus();
                        break;
                    }
                    nextIndex++;
                }
            }

            updateRGB(hexInputs, rgbInputs);
        });

        // .focus to always select the value when filled box is entered
        input.addEventListener("focus", () => {
            setTimeout(() => input.setSelectionRange(0, input.value.length), 0);
        });
    });
    // Makes arrow keys function when no input is selected
    document.addEventListener("keydown", (e) => {
        if (e.key === "ArrowLeft") {
            const active = document.activeElement;
            const isHexInput = Array.from(hexInputs).includes(active);
    
            if (!isHexInput) {
                for (let i = hexInputs.length - 1; i >= 0; i--) {
                    if (!hexInputs[i].disabled && !hexInputs[i].readOnly) {
                        hexInputs[i].focus();
                        break;
                    }
                }
            }
        }else if (e.key === "ArrowRight") {
            const active = document.activeElement;
            const isHexInput = Array.from(hexInputs).includes(active);
    
            if (!isHexInput) {
                for (let i=0; i<=5; i++) {
                    if (!hexInputs[i].disabled && !hexInputs[i].readOnly) {
                        hexInputs[i].focus();
                        break;
                    }
                }
            }
        }
    });

    // Event Listeners for RGB Inputs
    rgbInputs.forEach((input) => {
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
    setColors();
    setHelpMenu();
}