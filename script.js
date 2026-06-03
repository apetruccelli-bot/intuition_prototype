const scenes = [
  {
    title: "The Last Door",
    text: "You wake up on the floor of a building you do not recognize.\n\nThe lights flicker above you. A speaker whispers:\n\n\"Do not think too long. The first answer is usually the truest.\"",
    choices: [
      { label: "Begin", scores: {}, nextText: "" },
      { label: "Begin", scores: {}, nextText: "" }
    ]
  },
  {
    title: "The Knock",
    text: "A door in front of you begins to knock from the other side.\n\nThree slow knocks.\n\nA voice says: \"Please. I can help you.\"",
    choices: [
      { label: "Open the door", scores: { trust: 1 }, nextText: "You open it. The corridor behind it is empty. On the floor, someone has left a small brass key." },
      { label: "Step away", scores: { fear: 1, self: 1 }, nextText: "You step away. The knocking stops. When you look down, a small brass key is lying beside your foot." }
    ]
  },
  {
    title: "The Elevator",
    text: "You reach an elevator. The doors are open, but the inside is completely dark.\n\nBeside it, a staircase descends into a narrow emergency passage.\n\n\"One way is faster. One way is safer. Neither is what it seems.\"",
    choices: [
      { label: "Take the elevator", scores: { curiosity: 1, trust: 1 }, nextText: "The elevator drops for too long. When the doors open, your hands are shaking." },
      { label: "Take the stairs", scores: { fear: 1, self: 1 }, nextText: "The stairs seem endless. When you finally reach the bottom, your legs are shaking." }
    ]
  },
  {
    title: "The Crying Room",
    text: "You hear someone crying behind a half-open door.\n\nInside, a room full of chairs faces a blank wall. Written in pencil:\n\n\"Some things only follow you if you notice them.\"",
    choices: [
      { label: "Enter the room", scores: { curiosity: 1, trust: 1 }, nextText: "The chairs are empty. But one chair is still warm." },
      { label: "Keep walking", scores: { fear: 1, self: 1 }, nextText: "Behind you, one chair scrapes across the floor." }
    ]
  },
  {
    title: "The Stranger",
    text: "At the end of the hallway, a person stands with their back to you.\n\nThey are wearing your jacket.\n\nThey say: \"You are going the wrong way.\"",
    choices: [
      { label: "Believe them", scores: { trust: 1 }, nextText: "You turn back. The hallway behind you has changed." },
      { label: "Ignore them", scores: { self: 1, curiosity: 1 }, nextText: "You continue. The hallway in front of you has changed." }
    ]
  },
  {
    title: "The Red Door",
    text: "The brass key fits a red door.\n\nBefore you unlock it, the speaker says:\n\n\"Behind this door is the truth. Behind you is the exit.\"",
    choices: [
      { label: "Open the red door", scores: { curiosity: 1 }, nextText: "Inside is a mirror, but your reflection is delayed by a few seconds." },
      { label: "Look for the exit", scores: { self: 1, fear: 1 }, nextText: "The exit sign is glowing, but the door beneath it has no handle." }
    ]
  },
  {
    title: "Final Choice",
    text: "The building goes silent.\n\nIn front of you are two doors.\n\nOne says REMEMBER.\nThe other says LEAVE.\n\n\"You have been choosing yourself this whole time.\"",
    choices: [
      { label: "REMEMBER", scores: { curiosity: 1, trust: 1 }, nextText: "" },
      { label: "LEAVE", scores: { self: 1, fear: 1 }, nextText: "" }
    ]
  }
];

const endings = {
  trust: "You trusted the signs. Every voice, knock, and shadow was not trying to trap you. They were trying to guide you. On your palm, written in pencil: You knew before you understood.",
  fear: "You leave alive, but the building disappears behind you. For the rest of the night, you feel something standing just behind your shoulder. You survived because you were careful, but you will never know what was calling you.",
  self: "You chose survival. The exit opens only after you stop looking back. Outside, the air feels real, but strangely empty. Nothing followed you. Nothing saved you either.",
  curiosity: "You choose to remember. The mirror becomes a window. You see yourself entering the building again and again, making different choices each time. The building was not testing whether you were right. It was revealing how you decide when you cannot know.",
  balanced: "You hesitate. The two doors disappear. The speaker whispers: Intuition is not certainty. It is movement before explanation. When the lights return, you are outside. You do not remember leaving. But you know you chose."
};

let sceneIndex = 0;
let scores = { trust: 0, fear: 0, curiosity: 0, self: 0 };
let timer = 10;
let interval;
let audioStarted = false;
let audioCtx, oscillator, panner, gain;

const titleEl = document.getElementById("title");
const textEl = document.getElementById("text");
const choicesEl = document.getElementById("choices");
const timerEl = document.getElementById("timer");
const sceneCountEl = document.getElementById("sceneCount");
const restartBtn = document.getElementById("restart");
const gameEl = document.getElementById("game");

function startAudio() {
  if (audioStarted) return;
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  oscillator = audioCtx.createOscillator();
  gain = audioCtx.createGain();
  panner = audioCtx.createStereoPanner();
  oscillator.type = "sine";
  oscillator.frequency.value = 84;
  gain.gain.value = 0.025;
  oscillator.connect(gain).connect(panner).connect(audioCtx.destination);
  oscillator.start();
  audioStarted = true;
}

function showScene(extraText = "") {
  clearInterval(interval);
  const scene = scenes[sceneIndex];
  titleEl.textContent = scene.title;
  textEl.textContent = extraText ? `${extraText}\n\n${scene.text}` : scene.text;
  choicesEl.innerHTML = "";
  sceneCountEl.textContent = sceneIndex === 0 ? "opening" : `scene ${sceneIndex} / ${scenes.length - 1}`;

  scene.choices.forEach((choice, i) => {
    const btn = document.createElement("button");
    btn.className = "choice";
    btn.textContent = choice.label;
    btn.onclick = () => choose(choice, i);
    choicesEl.appendChild(btn);
  });

  startTimer();
}

function startTimer() {
  timer = sceneIndex === 0 ? 99 : 30;
  timerEl.textContent = sceneIndex === 0 ? "∞" : timer;
  interval = setInterval(() => {
    if (sceneIndex === 0) return;
    timer--;
    timerEl.textContent = timer;
    if (timer <= 3) gameEl.classList.add("pulse");
    else gameEl.classList.remove("pulse");
    if (timer <= 0) {
      const randomChoice = scenes[sceneIndex].choices[Math.floor(Math.random() * 2)];
      choose(randomChoice);
    }
  }, 1000);
}

function choose(choice, choiceIndex = 0) {
  startAudio();
  clearInterval(interval);
  gameEl.classList.remove("pulse");

  Object.keys(choice.scores).forEach(key => {
    scores[key] += choice.scores[key];
  });

  if (audioStarted && sceneIndex > 0) {
    panner.pan.setTargetAtTime(choiceIndex === 0 ? -0.45 : 0.45, audioCtx.currentTime, 0.2);
    oscillator.frequency.setTargetAtTime(80 + (scores.curiosity * 8) + (scores.fear * 3), audioCtx.currentTime, 0.3);
  }

  sceneIndex++;
  if (sceneIndex >= scenes.length) {
    showEnding();
  } else {
    showScene(choice.nextText);
  }
}

function showEnding() {
  clearInterval(interval);
  sceneCountEl.textContent = "ending";
  timerEl.textContent = "";
  choicesEl.innerHTML = "";
  restartBtn.classList.remove("hidden");

  const values = Object.entries(scores);
  values.sort((a, b) => b[1] - a[1]);
  const [topKey, topVal] = values[0];
  const [, secondVal] = values[1];
  const endingKey = topVal === secondVal ? "balanced" : topKey;

  titleEl.textContent = "Ending";
  textEl.textContent = endings[endingKey] + `\n\nHidden scores: Trust ${scores.trust}, Fear ${scores.fear}, Curiosity ${scores.curiosity}, Self-preservation ${scores.self}`;

  if (audioStarted) {
    gain.gain.setTargetAtTime(0.01, audioCtx.currentTime, 1);
    panner.pan.setTargetAtTime(0, audioCtx.currentTime, 1);
  }
}

restartBtn.onclick = () => {
  sceneIndex = 0;
  scores = { trust: 0, fear: 0, curiosity: 0, self: 0 };
  restartBtn.classList.add("hidden");
  showScene();
};

showScene();
