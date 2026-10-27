
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_PUBLISHABLE_KEY
);
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
);
// Kiem tra backend
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "MOVÉ backend đang hoạt động!"
  });
});

// Kiem tra cau hinh
app.get("/api/config-check", (req, res) => {
  res.json({
    supabaseUrlConfigured: Boolean(process.env.SUPABASE_URL),
    supabaseKeyConfigured: Boolean(
      process.env.SUPABASE_PUBLISHABLE_KEY
    )
  });
});

// Dang ky tai khoan MOVÉ
app.post("/api/auth/register", async (req, res) => {
  try {
    const { full_name, email, password } = req.body || {};

    if (
      typeof full_name !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string" ||
      !full_name.trim() ||
      !email.trim() ||
      password.length < 8
    ) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập họ tên, email và mật khẩu tối thiểu 8 ký tự."
      });
    }

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          full_name: full_name.trim()
        }
      }
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    return res.status(201).json({
      success: true,
      message: data.session
        ? "Đăng ký thành công!"
        : "Đã tiếp nhận đăng ký. Nếu được yêu cầu xác nhận email, hãy kiểm tra hộp thư của bạn.",
      user: data.user
        ? {
            id: data.user.id,
            email: data.user.email
          }
        : null
    });
  } catch (error) {
    console.error("Lỗi đăng ký:", error.message);

    return res.status(500).json({
      success: false,
      message: "Máy chủ gặp lỗi khi đăng ký. Vui lòng thử lại."
    });
  }
});


/* API đăng ký khóa học MOVÉ */
app.post("/api/course-registrations", async (req, res) => {
  try {
    const { full_name, phone, email, age, course_name } = req.body || {};

    if (
      typeof full_name !== "string" || !full_name.trim() ||
      typeof phone !== "string" || !phone.trim() ||
      typeof email !== "string" || !email.trim() ||
      !Number.isInteger(Number(age)) ||
      Number(age) < 5 || Number(age) > 100 ||
      typeof course_name !== "string" || !course_name.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng kiểm tra và nhập đầy đủ thông tin hợp lệ."
      });
    }

    const { error } = await supabaseAdmin
      .from("course_registrations")
      .insert([{
        full_name: full_name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        age: Number(age),
        course_name: course_name.trim()
      }]);

    if (error) {
      console.error("Lỗi lưu đăng ký:", error.message);
      return res.status(500).json({
        success: false,
        message: "Chưa lưu được thông tin đăng ký. Vui lòng thử lại."
      });
    }

    return res.status(201).json({
      success: true,
      message: "Đăng ký khóa học thành công!"
    });
  } catch (error) {
    console.error("Lỗi đăng ký khóa học:", error.message);
    return res.status(500).json({
      success: false,
      message: "Máy chủ gặp lỗi. Vui lòng thử lại."
    });
  }
});

app.post("/api/course-checkout-quote", async (req, res) => {
  try {
    const { email, course_id } = req.body || {};

    const coursePrices = {
      "khoi-dong": {
        name: "Khởi Động",
        price: 990000
      },
      "nhap-cuoc": {
        name: "Nhập Cuộc",
        price: 1450000
      },
      "van-dung": {
        name: "Vận Dụng",
        price: 2200000
      },
      "chinh-phuc": {
        name: "Chinh Phục",
        price: 3000000
      },
      "tron-bo-4-khoa": {
        name: "Trọn bộ 4 khóa học",
        price: 6800000,
        originalPrice: 7640000
      }
    };

    if (
      typeof email !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
      typeof course_id !== "string" ||
      !coursePrices[course_id]
    ) {
      return res.status(400).json({
        success: false,
        message: "Email hoặc khóa học không hợp lệ."
      });
    }

    const course = coursePrices[course_id];
    const normalizedEmail = email.trim().toLowerCase();

    // Combo luôn giữ giá ưu đãi cố định, không cộng thêm giảm giá.
    if (course_id === "tron-bo-4-khoa") {
      return res.json({
        success: true,
        course_name: course.name,
        original_price: course.originalPrice,
        discount_amount: 0,
        final_price: course.price,
        discount_code: null,
        is_first_purchase: null,
        note: "Combo đã áp dụng giá ưu đãi riêng."
      });
    }

    // Kiểm tra xem email này từng có đơn đã thanh toán chưa.
    const { data: paidOrders, error } = await supabaseAdmin
      .from("course_orders")
      .select("id")
      .ilike("email", normalizedEmail)
      .eq("payment_status", "paid")
      .limit(1);

    if (error) {
      console.error("Lỗi kiểm tra lịch sử mua:", error.message);

      return res.status(500).json({
        success: false,
        message: "Chưa thể kiểm tra ưu đãi. Vui lòng thử lại."
      });
    }

    const isFirstPurchase = paidOrders.length === 0;
    const discountAmount = isFirstPurchase
      ? Math.round(course.price * 0.03)
      : 0;

    return res.json({
      success: true,
      course_name: course.name,
      original_price: course.price,
      discount_amount: discountAmount,
      final_price: course.price - discountAmount,
      discount_code: isFirstPurchase ? "WELCOME3" : null,
      is_first_purchase: isFirstPurchase,
      note: isFirstPurchase
        ? "Giá dự kiến đã tính ưu đãi lần đầu 3%."
        : "Không áp dụng ưu đãi người mua lần đầu."
    });
  } catch (error) {
    console.error("Lỗi kiểm tra giá checkout:", error.message);

    return res.status(500).json({
      success: false,
      message: "Máy chủ gặp lỗi khi kiểm tra giá."
    });
  }
});


/* ========================================
   MOVÉ — CREATE PENDING COURSE ORDER
======================================== */

app.post("/api/course-orders", async (req, res) => {
    try {
        const { email, course_id } = req.body || {};

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

        if (
            typeof email !== "string" ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
            typeof course_id !== "string" ||
            !courses[course_id]
        ) {
            return res.status(400).json({
                success: false,
                message: "Email hoặc khóa học không hợp lệ."
            });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const course = courses[course_id];

        let originalPrice = course.price;
        let discountAmount = 0;
        let finalPrice = course.price;
        let discountCode = null;

        if (course_id === "tron-bo-4-khoa") {
            originalPrice = course.originalPrice;
            discountAmount = originalPrice - course.price;
            finalPrice = course.price;
        } else {
            const { data: paidOrders, error: historyError } =
                await supabaseAdmin
                    .from("course_orders")
                    .select("id")
                    .ilike("email", normalizedEmail)
                    .eq("payment_status", "paid")
                    .limit(1);

            if (historyError) {
                console.error(
                    "Lỗi kiểm tra lịch sử mua:",
                    historyError.message
                );

                return res.status(500).json({
                    success: false,
                    message: "Chưa thể kiểm tra lịch sử mua hàng."
                });
            }

            const isFirstPurchase =
                !paidOrders || paidOrders.length === 0;

            discountAmount = isFirstPurchase
                ? Math.round(course.price * 0.03)
                : 0;

            finalPrice = originalPrice - discountAmount;
            discountCode = isFirstPurchase ? "WELCOME3" : null;
        }

        const { data: order, error: insertError } =
            await supabaseAdmin
                .from("course_orders")
                .insert([{
                    email: normalizedEmail,
                    course_name: course.name,
                    original_price: originalPrice,
                    discount_amount: discountAmount,
                    final_price: finalPrice,
                    payment_status: "pending",
                    discount_code: discountCode
                }])
                .select("id, course_name, final_price, payment_status")
                .single();

        if (insertError) {
            console.error(
                "Lỗi tạo đơn hàng:",
                insertError.message
            );

            return res.status(500).json({
                success: false,
                message: "Chưa tạo được đơn hàng."
            });
        }

        return res.status(201).json({
            success: true,
            message: "Tạo đơn hàng thành công.",
            order_id: order.id,
            course_name: order.course_name,
            final_price: order.final_price,
            payment_status: order.payment_status
        });

    } catch (error) {
        console.error("Lỗi tạo đơn hàng:", error.message);

        return res.status(500).json({
            success: false,
            message: "Máy chủ gặp lỗi khi tạo đơn hàng."
        });
    }
});
// Lấy thông tin đơn hàng để hiển thị trang xác nhận
app.get("/api/course-orders/:id", async (req, res) => {
    try {
        const orderId = Number(req.params.id);
        const email = String(req.query.email || "")
            .trim()
            .toLowerCase();

        if (
            !Number.isSafeInteger(orderId) ||
            orderId <= 0 ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        ) {
            return res.status(400).json({
                success: false,
                message: "Mã đơn hàng hoặc email không hợp lệ."
            });
        }

        const { data: order, error } = await supabaseAdmin
            .from("course_orders")
            .select(
                "id, email, course_name, original_price, discount_amount, final_price, payment_status, created_at"
            )
            .eq("id", orderId)
            .ilike("email", email)
            .maybeSingle();

        if (error) {
            console.error("Lỗi lấy đơn hàng:", error);

            return res.status(500).json({
                success: false,
                message: "Không thể tải thông tin đơn hàng."
            });
        }

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy đơn hàng phù hợp với email này."
            });
        }

        return res.json({
            success: true,
            order: {
                id: order.id,
                course_name: order.course_name,
                original_price: order.original_price,
                discount_amount: order.discount_amount,
                final_price: order.final_price,
                payment_status: order.payment_status,
                created_at: order.created_at
            }
        });
    } catch (error) {
        console.error("Lỗi API tra cứu đơn hàng:", error);

        return res.status(500).json({
            success: false,
            message: "Đã xảy ra lỗi khi tải đơn hàng."
        });
    }
});
app.listen(PORT, () => {
  console.log(`MOVÉ backend đang chạy tại http://localhost:${PORT}`);
});
