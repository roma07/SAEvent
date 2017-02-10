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
  var $win,$body;
  $(document).ready(function(){
    $win = $(window);
    $body = $('body');
  });

  var before = {
    styles: {
      content: '',
      display: 'inline-block',
      width: '0',
      height: '100%',
      fontSize: '0',
      verticalAlign: 'middle'
    },
    generate: function(){
      this.$el = $('<div></div>').addClass('popupBefore').css(this.styles);
      return this.$el;
    }
  };
  var inner = {
    styles: {
      position: 'relative',
      height: '100%',
      padding: '30px',
      boxSizing: 'border-box',
      textAlign: 'center',
      overflow: 'hidden',
      cursor: 'zoom-out'
    },
    generate: function(){
      this.$el = $('<div></div>').addClass('popupInner').css(this.styles);
      this.$el.css({
        minWidth: parseInt(popup.width) + parseInt(inner.$el.css('paddingLeft')) + parseInt(inner.$el.css('paddingRight')),
        minHeight: parseInt(popup.height) + parseInt(inner.$el.css('paddingTop')) + parseInt(inner.$el.css('paddingBottom'))
      });
      return this.$el;
    }
  };
  var shade = {
    generate :function(){
      this.$el = $('<div></div>').addClass('popupBg').css({'opacity':popup.bgOpacity, 'zIndex':popup.zIndex -1});
      return this.$el;
    }
  }

  var wrapper = {
    generate :function(){
      this.$el = $('<div></div>').addClass('popupWrap').css({'zIndex':popup.zIndex});
      return this.$el;
    }
  }

  var button = {
    generate :function() {
      this.$el = $('<a href="javascript:;">x</a>').addClass('popupClose');
      return this.$el;
    }
  }
  /*
  var bindEvent = {
    add: function () {
      var mouseDownValidate = function (e) {
        this.downTarget = $(e.target).context;
      }
      var mouseUpValidate = function (e) {
        this.upTarget = $(e.target).context;
      }
      $win.on("mousedown", mouseDownValidate);
      $win.on("mouseup ", mouseUpValidate);

      var clickValidate = function (e) {
        e.preventDefault();
        //[D] 클릭 이벤트시 mouseup,mousedown 이벤트의 타겟이 동일할 경우만
        if (this.downTarget == this.upTarget) {
          if ($('.popup').has($(e.target)).length) {return}
          if ($(e.target).hasClass('popup')) return;
          //popup.closePop();
        }
        console.log('bindEvent add');
      }
      $win.on("click", clickValidate);
    },
    remove: function(){
      $win.off();
    }
  }
*/
  var bindEvent = {
    add: function(){
      $win.on({
        mousedown: function (event) {
          this.$target = $(event.target);
        },
        mouseup: function (event) {
          if (this.$target.is('.popupInner, .popupClose') && $(event.target).is('.popupInner, .popupClose'))
            popup.close();
        }
      });
    },
    remove: function(){
      $win.off('mouseup, mouseup');
      this.$target = null;
    }
  };



    var popup = {
      setOptions : function(options){
        //[D] 디폴트 옵션 값
        var _options  = {
          'width': 1200,
            'height':600,
            'zIndex': 1000,
            'bgOpacity': 0.8
        },
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
        function OpacityValidate (value){
          //[D] Opacity 0~1 사이의 소수점 1째 자리 숫자인지 확인
          if (value * 10 != parseInt(value * 10)) {
            throw new Error('Opacity 값은 소수점 1째 자리 까지의 숫자로 전달해야 합니다.');
          } else if (value < 0 || value> 1) {
            throw new Error('Opacity 값은 0~1 사이의 숫자로 전달해야 합니다.');
          }
        }
        if(options.bgOpacity != undefined){
          OpacityValidate(options.bgOpacity)
        }

        popup.width = options.width || _options.width;
        popup.height = options.height || _options.height;
        popup.bgOpacity = options.bgOpacity || _options.bgOpacity;
        popup.zIndex = options.zIndex || _options.zIndex;
      },
      open : function(options){
        popup.setOptions(options);
        $body.append(shade.generate());
        this.$el.css({'width': popup.width, 'height': popup.height, 'display': 'inline-block'});
        this.$el.wrap(wrapper.generate()).wrap(inner.generate());
        this.$el.before(before.generate()).after(button.generate());
        bindEvent.add();
      },
      close : function(){
        this.$el.hide().unwrap().unwrap();
        before.$el.remove();
        button.$el.remove();
        shade.$el.remove();
        bindEvent.remove();
      }
  };

  function defaultPopup(element,options){
    //[D] element 파라미터 유효성체크
    if (!$(element).length) { throw new Error('전달인자는 존재하는 요소의 선택자로 전달해야 합니다.'); }

    popup.$el = $(element);
    popup.open(options);
  }

  function youtubePopup(youtubeCode,options,youtubeOptions){

    /*[D]
     ngt.videoPopup(youtubeCode,options,youtubeOptions);
     youtubeCode, //필수
     options: //ngt.popup 동일
     youtubeOptions: {
     'autoplay': 1 //동영상 자동 재생
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
      'autoplay': 1,
      'rel': 1,
      'controls': 1,
      'showinfo': 1
    }
    var autoplay = (youtubeOptions.autoplay!="undefined")? youtubeOptions.autoplay: _youtubeOptions.autoplay,
      rel = (youtubeOptions.rel!="undefined")? youtubeOptions.rel: _youtubeOptions.rel,
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

    popup.$el = $(element);
    popup.open(options);
  };


  window.ngt = {
    defaultPopup: defaultPopup,
    youtubePopup: youtubePopup
  }
})(window);
