const quizData = [
    {
        question: "What is the capital of France?",
        choices: ["London", "Berlin", "Paris", "Madrid"],
        correctAnswer: 2,
        category: "Geography"
    },
    {
        question: "Which planet is known as the Red Planet?",
        choices: ["Mars", "Venus", "Jupiter", "Saturn"],
        correctAnswer: 0,
        category: "Science"
    },
    {
        question: "Who painted the Mona Lisa?",
        choices: ["Vincent van Gogh", "Leonardo da Vinci", "Pablo Picasso", "Michelangelo"],
        correctAnswer: 1,
        category: "Art"
    },
    {
        question: "What is the largest mammal in the world?",
        choices: ["African Elephant", "Blue Whale", "Giraffe", "Hippopotamus"],
        correctAnswer: 1,
        category: "Science"
    },
    {
        question: "Which country is home to the Great Barrier Reef?",
        choices: ["Brazil", "Australia", "Thailand", "Mexico"],
        correctAnswer: 1,
        category: "Geography"
    }
];

let currentQuestion = 0;
let score = 0;
let userAnswers = [];

const questionEl = document.getElementById("question");
const choicesEl = document.getElementById("choices");
const submitBtn = document.getElementById("submit");
const quizEl = document.getElementById("quiz");
const resultsEl = document.getElementById("results");
const restartBtn = document.getElementById("restart");

function loadQuestion() {
    const question = quizData[currentQuestion];
    questionEl.textContent = question.question;

    choicesEl.innerHTML = "";
    question.choices.forEach((choice, index) => {
        const button = document.createElement("button");
        button.textContent = choice;
        button.addEventListener("click", () => selectChoice(index));
        choicesEl.appendChild(button);
    });
}

function selectChoice(index) {
    const buttons = choicesEl.getElementsByTagName("button");
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove("selected");
    }
    buttons[index].classList.add("selected");
}

function submitAnswer() {
    const selectedButton = choicesEl.querySelector(".selected");
    if (!selectedButton) return;

    const answerIndex = Array.from(choicesEl.children).indexOf(selectedButton);
    userAnswers.push(answerIndex);

    if (answerIndex === quizData[currentQuestion].correctAnswer) {
        score++;
    }

    currentQuestion++;

    if (currentQuestion < quizData.length) {
        loadQuestion();
    } else {
        showResults();
    }
}

function showResults() {
    quizEl.style.display = "none";
    resultsEl.style.display = "block";

    const categories = [...new Set(quizData.map(q => q.category))];
    const categoryScores = categories.map(category => {
        const questionsInCategory = quizData.filter(q => q.category === category);
        const correctAnswers = questionsInCategory.filter((q, index) => 
            userAnswers[quizData.indexOf(q)] === q.correctAnswer
        ).length;
        return (correctAnswers / questionsInCategory.length) * 100;
    });

    const ctx = document.getElementById('radarChart').getContext('2d');
    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: categories,
            datasets: [{
                label: 'Your Performance',
                data: categoryScores,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgb(75, 192, 192)',
                pointBackgroundColor: 'rgb(75, 192, 192)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgb(75, 192, 192)'
            }]
        },
        options: {
            elements: {
                line: {
                    borderWidth: 3
                }
            },
            scales: {
                r: {
                    angleLines: {
                        display: false
                    },
                    suggestedMin: 0,
                    suggestedMax: 100
                }
            }
        }
    });
}

function restartQuiz() {
    currentQuestion = 0;
    score = 0;
    userAnswers = [];
    quizEl.style.display = "block";
    resultsEl.style.display = "none";
    loadQuestion();
}

submitBtn.addEventListener("click", submitAnswer);
restartBtn.addEventListener("click", restartQuiz);

loadQuestion();