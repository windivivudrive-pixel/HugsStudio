import { NextRequest, NextResponse } from "next/server";

// ──────────────────────────────────────────────
// Google Form: CTA HUGS STUDIO
// Field mapping (auto-extracted from form):
//   1. Họ Tên    → entry.1644361885
//   2. Email     → entry.464225503
//   3. Sđt       → entry.1557981492
//   4. Dịch Vụ   → entry.1924622187
//   5. Tin Nhắn  → entry.1847816994
// ──────────────────────────────────────────────
const GOOGLE_FORM_SUBMIT_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSdn65FtjsAj3DGukJjSze9phUq-yVaYfHYxsxE-7BbggChuQQ/formResponse";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, service, message } = body;

    if (!name || !email || !phone || !service || !message) {
      return NextResponse.json(
        { error: "Vui lòng điền đầy đủ thông tin" },
        { status: 400 }
      );
    }

    const formData = new URLSearchParams();
    formData.append("entry.1644361885", name);     // Họ Tên
    formData.append("entry.464225503", email);      // Email
    formData.append("entry.1557981492", phone);     // Sđt
    formData.append("entry.1924622187", service);   // Dịch Vụ
    formData.append("entry.1847816994", message);   // Tin Nhắn

    const res = await fetch(GOOGLE_FORM_SUBMIT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString(),
    });

    // Google Forms returns 200 on success (with HTML response page)
    if (res.ok || res.status === 200) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: "Google Form submission failed" },
      { status: 500 }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Có lỗi xảy ra, vui lòng thử lại" },
      { status: 500 }
    );
  }
}
