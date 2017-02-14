/*!
 * Nexon-GT Event JavaScript Library v1.0.0
 * Date: 2016-12-22
 */

if (typeof Object.assign != 'function') {
    Object.assign = function(target) {
        'use strict';
        if (target == null) {
            throw new TypeError('Cannot convert undefined or null to object');
        }
        target = Object(target);
        for (var index = 1; index < arguments.length; index++) {
            var source = arguments[index];
            if (source != null) {
                for (var key in source) {
                    if (Object.prototype.hasOwnProperty.call(source, key)) {
                        target[key] = source[key];
                    }
                }
            }
        }
        return target;
    };
}
$(function(){

    var $window = $(window),
        $body = $('body');

    var browser = (function(){
        var company = null, agent = null, isMobile = null, versionSearchString = null;
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
        company = searchString(dataBrowser) || "Other";
        agent = searchVersion(navigator.userAgent) || searchVersion(navigator.appVersion) || "Unknown";
        isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? true : false;
        return {
            name: company,
            version: agent,
            mobile: isMobile,
            info: function(){
                return "You are using " + company + " with version " + agent + ".";
            }
        }
    })();

    var windowEvent = {
        add: function(){
            $window.on({
                mousedown: function (event) {
                    this.$target = $(event.target);
                },
                mouseup: function (event) {
                    if (this.$target.is('.popupInner, .popupClose') && $(event.target).is('.popupInner, .popupClose')){
                        if(windowEvent.closeEvent) {
                            windowEvent.closeEvent();
                            delete windowEvent.closeEvent;
                        }
                        popup.close();
                    }
                }
            });
        },
        remove: function(){
            $window.off('mouseup, mouseup');
            this.$target = null;
        }
    };

    var bodyScroll = {
        active: false,
        hidden: function(){
            if(browser.mobile) return;
            if($body.height() > $window.height()){
                $body.css({overflow: 'hidden', margin: '0 17px 0 0', backgroundColor: '#f1f1f1'});
                this.active = true;
            }
            if(browser.name === 'Explorer' && browser.version === 7 || browser.version === 8){
                $('html, body').css({overflow: 'hidden'});
            }
        },
        auto: function(){
            if(browser.mobile) return;
            if(this.active){
                $body.css({overflow: '', margin: '', backgroundColor: ''});
                this.active = false;
            }
            if(browser.name === 'Explorer' && browser.version === 7 || browser.version === 8){
                $('html, body').css({overflow: 'auto'});
            }
        }
    };

    var shade = {
        styles: {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '101%',
            height: '101%',
            backgroundColor: 'black',
            opacity: '0.8',
            cursor: 'zoom-out',
            zIndex: '99999998'
        },
        generate: function(){
            this.$el = $('<div></div>').addClass('shade').css(this.styles);
            return this.$el;
        }
    };

    var wrapper = {
        styles: {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            overflow: 'auto',
            zIndex: '99999999'
        },
        generate: function(){
            this.$el = $('<div></div>').addClass('popupWrapper').css(this.styles);
            return this.$el;
        }
    };

    var inner = {
        styles: {
            position: 'relative',
            height: '100%',
            padding: '50px 0',
            boxSizing: 'border-box',
            textAlign: 'center',
            overflow: 'hidden',
            cursor: 'zoom-out'
        },
        generate: function(){
            this.$el = $('<div></div>').addClass('popupInner').css(this.styles);
            this.$el.css({
                minWidth: parseInt(popup.styles.width) + parseInt(inner.$el.css('paddingLeft')) + parseInt(inner.$el.css('paddingRight')),
                minHeight: parseInt(popup.styles.height) + parseInt(inner.$el.css('paddingTop')) + parseInt(inner.$el.css('paddingBottom'))
            });
            return this.$el;
        }
    };

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

    var button = {
        styles: {
            position: 'absolute',
            top: '0',
            right: '0',
            padding: '10px 20px',
            fontFamily: 'Arial, Baskerville, monospace',
            fontSize: '22px',
            color: 'lightGray',
            verticalAlign: 'middle',
            textDecoration: 'none',
            //backgroundColor: 'rgba(0,0,0,0.2)',
            cursor: 'auto'
        },
        generate: function(){
            this.$el = $('<a href="javascript:;">x</a>').addClass('popupClose');
            return this.$el;
        }
    };

    var popup = {
        active: false,
        styles: {
            position: 'relative',
            display: 'inline-block',
            width: '1000px',
            height: '500px',
            verticalAlign: 'middle',
            cursor: 'auto'
        },
        open: function(opt){
            if(this.active) return;
            if(typeof opt === "object"){
                if(opt.opacity) {
                    shade.styles.opacity = opt.opacity;
                    delete opt.opacity;
                }
                if(opt.padding) {
                    inner.styles.padding = opt.padding;
                    delete opt.padding;
                }
                if(opt.animation) {
                    this.$el.addClass(opt.animation);
                    delete opt.animation;
                }
                popup.styles = Object.assign({}, popup.styles, opt);
            }
            this.$el.css(this.styles).wrap(wrapper.generate()).wrap(inner.generate());
            this.$el.before(before.generate()).after(button.generate()).show();
            if(button.$el.css('background-image') != 'none') button.$el.css('font-size', 0);
            if(this.animation) this.$el.addClass(this.animation);
            $body.append(shade.generate());
            windowEvent.add();
            bodyScroll.hidden();
            this.active = true;
            if(browser.name === 'Explorer' && browser.version === 7 || browser.version === 8){
                button.$el.on('click', function(){popup.close();});
                if(browser.version === 7){
                    this.$el.css({display: 'inline', zoom: 1});
                    before.$el.css({display: 'inline', zoom: 1});
                }
            }
        },
        close: function(){
            this.$el.hide().removeAttr('style').unwrap().unwrap();
            if(this.$el.is('iframe')) this.$el.remove();
            before.$el.remove();
            button.$el.remove();
            shade.$el.remove();
            windowEvent.remove();
            bodyScroll.auto();
            this.active = false;
        }
    };

    function layerPopup(el, opt, animation, fn){
        if(typeof el === 'undefined' || typeof el === null) {
            return console.error('Please, check element id or class name!!');
        }
        if(typeof animation !== 'undefined' || typeof animation !== null) {
            popup.animation = animation;
        }
        if(fn) {
            windowEvent.closeEvent = function(){ fn() };
        }
        popup.$el = $(el);
        popup.open(opt);
    }

    function galleryPopup(el, opt, animation){
        if(typeof el === 'undefined' || typeof el === null) {
            return console.error('Please, check element id or class name!!');
        }
        if(typeof animation !== 'undefined' || typeof animation !== null) {
            popup.animation = animation;
        }
        popup.$el = $(el);
        popup.open(opt);
    }

    function youtubePopup(code, opt, animation){
        if(typeof code === 'undefined' || typeof code === null) {
            return console.error('Please, check youtube share code!!');
        }
        if(typeof animation !== 'undefined' || typeof animation !== null) {
            popup.animation = animation;
        }
        var option = {
            version: 3,
            hl: 'ko_KR',
            rel: 0,
            showinfo: 0,
            wmode: 'opaque',
            vq: 'hd720',
            autoplay: 0
        };
        if(opt.autoplay){
            option.autoplay = opt.autoplay == 'auto' ? opt.autoplay = 1 : opt.autoplay;
            delete opt.autoplay;
        }
        var str = '';
        for (var p in option) {
            if (option.hasOwnProperty(p)) str += p + '=' + option[p] + '&';
        }
        str = code + '?' + str.slice(0, -1);
        popup.$el = $("<iframe src='https://www.youtube.com/embed/" + str + "' frameborder='0' allowfullscreen=''></iframe>");
        $body.append(popup.$el);
        popup.open(opt);
    }

    var SnapImg = (function(){
        function SnapImg(el, opt){
            if(typeof el === 'undefined' || typeof el === null) {
                return console.error('Please, check element id or class name!!');
            }
            this.$el = $(el);
            this.minWidth = 1200;
            this.maxWidth = 2000;
            if(typeof opt !== 'undefined'){
                this.minWidth = opt.minWidth;
                this.maxWidth = opt.maxWidth;
            }
        }
        SnapImg.prototype.update = function(){
            if(browser.name !== 'Explorer') return;
            if($window.width() > this.maxWidth) {
                this.$el.css({backgroundPosition: '50% 0'});
            } else {
                var posX = $window.width() < this.minWidth ? Math.floor((this.minWidth - this.maxWidth)/2) : Math.floor(($window.width() - this.maxWidth)/2);
                this.$el.css({backgroundPosition: posX + 'px 0'});
            }
        };
        return SnapImg;
    })();

    window.ngt = {
        layerPopup: layerPopup,
        galleryPopup: galleryPopup,
        youtubePopup: youtubePopup
    };
    window.SnapImg = SnapImg;
});
