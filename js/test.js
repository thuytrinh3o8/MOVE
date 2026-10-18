/* ==========================================
   DATA
========================================== */
const questions = [
    {
        category: "NHẬN BIẾT",
        difficulty: "CƠ BẢN",
        question: "Quân nào có thể di chuyển theo hình chữ L?",
        description: "Một trong những điều đầu tiên cần biết khi làm quen với bàn cờ.",
        answers: [
            "Quân Tượng",
            "Quân Mã",
            "Quân Xe",
            "Quân Hậu"
        ],
        correct: 1
    },
    {
        category: "NHẬN BIẾT",
        difficulty: "CƠ BẢN",
        question: "Mục tiêu quan trọng nhất của một ván cờ là gì?",
        description: "Hãy chọn đáp án phù hợp nhất.",
        answers: [
            "Ăn được nhiều quân nhất",
            "Chiếu hết Vua đối phương",
            "Đưa Hậu lên trước",
            "Chiếm nhiều ô nhất"
        ],
        correct: 1
    },
    {
        category: "QUAN SÁT",
        difficulty: "CƠ BẢN",
        question: "Trước khi thực hiện một nước đi, điều gì nên được kiểm tra đầu tiên?",
        description: "Một thói quen quan trọng giúp hạn chế những nước đi thiếu an toàn.",
        answers: [
            "Đối phương đang đe dọa điều gì",
            "Quân nào của mình đẹp nhất",
            "Mình có thể đưa Hậu lên không",
            "Mình có thể đi nhanh hơn không"
        ],
        correct: 0
    },
    {
        category: "QUAN SÁT",
        difficulty: "TRUNG BÌNH",
        question: "Nếu một quân của bạn đang bị đối phương tấn công, đâu là điều nên cân nhắc?",
        description: "Không phải lúc nào cũng cần lập tức di chuyển quân đang bị tấn công.",
        answers: [
            "Luôn luôn bỏ chạy",
            "Có thể tạo ra một mối đe dọa lớn hơn",
            "Bỏ qua hoàn toàn",
            "Đưa Vua vào vị trí đó"
        ],
        correct: 1
    },
    {
        category: "TÍNH TOÁN",
        difficulty: "TRUNG BÌNH",
        question: "Bạn nhìn thấy một quân đối phương có vẻ đang bị bỏ lại. Bạn nên làm gì trước?",
        description: "Một quân miễn phí đôi khi không thực sự miễn phí.",
        answers: [
            "Ăn ngay lập tức",
            "Kiểm tra xem nước ăn quân có an toàn không",
            "Đưa Hậu đến gần",
            "Đổi Vua lấy quân đó"
        ],
        correct: 1
    },
    {
        category: "TÍNH TOÁN",
        difficulty: "TRUNG BÌNH",
        question: "Khi bạn tìm được một nước đi tốt, điều gì nên được kiểm tra tiếp theo?",
        description: "Hãy thử nhìn thêm một bước về phía trước.",
        answers: [
            "Đối phương có thể đáp trả thế nào",
            "Quân nào có giá trị cao nhất",
            "Mình có đang thắng nhiều quân hơn không",
            "Mình có thể đi lại nước đó không"
        ],
        correct: 0
    },
    {
        category: "RA QUYẾT ĐỊNH",
        difficulty: "NÂNG CAO",
        question: "Bạn đang hơn quân nhưng vị trí Vua khá yếu. Điều gì nên được ưu tiên?",
        description: "Thắng vật chất chưa chắc đồng nghĩa với đang ở vị trí an toàn.",
        answers: [
            "Tiếp tục ăn quân",
            "Tìm cách bảo vệ Vua",
            "Đổi tất cả quân",
            "Đưa Hậu ra thật xa"
        ],
        correct: 1
    },
    {
        category: "RA QUYẾT ĐỊNH",
        difficulty: "NÂNG CAO",
        question: "Bạn có hai nước đi đều có vẻ tốt. Cách nào phù hợp nhất để lựa chọn?",
        description: "Đây là lúc khả năng đánh giá vị trí bắt đầu quan trọng.",
        answers: [
            "Chọn nước đi nhanh nhất",
            "Chọn nước nhìn đẹp hơn",
            "So sánh kế hoạch và phản ứng của đối phương",
            "Chọn nước có nhiều quân nhất"
        ],
        correct: 2
    }
];

/* ==========================================
   VARIABLES
========================================== */
let currentQuestion = 0;
let score = 0;
let answersCorrect = [];

const introScreen = document.getElementById("introScreen");
const testScreen = document.getElementById("testScreen");
const resultScreen = document.getElementById("resultScreen");

const questionNumber = document.getElementById("questionNumber");
const difficulty = document.getElementById("difficulty");
const progressBar = document.getElementById("progressBar");

const questionCategory = document.getElementById("questionCategory");
const questionTitle = document.getElementById("questionTitle");
const questionDescription = document.getElementById("questionDescription");
const answersBox = document.getElementById("answers");

/* ==========================================
   START TEST
========================================== */
function startTest() {
    currentQuestion = 0;
    score = 0;
    answersCorrect = [];

    introScreen.classList.remove("active");
    resultScreen.classList.remove("active");
    testScreen.classList.add("active");

    showQuestion();
}

/* ==========================================
   SHOW QUESTION
========================================== */
function showQuestion() {
    const q = questions[currentQuestion];

    questionNumber.textContent = 
        `NƯỚC ĐI ${String(currentQuestion + 1).padStart(2, "0")} / ${String(questions.length).padStart(2, "0")}`;

    difficulty.textContent = q.difficulty;

    progressBar.style.width = 
        `${(currentQuestion / questions.length) * 100}%`;

    questionCategory.textContent = q.category;
    questionTitle.textContent = q.question;
    questionDescription.textContent = q.description;

    answersBox.innerHTML = "";

    q.answers.forEach((answer, index) => {
        const button = document.createElement("button");
        button.className = "answer";

        button.innerHTML = `
            <span class="answer-letter">
                ${String.fromCharCode(65 + index)}
            </span>
            <span class="answer-text">
                ${answer}
            </span>
        `;

        button.addEventListener("click", () => {
            selectAnswer(index);
        });

        answersBox.appendChild(button);
    });
}

/* ==========================================
   SELECT ANSWER
========================================== */
function selectAnswer(index) {
    const q = questions[currentQuestion];
    const allAnswers = document.querySelectorAll(".answer");

    allAnswers.forEach(btn => {
        btn.style.pointerEvents = "none";
    });

    allAnswers[index].classList.add("selected");

    const isCorrect = index === q.correct;

    if (isCorrect) {
        score++;
    }

    answersCorrect.push(isCorrect);

    setTimeout(() => {
        currentQuestion++;

        if (currentQuestion < questions.length) {
            showQuestion();
        } else {
            showResult();
        }
    }, 500);
}

/* ==========================================
   SHOW RESULT
========================================== */
function showResult() {
    testScreen.classList.remove("active");
    resultScreen.classList.add("active");

    progressBar.style.width = "100%";

    calculateResult();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

/* ==========================================
   CALCULATE RESULT
========================================== */
function calculateResult() {
    const scoreValue = 400 + (score / questions.length) * 800;

    document.getElementById("score").textContent = 
        Math.round(scoreValue / 10) * 10;

    let profile;
    let profileText;
    let course;
    let courseLevel;
    let courseDescription;

    if (score <= 2) {
        profile = "NGƯỜI KHỞI ĐẦU";
        profileText = "Bạn đang ở giai đoạn làm quen với cờ vua. Đây là thời điểm tuyệt vời để xây dựng nền tảng thật chắc và khám phá cách chơi theo cách của riêng mình.";
        course = "KHỞI ĐỘNG";
        courseLevel = "NHẬP MÔN";
        courseDescription = "Bắt đầu từ những điều cơ bản, làm quen với bàn cờ, các quân cờ và từng bước xây dựng nền tảng chơi cờ.";
    } else if (score <= 4) {
        profile = "NGƯỜI NHẬP CUỘC";
        profileText = "Bạn đã có những kiến thức nền tảng và bắt đầu hiểu cách một ván cờ vận hành. Bước tiếp theo là biến kiến thức thành những nước đi có chủ đích.";
        course = "NHẬP CUỘC";
        courseLevel = "CƠ BẢN";
        courseDescription = "Củng cố nền tảng, hiểu nguyên tắc khai cuộc và bắt đầu hình thành cách suy nghĩ trước mỗi nước đi.";
    } else if (score <= 6) {
        profile = "NGƯỜI VẬN DỤNG";
        profileText = "Bạn đã có nền tảng khá tốt và bắt đầu nhìn thấy nhiều khả năng trên bàn cờ. Đây là lúc tập trung hơn vào chiến thuật và cách xây dựng kế hoạch.";
        course = "VẬN DỤNG";
        courseLevel = "TRUNG CẤP";
        courseDescription = "Phát triển khả năng quan sát, tính toán và vận dụng chiến thuật trong những thế cờ thực tế.";
    } else {
        profile = "NGƯỜI CHINH PHỤC";
        profileText = "Bạn đã có nền tảng vững và khả năng đánh giá tình huống tốt. Hãy thử thách bản thân với những vị trí phức tạp hơn.";
        course = "CHINH PHỤC";
        courseLevel = "NÂNG CAO";
        courseDescription = "Đi sâu vào phân tích vị trí, xây dựng kế hoạch và đưa ra quyết định trong những thế cờ phức tạp.";
    }

    document.getElementById("profileName").textContent = profile;
    document.getElementById("profileText").textContent = profileText;
    document.getElementById("courseName").textContent = course;
    document.getElementById("courseLevel").textContent = courseLevel;
    document.getElementById("courseDescription").textContent = courseDescription;

    const skillValues = generateSkillScores();

    document.getElementById("skill1Text").textContent = skillValues[0] + "%";
    document.getElementById("skill2Text").textContent = skillValues[1] + "%";
    document.getElementById("skill3Text").textContent = skillValues[2] + "%";
    document.getElementById("skill4Text").textContent = skillValues[3] + "%";

    setTimeout(() => {
        document.getElementById("skill1").style.width = skillValues[0] + "%";
        document.getElementById("skill2").style.width = skillValues[1] + "%";
        document.getElementById("skill3").style.width = skillValues[2] + "%";
        document.getElementById("skill4").style.width = skillValues[3] + "%";
    }, 100);
}

/* ==========================================
   HELPER FUNCTIONS
========================================== */
function generateSkillScores() {
    const base = Math.round((score / questions.length) * 40) + 40;
    return [
        Math.min(95, base + Math.floor(Math.random() * 15)),
        Math.min(95, base + Math.floor(Math.random() * 10) - 5),
        Math.min(95, base + Math.floor(Math.random() * 20) - 10),
        Math.min(95, base + Math.floor(Math.random() * 12))
    ];
}

function restartTest() {
    startTest();
}