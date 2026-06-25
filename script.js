const typewriterSpeed = 45;
const postTextDelay = 3000;
const choiceTimerSeconds = 5;

let empathy = 0;
let avoidance = 0;
let currentSceneId = "wake";
let typewriterHandle = null;
let typewriterState = null;
let delayHandle = null;
let countdownHandle = null;
let sequenceHandle = null;
let sequenceToken = 0;
let vhsFrameHandle = null;
let vhsBrokenHandle = null;
let vhsAudio = null;
let vhsStaticAudio = null;
let vhsPlaybackToken = 0;
let activeSceneSounds = [];
let audioIsUnlocked = false;
let activeTvOverlay = null;
let acceptingChoice = false;
let choicesAreInfluenced = false;
let lastMouseX = window.innerWidth / 2;

const storyText = document.getElementById("storyText");
const storyPanel = storyText.parentElement;
const choicesBox = document.getElementById("choices");
const screenTimer = document.getElementById("screenTimer");
const screenTimerNumber = document.getElementById("screenTimerNumber");
const screenTimerFill = document.getElementById("screenTimerFill");
const sceneVideo = document.getElementById("sceneVideo");
const sceneImage = document.getElementById("sceneImage");
const sceneImageCrossfade = document.getElementById("sceneImageCrossfade");
const tvOverlayBackdrop = document.getElementById("tvOverlayBackdrop");
const tvOverlayVideo = document.getElementById("tvOverlayVideo");
const tvGlitchVideo = document.getElementById("tvGlitchVideo");
const tvOverlayVignette = document.getElementById("tvOverlayVignette");
const mediaPlaceholder = document.getElementById("mediaPlaceholder");
const vhsPlayButton = document.getElementById("vhsPlayButton");
const endingAchieved = document.getElementById("endingAchieved");
const endingHomeButton = document.getElementById("endingHomeButton");
const aboutButton = document.getElementById("aboutButton");
const aboutOverlay = document.getElementById("aboutOverlay");
const aboutCloseButton = document.getElementById("aboutCloseButton");
const startButton = document.getElementById("startButton");

const scenes = {
  wake: {
    title: "Scene 1 / Wake Up",
    backgroundImage: "Images/img2.png",
    backgroundVideo: "",
    sceneImageClass: "hospital-flicker",
    sounds: [
      { src: "sounds/buzzinglight.mp3", volume: 0.18 },
      { src: "sounds/lightflicker.mp3", volume: 0.2 }
    ],
    text: "You wake up in a hospital bed. The room is dimly lit, and the fluorescent light above you flickers weakly. There is a locked door in front of you. Around your wrist is a hospital band that reads: PATIENT 4. Beside the bed is a small drawer. Inside the drawer, you find an ID card with your name on it: Carl Darwood. Next to it is an envelope. Written across the front are the words: \"DO NOT OPEN UNTIL YOU REMEMBER.\"",
    choices: [
      {
        text: "Open the envelope.",
        empathy: 1,
        resultBackgroundImage: "Images/img13.png",
        result: "Inside the envelope is a short note: \"If you are reading this, we are sorry. The procedure failed.\" You do not understand what it means, but the words leave a cold weight in your stomach.",
        next: "corridor"
      },
      {
        text: "Do not open the envelope.",
        avoidance: 1,
        avoidant: true,
        result: "You place the envelope back inside the drawer. Whatever is written inside, you are not ready to know yet. Still, as you close the drawer, you feel as if you have just refused something important.",
        next: "corridor"
      }
    ]
  },
  corridor: {
    title: "Scene 2 / The Corridor",
    backgroundImage: "Images/img4.png",
    backgroundVideo: "",
    sounds: [
      { src: "sounds/buzzinglight.mp3", volume: 0.14 },
      { src: "sounds/hallwayfootsteps.mp3", volume: 0.18 },
      { src: "sounds/womancryingsoftly.mp3", volume: 0.18, startAt: 4 }
    ],
    text: "You leave the room. An endless corridor stretches out in front of you. The floor is polished but stained, and the lights above buzz with a low, constant hum. In the distance, you see a woman sitting against the wall. As you approach, she looks up. She is heavily bleeding, one hand pressed against an open wound in her chest. Her eyes widen when she sees you.\n\n\"You don't recognize me, do you?\" she says quietly. \"Maybe that's for the best. Please don't ask me who I am.\"",
    choices: [
      {
        text: "Help her.",
        empathy: 1,
        resultBackgroundImage: "Images/img6.png",
        result: "You help her without saying a word. As soon as you touch her, she begins to cry, not loudly, but with the exhaustion of someone who has been holding it in for a long time. You help her sit more comfortably, then continue down the corridor.",
        next: "after_helping"
      },
      {
        text: "Question her.",
        avoidance: 1,
        avoidant: true,
        resultBackgroundImage: "Images/img5.png",
        result: "\"Who are you?\" you ask. She looks up at you, still holding the wound in her chest. Her face collapses with grief. \"I'm her mother,\" she says. \"You took her away from me.\" You do not understand, and you do not want to ask anything else. You continue down the corridor, leaving her behind.",
        next: "after_questioning"
      }
    ]
  },
  after_helping: {
    title: "Scene 3A / After Helping",
    backgroundImage: "Images/img8.png",
    backgroundVideo: "",
    sceneImageClass: "hospital-flicker",
    sounds: [
      { src: "sounds/hallwayfootsteps.mp3", volume: 0.14 },
      { src: "sounds/lightflicker.mp3", volume: 0.12 }
    ],
    text: "You continue down the corridor. The woman's crying fades behind you, but the sound stays inside your head. You do not know who she is, or why she looked at you that way. Still, something about helping her feels strangely familiar, as if your body remembered something your mind could not.",
    autoNext: "after_questioning"
  },
  after_questioning: {
    title: "Scene 3B / After Questioning",
    backgroundImage: "Images/img7.png",
    backgroundFit: "contain",
    backgroundVideo: "",
    sounds: [
      { src: "sounds/childlaugh.mp3", volume: 0.42, loop: false, repeats: 3, repeatDelay: 5200 },
      { src: "sounds/tvstatic1.mp3", volume: 0.07 },
      { src: "sounds/suspense.mp3", volume: 0.045 }
    ],
    tvOverlay: {
      video: "video1.mp4",
      glitchVideo: "glitchoverlay.mp4",
      imageWidth: 1448,
      imageHeight: 1086,
      x: 128,
      y: 86,
      width: 448,
      height: 322
    },
    text: "You continue down the corridor without looking back, but a strange feeling settles in your chest. You cannot explain it, yet you are certain you have made the wrong choice. As you pass a hospital room, the sound of a child laughing echoes from inside. The laughter is warm and carefree, completely out of place in the silence of the facility. Drawn by curiosity, you step inside. A television flickers in the corner of the room. Through the static, a grainy recording begins to play. A car slowly reverses out of a driveway.",
    timed: false,
    choices: [
      {
        text: "Continue.",
        next: "cafeteria"
      }
    ]
  },
  cafeteria: {
    title: "Scene 4A / Cafeteria",
    backgroundImage: "Images/img10.png",
    backgroundVideo: "",
    sounds: [
      { src: "sounds/buzzinglight.mp3", volume: 0.13 },
      { src: "sounds/lightflicker.mp3", volume: 0.11 }
    ],
    text: "You arrive at what appears to be the cafeteria of the facility. Food trays are still perfectly laid out on the tables, as if everyone left suddenly, without warning. The room smells faintly of dust and something sweet that has gone stale.",
    autoNext: "cafeteria_drawing"
  },
  cafeteria_drawing: {
    title: "Scene 4B / The Drawing",
    backgroundImage: "Images/img11.png",
    backgroundVideo: "",
    sounds: [
      { src: "sounds/suspense.mp3", volume: 0.04 }
    ],
    text: "On one table, you find a child's drawing. It shows a little girl holding a balloon, a house, a loving family, and a car in the distance. In the middle of the paper, written in uneven handwriting, are the words: \"Was it a mistake?\"",
    autoNext: "cafeteria_girl"
  },
  cafeteria_girl: {
    title: "Scene 4C / The Girl",
    backgroundImage: "Images/img12.png",
    sceneImageClass: "hospital-flicker",
    backgroundVideo: "",
    sounds: [
      { src: "sounds/childlaugh.mp3", volume: 0.28, loop: false, repeats: 2, repeatDelay: 6500 },
      { src: "sounds/lightflicker.mp3", volume: 0.13 }
    ],
    text: "You place the drawing back on the table. When you look up, a little girl is standing across the room. She was not there a second ago. She is holding the same red balloon from the drawing. For a moment she simply watches you. Then she points her little finger directly at you.\n\n\"I know you.\"\n\nYour throat tightens. The room suddenly feels smaller. The girl takes a step closer.\n\n\"Have you seen my mommy?\"\n\nYou say nothing. The girl tilts her head.\n\n\"You always forget the important part.\"",
    choices: [
      {
        text: "How do you know me?",
        avoidance: 1,
        avoidant: true,
        dejaVuSequence: {
          holdImage: "Images/img17.png",
          holdDuration: 3000,
          flashImages: ["Images/img14.png", "Images/img15.png", "Images/img16.png"],
          whiteDuration: 75,
          imageDuration: 130,
          repeat: true,
          repeatDelay: 3000
        },
        result: "The girl looks at you with wide, curious eyes. \"Because you were there.\" You feel your chest tighten. \"There was a loud noise.\" She points toward an empty space beside you. \"The car stopped.\" A pause. A flash: a rearview mirror, a shadow moving. Your heart begins to race. The girl lowers her gaze. \"When I fell down, you were the first one who came running.\"",
        next: "office"
      },
      {
        text: "Take her hand and take her to her mommy.",
        empathy: 1,
        dejaVuSequence: {
          holdImage: "Images/img18.png",
          holdDuration: 3000,
          flashImages: ["Images/img14.png", "Images/img15.png", "Images/img16.png", "Images/img19.png", "Images/img20.png"],
          whiteDuration: 75,
          imageDuration: 130,
          repeat: true,
          repeatDelay: 3000
        },
        result: "Somewhere deep inside, you know the woman you met earlier is her mother. You cannot explain how. You simply know. The little girl takes your hand, and together you begin walking down the corridor. Her hand feels warm. Real. As you walk, a sudden flash tears through your mind: a rearview mirror, a shadow moving. Your heart begins to race. The image vanishes as quickly as it came. The girl looks up at you. \"My mommy told me you came to see me every week.\" A sharp pain shoots through your head. Another memory: a hospital room, flowers on a windowsill, a stuffed rabbit sitting on a chair. Then darkness. The girl lowers her eyes to the floor. \"You always cried when you thought I was asleep.\" For a moment, the corridor seems to spin around you. And for the first time, you begin to understand why.",
        next: "office"
      }
    ]
  },
  office: {
    title: "Scene 5 / The Office",
    backgroundImage: "Images/img29.png",
    backgroundVideo: "",
    sounds: [
      { src: "sounds/buzzinglight.mp3", volume: 0.11 },
      { src: "sounds/tvstatic2.mp3", volume: 0.13 },
      { src: "sounds/suspense.mp3", volume: 0.04 }
    ],
    text: "You leave the girl behind and continue searching for an exit. As you walk in an unknown direction, you stumble across an office room. You enter. The fluorescent lights buzz overhead.\n\nOn the desk sits a patient file. Across the front, it reads: PATIENT 4 - CARL DARWOOD.\n\nBeside it is a VHS cassette already loaded into a television. The screen flickers with static. Then your own voice breaks through:\n\n\"Please, I can't live with this guilt anymore.\"\n\nThe tape cuts out.",
    choices: [
      {
        text: "Open and read the file.",
        resultBackgroundImage: "Images/img30.png",
        result: "You open the file.\n\nPATIENT FILE #4\nPATIENT 4 - CARL DARWOOD\nAge: 47\nStatus: Active Participant\nProgram: Cognitive Memory Suppression Trial\nDate of Admission: Redacted\n\nBackground: Patient exhibits severe symptoms of persistent guilt, recurring nightmares, obsessive recollection, and resistance to conventional therapy. Patient reports inability to move beyond a traumatic life event despite repeated treatment attempts.\n\nProcedure Notes: Subject voluntarily entered the Cognitive Memory Suppression Program. Objective: selective removal of traumatic memory clusters. Procedure authorized by patient.\n\nPsychological Evaluation: Patient repeatedly expresses belief that: \"I should have done something.\" Patient demonstrates difficulty accepting external assessments regarding responsibility. Recommendation: proceed with suppression protocol.\n\nComplication Report: Session 7 interrupted. Unexpected neurological activity detected. Memory isolation unsuccessful. Patient transferred to intensive monitoring.\n\nFinal Status: Incomplete. Further notes unavailable. Access restricted.",
        next: "return"
      },
      {
        text: "Listen to the VHS tape recording.",
        resultBackgroundImage: "Images/img28.png",
        vhsPlayback: {
          posterImage: "Images/img28.png",
          audio: "vhstape.mp3",
          volume: 0.58,
          brokenEffect: true,
          staticAudio: "sounds/tvstatic2.mp3",
          staticVolume: 0.085,
          frames: [
            "Images/img21.png",
            "Images/img22.png",
            "Images/img23.png",
            "Images/img24.png",
            "Images/img25.png",
            "Images/img26.png",
            "Images/img27.png"
          ],
          frameDuration: 160
        },
        next: "return"
      }
    ]
  },
  return: {
    title: "Scene 6 / The Return",
    backgroundImage: "Images/img31.png",
    sounds: [
      { src: "sounds/hallwayfootsteps.mp3", volume: 0.16 },
      { src: "sounds/suspense.mp3", volume: 0.05 }
    ],
    textTriggers: [
      {
        at: "At the far end of the hallway stand the woman and the little girl.",
        sound: { src: "sounds/scarysoud.mp3", volume: 0.14 }
      }
    ],
    backgroundSequence: {
      flashColor: "#000",
      flashDuration: 120,
      frames: [
        { image: "Images/img31.png", duration: 7000 },
        { image: "Images/img32.png", duration: 5000 },
        { image: "Images/img33.png", duration: 4000 },
        { image: "Images/img34.png", duration: 3000 },
        { image: "Images/img35.png", duration: 2000 },
        { image: "Images/img36.png", duration: 0 }
      ]
    },
    backgroundVideo: "",
    text: "You step out of the room, your head spinning. The procedure. The missing memories. None of it makes sense. How could you have forgotten something so important? You wander through the corridors in a daze, barely aware of where you are going.\n\nThen you see them.\n\nAt the far end of the hallway stand the woman and the little girl. Hand in hand. Neither of them speaks. Neither of them looks at you. They simply walk forward at a slow, steady pace. The woman keeps her eyes fixed ahead. The little girl clutches her red balloon.\n\nFor a moment, you wonder if they have seen you at all. Then the girl turns her head, just slightly, enough to make your stomach drop. A wave of guilt crashes over you. Your chest tightens. Every instinct tells you to run. To turn around. To disappear before they get any closer. But you cannot move.\n\nThe distance between you grows smaller. Step by step. The fluorescent lights hum overhead. The little girl never takes her eyes off you. And with every step they take, a terrible feeling grows inside you.\n\nSomewhere deep down, you already know why.",
    choices: [
      {
        text: "Listen to your instincts.",
        avoidance: 2,
        avoidant: true,
        next: "ending_check"
      },
      {
        text: "Do not listen to your instincts.",
        empathy: 2,
        next: "ending_check"
      }
    ]
  },
  ending_acceptance: {
    title: "Ending / Acceptance",
    backgroundImage: "Images/img43.png",
    textTriggers: [
      {
        at: "A warm light begins to fill the corridor. The walls of the facility dissolve",
        sequence: {
          type: "whiteGlowToImage",
          image: "Images/img45.png",
          glowInDuration: 4600,
          glowHoldDuration: 900,
          glowOutDuration: 4500
        }
      }
    ],
    backgroundVideo: "",
    timed: false,
    text: "Something deep inside tells you to stay. To stop running. To face them. The woman and the little girl walk toward you, hand in hand. As they get closer, the fear that had been gripping you begins to fade. Neither of them looks angry. Neither of them looks disappointed.\n\n\"Do you remember now?\" the little girl asks.\n\nFragments of memory rush through your mind. The driveway. The sunlight. The sound of laughter. The hospital. The courtroom. The years of guilt that followed.\n\n\"It wasn't your fault,\" the woman says gently.\n\n\"I ran behind the car,\" the little girl adds. \"You did everything you could.\"\n\nThe woman steps closer.\n\n\"My family forgave you. The court forgave you. But you never forgave yourself.\"\n\nThe little girl reaches for your hand.\n\n\"You can let it go now.\"\n\nA warm light begins to fill the corridor. The walls of the facility dissolve around you. For the first time, the place does not feel frightening. It feels peaceful.\n\nYou close your eyes.\n\nWhen you open them again, you are back in the hospital. Five years have passed. And for the first time since the accident, you feel at peace.",
    endAction: {
      type: "achievedEnding"
    }
  },
  ending_loop: {
    title: "Ending / Loop",
    backgroundImage: "Images/img37.png",
    backgroundVideo: "",
    timed: false,
    sounds: [
      { src: "sounds/running.mp3", volume: 0.22 },
      { src: "sounds/suspense.mp3", volume: 0.045 }
    ],
    text: "With the last bit of courage, or perhaps pure panic, you turn and run. You do not look back. Your footsteps echo through the endless corridors as you desperately try to put as much distance between yourself and them as possible. Eventually, breathless and exhausted, you find yourself standing in front of a familiar door.",
    autoNext: "ending_loop_room"
  },
  ending_loop_room: {
    title: "Ending / Loop",
    backgroundImage: "Images/img38.png",
    sounds: [
      { src: "sounds/buzzinglight.mp3", volume: 0.16 },
      { src: "sounds/heartbeat.mp3", volume: 0.19 },
      { src: "sounds/lightflicker.mp3", volume: 0.14 },
      { src: "sounds/suspense.mp3", volume: 0.015, fadeTo: 0.14, fadeDuration: 42000 }
    ],
    backgroundSequence: {
      type: "uneasyLoop",
      introImage: "Images/img38.png",
      introDuration: 3000,
      gapDuration: [35, 120],
      segments: [
        {
          images: ["Images/img39.png", "Images/img40.png"],
          classes: ["ending-loop-flash", "ending-loop-flash ending-loop-flash-hard"],
          durations: [90, 180]
        },
        {
          images: ["Images/img41.png"],
          classes: ["ending-loop-flash hospital-flicker"],
          durations: [260, 560]
        },
        {
          images: ["Images/img42.png"],
          classes: ["ending-loop-flash ending-loop-blur"],
          durations: [130, 420]
        },
        {
          images: ["Images/img38.png"],
          classes: ["ending-loop-intro"],
          durations: [1800, 2600]
        }
      ]
    },
    backgroundVideo: "",
    timed: false,
    text: "The hospital room.\n\nThe same room where all of this began.\n\nA wave of dizziness washes over you. Your vision blurs. Your heart pounds violently in your chest. Cold sweat runs down your face as you collapse against the door and slide to the floor. The fluorescent lights above begin to hum louder and louder. The room starts to spin. Colours, sounds, and fragments of memory melt together into a single overwhelming blur.\n\nThen everything goes white.\n\nYou wake up.\n\nHospital bed. Fluorescent lights. Patient wristband.\n\nFor a brief moment, fragments remain: a woman, a little girl, a feeling of loss. But they quickly slip away.\n\nYou do not know where you are.\n\nYou do not know who you are.\n\nOnly that something feels terribly wrong.\n\nAnd once again, you find yourself staring at the drawer beside your bed.",
    endAction: {
      type: "whiteFlashHome",
      flashDuration: 4000
    }
  }
};

function showScene(sceneId) {
  if (sceneId === "ending_check") {
    showScene(empathy > avoidance ? "ending_acceptance" : "ending_loop");
    return;
  }

  clearTimers();
  currentSceneId = sceneId;
  acceptingChoice = false;

  const scene = scenes[sceneId];
  sceneLabel.textContent = scene.title;
  timer.textContent = "";
  hideScreenTimer();
  clearChoiceInfluence();
  choicesBox.innerHTML = "";
  storyText.textContent = "";
  storyPanel.scrollTop = 0;
  storyPanel.classList.remove("is-hidden");
  storyText.classList.remove("complete");

  updateMedia(scene);
  playSceneSounds(scene.sounds);
  typeText(scene.text, () => {
    storyText.classList.add("complete");
    delayHandle = setTimeout(() => {
      if (scene.autoNext) {
        showScene(scene.autoNext);
        return;
      }

      if (scene.endAction) {
        runEndAction(scene.endAction);
        return;
      }

      showChoices(scene);
    }, postTextDelay);
  }, scene.textTriggers);
}

function updateMedia(scene) {
  hideTvOverlay();
  sceneVideo.pause();
  sceneVideo.removeAttribute("src");
  sceneVideo.style.display = "none";
  sceneImage.style.display = "none";
  sceneImage.style.backgroundImage = "";
  sceneImage.style.backgroundColor = "";
  sceneImage.className = "scene-image";
  sceneImageCrossfade.style.display = "none";
  sceneImageCrossfade.style.opacity = "0";
  sceneImageCrossfade.style.transitionDuration = "5000ms";
  sceneImageCrossfade.style.backgroundImage = "";
  sceneImageCrossfade.style.backgroundColor = "";
  sceneImageCrossfade.className = "scene-image scene-image-crossfade";
  mediaPlaceholder.style.display = "block";

  if (scene.backgroundVideo) {
    sceneVideo.src = scene.backgroundVideo;
    sceneVideo.style.display = "block";
    mediaPlaceholder.style.display = "none";
    sceneVideo.play().catch(() => {});
    return;
  }

  if (scene.backgroundImage) {
    sceneImage.style.backgroundImage = `url("${scene.backgroundImage}")`;
    sceneImage.style.backgroundSize = scene.backgroundFit || "cover";
    if (scene.sceneImageClass) {
      sceneImage.classList.add(scene.sceneImageClass);
    }
    sceneImage.style.display = "block";
    mediaPlaceholder.style.display = "none";
  }

  if (scene.tvOverlay) {
    showTvOverlay({
      ...scene.tvOverlay,
      fit: scene.backgroundFit || "cover"
    });
  }

  if (scene.backgroundSequence) {
    playBackgroundSequence(scene.backgroundSequence);
  }
}

function runEndAction(action) {
  if (action.type === "achievedEnding") {
    showAchievedEnding();
    return;
  }

  if (action.type !== "whiteFlashHome") {
    return;
  }

  clearTimeout(sequenceHandle);
  sequenceToken += 1;
  storyPanel.classList.add("is-hidden");
  choicesBox.innerHTML = "";
  timer.textContent = "";
  hideScreenTimer();
  stopSceneSounds();
  setSequenceColorFlash("#fff");

  delayHandle = setTimeout(returnToHomeScreen, action.flashDuration || 4000);
}

function playSceneSounds(sounds = []) {
  stopSceneSounds();

  if (!audioIsUnlocked || sounds.length === 0) {
    return;
  }

  activeSceneSounds = sounds.map((sound) => {
    const audio = new Audio(sound.src);
    audio.loop = sound.loop !== false;
    audio.volume = sound.volume ?? 0.18;
    const record = {
      audio,
      repeatHandles: [],
      startHandle: null,
      fadeHandle: null
    };

    const startSound = () => {
      if (sound.startAt) {
        audio.currentTime = sound.startAt;
      }

      audio.play().catch(() => {});

      if (typeof sound.fadeTo === "number") {
        const startVolume = audio.volume;
        const targetVolume = sound.fadeTo;
        const fadeDuration = sound.fadeDuration || 12000;
        const fadeStartedAt = Date.now();

        record.fadeHandle = setInterval(() => {
          const progress = Math.min((Date.now() - fadeStartedAt) / fadeDuration, 1);
          audio.volume = startVolume + (targetVolume - startVolume) * progress;

          if (progress >= 1) {
            clearInterval(record.fadeHandle);
            record.fadeHandle = null;
          }
        }, 250);
      }

      const repeats = sound.loop === false ? sound.repeats || 1 : 1;
      for (let repeatIndex = 1; repeatIndex < repeats; repeatIndex += 1) {
        const handle = setTimeout(() => {
          audio.currentTime = 0;
          audio.play().catch(() => {});
        }, (sound.repeatDelay || 4000) * repeatIndex);
        record.repeatHandles.push(handle);
      }
    };

    if (sound.delay) {
      record.startHandle = setTimeout(startSound, sound.delay);
    } else {
      startSound();
    }

    return record;
  });
}

function stopSceneSounds() {
  activeSceneSounds.forEach(({ audio, repeatHandles, startHandle, fadeHandle }) => {
    clearTimeout(startHandle);
    clearInterval(fadeHandle);
    repeatHandles.forEach((handle) => clearTimeout(handle));
    audio.pause();
    audio.currentTime = 0;
  });
  activeSceneSounds = [];
}

function unlockAudio() {
  if (audioIsUnlocked) {
    return;
  }

  audioIsUnlocked = true;

  if (document.body.classList.contains("on-home")) {
    playHomeSound();
  }
}

function playHomeSound() {
  playSceneSounds([
    { src: "sounds/homescreensound.mp3", volume: 0.18 }
  ]);
}

function showAchievedEnding() {
  clearTimeout(sequenceHandle);
  sequenceToken += 1;
  storyPanel.classList.add("is-hidden");
  choicesBox.innerHTML = "";
  timer.textContent = "";
  hideScreenTimer();
  endingAchieved.hidden = false;
  endingHomeButton.focus();
}

function returnToHomeScreen() {
  clearTimers();
  empathy = 0;
  avoidance = 0;
  currentSceneId = "wake";
  acceptingChoice = false;
  choicesBox.innerHTML = "";
  storyText.textContent = "";
  storyText.classList.remove("complete");
  storyPanel.classList.remove("is-hidden");
  sceneLabel.textContent = "PATIENT 4";
  timer.textContent = "";
  endingAchieved.hidden = true;
  updateMedia({});
  document.body.classList.add("on-home");
  playHomeSound();
}

function showTvOverlay(overlay) {
  activeTvOverlay = overlay;
  tvOverlayVideo.src = overlay.video;
  tvOverlayBackdrop.style.display = "block";
  tvOverlayVideo.style.display = "block";
  tvOverlayVignette.style.display = "block";
  if (overlay.glitchVideo) {
    tvGlitchVideo.src = overlay.glitchVideo;
    tvGlitchVideo.style.display = "block";
    tvGlitchVideo.play().catch(() => {});
  }
  positionTvOverlay(overlay);
  tvOverlayVideo.play().catch(() => {});
}

function hideTvOverlay() {
  activeTvOverlay = null;
  tvOverlayVideo.pause();
  tvGlitchVideo.pause();
  tvOverlayVideo.removeAttribute("src");
  tvGlitchVideo.removeAttribute("src");
  tvOverlayBackdrop.style.display = "none";
  tvOverlayVideo.style.display = "none";
  tvGlitchVideo.style.display = "none";
  tvOverlayVignette.style.display = "none";
}

function positionTvOverlay(overlay) {
  const stageRect = sceneImage.getBoundingClientRect();
  const scale = overlay.fit === "contain"
    ? Math.min(stageRect.width / overlay.imageWidth, stageRect.height / overlay.imageHeight)
    : Math.max(stageRect.width / overlay.imageWidth, stageRect.height / overlay.imageHeight);
  const renderedWidth = overlay.imageWidth * scale;
  const renderedHeight = overlay.imageHeight * scale;
  const offsetX = (stageRect.width - renderedWidth) / 2;
  const offsetY = (stageRect.height - renderedHeight) / 2;

  tvOverlayVideo.style.left = `${offsetX + overlay.x * scale}px`;
  tvOverlayVideo.style.top = `${offsetY + overlay.y * scale}px`;
  tvOverlayVideo.style.width = `${overlay.width * scale}px`;
  tvOverlayVideo.style.height = `${overlay.height * scale}px`;
  tvGlitchVideo.style.left = `${offsetX + overlay.x * scale}px`;
  tvGlitchVideo.style.top = `${offsetY + overlay.y * scale}px`;
  tvGlitchVideo.style.width = `${overlay.width * scale}px`;
  tvGlitchVideo.style.height = `${overlay.height * scale}px`;
  tvOverlayVignette.style.left = `${offsetX + overlay.x * scale}px`;
  tvOverlayVignette.style.top = `${offsetY + overlay.y * scale}px`;
  tvOverlayVignette.style.width = `${overlay.width * scale}px`;
  tvOverlayVignette.style.height = `${overlay.height * scale}px`;
  tvOverlayBackdrop.style.left = `${offsetX + overlay.x * scale}px`;
  tvOverlayBackdrop.style.top = `${offsetY + overlay.y * scale}px`;
  tvOverlayBackdrop.style.width = `${overlay.width * scale}px`;
  tvOverlayBackdrop.style.height = `${overlay.height * scale}px`;
}

async function playBackgroundSequence(sequence) {
  if (sequence.type === "uneasyLoop") {
    playUneasyLoopSequence(sequence);
    return;
  }

  if (sequence.type === "smoothCrossfade") {
    playSmoothCrossfadeSequence(sequence);
    return;
  }

  const activeToken = ++sequenceToken;
  const frames = sequence.frames || [];

  for (let index = 0; index < frames.length; index += 1) {
    const frame = frames[index];
    setSequenceImage(frame.image);

    if (!frame.duration) {
      return;
    }

    await waitForSequence(frame.duration);
    if (activeToken !== sequenceToken) {
      return;
    }

    setSequenceColorFlash(sequence.flashColor || "#000");
    await waitForSequence(sequence.flashDuration || 120);
    if (activeToken !== sequenceToken) {
      return;
    }
  }
}

async function playSmoothCrossfadeSequence(sequence) {
  const activeToken = ++sequenceToken;

  for (const frame of sequence.frames || []) {
    await waitForSequence(frame.delay || 0);
    if (activeToken !== sequenceToken) {
      return;
    }

    sceneImageCrossfade.className = `scene-image scene-image-crossfade ${frame.className || "deja-vu-frame"}`;
    sceneImageCrossfade.style.transitionDuration = `${frame.duration || 5000}ms`;
    sceneImageCrossfade.style.backgroundImage = `url("${frame.image}")`;
    sceneImageCrossfade.style.backgroundSize = "cover";
    sceneImageCrossfade.style.backgroundColor = "";
    sceneImageCrossfade.style.display = "block";
    sceneImageCrossfade.offsetHeight;
    sceneImageCrossfade.style.opacity = "1";

    await waitForSequence(frame.duration || 5000);
    if (activeToken !== sequenceToken) {
      return;
    }

    sceneImage.style.backgroundImage = `url("${frame.image}")`;
    sceneImage.style.display = "block";
    sceneImageCrossfade.style.transitionDuration = "0ms";
    sceneImageCrossfade.style.opacity = "0";
    await waitForSequence(50);
  }
}

async function playPostTextSequence(sequence, onComplete = () => {}) {
  if (sequence.type !== "whiteGlowToImage") {
    onComplete();
    return;
  }

  const activeToken = ++sequenceToken;
  stopSceneSounds();
  sceneImageCrossfade.className = "scene-image scene-image-crossfade white-glow-layer";
  sceneImageCrossfade.style.backgroundImage = "";
  sceneImageCrossfade.style.backgroundColor = "";
  sceneImageCrossfade.style.display = "block";
  sceneImageCrossfade.style.transitionDuration = `${sequence.glowInDuration || 2600}ms`;
  sceneImageCrossfade.offsetHeight;
  sceneImageCrossfade.style.opacity = "1";

  await waitForSequence(sequence.glowInDuration || 2600);
  if (activeToken !== sequenceToken) {
    return;
  }

  await waitForSequence(sequence.glowHoldDuration || 900);
  if (activeToken !== sequenceToken) {
    return;
  }

  sceneImage.style.backgroundImage = `url("${sequence.image}")`;
  sceneImage.style.backgroundSize = "cover";
  sceneImage.style.display = "block";
  sceneImageCrossfade.style.transitionDuration = `${sequence.glowOutDuration || 3200}ms`;
  sceneImageCrossfade.style.opacity = "0";

  await waitForSequence(sequence.glowOutDuration || 3200);
  if (activeToken !== sequenceToken) {
    return;
  }

  sceneImageCrossfade.style.display = "none";
  onComplete();
}

async function playUneasyLoopSequence(sequence) {
  const activeToken = ++sequenceToken;

  setSequenceImage(sequence.introImage, "ending-loop-intro");
  await waitForSequence(sequence.introDuration || 3000);
  if (activeToken !== sequenceToken) {
    return;
  }

  while (activeToken === sequenceToken) {
    const segment = getRandomSequenceItem(sequence.segments || []);

    if (!segment) {
      return;
    }

    await waitForSequence(randomDuration(sequence.gapDuration || [35, 120]));
    if (activeToken !== sequenceToken) {
      return;
    }

    for (let index = 0; index < segment.images.length; index += 1) {
      setSequenceImage(segment.images[index], segment.classes?.[index] || segment.classes?.[0] || "ending-loop-flash");
      await waitForSequence(randomDuration(segment.durations || [120, 300]));
      if (activeToken !== sequenceToken) {
        return;
      }
    }
  }
}

function getRandomSequenceItem(items) {
  if (!items.length) {
    return null;
  }

  return items[Math.floor(Math.random() * items.length)];
}

function randomDuration(range) {
  if (!Array.isArray(range)) {
    return range;
  }

  const [min, max] = range;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function playDejaVuSequence(sequence, onComplete) {
  const activeToken = ++sequenceToken;

  choicesBox.innerHTML = "";
  storyText.textContent = "";
  storyPanel.scrollTop = 0;
  storyText.classList.remove("complete");

  setSequenceImage(sequence.holdImage);
  await waitForSequence(sequence.holdDuration || 3000);
  if (activeToken !== sequenceToken) {
    return;
  }

  await playDejaVuFlashBurst(sequence, activeToken);
  if (activeToken !== sequenceToken) {
    return;
  }

  setSequenceImage(sequence.holdImage);
  onComplete();

  if (sequence.repeat) {
    repeatDejaVuSequence(sequence, activeToken);
  }
}

async function repeatDejaVuSequence(sequence, activeToken) {
  while (activeToken === sequenceToken) {
    await waitForSequence(sequence.repeatDelay || sequence.holdDuration || 3000);
    if (activeToken !== sequenceToken) {
      return;
    }

    await playDejaVuFlashBurst(sequence, activeToken);
    if (activeToken === sequenceToken) {
      setSequenceImage(sequence.holdImage);
    }
  }
}

async function playDejaVuFlashBurst(sequence, activeToken) {
  for (const image of sequence.flashImages || []) {
    setSequenceWhiteFlash();
    await waitForSequence(sequence.whiteDuration || 75);
    if (activeToken !== sequenceToken) {
      return;
    }

    setSequenceImage(image);
    await waitForSequence(sequence.imageDuration || 130);
    if (activeToken !== sequenceToken) {
      return;
    }
  }

  setSequenceWhiteFlash();
  await waitForSequence(sequence.whiteDuration || 75);
}

function setSequenceImage(imagePath, className = "deja-vu-frame") {
  hideTvOverlay();
  sceneVideo.pause();
  sceneVideo.removeAttribute("src");
  sceneVideo.style.display = "none";
  sceneImage.className = `scene-image ${className}`;
  sceneImage.style.backgroundColor = "";
  sceneImage.style.backgroundImage = `url("${imagePath}")`;
  sceneImage.style.backgroundSize = "cover";
  sceneImage.style.display = "block";
  mediaPlaceholder.style.display = "none";
}

function setSequenceWhiteFlash() {
  setSequenceColorFlash("#fff");
}

function setSequenceColorFlash(color) {
  hideTvOverlay();
  sceneImage.className = "scene-image deja-vu-white";
  sceneImage.style.backgroundImage = "";
  sceneImage.style.backgroundColor = color;
  sceneImage.style.display = "block";
  mediaPlaceholder.style.display = "none";
}

function waitForSequence(duration) {
  return new Promise((resolve) => {
    clearTimeout(sequenceHandle);
    sequenceHandle = setTimeout(resolve, duration);
  });
}

function showVhsPlayback(choice) {
  const playback = choice.vhsPlayback;
  clearVhsPlayback();
  stopSceneSounds();
  updateMedia({ backgroundImage: playback.posterImage || choice.resultBackgroundImage || "Images/img28.png" });
  choicesBox.innerHTML = "";
  storyText.textContent = "";
  storyText.classList.add("complete");
  storyPanel.scrollTop = 0;
  storyPanel.classList.add("is-hidden");
  vhsPlayButton.hidden = false;
  vhsPlayButton.disabled = false;
  vhsPlayButton.focus();

  vhsPlayButton.onclick = () => startVhsPlayback(choice);
}

function startVhsPlayback(choice) {
  const playback = choice.vhsPlayback;
  const activeToken = ++vhsPlaybackToken;
  let lastFrame = "";

  vhsPlayButton.hidden = true;
  vhsPlayButton.disabled = true;

  vhsAudio = new Audio(playback.audio);
  vhsAudio.volume = playback.volume ?? 0.78;
  if (playback.staticAudio) {
    vhsStaticAudio = new Audio(playback.staticAudio);
    vhsStaticAudio.loop = true;
    vhsStaticAudio.volume = playback.staticVolume ?? 0.05;
  }

  vhsAudio.addEventListener("ended", () => {
    if (activeToken !== vhsPlaybackToken) {
      return;
    }

    clearInterval(vhsFrameHandle);
    vhsFrameHandle = null;
    showScene(choice.next);
  }, { once: true });

  vhsFrameHandle = setInterval(() => {
    if (activeToken !== vhsPlaybackToken) {
      return;
    }

    const nextFrame = getRandomVhsFrame(playback.frames, lastFrame);
    lastFrame = nextFrame;
    setSequenceImage(nextFrame);
  }, playback.frameDuration || 160);

  const firstFrame = getRandomVhsFrame(playback.frames, lastFrame);
  lastFrame = firstFrame;
  setSequenceImage(firstFrame);

  vhsAudio.play().catch(() => {
    if (activeToken !== vhsPlaybackToken) {
      return;
    }

    clearInterval(vhsFrameHandle);
    vhsFrameHandle = null;
    showScene(choice.next);
  });
  if (playback.brokenEffect) {
    startBrokenVhsAudioEffect(vhsAudio);
  }
  vhsStaticAudio?.play().catch(() => {});
}

function startBrokenVhsAudioEffect(audio) {
  clearInterval(vhsBrokenHandle);
  vhsBrokenHandle = setInterval(() => {
    audio.playbackRate = 0.92 + Math.random() * 0.16;

    if (Math.random() < 0.28) {
      const previousVolume = audio.volume;
      audio.volume = Math.max(previousVolume * 0.38, 0.08);
      setTimeout(() => {
        if (vhsAudio === audio) {
          audio.volume = previousVolume;
        }
      }, 90 + Math.random() * 180);
    }
  }, 650);
}

function getRandomVhsFrame(frames, previousFrame) {
  if (!frames || frames.length === 0) {
    return previousFrame;
  }

  if (frames.length === 1) {
    return frames[0];
  }

  let nextFrame = previousFrame;
  while (nextFrame === previousFrame) {
    nextFrame = frames[Math.floor(Math.random() * frames.length)];
  }

  return nextFrame;
}

function clearVhsPlayback() {
  clearInterval(vhsFrameHandle);
  clearInterval(vhsBrokenHandle);
  vhsFrameHandle = null;
  vhsBrokenHandle = null;
  vhsPlaybackToken += 1;
  vhsPlayButton.hidden = true;
  vhsPlayButton.disabled = false;
  vhsPlayButton.onclick = null;

  if (vhsAudio) {
    vhsAudio.pause();
    vhsAudio.currentTime = 0;
    vhsAudio = null;
  }

  if (vhsStaticAudio) {
    vhsStaticAudio.pause();
    vhsStaticAudio.currentTime = 0;
    vhsStaticAudio = null;
  }
}

function typeText(text, onComplete, triggers = []) {
  clearTimeout(typewriterHandle);
  typewriterState = {
    text,
    index: 0,
    onComplete,
    triggers: prepareTextTriggers(text, triggers)
  };

  addNextTypewriterCharacter();
}

function addNextTypewriterCharacter() {
  if (!typewriterState) {
    return;
  }

  const { text } = typewriterState;
  storyText.textContent = text.slice(0, typewriterState.index);
  storyPanel.scrollTop = storyPanel.scrollHeight;
  checkTypewriterTriggers(typewriterState.index);
  typewriterState.index += 1;

  if (typewriterState.index <= text.length) {
    typewriterHandle = setTimeout(addNextTypewriterCharacter, typewriterSpeed);
    return;
  }

  finishTypewriter();
}

function finishTypewriter() {
  if (!typewriterState) {
    return;
  }

  const onComplete = typewriterState.onComplete;
  typewriterState = null;
  onComplete();
}

function completeCurrentSentence() {
  if (!typewriterState) {
    return false;
  }

  clearTimeout(typewriterHandle);

  const { text } = typewriterState;
  const visibleIndex = Math.max(0, typewriterState.index - 1);
  const sentenceEnd = findSentenceEnd(text, visibleIndex);
  storyText.textContent = text.slice(0, sentenceEnd);
  storyPanel.scrollTop = storyPanel.scrollHeight;
  checkTypewriterTriggers(sentenceEnd);
  typewriterState.index = sentenceEnd + 1;

  if (sentenceEnd >= text.length) {
    finishTypewriter();
    return true;
  }

  typewriterHandle = setTimeout(addNextTypewriterCharacter, typewriterSpeed);
  return true;
}

function findSentenceEnd(text, startIndex) {
  for (let index = startIndex; index < text.length; index += 1) {
    if (isSentencePunctuation(text[index])) {
      let endIndex = index + 1;

      while (endIndex < text.length && isClosingSentenceCharacter(text[endIndex])) {
        endIndex += 1;
      }

      return endIndex;
    }
  }

  return text.length;
}

function prepareTextTriggers(text, triggers) {
  return triggers
    .map((trigger) => ({
      ...trigger,
      index: text.indexOf(trigger.at),
      hasRun: false
    }))
    .filter((trigger) => trigger.index >= 0);
}

function checkTypewriterTriggers(visibleIndex) {
  if (!typewriterState) {
    return;
  }

  typewriterState.triggers.forEach((trigger) => {
    if (trigger.hasRun || visibleIndex < trigger.index) {
      return;
    }

    trigger.hasRun = true;
    if (trigger.sequence) {
      playPostTextSequence(trigger.sequence);
    }
    if (trigger.sound) {
      playOneShotSound(trigger.sound);
    }
  });
}

function playOneShotSound(sound) {
  if (!audioIsUnlocked) {
    return;
  }

  const audio = new Audio(sound.src);
  audio.volume = sound.volume ?? 0.18;
  audio.play().catch(() => {});
}

function isSentencePunctuation(character) {
  return character === "." || character === "!" || character === "?";
}

function isClosingSentenceCharacter(character) {
  return character === "\"" || character === "'" || character === ")" || character === "]" || character === "}";
}

function showChoices(scene) {
  choicesBox.innerHTML = "";

  scene.choices.forEach((choice) => {
    const button = document.createElement("button");
    button.className = "choice-button";
    button.type = "button";
    button.textContent = choice.text;
    button.addEventListener("click", () => chooseOption(choice, button));
    choicesBox.appendChild(button);
  });

  if (scene.timed !== false) {
    choicesAreInfluenced = true;
    choicesBox.classList.add("influence-active");
    updateChoiceInfluence(lastMouseX);
    startChoiceTimer(scene);
  }
}

function startChoiceTimer(scene) {
  let remaining = choiceTimerSeconds;
  updateTimers(remaining);
  screenTimer.classList.add("active");

  countdownHandle = setInterval(() => {
    remaining -= 1;
    updateTimers(remaining);

    if (remaining <= 0) {
      const buttons = Array.from(choicesBox.querySelectorAll("button"));
      const selectedIndex = getMouseInfluencedChoiceIndex(scene);
      const defaultChoice = scene.choices[selectedIndex];
      const defaultButton = buttons[selectedIndex];
      if (defaultButton) {
        defaultButton.classList.add("auto-selected");
      }
      chooseOption(defaultChoice, defaultButton);
    }
  }, 1000);
}

function getMouseInfluencedChoiceIndex(scene) {
  if (scene.choices.length <= 1) {
    return 0;
  }

  return lastMouseX < window.innerWidth / 2 ? 0 : 1;
}

function chooseOption(choice, button) {
  if (acceptingChoice) {
    return;
  }

  acceptingChoice = true;
  clearInterval(countdownHandle);
  clearTimeout(sequenceHandle);
  sequenceToken += 1;
  timer.textContent = "";
  hideScreenTimer();
  clearChoiceInfluence();
  disableChoiceButtons();

  if (button) {
    button.classList.add("auto-selected");
  }

  empathy += choice.empathy || 0;
  avoidance += choice.avoidance || 0;

  if (choice.restart) {
    empathy = 0;
    avoidance = 0;
    showScene("wake");
    return;
  }

  if (choice.vhsPlayback) {
    showVhsPlayback(choice);
    return;
  }

  if (choice.result) {
    choicesBox.innerHTML = "";
    clearChoiceInfluence();

    if (choice.dejaVuSequence) {
      playDejaVuSequence(choice.dejaVuSequence, () => showChoiceResult(choice));
      return;
    }

    showChoiceResult(choice);
  } else {
    showScene(choice.next);
  }
}

function showChoiceResult(choice) {
  if (choice.resultBackgroundImage) {
    updateMedia({ backgroundImage: choice.resultBackgroundImage, sceneImageClass: choice.resultImageClass });
  }

  if (choice.resultSound) {
    playOneShotSound(choice.resultSound);
  }

  storyPanel.classList.remove("is-hidden");
  storyText.classList.remove("complete");
  storyPanel.scrollTop = 0;
  typeText(choice.result, () => {
    storyText.classList.add("complete");
    delayHandle = setTimeout(() => showScene(choice.next), postTextDelay);
  });
}

function disableChoiceButtons() {
  choicesBox.querySelectorAll("button").forEach((button) => {
    button.disabled = true;
  });
}

function clearTimers() {
  clearTimeout(typewriterHandle);
  typewriterState = null;
  clearTimeout(delayHandle);
  clearInterval(countdownHandle);
  clearTimeout(sequenceHandle);
  sequenceToken += 1;
  clearVhsPlayback();
  endingAchieved.hidden = true;
  hideScreenTimer();
  clearChoiceInfluence();
}

function updateChoiceInfluence(pointerX) {
  lastMouseX = pointerX;

  if (!choicesAreInfluenced) {
    return;
  }

  choicesBox.classList.toggle("influence-left", pointerX < window.innerWidth / 2);
  choicesBox.classList.toggle("influence-right", pointerX >= window.innerWidth / 2);
}

function clearChoiceInfluence() {
  choicesAreInfluenced = false;
  choicesBox.classList.remove("influence-active", "influence-left", "influence-right");
}

function updateTimers(remaining) {
  const visibleTime = Math.max(remaining, 0);
  const progressPercent = (visibleTime / choiceTimerSeconds) * 100;

  timer.textContent = `Choose: ${visibleTime}`;
  screenTimerNumber.textContent = visibleTime;
  screenTimerFill.style.width = `${progressPercent}%`;
}

function hideScreenTimer() {
  screenTimer.classList.remove("active");
  screenTimerNumber.textContent = choiceTimerSeconds;
  screenTimerFill.style.width = "100%";
}

// TEMP TEST NAVIGATION: delete this function and the call below when the story is final.
function setupTestNavigation() {
  function jumpBy(direction) {
    unlockAudio();
    stopSceneSounds();
    const currentIndex = sceneOrder.indexOf(currentSceneId);
    const nextIndex = Math.min(Math.max(currentIndex + direction, 0), sceneOrder.length - 1);
    empathy = 0;
    avoidance = 0;
    document.body.classList.remove("on-home");
    showScene(sceneOrder[nextIndex]);
  }

  prevSceneButton.addEventListener("click", () => jumpBy(-1));
  nextSceneButton.addEventListener("click", () => jumpBy(1));

  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      jumpBy(-1);
    }

    if (event.key === "ArrowRight") {
      jumpBy(1);
    }
  });
}

function startGame() {
  unlockAudio();
  stopSceneSounds();
  empathy = 0;
  avoidance = 0;
  endingAchieved.hidden = true;
  closeAbout();
  document.body.classList.remove("on-home");
  showScene("wake");
}

function openAbout() {
  aboutOverlay.hidden = false;
  aboutCloseButton.focus();
}

function closeAbout() {
  aboutOverlay.hidden = true;
}

startButton.addEventListener("click", startGame);
endingHomeButton.addEventListener("click", returnToHomeScreen);
aboutButton.addEventListener("click", openAbout);
aboutCloseButton.addEventListener("click", closeAbout);
document.addEventListener("pointerdown", unlockAudio, { once: true });
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !aboutOverlay.hidden) {
    closeAbout();
    aboutButton.focus();
    return;
  }

  if (event.code !== "Space" || event.repeat) {
    return;
  }

  if (completeCurrentSentence()) {
    event.preventDefault();
  }
});
document.addEventListener("pointermove", (event) => {
  updateChoiceInfluence(event.clientX);
});
window.addEventListener("resize", () => {
  if (activeTvOverlay) {
    positionTvOverlay(activeTvOverlay);
  }

  updateChoiceInfluence(Math.min(lastMouseX, window.innerWidth));
});
setupTestNavigation();
