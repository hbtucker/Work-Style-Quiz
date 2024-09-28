const quizData = [
    {
        question: "How do you prefer to communicate with your team?",
        choices: [
            { text: "Face-to-face meetings", weight: { Collaborative: 3, Traditional: 2, Innovative: 1 } },
            { text: "Video calls", weight: { Collaborative: 2, Remote: 3, Innovative: 2 } },
            { text: "Instant messaging", weight: { Remote: 3, Innovative: 2, Collaborative: 1 } },
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
            { text: "Continuous digital feedback", weight: { Innovative: 3, Remote: 3, Traditional: 1 } }
        ],
        category: "Feedback"
    },
    {
        question: "How do you prefer to manage your work schedule?",
        choices: [
            { text: "Fixed 9-5 hours", weight: { Traditional: 3, Collaborative: 2, Remote: 1 } },
            { text: "Flexible hours", weight: { Remote: 3, Innovative: 2, Traditional: 1 } },
            { text: "Task-based, not time-based", weight: { Innovative: 3, Remote: 2, Traditional: 1 } },
            { text: "Collaborative scheduling with the team", weight: { Collaborative: 3, Innovative: 2, Traditional: 1 } }
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
        button.textContent = choice.text;
        button.addEventListener("click", () => selectChoice(index));
        choicesEl.appendChild(button);
    });
}

function selectChoice(index) {
    userAnswers.push(index);

    const question = quizData[currentQuestion];
    const selectedChoice = question.choices[index];

    for (const [category, weight] of Object.entries(selectedChoice.weight)) {
        scores[category] += weight;
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

    const categories = Object.keys(scores);
    const maxScore = quizData.length * 3; // Assuming max weight is 3
    const categoryScores = categories.map(category => (scores[category] / maxScore) * 100);

    const ctx = document.getElementById('radarChart').getContext('2d');
    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: categories,
            datasets: [{
                label: 'Your Work Style Profile',
                data: categoryScores,
                backgroundColor: 'rgba(255, 196, 51, 0.2)',
                borderColor: 'rgb(255, 196, 51)',
                pointBackgroundColor: 'rgb(255, 196, 51)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgb(255, 196, 51)'
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
    scores = { Collaborative: 0, Traditional: 0, Innovative: 0, Remote: 0 };
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
        doc.text("Work Style Profile Results", 105, 25, null, null, "center");

        doc.setFontSize(12);
        let yPos = 60;
        doc.text("Your Work Style Profile:", 20, yPos);
        yPos += 10;

        const categories = Object.keys(scores);
        const maxScore = quizData.length * 3; // Assuming max weight is 3

        categories.forEach(category => {
            const score = (scores[category] / maxScore) * 100;
            doc.text(`${category}: ${score.toFixed(2)}%`, 30, yPos);
            yPos += 10;
        });

        yPos += 10;
        doc.setFontSize(12);
        doc.text("Additional Information", 20, yPos);
        yPos += 10;
        doc.setFontSize(10);
        const additionalText = [
            "This quiz assesses your work style preferences across different categories.",
            "The scores reflect your tendencies towards each work style.",
            "Your profile is visualized in the radar chart on the next page.",
            "Use these insights to understand and optimize your work environment!"
        ];
        additionalText.forEach(text => {
            doc.text(text, 20, yPos);
            yPos += 10;
        });

        html2canvas(document.getElementById("radarChart")).then(canvas => {
            const imgData = canvas.toDataURL("image/png");
            const imgWidth = 180;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            doc.addPage();
            doc.addImage(imgData, "PNG", 15, 20, imgWidth, imgHeight);
            doc.save("work_style_profile.pdf");

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

loadQuestion();
