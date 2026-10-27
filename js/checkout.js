/* ========================================
   MOVÉ — CHECKOUT
   Kiểm tra giá + tạo đơn hàng chờ thanh toán
======================================== */

document.addEventListener("DOMContentLoaded", async () => {
    const courseElement = document.getElementById("checkoutCourse");
    const priceElement = document.getElementById("checkoutPrice");
    const paymentButton = document.getElementById("demoPaymentButton");
    const messageElement = document.getElementById("checkoutMessage");
    const noticeElement = document.querySelector(".checkout-notice");
    const summaryElement = document.querySelector(".checkout-summary");

    const params = new URLSearchParams(window.location.search);
    const courseId = params.get("course") || "";
    const email = (
        sessionStorage.getItem("move_checkout_email") || ""
    ).trim().toLowerCase();

const API_URL = "https://move-guyg.onrender.com/api";

    const formatPrice = (price) =>
        new Intl.NumberFormat("vi-VN").format(price) + "đ";

    const courses = {
        "khoi-dong": { name: "Khởi Động", price: 990000 },
        "nhap-cuoc": { name: "Nhập Cuộc", price: 1450000 },
        "van-dung": { name: "Vận Dụng", price: 2200000 },
        "chinh-phuc": { name: "Chinh Phục", price: 3000000 },
        "tron-bo-4-khoa": {
            name: "Trọn bộ 4 khóa học",
            price: 6800000,
            originalPrice: 7640000
        }
    };

    const selectedCourse = courses[courseId];

    if (
        !courseElement ||
        !priceElement ||
        !paymentButton ||
        !messageElement
    ) {
        console.error("MOVÉ Checkout: Không tìm thấy đủ thành phần HTML.");
        return;
    }

    const showMessage = (text) => {
        messageElement.textContent = text;
    };

    const showNotice = (text) => {
        if (!noticeElement) return;

        const paragraph = noticeElement.querySelector("p");

        if (paragraph) {
            paragraph.textContent = text;
        } else {
            noticeElement.textContent = text;
        }
    };

    const showOriginalPrice = (
        originalPrice,
        finalPrice,
        discountAmount
    ) => {
        if (!summaryElement) return;

        const oldBlock = summaryElement.querySelector(
            ".checkout-original-price"
        );

        if (oldBlock) oldBlock.remove();

        if (
            typeof originalPrice !== "number" ||
            typeof finalPrice !== "number" ||
            originalPrice <= finalPrice
        ) {
            return;
        }

        const block = document.createElement("div");
        block.className = "checkout-original-price";
        block.style.marginTop = "10px";

        const label = document.createElement("p");
        label.className = "checkout-label";
        label.textContent = "GIÁ GỐC";

        const value = document.createElement("p");
        value.style.margin = "0";
        value.style.color = "#888";
value.style.textDecoration = "line-through";

        value.textContent = formatPrice(originalPrice);

        const saving = document.createElement("p");
        saving.style.margin = "8px 0 0";
        saving.style.fontSize = "13px";
        saving.style.fontWeight = "600";

        saving.textContent = discountAmount > 0
            ? `Ưu đãi ${formatPrice(discountAmount)}`
            : `Tiết kiệm ${formatPrice(originalPrice - finalPrice)}`;

        block.append(label, value, saving);
        priceElement.insertAdjacentElement("afterend", block);
    };

    if (!selectedCourse) {
        courseElement.textContent = "Chưa xác định khóa học";
        priceElement.textContent = "Vui lòng chọn khóa học trước";
        paymentButton.disabled = true;
        paymentButton.textContent = "VUI LÒNG CHỌN KHÓA HỌC";
        showMessage(
            "Bạn vui lòng quay lại trang khóa học và chọn khóa muốn đăng ký."
        );
        return;
    }

    courseElement.textContent = selectedCourse.name;
    priceElement.textContent = "Đang kiểm tra giá ưu đãi...";
    paymentButton.disabled = true;

    if (!email) {
        priceElement.textContent = "Chưa kiểm tra được giá";
        showNotice(
            "Chưa tìm thấy email đăng ký trong phiên hiện tại. Bà vui lòng quay lại đăng ký khóa học rồi tiếp tục."
        );
        showMessage(
            "Không tìm thấy email đăng ký. Chưa thể xác nhận ưu đãi."
        );
        paymentButton.textContent = "CHƯA THỂ TIẾP TỤC";
        return;
    }

    // 1. Kiểm tra giá từ backend
    let quote;

    try {
        const response = await fetch(
            `${API_URL}/course-checkout-quote`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    course_id: courseId
                })
            }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(
                result.message || "Không thể kiểm tra giá ưu đãi."
            );
        }

        quote = result;
    } catch (error) {
        console.error("MOVÉ Checkout quote error:", error);

        priceElement.textContent = "Chưa thể xác nhận giá";
        showNotice(
            "Hệ thống chưa kiểm tra được ưu đãi. Vui lòng thử lại sau."
        );
        showMessage(
            error.message ||
            "Không thể kết nối máy chủ. Bà kiểm tra backend rồi thử lại nhé."
        );
        paymentButton.textContent = "CHƯA THỂ TIẾP TỤC";
        return;
    }

    // Hiển thị giá do backend trả về
    courseElement.textContent = quote.course_name;
    priceElement.textContent = formatPrice(quote.final_price);

    showOriginalPrice(
        quote.original_price,
        quote.final_price,
        quote.discount_amount
    );

    if (courseId === "tron-bo-4-khoa") {
        showNotice(
            "Gói trọn bộ áp dụng giá 6.800.000đ, không cộng thêm ưu đãi 3%. Ưu đãi nhóm vui lòng liên hệ MOVÉ."
        );
    } else if (quote.is_first_purchase) {
        showNotice(
            `Chúc mừng! Bạn được giảm 3% cho lần mua đầu tiên. Mã ưu đãi: ${quote.discount_code}. Ưu đãi nhóm cần liên hệ MOVÉ.`
        );
    } else {
        showNotice(
            "Giá đã được kiểm tra theo lịch sử đơn hàng. Ưu đãi mua lần đầu không áp dụng. Ưu đãi nhóm vui lòng liên hệ MOVÉ."
        );
    }

    // 2. Bấm TIẾP TỤC để tạo đơn hàng pending
    paymentButton.disabled = false;
    paymentButton.textContent = "TIẾP TỤC";

    paymentButton.addEventListener("click", async () => {
        // Chặn bấm nhiều lần trong lúc xử lý
        if (paymentButton.disabled) return;

        paymentButton.disabled = true;
        paymentButton.textContent = "ĐANG TẠO ĐƠN HÀNG...";
        showMessage("MOVÉ đang tạo đơn hàng, bà chờ một chút nhé.");

        try {
            const response = await fetch(
                `${API_URL}/course-orders`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email,
                        course_id: courseId
                    })
                }
            );

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message || "Không thể tạo đơn hàng."
                );
            }

            // Hiển thị thông tin đơn hàng thực tế từ backend
            priceElement.textContent = formatPrice(result.final_price);

            showNotice(
                `Đơn hàng #${result.order_id} đã được tạo và đang chờ thanh toán.`
            );

            showMessage(
                `Tạo đơn hàng thành công! Mã đơn: #${result.order_id}. ` +
                `Khóa học: ${result.course_name}. ` +
                `Số tiền: ${formatPrice(result.final_price)}. ` +
                "Đơn hàng đang chờ thanh toán. Đây là bản demo, chưa có giao dịch thật."
            );

            paymentButton.textContent = "ĐANG MỞ XÁC NHẬN...";

const confirmationUrl = new URL(
    "order-confirmation.html",
    window.location.href
);

confirmationUrl.searchParams.set("id", result.order_id);

window.location.href = confirmationUrl.href;
return;

        } catch (error) {
            console.error("MOVÉ Create order error:", error);

            showMessage(
                error.message ||
                "Không thể tạo đơn hàng. Bà kiểm tra kết nối rồi thử lại nhé."
            );

            paymentButton.textContent = "THỬ TẠO ĐƠN LẠI";
            paymentButton.disabled = false;
        }
    });
});