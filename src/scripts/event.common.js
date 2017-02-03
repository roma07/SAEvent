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
  var $win = $(window);
  var $body = $('body');

    var document = window.document;

    /*****************************************
     * popup
     ******************************************/
    var popup = (function(){
      // popup 전역 변수
      var popWidth,popHeight,popBgOpacity,popMarginTop,popZIndex,
          adjustedPopMarginTop, //[D] 화면 사이즈에 따라 변경된 팝업 MarginTop 값
          adjustedPopHeight, //[D] 화면 사이즈에 따라 변경된 팝업 높이 값
          $popupWrapBg,$popCloseBtn,$popBg,$popWrap,$ele,
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

      //[D] Opacity 0~1 사이의 소수점 1째 자리 숫자인지 확인
      var OpacityValidate = function(value) {
        if (value * 10 != parseInt(value * 10)) {
          throw new Error('Opacity 값은 소수점 1째 자리 까지의 숫자로 전달해야 합니다.');
        } else if (value < 0 || value> 1) {
          throw new Error('Opacity 값은 0~1 사이의 숫자로 전달해야 합니다.');
        }
      }
      //[D] 팝업 옵션 유효성 검사
      var popOptionsValidate = function(options){
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
      }

      //[D] 팝업 기반요소 생성
      function createBasisEle(){
        $('body').append("<div id='ngt-popup-bg'></div>");
        $popBg = $('#ngt-popup-bg').css({
          'opacity':popBgOpacity,
          'zIndex':popZIndex -1
        });
        $('body').append("<div id='ngt-popup-wrap'></div>");
        $popWrap = $('#ngt-popup-wrap').css({'zIndex':popZIndex});
        $popWrap.append("<div id='ngt-popup-close'><a href=''><img src='../assets/images/popup/popup_close.png' alt='팝업 닫기'></a></div>");
        $popCloseBtn = $('#ngt-popup-close');
        $popupWrapBg = $('#ngt-popup-close,#ngt-popup-wrap,#ngt-popup-bg');
        $popupBg = $('#ngt-popup-bg,#ngt-popup-close').css('opacity',0);
      }

      //[D] 팝업 기반요소 삭제
      function removeBasisEle(){
        $('#ngt-popup-bg').remove();
        //[D] 비디오 팝업이 아닌 경우 팝업 컨텐츠 기존 위치에 삽입
        if (!$ele.is('#videoPopup')) {
          $ele.insertAfter('#wrap').css('display','none');
        }else{
          $('#videoPopup').remove();
        }
        $('#ngt-popup-wrap').remove();
      }

      //[D] 팝업 오픈 전 위치 조절
      function popBeforeOpenSnap(){
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
      }
      //[D] 팝업 오픈 후 위치 조절
      function popSnap(){
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
      }

      //[D] 팝업 열기
      function openPop(){
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
      }

      //[D] 팝업 닫기
      function closePop(){
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
          $popupWrapBg.css('display',"none");
        });
      }

      //[D] 이벤트 바인드
      function bindEvent(){
        var clickValidate = function (e){
          e.preventDefault();
          //[D] 클릭 이벤트시 mouseup,mousedown 이벤트의 타겟이 동일할 경우만
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

      var defaultType = function(element,options){
        //[D] 파라미터 유효성체크
        if (!$(element).length) { throw new Error('전달인자는 존재하는 요소의 선택자로 전달해야 합니다.'); }
        popOptionsValidate(options);

        $ele = $(element);

        createBasisEle();
        popBeforeOpenSnap();
        openPop();
        $win.resize(function(){
          popSnap();
        });
        bindEvent();
      }

      var videoType = function(youtubeCode,options,youtubeOptions){

        /*[D]
         ngt.videoPopup(youtubeCode,options,youtubeOptions);
         youtubeCode, //필수
         options: //ngt.popup 동일
         youtubeOptions: {
         'rel': 1, //동영상이 완료되면 추천 동영상 표시 (0: 미적용 /1:적용 )
         'controls': 1, //플레이어 컨트롤 표시
         'showinfo': 1 //동영상 제목 및 플레이어 작업 표시
         }
         */

        //[D] youtubeCode 유효성체크
        if (!typeof youtubeCode == 'string') { throw new Error('전달인자는 문자열로 전달해야 합니다.'); }

        //[D] youtubeOptions 유효성체크 (숫자 0 또는 1 인지 확인)
        youtubeOptions = youtubeOptions || {};
        for(var key in youtubeOptions){
          if(!(youtubeOptions[key] == 0 || youtubeOptions[key] == 1)){
            throw new Error(key+'값은 0 또는 1로 전달해야 합니다.');
          }
        }
        //[D] youtubeOptions default 값
        var _youtubeOptions = {
          'rel': 1,
          'controls': 1,
          'showinfo': 1
        }
        var rel = (youtubeOptions.rel!="undefined")? youtubeOptions.rel: _youtubeOptions.rel,
          controls = (youtubeOptions.controls!="undefined")? youtubeOptions.controls: _youtubeOptions.controls,
          showinfo = (youtubeOptions.showinfo!="undefined")? youtubeOptions.showinfo: _youtubeOptions.showinfo;

        //[D] 비디오팝업 요소 생성
        $('body').append("<div id='videoPopup' class='ngt-popup'></div>");
        $('#videoPopup').append("<iframe class='popIframe'></iframe>");
        defaultType('#videoPopup',options);
        $('.popIframe').attr({
          width:popWidth,
          height:popHeight,
          'src':"https://www.youtube.com/embed/"+youtubeCode+"?rel="+rel+"&controls="+controls+"&showinfo="+showinfo,
          frameborder:'0',
          allowfullscreen:''
        });
        //[D] 비디오팝업 요소 삭제
         $popupWrapBg.on('click', function(e) {
           e.preventDefault();
         })
      };

      var galleryType = function(element,options,galleryOptions){
        /*
        ngt.galleryPopup(element,options,galleryOptions);
        element: //id or class name element 필수
        options: //ngt.popup 동일
          galleryOptions: {
            view: $('#gallery01_view'),//view element id 필수
            thumbnail: $('#gallery01_thum'),//thumbnail element id 필수
        }
        */

        //[D] galleryOptions 유효성체크
        if (!$(galleryOptions.view).length) { throw new Error('view 전달인자는 존재하는 요소의 id 선택자로 필수 전달해야 합니다.'); }
        if (!$(galleryOptions.thumb).length) { throw new Error('thumb 전달인자는 존재하는 요소의 id 선택자로 필수 전달해야 합니다.'); }
        //[D] thumbOpacity 유효성 검사
        if(galleryOptions.thumbOpacity != undefined){
          OpacityValidate(galleryOptions.thumbOpacity)
        }
        //[D] galleryOptions default 값
        var _galleryOptions = {
          'thumbOpacity': 0.5,
        }
        var $view = $(galleryOptions.view).children('div'),
            $thumb = $(galleryOptions.thumb).children('div'),
            thumbOpacity = galleryOptions.thumbOpacity || _galleryOptions.thumbOpacity;

        //[D] 갤러리 팝업 init
        function init(){
          $view.css('display','none');
          $view.first().css('display','block');
          $thumb.removeClass('active').css('opacity',thumbOpacity);
          $thumb.first().addClass('active').css('opacity',1);
          bindEvent();
        }
        function bindEvent(){
          $thumb.on("mouseenter",function(){
            $(this).css('opacity',1);
          });
          $thumb.on("mouseleave",function(){
            $thumb.each(function(){
              if($(this).hasClass('active')){
                $(this).css('opacity',1);
              }else{
                $(this).css('opacity',thumbOpacity);
              }
            });
          });
          $thumb.on("click",function(e){
            e.preventDefault();
            selectThumb($(this));
          });
        }
        function selectThumb(selectedThumb){
          $thumb.each(function(){
            if($(this).hasClass('active')){
              $(this).removeClass('active').css('opacity',thumbOpacity);
            }
          });
          selectedThumb.addClass('active').css('opacity',1);
          var selectedThumb = $thumb.index(selectedThumb);
          $view.css('display','none');
          $view.eq(selectedThumb).css('display','block');
        }
        init();

        defaultType(element,options);

        //[D] 갤러리 bindEvent off
        $popupWrapBg.on('click', function(e) {
          e.preventDefault();
          if($(e.target).parent($thumb) || $(e.target).is($thumb)) return;
          $thumb.off();
        })

      };
      return {
        defaultPopup : defaultType,
        videoPopup : videoType,
        galleryPopup : galleryType
      }
    })();

  window.ngt = {
        popup: popup,
        defaultPopup: popup.defaultPopup,
        videoPopup: popup.videoPopup,
        galleryPopup: popup.galleryPopup
    }
})(window);
