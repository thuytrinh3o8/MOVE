/* ========================================
   MOVÉ LOGIN
   Supabase Authentication
======================================== */

// Thay bằng URL và publishable key của dự án Supabase.
// Chỉ dùng sb_publishable_..., KHÔNG dùng sb_secret_...
const SUPABASE_URL ="https://ytkwluvxnasqkkyosgsx.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_-ja9UETwevbSVOq5FOjW8A_06_O7u8J";

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("loginForm");
    const emailInput = document.getElementById("loginEmail");
    const passwordInput = document.getElementById("loginPassword");
    const togglePassword = document.getElementById("togglePassword");
    const submitButton = document.getElementById("loginSubmit");
    const submitText = document.getElementById("loginSubmitText");
    const errorMessage = document.getElementById("loginError");
    const successMessage = document.getElementById("loginSuccess");

    if (
        !form ||
        !emailInput ||
        !passwordInput ||
        !togglePassword ||
        !submitButton ||
        !submitText ||
        !errorMessage ||
        !successMessage
    ) {
        console.error("MOVÉ Login: Không tìm thấy các thành phần của form.");
        return;
    }

    // Kiểm tra Supabase SDK đã tải hay chưa
    if (!window.supabase) {
        showError("Không tải được thư viện đăng nhập. Hãy kiểm tra kết nối mạng.");
        return;
    }

    // Kiểm tra cấu hình
    if (
        SUPABASE_URL === "YOUR_SUPABASE_PROJECT_URL" ||
        SUPABASE_PUBLISHABLE_KEY === "YOUR_SUPABASE_PUBLISHABLE_KEY"
    ) {
        showError("Bạn cần cấu hình URL và publishable key của Supabase trong login.js.");
        return;
    }

    const supabaseClient = window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );

    // Hiện / ẩn mật khẩu
    togglePassword.addEventListener("click", () => {
        const isHidden = passwordInput.type === "password";

        passwordInput.type = isHidden ? "text" : "password";
        togglePassword.textContent = isHidden ? "ẨN" : "HIỆN";
        togglePassword.setAttribute(
            "aria-label",
            isHidden ? "Ẩn mật khẩu" : "Hiện mật khẩu"
        );
    });

    // Xóa thông báo lỗi khi người dùng sửa dữ liệu
    [emailInput, passwordInput].forEach((input) => {
        input.addEventListener("input", () => {
            errorMessage.textContent = "";
            errorMessage.style.display = "none";
            successMessage.textContent = "";
            successMessage.style.display = "none";
        });
    });

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        errorMessage.textContent = "";
        errorMessage.style.display = "none";
        successMessage.textContent = "";
        successMessage.style.display = "none";

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        if (!email || !password) {
            showError("Vui lòng nhập đầy đủ email và mật khẩu.");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showError("Email chưa đúng định dạng. Vui lòng kiểm tra lại.");
            emailInput.focus();
            return;
        }

        setLoading(true);

        try {
            const { data, error } =
                await supabaseClient.auth.signInWithPassword({
                    email,
                    password
                });

            if (error) {
                console.error("MOVÉ Login:", error.message);

                if (
                    error.message.toLowerCase().includes("email not confirmed")
                ) {
                    showError(
                        "Email của bạn chưa được xác nhận. Hãy kiểm tra hộp thư."
                    );
                } else {
                    showError(
                        "Đăng nhập chưa thành công. Hãy kiểm tra email và mật khẩu."
                    );
                }

                return;
            }

            if (!data.session) {
                showError("Chưa tạo được phiên đăng nhập. Vui lòng thử lại.");
                return;
            }

            // Supabase tự lưu phiên đăng nhập trong trình duyệt
            successMessage.textContent =
                "Đăng nhập thành công! Đang chuyển về trang chủ...";
            successMessage.style.display = "block";

            setTimeout(() => {
                window.location.href = "../index.html";
            }, 900);

        } catch (error) {
            console.error("MOVÉ Login Error:", error);

            showError(
                "Không thể kết nối hệ thống. Hãy kiểm tra mạng và thử lại."
            );
        } finally {
            setLoading(false);
        }
    });

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = "block";
    }

    function setLoading(isLoading) {
        submitButton.disabled = isLoading;
        submitText.textContent = isLoading
            ? "ĐANG ĐĂNG NHẬP..."
            : "ĐĂNG NHẬP";
    }
});