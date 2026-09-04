let currentLevel = 1;
const maxLevels = 17;
const wordsPerChunk = 6; 

const enemyNames = ["Rogue", "Viper", "Shadow", "Iron Fist", "Bloodmoon", "Nightmare", "Titan", "Venom", "Wraith", "Bane", "Phantom", "Onyx", "Slayer", "Grim", "Chaos", "Oblivion", "The Grandmaster"];
const fightingWords = ["punch", "kick", "block", "dodge", "strike", "sweep", "power", "speed", "focus", "spirit", "dragon", "stance", "fury", "battle", "honor", "smash", "crush", "brave", "combat", "glory"];

let playerHP, enemyHP, currentMaxEnemyHP;
const playerMaxHP = 200;
let fullLevelParagraph = [];
let currentChunk = [];
let currentWordIndex = 0;
let currentCharIndex = 0;
let chunkOffset = 0; 

// Stat Trackers
let totalKeys = 0;
let correctKeys = 0;
let startTime = null;
let isRoundActive = false;

// Video Control Variables
const video = document.getElementById("combat-video");
let typingTimeout; 

const textDisplay = document.getElementById("text-display");
const playerHpBar = document.getElementById("player-hp");
const enemyHpBar = document.getElementById("enemy-hp");
const statsScreen = document.getElementById("stats-screen");
const enemyNameDisplay = document.getElementById("enemy-name");
const levelDisplay = document.getElementById("level-display");

function generateLevelText(level) {
    let wordCount = 50 + ((level - 1) * 28); 
    let textArray = [];
    for(let i = 0; i < wordCount; i++) {
        textArray.push(fightingWords[Math.floor(Math.random() * fightingWords.length)]);
    }
    return textArray;
}

function startLevel() {
    isRoundActive = true;
    startTime = null; 
    totalKeys = 0;
    correctKeys = 0;
    chunkOffset = 0;
    
    playerHP = playerMaxHP;
    currentMaxEnemyHP = 100 + (currentLevel * 50); 
    enemyHP = currentMaxEnemyHP;
    
    // Reset Video
    video.pause();
    video.currentTime = 0;
    
    enemyNameDisplay.innerText = enemyNames[currentLevel - 1] || "Unknown Fighter";
    levelDisplay.innerText = currentLevel;
    statsScreen.classList.add("hidden");
    
    fullLevelParagraph = generateLevelText(currentLevel);
    loadNextChunk();
    updateHealthUI();
}

function loadNextChunk() {
    currentChunk = fullLevelParagraph.slice(chunkOffset, chunkOffset + wordsPerChunk);
    currentWordIndex = 0;
    currentCharIndex = 0;
    
    textDisplay.innerHTML = "";
    currentChunk.forEach((word, index) => {
        let wordSpan = document.createElement("span");
        wordSpan.classList.add("word");
        wordSpan.id = `word-${index}`;
        
        word.split("").forEach(char => {
            let charSpan = document.createElement("span");
            charSpan.innerText = char;
            wordSpan.appendChild(charSpan);
        });
        textDisplay.appendChild(wordSpan);
    });
    highlightCurrentWord();
}

function highlightCurrentWord() {
    document.querySelectorAll('.word').forEach(w => w.classList.remove('active-word'));
    let currentWordSpan = document.getElementById(`word-${currentWordIndex}`);
    if(currentWordSpan) {
        currentWordSpan.classList.add('active-word');
    }
}

window.addEventListener("keydown", (e) => {
    // If round is over and user hits enter, start next level
    if (!isRoundActive) {
        if (e.key === "Enter") nextLevel();
        return;
    }

    if (e.key.length !== 1 && e.key !== " ") return; 
    
    // Start stat timer on very first key press
    if (!startTime) startTime = new Date();

    // VIDEO CONTROL LOGIC: Play when a key is pressed
    if (video.paused) {
        video.play().catch(e => console.log("Click the screen once to enable auto-play audio!"));
    }
    
    // Clear the pause timer. If user stops typing for 400ms, pause the video.
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
        video.pause();
    }, 400);

    totalKeys++;
    let currentWord = currentChunk[currentWordIndex];
    let expectedChar = currentWord[currentCharIndex];
    let wordSpan = document.getElementById(`word-${currentWordIndex}`);
    let charSpans = wordSpan.querySelectorAll("span");

    // Finished a word successfully
    if (e.key === " " && currentCharIndex === currentWord.length) {
        currentWordIndex++;
        currentCharIndex = 0;
        playerHP = Math.min(playerMaxHP, playerHP + 2); 
        enemyHP -= 10; // Deal damage
        updateHealthUI();
        
        if (enemyHP <= 0) {
            winLevel();
            return;
        }

        if (currentWordIndex >= currentChunk.length) {
            chunkOffset += wordsPerChunk;
            if (chunkOffset >= fullLevelParagraph.length) winLevel(); 
            else loadNextChunk();
        } else {
            highlightCurrentWord();
        }
        return;
    }

    // Checking letter accuracy
    if (e.key === expectedChar) {
        charSpans[currentCharIndex].classList.add("correct");
        currentCharIndex++;
        correctKeys++;
    } else if (e.key !== " " && currentCharIndex < currentWord.length) {
        charSpans[currentCharIndex].classList.add("incorrect");
        playerHP -= 15; // Take damage
        video.classList.add("shake");
        setTimeout(() => video.classList.remove("shake"), 200);
        updateHealthUI();
        
        if (playerHP <= 0) loseLevel();
    }
});

function updateHealthUI() {
    playerHpBar.style.width = `${Math.max(0, (playerHP / playerMaxHP) * 100)}%`;
    enemyHpBar.style.width = `${Math.max(0, (enemyHP / currentMaxEnemyHP) * 100)}%`;
}

function calculateAndShowStats() {
    let timeTaken = (new Date() - startTime) / 1000;
    let acc = totalKeys > 0 ? Math.round((correctKeys / totalKeys) * 100) : 0;
    let wpm = timeTaken > 0 ? Math.round((correctKeys / 5) / (timeTaken / 60)) : 0;
    
    document.getElementById("stat-time").innerText = timeTaken.toFixed(1);
    document.getElementById("stat-acc").innerText = acc;
    document.getElementById("stat-wpm").innerText = wpm;
}

function winLevel() {
    isRoundActive = false;
    video.pause();
    calculateAndShowStats();
    
    if(currentLevel >= maxLevels) {
        document.getElementById("end-message").innerText = "TOURNAMENT CHAMPION!";
        document.getElementById("next-btn").innerText = "PRESS 'ENTER' TO REPLAY";
        currentLevel = 0; 
    } else {
        document.getElementById("end-message").innerText = `LEVEL ${currentLevel} CLEARED!`;
        document.getElementById("next-btn").innerText = "PRESS 'ENTER' TO CONTINUE";
    }
    statsScreen.classList.remove("hidden");
}

function loseLevel() {
    isRoundActive = false;
    video.pause();
    calculateAndShowStats();
    
    document.getElementById("end-message").innerText = "DEFEATED!";
    document.getElementById("next-btn").innerText = "PRESS 'ENTER' TO RETRY";
    statsScreen.classList.remove("hidden");
}

function nextLevel() {
    if (playerHP > 0 && currentLevel > 0) currentLevel++;
    if (currentLevel === 0) currentLevel = 1; 
    startLevel();
}

// Start Game
startLevel();