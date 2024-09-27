const quizData = [
    {
        question: "What is the capital of France?",
        choices: ["London", "Berlin", "Paris", "Madrid"],
        correctAnswer: 2,
        category: "Geography",
        weight: 1
    },
    {
        question: "Which planet is known as the Red Planet?",
        choices: ["Mars", "Venus", "Jupiter", "Saturn"],
        correctAnswer: 0,
        category: "Science",
        weight: 1
    },
    {
        question: "Who painted the Mona Lisa?",
        choices: ["Vincent van Gogh", "Leonardo da Vinci", "Pablo Picasso", "Michelangelo"],
        correctAnswer: 1,
        category: "Art",
        weight: 1.5
    },
    {
        question: "What is the largest mammal in the world?",
        choices: ["African Elephant", "Blue Whale", "Giraffe", "Hippopotamus"],
        correctAnswer: 1,
        category: "Science",
        weight: 1.2
    },
    {
        question: "Which country is home to the Great Barrier Reef?",
        choices: ["Brazil", "Australia", "Thailand", "Mexico"],
        correctAnswer: 1,
        category: "Geography",
        weight: 1.3
    }
];

let currentQuestion = 0;
let score = 0;
let userAnswers = [];

const questionEl = document.getElementById("question");
const choicesEl = document.getElementById("choices");
const quizEl = document.getElementById("quiz");
const resultsEl = document.getElementById("results");
const restartBtn = document.getElementById("restart");
const downloadPDFBtn = document.getElementById("downloadPDF");

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
    userAnswers.push(index);

    if (index === quizData[currentQuestion].correctAnswer) {
        score += quizData[currentQuestion].weight;
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
        const maxScore = questionsInCategory.reduce((sum, q) => sum + q.weight, 0);
        const userScore = questionsInCategory.reduce((sum, q, index) => {
            const questionIndex = quizData.indexOf(q);
            return sum + (userAnswers[questionIndex] === q.correctAnswer ? q.weight : 0);
        }, 0);
        return (userScore / maxScore) * 100;
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

function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Add logo to the PDF
    const logoImg = new Image();
    logoImg.src = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo%20transparent-FhMhho8ZZjU7Tb7OkKUzbDUJJ88bwd.png';
    logoImg.onload = function() {
        const imgWidth = 30;
        const imgHeight = (logoImg.height * imgWidth) / logoImg.width;
        doc.addImage(logoImg, 'PNG', 10, 10, imgWidth, imgHeight);

    doc.setFontSize(20);
    doc.text("Quiz Results", 105, 15, null, null, "center");

    doc.setFontSize(12);
    const maxScore = quizData.reduce((sum, q) => sum + q.weight, 0);

    // Add additional text to the PDF report
    let yPos = 50;
    doc.setFontSize(12);
    doc.text("Additional Information", 20, yPos);
    yPos += 10;
    doc.setFontSize(10);
    const additionalText = [
        "This quiz was designed to test your knowledge across various subjects.",
        "The weighted scoring system reflects the difficulty of each question.",
        "Your performance is visualized in the radar chart on the next page.",
        "Keep learning and come back to improve your scores!"
    ];
    additionalText.forEach(text => {
        doc.text(text, 20, yPos);
        yPos += 10;
    });

    html2canvas(document.getElementById("radarChart")).then(canvas => {
        const imgData = canvas.toDataURL("image/png");
        const imgWidth = 100;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        doc.addPage();
        doc.addImage(imgData, "PNG", 55, 20, imgWidth, imgHeight);
        doc.save("quiz_results.pdf");

        // Notify harry@culture-coach.org about the PDF download
        notifyPDFDownload();
    });
}

function notifyPDFDownload() {
    // In a real-world scenario, you would use a server-side API to send notifications.
    // For this example, we'll simulate the notification process with a console log.
    console.log("Notifying harry@culture-coach.org about PDF download");
    
    // You can replace this with an actual API call to your backend
    // which would handle the notification process securely.
}

restartBtn.addEventListener("click", restartQuiz);
downloadPDFBtn.addEventListener("click", generatePDF);

loadQuestion();
