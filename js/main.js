/* =========================================
   MOVÉ — MAIN JS
========================================= */
// SUPABASE AUTH CONFIG
const MOVE_NAV_SUPABASE_URL = "https://ytkwluvxnasqkkyosgsx.supabase.co";
const MOVE_NAV_SUPABASE_PUBLISHABLE_KEY = "sb_publishable_-ja9UETwevbSVOq5FOjW8A_06_O7u8J";
document.addEventListener("DOMContentLoaded", async () => {

    // Xác định đang ở root hay trong /pages/
    const root = getRootPath();

    // Load Navbar
    await loadComponent(
        "navbar",
        `${root}components/navbar.html`
    );
// Cập nhật navbar theo trạng thái đăng nhập
await setupAuthNavbar();
    // Load Footer
    await loadComponent(
        "footer",
        `${root}components/footer.html`
    );

    // Xử lý link
    setPageLinks();

    // Xử lý hình ảnh
    setImagePaths();
});


/* =========================================
   XÁC ĐỊNH ĐƯỜNG DẪN GỐC
========================================= */

function getRootPath() {

    const path = window.location.pathname;

    // Nếu đang ở /pages/
    if (path.includes("/pages/")) {
        return "../";
    }

    // Nếu đang ở index.html
    return "";
}


/* =========================================
   LOAD COMPONENT
========================================= */

async function loadComponent(id, file) {

    const element = document.getElementById(id);

    if (!element) return;

    try {

        const response = await fetch(file);

        if (!response.ok) {
            throw new Error(`Không thể tải ${file}`);
        }

        const html = await response.text();

        element.innerHTML = html;


        // Sau khi navbar được load xong
        // thì mới setup mobile menu
        if (id === "navbar") {
            setupMobileMenu();
        }

    } catch (error) {

        console.error(
            `Lỗi khi load ${file}:`,
            error
        );

    }
}


/* =========================================
   MOBILE MENU
========================================= */

function setupMobileMenu() {

    const mobileMenu =
        document.getElementById("mobile-menu");

    const navLinks =
        document.querySelector(".nav-links");


    if (!mobileMenu || !navLinks) {
        return;
    }


    // Nút 3 gạch
    mobileMenu.addEventListener("click", () => {

        navLinks.classList.toggle("active");

        mobileMenu.classList.toggle("is-active");

    });


    // Click link → đóng menu
    document
        .querySelectorAll(".nav-links a")
        .forEach(link => {

            link.addEventListener("click", () => {

                navLinks.classList.remove("active");

                mobileMenu.classList.remove(
                    "is-active"
                );

            });

        });
}

/* =========================================
   XỬ LÝ LINK TRONG NAVBAR + FOOTER
========================================= */

function setPageLinks() {

    const root = getRootPath();

    const links =
        document.querySelectorAll("[data-page]");


    links.forEach(link => {

        const page = link.dataset.page;

        if (!page) return;


        // Trang chủ
        if (page === "index.html") {

            link.href =
                `${root}index.html`;

            return;
        }


        // Các page khác
        link.href =
            `${root}pages/${page}`;

    });
}


/* =========================================
   XỬ LÝ IMAGE PATH
========================================= */

function setImagePaths() {

    const root = getRootPath();

    const images =
        document.querySelectorAll("[data-image]");


    images.forEach(image => {

        const imagePath =
            image.dataset.image;

        if (!imagePath) return;


        image.src =
            `${root}${imagePath}`;

    });
}
/* =========================================
   FIRST MOVE — DISCOUNT POPUP
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const modal = document.getElementById("firstMoveModal");
    const openButton = document.getElementById("openFirstMove");

    const closeButton = document.getElementById("closeFirstMove");
    const closeBottomButton = document.getElementById("closeFirstMoveBottom");
    const overlay = document.getElementById("closeFirstMoveOverlay");

    if (!modal || !openButton) return;


    function openModal(event) {

        event.preventDefault();

        modal.classList.add("is-open");

        modal.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.style.overflow = "hidden";
    }


    function closeModal() {

        modal.classList.remove("is-open");

        modal.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.style.overflow = "";
    }


    openButton.addEventListener(
        "click",
        openModal
    );


    closeButton.addEventListener(
        "click",
        closeModal
    );


    closeBottomButton.addEventListener(
        "click",
        closeModal
    );


    overlay.addEventListener(
        "click",
        closeModal
    );


    document.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Escape" &&
                modal.classList.contains("is-open")
            ) {

                closeModal();

            }

        }
    );

});
/* =========================================
   MOVE TOGETHER — DISCOUNT POPUP
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const modal =
        document.getElementById("moveTogetherModal");

    const openButton =
        document.getElementById("openMoveTogether");

    const closeButton =
        document.getElementById("closeMoveTogether");

    const closeBottomButton =
        document.getElementById("closeMoveTogetherBottom");

    const overlay =
        document.getElementById("closeMoveTogetherOverlay");


    // Không làm gì nếu trang không có popup
    if (!modal || !openButton) return;


    function openModal(event) {

        event.preventDefault();

        modal.classList.add("is-open");

        modal.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.style.overflow = "hidden";
    }


    function closeModal() {

        modal.classList.remove("is-open");

        modal.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.style.overflow = "";
    }


    // Mở popup
    openButton.addEventListener(
        "click",
        openModal
    );


    // Đóng bằng dấu X
    closeButton.addEventListener(
        "click",
        closeModal
    );


    // Đóng bằng nút Đã hiểu
    closeBottomButton.addEventListener(
        "click",
        closeModal
    );


    // Đóng khi click bên ngoài
    overlay.addEventListener(
        "click",
        closeModal
    );


    // Đóng bằng ESC
    document.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Escape" &&
                modal.classList.contains("is-open")
            ) {

                closeModal();

            }

        }
    );

});
function toggleArticle(card) {
    card.classList.toggle('active');

    const linkText = card.querySelector('.article-link');
    if (card.classList.contains('active')) {
        linkText.innerHTML = "Thu gọn &uarr;";
    } else {
        linkText.innerHTML = "Đọc bài viết &rarr;";
    }
}
/* =========================================
   AUTH NAVBAR — SUPABASE
========================================= */

async function setupAuthNavbar() {
    const navItem = document.getElementById("auth-nav-item");
    const navLink = document.getElementById("auth-nav-link");

    if (!navItem || !navLink) return;

    try {
        // Tải thư viện Supabase nếu trang chưa có
        if (!window.supabase?.createClient) {
            await new Promise((resolve, reject) => {
                const script = document.createElement("script");
                script.src =
                    "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";

                script.onload = resolve;
                script.onerror = () =>
                    reject(new Error("Không tải được Supabase"));

                document.head.appendChild(script);
            });
        }

const client = window.supabase.createClient(
    MOVE_NAV_SUPABASE_URL,
    MOVE_NAV_SUPABASE_PUBLISHABLE_KEY
);

        // Tránh gắn sự kiện đăng xuất nhiều lần
        let isSigningOut = false;

        function renderNavbar(user) {
            if (!user) {
                navItem.innerHTML = `
                    <a
                        href="#"
                        data-page="login.html"
                        class="nav-test"
                        id="auth-nav-link"
                    >
                        ĐĂNG NHẬP/ĐĂNG KÝ
                    </a>
                `;

                const loginLink =
                    document.getElementById("auth-nav-link");

                loginLink.href = `${getRootPath()}pages/login.html`;

                return;
            }

            const name =
                user.user_metadata?.full_name ||
                user.user_metadata?.name ||
                user.email ||
                "Học viên";

            navItem.innerHTML = `
                <span class="nav-user-name"style="color:#F1ECE1"></span>
                <a
                    href="#"
                    class="nav-test"
                    id="auth-logout-link"
                >
                    ĐĂNG XUẤT
                </a>
            `;

            // Dùng textContent để tránh chèn HTML từ tên người dùng
            navItem.querySelector(".nav-user-name").textContent =
                `Xin chào, ${name}`;

            const logoutLink =
                document.getElementById("auth-logout-link");

            logoutLink.addEventListener("click", async (event) => {
                event.preventDefault();

                if (isSigningOut) return;
                isSigningOut = true;
                logoutLink.textContent = "ĐANG ĐĂNG XUẤT...";

                try {
                    const { error } = await client.auth.signOut();

                    if (error) throw error;

                    // Trạng thái navbar sẽ được cập nhật
                    // bởi onAuthStateChange bên dưới.
                } catch (error) {
                    console.error("Lỗi đăng xuất:", error);
                    alert("Chưa thể đăng xuất. Bạn hãy thử lại nhé.");
                } finally {
                    isSigningOut = false;
                }
            });
        }

        // Lấy phiên đăng nhập hiện tại
        const { data, error } = await client.auth.getSession();

        if (error) throw error;

        renderNavbar(data.session?.user ?? null);

        // Tự cập nhật khi đăng nhập hoặc đăng xuất
        client.auth.onAuthStateChange((_event, session) => {
            renderNavbar(session?.user ?? null);
        });

    } catch (error) {
        console.error("Không thể khởi tạo navbar đăng nhập:", error);
    }
}