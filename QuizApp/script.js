document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById("start-btn");
  const nextBtn = document.getElementById("next-btn");
  const restartBtn = document.getElementById("restart-btn");
  const questionContainer = document.getElementById("question-container");
  const questionText = document.getElementById("question-text");
  const choicesList = document.getElementById("choices-list");
  const resultContainer = document.getElementById("result-container");
  const scoreDisplay = document.getElementById("score");
  const qNoInput = document.getElementById("qNo");
  const questionCounter = document.getElementById("question-counter");

const localQuestions = [
  {
    question: "What would you do if you found ₹1,00,000 on the road?",
    choices: [
      "Buy a PS5 and disappear",
      "Return it like a good citizen",
      "Check if it's real and post a selfie",
      "Treat all my friends (but only once)"
    ],
    answer: "Treat all my friends (but only once)"
  },
  {
    question: "If you could eat only one food for the rest of your life, what would it be?",
    choices: [
      "Pizza 🍕",
      "Momos 🥟",
      "Ice cream 🍨",
      "Biryani 🍛"
    ],
    answer: "Pizza 🍕"
  },
  {
    question: "What’s your favorite way to spend a weekend?",
    choices: [
      "Binge-watching entire seasons 🍿",
      "Sleeping like there's no tomorrow 😴",
      "Hanging out with friends 👯",
      "Scrolling reels endlessly 📱"
    ],
    answer: "Sleeping like there's no tomorrow 😴"
  },
  {
    question: "What would you do if you were invisible for a day?",
    choices: [
      "Steal snacks from everyone’s lunch box 🍫",
      "Scare my friends 👻",
      "Spy on my crush 😏",
      "Sleep in peace without being disturbed 🛏️"
    ],
    answer: "Scare my friends 👻"
  },
  {
    question: "Which superpower would you choose?",
    choices: [
      "Time travel ⏳",
      "Invisibility 👀",
      "Mind reading 🧠",
      "Teleportation 🌍"
    ],
    answer: "Teleportation 🌍"
  },
  {
    question: "What's your spirit animal?",
    choices: [
      "Panda 🐼 — Eats, sleeps, repeats",
      "Cat 🐱 — I do what I want",
      "Dog 🐶 — Loyal but always hungry",
      "Tiger 🐯 — Fierce and fabulous"
    ],
    answer: "Panda 🐼 — Eats, sleeps, repeats"
  },
  {
    question: "What’s your go-to excuse for being late?",
    choices: [
      "Traffic bro 😅",
      "I was mentally ready, not physically 😴",
      "Forgot it was today",
      "My dog hid my keys 🐕"
    ],
    answer: "I was mentally ready, not physically 😴"
  },
  {
    question: "Which one describes you best?",
    choices: [
      "The silent observer 👀",
      "The group clown 🤡",
      "The overthinker 🧠",
      "The foodie 🍟"
    ],
    answer: "The group clown 🤡"
  },
  {
    question: "If your life were a movie, what genre would it be?",
    choices: [
      "Comedy of errors 🎭",
      "Rom-com (minus the 'rom') ❤️",
      "Drama with too many plot twists 🎬",
      "Documentary on sleep habits 😴"
    ],
    answer: "Comedy of errors 🎭"
  },
  {
    question: "What's your hidden talent?",
    choices: [
      "Sleeping anywhere, anytime 🛌",
      "Roasting friends 🔥",
      "Finishing entire series overnight 📺",
      "Eating 10 pani puris in 30 seconds 😋"
    ],
    answer: "Sleeping anywhere, anytime 🛌"
  },
  {
    question: "What’s the worst thing to say on a first date?",
    choices: [
      "'I forgot your name again 😬'",
      "'Can I borrow ₹500?' 💸",
      "'Do you believe in aliens?' 👽",
      "'You remind me of my ex 😳'"
    ],
    answer: "'Can I borrow ₹500?' 💸"
  },
  {
    question: "What's your dream vacation?",
    choices: [
      "Staying in bed with AC & snacks ❄️🍿",
      "Backpacking across Europe 🎒",
      "Beachside villa with WiFi 🏖️📶",
      "Solo trip to the mountains 🏔️"
    ],
    answer: "Staying in bed with AC & snacks ❄️🍿"
  }
];


  let questions = [];
  let userAnswers = [];
  let currentQuestionIndex = 0;
  let score = 0;

  startBtn.addEventListener("click", startQuiz);
  nextBtn.addEventListener("click", nextQuiz);
  restartBtn.addEventListener("click", restartQuiz);

  function startQuiz() {
    const qNo = parseInt(qNoInput.value);
    if (isNaN(qNo) || qNo <= 0) {
      alert("Please enter a valid number of questions.");
      return;
    }

    startBtn.classList.add("hidden");
    document.querySelector(".setup").style.display = "none";
    resultContainer.classList.add("hidden");
    questionContainer.classList.remove("hidden");

    fetch(`https://opentdb.com/api.php?amount=${qNo}&type=multiple`)
      .then(res => res.json())
      .then(data => {
        questions = data.results.map(q => {
          const choices = [...q.incorrect_answers];
          const randomIndex = Math.floor(Math.random() * 4);
          choices.splice(randomIndex, 0, q.correct_answer);

          return {
            question: decodeHTMLEntities(q.question),
            choices: choices.map(decodeHTMLEntities),
            answer: decodeHTMLEntities(q.correct_answer)
          };
        });

        currentQuestionIndex = 0;
        score = 0;
        userAnswers = [];
        showQuestion();
      })
      .catch(err => {
        alert("Failed to load questions from API. Using local fun questions instead!");
        questions = localQuestions;
        qNoInput.value = "";
        document.querySelector(".setup").style.display = "none";
        currentQuestionIndex = 0;
        score = 0;
        userAnswers = [];
        questionContainer.classList.remove("hidden");
        showQuestion();
      });
  }

  function nextQuiz() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
      showQuestion();
    } else {
      showResult();
    }
  }

  function showQuestion() {
    nextBtn.classList.add("hidden");
    const currentQ = questions[currentQuestionIndex];
    questionText.textContent = currentQ.question;
    choicesList.innerHTML = "";
    questionCounter.textContent = `Question ${currentQuestionIndex + 1} of ${questions.length}`;

    currentQ.choices.forEach(choice => {
      const li = document.createElement("li");
      li.textContent = choice;
      li.addEventListener("click", () => selectAnswer(choice));
      choicesList.appendChild(li);
    });
  }

  function selectAnswer(choice) {
    const currentQ = questions[currentQuestionIndex];
    const correctAnswer = currentQ.answer;

    userAnswers.push({
      question: currentQ.question,
      correct: correctAnswer,
      selected: choice
    });

    if (choice === correctAnswer) {
      score++;
    }

    nextBtn.classList.remove("hidden");
  }

  function showResult() {
    questionContainer.classList.add("hidden");
    resultContainer.classList.remove("hidden");

    // Display score
    scoreDisplay.innerHTML = `<strong>${score}</strong> out of ${questions.length}`;

    // Clean old result details if any
    const oldResult = document.getElementById("result-details");
    if (oldResult) oldResult.remove();

    // Create new result section
    const resultDetails = document.createElement("div");
    resultDetails.id = "result-details";
    resultDetails.classList.add("result-details");

    userAnswers.forEach((item, index) => {
      const questionDiv = document.createElement("div");
      questionDiv.classList.add("result-item");

      const q = document.createElement("p");
      q.innerHTML = `<strong>Q${index + 1}:</strong> ${item.question}`;

      const correct = document.createElement("p");
      correct.innerHTML = `✅ Correct Answer: <span style="color:green">${item.correct}</span>`;

      questionDiv.appendChild(q);

      if (item.selected === item.correct) {
        questionDiv.appendChild(correct);
      } else {
        const wrong = document.createElement("p");
        wrong.innerHTML = `❌ Your Answer: <span style="color:red">${item.selected}</span>`;
        questionDiv.appendChild(wrong);
        questionDiv.appendChild(correct);
      }

      resultDetails.appendChild(questionDiv);
    });

    resultContainer.appendChild(resultDetails);
  }

  function restartQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    userAnswers = [];
    scoreDisplay.innerHTML = "";

    const resultDetails = document.getElementById("result-details");
    if (resultDetails) resultDetails.remove();

    resultContainer.classList.add("hidden");
    document.querySelector(".setup").style.display = "block";
    startBtn.classList.remove("hidden");
  }

  function decodeHTMLEntities(str) {
    const textarea = document.createElement("textarea");
    textarea.innerHTML = str;
    return textarea.value;
  }
});

