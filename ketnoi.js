/* ========================================================================== */

const ddungApi = "https://script.google.com/macros/s/AKfycbwx-SfK2k6Sgf2oLQCu1Jt55clwz0nuke8YUVv8QgttrmqxgcDti7c8WA8x8jzh5CHy/exec"; 

const khachApi = {
    yeucauApi: function(hdong, tdtai, khiTcong, khiLoi) {
        // [BỘ CHUYỂN ĐỔI FRONTEND (Tiếng Việt) -> BACKEND (Tiếng Anh)]
        let payloadGiaoTiep = {};
        let actionName = hdong;

        // 1. Ánh xạ tên lệnh (Action)
        const mapAction = {
            "laydlcanb": "getStaffData", // Cập nhật: getUserData -> getStaffData
            "luutam": "saveTempData",
            "nopbcao": "submitReport",
            "laydlthop": "getSummaryData",
            "laydlnghi": "getLeaveSummaryData",
            "laydlykien": "getOpinionSummaryData",
            "laydlbcao": "getReportData",
            "laydstrang": "getListSheets",
            "ktraquyengv": "checkTeacherPermission",
            "ktraquyengvtab": "checkGiaoViecTabPermission",
            "gvlaydscanb": "getStaffList",
            "gvlaydlbdau": "getInitialGiaoViecData",
            "gvxulynviec": "processTaskAssignment",
            "taitepbcao": "uploadReportFiles",
            "xoatepbcao": "deleteReportFile"
        };
        if (mapAction[hdong]) actionName = mapAction[hdong];
        payloadGiaoTiep.action = actionName;

        // 2. Chuyển đổi dữ liệu gửi đi (Payload)
        if (hdong === "laydlcanb") {
            payloadGiaoTiep.requestSheetName = tdtai.ttrang;
            payloadGiaoTiep.staffEmail = tdtai.tkcanb; // Cập nhật: clientEmail -> staffEmail
        } else if (hdong === "luutam" && tdtai.dldeu) {
            payloadGiaoTiep.formData = {
                sheetName: tdtai.dldeu.ttrg, daysOff: tdtai.dldeu.snnghi, bonusPoint: tdtai.dldeu.dthuong,
                reason: tdtai.dldeu.ldo, petition: tdtai.dldeu.kienn, report: tdtai.dldeu.bcao,
                resultString: tdtai.dldeu.kq, tableData: tdtai.dldeu.dlbang
            };
        } else if (hdong === "nopbcao" && tdtai.dldeu) {
            payloadGiaoTiep.formData = {
                sheetName: tdtai.dldeu.ttrg, name: tdtai.dldeu.tenn, daysOff: tdtai.dldeu.snnghi,
                schoolYear: tdtai.dldeu.nhoc, time: tdtai.dldeu.tgian, resultString: tdtai.dldeu.kq,
                bonusPoint: tdtai.dldeu.dthuong, petition: tdtai.dldeu.kienn, report: tdtai.dldeu.bcao,
                reason: tdtai.dldeu.ldo, staffEmail: tdtai.dldeu.taik // Cập nhật: clientEmail -> staffEmail
            };
        } else if (hdong === "ktraquyengv" || hdong === "ktraquyengvtab") {
            payloadGiaoTiep.staffEmail = tdtai.tkcanb; // Cập nhật: clientEmail -> staffEmail
        } else if (hdong === "gvxulynviec" && tdtai.tdtai) {
            let d = tdtai.tdtai;
            payloadGiaoTiep.payload = {
                year: d.nam, month: d.thang,
                task: d.nviec ? {
                    stt: d.nviec.stt, content: d.nviec.ndung, deadline: d.nviec.hchot,
                    progress: d.nviec.tdo, assignee: d.nviec.ngnhan, assigneeName: d.nviec.tenngnhan,
                    assigneeSheet: d.nviec.trangngnhan, note: d.nviec.gchu
                } : null
            };
        } else if (hdong === "taitepbcao" && tdtai.tdtai) {
            payloadGiaoTiep.payload = {
                files: (tdtai.tdtai.teps || []).map(f => ({ fileName: f.tentep, mimeType: f.kieu, data: f.dliu }))
            };
        } else if (hdong === "xoatepbcao" && tdtai.tdtai) {
            payloadGiaoTiep.payload = { url: tdtai.tdtai.duongd };
        }

        fetch(ddungApi, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' }, 
            body: JSON.stringify(payloadGiaoTiep)
        })
        .then(ph => ph.json())
        .then(kqRaw => {
            // [BỘ CHUYỂN ĐỔI BACKEND (Tiếng Anh) -> FRONTEND (Tiếng Việt)]
            let kq = { ...kqRaw }; 

            // Xử lý status chung
            kq.ttai = (kqRaw.status === 'success') ? 'tcong' : 'loi';
            kq.tbao = kqRaw.message || "Lỗi không xác định";

            if (kq.ttai === 'loi') {
                if (khiLoi) khiLoi(new Error(kq.tbao));
                return;
            }

            // 3. Chuyển đổi dữ liệu nhận về
            if (actionName === "getStaffData") { // Cập nhật: getUserData -> getStaffData
                kq.koxd = kqRaw.isUnknown;
                kq.qchon = kqRaw.canSelectStaff; // Cập nhật: canSelectUser -> canSelectStaff
                kq.qsuad = kqRaw.canEditBonus;
                if (kqRaw.staff) kq.canb = { ttrg: kqRaw.staff.sheetName, taik: kqRaw.staff.email, tenn: kqRaw.staff.name }; // Cập nhật: user -> staff
                if (kqRaw.header) {
                    kq.tde = {
                        tenn: kqRaw.header.name, snnghi: kqRaw.header.daysOff, nhoc: kqRaw.header.schoolYear,
                        tgian: kqRaw.header.time, dthuong: kqRaw.header.bonusPoint, tthai: kqRaw.header.status,
                        kq: kqRaw.header.result, ldo: kqRaw.header.savedReason, kienn: kqRaw.header.savedPetition,
                        bcao: kqRaw.header.savedReport
                    };
                }
                if (kqRaw.table) kq.bang = kqRaw.table;
            } else if (actionName === "getListSheets" && kqRaw.data) {
                kq.dliu = kqRaw.data.map(d => ({ tenn: d.name, gtri: d.val }));
            } else if (actionName === "getStaffList" && kqRaw.data) {
                kq.dliu = kqRaw.data.map(d => ({ ttrg: d.sheetName, tenn: d.name }));
            } else if (actionName === "getInitialGiaoViecData" && kqRaw.data) {
                kq.dliu = { nam: kqRaw.data.year, thang: kqRaw.data.month, dlbang: kqRaw.data.tasks };
            } else if (actionName === "getLeaveSummaryData" && kqRaw.data) {
                kq.dliu = kqRaw.data.map(d => ({ tenn: d.name, snnghi: d.daysOff, nam: d.year, thang: d.month, ldo: d.reason }));
            } else if ((actionName === "getOpinionSummaryData" || actionName === "getReportData") && kqRaw.data) {
                kq.dliu = kqRaw.data.map(d => ({ tenn: d.name, nam: d.year, thang: d.month, ndung: d.content }));
            } else if (actionName === "uploadReportFiles" && kqRaw.data) {
                kq.dliu = kqRaw.data.map(d => ({ tentep: d.name, duongd: d.url }));
            } else if (actionName === "submitReport") {
                kq.lacn = kqRaw.isUpdate;
            } else {
                kq.dliu = kqRaw.data;
            }

            let dcuoi = (kq.dliu !== undefined) ? kq.dliu : kq;
            if (khiTcong) khiTcong(dcuoi);
        })
        .catch(loie => { if (khiLoi) khiLoi(loie); });
    },
    // Các hàm gọi API phía dưới được giữ nguyên cấu trúc để bảo toàn mã HTML cũ
    layDlCanb: function(ttrang, taik, khiTcong, khiLoi) { this.yeucauApi("laydlcanb", { ttrang: ttrang, tkcanb: taik }, khiTcong, khiLoi); },
    luuTam: function(dldeu, khiTcong, khiLoi) { this.yeucauApi("luutam", { dldeu: dldeu }, khiTcong, khiLoi); },
    nopBcao: function(dl, khiTcong, khiLoi) { this.yeucauApi("nopbcao", { dldeu: dl }, khiTcong, khiLoi); },
    layDlThop: function(khiTcong, khiLoi) { this.yeucauApi("laydlthop", {}, khiTcong, khiLoi); },
    layDlNghi: function(khiTcong, khiLoi) { this.yeucauApi("laydlnghi", {}, khiTcong, khiLoi); },
    layDlYkien: function(khiTcong, khiLoi) { this.yeucauApi("laydlykien", {}, khiTcong, khiLoi); },
    layDlBcao: function(khiTcong, khiLoi) { this.yeucauApi("laydlbcao", {}, khiTcong, khiLoi); },
    layDsTrang: function(khiTcong, khiLoi) { this.yeucauApi("laydstrang", {}, khiTcong, khiLoi); },
    ktraQuyenGv: function(taik, khiTcong, khiLoi) { this.yeucauApi("ktraquyengv", { tkcanb: taik }, khiTcong, khiLoi); },
    ktraQuyenGvTab: function(taik, khiTcong, khiLoi) { this.yeucauApi("ktraquyengvtab", { tkcanb: taik }, khiTcong, khiLoi); },
    gvLaydsCanb: function(khiTcong, khiLoi) { this.yeucauApi("gvlaydscanb", {}, khiTcong, khiLoi); },
    gvXulyNviec: function(tdtai, khiTcong, khiLoi) { this.yeucauApi("gvxulynviec", { tdtai: tdtai }, khiTcong, khiLoi); },
    gvLaydlBdau: function(khiTcong, khiLoi) { this.yeucauApi("gvlaydlbdau", {}, khiTcong, khiLoi); },
    taiTepBcao: function(tdtai, khiTcong, khiLoi) { this.yeucauApi("taitepbcao", { tdtai: tdtai }, khiTcong, khiLoi); },
    xoaTepBcao: function(tdtai, khiTcong, khiLoi) { this.yeucauApi("xoatepbcao", { tdtai: tdtai }, khiTcong, khiLoi); }
};
