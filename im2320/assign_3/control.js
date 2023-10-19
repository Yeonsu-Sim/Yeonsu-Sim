/* SET INITIAL POSITION */
// bring balloon images
let balloons = document.getElementsByClassName("balloon");

/* SET INITIAL POSITION */

// set each balloon to initial position
for (let i=0; i<balloons.length; i++) {
    let amount = 4+i*7;
    balloons[i].style.left = `${amount}%`;
    balloons[i].style.zIndex = i;
}

Array.from(balloons).forEach(balloon => {
    balloon.addEventListener('click', setZ);
    balloon.addEventListener('dragstart', setZ);
    balloon.addEventListener('drag', e => setXY(balloon, e));
    balloon.addEventListener('dragend', goUp);
});

function setXY(balloon, e) {
    let x = e.clientX;
    let y = e.clientY;
    if (x==0 && y==0)
        return;

    balloon.style.left = `${x}px`
    balloon.style.top = `${y}px`;
    balloon.style.transition = null;
}

function goUp() {
    let distance = this.style.top.slice(0,-2);
    let time = distance*10;
    this.style.transition = "top "+time+"ms ease";
    this.style.top = "0px";
}

function setZ() {
    let index = this.style.zIndex;
    Array.from(balloons).forEach(balloon => {
        let otherIndex = balloon.style.zIndex;
        if (otherIndex > index)
        balloon.style.zIndex = otherIndex-1;
    });
    this.style.zIndex = balloons.length-1;
}
