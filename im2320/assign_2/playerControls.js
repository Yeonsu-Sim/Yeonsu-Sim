/* DEFINITIONS & SETUP */

// first let's retrieve references to all the elements we'll need to use
// this is the audio itself
let audioElement = document.getElementById("audioElement");
const audioPlayerOverlay = document.getElementById("audioPlayOverlay");

// the elements for the background
const background = document.getElementById("background");
const blinder = document.getElementById("blinder");

// the buttons for the controls
const AUDIOCONTROLBUTTON = document.getElementsByClassName("audio-control-button");
const playButton = document.getElementById("playButton");
const forwardButton = document.getElementById("forwardButton");
const backwardButton = document.getElementById("backwardButton");
const loopButton = document.getElementById("loopButton");
const muteButton = document.getElementById("muteButton");
const nightShiftButton = document.getElementById("nightShiftButton");
const shuffleButton = document.getElementById("shuffleButton");

// the progress element
const progressBar = document.getElementById("progressBar");
// the color image
const colorImage = document.getElementById("colorImage");

// the music ball button elements
const redBall = document.getElementById("redBall");
const yellowBall = document.getElementById("yellowBall");
const greenBall = document.getElementById("greenBall");
const blueBall = document.getElementById("blueBall");

// initialize the audio control buttons set
loopButton.looped = "loops";
muteButton.muted = false;
muteButton.volume = 1;
nightShiftButton.light = "sun";
shuffleButton.shuffled = false;

// initialize the music ball buttons set
redBall.next = yellowBall;
yellowBall.next = greenBall;
greenBall.next = blueBall;
blueBall.next = redBall;
redBall.trackNumber = 1;
yellowBall.trackNumber = 2;
greenBall.trackNumber = 3;
blueBall.trackNumber = 4 ;

// define a 'musicBall' list contains all music ball
const musicBalls = [redBall, yellowBall, greenBall, blueBall];

// define a 'movement' list contains all movement of 'musicBalls' element
const movements = ["moveToFirst","moveToSecond","moveToThird","moveToFourth"];

// initialize list contains listed music balls
let trackList = [];
musicBalls.forEach(musicBall => {
  trackList.push(musicBall);
});

// start playing music album
console.log("Play Album");
let initial = true;  // flag of first playing for inhibiting to autoplay
playAlbum(trackList[0]);  // play music album's first track


/* PLAY ALBUM */

// modify visual things and trackList
function playAlbum(music) {

  // modify visual things of whole screen
  colorImage.src = music.dataset["img"];  // color image
  background.style.backgroundImage = music.dataset["gradient"];  // background image
  musicBalls.forEach(musicBall => {  // background image of progress value
    progressBar.classList.remove(musicBall.dataset["progress"]);
  });
  progressBar.classList.add(music.dataset["progress"]);
  progressBar.value = "0";

  for (let i = 0; i< AUDIOCONTROLBUTTON.length; i++)  // shadow color of audio buttons
    AUDIOCONTROLBUTTON[i].style.filter = "drop-shadow(0 0 0.5rem "+music.dataset["color"]+")";
  
  moveBalls();  // move balls's location to correct place
  
  audioElement.src="";  // remove previous audio source for prohibiting audio overlap
  newAudio(music);  // make new audio element
}

// make new audio element and add event listener on it
function newAudio(music) {

  // make new audio element of current track
  audioElement = new Audio(music.dataset["src"]);

  // remain previous audio control set
  if (muteButton.muted) {
    audioElement.muted = true;
  }
  audioElement.volume = muteButton.volume;

  // add 'timeupdate' event listener for updating current time of progress value
  audioElement.addEventListener('timeupdate', () => {
    progressBar.value = audioElement.currentTime;
  });

  // add 'loadedmetadata' event listener for auto-playing
  audioElement.addEventListener('loadedmetadata', () => {
    progressBar.setAttribute('max', audioElement.duration);  // set duration of progress bar
    
    // set timeout for auto-playing
    setTimeout(() => {
      if (initial)
        initial = false;  // prohibit auto-playing when it's the first time to play music album
      else {
        audioElement.play();  // auto-play
        playButton.style.backgroundImage = "url('./icons/pause.png')";
      }

      if (loopButton.looped == "end-no-loop"){
        audioElement.pause();  // prohibit auto-playing when it's end of track with no loop
        playButton.style.backgroundImage = "url('./icons/play.png')";
        loopButton.looped = "one-loop";  // change looped state to 'one-loop'
        loopButton.style.backgroundImage = "url('./icons/oneLoop.png')";
      }
    },1500);  // after 1.5 second
  });

  // add 'ended' event listener for updating track list and keep playing
  audioElement.addEventListener("ended", () => {
    playButton.style.backgroundImage = "url('./icons/play.png')";

    audioElement.src = "";  // remove previous audio source for prohibiting audio overlap
    if (loopButton.looped == "one-loop") {  // no track list updating
    } 
    // add tracks for making length of track list same as the number of music balls
    else if (loopButton.looped == "start-no-loop") {
      loopButton.looped = "in-no-loop";
      while (trackList.length != musicBalls.length) {
        trackList.push(trackList[(trackList.length)-1].next);
      }
      trackList.shift();
    }
    else if (loopButton.looped == "in-no-loop") {
      if (trackList.length > 1)
        trackList.shift();
      else {
        loopButton.looped = "end-no-loop";  // change looped state when it's last track
      }
    }
    else if (loopButton.looped == "loops") {
      while (trackList.length != musicBalls.length) {
        trackList.push(trackList[(trackList.length)-1].next);
      }
      // track list is a queue structure (first-in first-out)
      trackList.push(trackList[0]);  // infinite loop
      trackList.shift();  // remove played track
    }

    playAlbum(trackList[0]);  // playing next track

  });

} 

// move music ball buttons to correct place
function moveBalls() {
  let track = trackList[0];  // start with first track
  if (track.trackNumber != 0) {  // when audio is ended
    for (let i=0; i< musicBalls.length; i++) {
      track.classList.add(movements[i]);
      track.classList.remove(movements[track.trackNumber]);
      track.trackNumber = i;
      track = track.next;
    }
  }
  else {  // when audio is
    for (let i=1; i<musicBalls.length; i++) {
      track = track.next;
      track.classList.remove(movements[track.trackNumber]);
      track.classList.add(movements[i]);
      track.trackNumber = i;
    }
  }
}


/* AUDIO ELEMENT */

// next we remove the controls attribute - we do this with JS rather than just not including it in the HTML tag as a fallback
// this way if the JS doesn't load for whatever reason the player will have the default built in controls
audioElement.removeAttribute("controls");
// then if the default controls are removed we can show our custom controls - we want to do this via JS so that if the JS doesn't
// load then they won't show
document.getElementById("controlsWrapper").style.display = "flex";


/* MUSIC BALL */

// add 'click' event listener for changing track
redBall.addEventListener('click', () => {    
  if (trackList[0] == redBall)  // don't need to change track
    return;

  while (trackList[0] !== redBall) {  // remain track order
    if (trackList.length == 1)
      trackList = [redBall];
    else
      trackList.shift();
  }
  playAlbum(trackList[0]);  // auto play next track

});

yellowBall.addEventListener('click', () => {
  if (trackList[0] == yellowBall)
    return;


  while (trackList[0] !== yellowBall) {
    if (trackList.length == 1)
      trackList = [yellowBall];
    else
      trackList.shift();
  }
  playAlbum(trackList[0]);
  
});

greenBall.addEventListener('click', () => {
  if (trackList[0] == greenBall)
    return;


  while (trackList[0] !== greenBall) {
    if (trackList.length == 1)
      trackList = [greenBall];
    else
      trackList.shift();
  }
  playAlbum(trackList[0]);
  
});

blueBall.addEventListener('click', () => {
  if (trackList[0] == blueBall)
    return;


  while (trackList[0] !== blueBall) {
    if (trackList.length == 1)
      trackList = [blueBall];
    else
      trackList.shift();
  }
  playAlbum(trackList[0]);
  
});


/* COLOR IMAGE */
// change width of color image 100% / 45%
function fullScreen() {
  if (colorImage.style.width == "45%") {
    colorImage.style.width = "100%";
    colorImage.style.flex = "auto";  // fill full screen
    colorImage.style.filter = "drop-shadow(0 0 5rem "+trackList[0].dataset['color']+")";
}
  else {
    colorImage.style.width = "45%";
    colorImage.style.flex = "inherit";  // remain ratio of image
    colorImage.style.filter = "drop-shadow(10px 10px 10px rgba(0,0,0, 0.5))"
  }
}
// add 'click' event listener for full screen function
colorImage.addEventListener('click', fullScreen);


/* PLAY/PAUSE */

// play / pause audio element
function playPause(){

  if (audioElement.paused || audioElement.ended) {
    // if it isn't already playing make it play
    audioElement.play();
    // then make sure the icon on the button changes to pause indicating what it does if you click it
    playButton.style.backgroundImage = "url('./icons/pause.png')";
  } else {
    // if it is already playing make it pause
    audioElement.pause();
    // then make sure the icon on the button changes to play indicating what it does if you click it
    playButton.style.backgroundImage = "url('./icons/play.png')"; 
    }

}
// add 'click' event listener for play / pause function
playButton.addEventListener('click', playPause);


/* FORWARD/BACKWARD */

// move forward
function forward(second) {
  audioElement.currentTime += second;
}
// move backward
function backward(second) {
  audioElement.currentTime -= second;
}
// add 'click', 'keydown' event listener for forward function
forwardButton.addEventListener('click', () => { forward(5) });
forwardButton.addEventListener('keydown', (e) => {
  if (e.code == "ArrowRight")
    forward(5);
});
// add 'click', 'keydown' event listener for backward function
backwardButton.addEventListener('click', () => { backward(5) });
backwardButton.addEventListener('keydown', (e) => {
  if (e.code == "ArrowLeft")
    backward(5);
});


/* MUTE UNMUTE */

// change state of audio to mute / unmute
function muteUnmute() {
  if (audioElement.volume == 0){  // unmute when it's volume is 0
    audioElement.muted = false;
    audioElement.volume = 1;  // set volume level highest
    muteButton.muted = false;  // store data for keep unmuted state when track changed
    muteButton.style.backgroundImage = "url('./icons/mute.png')";
    muteButton.style.backgroundPosition = "0px";
  }
  else if (!audioElement.muted){
    audioElement.muted= true;
    muteButton.muted = true;  // store data for keep muted state when track changed
    muteButton.style.backgroundImage = "url('./icons/unmute.png')";
    muteButton.style.backgroundPosition = "-1.4px";  // just for both icon have same location
  }
  else { 
    audioElement.muted = false;
    muteButton.muted = false;  // store data for keep unmuted state when track changed
    muteButton.style.backgroundImage = "url('./icons/mute.png')";
    muteButton.style.backgroundPosition = "0px";
  }
}
// add 'click', 'keydown' event listener for mute / unmute function
muteButton.addEventListener('click', muteUnmute);
muteButton.addEventListener('keydown', (e) => {
  if (e.code == "KeyM")
    muteUnmute();
});


/* LOOP UNLOOP */

// change looped state for helping updating track list
function loopUnloop() {
  // when it's in looped state
  if (loopButton.looped == "loops") {
    loopButton.looped = "start-no-loop";
    loopButton.style.backgroundImage = "url('./icons/noLoop.png')";
  }
  // when it's in no-loop state
  else if (loopButton.looped == "start-no-loop" || loopButton.looped == "in-no-loop" || loopButton.looped == "end-no-loop") {
    loopButton.looped = "one-loop";
    loopButton.style.backgroundImage = "url('./icons/oneLoop.png')";
  }
  // when it's in one-loop state
  else {
    loopButton.looped = "loops";
    loopButton.style.backgroundImage = "url('./icons/loop.png')";
  }
}
// add 'click', 'keydown' event listener for loop / unloop function
loopButton.addEventListener('click', loopUnloop);
loopButton.addEventListener('keydown', (e) => {
  if (e.code == "KeyR")  // 'R'epeat
    loopUnloop();
});


/* VOLUME UP / DOWN */

// volume up (10 step)
function volumeUp() {
  if (audioElement.volume <= 0.9)
    audioElement.volume += 0.1;
  if (audioElement.volume != 0 && audioElement.muted)  // when it's volume is 0(muted)
    muteUnmute();
  muteButton.volume = audioElement.volume;
}
// volume down (10 step)
function volumeDown() {
  if (audioElement.volume >= 0.1)
    audioElement.volume -= 0.1;
  if (audioElement.volume < 0.1 && !audioElement.muted)  // when it's volume is not 0 (unmuted)
    muteUnmute();
  muteButton.volume = audioElement.volume;
  }
// volume up / down by scrolling
function volume(e) {
  if (e.target.id == "progressBar")  // prohibit function overlap
    return;
  // get the degree of mose wheel movement
  let scale = audioElement.volume + e.deltaY / 8 * 0.1;  // split level to 10 steps
  scale = clampZeroOne(scale);  // restrict scale (0~1)

  // when muted state needs to be changed
  if ((scale == 0 && !audioElement.muted) || (scale != 0 && audioElement.muted))
    muteUnmute();
  audioElement.volume = scale;
  muteButton.volume = audioElement.volume;  // store for keeping volume level when track changed
}


/* NIGHT SHIFT */

// shift background color fot darkening / brightening
function shiftLight() {
  if (nightShiftButton.light != "moon") {
    nightShiftButton.light = "moon";
    blinder.style.backgroundColor = "rgba(0,0,0,0.25";
    nightShiftButton.style.backgroundImage = "url('./icons/sun.png')";
  }
  else {
    nightShiftButton.light = "sun";
    blinder.style.backgroundColor = "transparent";
    nightShiftButton.style.backgroundImage = "url('./icons/moon.png')";
  }
}
// add 'click', 'keydown' event listener for night shift function
nightShiftButton.addEventListener('click', shiftLight);
nightShiftButton.addEventListener('keydown', (e) => {
  if (e.code == "KeyN")
    shiftLight();
});


/* SHUFFLE UNSHUFFLE */

// shuffle track list order
function shuffle() {
  if (!shuffleButton.shuffled) {
    shuffleButton.shuffled = true;
    shuffleButton.style.backgroundImage = "url('./icons/unshuffle.png')";

    let map = new Map();  // define a Map structure for mixing order of track list
    let track = trackList[0];  // start with first track
    trackList = [track];  // keep playing current track

    for (let i=0; i<musicBalls.length-1; i++) {  // mix order of rest of tracks
      let randInt = getRandomInt(100);  // make random int between 0 to 100
      while (map.has(randInt))  // not allow duplicate number
        randInt = getRandomInt(100);
  
      map.set(randInt, track.next);  // give random number to rest of tracks
      track = track.next;  // move to next track
    }
  
    track = trackList[0];  // reset to current track
    while (map.size != 0) {
      let biggest = -1;
      map.forEach((musicBall,num) => {
        biggest = Math.max(num,biggest);
      })
      track.next = map.get(biggest);  // track with bigger random number is played first
      track = track.next;  // update the order of track list
      map.delete(biggest);
    }
    track.next = trackList[0];  // update the next track of current track
  }
  else {
    shuffleButton.shuffled = false;
    shuffleButton.style.backgroundImage = "url('./icons/shuffle.png')";

    // reset track list to previous order
    redBall.next = yellowBall;
    yellowBall.next = greenBall;
    greenBall.next = blueBall;
    blueBall.next = redBall;
  }
  moveBalls();  // move balls to visualize shuffled / unshuffled result

}
// add 'click', 'keydown' event listener for shuffle / unshuffle function
shuffleButton.addEventListener('click', shuffle);
shuffleButton.addEventListener('keydown', (e) => {
  if (e.code == "KeyS")
    shuffle();
});


/* SHOURCUT */

// add 'keydown' event listener for shortcuting in whole window
window.addEventListener('keydown', (e) => {
  if (e.code == "Space") {  // prohibit function overlap
    if (e.target.id == "playButton" || e.target.id == "forwardButton" || e.target.id == "backwardButton" || 
        e.target.id == "muteButton" || e.target.id == "loopButton" || e.target.id == "shuffleButton" || 
        e.target.id == "nightShiftButton")
      return;
    else
      playPause();
  }
  else if (e.code == "KeyK")
    playPause();
  else if (e.code == "ArrowRight")
    forward(5);
  else if (e.code == "KeyL")
    forward(10);
  else if (e.code == "ArrowLeft")
    backward(5);
  else if (e.code == "KeyJ")
    backward(10);
  else if (e.code == "KeyM")
    muteUnmute();
  else if (e.code == "KeyR")
    loopUnloop();
  else if (e.code == "ArrowUp")
    volumeUp();
  else if (e.code == "ArrowDown")
    volumeDown();
  else if (e.code == "KeyF")
    fullScreen();
  else if (e.code == "KeyN")
    shiftLight();
  else if (e.code == "KeyS")
    shuffle();
});
window.onwheel = (e) => {
  volume(e);
};


/* TIMELINE */

// update current time of audio by mouse click
function scrubToTime(e){
  // get the degree of horizontal mouse movement
  let x = e.clientX - (progressBar.getBoundingClientRect().left + window.scrollX);
  // update current time
  audioElement.currentTime = clampZeroOne(x / progressBar.offsetWidth) * audioElement.duration;
}
// add 'mousedown' event listener for scrub to time function
progressBar.addEventListener('mousedown', scrubToTime);
progressBar.addEventListener('mousedown', (e) => {
  // event when the mouse click is released
  window.addEventListener('mousemove', scrubToTime);
  window.addEventListener('mouseup', () => {
    window.removeEventListener('mousemove', scrubToTime);
  });
});
// update current time of audio by mouse wheel
function slideToTime(e) {
  // get the degreee of mouse wheel movement
  let scale = audioElement.currentTime + e.deltaY / 8 * 0.1; 
  // Restrict scale between 0 to duration of audio
  audioElement.currentTime = clampZeroX(audioElement.duration, scale);
}
// add 'wheel' event listener for slide to time function
progressBar.addEventListener('wheel',slideToTime);


/* HELPER FUNCTIONS */

// get random int between 0 to input
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
// restrick input between 0 to 1
function clampZeroOne(input){
  return Math.min(Math.max(input, 0), 1);
}
// restrick second input between 0 to first input
function clampZeroX(x, input){
  return Math.min(Math.max(input, 0), x);
}
