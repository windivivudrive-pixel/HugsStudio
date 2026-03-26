# Hướng dẫn Cấu hình & Deploy Vertex AI Chatbot

Em đã hoàn tất việc viết mã (coding) cho sự dịch chuyển này. Source code của Serverless Function hiện đã nằm sẵn trong dự án của Anh/Chị ở thư mục `functions/vertex-chatbot`. 

Web hiện tại đã trỏ đến Appwrite Function thay vì gọi trực tiếp Gemini. Vì vậy, web chatbot tạm thời sẽ chưa hoạt động cho đến khi Anh/Chị hoàn thành các bước thiết lập dưới đây.

Dưới đây là các bước để hệ thống sống lại với sức mạnh của Vertex AI!

## Phần 1: Thiết lập Google Cloud Platform (GCP)
Trình kích hoạt Trial cho Gen App Builder sẽ yêu cầu Anh/Chị tạo Project trên Google Cloud.
1. Truy cập [Google Cloud Console](https://console.cloud.google.com/).
2. Chọn dự án (Project) Anh/Chị đang dùng cho Vertex AI.
3. Enable **Vertex AI API**.
4. Vào **IAM & Admin** > **Service Accounts**.
5. Tạo một Service Account mới (ví dụ: `chatbot-vertex-access`).
6. Cấp quyền (Role): **Vertex AI User** (hoặc Vertex AI Administrator).
7. Chọn Service Account vừa tạo, vào tab **Keys** > **Add Key** > **Create new key** > Chọn **JSON**.
8. File JSON sẽ được tải về máy của Anh/Chị. Vui lòng mở file bằng Text Editor (Notepad/VSCode) và copy TOÀN BỘ nội dung bên trong.

## Phần 2: Đưa Function lên Appwrite
Chúng ta có thể dùng Appwrite CLI để đẩy thư mục code lên máy chủ Appwrite, nhưng cách đơn giản nhất là làm trên giao diện web Appwrite.

1. Đăng nhập vào [Appwrite Console](https://cloud.appwrite.io).
2. Chọn dự án `HUGS STUDIO`.
3. Vào menu **Functions** ở cột bên trái.
4. Chọn **Create Function**.
    * Name: `vertex-chatbot`
    * Runtime: `Node.js 18.0` (hoặc mới hơn)
5. Sau khi Function được tạo ra, lấy cái **Function ID** dài nhằng đó và chép vào file `.env.local` ở Web của Anh/Chị:
   ```env
   NEXT_PUBLIC_APPWRITE_VERTEX_FUNCTION_ID=cai_id_function_moi_tao_cua_anh_chi
   ```
6. Tại trang chi tiết Function vừa tạo, vào tab **Settings** > **Variables** và điền CHÍNH XÁC các biến môi trường sau:
   - `GOOGLE_CLOUD_PROJECT_ID`: (Project ID trên Google Cloud của Anh/Chị, vidu: `hugs-studio-12345`)
   - `GOOGLE_CLOUD_LOCATION`: (ví dụ: `us-central1` hoặc `asia-southeast1`)
   - `GOOGLE_SERVICE_ACCOUNT_JSON`: (Paste TOÀN BỘ nội dung file JSON lấy ở Phần 1 vào đây)
   - `APPWRITE_FUNCTION_ENDPOINT`: `https://sgp.cloud.appwrite.io/v1`
   - `APPWRITE_FUNCTION_PROJECT_ID`: `69ba0e6500224a197b74`
   - `APPWRITE_API_KEY`: (API Key Appwrite của Anh/Chị, phải có quyền truy cập vào Database)
   - `APPWRITE_DATABASE_ID`: `69ba2ae900156b378b6b`

7. Sang tab **Deployments**, chọn thư mục `functions/vertex-chatbot` trong máy tính của Anh/Chị (hoặc nén `.tar.gz` chứa code và upload lên), điền entry point là `src/main.js`.
8. Tab **Settings** > **Execute Access**: Đảm bảo chọn `Any` (Tất cả mọi người) để web Next.js có thể gọi đếm ẩn danh.

*Nếu phần Deploy bằng file nén qua UI phức tạp, Anh/Chị có thể bảo em, em sẽ hướng dẫn Anh/Chị dùng lệnh `appwrite deploy function`.*

**Anh/Chị thực hiện theo các bước trên nhé, nếu vướng ở bước nào Anh/Chị nhắn tin cho em ngay ạ!**
