let sliders = {};
let notes = {};
// Enable WebMidi.js
WebMidi.enable(function (err) {

    if (err) {
        console.log("WebMidi could not be enabled.", err);
    } else {
        // Retrieve an input by name, id or index
        // var input = WebMidi.getInputByName("LoopBe Internal MIDI");
        var input = WebMidi.getInputByName("IAC Driver Bus 1");

        // Listen for a 'cc' message on all channels
        input.addListener('controlchange', "all", function (e) {
            sliders[e.controller.number] = e.value/127;
        });

        input.addListener('noteon', "all", function (e) {
            notes[e.note.number] = e.rawVelocity/127;
        });

        input.addListener('noteoff', "all", function (e) {
            notes[e.note.number] = 0;
        });
    };
});

let particleSystem, shootingStarSystem, c, gate;

function setup() {
    createCanvas(windowWidth, windowHeight);
    ldlogo = loadImage('assets/ld-logo-circle.png');
    ldlogolg = loadImage('assets/ld-logo-large.png');
    // sdlogo = loadImage('assets/sd-logo.png');
    ufo = loadImage('assets/ufo.png');
    cat = loadImage('assets/coolcat.png');
    reed = loadImage('assets/reed.png');
    bannerblack = loadImage('assets/bannerblack.png');
    bannerwhite = loadImage('assets/bannerwhite.png');
    space = createVideo(['assets/space3.mp4'], vidLoad);
    // capture = createCapture(VIDEO);
    // capture.size(windowWidth, windowHeight);

    ufos = new UFOSystem();
    cats = new CatSystem();
    reeds = new CatSystem();

    shootingStarSystem = new ParticleSystem();
    particleSystem = new ParticleSystem();
    c = 0;
    gate0 = 0;
    gate1 = 0;
    gate2 = 0;
    gate3 = 0;
}

function vidLoad() {
    space.loop();
    space.volume(0);
}

function draw() {
    // console.log(notes);
    background(51);
    colorMode(HSB);
    rectMode(CENTER);
    imageMode(CENTER);

    // image(capture, width/2, height/2, 960, 720);
    image(space, width/2, height/2, width, height);

    // Shooting stars on C2
    if (notes[48] && gate0) {
        ufos.addUFO(createVector(0, height/2 * random()), createVector(10, 0));
        gate0 = 0;
    }
    if (!notes[48]) {
        gate0 = 1;
    }

    // Cats on C#2
    if (notes[49] && gate1) {
        cats.addCat(createVector(width * random(), height * 2/3 * random()), cat);
        gate1 = 0;
    }
    if (!notes[49]) {
        gate1 = 1;
    }

    // Reeds on D2
    if (notes[50] && gate2) {
        reeds.addCat(createVector(width * random(), height * 2/3 * random()), reed);
        gate2 = 0;
    }
    if (!notes[50]) {
        gate2 = 1;
    }

    if (notes[51] && gate3) {
        gate3 = 0;
    }
    if (!notes[50]) {
        gate3 = 1;
    }

    ufos.run();
    cats.run();
    reeds.run();

    // Strobe D1 & Eb1
    if (notes[38]) {
        fill(0, 0, 0);
        rect(width/2, height/2, width, height);
        image(ldlogolg, width/2, height/2);
    }
    if (notes[39]) {
        fill(0, 0, 100);
        rect(width/2, height/2, width, height);
    }

    if (notes[0]) {
        image(ldlogo, 80, 80, 90, 90);
        // image(bannerblack, 150, height-30, 300, 80);
    } else {
        image(ldlogo, 80, 80, 100, 100);
        // image(bannerwhite, 150, height-30, 300, 80);
    }

    // rectMode(CORNER);
    // fill('red');
    // rect(180, 40, 300, 80);
}
