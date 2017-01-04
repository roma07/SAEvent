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
    cpbar_height = null;
    var cpbar = (function(){
      var company;
      company  =  (function(){
        var _company = '';
        var loc = unescape(document.location.href);
        var lowercase = loc.toLowerCase(loc);
        lowercase.indexOf("sa.nexon.game.naver.com")*1 > 0 ? _company = "NAVER" : _company = "NEXON";
        return _company;
      })();

      function getHeight(){
        var _height;
        if (cpbar.company=="NAVER") {
          _height = $('.global_wrap').outerHeight();
        } else {
          if(cpbar_height == null){
            if (readCookies('GNB_ONOFF')=== null){
              _height = 210
              createCookies('GNB_ONOFF',1);//테스트용 쿠키생성
            } else if(readCookies('GNB_ONOFF') == 0){
              _height = 40;
            }else if(readCookies('GNB_ONOFF') == 1){
              _height = 210;
            }
          }else{
            _height = $('.gnbWrapper').outerHeight();
          }
          cpbar_height = _height;
        }
        return [_height,readCookies('GNB_ONOFF')];
      }

      //readCookies
      function readCookies(key) {
        var keyString = key + "=";
        var cookieArray = document.cookie.split(';');
        for(var i = 0; i < cookieArray.length; i++) {
          var cookie = cookieArray[i];
          while (cookie.charAt(0) == ' ') {
            cookie = cookie.substring(1, cookie.length);
          }
          if (cookie.indexOf(keyString) == 0) return cookie.substring(keyString.length, cookie.length);
        }
        return null;
      }
      //s:테스트용 createCookies
      function createCookies(key, value, expires) {
        var date = new Date();
        date.setTime(date.getTime() + (expires * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + date.toGMTString();
        var path = "; path=/"
        var domain = "; domain=" + document.domain;
        document.cookie = key + "=" + value + expires + domain + path;
      }
      //e:테스트용 createCookies

      return {
        company: company,
        height: getHeight
      }
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
