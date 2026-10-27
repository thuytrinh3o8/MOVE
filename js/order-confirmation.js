
document.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get("id");

    const email = (
        sessionStorage.getItem("move_checkout_email") || ""
    ).trim().toLowerCase();

    const intro = document.getElementById("introMessage");
    const content = document.getElementById("orderContent");
    const errorMessage = document.getElementById("errorMessage");

    const formatPrice = (price) =>
        new Intl.NumberFormat("vi-VN").format(price) + "đ";

    const showError = (message) => {
        intro.textContent = "Chưa thể xác nhận thông tin đơn hàng.";
        errorMessage.textContent = message;
        errorMessage.classList.remove("hidden");
    };

    // Kiểm tra mã đơn hàng và email
    if (!orderId || !email) {
        showError(
            "Thiếu mã đơn hàng hoặc email đăng ký. Bạn vui lòng quay lại quy trình đăng ký và thử lại."
        );
        return;
    }

    try {
        const response = await fetch(
            `http://localhost:3000/api/course-orders/${encodeURIComponent(orderId)}?email=${encodeURIComponent(email)}`
        );

        const result = await response.json();

        if (!response.ok || !result.success || !result.order) {
            throw new Error(
                result.message || "Không tìm thấy đơn hàng."
            );
        }

        const order = result.order;

        // Hiển thị thông tin đơn hàng
        document.getElementById("orderId").textContent =
            "#" + order.id;

        document.getElementById("courseName").textContent =
            order.course_name;

        document.getElementById("createdAt").textContent =
            order.created_at
                ? new Date(order.created_at).toLocaleString("vi-VN")
                : "—";

        document.getElementById("originalPrice").textContent =
            formatPrice(order.original_price);

        document.getElementById("discountAmount").textContent =
            order.discount_amount > 0
                ? "−" + formatPrice(order.discount_amount)
                : "0đ";

        document.getElementById("finalPrice").textContent =
            formatPrice(order.final_price);

        // Trạng thái thanh toán
        const statusLabels = {
            pending: "Chờ thanh toán",
            paid: "Đã thanh toán",
            cancelled: "Đã hủy"
        };

        document.getElementById("orderStatus").textContent =
            statusLabels[order.payment_status] ||
            "Chưa xác định";

        // Thông báo theo trạng thái đơn hàng
        const notice = document.getElementById("orderNotice");

        if (order.payment_status === "paid") {
            notice.textContent =
                "Đơn hàng đã được ghi nhận là thanh toán thành công.";
        } else if (order.payment_status === "cancelled") {
            notice.textContent =
                "Đơn hàng này đã bị hủy. Vui lòng liên hệ MOVÉ nếu cần hỗ trợ.";
        } else {
            notice.textContent =
                "Đơn hàng đã được tạo và đang chờ thanh toán. MOVÉ sẽ nhanh chóng liên hệ với bạn trong 24h tới để xác nhận khoá học và hỗ trợ thanh toán";
        }

        intro.textContent =
            "MOVÉ đã nhận được thông tin đơn hàng của bạn.";

        content.classList.remove("hidden");
    } catch (error) {
        console.error("MOVÉ Order confirmation error:", error);

        showError(
            error.message ||
            "Không thể kết nối máy chủ. Bà kiểm tra backend rồi tải lại trang nhé."
        );
    }
});
