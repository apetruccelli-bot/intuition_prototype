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
let activeTvOverlay = null;
let acceptingChoice = false;
let choicesAreInfluenced = false;
let lastMouseX = window.innerWidth / 2;

const storyText = document.getElementById("storyText");
const storyPanel = storyText.parentElement;
const choicesBox = document.getElementById("choices");
const sceneLabel = document.getElementById("sceneLabel");
const timer = document.getElementById("timer");
const screenTimer = document.getElementById("screenTimer");
const screenTimerNumber = document.getElementById("screenTimerNumber");
const screenTimerFill = document.getElementById("screenTimerFill");
const sceneVideo = document.getElementById("sceneVideo");
const sceneImage = document.getElementById("sceneImage");
const tvOverlayBackdrop = document.getElementById("tvOverlayBackdrop");
const tvOverlayVideo = document.getElementById("tvOverlayVideo");
const tvGlitchVideo = document.getElementById("tvGlitchVideo");
const tvOverlayVignette = document.getElementById("tvOverlayVignette");
const mediaPlaceholder = document.getElementById("mediaPlaceholder");
const prevSceneButton = document.getElementById("prevSceneButton");
const nextSceneButton = document.getElementById("nextSceneButton");
const startButton = document.getElementById("startButton");

// TEMP TEST NAVIGATION: delete sceneOrder and setupTestNavigation when the story is final.
const sceneOrder = [
  "wake",
  "corridor",
  "after_helping",
  "after_questioning",
  "cafeteria",
  "cafeteria_drawing",
  "cafeteria_girl",
  "office",
  "return",
  "ending_acceptance",
  "ending_loop"
];

const scenes = {
  wake: {
    title: "Scene 1 / Wake Up",
    backgroundImage: "Images/img2.png",
    backgroundVideo: "",
    sceneImageClass: "hospital-flicker",
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
    text: "You continue down the corridor. The woman's crying fades behind you, but the sound stays inside your head. You do not know who she is, or why she looked at you that way. Still, something about helping her feels strangely familiar, as if your body remembered something your mind could not.",
    autoNext: "after_questioning"
  },
  after_questioning: {
    title: "Scene 3B / After Questioning",
    backgroundImage: "Images/img7.png",
    backgroundFit: "contain",
    backgroundVideo: "",
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
    text: "You arrive at what appears to be the cafeteria of the facility. Food trays are still perfectly laid out on the tables, as if everyone left suddenly, without warning. The room smells faintly of dust and something sweet that has gone stale.",
    autoNext: "cafeteria_drawing"
  },
  cafeteria_drawing: {
    title: "Scene 4B / The Drawing",
    backgroundImage: "Images/img11.png",
    backgroundVideo: "",
    text: "On one table, you find a child's drawing. It shows a little girl holding a balloon, a house, a loving family, and a car in the distance. In the middle of the paper, written in uneven handwriting, are the words: \"Was it a mistake?\"",
    autoNext: "cafeteria_girl"
  },
  cafeteria_girl: {
    title: "Scene 4C / The Girl",
    backgroundImage: "Images/img12.png",
    sceneImageClass: "hospital-flicker",
    backgroundVideo: "",
    text: "You place the drawing back on the table. When you look up, a little girl is standing across the room. She was not there a second ago. She is holding the same red balloon from the drawing. For a moment she simply watches you. Then she points her little finger directly at you.\n\n\"I know you.\"\n\nYour throat tightens. The room suddenly feels smaller. The girl takes a step closer.\n\n\"Have you seen my mommy?\"\n\nYou say nothing. The girl tilts her head.\n\n\"You always forget the important part.\"",
    choices: [
      {
        text: "How do you know me?",
        avoidance: 1,
        avoidant: true,
        result: "The girl looks at you with wide, curious eyes. \"Because you were there.\" You feel your chest tighten. \"There was a loud noise.\" She points toward an empty space beside you. \"The car stopped.\" A pause. A flash: a rearview mirror, a shadow moving. Your heart begins to race. The girl lowers her gaze. \"When I fell down, you were the first one who came running.\"",
        next: "office"
      },
      {
        text: "Take her hand and bring her to her mommy.",
        empathy: 1,
        result: "Somewhere deep inside, you know the woman you met earlier is her mother. You cannot explain how. You simply know. The little girl takes your hand, and together you begin walking down the corridor. Her hand feels warm. Real. As you walk, a sudden flash tears through your mind: a rearview mirror, a shadow moving. Your heart begins to race. The image vanishes as quickly as it came. The girl looks up at you. \"My mommy told me you came to see me every week.\" A sharp pain shoots through your head. Another memory: a hospital room, flowers on a windowsill, a stuffed rabbit sitting on a chair. Then darkness. The girl lowers her eyes to the floor. \"You always cried when you thought I was asleep.\" For a moment, the corridor seems to spin around you. And for the first time, you begin to understand why.",
        next: "office"
      }
    ]
  },
  office: {
    title: "Scene 5 / The Office",
    backgroundImage: "",
    backgroundVideo: "",
    text: "You leave the girl behind and continue searching for an exit. As you walk in an unknown direction, you stumble across an office room. You enter. The fluorescent lights buzz overhead.\n\nOn the desk sits a patient file. Across the front, it reads: PATIENT 4 - CARL DARWOOD.\n\nBeside it is a VHS cassette already loaded into a television. The screen flickers with static. Then your own voice breaks through:\n\n\"Please, I can't live with this guilt anymore.\"\n\nThe tape cuts out.",
    choices: [
      {
        text: "Open and read the file.",
        result: "You open the file.\n\nPATIENT FILE #4\nPATIENT 4 - CARL DARWOOD\nAge: 47\nStatus: Active Participant\nProgram: Cognitive Memory Suppression Trial\nDate of Admission: Redacted\n\nBackground: Patient exhibits severe symptoms of persistent guilt, recurring nightmares, obsessive recollection, and resistance to conventional therapy. Patient reports inability to move beyond a traumatic life event despite repeated treatment attempts.\n\nProcedure Notes: Subject voluntarily entered the Cognitive Memory Suppression Program. Objective: selective removal of traumatic memory clusters. Procedure authorized by patient.\n\nPsychological Evaluation: Patient repeatedly expresses belief that: \"I should have done something.\" Patient demonstrates difficulty accepting external assessments regarding responsibility. Recommendation: proceed with suppression protocol.\n\nComplication Report: Session 7 interrupted. Unexpected neurological activity detected. Memory isolation unsuccessful. Patient transferred to intensive monitoring.\n\nFinal Status: Incomplete. Further notes unavailable. Access restricted.",
        next: "return"
      },
      {
        text: "Listen to the VHS tape recording.",
        result: "The VHS recording begins with static. Then you see yourself sitting across from a therapist. You look exhausted, older than you expected, hollowed out by something you cannot remember.\n\nThe therapist asks, \"Do you understand what the procedure is intended to do?\"\n\nYour recorded self nods.\n\n\"I don't want to forget everything,\" you say. \"Just this. Just enough to keep living.\"\n\nThe therapist pauses. \"The court cleared you. Her family gave statements in your support. You know that.\"\n\nYour recorded self begins to cry.\n\n\"Knowing isn't the same as believing it.\"\n\nThe tape distorts. For a moment, the screen shows only static. Then your voice returns, quieter.\n\n\"Please. I can't live with this guilt anymore.\"\n\nThe tape cuts out.",
        next: "return"
      }
    ]
  },
  return: {
    title: "Scene 6 / The Return",
    backgroundImage: "",
    backgroundVideo: "",
    text: "You step out of the room, your head spinning. The procedure. The missing memories. None of it makes sense. How could you have forgotten something so important? You wander through the corridors in a daze, barely aware of where you are going.\n\nThen you see them.\n\nAt the far end of the hallway stand the woman and the little girl. Hand in hand. Neither of them speaks. Neither of them looks at you. They simply walk forward at a slow, steady pace. The woman keeps her eyes fixed ahead. The little girl clutches her red balloon.\n\nFor a moment, you wonder if they have seen you at all. Then the girl turns her head, just slightly, enough to make your stomach drop. A wave of guilt crashes over you. Your chest tightens. Every instinct tells you to run. To turn around. To disappear before they get any closer. But you cannot move.\n\nThe distance between you grows smaller. Step by step. The fluorescent lights hum overhead. The little girl never takes her eyes off you. And with every step they take, a terrible feeling grows inside you.\n\nSomewhere deep down, you already know why.",
    choices: [
      {
        text: "Listen to your instincts.",
        avoidance: 2,
        avoidant: true,
        result: "With the last bit of courage, or perhaps pure panic, you turn and run. You do not look back. Your footsteps echo through the endless corridors as you desperately try to put as much distance between yourself and them as possible.",
        next: "ending_check"
      },
      {
        text: "Do not listen to your instincts.",
        empathy: 2,
        result: "Something deep inside tells you to stay. To stop running. To face them.",
        next: "ending_check"
      }
    ]
  },
  ending_acceptance: {
    title: "Ending / Acceptance",
    backgroundImage: "",
    backgroundVideo: "",
    timed: false,
    text: "Something deep inside tells you to stay. To stop running. To face them. The woman and the little girl walk toward you, hand in hand. As they get closer, the fear that had been gripping you begins to fade. Neither of them looks angry. Neither of them looks disappointed. Only sad.\n\n\"Do you remember now?\" the little girl asks.\n\nFragments of memory rush through your mind. The driveway. The sunlight. The sound of laughter. The hospital. The courtroom. The years of guilt that followed.\n\n\"It wasn't your fault,\" the woman says gently.\n\n\"I ran behind the car,\" the little girl adds. \"You did everything you could.\"\n\nThe woman steps closer.\n\n\"My family forgave you. The court forgave you. But you never forgave yourself.\"\n\nThe little girl reaches for your hand.\n\n\"You can let it go now.\"\n\nA warm light begins to fill the corridor. The walls of the facility dissolve around you. For the first time, the place does not feel frightening. It feels peaceful.\n\nYou close your eyes.\n\nWhen you open them again, you are back in the hospital. Five years have passed. And for the first time since the accident, you feel at peace.",
    choices: [
      {
        text: "Begin again.",
        restart: true
      }
    ]
  },
  ending_loop: {
    title: "Ending / Loop",
    backgroundImage: "",
    backgroundVideo: "",
    timed: false,
    text: "With the last bit of courage, or perhaps pure panic, you turn and run. You do not look back. Your footsteps echo through the endless corridors as you desperately try to put as much distance between yourself and them as possible. Eventually, breathless and exhausted, you find yourself standing in front of a familiar door.\n\nThe hospital room.\n\nThe same room where all of this began.\n\nA wave of dizziness washes over you. Your vision blurs. Your heart pounds violently in your chest. Cold sweat runs down your face as you collapse against the door and slide to the floor. The fluorescent lights above begin to hum louder and louder. The room starts to spin. Colours, sounds, and fragments of memory melt together into a single overwhelming blur.\n\nThen everything goes white.\n\nYou wake up.\n\nHospital bed. Fluorescent lights. Patient wristband.\n\nFor a brief moment, fragments remain: a woman, a little girl, a feeling of loss. But they quickly slip away.\n\nYou do not know where you are.\n\nYou do not know who you are.\n\nOnly that something feels terribly wrong.\n\nAnd once again, you find yourself staring at the drawer beside your bed.",
    choices: [
      {
        text: "Begin again.",
        restart: true
      }
    ]
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
  storyText.classList.remove("complete");

  updateMedia(scene);
  typeText(scene.text, () => {
    storyText.classList.add("complete");
    delayHandle = setTimeout(() => {
      if (scene.autoNext) {
        showScene(scene.autoNext);
        return;
      }

      showChoices(scene);
    }, postTextDelay);
  });
}

function updateMedia(scene) {
  hideTvOverlay();
  sceneVideo.pause();
  sceneVideo.removeAttribute("src");
  sceneVideo.style.display = "none";
  sceneImage.style.display = "none";
  sceneImage.style.backgroundImage = "";
  sceneImage.className = "scene-image";
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

function typeText(text, onComplete) {
  clearTimeout(typewriterHandle);
  typewriterState = {
    text,
    index: 0,
    onComplete
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

    if (choice.result) {
      if (choice.resultBackgroundImage) {
        updateMedia({ backgroundImage: choice.resultBackgroundImage, sceneImageClass: choice.resultImageClass });
      }

      choicesBox.innerHTML = "";
    clearChoiceInfluence();
    storyText.classList.remove("complete");
    storyPanel.scrollTop = 0;
    typeText(choice.result, () => {
      storyText.classList.add("complete");
      delayHandle = setTimeout(() => showScene(choice.next), postTextDelay);
    });
  } else {
    showScene(choice.next);
  }
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
  empathy = 0;
  avoidance = 0;
  document.body.classList.remove("on-home");
  showScene("wake");
}

startButton.addEventListener("click", startGame);
document.addEventListener("keydown", (event) => {
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
