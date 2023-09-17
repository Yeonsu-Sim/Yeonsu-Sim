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

/* modify visual things and trackList */
function playAlbum(music) {

  /* modify visual things of whole screen */
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

/* make new audio element and add event listener on it*/
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

function moveBalls() {
  let track = trackList[0];
  if (track.trackNumber != 0) {
    for (let i=0; i< musicBalls.length; i++) {
      track.classList.add(movements[i]);
      track.classList.remove(movements[track.trackNumber]);
      track.trackNumber = i;
      track = track.next;
    }
  }
  else {
    for (let i=1; i<musicBalls.length; i++) {
      track = track.next;
      track.classList.remove(movements[track.trackNumber]);
      track.classList.add(movements[i]);
      track.trackNumber = i;
    }
  }
}


// next we remove the controls attribute - we do this with JS rather than just not including it in the HTML tag as a fallback
// this way if the JS doesn't load for whatever reason the player will have the default built in controls
audioElement.removeAttribute("controls");
// then if the default controls are removed we can show our custom controls - we want to do this via JS so that if the JS doesn't
// load then they won't show
document.getElementById("controlsWrapper").style.display = "flex";

// // then we listen for the loadedmetadata event to fire which means we'll be able to access exactly how long the piece of media is
// // i'm using an arrow function here that updates the progress element's max attribute with the duration of the media
// // this way when it comes to setting the progress bars value the number matches a percentage of the total duration
// // audioElement.addEventListener('loadedmetadata', () => {
// //   progressBar.setAttribute('max', audioElement.duration);
// // });

// // some mobile devices won't fire a loadedmetadata event so we need a fallback to make sure the attribute is set in these cases - we 
// // can do this by also running a check whenever playback starts by using the playing event
// audioElement.addEventListener("playing", () => {
//   // we can then double check if the attribute has already been set - if not then set it here - ! inside of an if statement flips the 
//   // truth of what we're checking for - so (progressBar.getAttribute('max')) would check if there's a value and 
//   // (!progressBar.getAttribute('max')) checks if there is no value - ie false
//   if (!progressBar.getAttribute('max')){
//     progressBar.setAttribute('max', audioElement.duration);
//   }
// });

/* LOADING */

// here we're adding some feedback to indicate when the audio is loading - this is pretty similar to our last experiement in that we're 
// applying an animation via a class. the real difference here is when that class gets added - by listening for the waiting event which 
// fires when the media is waiting to load we can add the animation to the timeline via the .classList.add() method. when we want to 
// stop the animation we listen for the canplay event which fires when the media player has buffered enough data to be able to playback the 
// media then we use the .classList.remove() method - if we instead wanted to wait until it has actually loaded the whole file we could 
// use the canplaythrough event
// audioElement.addEventListener("waiting", () => {
//   progressBar.classList.add("timeline-loading");
// });
// audioElement.addEventListener("canplay", () => {
//   progressBar.classList.remove("timeline-loading");
// });

/* MEDIA FINSIHED */

// when the media finishes we want to make sure that play icon switches back over from pause to indicate that the user can restart playback
// audioElement.addEventListener("ended", () => {
//   playButton.style.backgroundImage = "url('./icons/play.png')";
//   trackList.shift();
//   playAlbum(trackList[0]);
// });

redBall.addEventListener('click', () => {    
  if (trackList[0] == redBall)
    return;
  // audioElement.pause();
  // audioElement.src = "";
  while (trackList[0] !== redBall) {
    if (trackList.length == 1)
      trackList = [redBall];
    else
      trackList.shift();
  }
  playAlbum(trackList[0]);

});

yellowBall.addEventListener('click', () => {
  if (trackList[0] == yellowBall)
    return;

  // audioElement.pause();
  // audioElement.src = "";
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

  // audioElement.pause();
  // audioElement.src = "";
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

  // audioElement.pause();
  // audioElement.src = "";
  while (trackList[0] !== blueBall) {
    if (trackList.length == 1)
      trackList = [blueBall];
    else
      trackList.shift();
  }
  playAlbum(trackList[0]);
  
});

/* COLOR IMAGE */
function fullScreen() {
  if (colorImage.style.width == "45%") {
    colorImage.style.width = "100%";
    colorImage.style.flex = "auto";
    colorImage.style.filter = "drop-shadow(0 0 5rem "+trackList[0].dataset['color']+")";
}
  else {
    colorImage.style.width = "45%";
    colorImage.style.flex = "inherit";
    colorImage.style.filter = "drop-shadow(10px 10px 10px rgba(0,0,0, 0.5))"
  }
}
colorImage.addEventListener('click', fullScreen);


/* PLAY/PAUSE */

// we can use the .play() and .pause() methods on our media element to play and pause playback - because I want this to be triggered by 
// two different events (see below) i'm going to write it as a seperate function 
// by combining play and pause into the same function i'm able to make sure it does what i want - if the media is already playing i only 
// ever want use .pause() (as pausing an already paused audio doesn't really make sense) 
// the same goes if the media is paused or stopped i only want use .play()
function playPause(){
  // the following if statement checks to see if the media is currently paused OR if the media has finshed playing - || inside of an if 
  // statement like this is how we write an OR conditional, if either of these things are true it'll trigger the block of code
  // the reason we check for both is that when the audio finishes playing it'll be in an ended state not a paused state

  if (audioElement.paused || audioElement.ended) {
    // if it isn't already playing make it playㅡ
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
// now we have our function we need to attach it to two seperate events, the first is probably obvious - clicking on the play button
playButton.addEventListener('click', playPause);
playButton.addEventListener('keydown', (e) => {
  if (e.code == "Space")
    playPause();
});

// window.addEventListener('onkeydown', (e) => {
//   if (e.code == "Space")
//     playPause();
// });

// the second event we want is clicking on the hero image, a feature popularised by youtube that is now ubiquitous in online media players


function forward(munite) {
  audioElement.currentTime += munite;
}
function backward() {
  audioElement.currentTime -= munite;
}
// function forwarding() {
//   while(!this.click)
//     audioElement.currentTime += 1;
// }
// function backwarding() {
//   audioElement.currentTime -= 1;
// }
forwardButton.addEventListener('click', forward, 5);
forwardButton.addEventListener('keydown', (e) => {
  if (e.code == "Space")
    playPause();
  else if (e.code == "ArrowRight")
    forward(5);
});
backwardButton.addEventListener('click', backward, 5);
backwardButton.addEventListener('keydown', (e) => {
  if (e.code == "Space")
    playPause();
  else if (e.code == "ArrowLeft")
    backward(5);
});


function muteUnmute() {
  if (audioElement.volume == 0){
    audioElement.muted = false;
    audioElement.volume = 1;
    muteButton.muted = false;
    muteButton.style.backgroundImage = "url('./icons/mute.png')";
    muteButton.style.backgroundPosition = "0px";
  }
  else if (!audioElement.muted){
    audioElement.muted= true;
    muteButton.muted = true;
    muteButton.style.backgroundImage = "url('./icons/unmute.png')";
    muteButton.style.backgroundPosition = "-1.4px";
  }
  else { 
    audioElement.muted = false;
    muteButton.muted = false;
    muteButton.style.backgroundImage = "url('./icons/mute.png')";
    muteButton.style.backgroundPosition = "0px";
  }


}
muteButton.addEventListener('click', muteUnmute);
muteButton.addEventListener('keydown', (e) => {
  if (e.code == "Space")
    playPause();
  else if (e.code == "KeyM")
    muteUnmute();
});
muteButton.addEventListener('keydown', (e) => {
  if (e.code == "KeyM")
    muteUnmute();
})


function loopUnloop() {
  if (loopButton.looped == "loops") {
    loopButton.looped = "start-no-loop";
    loopButton.style.backgroundImage = "url('./icons/noLoop.png')";
  }
  else if (loopButton.looped == "start-no-loop" || loopButton.looped == "in-no-loop" || loopButton.looped == "end-no-loop") {
    loopButton.looped = "one-loop";
    loopButton.style.backgroundImage = "url('./icons/oneLoop.png')";
  }
  else {
    loopButton.looped = "loops";
    loopButton.style.backgroundImage = "url('./icons/loop.png')";
  }
}

loopButton.addEventListener('click', loopUnloop);
loopButton.addEventListener('keydown', (e) => {
  if (e.code == "Space")
    playPause();
  else if (e.code == "KeyL")
    loopUnloop();
});
loopButton.addEventListener('keydown', (e) => {
  if (e.code == "KeyL")
  loopUnloop();
})

function volumeUp() {
  if (audioElement.volume <= 0.9)
    audioElement.volume += 0.1;
  if (audioElement.volume != 0 && audioElement.muted)
    muteUnmute();
  muteButton.volume = audioElement.volume;
}
function volumeDown() {
  if (audioElement.volume >= 0.1)
    audioElement.volume -= 0.1;
  if (audioElement.volume < 0.1 && !audioElement.muted)
    muteUnmute();
  muteButton.volume = audioElement.volume;
  }

function volume(e) {
  if (e.target.id == "progressBar")
    return;
  let scale = audioElement.volume + e.deltaY / 8 * 0.1;
  // Restrict scale
  scale = clampZeroOne(scale);

  if ((scale == 0 && !audioElement.muted) || (scale != 0 && audioElement.muted))
    muteUnmute();
  audioElement.volume = scale;
  muteButton.volume = audioElement.volume;
}

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

nightShiftButton.addEventListener('click', shiftLight);
nightShiftButton.addEventListener('keydown', (e) => {
  if (e.code == "Space")
    playPause();
  else if (e.code == "KeyN")
    shiftLight();
});
nightShiftButton.addEventListener('keydown', (e) => {
  if (e.code == "KeyN")
  shiftLight();
})

let map = new Map();

function shuffle() {
  if (!shuffleButton.shuffled) {
    shuffleButton.shuffled = true;
    shuffleButton.style.backgroundImage = "url('./icons/unshuffle.png')";

    let track = trackList[0];
    trackList = [track];

    for (let i=0; i<musicBalls.length-1; i++) {
      let randInt = getRandomInt(100);
      while (map.has(randInt))
        randInt = getRandomInt(100);
  
      map.set(randInt, track.next);
      track = track.next;
    }
    
  
    track = trackList[0];
    while (map.size != 0) {
      let biggest = -1;
      map.forEach((musicBall,num) => {
        biggest = Math.max(num,biggest);
      })
      track.next = map.get(biggest);
      track = track.next;
      map.delete(biggest);
    }
    track.next = trackList[0];
  }
  else {
    shuffleButton.shuffled = false;
    shuffleButton.style.backgroundImage = "url('./icons/shuffle.png')";
    redBall.next = yellowBall;
    yellowBall.next = greenBall;
    greenBall.next = blueBall;
    blueBall.next = redBall;
  }
  moveBalls();  

}
shuffleButton.addEventListener('click', shuffle);
shuffleButton.addEventListener('keydown', (e) => {
  if (e.code == "Space")
    playPause();
  else if (e.code == "KeyS")
    shuffle();
});
shuffleButton.addEventListener('keydown', (e) => {
  if (e.code == "KeyS")
    shuffle();
})


window.addEventListener('keydown', (e) => {
  if (e.code == "Space" || e.code == "KeyK")
    playPause();
  else if (e.code == "ArrowRight")
    forward(5);
  else if (e.code == "ArrowLeft")
    backward(5);
  else if (e.code == "KeyM")
    muteUnmute();
  else if (e.code == "KeyL")
    loopUnloop();
  else if (e.code == "ArrowUp")
    volumeUp();
  else if (e.code == "ArrowDown")
    volumeDown();
  else if (e.code == "KeyF")
    fullScreen();
  else if (e.code == "keyN")
    shiftLight();
  else if (e.code == "keyS")
    shuffle();
});
window.onwheel = (e) => {
  volume(e);
};


// document.getElementsByClassName("musicBall").addEventListener('keydown', (e) => {
//   if (e.code == "Space") 
//     playPause();
// });

// this feature is unfinished in my code - while it works it has no signifiers to let users know they can do this by clicking the audio
// there is already an element appropriately placed as a signifier, the <img> with the id of audioPlayerOverlay however its CSS is currently
// set to display: none - try to complete this feature by doing the following 
// first you'll need to remove display: none from its css ruleset
// then you'll need to add two new statements to the playPause() function above - each will need to first find the correct element using the 
// document.getElementById() and then update that element's .style.display property to equal either "block" or "none" depending on the context
// if done correctly the play overlay will only appear over the audio if paused, otherwise it should disappear when playing


/* TIMELINE */

// there's two different things we want to do with our timeline - update the progress bar to display how much has already played and let the user 
// click the progress bar to scrub the audio to a specific place in the audio
// to update the progress bar we need to listen for the timeupdate event which is fired everytime the current audio time is updated - when the audio 
// is playing this repeatedly fires at a constant rate
audioElement.addEventListener('timeupdate', () => {
  // this statement is simple - we update the progress bar's value attribute with the currentTime property of the audio, because timeupdate runs everytime
  // currentTime is changed it'll update both as the audio plays and if we were to skip or stop the audio
  progressBar.value = audioElement.currentTime;
});

// the simplest version of scrubbing would be to update the audio's currentTime when the user clicks the timeline - however due to the interaction pattern 
// established by youtube we should also account for a slightly different expression of user agency. the code below will work with a simple click on the 
// timeline but will also allow for a user to drag their mouse on the timeline to continuously update currentTime and only end scrubbing when they release the 
// mouse button. implementing this will take some more complex use of event listeners but i'll do my best to explain the design and technical implementation

// first thing we want to do is write a function that will take the current position of the the mouse in relation to the timeline and use it to change the 
// currentTime property of the audio element. each time this runs we'll need to know the position of the mouse so which we'll do using the event passed to it 
// by the eventlistener - to access this we need to set it as a parameter, i've used the name e but it can be called whatever you like
function scrubToTime(e){
  // this statement has a lot going on so let's step through each part:
  // the first thing we want to work out is the distance between the left side of the progress bar and the mouses current position - if we were just building 
  // an interaction to work when the mouse is over the bar we could take this from the event, however as we want this to also work when we've held the mouse 
  // down and moved it somewhere else on the page we need to work this out manually
  // e.clientX is the cursors current distance from the left edge of the page
  // we then want to minus (progressBar.getBoundingClientRect().left + window.scrollX) from this distance to account for any gap between the left edge of the 
  // page and the start of the progress bar
  // audioElement.currentTime is the current position in the media file - we are setting it here to change the playback time
  // we then need to find a normalised 0-1 value based on how far along the bar the cursor is - the idea is that if i click the left most side it should return 0
  // and if i click the right most side it should return 1 - we get this value by dividing x by the total width of the progressBar
  // the value is then fed into our clampZeroOne() function - this is accounting for if our mouse is further left or further right than the ends of the progress bar
  // it works by essentially making the value always equal 1 if it is over 1 or always making it 0 if under 0 - this is commonly called a clamp, we're only allowing
  // a value to be in a certain range
  // finally we're using this clamped value to multiply with total duration of our audio thus working out where we should scrub to
  let x = e.clientX - (progressBar.getBoundingClientRect().left + window.scrollX);
  audioElement.currentTime = clampZeroOne(x / progressBar.offsetWidth) * audioElement.duration;
}

// the click event fires only if the user presses the mouse down and then releases it on the same element. we can allow for a wider range of interactions by
// further breaking this down this into its discrete parts and listening to both the mousedown and mouseup events seperately

progressBar.addEventListener('mousedown', scrubToTime);
progressBar.addEventListener('mousedown', (e) => {
  // the behaviour here is to listen to the mousemove event (fired when the user moves their mouse) when the click is held down but then to stop listening to that 
  // event when the mouse click is released
  window.addEventListener('mousemove', scrubToTime);
  window.addEventListener('mouseup', () => {
    window.removeEventListener('mousemove', scrubToTime);
  });
});

function slideToTime(e) {
  let scale = audioElement.currentTime + e.deltaY / 8 * 0.1;
  // Restrict scale
  audioElement.currentTime = clampZeroX(audioElement.duration, scale);

}
progressBar.addEventListener('wheel',slideToTime);


/* HELPER FUNCTIONS */

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function clampZeroOne(input){
  return Math.min(Math.max(input, 0), 1);
}

function clampZeroX(x, input){
  return Math.min(Math.max(input, 0), x);
}

function logEvent(e){
  console.log(e);
}
