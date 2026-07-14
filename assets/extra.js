// Mở mọi liên kết trỏ ra ngoài trang web (http/https) ở một tab mới,
// để không làm mất trang tài liệu đang xem. Các liên kết nội bộ giữa
// các trang trong site (ví dụ part1.html, module2.html...) không bị ảnh
// hưởng vì chúng dùng đường dẫn tương đối, không bắt đầu bằng http/https.
function openExternalLinksInNewTab() {
  document
    .querySelectorAll('a[href^="http://"], a[href^="https://"]')
    .forEach(function (link) {
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener");
    });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", openExternalLinksInNewTab);
} else {
  // Trang đã tải xong trước khi script này chạy tới (trường hợp hiếm).
  openExternalLinksInNewTab();
}
