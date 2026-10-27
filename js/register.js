/* =========================================
   MOVÉ — REGISTER JS
========================================= */


/* =========================================
   EMAILJS CONFIG
========================================= */

// Thay 3 giá trị này bằng thông tin EmailJS
const EMAILJS_PUBLIC_KEY = "tnIE7cdsvAU0Dd9rF";
const EMAILJS_SERVICE_ID = "service_1t90nwr";
const EMAILJS_TEMPLATE_ID = "template_k96vx3g";


/* =========================================
   INITIALIZE
========================================= */

emailjs.init({
    publicKey: EMAILJS_PUBLIC_KEY
});


document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("registerForm");

    if (!form) return;


    /* =====================================
       ELEMENTS
    ====================================== */

    const courseInput =
        document.getElementById("course");

    const nameInput =
        document.getElementById("name");

    const phoneInput =
        document.getElementById("phone");

    const emailInput =
        document.getElementById("email");

    const ageInput =
        document.getElementById("age");

    const submitButton =
        document.getElementById("registerSubmit");

    const successMessage =
        document.getElementById("registerSuccess");

    const generalError =
        document.getElementById("registerGeneralError");


    /* =====================================
       GET COURSE FROM URL
    ====================================== */

    const params =
        new URLSearchParams(window.location.search);

    const course =
        params.get("course");


    const courseNames = {
        "khoi-dong": "Khởi Động",
        "nhap-cuoc": "Nhập Cuộc",
        "van-dung": "Vận Dụng",
        "chinh-phuc": "Chinh Phục",
        "tron-bo-4-khoa": " Khởi động - Nhập cuộc - Vận dụng - Chinh phục"
    };


    if (course && courseNames[course]) {

        courseInput.value =
            courseNames[course];

    } else {

        courseInput.value =
            "Chưa chọn khóa học";
    }


    /* =====================================
       VALIDATION FUNCTIONS
    ====================================== */

    function showError(input, errorId, message) {

        const error =
            document.getElementById(errorId);

        const group =
            input.closest(".form-group");

        error.textContent = message;

        group.classList.add("has-error");
        group.classList.remove("has-success");
    }


    function showSuccess(input, errorId) {

        const error =
            document.getElementById(errorId);

        const group =
            input.closest(".form-group");

        error.textContent = "";

        group.classList.remove("has-error");
        group.classList.add("has-success");
    }


    function clearError(input, errorId) {

        const error =
            document.getElementById(errorId);

        const group =
            input.closest(".form-group");

        error.textContent = "";

        group.classList.remove("has-error");
        group.classList.remove("has-success");
    }


    /* =====================================
       NAME VALIDATION
    ====================================== */

    function validateName() {

        const name =
            nameInput.value.trim();

        if (!name) {

            showError(
                nameInput,
                "nameError",
                "Vui lòng nhập họ và tên."
            );

            return false;
        }


        if (name.length < 2) {

            showError(
                nameInput,
                "nameError",
                "Họ và tên phải có ít nhất 2 ký tự."
            );

            return false;
        }


        showSuccess(
            nameInput,
            "nameError"
        );

        return true;
    }


    /* =====================================
       PHONE VALIDATION
    ====================================== */

    function validatePhone() {

        const phone =
            phoneInput.value.trim();

        /*
         * Số điện thoại Việt Nam:
         * 10 số
         * bắt đầu bằng 0
         */

        const phonePattern =
            /^0\d{9}$/;


        if (!phone) {

            showError(
                phoneInput,
                "phoneError",
                "Vui lòng nhập số điện thoại."
            );

            return false;
        }


        if (!phonePattern.test(phone)) {

            showError(
                phoneInput,
                "phoneError",
                "Số điện thoại phải gồm 10 chữ số và bắt đầu bằng 0."
            );

            return false;
        }


        showSuccess(
            phoneInput,
            "phoneError"
        );

        return true;
    }


    /* =====================================
       EMAIL VALIDATION
    ====================================== */

    function validateEmail() {

        const email =
            emailInput.value.trim();


        /*
         * Kiểm tra cú pháp email
         *
         * Ví dụ hợp lệ:
         * abc@gmail.com
         * hello@move.vn
         *
         * Ví dụ không hợp lệ:
         * abc@
         * abc@gmail
         * @gmail.com
         */

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;


        if (!email) {

            showError(
                emailInput,
                "emailError",
                "Vui lòng nhập email."
            );

            return false;
        }


        if (!emailPattern.test(email)) {

            showError(
                emailInput,
                "emailError",
                "Email chưa đúng cú pháp. Ví dụ: example@gmail.com"
            );

            return false;
        }


        showSuccess(
            emailInput,
            "emailError"
        );

        return true;
    }


    /* =====================================
       AGE VALIDATION
    ====================================== */

    function validateAge() {

        const age =
            Number(ageInput.value);


        if (!ageInput.value) {

            showError(
                ageInput,
                "ageError",
                "Vui lòng nhập tuổi."
            );

            return false;
        }


        if (age < 5 || age > 100) {

            showError(
                ageInput,
                "ageError",
                "Vui lòng nhập tuổi từ 5 đến 100."
            );

            return false;
        }


        showSuccess(
            ageInput,
            "ageError"
        );

        return true;
    }


    /* =====================================
       REAL-TIME EMAIL CHECK
    ====================================== */

    emailInput.addEventListener("input", () => {

        /*
         * Khi user đang nhập:
         * chưa hiện lỗi nếu ô đang trống
         */

        if (!emailInput.value.trim()) {

            clearError(
                emailInput,
                "emailError"
            );

            return;
        }


        validateEmail();

    });


    /* =====================================
       REAL-TIME PHONE CHECK
    ====================================== */

    phoneInput.addEventListener("input", () => {

        /*
         * Chỉ cho phép nhập số
         */

        phoneInput.value =
            phoneInput.value.replace(/\D/g, "");

        if (phoneInput.value) {
            validatePhone();
        } else {
            clearError(
                phoneInput,
                "phoneError"
            );
        }

    });


    /* =====================================
       AGE — ONLY NUMBER
    ====================================== */

    ageInput.addEventListener("input", () => {

        ageInput.value =
            ageInput.value.replace(/\D/g, "");

        if (ageInput.value) {
            validateAge();
        } else {
            clearError(
                ageInput,
                "ageError"
            );
        }

    });


    /* =====================================
       SUBMIT
    ====================================== */

    form.addEventListener("submit", async (event) => {

        event.preventDefault();


        /* Reset */

        generalError.style.display = "none";
        generalError.textContent = "";

        successMessage.classList.remove("show");


        /* Validate */

        const validName =
            validateName();

        const validPhone =
            validatePhone();

        const validEmail =
            validateEmail();

        const validAge =
            validateAge();


        if (
            !validName ||
            !validPhone ||
            !validEmail ||
            !validAge
        ) {

            return;
        }


        /* Loading */

        submitButton.disabled = true;
        submitButton.classList.add("is-loading");


        /*
         * Dữ liệu gửi sang EmailJS
         */

        const templateParams = {

            to_email:
                emailInput.value.trim(),

            name:
                nameInput.value.trim(),

            phone:
                phoneInput.value.trim(),

            email:
                emailInput.value.trim(),

            age:
                ageInput.value,

            course:
                courseInput.value

        };


try {

    // Bước 1: Lưu thông tin đăng ký vào Supabase
    const response = await fetch(
        "http://localhost:3000/api/course-registrations",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                full_name: nameInput.value.trim(),
                phone: phoneInput.value.trim(),
                email: emailInput.value.trim(),
                age: Number(ageInput.value),
                course_name: courseInput.value.trim()
            })
        }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
        throw new Error(
            result.message || "Không thể lưu thông tin đăng ký."
        );
    }

    // Bước 2: Gửi email xác nhận như trước
    await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams
    );


            /* ============================
               SUCCESS
            ============================ */

// Hiển thị thông báo đăng ký thành công
successMessage.classList.add("show");

// Chuyển sang checkout sau khi lưu Supabase
// và gửi email xác nhận thành công

const checkoutUrl = new URL("checkout.html", window.location.href);
checkoutUrl.searchParams.set("course", course || "");

// Lưu email tạm thời để trang checkout kiểm tra ưu đãi
const checkoutEmail = document.querySelector(
    '#registerForm input[type="email"], input[type="email"]'
)?.value?.trim();

if (checkoutEmail) {
    sessionStorage.setItem("move_checkout_email", checkoutEmail);
}

window.location.href = checkoutUrl.href;
return;



            /*
             * Cuộn nhẹ xuống thông báo
             */

            successMessage.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });


        } catch (error) {

            console.error(
                "EmailJS Error:",
                error
            );


            generalError.textContent =
                "Có lỗi xảy ra khi gửi đăng ký. Vui lòng thử lại sau.";

            generalError.style.display =
                "block";


        } finally {

            submitButton.disabled = false;

            submitButton.classList.remove(
                "is-loading"
            );

        }

    });

});