// State management
let appState = {
    words: [],
    currentQuestionIndex: 0,
    answers: [],
    questionsPerTest: 10,
    testStarted: false,
    testWords: null
};

// DOM Elements
const startScreen = document.getElementById('startScreen');
const testScreen = document.getElementById('testScreen');
const resultsScreen = document.getElementById('resultsScreen');

const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');

const questionWord = document.getElementById('questionWord');
const optionsContainer = document.getElementById('optionsContainer');
const currentQuestionSpan = document.getElementById('currentQuestion');
const totalQuestionsSpan = document.getElementById('totalQuestions');
const progressFill = document.getElementById('progressFill');

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    loadWords();
    setupEventListeners();
});

// Load words from JSON
async function loadWords() {
    try {
        const response = await fetch('words.json');
        appState.words = await response.json();
    } catch (error) {
        console.error('Error loading words:', error);
        // Fallback data
        appState.words = [
            { id: 1, word: "السلام", meaning: "Peace", transliteration: "As-salaam" },
            { id: 2, word: "حب", meaning: "Love", transliteration: "Hubb" },
            { id: 3, word: "ماء", meaning: "Water", transliteration: "Maa" },
            { id: 4, word: "شمس", meaning: "Sun", transliteration: "Shams" },
            { id: 5, word: "قمر", meaning: "Moon", transliteration: "Qamar" },
        ];
    }
}

// Setup event listeners
function setupEventListeners() {
    startBtn.addEventListener('click', startTest);
    restartBtn.addEventListener('click', restartTest);
    nextBtn.addEventListener('click', goToNextQuestion);
    prevBtn.addEventListener('click', goToPreviousQuestion);
}

// Start test
function startTest() {
    appState.testStarted = true;
    appState.currentQuestionIndex = 0;
    appState.answers = new Array(appState.questionsPerTest).fill(null);
    appState.testWords = null; // Reset test words

    totalQuestionsSpan.textContent = appState.questionsPerTest;

    showScreen('testScreen');
    displayQuestion();
}

// Display current question
function displayQuestion() {
    const questionIndex = appState.currentQuestionIndex;
    currentQuestionSpan.textContent = questionIndex + 1;

    // Update progress bar
    const progress = ((questionIndex + 1) / appState.questionsPerTest) * 100;
    progressFill.style.width = progress + '%';

    // Get selected words for this test
    const selectedWords = getSelectedWords();
    const correctWord = selectedWords[questionIndex];

    questionWord.textContent = correctWord.word;

    // Shuffle options
    const options = shuffleArray([...selectedWords]);
    
    // Display options
    optionsContainer.innerHTML = '';
    options.forEach((word, index) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = word.meaning;
        btn.dataset.wordId = word.id;

        // Check if already answered
        if (appState.answers[questionIndex] !== null) {
            const selectedId = appState.answers[questionIndex];
            const isCorrect = word.id === correctWord.id;
            const isSelected = word.id === selectedId;

            if (isCorrect) {
                btn.classList.add('correct');
            } else if (isSelected && !isCorrect) {
                btn.classList.add('incorrect');
            }
            btn.disabled = true;
        }

        btn.addEventListener('click', () => selectAnswer(word.id, questionIndex));
        optionsContainer.appendChild(btn);
    });

    // Update button states
    prevBtn.disabled = questionIndex === 0;
    nextBtn.disabled = questionIndex === appState.questionsPerTest - 1;
    nextBtn.textContent = questionIndex === appState.questionsPerTest - 1 ? 'Submit' : 'Next';
}

// Select answer
function selectAnswer(wordId, questionIndex) {
    appState.answers[questionIndex] = wordId;
    
    // Disable all options after selection
    const buttons = document.querySelectorAll('.option-btn');
    const selectedWords = getSelectedWords();
    const correctWord = selectedWords[questionIndex];

    buttons.forEach(btn => {
        btn.disabled = true;
        const btnWordId = parseInt(btn.dataset.wordId);

        if (btnWordId === correctWord.id) {
            btn.classList.add('correct');
        } else if (btnWordId === wordId && wordId !== correctWord.id) {
            btn.classList.add('incorrect');
        }
    });

    // Auto move to next if not last question
    if (questionIndex < appState.questionsPerTest - 1) {
        setTimeout(() => {
            goToNextQuestion();
        }, 800);
    }
}

// Go to next question
function goToNextQuestion() {
    if (appState.currentQuestionIndex < appState.questionsPerTest - 1) {
        appState.currentQuestionIndex++;
        displayQuestion();
    } else if (appState.currentQuestionIndex === appState.questionsPerTest - 1) {
        // Check if all questions are answered
        if (appState.answers.every(answer => answer !== null)) {
            showResults();
        } else {
            alert('Please answer all questions before submitting.');
        }
    }
}

// Go to previous question
function goToPreviousQuestion() {
    if (appState.currentQuestionIndex > 0) {
        appState.currentQuestionIndex--;
        displayQuestion();
    }
}

// Show results
function showResults() {
    const selectedWords = getSelectedWords();
    let correctCount = 0;
    let resultsList = '';

    appState.answers.forEach((answerId, index) => {
        const question = selectedWords[index];
        const isCorrect = answerId === question.id;
        correctCount += isCorrect ? 1 : 0;

        const correctAnswer = appState.words.find(w => w.id === question.id);
        const userAnswer = appState.words.find(w => w.id === answerId);

        resultsList += `
            <div class="result-item ${isCorrect ? 'correct' : 'incorrect'}">
                <div class="result-item-word">${question.word}</div>
                <div class="result-item-details">
                    <p><strong>Correct:</strong> ${correctAnswer.meaning}</p>
                    <p><strong>Your Answer:</strong> ${userAnswer.meaning}</p>
                    ${isCorrect ? '<p style="color: var(--success-color);">✓ Correct</p>' : '<p style="color: var(--error-color);">✗ Incorrect</p>'}
                </div>
            </div>
        `;
    });

    document.getElementById('scoreValue').textContent = `${correctCount}/${appState.questionsPerTest}`;
    document.getElementById('scorePercentage').textContent = 
        `${Math.round((correctCount / appState.questionsPerTest) * 100)}%`;
    document.getElementById('resultsList').innerHTML = resultsList;

    showScreen('resultsScreen');
}

// Restart test
function restartTest() {
    appState.testStarted = false;
    appState.currentQuestionIndex = 0;
    appState.answers = [];
    appState.testWords = null;
    showScreen('startScreen');
}

// Utility functions
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

function getSelectedWords() {
    // This ensures we get consistent words for the entire test session
    if (!appState.testWords) {
        appState.testWords = shuffleArray([...appState.words]).slice(0, appState.questionsPerTest);
    }
    return appState.testWords;
}

function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}
