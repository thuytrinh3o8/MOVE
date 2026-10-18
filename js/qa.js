
document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("qaSearch");
  const clearSearchButton = document.getElementById("clearSearch");
  const filterButtons = document.querySelectorAll(".qa-filter");
  const questionItems = Array.from(
    document.querySelectorAll(".qa-item")
  );
  const emptyState = document.getElementById("qaEmpty");
  const showAllButton = document.getElementById("showAllQuestions");
  const countText = document.getElementById("qaCount");

  if (
    !searchInput ||
    !clearSearchButton ||
    !emptyState ||
    !showAllButton ||
    !countText
  ) {
    return;
  }

  let activeCategory = "all";

  // Chuẩn hóa tiếng Việt để tìm kiếm không phân biệt dấu
  function normalizeText(text) {
    return text
      .toLocaleLowerCase("vi")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .trim();
  }

  // Lấy nội dung của câu hỏi và câu trả lời
  function getSearchableText(item) {
    return normalizeText(item.textContent);
  }

  // Đóng tất cả câu trả lời
  function closeAllAnswers() {
    questionItems.forEach((item) => {
      const button = item.querySelector(".qa-question");
      const answer = item.querySelector(".qa-answer");

      item.classList.remove("is-open");
      button.setAttribute("aria-expanded", "false");
      answer.hidden = true;
    });
  }

  // Mở hoặc đóng câu trả lời được chọn
  function toggleAnswer(button) {
    const item = button.closest(".qa-item");
    const answer = item.querySelector(".qa-answer");
    const isOpen = button.getAttribute("aria-expanded") === "true";

    // Chỉ mở một câu hỏi tại một thời điểm
    closeAllAnswers();

    if (!isOpen) {
      item.classList.add("is-open");
      button.setAttribute("aria-expanded", "true");
      answer.hidden = false;
    }
  }

  // Xử lý nhấn vào câu hỏi
  questionItems.forEach((item) => {
    const button = item.querySelector(".qa-question");

    button.addEventListener("click", () => {
      toggleAnswer(button);
    });
  });

  // Lọc và tìm kiếm câu hỏi
  function updateQuestions() {
    const keyword = normalizeText(searchInput.value);
    let visibleCount = 0;

    closeAllAnswers();

    questionItems.forEach((item) => {
      const category = item.dataset.category;
      const searchableText = getSearchableText(item);

      const matchesCategory =
        activeCategory === "all" ||
        category === activeCategory;

      const matchesKeyword =
        keyword === "" ||
        searchableText.includes(keyword);

      const isVisible = matchesCategory && matchesKeyword;

      item.hidden = !isVisible;

      if (isVisible) {
        visibleCount += 1;

        // Đánh số lại theo danh sách đang hiển thị
        const number = item.querySelector(".qa-number");
        number.textContent = String(visibleCount).padStart(2, "0");
      }
    });

    // Hiện nút xóa khi có nội dung tìm kiếm
    clearSearchButton.hidden = searchInput.value.length === 0;

    // Thông báo khi không có kết quả
    emptyState.hidden = visibleCount !== 0;

    // Cập nhật số lượng câu hỏi
    countText.textContent =
      visibleCount === 1
        ? "Đang hiển thị 1 câu hỏi"
        : `Đang hiển thị ${visibleCount} câu hỏi`;
  }

  // Chọn danh mục
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeCategory = button.dataset.category;

      filterButtons.forEach((filter) => {
        const isActive = filter === button;

        filter.classList.toggle("active", isActive);
        filter.setAttribute("aria-pressed", String(isActive));
      });

      updateQuestions();
    });
  });

  // Tìm kiếm theo từ khóa
  searchInput.addEventListener("input", updateQuestions);

  // Xóa từ khóa tìm kiếm
  clearSearchButton.addEventListener("click", () => {
    searchInput.value = "";
    updateQuestions();
    searchInput.focus();
  });

  // Quay về danh sách tất cả câu hỏi
  showAllButton.addEventListener("click", () => {
    searchInput.value = "";
    activeCategory = "all";

    filterButtons.forEach((button) => {
      const isActive = button.dataset.category === "all";

      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

    updateQuestions();
  });

  // Khởi tạo trạng thái ban đầu
  updateQuestions();
});
