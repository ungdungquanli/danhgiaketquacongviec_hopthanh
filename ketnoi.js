/* ==========================================================================
   Tệp: ketnoi.js
   Mục đích: Cầu nối giao tiếp (API Client) gọi các hàm từ Server bằng Fetch
   Hệ thống: Quản lý Nhiệm vụ - TH Hợp Thành
   ========================================================================== */

// 1. ĐIỀN LINK WEB APP (API) CỦA THẦY VÀO ĐÂY:
const API_URL = "https://script.google.com/macros/s/AKfycbwx-SfK2k6Sgf2oLQCu1Jt55clwz0nuke8YUVv8QgttrmqxgcDti7c8WA8x8jzh5CHy/exec"; 

const ServerAPI = {
    // Hàm lõi xử lý gửi request (Dùng chung cho tất cả)
    _request: function(action, payload, onSuccess, onError) {
        const data = { action: action, ...payload };
        
        fetch(API_URL, {
            method: 'POST',
            // Dùng text/plain để tránh lỗi CORS chặn chéo tên miền của trình duyệt
            headers: { 'Content-Type': 'text/plain;charset=utf-8' }, 
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(res => {
            if (res.status === 'error') {
                if (onError) onError(new Error(res.message));
            } else {
                // Lấy dữ liệu từ res.data nếu có, ngược lại lấy toàn bộ object res
                let finalData = (res.data !== undefined) ? res.data : res;
                if (onSuccess) onSuccess(finalData);
            }
        })
        .catch(err => {
            console.error("Lỗi API (" + action + "):", err);
            if (onError) onError(err);
        });
    },

    /* ==========================================================================
       PHẦN 1: CÁC HÀM LIÊN KẾT VỚI "PGV_Code.gs" (CORE & USER REPORT)
       ========================================================================== */

    // 1. Lấy dữ liệu cá nhân của người dùng (Đã bổ sung clientEmail)
    getUserData: function(requestSheetName, clientEmail, onSuccess, onError) {
        this._request("getUserData", { requestSheetName: requestSheetName, clientEmail: clientEmail }, onSuccess, onError);
    },

    // 2. Lưu tạm dữ liệu báo cáo
    saveTempData: function(formData, onSuccess, onError) {
        this._request("saveTempData", { formData: formData }, onSuccess, onError);
    },

    // 3. Nộp báo cáo chính thức
    submitReport: function(data, onSuccess, onError) {
        this._request("submitReport", { formData: data }, onSuccess, onError);
    },

    // 4. Lấy dữ liệu tổng hợp kết quả
    getSummaryData: function(onSuccess, onError) {
        this._request("getSummaryData", {}, onSuccess, onError);
    },

    // 5. Lấy dữ liệu tổng hợp ngày nghỉ
    getLeaveSummaryData: function(onSuccess, onError) {
        this._request("getLeaveSummaryData", {}, onSuccess, onError);
    },

    // 6. Lấy dữ liệu tổng hợp ý kiến
    getOpinionSummaryData: function(onSuccess, onError) {
        this._request("getOpinionSummaryData", {}, onSuccess, onError);
    },

    // 7. Lấy dữ liệu tổng hợp báo cáo tóm tắt
    getReportData: function(onSuccess, onError) {
        this._request("getReportData", {}, onSuccess, onError);
    },

    // 8. Lấy danh sách Sheet (Nhân sự khai báo)
    getListSheets: function(onSuccess, onError) {
        this._request("getListSheets", {}, onSuccess, onError);
    },

    // 9. Kiểm tra quyền Giáo viên (Đã bổ sung clientEmail)
    checkTeacherPermission: function(clientEmail, onSuccess, onError) {
        this._request("checkTeacherPermission", { clientEmail: clientEmail }, onSuccess, onError);
    },

    // 10. Kiểm tra quyền truy cập Tab Giao Việc (Đã bổ sung clientEmail)
    checkGiaoViecTabPermission: function(clientEmail, onSuccess, onError) {
        this._request("checkGiaoViecTabPermission", { clientEmail: clientEmail }, onSuccess, onError);
    },

    /* ==========================================================================
       PHẦN 2: CÁC HÀM LIÊN KẾT VỚI "PGV_Code_GiaoViec.gs" (MÔ ĐUN GIAO VIỆC)
       ========================================================================== */

    // 11. Lấy danh sách nhân sự để giao việc
    getStaffList: function(onSuccess, onError) {
        this._request("getStaffList", {}, onSuccess, onError);
    },

    // 12. Xử lý logic Giao việc & Xóa (Reset tháng)
    processTaskAssignment: function(payload, onSuccess, onError) {
        this._request("processTaskAssignment", { payload: payload }, onSuccess, onError);
    },

    // 13. Tải dữ liệu giao việc ban đầu
    getInitialGiaoViecData: function(onSuccess, onError) {
        this._request("getInitialGiaoViecData", {}, onSuccess, onError);
    },

    // 14. Tải lên file đính kèm cho báo cáo
    uploadReportFiles: function(payload, onSuccess, onError) {
        this._request("uploadReportFiles", { payload: payload }, onSuccess, onError);
    },

    // 15. CẬP NHẬT: Xóa file đính kèm cho báo cáo
    deleteReportFile: function(payload, onSuccess, onError) {
        this._request("deleteReportFile", { payload: payload }, onSuccess, onError);
    }
};
