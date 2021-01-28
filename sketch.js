// FONT C/O https://fontlibrary.org/en/font/old-standard


var fontReg, fontItal, fontBold;

function preload() {
  fontReg = loadFont("OldStandard-Regular.otf");
  fontItal = loadFont("OldStandard-Italic.otf");
  fontBold = loadFont("OldStandard-Bold.otf");
}


var started = false;
var shifted = false;


var onboarding = "To begin, press return, then type the first thought that comes to your mind. Each keystroke will produce about a second of sound. Continue typing without letting the music fade out until the screen is full of text.";

var contents = "";

var meter = new Tone.Meter();


//some overall compression to keep the levels in check
var masterCompressor = new Tone.Compressor({
  "threshold": -6,
  "ratio": 3,
  "attack": 0.5,
  "release": 0.1
});
//give a little boost to the lows
var lowBump = new Tone.Filter(200, "lowshelf");
//route everything through the filter
//and compressor before going to the speakers
Tone.Master.chain(
  // lowBump, 
                  masterCompressor, meter);



var pingPong = new Tone.PingPongDelay("4n", 0.2).toMaster();
var kick = new Tone.MembraneSynth().connect(pingPong).toMaster();

var synth = new Tone.PolySynth(20, Tone.Synth, {
  "oscillator": {
    type: "square",
    // "partials" : [0, 2, 3, 4],
  },
  envelope: {
    attack: 0.5,
    decay: 0.2,
    sustain: 0.1,
    release: 1
  }
}).toMaster();


var synthFilter = new Tone.AutoFilter({
  frequency: 1,
  type: "sine",
  depth: 1,
  baseFrequency: 200,
  octaves: 2.6,
  filter: {
    type: "lowpass",
    rolloff: -12,
    Q: 1
  }
})
var pingPong2 = new Tone.PingPongDelay("16t", 0.1).toMaster();


var synth2 = new Tone.Synth({
  oscillator: {
    type: "triangle"
  },
  envelope: {
    attack: 0.005,
    decay: 0.1,
    sustain: 0.3,
    release: 1
  }
}).connect(synthFilter).connect(pingPong2).toMaster();

var feedbackDelay = new Tone.FeedbackDelay("8n", 0.5).toMaster();
var synth3 = new Tone.FMSynth().connect(feedbackDelay).toMaster();

Tone.Master.volume.value = -10;


//--------------

function setup() {
  // amplitude = new p5.Amplitude();

  createCanvas(windowWidth, windowHeight);
}

function draw() {
  var mutable = false;

  var level = meter.getLevel();
  var size = map(level, 0, 1, 0, 200);
  var textColor = map(level, -40, 15, 25, 250);


  background(25);

  // print(level);
  fill(textColor);

  //LOAD SCREEN
  if (started == false) {
    fill(random(175, 250));
    textAlign(CENTER);
    textFont(fontBold);
    textSize(48);
    text("Automatic Writing", width / 2, height / 4);

    fill(random(175, 250));
    textAlign(CENTER);
    textFont(fontItal);
    textSize(24);
    text(onboarding, width / 4, height / 3, width / 2, height - 50);
  }

  //BACKSPACE ERROR RED
  if (keyIsPressed) {
    if (keyCode == 8) {
      background(128, 0, 0);
    } else if (keyCode == 13) {
      started = true;
      background(255);
  	}
  }

  //MAIN SCREEN TEXT
  textSize(24);
  textFont(fontReg);
  text(contents, 25, 25, width - 50, height - 50);

	//CLEAR
  if (level > -50) {
    mutable = true;
  }
  if (level < -50) {
    started = false;
    mutable = false;
    contents = "";
  }

  //SHIFTY
    if (keyIsPressed) {
    if (keyCode == 16) {
      shifted = true;
    } else {
      shifted = false;    
    }
  }

}

//------------------------

//TYPE TO TEXT
function keyTyped() {
  contents += key;
}


//TYPE TO PLAY
function keyPressed() {

  //EXIT LOAD SCREEN
  started = true;

  if (shifted == true) {
        switch (keyCode) {
      
    case 13: //RETURN
      synth.triggerAttackRelease(["A3", "A4", "C4", "E5"], "2m");
      break;
    case 32: //space bar
      kick.triggerAttackRelease("A1", "1n");
      break;
    case 8: //backspace
      synth.triggerAttackRelease(["D#2", "D#3", "D#4", "D#5"], "1n");
      break;
    case 46: //delete
      synth.triggerAttackRelease(["D#2", "D#3", "D#4", "D#5"], "1n");
      break;

    case 192: //~
      synth.triggerAttackRelease(["G3", "C4", "E4", "G5"], "1m");
      break;
    case 49: //!
      synth.triggerAttackRelease(["A3", "A4", "C4", "E4", "A5", "E5"], "2m");
      break;
    case 50: //@
      synth.triggerAttackRelease(["G3", "B4", "D4", "G4"], "1m");
      break;
    case 51: //#
      synth.triggerAttackRelease(["B4", "D4", "G4", "B5"], "1m");
      break;
    case 52: //$
      synth.triggerAttackRelease(["F3", "A4", "C4", "F4"], "1m");
      break;
    case 53: //%
      synth.triggerAttackRelease(["A4", "C4", "F4", "A4"], "1m");
      break;
    case 54: //^
      kick.triggerAttackRelease("E6", "1n");
      break;
    case 55: //&
      synth.triggerAttackRelease(["E3", "C4", "E4", "G4"], "1m");
      break;
    case 56: //*
      kick.triggerAttackRelease("A7", "1n");
      break;
    case 57: //(
      synth.triggerAttackRelease(["D4", "F4", "A5", "D5"], "1m");
      break;
    case 48: //)
      synth.triggerAttackRelease(["C4", "F4", "A5", "C5"], "1m");
      break;
    case 189: //_
      synth.triggerAttackRelease(["C3", "E3", "A4", "E4"], "1m");
      break;
    case 187: //+
      synth.triggerAttackRelease(["A3", "C3", "E3", "C4", "E4"], "1m");
      break;

    case 219: // {
      synth.triggerAttackRelease(["B3", "D3", "F4", "A4", "B4", "F5", "A5"], "1m");
      break;
    case 221: // }
      synth.triggerAttackRelease(["A3", "D3", "F4", "A4", "D4", "F5", "A5"], "1m");
      break;
    case 220: // |
      synth.triggerAttackRelease(["F3", "A4", "C4", "F4", "A5", "C5"], "2m");
      break;
    case 186: //:
      synth.triggerAttackRelease(["A3", "A4", "C4", "F5"], "2m");
      break;
    case 222: //"
      synth.triggerAttackRelease(["C3", "E4", "A4", "C4", "E5", "A5"], "2m");
      break;
    case 188: //<
      kick.triggerAttackRelease("A6", "1n");
      break;
    case 190: //>
      kick.triggerAttackRelease("E6", "1n");
      break;
    case 191: // ?
      synth.triggerAttackRelease(["A3", "C3", "F4", "A4", "C4", "F5", "A5"], "2m");
      break;

    case 65: //A
      synth.triggerAttackRelease("A2", "1n");
      break;
    case 66: //B
      synth2.triggerAttackRelease("B3", "1n");
      break;
    case 67: //C
      synth2.triggerAttackRelease("C2", "1n");
      break;
    case 68: //D
      synth.triggerAttackRelease("C1", "1n");
      break;
    case 69: //E
      synth3.triggerAttackRelease("A1", "1n");
      break;
    case 70: //F  
      synth.triggerAttackRelease("C4", "1n");
      break;
    case 71: //G
      synth.triggerAttackRelease("G3", "1n");
      break;
    case 72: //H
      synth.triggerAttackRelease("E2", "1n");
      break;
    case 73: //I
      synth3.triggerAttackRelease("A4", "1n");
      break;
    case 74: //J
      synth.triggerAttackRelease("D4", "1n");
      break;
    case 75: //K
      synth.triggerAttackRelease("B4", "1n");
      break;
    case 76: //L
      synth.triggerAttackRelease("E3", "1n");
      break;
    case 77: //M
      synth2.triggerAttackRelease("C3", "1n");
      break;
    case 78: //N
      synth2.triggerAttackRelease("E4", "1n");
      break;
    case 79: //O
      synth3.triggerAttackRelease("A3", "1n");
      break;
    case 80: //P
      synth3.triggerAttackRelease("G4", "1n");
      break;
    case 81: //Q
      synth3.triggerAttackRelease("F4", "1n");
      break;
    case 82: //R
      synth3.triggerAttackRelease("E5", "1n");
      break;
    case 83: //S
      synth.triggerAttackRelease("E4", "1n");
      break;
    case 84: //T
      synth3.triggerAttackRelease("A4", "1n");
      break;
    case 85: //U
      synth3.triggerAttackRelease("C4", "1n");
      break;
    case 86: //V
      synth2.triggerAttackRelease("B5", "1n");
      break;
    case 87: //W
      synth3.triggerAttackRelease("G5", "1n");
      break;
    case 88: //X
      synth2.triggerAttackRelease("D5", "1n");
      break;
    case 89: //Y
      synth3.triggerAttackRelease("G4", "1n");
      break;
    case 90: //Z
      synth2.triggerAttackRelease("F5", "1n");
      break;
    default:
      break;
  }
      } else {
        
      	switch (keyCode) {
      
    case 13: //RETURN
      synth.triggerAttackRelease(["A3", "A4", "C4", "E5"], "2m");
      break;
    case 32: //space bar
      kick.triggerAttackRelease("A1", "1n");
      break;
    case 8: //backspace
      synth.triggerAttackRelease(["D#2", "D#3", "D#4", "D#5"], "1n");
      break;
    case 46: //delete
      synth.triggerAttackRelease(["D#2", "D#3", "D#4", "D#5"], "1n");
      break;

    case 192: //`
      synth.triggerAttackRelease(["C3", "C4", "E4", "G5"], "2m");
      break;
    case 49: //1
      kick.triggerAttackRelease("E3", "1n");
      break;
    case 50: //2
      kick.triggerAttackRelease("A3", "1n");
      break;
    case 51: //3
      kick.triggerAttackRelease("C3", "1n");
      break;
    case 52: //4
      kick.triggerAttackRelease("D3", "1n");
      break;
    case 53: //5
      kick.triggerAttackRelease("E4", "1n");
      break;
    case 54: //6
      kick.triggerAttackRelease("G4", "1n");
      break;
    case 55: //7
      kick.triggerAttackRelease("A4", "1n");
      break;
    case 56: //8
      kick.triggerAttackRelease("C4", "1n");
      break;
    case 57: //9
      kick.triggerAttackRelease("D4", "1n");
      break;
    case 48: //0
      kick.triggerAttackRelease("E5", "1n");
      break;
    case 189: //-
      synth.triggerAttackRelease(["A3", "C3", "E4", "A4"], "2m");
      break;
    case 187: //=
      synth.triggerAttackRelease(["A3", "E3", "E4", "A4"], "2m");
      break;

    case 219: // [
      synth.triggerAttackRelease(["B3", "D3", "F4", "A4", "B4"], "2m");

      break;
    case 221: // ]
      synth.triggerAttackRelease(["A3", "D3", "F4", "A4", "D4"], "2m");
      break;
    case 220: // \
      synth.triggerAttackRelease(["F4", "A4", "C4", "F5", "A5"], "2m");
      break;
    case 186: //;
      synth.triggerAttackRelease(["A3", "A4", "C4", "F4"], "2m");
      break;
    case 222: //'
      synth.triggerAttackRelease(["C3", "E4", "A4", "C4", "E4", "A5"], "2m");
      break;
    case 188: //,
      synth.triggerAttackRelease(["F3", "A4", "C4", "F4"], "2m");
      break;
    case 190: //.
      synth.triggerAttackRelease(["A3", "C3", "E4", "A4", "C4", "E5", "A5"], "2m");
      break;
    case 191: // /
      synth.triggerAttackRelease(["E2", "A3", "C3", "F4", "A4", "C4", "F4"], "2m");
      break;

    case 65: //a
      synth.triggerAttackRelease("A1", "1n");
      break;
    case 66: //b
      synth2.triggerAttackRelease("B2", "1n");
      break;
    case 67: //c
      synth2.triggerAttackRelease("C1", "1n");
      break;
    case 68: //d
      synth.triggerAttackRelease("C2", "1n");
      break;
    case 69: //e
      synth3.triggerAttackRelease("A2", "1n");
      break;
    case 70: //f  
      synth.triggerAttackRelease("C3", "1n");
      break;
    case 71: //g
      synth.triggerAttackRelease("G2", "1n");
      break;
    case 72: //h
      synth.triggerAttackRelease("E1", "1n");
      break;
    case 73: //i
      synth3.triggerAttackRelease("A3", "1n");
      break;
    case 74: //j
      synth.triggerAttackRelease("D3", "1n");
      break;
    case 75: //k
      synth.triggerAttackRelease("B3", "1n");
      break;
    case 76: //l
      synth.triggerAttackRelease("E2", "1n");
      break;
    case 77: //m
      synth2.triggerAttackRelease("C4", "1n");
      break;
    case 78: //n
      synth2.triggerAttackRelease("E3", "1n");
      break;
    case 79: //o
      synth3.triggerAttackRelease("A4", "1n");
      break;
    case 80: //p
      synth3.triggerAttackRelease("G3", "1n");
      break;
    case 81: //q
      synth3.triggerAttackRelease("F3", "1n");
      break;
    case 82: //r
      synth3.triggerAttackRelease("E4", "1n");
      break;
    case 83: //s
      synth.triggerAttackRelease("E5", "1n");
      break;
    case 84: //t
      synth3.triggerAttackRelease("A5", "1n");
      break;
    case 85: //u
      synth3.triggerAttackRelease("C5", "1n");
      break;
    case 86: //v
      synth2.triggerAttackRelease("B4", "1n");
      break;
    case 87: //w
      synth3.triggerAttackRelease("G4", "1n");
      break;
    case 88: //x
      synth2.triggerAttackRelease("D4", "1n");
      break;
    case 89: //y
      synth3.triggerAttackRelease("G5", "1n");
      break;
    case 90: //z
      synth2.triggerAttackRelease("F4", "1n");
      break;
    default:
      break;
  }
      }
  

}
