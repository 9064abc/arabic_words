// State management
let appState = {
    defaultWords: [],
    customWords: [],
    currentQuestionIndex: 0,
    answers: [],
    questionsPerTest: 10,
    currentTestQuestions: [],
    testConfig: {
        source: 'default', // 'default' or 'custom'
        questionMode: 'mixed', // 'mixed', 'a-to-j', 'j-to-a'
        answerMode: 'multiple-choice', // 'multiple-choice', 'typing', 'both'
        selectedClasses: []
    }
};

// DOM Elements - Navigation
const navBtns = document.querySelectorAll('.nav-btn');

// DOM Elements - Home
const homeScreen = document.getElementById('homeScreen');
const startTestBtn = document.getElementById('startTestBtn');
const myWordsBtn = document.getElementById('myWordsBtn');

// DOM Elements - Test Selection
const testSelectionScreen = document.getElementById('testSelectionScreen');
const testSourceRadios = document.querySelectorAll('input[name="testSource"]');
const classSelection = document.getElementById('classSelection');
const classCheckboxes = document.getElementById('classCheckboxes');
const questionModeRadios = document.querySelectorAll('input[name="questionMode"]');
const answerModeRadios = document.querySelectorAll('input[name="answerMode"]');
const backToHomeBtn = document.getElementById('backToHomeBtn');
const startTestFromSelectionBtn = document.getElementById('startTestFromSelectionBtn');

// DOM Elements - Test
const testScreen = document.getElementById('testScreen');
const questionDisplay = document.getElementById('questionDisplay');
const questionLabel = document.getElementById('questionLabel');
const multipleChoiceMode = document.getElementById('multipleChoiceMode');
const typingMode = document.getElementById('typingMode');
const optionsContainer = document.getElementById('optionsContainer');
const answerInput = document.getElementById('answerInput');
const submitAnswerBtn = document.getElementById('submitAnswerBtn');
const answerFeedback = document.getElementById('answerFeedback');
const currentQuestionSpan = document.getElementById('currentQuestion');
const totalQuestionsSpan = document.getElementById('totalQuestions');
const progressFill = document.getElementById('progressFill');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');

// DOM Elements - Results
const resultsScreen = document.getElementById('resultsScreen');
const resultsList = document.getElementById('resultsList');
const scoreValue = document.getElementById('scoreValue');
const scorePercentage = document.getElementById('scorePercentage');
const restartTestBtn = document.getElementById('restartTestBtn');
const backToHomeFromResultsBtn = document.getElementById('backToHomeFromResultsBtn');

// DOM Elements - My Words
const myWordsScreen = document.getElementById('myWordsScreen');
const addWordBtn = document.getElementById('addWordBtn');
const exportWordsBtn = document.getElementById('exportWordsBtn');
const importWordsBtn = document.getElementById('importWordsBtn');
const csvFileInput = document.getElementById('csvFileInput');
const addWordForm = document.getElementById('addWordForm');
const newArabicWord = document.getElementById('newArabicWord');
const newEnglishMeaning = document.getElementById('newEnglishMeaning');
const newJapaneseMeaning = document.getElementById('newJapaneseMeaning');
const newTransliteration = document.getElementById('newTransliteration');
const newWordClass = document.getElementById('newWordClass');
const newCustomClass = document.getElementById('newCustomClass');
const saveWordBtn = document.getElementById('saveWordBtn');
const cancelAddWordBtn = document.getElementById('cancelAddWordBtn');
const myWordsList = document.getElementById('myWordsList');
const filterCheckboxes = document.getElementById('filterCheckboxes');
const clearFilterBtn = document.getElementById('clearFilterBtn');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadDefaultWords();
    loadCustomWords();
    setupEventListeners();
});

// Load default words
async function loadDefaultWords() {
    try {
        const response = await fetch('words.json');
        appState.defaultWords = await response.json();
    } catch (error) {
        console.error('Error loading words:', error);
    }
}

// Load custom words from localStorage
function loadCustomWords() {
    const stored = localStorage.getItem('customWords');
    if (stored) {
        appState.customWords = JSON.parse(stored);
    }
}

// Save custom words to localStorage
function saveCustomWords() {
    localStorage.setItem('customWords', JSON.stringify(appState.customWords));
}

// Setup event listeners
function setupEventListeners() {
    // Navigation
    navBtns.forEach(btn => {
        btn.addEventListener('click', (e) => navigateToPage(e.target.dataset.page));
    });

    // Home screen
    startTestBtn.addEventListener('click', () => navigateToPage('test-selection'));
    myWordsBtn.addEventListener('click', () => {
        navigateToPage('my-words');
        displayMyWords();
    });

    // Test selection
    testSourceRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            appState.testConfig.source = e.target.value;
            updateClassSelection();
        });
    });

    questionModeRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            appState.testConfig.questionMode = e.target.value;
        });
    });

    answerModeRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            appState.testConfig.answerMode = e.target.value;
        });
    });

    backToHomeBtn.addEventListener('click', () => navigateToPage('home'));
    startTestFromSelectionBtn.addEventListener('click', startTest);

    // Test screen
    nextBtn.addEventListener('click', goToNextQuestion);
    prevBtn.addEventListener('click', goToPreviousQuestion);
    submitAnswerBtn.addEventListener('click', submitTypingAnswer);
    answerInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') submitTypingAnswer();
    });

    // Results screen
    restartTestBtn.addEventListener('click', () => navigateToPage('test-selection'));
    backToHomeFromResultsBtn.addEventListener('click', () => navigateToPage('home'));

    // My Words
    addWordBtn.addEventListener('click', () => {
        addWordForm.style.display = addWordForm.style.display === 'none' ? 'block' : 'none';
        updateClassOptions();
    });
    saveWordBtn.addEventListener('click', saveNewWord);
    cancelAddWordBtn.addEventListener('click', () => {
        addWordForm.style.display = 'none';
        clearWordForm();
    });
    exportWordsBtn.addEventListener('click', exportWordsToCSV);
    importWordsBtn.addEventListener('click', () => csvFileInput.click());
    csvFileInput.addEventListener('change', importWordsFromCSV);
    clearFilterBtn.addEventListener('click', clearClassFilter);
}

// Navigation
function navigateToPage(page) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });

    // Update nav buttons
    navBtns.forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-page="${page}"]`)?.classList.add('active');

    // Show selected screen
    if (page === 'home') {
        homeScreen.classList.add('active');
    } else if (page === 'test-selection') {
        testSelectionScreen.classList.add('active');
        updateClassSelection();
    } else if (page === 'test') {
        testScreen.classList.add('active');
    } else if (page === 'results') {
        resultsScreen.classList.add('active');
    } else if (page === 'my-words') {
        myWordsScreen.classList.add('active');
    }
}

// Update class selection based on test source
function updateClassSelection() {
    const source = document.querySelector('input[name="testSource"]:checked').value;
    const words = source === 'default' ? appState.defaultWords : appState.customWords;
    
    const classes = [...new Set(words.map(w => w.class))];
    classCheckboxes.innerHTML = '';
    
    classes.forEach(cls => {
        const label = document.createElement('label');
        label.className = 'checkbox-option';
        label.innerHTML = `
            <input type="checkbox" value="${cls}" class="class-checkbox" checked>
            <span>${cls}</span>
        `;
        classCheckboxes.appendChild(label);
    });

    classSelection.style.display = source === 'custom' && appState.customWords.length > 0 ? 'block' : 'none';
}

// Start test
function startTest() {
    const source = document.querySelector('input[name="testSource"]:checked').value;
    const selectedClasses = Array.from(document.querySelectorAll('.class-checkbox:checked')).map(cb => cb.value);
    
    appState.testConfig.source = source;
    appState.testConfig.selectedClasses = selectedClasses.length > 0 ? selectedClasses : null;

    // Get words
    let words = source === 'default' ? appState.defaultWords : appState.customWords;
    
    // Filter by class
    if (appState.testConfig.selectedClasses) {
        words = words.filter(w => appState.testConfig.selectedClasses.includes(w.class));
    }

    if (words.length === 0) {
        alert('No words available for the selected criteria.');
        return;
    }

    // Generate test questions
    const numQuestions = Math.min(appState.questionsPerTest, words.length * 2); // Can repeat words
    appState.currentTestQuestions = [];
    appState.answers = new Array(numQuestions).fill(null);
    appState.currentQuestionIndex = 0;

    for (let i = 0; i < numQuestions; i++) {
        const word = words[Math.floor(Math.random() * words.length)];
        let questionType;
        
        if (appState.testConfig.questionMode === 'mixed') {
            questionType = Math.random() > 0.5 ? 'a-to-j' : 'j-to-a';
        } else {
            questionType = appState.testConfig.questionMode;
        }

        appState.currentTestQuestions.push({
            word,
            type: questionType,
            options: null
        });
    }

    totalQuestionsSpan.textContent = numQuestions;
    navigateToPage('test');
    displayQuestion();
}

// Display current question
function displayQuestion() {
    const questionIndex = appState.currentQuestionIndex;
    currentQuestionSpan.textContent = questionIndex + 1;

    // Update progress bar
    const progress = ((questionIndex + 1) / appState.currentTestQuestions.length) * 100;
    progressFill.style.width = progress + '%';

    const question = appState.currentTestQuestions[questionIndex];
    const { word, type } = question;

    // Display question
    if (type === 'a-to-j') {
        questionDisplay.textContent = word.word;
        questionDisplay.style.direction = 'rtl';
        questionLabel.textContent = 'What is the Japanese meaning?';
    } else {
        questionDisplay.textContent = word.japanese;
        questionDisplay.style.direction = 'ltr';
        questionLabel.textContent = 'What is the Arabic word?';
    }

    // Determine answer mode for this question
    let currentAnswerMode = appState.testConfig.answerMode;
    if (currentAnswerMode === 'both') {
        currentAnswerMode = Math.random() > 0.5 ? 'multiple-choice' : 'typing';
    }

    // Show/hide modes
    if (currentAnswerMode === 'multiple-choice') {
        multipleChoiceMode.classList.add('active');
        typingMode.classList.remove('active');
        displayMultipleChoice(question);
    } else {
        multipleChoiceMode.classList.remove('active');
        typingMode.classList.add('active');
        answerFeedback.classList.remove('show');
        answerInput.value = '';
        answerInput.disabled = false;
        submitAnswerBtn.disabled = false;
        answerInput.focus();
    }

    // Update button states
    prevBtn.disabled = questionIndex === 0;
    nextBtn.disabled = questionIndex === appState.currentTestQuestions.length - 1;
    nextBtn.textContent = questionIndex === appState.currentTestQuestions.length - 1 ? 'Submit' : 'Next';
}

// Display multiple choice options
function displayMultipleChoice(question) {
    const { word, type } = question;
    
    // Get all possible options
    const words = appState.testConfig.source === 'default' ? appState.defaultWords : appState.customWords;
    const correctAnswer = type === 'a-to-j' ? word.japanese : word.word;
    
    const otherWords = words.filter(w => w.id !== word.id).slice(0, 3);
    const options = shuffleArray([word, ...otherWords]);

    question.options = options;

    optionsContainer.innerHTML = '';
    options.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        
        if (type === 'a-to-j') {
            btn.textContent = opt.japanese;
        } else {
            btn.textContent = opt.word;
            btn.style.direction = 'rtl';
        }

        btn.dataset.wordId = opt.id;

        // Check if already answered
        if (appState.answers[appState.currentQuestionIndex] !== null) {
            const selectedId = appState.answers[appState.currentQuestionIndex];
            const isCorrect = opt.id === word.id;
            const isSelected = opt.id === selectedId;

            if (isCorrect) {
                btn.classList.add('correct');
            } else if (isSelected && !isCorrect) {
                btn.classList.add('incorrect');
            }
            btn.disabled = true;
        }

        btn.addEventListener('click', () => selectMultipleChoiceAnswer(opt.id));
        optionsContainer.appendChild(btn);
    });
}

// Select multiple choice answer
function selectMultipleChoiceAnswer(wordId) {
    appState.answers[appState.currentQuestionIndex] = wordId;
    
    const buttons = document.querySelectorAll('.option-btn');
    const question = appState.currentTestQuestions[appState.currentQuestionIndex];
    
    buttons.forEach(btn => {
        btn.disabled = true;
        const btnWordId = parseInt(btn.dataset.wordId);

        if (btnWordId === question.word.id) {
            btn.classList.add('correct');
        } else if (btnWordId === wordId && wordId !== question.word.id) {
            btn.classList.add('incorrect');
        }
    });

    // Auto move to next
    if (appState.currentQuestionIndex < appState.currentTestQuestions.length - 1) {
        setTimeout(() => goToNextQuestion(), 800);
    }
}

// Submit typing answer
function submitTypingAnswer() {
    const userAnswer = answerInput.value.trim().replace(/\s+/g, '');
    const question = appState.currentTestQuestions[appState.currentQuestionIndex];
    const { word, type } = question;

    let correctAnswer, correctAnswerDisplay;
    if (type === 'a-to-j') {
        correctAnswer = word.japanese.replace(/\s+/g, '');
        correctAnswerDisplay = word.japanese;
    } else {
        correctAnswer = word.word.replace(/\s+/g, '');
        correctAnswerDisplay = word.word;
    }

    // Simple spell check (case-insensitive)
    const isCorrect = userAnswer.toLowerCase() === correctAnswer.toLowerCase();
    
    appState.answers[appState.currentQuestionIndex] = isCorrect ? 1 : 0;

    // Show feedback
    answerFeedback.classList.add('show');
    if (isCorrect) {
        answerFeedback.classList.add('correct');
        answerFeedback.classList.remove('incorrect');
        answerFeedback.innerHTML = '<strong>✓ Correct!</strong>';
    } else {
        answerFeedback.classList.add('incorrect');
        answerFeedback.classList.remove('correct');
        answerFeedback.innerHTML = `
            <strong>✗ Incorrect</strong>
            <div class="correct-answer">
                <strong>Correct Answer:</strong><br>
                ${correctAnswerDisplay}
            </div>
        `;
    }

    submitAnswerBtn.disabled = true;
    answerInput.disabled = true;

    // Auto move to next
    if (appState.currentQuestionIndex < appState.currentTestQuestions.length - 1) {
        setTimeout(() => goToNextQuestion(), 2000);
    }
}

// Go to next question
function goToNextQuestion() {
    if (appState.currentQuestionIndex < appState.currentTestQuestions.length - 1) {
        appState.currentQuestionIndex++;
        displayQuestion();
    } else {
        // All questions answered
        if (appState.answers.every(ans => ans !== null)) {
            showResults();
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
    let correctCount = 0;
    let resultsHtml = '';

    appState.currentTestQuestions.forEach((question, index) => {
        const { word, type } = question;
        const answer = appState.answers[index];
        
        let isCorrect;
        if (appState.testConfig.answerMode === 'typing' || (appState.testConfig.answerMode === 'both')) {
            isCorrect = answer === 1;
        } else {
            isCorrect = answer === word.id;
        }

        correctCount += isCorrect ? 1 : 0;

        if (type === 'a-to-j') {
            resultsHtml += `
                <div class="result-item ${isCorrect ? 'correct' : 'incorrect'}">
                    <div class="result-item-label">Arabic → Japanese</div>
                    <div class="result-item-question">${word.word}</div>
                    <div class="result-item-details">
                        <p><strong>Correct:</strong> ${word.japanese}</p>
                        ${!isCorrect ? `<p style="color: var(--error-color);">✗ You answered: ${word.meaning} (English)</p>` : '<p style="color: var(--success-color);">✓ Correct</p>'}
                    </div>
                </div>
            `;
        } else {
            resultsHtml += `
                <div class="result-item ${isCorrect ? 'correct' : 'incorrect'}">
                    <div class="result-item-label">Japanese → Arabic</div>
                    <div class="result-item-details">
                        <p><strong>Question:</strong> ${word.japanese}</p>
                        <p><strong>Correct:</strong> <span class="result-item-answer">${word.word}</span></p>
                        ${!isCorrect ? `<p style="color: var(--error-color);">✗ You answered differently</p>` : '<p style="color: var(--success-color);">✓ Correct</p>'}
                    </div>
                </div>
            `;
        }
    });

    scoreValue.textContent = `${correctCount}/${appState.currentTestQuestions.length}`;
    scorePercentage.textContent = 
        `${Math.round((correctCount / appState.currentTestQuestions.length) * 100)}%`;
    resultsList.innerHTML = resultsHtml;

    navigateToPage('results');
}

// My Words Functions
function displayMyWords() {
    renderMyWordsList();
    renderFilterCheckboxes();
}

function renderMyWordsList(filterClasses = null) {
    let words = appState.customWords;

    if (filterClasses && filterClasses.length > 0) {
        words = words.filter(w => filterClasses.includes(w.class));
    }

    myWordsList.innerHTML = '';

    if (words.length === 0) {
        myWordsList.innerHTML = '<p style="text-align: center; color: var(--text-light);">No words added yet. Add your first word!</p>';
        return;
    }

    words.forEach(word => {
        const card = document.createElement('div');
        card.className = 'word-card';
        card.innerHTML = `
            <div class="word-arabic">${word.word}</div>
            <div class="word-details">
                <div class="word-details-row">
                    <span><strong>English:</strong> ${word.meaning}</span>
                </div>
                <div class="word-details-row">
                    <span><strong>Japanese:</strong> ${word.japanese}</span>
                </div>
                ${word.transliteration ? `<div class="word-details-row">
                    <span><strong>Transliteration:</strong> ${word.transliteration}</span>
                </div>` : ''}
                <span class="word-class-badge">${word.class}</span>
            </div>
            <div class="word-card-actions">
                <button class="btn-delete" onclick="deleteWord(${word.id})">Delete</button>
            </div>
        `;
        myWordsList.appendChild(card);
    });
}

function renderFilterCheckboxes() {
    const classes = [...new Set(appState.customWords.map(w => w.class))];
    filterCheckboxes.innerHTML = '';

    classes.forEach(cls => {
        const label = document.createElement('label');
        label.className = 'checkbox-option';
        label.innerHTML = `
            <input type="checkbox" value="${cls}" class="filter-checkbox">
            <span>${cls}</span>
        `;
        filterCheckboxes.appendChild(label);
    });

    // Add change event listeners
    document.querySelectorAll('.filter-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            const selected = Array.from(document.querySelectorAll('.filter-checkbox:checked')).map(cb => cb.value);
            renderMyWordsList(selected.length > 0 ? selected : null);
        });
    });
}

function clearClassFilter() {
    document.querySelectorAll('.filter-checkbox').forEach(cb => cb.checked = false);
    renderMyWordsList();
}

function updateClassOptions() {
    const classes = [...new Set(appState.customWords.map(w => w.class))];
    newWordClass.innerHTML = '<option value="">Select or create class...</option>';
    classes.forEach(cls => {
        const option = document.createElement('option');
        option.value = cls;
        option.textContent = cls;
        newWordClass.appendChild(option);
    });
}

function saveNewWord() {
    const arabic = newArabicWord.value.trim();
    const english = newEnglishMeaning.value.trim();
    const japanese = newJapaneseMeaning.value.trim();
    const transliteration = newTransliteration.value.trim();
    const selectedClass = newWordClass.value || newCustomClass.value.trim();

    if (!arabic || !english || !japanese || !selectedClass) {
        alert('Please fill in all required fields.');
        return;
    }

    const newWord = {
        id: appState.customWords.length > 0 ? Math.max(...appState.customWords.map(w => w.id)) + 1 : 1,
        word: arabic,
        meaning: english,
        japanese: japanese,
        transliteration: transliteration,
        class: selectedClass
    };

    appState.customWords.push(newWord);
    saveCustomWords();
    clearWordForm();
    addWordForm.style.display = 'none';
    renderMyWordsList();
    renderFilterCheckboxes();
}

function clearWordForm() {
    newArabicWord.value = '';
    newEnglishMeaning.value = '';
    newJapaneseMeaning.value = '';
    newTransliteration.value = '';
    newWordClass.value = '';
    newCustomClass.value = '';
}

function deleteWord(id) {
    if (confirm('Are you sure you want to delete this word?')) {
        appState.customWords = appState.customWords.filter(w => w.id !== id);
        saveCustomWords();
        renderMyWordsList();
    }
}

// CSV Export/Import
function exportWordsToCSV() {
    if (appState.customWords.length === 0) {
        alert('No custom words to export.');
        return;
    }

    const headers = ['Arabic', 'English', 'Japanese', 'Transliteration', 'Class'];
    const rows = appState.customWords.map(w => [
        w.word,
        w.meaning,
        w.japanese,
        w.transliteration || '',
        w.class
    ]);

    let csv = headers.join(',') + '\n';
    rows.forEach(row => {
        csv += row.map(cell => `"${cell}"`).join(',') + '\n';
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'arabic_words.csv';
    a.click();
}

function importWordsFromCSV(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        const csv = e.target.result;
        const lines = csv.trim().split('\n');
        
        if (lines.length < 2) {
            alert('Invalid CSV file.');
            return;
        }

        let importedCount = 0;
        const startId = appState.customWords.length > 0 ? Math.max(...appState.customWords.map(w => w.id)) + 1 : 1;

        for (let i = 1; i < lines.length; i++) {
            const [arabic, english, japanese, transliteration, cls] = lines[i]
                .split(',')
                .map(cell => cell.trim().replace(/^"|"$/g, ''));

            if (arabic && english && japanese && cls) {
                appState.customWords.push({
                    id: startId + importedCount,
                    word: arabic,
                    meaning: english,
                    japanese: japanese,
                    transliteration: transliteration || '',
                    class: cls
                });
                importedCount++;
            }
        }

        saveCustomWords();
        alert(`Imported ${importedCount} words successfully!`);
        renderMyWordsList();
        renderFilterCheckboxes();
        csvFileInput.value = '';
    };

    reader.readAsText(file);
}

// Utility
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}
