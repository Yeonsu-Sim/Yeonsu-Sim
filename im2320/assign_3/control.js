/* SET INITIAL POSITION */
// bring balloon images
let balloons = document.getElementsByClassName("balloon");

let isDown = false;
let x = 0;
let y = 0;
let obj;

/* SET INITIAL POSITION */

// set each balloon to initial position
for (let i=0; i<balloons.length; i++) {
    let amount = 4+i*7;
    balloons[i].style.left = `${amount}%`;
    balloons[i].style.zIndex = i;
}

window.onmousedown = function(event) {
    if (event.target.classList.contains('balloon')) {
      isDown = true;
      x = event.offsetX;
      y = event.offsetY;
      obj = event.target;
      setZ();
      return false;
    }
};

window.onmousemove = function(event) {
    if (isDown) {
        obj.style.left = event.clientX - x + 'px';
        obj.style.top  = event.clientY - y + 'px';
        obj.style.transition = null;
        return false;
    }
};

window.onmouseup = function(event) {
    isDown = false;
    goUp();
  };


function goUp() {
    let distance = obj.style.top.slice(0,-2);
    let time = distance*10;
    obj.style.transition = "top "+time+"ms ease";
    obj.style.top = "0px";
}

function setZ() {
    let index = obj.style.zIndex;
    Array.from(balloons).forEach(balloon => {
        let otherIndex = balloon.style.zIndex;
        if (otherIndex > index)
        balloon.style.zIndex = otherIndex-1;
    });
    obj.style.zIndex = balloons.length-1;
}
