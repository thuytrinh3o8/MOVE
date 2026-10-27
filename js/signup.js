/* ========================================
   MOVÉ SIGNUP
   Supabase Authentication
======================================== */

// Dùng cùng URL và publishable key trong login.js.
// Không dùng sb_secret_... ở trình duyệt.
const SUPABASE_URL ="https://ytkwluvxnasqkkyosgsx.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_-ja9UETwevbSVOq5FOjW8A_06_O7u8J";
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("signupForm");
    const nameInput = document.getElementById("signupName");
    const emailInput = document.getElementById("signupEmail");
    const passwordInput = document.getElementById("signupPassword");
    const confirmInput = document.getElementById("signupConfirmPassword");
    const submitButton = document.getElementById("signupSubmit");
    const submitText = document.getElementById("signupSubmitText");
    const errorMessage = document.getElementById("signupError");
    const successMessage = document.getElementById("signupSuccess");

    if (
        !form || !nameInput || !emailInput ||
        !passwordInput || !confirmInput ||
        !submitButton || !submitText ||
        !errorMessage || !successMessage
    ) {
        console.error("MOVÉ Signup: Không tìm thấy form đăng ký.");
        return;
    }

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = "block";
        successMessage.textContent = "";
        successMessage.style.display = "none";
    }

    function showSuccess(message) {
        successMessage.textContent = message;
        successMessage.style.display = "block";
        errorMessage.textContent = "";
        errorMessage.style.display = "none";
    }

    function setLoading(isLoading) {
        submitButton.disabled = isLoading;
        submitText.textContent = isLoading
            ? "ĐANG TẠO TÀI KHOẢN..."
            : "TẠO TÀI KHOẢN";
    }

    // Hiện / ẩn từng trường mật khẩu
    document.querySelectorAll("[data-toggle-password]").forEach((button) => {
        button.addEventListener("click", () => {
            const inputId = button.dataset.togglePassword;
            const input = document.getElementById(inputId);

            if (!input) return;

            const isHidden = input.type === "password";
            input.type = isHidden ? "text" : "password";
            button.textContent = isHidden ? "ẨN" : "HIỆN";
            button.setAttribute(
                "aria-label",
                isHidden ? "Ẩn mật khẩu" : "Hiện mật khẩu"
            );
        });
    });

    // Kiểm tra SDK và cấu hình
    if (!window.supabase) {
        showError("Không tải được Supabase. Hãy kiểm tra kết nối mạng.");
        return;
    }

    if (
        SUPABASE_URL === "YOUR_SUPABASE_PROJECT_URL" ||
        SUPABASE_PUBLISHABLE_KEY === "YOUR_SUPABASE_PUBLISHABLE_KEY"
    ) {
        showError("Bạn cần cấu hình URL và publishable key của Supabase trong signup.js.");
        return;
    }

    const supabaseClient = window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        errorMessage.style.display = "none";
        successMessage.style.display = "none";

        const fullName = nameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const confirmPassword = confirmInput.value;

        if (!fullName || !email || !password || !confirmPassword) {
            showError("Vui lòng điền đầy đủ các thông tin.");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showError("Email chưa đúng định dạng. Vui lòng kiểm tra lại.");
            emailInput.focus();
            return;
        }

        if (password.length < 8) {
            showError("Mật khẩu cần có ít nhất 8 ký tự.");
            passwordInput.focus();
            return;
        }

        if (password !== confirmPassword) {
            showError("Mật khẩu xác nhận chưa khớp.");
            confirmInput.focus();
            return;
        }

        setLoading(true);

        try {
            const { data, error } = await supabaseClient.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName
                    }
                }
            });

            if (error) {
                console.error("MOVÉ Signup:", error.message);

                if (error.message.toLowerCase().includes("already registered")) {
                    showError("Email này đã được đăng ký. Hãy thử đăng nhập.");
                } else {
                    showError(
                        "Chưa tạo được tài khoản. Vui lòng kiểm tra thông tin và thử lại."
                    );
                }

                return;
            }

            if (data.session) {
                showSuccess("Tạo tài khoản thành công! Đang chuyển về trang chủ...");

                window.setTimeout(() => {
                    window.location.href = "../index.html";
                }, 1200);
            } else {
                showSuccess(
                    "Đã tạo yêu cầu đăng ký. Hãy kiểm tra email để xác nhận tài khoản trước khi đăng nhập."
                );

                form.reset();
            }

        } catch (error) {
            console.error("MOVÉ Signup Error:", error);
            showError("Không thể kết nối hệ thống. Hãy thử lại sau.");
        } finally {
            setLoading(false);
        }
    });
});