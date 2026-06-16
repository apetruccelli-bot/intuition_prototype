# BEFORE YOU THINK — story.md

## Game concept

**Before You Think** is a short interactive narrative game about intuition, memory, guilt, avoidance, and acceptance.

The player wakes up in a strange facility that feels like a mixture of hospital, research center, and dream. They do not remember who they are or why they are there. Through encounters, documents, recordings, and fragmented memories, they slowly discover that they are **Carl Darwood**, a man who voluntarily entered a memory-erasure procedure after an unavoidable accident involving a little girl. The procedure failed and Carl fell into a coma.

The game has two hidden scores:

- **Empathy**: moving toward people, discomfort, memory, and emotional truth.
- **Avoidance**: moving away from pain, fear, confrontation, and responsibility.

The player always discovers the main truth, but the ending changes depending on whether Empathy or Avoidance is higher.

Recommended mechanic: each major choice has a short timer, around **8–10 seconds**, to push the player to decide before fully rationalizing.

---

# Visual / Interaction Requirements

These requirements should be included when building the prototype in HTML/CSS/JavaScript.

## Background media area

Each scene should include a large background area reserved for future images or videos. The story text and choices should appear as an overlay on top of this media area, so visual assets can be added later without changing the structure of the game.

Suggested asset fields for each scene:

```js
backgroundImage: "assets/images/scene-name.jpg",
backgroundVideo: "assets/videos/scene-name.mp4",
ambientAudio: "assets/audio/scene-name.mp3"
```

If no image or video is available yet, the background should show a placeholder gradient, grain, static, or simple dark/clinical environment.

## Typewriter text

Scene text should appear with a typewriter effect, letter by letter, instead of appearing all at once. This gives the player time to read and creates tension.

Suggested timing:

```js
typewriterSpeed = 28; // milliseconds per character
postTextDelay = 3000; // wait 3 seconds after text finishes
choiceTimerSeconds = 5; // choices appear, then player has 5 seconds
```

Interaction flow for each scene:

1. Show background image/video.
2. Type the scene text onto the screen.
3. When the full text has appeared, keep it visible for 3 seconds.
4. Then reveal the choices.
5. Start a separate 5-second choice timer.
6. If the timer reaches zero, choose the avoidant/default option automatically, unless a custom default is specified.

## Font / typography

The exact font can be chosen later in CSS. Leave the structure flexible so the font can be changed easily in one place.

Suggested CSS variables:

```css
:root {
  --font-main: "Courier New", monospace;
  --font-title: "Courier New", monospace;
}

body {
  font-family: var(--font-main);
}
```

Possible font directions:

- Monospace / terminal-like font for clinical records and VHS interface.
- Typewriter-style font for notes, files, and memory fragments.
- Clean sans-serif font for a more modern medical-interface feeling.

## Text layout

Because the game contains a lot of text, the text box should be large, readable, and separated from the choice buttons.

Suggested layout:

- Full-screen background media area.
- Semi-transparent text panel at the bottom or left side.
- Choices appear only after the scene text finishes.
- Timer appears separately in a corner.
- Use a `Skip text` option only for testing, not necessarily in the final version.

---

# Variables

```js
let empathy = 0;
let avoidance = 0;
```

Ending rule:

```js
if (empathy > avoidance) {
  showEnding("acceptance");
} else {
  showEnding("loop");
}
```

---

# Scene 1 — Wake Up

## Scene text

You wake up in a hospital bed. The room is dimly lit, and the fluorescent light above you flickers weakly. There is a locked door in front of you. Around your wrist is a hospital band that reads: **PATIENT 4**. Beside the bed is a small drawer. Inside the drawer, you find an ID card with your name on it: **Carl Darwood**. Next to it is an envelope. Written across the front are the words: **DO NOT OPEN UNTIL YOU REMEMBER.**

## Choices

### Choice A

**Open the envelope.**

Score:

```js
empathy += 1;
```

Result text:

Inside the envelope is a short note: **If you are reading this, we are sorry. The procedure failed.** You do not understand what it means, but the words leave a cold weight in your stomach.

Next scene: Scene 2

### Choice B

**Do not open the envelope.**

Score:

```js
avoidance += 1;
```

Result text:

You place the envelope back inside the drawer. Whatever is written inside, you are not ready to know yet. Still, as you close the drawer, you feel as if you have just refused something important.

Next scene: Scene 2

---

# Scene 2 — The Corridor and the Woman

## Scene text

You leave the room. An endless corridor stretches out in front of you. The floor is polished but stained, and the lights above buzz with a low, constant hum. In the distance, you see a woman sitting against the wall. As you approach, she looks up. She is heavily bleeding, one hand pressed against an open wound in her chest. Her eyes widen when she sees you.

**You don't recognize me, do you?** she says quietly. **Maybe that's for the best. Please don't ask me who I am.**

## Choices

### Choice A

**Help her.**

Score:

```js
empathy += 1;
```

Result text:

You help her without saying a word. As soon as you touch her arm, she begins to cry, not loudly, but with the exhaustion of someone who has been holding it in for a long time. You help her sit more comfortably, then continue down the corridor.

Next scene: Scene 3A

### Choice B

**Question her.**

Score:

```js
avoidance += 1;
```

Result text:

**Who are you?** you ask. She looks up at you, still holding the wound in her chest. Her face collapses with grief. **I'm her mother,** she says. **You took her away from me.** You do not understand, and you do not want to ask anything else. You continue down the corridor, leaving her behind.

Next scene: Scene 3B

---

# Scene 3A — After Helping the Woman

## Scene text

You continue down the corridor. The woman's crying fades behind you, but the sound stays inside your head. You do not know who she is, or why she looked at you that way. Still, something about helping her feels strangely familiar, as if your body remembered something your mind could not.

Next scene: Scene 4

---

# Scene 3B — After Questioning the Woman

## Scene text

You continue down the corridor without looking back, but a strange feeling settles in your chest. You cannot explain it, yet you are certain you have made the wrong choice. As you pass a hospital room, the sound of a child laughing echoes from inside. The laughter is warm and carefree, completely out of place in the silence of the facility. Drawn by curiosity, you step inside. A television flickers in the corner of the room. Through the static, a grainy recording begins to play. A car slowly reverses out of a driveway.

Next scene: Scene 4

---

# Scene 4 — The Cafeteria Drawing

## Scene text

You arrive at what appears to be the cafeteria of the facility. Food trays are still perfectly laid out on the tables, as if everyone left suddenly, without warning. The room smells faintly of dust and something sweet that has gone stale.

On one table, you find a child's drawing. It shows a little girl holding a balloon, a house, a loving family, and a car in the distance. In the middle of the paper, written in uneven handwriting, are the words: **Was it a mistake?**

You place the drawing back on the table. When you look up, a little girl is standing across the room. She was not there a second ago. She is holding the same red balloon from the drawing. For a moment she simply watches you. Then she points her little finger directly at you.

**I know you.**

Your throat tightens. The room suddenly feels smaller. The girl takes a step closer.

**Have you seen my mommy?**

You say nothing. The girl tilts her head.

**You always forget the important part.**

## Choices

### Choice A

**How do you know me?**

Score:

```js
avoidance += 1;
```

Result text:

The girl looks at you with wide, curious eyes. **Because you were there.** You feel your chest tighten. **There was a loud noise.** She points toward an empty space beside you. **The car stopped.** A pause. A flash: a rearview mirror, a shadow moving. Your heart begins to race. The girl lowers her gaze. **When I fell down, you were the first one who came running.**

Next scene: Scene 5

### Choice B

**Take her hand and bring her to her mommy.**

Score:

```js
empathy += 1;
```

Result text:

Somewhere deep inside, you know the woman you met earlier is her mother. You cannot explain how. You simply know. The little girl takes your hand, and together you begin walking down the corridor. Her hand feels warm. Real. As you walk, a sudden flash tears through your mind: a rearview mirror, a shadow moving. Your heart begins to race. The image vanishes as quickly as it came. The girl looks up at you. **My mommy told me you came to see me every week.** A sharp pain shoots through your head. Another memory: a hospital room, flowers on a windowsill, a stuffed rabbit sitting on a chair. Then darkness. The girl lowers her eyes to the floor. **You always cried when you thought I was asleep.** For a moment, the corridor seems to spin around you. And for the first time, you begin to understand why.

Next scene: Scene 5

---

# Scene 5 — The Office

## Scene text

You leave the girl behind and continue searching for an exit. As you walk in an unknown direction, you stumble across an office room. You enter. The fluorescent lights buzz overhead.

On the desk sits a patient file. Across the front, it reads: **PATIENT 4 — CARL DARWOOD.**

Beside it is a VHS cassette already loaded into a television. The screen flickers with static. Then your own voice breaks through:

**Please, I can't live with this guilt anymore.**

The tape cuts out.

## Choices

Note: This choice does not need to change empathy or avoidance unless desired. It can be used as an interaction choice where the player chooses the order of information. If only one can be selected, decide whether the selected object gives a slightly different emotional emphasis.

### Choice A

**Open and read the file.**

Optional score:

```js
avoidance += 0;
```

Result text:

You open the file.

**PATIENT FILE #4**  
**PATIENT 4 — CARL DARWOOD**  
**Age:** 47  
**Status:** Active Participant  
**Program:** Cognitive Memory Suppression Trial  
**Date of Admission:** Redacted

**Background:** Patient exhibits severe symptoms of persistent guilt, recurring nightmares, obsessive recollection, and resistance to conventional therapy. Patient reports inability to move beyond a traumatic life event despite repeated treatment attempts.

**Procedure Notes:** Subject voluntarily entered the Cognitive Memory Suppression Program. Objective: selective removal of traumatic memory clusters. Procedure authorized by patient.

**Psychological Evaluation:** Patient repeatedly expresses belief that: **I should have done something.** Patient demonstrates difficulty accepting external assessments regarding responsibility. Recommendation: proceed with suppression protocol.

**Complication Report:** Session 7 interrupted. Unexpected neurological activity detected. Memory isolation unsuccessful. Patient transferred to intensive monitoring.

**Final Status:** Incomplete. Further notes unavailable. Access restricted.

Next scene: Scene 6

### Choice B

**Listen to the VHS tape recording.**

Optional score:

```js
empathy += 0;
```

Result text:

The VHS recording begins with static. Then you see yourself sitting across from a therapist. You look exhausted, older than you expected, hollowed out by something you cannot remember.

The therapist asks, **Do you understand what the procedure is intended to do?**

Your recorded self nods.

**I don't want to forget everything,** you say. **Just this. Just enough to keep living.**

The therapist pauses. **The court cleared you. Her family gave statements in your support. You know that.**

Your recorded self begins to cry.

**Knowing isn't the same as believing it.**

The tape distorts. For a moment, the screen shows only static. Then your voice returns, quieter.

**Please. I can't live with this guilt anymore.**

The tape cuts out.

Next scene: Scene 6

---

# Scene 6 — The Woman and the Girl Return

## Scene text

You step out of the room, your head spinning. The procedure. The missing memories. None of it makes sense. How could you have forgotten something so important? You wander through the corridors in a daze, barely aware of where you are going.

Then you see them.

At the far end of the hallway stand the woman and the little girl. Hand in hand. Neither of them speaks. Neither of them looks at you. They simply walk forward at a slow, steady pace. The woman keeps her eyes fixed ahead. The little girl clutches her red balloon.

For a moment, you wonder if they have seen you at all. Then the girl turns her head, just slightly, enough to make your stomach drop. A wave of guilt crashes over you. Your chest tightens. Every instinct tells you to run. To turn around. To disappear before they get any closer. But you cannot move.

The distance between you grows smaller. Step by step. The fluorescent lights hum overhead. The little girl never takes her eyes off you. And with every step they take, a terrible feeling grows inside you.

Somewhere deep down, you already know why.

## Choices

### Choice A

**Listen to your instincts.**

Score:

```js
avoidance += 2;
```

Result text:

With the last bit of courage, or perhaps pure panic, you turn and run. You do not look back. Your footsteps echo through the endless corridors as you desperately try to put as much distance between yourself and them as possible.

Next scene: Ending Check

### Choice B

**Do not listen to your instincts.**

Score:

```js
empathy += 2;
```

Result text:

Something deep inside tells you to stay. To stop running. To face them.

Next scene: Ending Check

---

# Ending Check

Use the hidden scores to decide which ending appears.

```js
if (empathy > avoidance) {
  showScene("ending_acceptance");
} else {
  showScene("ending_loop");
}
```

---

# Ending A — Acceptance / Peace

Condition:

```js
empathy > avoidance;
```

## Ending text

Something deep inside tells you to stay. To stop running. To face them. The woman and the little girl walk toward you, hand in hand. As they get closer, the fear that had been gripping you begins to fade. Neither of them looks angry. Neither of them looks disappointed. Only sad.

**Do you remember now?** the little girl asks.

Fragments of memory rush through your mind. The driveway. The sunlight. The sound of laughter. The hospital. The courtroom. The years of guilt that followed.

**It wasn't your fault,** the woman says gently.

**I ran behind the car,** the little girl adds. **You did everything you could.**

The woman steps closer.

**My family forgave you. The court forgave you. But you never forgave yourself.**

The little girl reaches for your hand.

**You can let it go now.**

A warm light begins to fill the corridor. The walls of the facility dissolve around you. For the first time, the place does not feel frightening. It feels peaceful.

You close your eyes.

When you open them again, you are back in the hospital. Five years have passed. And for the first time since the accident, you feel at peace.

---

# Ending B — Avoidance / Loop

Condition:

```js
avoidance >= empathy;
```

## Ending text

With the last bit of courage, or perhaps pure panic, you turn and run. You do not look back. Your footsteps echo through the endless corridors as you desperately try to put as much distance between yourself and them as possible. Eventually, breathless and exhausted, you find yourself standing in front of a familiar door.

The hospital room.

The same room where all of this began.

A wave of dizziness washes over you. Your vision blurs. Your heart pounds violently in your chest. Cold sweat runs down your face as you collapse against the door and slide to the floor. The fluorescent lights above begin to hum louder and louder. The room starts to spin. Colours, sounds, and fragments of memory melt together into a single overwhelming blur.

Then everything goes white.

You wake up.

Hospital bed. Fluorescent lights. Patient wristband.

For a brief moment, fragments remain: a woman, a little girl, a feeling of loss. But they quickly slip away.

You do not know where you are.

You do not know who you are.

Only that something feels terribly wrong.

And once again, you find yourself staring at the drawer beside your bed.

---

# Implementation notes for Codex

Build this as a simple browser-based narrative game.

Recommended files:

- `index.html`
- `style.css`
- `script.js`
- optional `assets/` folder for images, VHS clips, audio, ambient sounds

Core features:

1. Display scene text with a typewriter effect.
2. Keep the completed text visible for 3 seconds before choices appear.
3. Display 2 choices when available.
4. Start a separate 5-second countdown only after the choices appear.
5. Track hidden scores: `empathy` and `avoidance`.
6. If the choice timer runs out, optionally choose the more avoidant/default option automatically.
7. Show one of two endings based on score.
8. Reserve a large background media area for future images and videos.
9. Use a dark, clinical, liminal visual style.
10. Add optional VHS/static effects for recording scenes.
11. Add optional ambient sound and low fluorescent hum.
12. Keep typography customizable through CSS variables.

Suggested visual atmosphere:

- Hospital / research facility / dream-like liminal space.
- Muted green, grey, beige, and cold fluorescent tones.
- Grain, static, flicker, and slight blur.
- Minimal interface with large text and two buttons.
- Occasional VHS-style transitions for memory fragments.
