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
      // popup전역 변수
      var popWidth,popHeight,popBgOpacity,popMarginTop,popZIndex,adjustedPopMarginTop,adjustedPopHeight,
          $popupWrapBg,$popCloseBtn,$popBg,$popWrap,$ele,$popSnap,
          downTarget, //[D] when popup button clicked, mousedown evnet's target
          upTarget; //[D] when popup button clicked, mouseup evnet's target


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
      //[D] 팝업 옵션 유효성 검사
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

      //[D] 오픈시 팝업 위치 조절
      function popBeforeOpenSnap(){
        if( $win.height()<= popHeight+(popMarginTop) ){
          console.log('팝업이 화면보다 큼')
          $ele.css({
            "marginTop": popMarginTop+100,
            "height": popHeight,
            'position':"static"
          });
          adjustedPopHeight = popHeight;
          adjustedPopMarginTop = popMarginTop;
        }else{
          console.log('팝업이 화면보다 작음')
          adjustedPopMarginTop = (popHeight/2 * -1);
          $ele.css({
            "marginTop": adjustedPopMarginTop+100,
            "height":$win.height()-(($win.height()-popHeight)/2)-100,
            'position':"relative"
          });
          adjustedPopHeight = $win.height()-(($win.height()-popHeight)/2)-100;
        }
      }
      //[D] 팝업 위치 조절
      function popSnap(){
        console.log(popHeight);
        if( $win.height()< popHeight+popMarginTop){
          console.log('리사이징중: 팝업이 화면보다 큼')
          $ele.css({
            "marginTop": popMarginTop,
            "height": popHeight,
            'position':"static"
          });
          //adjustedPopMarginTop = popMarginTop;
        }else{
          console.log('리사이징중: 팝업이 화면보다 작음')
          $ele.css({
            "marginTop": (popHeight/2 * -1)+'px',
            "height":$win.height()-(($win.height()-popHeight)/2),
            'position':"relative"
          });
          //adjustedPopMarginTop = (popHeight/2 * -1);
        }
      }

      //[D] 팝업 열기
      function openPop(){
        console.log('openPop');
        $ele.css({
          'width': popWidth
        })
        $popWrap.append($ele);
        $ele.show();
        $ele.animate({
          'marginTop' :adjustedPopMarginTop,
          'height':popHeight
        },500,'easeInCubic',function(){});
        $popupWrapBg.show();
        $('body').addClass('overFlowHidden');
        //$popSnap.css("paddingRight","17px");
      }

      //[D] 팝업 닫기
      function closePop(){
        $popupWrapBg.animate({
          opacity:0
        },1000,function(){
          removeBasisEle();
        });
        $ele.animate({
          'marginTop' :adjustedPopMarginTop+100,
          'height':adjustedPopHeight
        },1000,'easeInCubic',function(){afterClosePop()});

        function afterClosePop(){
          $ele.hide();
          $('body').removeClass('overFlowHidden')
          //$popSnap.css("paddingRight","0");

        }
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

      var defaultType = function(element,options){
        //[D] 파라미터 유효성체크
        if (!$(element).length) { throw new Error('전달인자는 존재하는 요소의 선택자로 전달해야 합니다.'); }
        popOptionsValidate(options);

        $ele = $(element),
        //$popSnap = $(".imgSnap,.gnbBannerSec");

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
           $('#videoPopup').remove();
           $('#videoPopup').find('.popIframe').remove();
         })
      };
      var galleryType = function(element,options){

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
        defaultType(element,options);
      };
      return {
        defaultPopup : defaultType,
        videoPopup : videoType,
        galleryPopup : galleryType
      }
    })();



  /*****************************************
     * Layer popup gallery
     *****************************************
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
   */

  window.ngt = {
        popup: popup,
        defaultPopup: popup.defaultPopup,
        videoPopup: popup.videoPopup,
        galleryPopup: popup.galleryPopup
    }
})(window);
