function showPolicy(policyId, clickedButton) {
    // Ẩn tất cả nội dung chính sách
    const sections = document.querySelectorAll(".policy-section");
    sections.forEach(section => {
        section.classList.remove("active");
    });

    // Bỏ trạng thái active khỏi tất cả các nút bấm menu
    const buttons = document.querySelectorAll(".policy-btn");
    buttons.forEach(button => {
        button.classList.remove("active");
    });

    // Hiển thị nội dung được chọn
    const selectedSection = document.getElementById(policyId);
    if (selectedSection) {
        selectedSection.classList.add("active");
    }

    // Highlight menu tương ứng
    clickedButton.classList.add("active");

    // Trên mobile, tự động scroll mượt xuống phần nội dung vừa chuyển
    if (window.innerWidth <= 650) {
        setTimeout(() => {
            selectedSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }, 100);
    }
}