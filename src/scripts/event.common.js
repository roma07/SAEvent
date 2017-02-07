/*!
 * Nexon-GT Event JavaScript Library v1.0.0
 * Date: 2016-12-22
 */
(function (window) {
    // ---------- 기능 구형 범위 ----------
    // 일반 팝업
    // 비디오 팝업
    // 갤러리 팝업
    // ---------- 기능 구형 범위 ----------
  $(document).ready(function(){
    var $win = $(window);
    var $body = $('body');
  });


  var shade = {
    generate :function(){
      $body.append("<div id='ngt-popup-bg'></div>");
      $popBg = $('#ngt-popup-bg').css({
        'opacity':popBgOpacity,
        'zIndex':popZIndex -1
      });
    }
  }

  var wrapper = {
    generate :function(){
      $('body').append("<div id='ngt-popup-wrap'></div>");
      $popWrap = $('#ngt-popup-wrap').css({'zIndex':popZIndex});
    }
  }

  var button = {
    generate :function() {
      $popWrap.append("<div id='ngt-popup-close'><a href=''><img src='../assets/images/popup/popup_close.png' alt='팝업 닫기'></a></div>");
      $popCloseBtn = $('#ngt-popup-close');
    }
  }


    var popup = {
      init: function(){
        // popup 전역 변수
        var popWidth,popHeight,popBgOpacity,popMarginTop,popZIndex,
          adjustedPopMarginTop, //[D] 화면 사이즈에 따라 변경된 팝업 MarginTop 값
          adjustedPopHeight, //[D] 화면 사이즈에 따라 변경된 팝업 높이 값
          $popupWrapBg,$popCloseBtn,$popBg,$popWrap,$ele,$popSnap,
          downTarget, //[D] $popupWrapBg 클릭시 , 'mousedown' 이벤트 타겟
          upTarget; //[D] $popupWrapBg 클릭시 , 'mouseup' 이벤트 타겟

        /*[D] defaultPopup
         ngt.popup(element, options);
         element: id or class name
         options: {
         'width': 1200, //popup width size
         'height':600, //popup height size
         'zIndex': 1000, //popup zIndex
         'marginTop': 50, //popup margin top
         'bgOpacity': 0.8 //shade background alpha
         }
         */
      },
      OpacityValidate: function(value){
        //[D] Opacity 0~1 사이의 소수점 1째 자리 숫자인지 확인
        if (value * 10 != parseInt(value * 10)) {
          throw new Error('Opacity 값은 소수점 1째 자리 까지의 숫자로 전달해야 합니다.');
        } else if (value < 0 || value> 1) {
          throw new Error('Opacity 값은 0~1 사이의 숫자로 전달해야 합니다.');
        }
      },
      popOptionsValidate : function(options){
        //[D] 팝업 옵션 유효성 검사
        options = options || {};
        //[D] 옵션값이 숫자인지 확인
        if(Object.keys(options).length){
          for(var key in options){
            if(typeof options[key] != 'number') {
              throw new Error(key + '값은 숫자로 전달해야 합니다.');
            }
          }
        }
        //[D] bgOpacity 유효성 검사
        if(options.bgOpacity != undefined){
          OpacityValidate(options.bgOpacity)
        }
        //[D] defaultPopup 디폴트 옵션 값
        var _options = {
          'width': 1200,
          'height':600,
          'zIndex': 1000,
          'marginTop': 50,
          'bgOpacity': 0.8
        }

        popWidth = options.width || _options.width;
        popHeight = options.height || _options.height;
        popBgOpacity = options.bgOpacity || _options.bgOpacity;
        popMarginTop = options.marginTop || _options.marginTop;
        popZIndex = options.zIndex || _options.zIndex;
      },
    removeBasisEle : function(){
      //[D] 팝업 기반요소 삭제
      $('#ngt-popup-bg').remove();
      //[D] 비디오 팝업이 아닌 경우 팝업 컨텐츠 기존 위치에 삽입
      if (!$ele.is('#videoPopup')) {
        $ele.insertAfter('#wrap').css('display','none');
      }else{
        $('#videoPopup').remove();
      }
      $('#ngt-popup-wrap').remove();
    },
    popBeforeOpenSnap : function(){
      //[D] 팝업 오픈 전 위치 조절
      if( $win.height()<= popHeight+(popMarginTop) ){
        //[D] 팝업이 화면보다 클 경우
        $ele.css({
          "marginTop": popMarginTop+100,
          "height": popHeight,
          'position':"static"
        });
        adjustedPopHeight = popHeight;
        adjustedPopMarginTop = popMarginTop;
      }else{
        //[D] 팝업이 화면보다 작을 경우
        adjustedPopMarginTop = (popHeight/2 * -1);
        $ele.css({
          "marginTop": adjustedPopMarginTop+100,
          "height":$win.height()-(($win.height()-popHeight)/2)-100,
          'position':"relative"
        });
        adjustedPopHeight = $win.height()-(($win.height()-popHeight)/2)-100;
      }
    },
    popSnap : function(){
      //[D] 팝업 오픈 후 위치 조절
      if( $win.height()< popHeight+popMarginTop){
        //[D] 팝업이 화면보다 클 경우
        console.log('리사이징중: 팝업이 화면보다 큼')
        $ele.css({
          "marginTop": popMarginTop,
          "height": popHeight,
          'position':"static"
        });
      }else{
        //[D] 팝업이 화면보다 작을 경우
        console.log('리사이징중: 팝업이 화면보다 작음')
        $ele.css({
          "marginTop": (popHeight/2 * -1)+'px',
          "height":$win.height()-(($win.height()-popHeight)/2),
          'position':"relative"
        });
      }
    },
    openPop : function(){
      //[D] 팝업 열기
      console.log('openPop');
      $ele.css({'width': popWidth})
      $popWrap.append($ele);
      $ele.css('display','block').stop().animate({
        'marginTop' :adjustedPopMarginTop,
        'height':popHeight
      },300,'easeInCubic');
      $popupBg.stop().animate({
        opacity:popBgOpacity
      },400);
      $popupWrapBg.css('display',"block");
      $('body').addClass('overFlowHidden');
      $popSnap.css("paddingRight","17px");
    },
    closePop : function(){
      //[D] 팝업 닫기
      console.log('closePop');
      $ele.stop().animate({
        'marginTop' :adjustedPopMarginTop+100,
        'height':adjustedPopHeight
      },300,'easeInCubic');
      $popupBg.stop().animate({
        opacity:0
      },300,function(){
        removeBasisEle();
        $('body').removeClass('overFlowHidden');
        $popSnap.css("paddingRight","0");
        $popupWrapBg.css('display',"none");
      });
    },
    bindEvent : function(){
      //[D] 이벤트 바인드
      var clickValidate = function (e){
        e.preventDefault();
        //[D] 클릭 이벤트시 mouseup,mousedown 이벤트의 타겟이 동일할 경우만
        if(downTarget==upTarget){
          if($('.popup').has($(e.target)).length){return};
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

  function defaultPopup(element,options){
    //[D] 파라미터 유효성체크
    if (!$(element).length) { throw new Error('전달인자는 존재하는 요소의 선택자로 전달해야 합니다.'); }
    popOptionsValidate(options);

    $ele = $(element);


    popup.init()
    popup.popBeforeOpenSnap();
    popup.openPop();
    popup.bindEvent();
  }

  window.ngt = {
        defaultPopup: defaultPopup,
    }
})(window);
