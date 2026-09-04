# The Slashing Words ⚔️

**[Play the Live Demo Here]** <!-- Add your GitHub Pages URL here -->

**The Slashing Words** is a browser-based, interactive typing combat game built entirely with Vanilla JavaScript, HTML5, and CSS3. It merges classic typing-test mechanics with rhythm-based combat visuals, where a background video and combat animations react dynamically in real-time to the user's typing speed and accuracy.

## 🚀 Features

* **Keystroke-Synced Video Engine:** The background combat video is tied directly to an asynchronous event listener. It plays automatically upon successful keystrokes and instantly pauses if the user stops typing for 400ms, creating a rhythm-based combat feel.
* **Dynamic Text Chunking:** To optimize UI performance and prevent screen clutter, level paragraphs (scaling from 50 to 500 words) are processed through a chunking algorithm that displays only 6 words at a time.
* **Progressive Difficulty:** The game features 17 distinct levels. Enemy health and word counts scale up progressively, while randomized opponent names keep the UI fresh.
* **Real-Time Telemetry & Stats:** Calculates and displays Words Per Minute (WPM), overall accuracy percentages, and time-to-completion at the end of every round.
* **Custom CSS UI/UX:** Features cyberpunk-inspired slanted neon health bars built purely with CSS `skewX` transformations, drop-shadows, and dynamic width transitions to simulate taking damage.

## 💻 Tech Stack

* **Front-End:** HTML5, CSS3 (Keyframe animations, Flexbox, UI transformations)
* **Logic & State Management:** Vanilla JavaScript (ES6+)
* **Architecture:** Zero-dependency, pure client-side application. No external frameworks, libraries, or databases required.

## 🎮 How to Play

1. **Start Typing:** The round begins as soon as you type the first correct letter.
2. **Attack:** Completing a full word correctly deals 10 damage to your opponent and restores 2 of your HP.
3. **Defend:** Typing an incorrect letter costs you 15 HP and triggers a visual screen-shake penalty.
4. **Survive:** Deplete the opponent's health bar before your own reaches zero. Hit `Enter` to advance to the next tournament bracket.
