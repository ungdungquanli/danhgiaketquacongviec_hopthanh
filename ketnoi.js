/* ========================================================================== */

const ddungApi = "https://script.google.com/macros/s/AKfycbwx-SfK2k6Sgf2oLQCu1Jt55clwz0nuke8YUVv8QgttrmqxgcDti7c8WA8x8jzh5CHy/exec"; 

const khachApi = {
    yeucauApi: function(hdong, tdtai, khiTcong, khiLoi) {
        const dlieu = { hdong: hdong, ...tdtai };
        fetch(ddungApi, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' }, 
            body: JSON.stringify(dlieu)
        })
        .then(ph => ph.json())
        .then(kq => {
            if (kq.ttai === 'loi') {
                if (khiLoi) khiLoi(new Error(kq.tbao));
            } else {
                let dcuoi = (kq.dliu !== undefined) ? kq.dliu : kq;
                if (khiTcong) khiTcong(dcuoi);
            }
        })
        .catch(loie => { if (khiLoi) khiLoi(loie); });
    },
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