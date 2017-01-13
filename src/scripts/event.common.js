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
    // 우측 퀵메뉴 위치 적용
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
        //return [_height,readCookies('GNB_ONOFF')];
        return _height;
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
    var snap = function(){
      var imgW = ngt.imgW;
      var minW = ngt.minW;
      function _snap(imgW, minW){
        var pn;
        $(window).width()<minW ? pn = Math.floor((minW-imgW)/2) : pn = Math.floor(($(window).width()-imgW)/2);
        $(".imgSnap").css("background-position-x", pn+"px");
      }
      $(window).resize(function(){
        _snap(imgW, minW);
      });
      _snap(imgW, minW);
    };


    /*****************************************
     * Active menu
     ******************************************/
    var activeMenu = function(el,sectionsArr){
      'use strict';

      if (!$('.'+el).length) { throw new Error('전달인자는 존재하는 요소의 선택자로 전달해야 합니다.'); }
      var sectionsH = {}
      sectionsH.oldHeight = 0;
      var sectionsArrLeng = sectionsArr.length;
      for(var i = 0;i < sectionsArrLeng;i++){
        var sectionsName = sectionsArr[i];
        sectionsH[sectionsName] = sectionsH.oldHeight ;
        sectionsH.oldHeight = sectionsH[sectionsName]+ $('#'+sectionsName).height();
      }
      //click 이벤트
      var menuLink = $('.'+el).find('a');
      menuLink.each(function(i, o){
        $(o).click(function(e){
          e.preventDefault();
          var selectedMenu = $(this).attr('href').slice(1);
          console.log(selectedMenu);
          moveScroll(selectedMenu);
        });
      });

      function pageMove(point){
        $("html, body").animate({ scrollTop: point}, "slow");
      }
      function moveScroll(scrollTarget){
        var topHeight = sectionsH[scrollTarget];
        console.log(sectionsH);
        pageMove(topHeight+cpbar.height());
      }

      //scroll
      $(window).scroll(function() {
        var $GNB = cpbar.height();
        var cp = $(window).scrollTop();
        if (cp > $GNB) {
          $("#header").css({"position": "fixed", 'top': 0});
        } else {
          $("#header").css({"position": "absolute"});
        }
        var resultCode = "console.log('resultCode 실행');";
        for(var i = 0;i < sectionsArrLeng;i++){
          var sectionsName = sectionsArr[i];
          var preSectionsName = sectionsArr[i+1];
          if(i == 0){
            resultCode +=
              "if($(window).scrollTop()<= sectionsH."+preSectionsName+"){$('.navi').removeClass('active');}";

          }else if(i == sectionsArrLeng-1){
            resultCode +=
              "else{$('.navi').removeClass('active');$('.navi_"+sectionsName+"').addClass('active');}";
          }else{
            resultCode +=
              "else if($(window).scrollTop()<= sectionsH."+preSectionsName+"){$('.navi').removeClass('active');$('.navi_"+sectionsName+"').addClass('active');}";
          }
        }
        console.log(resultCode);
        eval(resultCode);
      });
    };


    /*****************************************
     * Layer popup
     ******************************************/
    var popup = function(element){
      'use strict';

      if (!$(element).length) { throw new Error('전달인자는 존재하는 요소의 선택자로 전달해야 합니다.'); }

      var $popupWrapBg = $('.ngt-popup-close,.ngt-popup-wrap,.ngt-popup-bg');

      function init(){
        console.log(element);
        $(window).resize(function(){
          popSnap();
        });
        popSnap();
        openPop();
      }
      init();
      function popSnap(){
        var popHeight = $(element).height();
        if( $(window).height()< popHeight+100 ){
          $(element).css({
            "marginTop": '50px',
            "marginBottom": '50px',
            'position':"static"
          });
        }else{
          $(element).css({
            "marginTop": (popHeight/2 * -1)+'px',
            'position':"relative"
          });
        }
      }
      function openPop(){
        $(element).show();
        $popupWrapBg.show();
        $('body').addClass('overFlowHidden');
        $(".imgSnap,.gnbBannerSec").css("paddingRight","17px");
      }
      $popupWrapBg.on('click', function(e) {
        e.preventDefault();
        if($(e.target).is('.ngt-popup-wrap')||$(e.target).is('.ngt-popup-close img')){
          $(element).hide();
          $popupWrapBg.hide();
          $('body').removeClass('overFlowHidden')
          $(".imgSnap,.gnbBannerSec").css("paddingRight","0");
        }
      });

    };


  var videoPopup = function(element,properties){
    'use strict';
    if (!typeof properties.youtubeCode == 'string') { throw new Error('전달인자는 문자열로 전달해야 합니다.'); }
    if (!typeof properties.width == 'number'&& typeof properties.height == 'number') { throw new Error('width,height값은 숫자로 전달해야 합니다.'); }

    var youtubeCode = properties.youtubeCode, width = properties.width, height = properties.height;

    var $popupWrapBg = $('.ngt-popup-close,.ngt-popup-wrap,.ngt-popup-bg');
    var _properties = {
      'width':width,
      'height':height,
      'src':"https://www.youtube.com/embed/"+youtubeCode+"?version=3&hl=ko_KR&rel=0&showinfo=0&wmode=opaque&vq=hd720",
      'frameborder':'0',
      'allowfullscreen':''
    }
    console.log($(element));
    $(element).append("<iframe class='popIframe'></iframe>")
    $(element).find('.popIframe').attr(_properties);

    $popupWrapBg.on('click', function(e) {
      e.preventDefault();
      $(element).find('.popIframe').remove();
    });

    ngt.popup(element);

  };



  /*****************************************
     * Layer popup gallery
     ******************************************/
    var gallery = (function(element){
      ngt.popup(element);
      $('.list_thum li').each(function() {
        var $target = $(this).find('a').attr("href");
        $(this).on('click', function(e) {
          e.preventDefault();
          $('.list_view li').removeClass('on');
          $($target).addClass('on');
          $('.list_thum li').removeClass('on');
          $(this).addClass('on');
        });
      });

      function galleryInit(){
        $('.list_view li,.list_thum li').removeClass('on');
        $('#view01,#view11,.thum01').addClass('on');
      }
      galleryInit();
    });


  /*****************************************
   * right quick section position
   ******************************************/
  var rightQuick = function(){
    //창 너비에 따른 위치 변경
    function positionrightQuick(){
      if($(window).width()<1500){
        $('#rightQuick').removeClass();
        $('#rightQuick').addClass('atSmallLayout');
      }else if($(window).width()>1920){
        $('#rightQuick').removeClass();
        $('#rightQuick').addClass('atWideLayout');
      }else{
        $('#rightQuick').removeClass();
      }
    }

    //스크롤 위치에 따른 노출 변경
    function rightQuick() {
      if ($(window).scrollTop() < 1314) {
        $('#rightQuick').hide();
      } else {
        $('#rightQuick').show();
      }
    }
    rightQuick();
    positionrightQuick();
    $(window).resize(function(){
      positionrightQuick();
    });
    $(window).scroll(function() {
      rightQuick();
    });

  }();



  window.ngt = {
        browser: browser,
        cpbar: cpbar,
        //snap:snap(1920,1200),
        snap:snap,
        activeMenu:activeMenu,
        popup: popup,
        videoPopup: videoPopup,
        gallery: gallery,
        rightQuick: rightQuick
    }
})(window);
