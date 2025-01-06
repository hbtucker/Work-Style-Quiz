const quizData = [
    {
        question: "How do you prefer to communicate with your team?",
        choices: [
            { text: "Face-to-face meetings", weight: { Collaborative: 3, Traditional: 2, Innovative: 1 } },
            { text: "Video or audio calls", weight: { Collaborative: 2, Remote: 3, Innovative: 2 } },
            { text: "Messaging apps, e.g. Teams, Slack", weight: { Remote: 3, Innovative: 2, Collaborative: 1 } },
            { text: "Email", weight: { Traditional: 3, Remote: 2, Collaborative: 1 } }
        ],
        category: "Communication"
    },
    {
        question: "How do you approach problem-solving?",
        choices: [
            { text: "Brainstorming with the team", weight: { Collaborative: 3, Innovative: 2, Traditional: 1 } },
            { text: "Researching existing solutions", weight: { Traditional: 3, Innovative: 2, Collaborative: 1 } },
            { text: "Trial and error", weight: { Innovative: 3, Remote: 2, Traditional: 1 } },
            { text: "Consulting with experts", weight: { Traditional: 2, Collaborative: 2, Innovative: 2 } }
        ],
        category: "Problem Solving"
    },
    {
        question: "How do you prefer to receive feedback?",
        choices: [
            { text: "Written reports", weight: { Traditional: 3, Remote: 2, Collaborative: 1 } },
            { text: "One-on-one meetings", weight: { Traditional: 2, Collaborative: 3, Innovative: 1 } },
            { text: "Peer reviews", weight: { Collaborative: 3, Innovative: 2, Remote: 1 } },
            { text: "Continuous feedback online, e.g. reactions, message threads, document comments", weight: { Innovative: 3, Remote: 3, Traditional: 1 } }
        ],
        category: "Feedback"
    },
    {
        question: "How do you prefer to manage your work schedule?",
        choices: [
            { text: "Fixed hours, e.g. 9-5", weight: { Traditional: 3, Collaborative: 2, Remote: 1 } },
            { text: "Flexible, manage work around my week", weight: { Remote: 3, Innovative: 2, Traditional: 1 } },
            { text: "Task or results based, irrespective of time", weight: { Innovative: 3, Remote: 2, Traditional: 1 } },
            { text: "Collaborative scheduling with my team", weight: { Collaborative: 3, Innovative: 2, Traditional: 1 } }
        ],
        category: "Work Schedule"
    },
    {
        question: "How do you approach learning new skills?",
        choices: [
            { text: "Formal training courses", weight: { Traditional: 3, Collaborative: 2, Innovative: 1 } },
            { text: "Self-directed online learning", weight: { Remote: 3, Innovative: 2, Traditional: 1 } },
            { text: "Learning from colleagues", weight: { Collaborative: 3, Innovative: 2, Traditional: 1 } },
            { text: "Experimenting with new tools and techniques", weight: { Innovative: 3, Remote: 2, Traditional: 1 } }
        ],
        category: "Skill Development"
    }
];

let currentQuestion = 0;
let scores = { Collaborative: 0, Traditional: 0, Innovative: 0, Remote: 0 };
let maxPossibleScores = { Collaborative: 0, Traditional: 0, Innovative: 0, Remote: 0 };
let userAnswers = [];

const startPageEl = document.getElementById("start-page");
const startQuizBtn = document.getElementById("start-quiz");
const questionEl = document.getElementById("question");
const choicesEl = document.getElementById("choices");
const quizEl = document.getElementById("quiz");
const resultsEl = document.getElementById("results");
const restartBtn = document.getElementById("restart");
const downloadPDFBtn = document.getElementById("downloadPDF");
const progressBarEl = document.getElementById("progress-bar");
const progressTextEl = document.getElementById("progress-text");

startQuizBtn.addEventListener("click", startQuiz);

function startQuiz() {
    startPageEl.style.display = "none";
    quizEl.style.display = "block";
    loadQuestion();
}

function loadQuestion() {
    if (currentQuestion < quizData.length) {
        const question = quizData[currentQuestion];
        questionEl.textContent = question.question;

        choicesEl.innerHTML = "";
        question.choices.forEach((choice, index) => {
            const button = document.createElement("button");
            button.textContent = choice.text;
            button.addEventListener("click", () => selectChoice(index));
            choicesEl.appendChild(button);
        });

        updateProgressBar();
    } else {
        showResults();
    }
}

function selectChoice(index) {
    const question = quizData[currentQuestion];
    const selectedChoice = question.choices[index];

    Object.entries(selectedChoice.weight).forEach(([category, weight]) => {
        scores[category] += weight;
    });

    // Calculate max possible scores
    question.choices.forEach(choice => {
        Object.entries(choice.weight).forEach(([category, weight]) => {
            maxPossibleScores[category] += weight;
        });
    });

    userAnswers.push(index);
    currentQuestion++;
    loadQuestion();
}

function updateProgressBar() {
    const progress = (currentQuestion / quizData.length) * 100;
    progressBarEl.style.width = `${progress}%`;
    progressTextEl.textContent = `Question ${currentQuestion + 1} of ${quizData.length}`;
}

function showResults() {
    quizEl.style.display = "none";
    resultsEl.style.display = "block";

    const categories = Object.keys(scores);
    const categoryScores = categories.map(category => (scores[category] / maxPossibleScores[category]) * 100);

    const ctx = document.getElementById('polarChart').getContext('2d');
    new Chart(ctx, {
        type: 'polarArea',
        data: {
            labels: categories,
            datasets: [{
                label: 'Your Work Style',
                data: categoryScores,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                    'rgba(75, 192, 192, 0.5)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                r: {
                    pointLabels: {
                        display: true,
                        centerPointLabels: true,
                        font: {
                            size: 18
                        }
                    },
                    beginAtZero: true,
                    max: 50
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                },
            }
        }
    });
}

function restartQuiz() {
    currentQuestion = 0;
    scores = { Collaborative: 0, Traditional: 0, Innovative: 0, Remote: 0 };
    maxPossibleScores = { Collaborative: 0, Traditional: 0, Innovative: 0, Remote: 0 };
    userAnswers = [];
    resultsEl.style.display = "none";
    startPageEl.style.display = "block";
}

function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Add Manrope font
    doc.addFont('https://fonts.gstatic.com/s/manrope/v20/pxiByp8kv8JHgFVrLDz8V1tvFP-KUEg.ttf', 'Manrope', 'normal');
    doc.addFont('https://fonts.gstatic.com/s/manrope/v20/pxiByp8kv8JHgFVrLGT9V1tvFP-KUEg.ttf', 'Manrope', 'bold');
    doc.setFont('Manrope');

    // Add logo to the PDF
    const logoImg = new Image();
    logoImg.src = 'logo.png';
    logoImg.onload = function() {
        const imgWidth = 30;
        const imgHeight = (logoImg.height * imgWidth) / logoImg.width;
        const pageWidth = doc.internal.pageSize.getWidth();
        doc.addImage(logoImg, 'PNG', pageWidth - imgWidth - 10, 10, imgWidth, imgHeight);

        doc.setFontSize(20);
        doc.setFont('Manrope', 'bold');
        doc.text("Work Style Profile Results", 105, 25, null, null, "center");

        doc.setFontSize(12);
        doc.setFont('Manrope', 'bold');
        let yPos = 40;
        doc.text("Your Work Style Profile:", 20, yPos);
        yPos += 10;

        const categories = Object.keys(scores);

        categories.forEach(category => {
            const score = (scores[category] / maxPossibleScores[category]) * 100;
            doc.text(`${category}: ${score.toFixed(0)}%`, 30, yPos);
            yPos += 10;
        });

        yPos += 10;
        doc.setFont('Manrope', 'bold');
        doc.text("Work Styles Overview", 20, yPos);
        yPos += 10;
        doc.setFont('Manrope', 'normal');
        doc.setFontSize(12);
        const additionalText = [
        "This quiz assessed your work style preferences across 4 different categories: Collaborative, Traditional, Innovative, and Remote. The scores reflect your tendencies towards each work style, though they may change depending on your work environment.",
        "You can use these insights to understand and optimize your work environment. Start by sharing the quiz with your team, share the individual results, and then discuss how to best interact with each other.",
        "You can use physical whiteboards or digital tools like Miro to jot down ideas and decide how you can work effectively together as a team. Reach out to me at hello@culture-coach.org if you want some help getting started.",
        "Your profile is visualized in the polar chart on the next page.",

        ];
        additionalText.forEach(text => {
          doc.text(text, 20, yPos, { maxWidth: 170 });
          yPos += doc.getTextDimensions(text, { maxWidth: 170 }).h + 2;
        });

        html2canvas(document.getElementById("polarChart")).then(canvas => {
            const imgData = canvas.toDataURL("image/png");
            const imgWidth = 150;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            doc.addPage();
            doc.addImage(imgData, "PNG", 15, 20, imgWidth, imgHeight);
            doc.save("Work_Style_Results.pdf");

            notifyPDFDownload();
        });
    };
}

function notifyPDFDownload() {
    console.log("Notifying harry@culture-coach.org about PDF download");
    // In a real-world scenario, you would implement an API call here
}

restartBtn.addEventListener("click", restartQuiz);
downloadPDFBtn.addEventListener("click", generatePDF);

// Initialize the quiz
startPageEl.style.display = "block";
quizEl.style.display = "none";
resultsEl.style.display = "none";

// Start loading the first question
loadQuestion();
