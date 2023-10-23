/* SET GLOBAL VARIABLE */

// bring movable images
let movable = document.getElementsByClassName("movable");
// flags
let isDown = false;
let isBalloon = false;
let isCloud = false;
let isCake = false;
// target informations
let x = 0;
let y = 0;
let obj;

/* SET INITIAL POSITION */

// set each balloon to initial position
for (let i=0; i<movable.length; i++) {
    let amount = 4+i*7;
    if (i < 13) {  // only balloon is setted regularly
        movable[i].style.left = `${amount}%`;
        movable[i].style.top = "10px"
    }
    movable[i].style.zIndex = i;  // set initial z-index
}

window.onmousedown = function(event) {
    // distinguish which image is selected when user press mouse
    if (event.target.classList.contains("balloon")) {
        isBalloon = true;
        isCloud = false;
        isCake = false;
        setXY(event);
        setZ();
        return false;
    }
    else if (event.target.classList.contains("cloud")) {
        isBalloon = false;
        isCloud = true;
        isCake = false;
        setXY(event);
        setZ();
        return false;

    } else if (event.target.classList.contains("cake")) {
        isBalloon = false;
        isCloud = false;
        isCake = true;
        setXY(event);
        setZ();
        return false;
    }
};

window.onmousemove = function(event) {
    if (isDown) {  // refresh target's location by using offset coordination
        obj.style.transition = null;  // remove transition when user want to drag
        obj.style.left = event.clientX - x + "px";
        obj.style.top  = event.clientY - y + "px";
        return false;
    }
};

window.onmouseup = function(event) {
    isDown = false;
    if (isBalloon)
        goUp();  // fly into the sky
    else if (isCloud)
        up();  // to differentiate visual effect
    else if (isCake)
        down();  // fall into the ground
};

// store offset coordination and target
function setXY(event) {
    isDown = true;
    x = event.offsetX;
    y = event.offsetY;
    obj = event.target;
}

// set z-index by clicked order
function setZ() {
    let index = obj.style.zIndex;  // original index of target
    // update removable image's z-index which upper than current target
    Array.from(movable).forEach(object => {
        let otherIndex = object.style.zIndex;
        if (otherIndex > index)
        object.style.zIndex = otherIndex-1;
    });
    obj.style.zIndex = movable.length-1;  // update z-index of target
}

// fly into the sky
function goUp() {
    let top = obj.style.top.slice(0,-2);
    // to make consistent time
    let time = top*10;
    obj.style.transition = "top "+time+"ms ease";
    obj.style.top = "10px";  // end of the sky
}

// float up
function up() {
    let top = obj.style.top.slice(0,-2);
    obj.style.transition = "top 1s ease";
    obj.style.top = top - 15 + "px";
}

// fall into the ground
function down() {
    let top = obj.style.top.slice(0,-2);
    let height = window.innerWidth*0.115;
    let flat = window.innerHeight*0.7 - height;
    let distance = flat - top - height;
    let time = distance*5;

    if (distance > 0) {  // only when target is not on the ground
        // to make consistent time
        obj.style.transition = "top "+time+"ms ease-in";
        obj.style.top = flat-height+"px";
    }
}
