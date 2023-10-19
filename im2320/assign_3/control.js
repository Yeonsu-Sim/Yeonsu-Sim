/* SET INITIAL POSITION */
// bring balloon images
let movable = document.getElementsByClassName("movable");

let isDown = false;
let isBalloon = false;
let isCloud = false;
let isCake = false;
let x = 0;
let y = 0;
let obj;

/* SET INITIAL POSITION */

// set each balloon to initial position
for (let i=0; i<movable.length; i++) {
    let amount = 4+i*7;
    if (i < 13) {
        movable[i].style.left = `${amount}%`;
        movable[i].style.top = "10px"
    }
    movable[i].style.zIndex = i;
}

window.onmousedown = function(event) {
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
    if (isDown) {
        obj.style.left = event.clientX - x + "px";
        obj.style.top  = event.clientY - y + "px";
        obj.style.transition = null;
        return false;
    }
};

window.onmouseup = function(event) {
    isDown = false;
    if (isBalloon)
        goUp();
    else if (isCloud)
        up();
    else if (isCake)
        down();
};

function setXY(event) {
    isDown = true;
    x = event.offsetX;
    y = event.offsetY;
    obj = event.target;
}

function setZ() {
    let index = obj.style.zIndex;
    Array.from(movable).forEach(object => {
        let otherIndex = object.style.zIndex;
        if (otherIndex > index)
        object.style.zIndex = otherIndex-1;
    });
    obj.style.zIndex = movable.length-1;
}

function goUp() {
    let top = obj.style.top.slice(0,-2);
    let time = top*10;
    obj.style.transition = "top "+time+"ms ease";
    obj.style.top = "10px";
}

function up() {
    let top = obj.style.top.slice(0,-2);
    obj.style.transition = "top 1s ease";
    obj.style.top = top - 15 + "px";
}

function down() {
    let top = obj.style.top.slice(0,-2);
    let limit = Math.floor(window.innerHeight*0.35);
    let distance = limit - top;
    if (top < limit) {
        let time = distance*5;
        obj.style.transition = "top "+time+"ms ease-in";
        obj.style.top = limit+"px";
    }
}
