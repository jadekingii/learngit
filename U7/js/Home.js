/**
* @file Home.js
* @description 前端 Home页面JS处理部分，特别要注意$.Home.screenName的值，
*              代表框架，切换皮肤时，如果值不对，将无法切换对应的皮肤颜色
* @company UCML
* @author sunyi
* @version 1.0
* @date 2018.09.22
*/

(function(window,document,$){
    'use strict';
    //html5缓存机制处理，此版本未使用，为将来缓存使用
    $.sessionStorage = $.sessionStorage || {};
    $.extend($.sessionStorage, {
        set: function(key, val) {
            if (!sessionStorage) {
                console.error('该浏览器不支持sessionStorage对象');
            }
            if (!key || !val) {
                return null;
            }
            if (typeof val === 'object') {
                val = JSON.stringify(val);
            }
            sessionStorage.setItem(key, val);
        },
        get: function(key) {
            var val;
            if (!sessionStorage) {
                console.error('该浏览器不支持sessionStorage对象');
            }
            val = sessionStorage.getItem(key);
            if (!val) {
                return null;
            }
            if (typeof val === 'string') {
                val = JSON.parse(val);
            }
            return val;
        },
        remove: function(key) {
            if (!sessionStorage) {
                console.error('该浏览器不支持sessionStorage对象');
            }
            sessionStorage.removeItem(key);
        }
    });
    /*
     *@object public $.Home
     *@description  home页面处理 
     *    
    */  
    $.Home={
        localResourcePath:'../../',     
        isTab:![], //是否多页签
        screenName:'U7Frame', //框架名
        haveTimeLogin:![],//是否计算超时及超时后重新跳转到登录页。
        timeoutmeg:'登录信息已超时，请重新登录',
        /*
         *@method public init
         *@description  初始化函数
         *用户部分全局参数初始化及绑定事件处理,如果引入home.js文件时带url参数，
         *则判定为多页签，动态加载多页签
        */  
        init:function(){
            //通过引入JS文件中的home.js是否带参数判定是否是多页签版本
            var par = this.getscriptUrlPar(),
                portalLinks,portalTimer;
            if(typeof par !== 'undefined'){ 
                this.isTab=!![];
                $.Home.Content || this.includeTabscript();               
            }
            else{
                this.isTab=![];
            }
            this.setSize();
            this.bind();
            //初始门户打开处理
            portalLinks = $('ul.dropdown-portal').find('a[targetLink]');
            if(portalLinks.length>0){
                if(this.isTab){
                    portalTimer =function(){
                        try{
                            $.Home.Content.Tabs;
                            portalLinks.eq(0).click();
                        }catch(e){
                            setTimeout(portalTimer,100);
                        }                        
                    }
                    portalTimer();
                }else{
                    portalLinks.eq(0).click();
                }                
            }
        },
        /*
         *@method public includeTabscript
         *@description  动态引入多页签的js代码
         *
        */ 
        includeTabscript:function(){
            document.write("<script type='text/javascript' src='js/Home.Content.js'>" + "<" + "/script>") ;
            document.write("<script type='text/javascript' src='js/Home.Content.Tabs.js'>" + "<" + "/script>") ;
        },
         /*
         *@method public getscriptUrlPar
         *@description  判定引入home.js文件时是否带url参数
         *
        */ 
        getscriptUrlPar:function(name){
            var js = document.getElementsByTagName("script"),
                _src; 
            for (var i = 0; i < js.length; i++) {  
                _src = js[i].src.toLowerCase();
                if (_src.indexOf("home.js") >= 0) { 
                    while (true) {
                        if (_src.lastIndexOf("#") == (_src.length - 1))
                            _src = _src.substring(0, _src.length - 1);
                        else
                            break;
                    }
                    if (_src.indexOf("?") > 0){
                        var arraytemp =[];
                        var arrParams = _src.split("?")
                        var arrURLParams = arrParams[1].split("&");
                        $.each(arrURLParams,function(index,val){
                            var a = val.split("=");
                            arraytemp.push({name:a[0],value:decodeURI(a[1])});
                        });
                        if(typeof name === 'string'){
                            $.each(arraytemp,function(index,val){
                               if( name.toLowerCase()===val.name) return val.value;
                            });  
                            return ;                          
                        }else{
                            return arraytemp;
                        }     
                    }
                    return ;                     
                }  
            }
            return ;
        },
         /*
         *@method public bind
         *@description  事件绑定处理
         *绑定事件处理
        */  
        bind:function(){
            var resizeTimer = null,
                opts = this;
            $(window).on('resize.home',function(){
                if (resizeTimer) clearTimeout(resizeTimer);
                resizeTimer = setTimeout(function(){
                        opts.setSize();
                } , 100);
            }); 

                   
            //菜单点击事件
            $("ul.nav.nav-list").on("click", "a[targetLink]", function () {
                //设置iframe的src
                var openMode = $(this).attr("openMode") || "0";
                opts.setURL(openMode, $(this).attr("targetLink"),$(this).attr("mtitle"));

                //设置菜单位置文本
                var rootItem = $(this).parents("li[menuItem]");
                $("ul.breadcrumb").find("span").text(rootItem.find("span.menu-text").text());
                $("ul.breadcrumb").find("li.active").remove();

                var subItem = $(this).parents("li.open");
                subItem.each(function (index, el) {
                    if (typeof ($(el).attr("menuItem")) === "undefined") {
                        var $li = $("<li class='active'>" + $(el).children("a").text() + "</li>");
                        $("ul.breadcrumb").append($li);
                    }
                });
                $("ul.breadcrumb").append("<li class='active'><a href=\"#\" >" + $(this).text() + "</a></li>");

                //设置菜单的active样式
                var parentLi = $(this).parent("li");
                if (parentLi.length > 0) {
                    $("ul.nav.nav-list").find("li.active").removeClass("active");
                    parentLi.addClass("active");
                }
            });

            //上部菜单点击信息
            $('li.navbar-item').on('click','a',function(){
                if($(this).hasClass('bpo-tasktick')){
                    opts.setURL('0','UCMLCommon/WF/BPO_WF_TASKTICKET.aspx','我的待办');

                }else if($(this).hasClass('bpo-message')){
                    opts.setURL('0','UCMLCommon/SYS/BPO_SYS_OAMessageList.aspx','我的消息');
                }
            });

            //用户信息点击事件
            $("ul.user-menu").on("click", "a", function () {
                if ($(this).hasClass("user-setting")) {
                    opts.setURL("0", "UCMLCommon/SYS/BPO_SYS_SetPrimaryPosition.aspx", "设置");
                } else if ($(this).hasClass("user-profile")) {
                    opts.setURL("0", "UCMLCommon/SYS/BPO_UserModifyPwd.aspx", "修改密码");
                } else if ($(this).hasClass("user-logout")) {
                    window.location.href = "userlogin.aspx?logout=true";
                }else if ($(this).hasClass("user-skin")) {                   
                    $.Home.Skin.show($(this).offset());
                }else if ($(this).hasClass("user-skin2")) {
                    $.Home.Skin.openshow();                 
                }
            });
            //查询事件
            $(".nav-search-input").on('keyup.search.input',function(){
                opts.searchlist();
            }).on('focus.search.input',function(){
                if ($(this).attr("defualtValue") == this.value) {
                    this.value = "";
                }
                else {
                    opts.searchlist();
                }
            }).on('blur.search.input',function(){
                if (this.value == "") {
                    //this.value = $(this).attr("defualtValue");
                }
            });   

            $("#navbar,.main-content").on('mousemove',function(){
                opts.hideDropDown();
            });
            //查询后下拉表点击事件
            $(".search-menu").on('click','a[targetLink]',function(){
                var openMode = $(this).attr("openMode") || "0";
                opts.setURL(openMode, $(this).attr("targetLink"),$(this).attr("mtitle"));
            });

            //地址栏刷新事件
            $("ul.breadcrumb").on('click','a',function(){
                opts.btnRefresh();
            });
            //门户点击事件
            $('ul.dropdown-portal').on('click.portal','a[targetLink]',function(){
                var openMode = $(this).attr("openMode") || "0";
                opts.setURL(openMode, $(this).attr("targetLink"),$(this).attr("mtitle"));
            });
        },
        /*
         *@method public setSize
         *@description  当页面发生onsize时的重计算
         *
         */  
        setSize:function(){
            var height = $(window).height(),
                width = $(window).width(),
                body = $(window.document.body),
                default_main = $(".main-container"),
                main_content = $(".main-content"), //除去顶部的部分
                navbar = $("#navbar"),  //顶部
                titleBar = $("#breadcrumbs"),
                page_content = $(".page-content"), //iframe外部div部分高度
                sidebar = $("#sidebar"),//菜单部分
                bdh = body.height();
            body.height(height),
            main_content.height(height - navbar.outerHeight(true));
            sidebar.height(height - navbar.outerHeight(true));
            //page_content.innerHeight(height - navbar.outerHeight(true));
            //如果标题区不存在，则为多页签区域。
            if(titleBar.size() ==0) titleBar=$(".main-content-tabs");
            page_content.innerHeight(main_content.height() - titleBar.outerHeight(true));
        },
        /*
         *@method public setURL
         *@description  打开页面上的连接入口
         *@param{string}openmode 打开URL的方式 1为弹出窗口，2为单页（未实现）,其他为多页签或iframe
         *@param{string}url 链接地址
         *@param{string}name 页签部分标题     
         */ 
        setURL:function(openmode, url, name) {            
            if (name) {
                $("ul.breadcrumb").find("li.active").remove();
                $("ul.breadcrumb").append("<li class='active'><a href=\"#\" >" + name + "</a></li>");
            }
            if (url && url != "") {
                if (openmode == "1") {//弹出窗口模式
                        var w = new UCML.OpenShowWindow({                              
                            frameMode: "frame", maximizable: true,
                            collapsible: true, scroll: "yes", draggable: true,
                            resizable: true, URL: url, 
                             alignWidth: true, alignHeight: true, title: name
                        });
                        w.open();
                } else if (openmode == "2") {//内页page模式
                    $.ajax({
                        type: "post",
                        dataType: "text",
                        url: url,
                        data: {},
                        success: function (text) {
                            if ($("#mainIframe")[0].src != "") {//先去掉iframe的内容
                                $("#mainIframe")[0].src = "";
                                $("#mainIframe").hide();
                            }
                            $("#mainPage").html(text);
                        }, error: function () {

                        }
                    });
                } else {//iframe模式
                    if(!this.isTab){
                        this.singleTabOpenframe(url);
                    }else{
                        this.moreTabOpenframe(url,name);
                    }
                }
            }
            this.hideDropDown();
        },
         /*
         *@method public hideDropDown
         *@description  隐藏查询栏的下拉部分和焦点离开
         *
        */  
        hideDropDown:function(){
            $("#search-menulist").hide();
            $("#searchText").blur();
        },
        /*
         *@method public jsEncode
         *@description  js编码，将单引号或双引号做处理         
        */  
        jsEncode:function(str){
            var s = "";
            if (str.length == 0) return "";          
            s = str.replace(/'/g, "\\'");
            s = s.replace(/"/g, '\\"');
            return s;           
        },
        /*
         *@method public searchlist
         *@description  通过查询栏查询输入后，得到查询下拉         
        */ 
        searchlist:function() {
            var search_dpMenu = $("#search-menulist");
            var textvalue = $("#searchText").val();
            if (textvalue == "") {
                search_dpMenu.hide();
                return;
            }
            var leftNav = $("#leftNavMenu");
            var lis = leftNav.find("a[targetlink][mtitle*='" + this.jsEncode( textvalue) + "']");
            search_dpMenu.show();
            var items = [];
            if (lis.length > 0) {
                lis.each(function (index, ctx) {
                   // items[items.length] = "<li><a href=\"#\" onclick=\"setURL('" + $(ctx).attr("openMode") + "','" + $(ctx).attr("targetlink") + "','" + $(ctx).attr("mtitle") + "')\">" + $(ctx).attr("mtitle") + "</a></li>";
                    items[items.length] = '<li><a href="#" targetlink="'+   $(ctx).attr("targetlink")  +'" openmode="' + $(ctx).attr("openMode") + '" mtitle="'+$(ctx).attr("mtitle")+'">' + $(ctx).attr("mtitle") + '</a></li>';
                   // <a href="#" onclick="setURL('0','BusiModelDemo/BusinessUnit/BPO_PO_OderMainEdit719.aspx?BusinessKeyOID=00000000-0000-0000-0000-000000000000','采购单申请单')">采购单申请单</a>
                });
            } else {
                items[items.length] = "<li><a href=\"#\">没有搜索到相关菜单</a></li>";
            }
            search_dpMenu.html(items.join(''));
        },
        /*
         *@method public btnRefresh
         *@description  刷新Iframe中的页面         
        */ 
        btnRefresh:function() {
            var opts = this;
            var mainIframe = window.document.getElementById("mainIframe");
            if (mainIframe&&mainIframe.src) {
                this.start_loading();
                window.document.getElementById("mainIframe").contentWindow.location.reload();                                                   
                $(mainIframe).one('load',function(){ 
                    if(opts.haveTimeLogin){
                        var html =this.contentDocument.body.innerHTML;
                        if(html==='用户未登录'){
                            alert(opts.timeoutmeg);
                            window.location = 'Userlogin.aspx?logout=1';
                        }
                    }                                         
                    opts.remove_loading();                    
                });
            }
        },
        /*
         *@method public singleTabOpenframe
         *@description  单Iframe时打开页面         
        */
        singleTabOpenframe:function(url){          
            var opts = this;
            var mainIframe = window.document.getElementById("mainIframe");            
            if(mainIframe){                
                this.start_loading();
                mainIframe.src = localResourcePath + url;                    
                $(mainIframe).one('load',function(){ 
                    if(opts.haveTimeLogin){
                        var html =this.contentDocument.body.innerHTML;
                        if(html==='用户未登录'){
                            alert(opts.timeoutmeg);
                            window.location = 'Userlogin.aspx?logout=1';
                        }
                    }                                         
                    opts.remove_loading();                    
                });  
            }                                  
        },
        /*
         *@method public moreTabOpenframe
         *@description  多页签时打开页面         
        */
        moreTabOpenframe:function(url,name){
            name =name||'无标题';
            url = this.localResourcePath + url;
            var obj = {url:url,name:name},
                _iframe,n=0,opts=this;  
            try{
                _iframe = $.Home.Content.Tabs.buildTab(obj);
            }catch(e){
                n++;
                this.singleTabOpenframe(url);        
            }
            if(n===0){
                if(typeof _iframe !== 'undefined' && _iframe.attr('src') !==''){
                    this.start_loading();
                    _iframe.one('load',function(){ 
                        if(opts.haveTimeLogin){
                            var html =this.contentDocument.body.innerHTML;
                            if(html==='用户未登录'){
                                alert(opts.timeoutmeg);
                                window.location = 'Userlogin.aspx?logout=1';
                            }
                        }                                         
                        opts.remove_loading();                    
                    });
                }
            }      
        },
        /*
         *@method public start_loading
         *@description  数据加载中提示部分,给单页处理使用        
        */
        start_loading:function(megtxt) {
            var el = $('.home-loading'), 
                content = $('.page-content'),                
                doc = $(document);
            megtxt=megtxt||'正在加载数据......';    
            if(el.length==0){
                  el =$('<div  class="home-loading" style="display: none">'+megtxt+'</div>');
                  content.prepend(el);
            }
            else{
                el.html(megtxt);
            }       
            el.css("top", (doc.height() - el.height()) / 2);
            el.css("left", (doc.width() - el.width()) / 2-54);            
            el.show();
        },
        /*
         *@method public remove_loading
         *@description  移除数据加载提示,给单页处理使用        
        */
        remove_loading:function() {            
            var el = $('.home-loading');
            el.hide();            
        }       
    };    
    $.Home.init(); 
    $.browser={};
    (function(){
        $.browser.msie=false; 
        $.browser.version=0;
        if(navigator.userAgent.match(/MSIE ([0-9]+)./))
            { 
                jQuery.browser.msie=true;
                jQuery.browser.version=RegExp.$1;
            }
        })();
    document.write("<script type='text/javascript' src='" + localResourcePath + "UCML_JS/UCML.Base.js'>" + "<" + "/script>");
    document.write("<script type='text/javascript' src='" + localResourcePath + "UCML_JS/UCML.Common.js'>" + "<" + "/script>");
    document.write("<script type='text/javascript' src='" + localResourcePath + "UCML_JS/UCML.Container.js'>" + "<" + "/script>");
    document.write("<script type='text/javascript' src='" + localResourcePath + "UCML_JS/UCML.Panel.js'>" + "<" + "/script>");
    document.write("<script type='text/javascript' src='" + localResourcePath + "UCML_JS/UCML.Window.js'>" + "<" + "/script>");
    document.write("<script type='text/javascript' src='" + localResourcePath + "UCML_JS/UCML.OpenShowWindow.js'>" + "<" + "/script>");  
    //解决在IE下下拉菜单后,点击Iframe中无法关闭的场景
    //bootstrap中的Dropdown中需要判定'ontouchstart' in document.documentElement，
    //故页面如果无ontouchstart，则添加一个
    (function(){
        if($.Home.isTab && !('ontouchstart' in document.documentElement)){
          document.documentElement.ontouchstart=!![];
        }

    })();




}(window, document, jQuery))