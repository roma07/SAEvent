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
  var $win = $(window);
  var $body = $('body');

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
    var popWidth,popHeight,popBgOpacity,popMarginTop,popZIndex;

    var popOptionsValidate = function(options){
      //[D] 옵션값이 숫자인지 확인
      options = options || {};

      if(Object.keys(options).length){
        for(var key in options){
          if(typeof options[key] != 'number') {
            throw new Error(key + '값은 숫자로 전달해야 합니다.');
          }
        }
      }
      //[D] bgOpacity 0~1 사이의 소수점 1째 자리 숫자인지 확인
      if(options.bgOpacity != undefined){
        if(options.bgOpacity*10 != parseInt(options.bgOpacity*10)){
          throw new Error('bgOpacity 값은 소수점 1째 자리 까지의 숫자로 전달해야 합니다.');
        }else if(options.bgOpacity<0 || options.bgOpacity > 1){
          throw new Error('bgOpacity 값은 0~1 사이의 숫자로 전달해야 합니다.');
        }
      }

      var _options = {
        'width': 1200,
        'height':600,
        'zIndex': 1000,
        'marginTop': 50,
        'bgOpacity': 0.5
      }

      popWidth = options.width || _options.width;
      popHeight = options.height || _options.height;
      popBgOpacity = options.bgOpacity || _options.bgOpacity;
      popMarginTop = options.marginTop || _options.marginTop;
      popZIndex = options.zIndex || _options.zIndex;
    }

    var popup = function(element,options){

      //[D] 파라미터 유효성체크
      if (!$(element).length) { throw new Error('전달인자는 존재하는 요소의 선택자로 전달해야 합니다.'); }
      popOptionsValidate(options);

      /*[D]
        ngt.popup(element, options);
        element: id or class name
        options: {
          'width': 1200, //popup width size
          'height':600, //popup height size
          'zIndex': 1000, //popup zIndex
          'marginTop': 50, //popup margin top
          'bgOpacity': 0.5 //shade background alpha
      }
      */

      var downTarget, //[D] when popup button clicked, mousedown evnet's target
          upTarget, //[D] when popup button clicked, mouseup evnet's target
          $popupWrapBg,$popCloseBtn,$popBg,$popWrap,
          $ele = $(element),
          $popSnap = $(".imgSnap,.gnbBannerSec");


      //[D] 초기 실행
      function init(){
        createBasisEle();
        $win.resize(function(){
          popSnap();
        });
        popSnap();
        openPop();
        bindEvent();
      }
      init();

      //[D] 팝업 기반요소 생성
      function createBasisEle(){
        $('body').append("<div id='ngt-popup-bg'></div>");
        $popBg = $('#ngt-popup-bg');
        $popBg.css({
          'opacity':popBgOpacity,
          'zIndex':popZIndex -1
        });
        $('body').append("<div id='ngt-popup-wrap'></div>");
        $popWrap = $('#ngt-popup-wrap');
        $popWrap.css({
          'zIndex':popZIndex
        });
        $popWrap.append("<div id='ngt-popup-close'><a href=''><img src='../assets/images/popup/popup_close.png' alt='팝업 닫기'></a></div>");
        $popCloseBtn = $('#ngt-popup-close');
        $popupWrapBg = $('#ngt-popup-close,#ngt-popup-wrap,#ngt-popup-bg');
      }
      //[D] 팝업 기반요소 삭제
      function removeBasisEle(){
        $('#ngt-popup-bg').remove();
        $ele.insertAfter($popWrap);
        $('#ngt-popup-wrap').remove();
      }

      //[D] 팝업 위치 조절
      function popSnap(){
        if( $win.height()< popHeight+(popMarginTop*2) ){
          $ele.css({
            "marginTop": popMarginTop,
            "marginBottom": popMarginTop,
            'position':"static"
          });
        }else{
          $ele.css({
            "marginTop": (popHeight/2 * -1)+'px',
            'position':"relative"
          });
        }
      }

      //[D] 팝업 열기
      function openPop(){
        $ele.css({
          'width': popWidth,
          'height': popHeight
        })
        $popWrap.append($ele);
        $ele.show();
        $popupWrapBg.show();
        $('body').addClass('overFlowHidden');
        $popSnap.css("paddingRight","17px");
      }

      //[D] 팝업 닫기
      function closePop(){
        $ele.hide();
        $popupWrapBg.hide();
        $('body').removeClass('overFlowHidden')
        $popSnap.css("paddingRight","0");
        removeBasisEle();
      }

      //[D] 이벤트 바인드
      function bindEvent(){
        var clickValidate = function (e){
          e.preventDefault();
          if(downTarget==upTarget){
            if($('.ngt-popup').has($(e.target)).length){return};
            if($(e.target).hasClass('ngt-popup')) return;
            $popupWrapBg.off();
            closePop();
          }
        }
        $popupWrapBg.on("click",clickValidate);
        var mouseDownValidate = function (e){
          downTarget = $(e.target).context;
        }
        var mouseUpValidate = function (e){
          upTarget = $(e.target).context;
        }
        $popupWrapBg.on("mousedown",mouseDownValidate );
        $popupWrapBg.on("mouseup ",mouseUpValidate );
      }
    };


  var videoPopup = function(youtubeCode,options,youtubeOptions){
    /*[D]
     ngt.videoPopup(youtubeCode,options);
     youtubeCode,
     options: {
     'width': 1200, //popup width size,영상 사이즈
     'height':600, //popup height size,영상 사이즈
     'zIndex': 1000, //popup zIndex
     'marginTop': 50, //popup margin top
     'bgOpacity': 0.5 //shade background alpha(0~1)
     'rel': 1, //동영상이 완료되면 추천 동영상 표시 (0: 미적용 /1:적용 )
     'controls': 1, //플레이어 컨트롤 표시
     'showinfo': 1 //동영상 제목 및 플레이어 작업 표시
     }
     */

    //[D] youtubeCode 유효성체크
    if (!typeof youtubeCode == 'string') { throw new Error('전달인자는 문자열로 전달해야 합니다.'); }
    //[D] 팝업 옵션 유효성체크
    popOptionsValidate(options);

    //[D] youtubeOptions 유효성체크 (숫자 0 또는 1 인지 확인)
    youtubeOptions = youtubeOptions || {};
    for(var key in youtubeOptions){
      if(!(youtubeOptions[key] == 0 || youtubeOptions[key] == 1)){
        throw new Error(key+'값은 0 또는 1로 전달해야 합니다.');
      }
    }
    var _youtubeOptions = {
      'rel': 1,
      'controls': 1,
      'showinfo': 1
    }
    var rel = (youtubeOptions.rel!="undefined")? youtubeOptions.rel: _youtubeOptions.rel,
        controls = (youtubeOptions!="undefined")? youtubeOptions.controls: _youtubeOptions.controls,
        showinfo = (youtubeOptions.showinfo!="undefined")? youtubeOptions.showinfo: _youtubeOptions.showinfo;

    //[D] 초기 실행
    function init(){
      createVideoEle();
    }
    init();

    //[D] 비디오팝업 요소 생성
    function createVideoEle(){
      $('body').append("<div id='videoPopup' class='ngt-popup'></div>");
      $('#videoPopup').append("<iframe class='popIframe'></iframe>");

      $('.popIframe').attr({
        width:popWidth,
        height:popHeight,
        //src:"https://www.youtube.com/embed/R-8O5Ew-X_I",
        'src':"https://www.youtube.com/embed/"+youtubeCode+"?rel="+rel+"&controls="+controls+"&showinfo="+showinfo,
        frameborder:'0',
        allowfullscreen:''
      });
    }
    //[D] 비디오팝업 요소 삭제
    function removeVideoEle(){
      $('#videoPopup').remove();
      $('#videoPopup').find('.popIframe').remove();
    }
    /*
    $popupWrapBg.on('click', function(e) {
      e.preventDefault();
      removeVideoEle();
    })
    */


    ngt.popup('#videoPopup',options);
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
