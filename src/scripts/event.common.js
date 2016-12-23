/*!
 * Nexon-GT Event JavaScript Library v1.0.0
 * Date: 2016-12-22
 */
(function (window) {
    // ---------- 기능 구형 범위 ----------
    // 브라우저 버전 체크
    // 상단 바 회사(nexon or naver) 및 높이값 구하기
    // IE 버전 이미지 스냅적용
    // 메뉴 클릭시 활성화
    // 일반 팝업
    // 갤러리 팝업
    // ---------- 기능 구형 범위 ----------

    var document = window.document;

    /*****************************************
     * Browser information
     ******************************************/
    var browser = (function(){
        var company = null, agent = null, versionSearchString = null;
        var dataBrowser = [
            {string: navigator.userAgent, subString: "Edge", identity: "MS Edge"},
            {string: navigator.userAgent, subString: "MSIE", identity: "Explorer"},
            {string: navigator.userAgent, subString: "Trident", identity: "Explorer"},
            {string: navigator.userAgent, subString: "Firefox", identity: "Firefox"},
            {string: navigator.userAgent, subString: "Opera", identity: "Opera"},
            {string: navigator.userAgent, subString: "OPR", identity: "Opera"},
            {string: navigator.userAgent, subString: "Chrome", identity: "Chrome"},
            {string: navigator.userAgent, subString: "Safari", identity: "Safari"}
        ];

        function init(){
            company = searchString(dataBrowser) || "Other";
            agent = searchVersion(navigator.userAgent) || searchVersion(navigator.appVersion) || "Unknown";
        }
        function searchString(data) {
            for (var i = 0; i < data.length; i++) {
                var dataString = data[i].string;
                versionSearchString = data[i].subString;
                if (dataString.indexOf(data[i].subString) !== -1)return data[i].identity;
            }
        }
        function searchVersion(dataString) {
            var index = dataString.indexOf(versionSearchString);
            if (index === -1) return;
            var rv = dataString.indexOf("rv:");
            if (versionSearchString === "Trident" && rv !== -1) {
                return parseFloat(dataString.substring(rv + 3));
            } else {
                return parseFloat(dataString.substring(index + versionSearchString.length + 1));
            }
        }
        init();

        return {
            name: company,
            version: agent,
            info: function(){
                return "You are using " + company + " with version " + agent + ".";
            }
        }
    })();


    /*****************************************
     * GNB company menu bar
     ******************************************/
    var cpbar = (function(){

    })();


    /*****************************************
     * Background image snap x position
     ******************************************/
    var snap = (function(){

    })();


    /*****************************************
     * Active menu
     ******************************************/
    var activeMenu = (function(){

    })();


    /*****************************************
     * Layer popup
     ******************************************/
    var popup = (function(element){
        //alert(element);
    });


    /*****************************************
     * Layer popup gallery
     ******************************************/
    var gallery = (function(element){
        //alert(element);
    });


    window.ngt = {
        browser: browser,
        cpbar: cpbar,
        popup: popup,
        gallery: gallery
    }
})(window);
