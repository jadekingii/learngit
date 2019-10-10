
/**
* @file Home.Content.Tabs.js
* @description 前端多页签处理
* @company UCML
* @author sunyi
* @version 1.0
* @date 2018.09.22
*/

(function(window,document,$){
	'use strict';
	$.Home=$.Home||{};	
    $.Home.Content=$.Home.Content||{};
	$.Home.Content.Tabs={
		//内容区(div)
		$content: $('.page-content'),
		//页签整体区(div)
		$main_content_tabs:$(".main-content-tabs"),        
		//页签和iframe的标签序号记号
		tabId:0,	
		//删除后查找补齐的个数
		supplyNum:3,
        //开启的最大页签菜单数量
        tabLimit:15,
        //超过最大菜单数量后的方式  auto:自动删除最早的,warning:警告，弹出提示，不做任何处理
        exceedLimit:'auto',
		/*
		 *@method public Init
		 *@description  初始化函数
		 *用户部分全局参数初始化及绑定事件处理
		*/	
		Init:function(){
            //自动判断是否需要替换           
            this.tab_ul = this.$main_content_tabs.find('ul.con-tabs');  
            //下拉菜单区的ul,包含固定的两个菜单
            this.user_menu = this.$main_content_tabs.find('ul.user-menu');

            if(this.tab_ul.size()<=0||this.user_menu.size()<=0){
                this.reformHtml();
                this.$main_content_tabs = $(".main-content-tabs");
                this.$content =  $('.page-content');
                //页签区UL           
                this.tab_ul = this.$main_content_tabs.find('ul.con-tabs');  
                //下拉菜单区的ul,包含固定的两个菜单
                this.user_menu = this.$main_content_tabs.find('ul.user-menu');
            }
				
			//页签区的最大宽度，当发生页面onsize时，值应该发生变化，此版本未实现		
			this.contabs_scroll_width = this.$main_content_tabs.find('.contabs-scroll').width();
			this.bind();            
		},
		/*
		 *@method public bind
		 *@description  事件绑定处理
		 *用户部分全局参数初始化及绑定事件处理
		*/	
		bind:function(){
			var opts=this;
			this.$main_content_tabs.on('click.tab', 'ul.con-tabs>li',function(e){//tab菜单点击事件及关闭事件
				var _tag = $(e.target),
                    el = $(this);
                if (_tag.is('i.ace-icon')) {
                    opts.closeTab(el);
                } else if (!el.is('.active')) {                    
                    opts.checkTab(el);                  
                }
                e.preventDefault();
			}).on('click.reload', '.pull-right li.reload-page', function() { //刷新按钮事件
                var _link = opts.tab_ul.find('li.active>a'),
                    _href = _link.attr('href');
                opts.$content.children('[src="' + _href + '"]').attr('src', _href);
            }).on('click.close.all', '.pull-right li.close-all', function(){ //关闭所有按钮事件
            	opts.closeAllTab();
            }).on('click.menu.page', '.pull-right li.menu-page', function(e){ //下拉菜单事件
            	var _tag = $(e.target),
                    el = $(this);
                if (_tag.is('i.fa-close')) {                	
                    opts.closeTab(el);
                } else {   
                	opts.checkTab(el);     
                }
                e.preventDefault();
            })
		},
		/*
		 *@method private _buildTab
		 *@description  创建页签部分的li
		 *@param{string}url 链接地址
		 *@param{string}name 页签部分标题
		 *@param{string}iframeID 页签的标识，将存放在target属性中
		 *@param{object||null}el 页签的ul部分，
		 *@param{boolean||null}append 任意值，存在值则插入到ul的尾部，否则插入到ul的头部
		 *@return {object} li的jquery对象
		*/
		_buildTab:function(url,name,iframeID,el,append){
        	var li;
        	el=el||this.tab_ul;        	
        	li=$('<li ><a href="' + url + '" target="' + iframeID + '" title="' + name + '' + '" rel="contents"><span>' + name + '</span><i class="ace-icon fa fa-close">' + '</i></a></li>');
        	if(append){
        		el.append(li);
        	}
        	else{
        		el.prepend(li);
        	}        	
        	return li;
        },      
        /*
		 *@method private _buildIframe
		 *@description  创建iframe部分
		 *@param{string}url 链接地址		 
		 *@param{string}iframeID 页签的标识，将存放在name属性中	
		*/
        _buildIframe: function(url,iframeID) {
            var _content = this.$content,
                iframeID=iframeID|| 'iframe-' + this.tabId;              
            _content.children('.active').removeClass('active');
            _content.append('<iframe src="' + url + '" frameborder="0" name="' + iframeID + '" class="page-frame animation-fade active"></iframe>');
           
        },
         /*
		 *@method private _buildMenu
		 *@description  创建下拉菜单部分
		 *@param{string}url 链接地址		 
		 *@param{string}name 标题
		 *@param{string}iframeID 页签的标识，将存放在name属性中	
		*/
        _buildMenu:function(url,name,iframeID){
        	var _menu = this.user_menu,
        		iframeID = iframeID||'iframe-' + this.tabId; 
        	_menu.append('<li class="menu-page" role="presentation"><a href="javascript:;" role="menuitem" target="'+iframeID+'" title="'+name+'" targetLink="'+url+'"><i class="ace-icon fa fa-list-ul"></i>'+name+'<i class="ace-icon fa fa-close"></i></a></li>');
        }, 
        /*
		 *@method public tabSize
		 *@description  计算ul的长度，当ul的长度超过一定长度后，删除ul中的最后一个li，递归计算		
		*/       
        tabSize: function() {
        	//根据li计算UI的宽度
            var _width=0,
            	_contabs_scroll_width = this.contabs_scroll_width;            	
            this.tab_ul.find('li').each(function(){
            	_width += $(this).outerWidth(true);
            });            
            //this.tab_ul.css('width', _width);
        	//计算后删除超过宽度的li
            if (_width > _contabs_scroll_width) {
            	this.tab_ul.find('li').last().remove();
            	this.tabSize();            	
            }            
        },
         /*
		 *@method public buildTab
		 *@description  核心功能，创建页签，外部主要调用此方法
		 *@param{object}e  结构为：{url:url,name:name};创建的连接和标题	 
		*/
        buildTab: function(e) {
            var _iframeID, _tabid, 
            	_url = e.url,_num,menu_lis,
                _li,maosite = _url.indexOf('#'),
                url = maosite > 0 ? _url.substring(0, maosite) : _url;
                e.name = e.name === '' ? '无标题' : e.name;
            //判定此链接是否在菜单中存在，如果已经存在，则直接显示不做创建行为    
            if (this._checkmenuByurl(url)) {
                return;
            }
            //在此判定是否超限，如果超限，首先处理超限问题
            menu_lis = this.user_menu.children('li.menu-page');
            _num = menu_lis.size();
            this.exceedLimit = this.exceedLimit || 'auto';
            if(_num + 1 > this.tabLimit){
                if(this.exceedLimit==='auto'){
                    //首先删除菜单
                    this.closeTab(menu_lis.first());
                }else{
                    //弹出提示，阻止添加
                    var __meg ='为保证系统效率,只允许同时运行'+this.tabLimit+'个功能窗口,请关闭一些窗口后重试！';
                    alert(__meg);
                    return;
                }
            }

            //创建新的页签页和下拉菜单
            _tabid = ++this.tabId;
            _iframeID = 'iframe-' + _tabid;
            this.tab_ul.find('li.active').removeClass('active');   
            //创建页签        
            _li=this._buildTab(url,e.name,_iframeID);
            _li.addClass('active'); 
            //创建下拉菜单
            this._buildMenu(_url,e.name,_iframeID);
            //创建内容
            this._buildIframe(_url,_iframeID);
            this.tabSize();
        },

        /*
		 *@method private _checkmenuByurl
		 *@description  通过URL链接选择下拉菜单并激活页签
		 *@param{string}url  链接地址
		 *@return {boolean} 是否可以正常激活	 
		*/
        _checkmenuByurl:function(url){
        	var li=this.user_menu.find('a[targetLink="' + url + '"]').closest('li'),
        		link,contabs_li,_iframeID,_name;
        	//下拉菜单中未找到返回false	
        	if(li.size()<=0){
        		return  ![];
        	}	
        	//下拉菜单中找到了，则查找页签中是否存在
        	link = li.children('a');
        	_iframeID=link.attr('target');
        	_name =link.attr('title');
        	contabs_li = this.tab_ul.find('a[target="' + _iframeID + '"]').closest('li');
        	//页签中存在，则激活它
        	if(contabs_li.size()>0){
        		//已经是被激活状态，返回true
        		if (contabs_li.hasClass('active')) {
                	return !![];
            	}else{
            		//没有激活，则激活它
            		this.tab_ul.find('li.active').removeClass('active');
            		contabs_li.addClass('active');
            		this._checkoutTab(contabs_li.find('a'));
            		return !![];
            	}
        	}
        	//页签中不存在,则创建页签
        	contabs_li = this._buildTab(url,_name,_iframeID);
        	//并重新调整菜单中的项的位置
        	li.remove();
        	this._buildMenu(url,_name,_iframeID);
        	this.tabSize();
        	return !![];
        },
        /*
		 *@method public closeTab
		 *@description  选择菜单或页签
		 *@param{object||null}e  jquery对象，
		 *				页签上需要选中的li对象或菜单上需要选中的li对象
		 *				为空时为页签上的激活li		
		*/
        checkTab:function(e){
        	var el = e || this.tab_ul.find('li.active'),
        		_tag,contabs_li,menu_li,link,_iframeID,_name,_url;
        	_tag = el.children('a').attr('target');
        	if(el.hasClass('active')){
        		this._checkoutTab(el.find('a'));
        		return;
        	}
        	if(el.hasClass('menu-page')){//为菜单li
        		menu_li = el;        		
        		contabs_li = this.tab_ul.find('a[target="' + _tag + '"]').closest('li');
        	}else{ //页签li
        		menu_li = this.user_menu.find('a[target="' + _tag + '"]').closest('li');
        		contabs_li = el;
        	}
        	if(contabs_li.size()>0){
        		this.tab_ul.find('li.active').removeClass('active');
            	contabs_li.addClass('active');
            	this._checkoutTab(contabs_li.find('a'));
            	return;
        	}
        	//页签中不存在,则创建页签
        	link = menu_li.children('a');
        	_iframeID=link.attr('target');
        	_name =link.attr('title');
        	_url = link.attr('targetLink');
        	contabs_li = this._buildTab(_url,_name,_iframeID);
        	//并激活
        	this.tab_ul.find('li.active').removeClass('active');
            contabs_li.addClass('active');
            this._checkoutTab(contabs_li.find('a'));
        	//并重新调整菜单中的项的位置
        	menu_li.remove();
        	this._buildMenu(_url,_name,_iframeID);
        	this.tabSize();
        },
        /*
		 *@method private _checkoutTab
		 *@description  通过页签显示对应的iframe页面，并打开其连接
		 *@param{object}link  jquery对象，页签上需要激活的a标签jquery对象		  
		*/
        _checkoutTab: function(link) { 
            var con = this.$content,
                _tag = link.attr('target'),                
                _url = link.attr('href'),
                _iframe = con.children('iframe[name="' + _tag + '"]');           
            if (!_iframe.attr('src')) {
                _iframe.attr('src', _url);
            }
            con.children('.active').removeClass('active');
            _iframe.addClass('active');           
        },
        /*
		 *@method public closeTab
		 *@description  关闭菜单和页签
		 *@param{object||null}e  jquery对象，
		 *				页签上需要关闭的li对象或菜单上需要关闭的li对象
		 *				为空时为页签上的激活li		
		*/
        closeTab: function(e) {
        	var el = e || this.tab_ul.find('li.active'),
        		_tag,contabs_li,menu_li,_activeli,_nextli,
        		n=0,menu_lis,contabs_lis;
        	_tag = el.children('a').attr('target');
        	if(el.hasClass('menu-page')){
        		//为菜单li
        		menu_li = el;        		
        		contabs_li = this.tab_ul.find('a[target="' + _tag + '"]').closest('li');
        	}else{ //页签li
        		menu_li = this.user_menu.find('a[target="' + _tag + '"]').closest('li');
        		contabs_li = el;
        	}
        	//如果页签有并且是被激活状态，则先激活下一个节点
        	if(contabs_li.size() > 0 ){
        	 	if(contabs_li.is('.active')){
	        		_nextli = contabs_li.next('li');
	        		if (_nextli.size() > 0) {
	                    _activeli = _nextli;
	                } else {
	                    _activeli = contabs_li.prev('li');
	                }
                    if(_activeli.size() > 0) {
                        _activeli.addClass('active');      
                        this._checkoutTab(_activeli.find('a'));
                    }	               
	            }
	            //移除页签项
	            contabs_li.remove();	            
        	}
        	//移除iframe
        	this.$content.children('iframe[name="' + _tag + '"]').remove();
        	//移除菜单项目
        	menu_li.remove();

        	//从菜单中取项补齐页签,菜单项反向循环查找....................................
        	menu_lis = this.user_menu.children('li.menu-page');
        	contabs_lis = this.tab_ul.children('li');        	
        	for(var i = menu_lis.size() - 1; i >= 0; i--){
        		if(n>this.supplyNum-1)	break;
        		var __link= menu_lis.eq(i).children('a'),
        			__tag = __link.attr('target'),
        			__url,__name;
        		if(contabs_lis.find('a[target="' + __tag + '"]').size()<=0){
        			__url = __link.attr('targetLink');
        			__name = __link.attr('title');
        			this._buildTab(__url,__name,__tag,this.tab_ul,'append');
        			n++;
        		}
        	}
        	this.tabSize();
        },
        /*
		 *@method public closeAllTab
		 *@description  关闭所有菜单和页签
		*/
        closeAllTab: function() {  
        	var lis=this.user_menu.children('li.menu-page');
        	lis.each(function(){
        		$(this).remove();
        	});
        	this.tab_ul.children().remove();                                    
            this.$content.children().remove();
            this.tabSize();           
        },
        /*
         *@method public closeAllTab
         *@description  关闭所有菜单和页签
        */
        reformHtml:function(){           

            var a = $('.main-content>.main-content-inner');
            a.empty();
            var b=$('<div class="main-content-tabs"></div>');
            a.append(b);
            var c =$('<div class="page-content" style="padding:0px;"></div>');
            a.append(c);

            var html1=$('<div class="contabs-scroll pull-left"><ul class="nav  con-tabs"></ul></div>');
            var html2=$( '<div class="btn-group pull-right"> '
                        +'  <button type="button" class="notAcebtn dropdown-toggle btn-outline " data-toggle="dropdown" aria-expanded="false"> '
                        +'       <i class="ace-icon fa fa-angle-double-down" aria-hidden="true"></i>   '
                        +'    </button>  '
                       // +'    <div class="right-space"></div> '
                        +'    <!--下拉菜单区--> '
                        +'    <ul class="user-menu dropdown-menu-right dropdown-menu  dropdown-caret dropdown-close" aria-labelledby="conTabsDropdown" role="menu"> '
                        +'        <li class="reload-page" role="presentation"> '
                        +'            <a href="javascript:;" role="menuitem"><i class="ace-icon fa fa-refresh"></i> 刷新当前</a> '
                        +'        </li>                              '
                        +'        <li class="close-all" role="presentation">'
                        +'            <a href="javascript:;" role="menuitem"><i class="ace-icon fa fa-power-off "></i> 关闭所有</a>'
                        +'        </li>'
                        +'    </ul>'
                        +'</div> ');
            b.append(html1);
            b.append(html2);
            $(window).resize();
        }		
	};
	$.Home.Content.Tabs.Init();

}(window, document, jQuery))