// Go to next question
function goToNextQuestion() {
    if (appState.currentQuestionIndex < appState.currentTestQuestions.length - 1) {
        appState.currentQuestionIndex++;
        displayQuestion();
    } else {
        // All questions answered - show results
        showResults();
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
    setTimeout(() => goToNextQuestion(), 2000);
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
    const isLastQuestion = questionIndex === appState.currentTestQuestions.length - 1;
    prevBtn.disabled = questionIndex === 0;
    nextBtn.disabled = isLastQuestion && appState.answers[questionIndex] === null;
    nextBtn.textContent = isLastQuestion ? 'Submit' : 'Next';
}
