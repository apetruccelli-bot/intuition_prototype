# Before You Think

**Before You Think** is a browser-based interactive psychological horror game built with HTML, CSS, and vanilla JavaScript. The project combines a branching text narrative with cinematic backgrounds, timed choices, atmospheric sound, VHS-style visuals, and hidden psychological scoring to create a story-driven horror experience about memory, grief, guilt, and intuition.

## Project Overview

This project is an interactive psychological horror text-based game inspired by *The Sixth Sense*. Rather than focusing on traditional horror mechanics such as combat, enemies, or jump scares, the game focuses on atmosphere, player choice, intuition, and psychological storytelling. The experience asks the player to read carefully, react quickly, and slowly uncover the emotional truth hidden inside the story.

## Concept

The narrative follows a man who wakes up trapped inside a mysterious hospital with no clear memory of who he is or why he is there. As the player explores the hospital, they encounter unsettling rooms, symbolic objects, fragmented memories, and characters who seem connected to something the protagonist has forgotten.

The hospital functions as more than a physical location. It represents memory, grief, guilt, and unfinished emotions. Through exploration and choices, the player gradually uncovers the truth behind the protagonist's situation.

The player's decisions influence the ending through hidden psychological values. Choices can increase either empathy or avoidance, shaping whether the protagonist confronts the truth or continues running from it.

## Features

- Text-based branching narrative
- Typewriter text effect
- Timed decision system
- Hidden empathy and avoidance scoring
- Multiple endings
- Dynamic scene backgrounds
- Atmospheric sound design
- VHS, glitch, and flicker visual effects
- Flashback image sequences
- Mouse-influenced timed choices
- Scene-specific audio layers

## How to Play

Open `index.html` in a browser, or run the project using a local development tool such as Live Server.

```text
index.html
```

Once the game starts:

- Read the story as it appears on screen.
- Make choices when options appear.
- Some choices are timed.
- If the timer reaches zero, the mouse position may determine the decision.
- Observe clues carefully.
- Different decisions can lead to different endings.

## Controls

- **Mouse:** Select choices and click buttons.
- **Spacebar:** Complete the current sentence during the typewriter effect.
- **Scroll:** Scroll the story box if needed.
- **Buttons:** Start the game, open the About page, play VHS sequences, and return home from the ending screen.

## Project Structure

```text
intuition_prototype/
├── index.html
├── style.css
├── script.js
├── Images/
├── sounds/
├── fonts/
├── video1.mp4
├── glitchoverlay.mp4
└── vhstape.mp3
```

### `index.html`

- Defines the page structure.
- Contains the main UI containers.
- Provides layers for scene images, videos, VHS effects, text, choices, overlays, and navigation.

### `style.css`

- Controls the visual layout and interface styling.
- Defines the dark cinematic/VHS aesthetic.
- Handles animations such as flickering lights, static, scanlines, image shaking, and ending overlays.
- Includes responsive styling for different screen sizes.

### `script.js`

- Acts as the main game engine.
- Loads scenes dynamically.
- Controls story progression.
- Manages the typewriter system.
- Handles choices, timers, hidden scores, endings, audio, image sequences, and VHS playback.

### Assets

The project uses local assets for:

- Images
- Videos
- Audio
- Fonts

These assets create the atmosphere of the hospital, flashbacks, VHS scenes, and ending sequences.

## Technical Implementation

The story is stored inside a large JavaScript `scenes` object. Each scene contains its own title, text, background image, sounds, choices, and special effects. This allows the narrative content to be edited separately from the main game logic.

The `showScene()` function loads scenes dynamically. It reads the current scene data, updates the background, starts the correct audio, displays the title, begins the typewriter effect, and then shows choices or moves to the next scene.

The project separates content from engine logic. The scene data describes what should happen, while the engine functions decide how it happens on screen.

CSS animations are used to create horror effects such as:

- Faulty fluorescent light flicker
- VHS scanlines
- Static noise
- Screen glitches
- Shaky flashback imagery
- White light transitions

Audio is managed automatically per scene. Each scene can define its own sound layers, such as buzzing lights, footsteps, crying, static, suspense, or heartbeat. Some sounds loop, some repeat, and some fade in over time.

Hidden variables track the player's psychological direction:

```js
let empathy = 0;
let avoidance = 0;
```

At the end of the game, these hidden values determine which ending is shown.

Backgrounds transition using crossfades, timed sequences, white flashes, and repeated image loops. This helps create moments such as deja vu flashbacks, VHS playback, and the final looping hospital scene.

## Technologies Used

- HTML5
- CSS3
- Vanilla JavaScript

No external frameworks or libraries are used.

## Design Goals

- Build a custom narrative engine using only HTML, CSS, and JavaScript.
- Focus on psychological horror rather than action or combat.
- Create immersion through sound, image, pacing, and visual effects.
- Reward observation and emotional interpretation.
- Make choices feel instinctive and psychologically meaningful.
- Keep the code modular and easy to extend.

## Future Improvements

Possible future additions include:

- Save/load system
- Accessibility options
- Additional endings
- Inventory system
- More branching paths
- Mobile optimisation
- Volume controls
- Subtitle options for audio sequences

## Credits

**Creator:**  
Anisia Petruccelli

**Inspired by:**  
*The Sixth Sense* (1999)

## License

This project was created for educational and university assignment purposes. It may be viewed, studied, and adapted for learning purposes, but should not be redistributed commercially without permission from the creator.
