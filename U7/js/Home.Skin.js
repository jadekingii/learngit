/**
* @file Home.Skin.js
* @description 前端换肤处理
* @company UCML
* @author sunyi
* @version 1.0
* @date 2018.09.22
*/

(function(window, document, $){    
    'use strict';
    $.Home=$.Home||{};
    $.Home.Skin={        
        zIndex:9999,
        openTime:0,
        diameter:448,
        //$content:$('#SkinChange'),    
        createMask:function(){
            var getPageArea= function(document) {
                    if (document.compatMode == 'BackCompat') {//quirks mode怪异模型
                        return {
                            width: Math.max(document.body.scrollWidth, document.body.clientWidth),
                            height: Math.max(document.body.scrollHeight, document.body.clientHeight)
                        }
                    } else {
                        return {
                            width: Math.max(document.documentElement.scrollWidth, document.documentElement.clientWidth),
                            height: Math.max(document.documentElement.scrollHeight, document.documentElement.clientHeight)
                        }
                    }
                }
            //this.mask = $('<div class="window-mask"></div>', document).appendTo(document.body);
            this.mask = $('<div class="skin-mask"></div>', document).appendTo(document.body);
            this.mask.css({
                width: getPageArea(document).width,
                height: getPageArea(document).height,
                display: 'none',
                position:'absolute',
                top:'0',
                left:'0',
                overflow:'hidden',
                background:'transparent'
            });
        },
        ShowMask:function(){
            if (typeof this.mask === 'undefined'){
                this.createMask();
            }           
            this.mask.css({
                display: 'block',
                zIndex: this.zIndex++
            });
            
        },
        hidenMask: function () {
            if (this.mask) {
                this.mask.css({
                    display: 'none',
                    zIndex: this.zIndex++
                });
            }
        },
        destroyMark: function () {          
            if (this.mask) {
                this.mask.remove();
                delete this.mask;
            }         
        },
        createChangeSkin:function(){
            /*this.$content=$('<div id="allDiv"></div>', this.window.document).appendTo(this.window.document.body);
            this.$outerDiv=$('<div id="outerDiv"></div>', this.window.document).appendTo(this.$content);
            this.$circleDiv=$('<div id="circleDiv"></div>', this.window.document).appendTo(this.$outerDiv);
            */
        },
        Init:function(){
            this.openTime++;
            var childDiv = $('#outerDiv').children('div');
            if(childDiv.length<2) return;
            var len = childDiv.length-1;
            var jishu = parseInt(len/2)*-1;
            //var width = $(document.body).width() - 10;
            //位置居中处理
            var docwidth = $(document.body).width();
            var docheight=$(document.body).height();
            var width=this.diameter;
            var topx =(docheight-width)/2;
            var leftx =(docwidth-width)/2;
            $("#outerDiv").css({ "width": width, "height": width, "border-radius": width / 2 }).show();
            $("#circleDiv").css({ "width": width / 3, "height": width / 3, "border-radius": width / 6, "left": width / 3, "top": width / 3 });
            $("#change_skin").css({ "width": width, "height": width,"position":"absolute","top":topx,left:leftx });
            var preX, preY;//上一次鼠标点的坐标
            var curX, curY;//本次鼠标点的坐标
            var preAngle;//上一次鼠标点与圆心(150,150)的X轴形成的角度(弧度单位)
            var transferAngle;//当前鼠标点与上一次preAngle之间变化的角度
            var firstDiv = childDiv.eq(1);

            preX = firstDiv.offset().left;
            preY = $("#outerDiv").offset().top + firstDiv.offset().top;
            preAngle = Math.atan2(preY - width / 2, preX - width / 2);
            var hudu = 10;
            var a = 0;
            var curAngle;
            var circleAround = function () {
                var or = width / 2;//150;
                var ir = width / 4;// 50;
                var mWidth = width / 300 * 54;//54;
                var mDLen = Math.sqrt(2 * Math.pow(mWidth, 2));
                var jd = 360 / len;//得到每个图标角度，原先为45，按比例更改
                var curX = parseInt((Math.cos(-1 * (hudu * 1 * Math.PI / 2 / 90)) * (ir + ((or - ir - mDLen) / 2) + mDLen / 2)) + $("#outerDiv").offset().left +width / 2 - mWidth / 2);
                var curY = parseInt((Math.sin(-1 * (hudu * 1 * Math.PI / 2 / 90)) * (ir + ((or - ir - mDLen) / 2) + mDLen / 2)) + $("#outerDiv").offset().top + width / 2 - mWidth / 2);
                curAngle = hudu;
                transferAngle = curAngle - preAngle;
                a += (transferAngle * 180 / Math.PI);
                $('#outerDiv').rotate(a);
                for (var i = 0 ; i <= len ; i++) {
                    $("#m" + i).rotate(-a);
                }
                childDiv.each(function(index){
                    if($(this).attr("id")!=="circleDiv"){
                        $(this).rotate(-a);
                    }
                });
                preX = curX;
                preY = curY;
                preAngle = curAngle;
            }
            //自动旋转效果
            //setInterval(function () { hudu = hudu + 1 / 500; circleAround(); }, 10);
            this.IntervalFun=function(){
                hudu = hudu + 1 / 500; 
                circleAround();
            }
            //位置定位
            var or = width / 2;//150;
            var ir = width / 4;// 50;
            var mWidth = width / 300 * 54;//54;
            var mDLen = Math.sqrt(2 * Math.pow(mWidth, 2));
            var jd = 360 / len;//得到每个图标角度，原先为45，按比例更改
            var baseWidth = $("#outerDiv").offset().left + width / 2 - mWidth / 2;
            var baseHeight = $("#outerDiv").offset().top + width / 2 - mWidth / 2;
            childDiv.each(function(index){
                if($(this).attr("id")!=="circleDiv"){
                    $(this).width(mWidth);
                    $(this).height(mWidth);
                    if(jishu>0){
                        var x= parseInt((Math.cos(jd * jishu * Math.PI / 2 / 90) * (ir + ((or - ir - mDLen) / 2) + mDLen / 2)) + baseWidth);
                        var y= parseInt((Math.sin(jd * jishu * Math.PI / 2 / 90) * (ir + ((or - ir - mDLen) / 2) + mDLen / 2)) + baseHeight);
                        $(this).offset({ top: y, left: x });
                    }
                    else{
                        var x= parseInt((Math.cos(-1 * (jd * Math.abs(jishu) * Math.PI / 2 / 90)) * (ir + ((or - ir - mDLen) / 2) + mDLen / 2)) + baseWidth);
                        var y= parseInt((Math.sin(-1 * (jd * Math.abs(jishu) * Math.PI / 2 / 90)) * (ir + ((or - ir - mDLen) / 2) + mDLen / 2)) + baseHeight);
                        $(this).offset({ top: y, left: x });
                    }
                    jishu++;
                }

            });
        },

        hide:function(){   
            var opts = this;
            var offset= this.showOffset||{top: 0, left: 0};  
            $('#change_skin').stop(true);          
            $('#change_skin').animate(
                {
                    left:offset.left,
                    top:offset.top,
                    width:0,
                    height:0,
                    opacity:0.1
                },                
                500,
                function(){
                    $('#change_skin').css("opacity",1);
                    $('#change_skin').hide();
                    if(typeof opts.Interval !=='undefined'){
                        clearInterval(opts.Interval);
                        opts.Interval=undefined;
                    }
                }                
            );

            //$('#change_skin').hide();
            this.hidenMask();
            this.unbind();
        },
        show:function(offset){
            this.ShowMask();   
            offset= offset||{top: 0, left: 0};
            this.showOffset = offset;
           // $('#change_skin').show();
           var opts = this;
            $('#change_skin').stop(true);
            $('#change_skin').css({                
                zIndex: this.zIndex++,   
                opacity:0.3,
                top:offset.top,
                left:offset.left,
                width:0,
                height:0
            }).show(50,
                function(){
                    $('#change_skin').animate({
                        left:($(document.body).width() - opts.diameter)/2,
                        top:($(document.body).height() - opts.diameter)/2,
                        width:opts.diameter,
                        height:opts.diameter,
                        opacity:0.8
                    },
                    500,
                    function(){
                        $('#change_skin').css("opacity",1);
                        if(opts.openTime==0) opts.Init();
                        opts.openTime++;
                        opts.bind();
                        if(typeof opts.Interval==='undefined' && typeof opts.IntervalFun==='function'){                            
                            opts.Interval = setInterval(function () { opts.IntervalFun() }, 10);
                        }
                    });
                });
              
           

        },
        bind:function(){
            var _self = this;
            var outdiv = $("#outerDiv");
            outdiv.on('click.changeSkin','img',function(){
                var type = $(this).attr("skinType")             
                _self.callChangeSkin(type);
            });
            
            $('.skin-mask').on('click.changeSkin',function(e){
                if($(e.target).closest("#outerDiv").length==0){
                    _self.hide();
                }
            })
        },
        unbind:function(){
            $(document).off('click.changeSkin');
            $("#outerDiv").off('click.changeSkin');
        },
        openshow:function(){
            var w = new UCML.OpenShowWindow({ 
                             frameMode: "frame", 
                             maximizable:false,
                             collapsible: false, 
                             URL: "Skin.html?callbackFn=callChangeSkin", scroll: "no", 
                             height: 562, width: 676, title: "九色图"
                        });
            w.open();
        },
        callChangeSkin:function(val){
            if(val){
                this.setFrameSkin(val);
            }           
        },
        setFrameSkin:function(skinName) {
            var opts=this;
            var screenName = $.Home.screenName||'U7Frame';
            loadSkin(skinName, screenName, function (skin) {
                if (skin) {
                    var frame = skin.frame;
                    if (frame.styles) {
                        $.each(frame.styles, function (index, item) {
                            $("link#" + item.id).attr("href", localResourcePath + item.src);
                        });
                    }
                    if (frame.scripts) {
                        $.each(frame.scripts, function (index, item) {
                        });
                    }
                    opts.onSetSkin(skinName, skin.page,skin.portal);
                }
            });
        },
        onSetSkin:function(skinName, pageSkin,portalSkin) {
            $(" div.page-content > iframe").each(
            function () {                
                var page = this.contentWindow;
                if (page && page.setPageSkin) {
                    page.setPageSkin(pageSkin,portalSkin);
                }
                if (page && page.setTemplateSkin) {
                    page.setTemplateSkin(skinName);
                }
            });
        }
    };
    window.callChangeSkin = function(val) {
        $.Home.Skin.callChangeSkin(val);
    };
}(window, document, jQuery))
