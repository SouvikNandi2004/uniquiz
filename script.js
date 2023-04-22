$(document).ready(function () {
  const url = 'https://opentdb.com/api.php?amount=10&category=19&difficulty=hard&type=multiple';

  // Initialize variables
  let questions = [];
  let currentQuestion = 0;
  let score = 0;
  let userAnswers = [];

  // Fetch questions from API and start quiz
  function startQuiz() {
    $.ajax({
      url: url,
      success: function (data) {
        questions = data.results;
        showQuestion();
        $('#answers-container').on('click', 'button.answer', selectAnswer);
      },
      error: function (xhr, status, error) {
        // alert('Error fetching questions from API.');
      }
    });
  }

  // Display current question and answers
  function showQuestion() {
    const question = questions[currentQuestion];
    const answers = [...question.incorrect_answers, question.correct_answer].sort(() => Math.random() - 0.5);
    $('#question-container').html(question.question);

    let answerHtml = '';
    answers.forEach(answer => {
      answerHtml += `
        <button class="answer" value="${answer}">${answer}</button>
      `;
    });
    $('#answers-container').html(answerHtml);
  }

  // Check if answer is correct and move to next question
  function checkAnswer() {
    const selected = $('button.answer.selected').val();
    const question = questions[currentQuestion];
    if (selected === question.correct_answer) {
      score++;
    }
    userAnswers.push(selected);
    currentQuestion++;
    if (currentQuestion < questions.length) {
      showQuestion();
    } else {
      endQuiz();
    }
  }

  function selectAnswer() {
    const selected = $(this).val();
    $('button.answer').removeClass('selected');
    $(this).addClass('selected');
  }

  // End quiz and show score and answers
  function endQuiz() {
    let answerHtml = '';
    questions.forEach((question, index) => {
      answerHtml += `
        <p>${question.question}</p>
        <p><strong>Correct answer:</strong> ${question.correct_answer}</p>
        <p><strong>Your answer:</strong> ${userAnswers[index] || 'No answer selected'}</p>
      `;
    });

    $('#quiz-container').html(`
      <h2>Quiz Complete</h2>
      <p>Your score is ${score} out of ${questions.length}.</p>
      ${answerHtml}
      <button id="restart-btn">Restart Quiz</button>
    `);
  }

  // Restart quiz
  function restartQuiz() {
    currentQuestion = 0;
    score = 0;
    userAnswers = [];
    showQuestion();
  }

  // Start quiz on page load
  startQuiz();

  // Handle submit button click
  $('#submit-btn').on('click', function () {
    if ($('button.answer.selected').length > 0) {
      checkAnswer();
    } else {
      alert('Please select an answer.');
    }
  });

  // Handle restart button click
  $(document).on('click', '#restart-btn', function () {
    restartQuiz();
  });
});
