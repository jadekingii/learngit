<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Home.aspx.cs" Inherits="UCML.U7.Home"
    EnableViewState="false" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
    <meta charset="utf-8" />
    <title>UCML应用框架平台系统</title>
    <meta name="description" content="overview &amp; stats" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />

    <script type="text/javascript">   var localResourcePath = "../../";</script>
    <link rel="stylesheet" href="css/Home.Content.Tabs.css" /> 
       

<style>
html{position:static;}
</style>
</head>
<body class="no-skin"  style="overflow:hidden;">
    <div id="navbar" class="navbar navbar-default navbar-fixed-top">
			<script type="text/javascript">
			    try { ace.settings.check('navbar', 'fixed') } catch (e) { }
			</script>
			<div class="navbar-container" id="navbar-container">
				<button type="button" class="navbar-toggle menu-toggler pull-left" id="menu-toggler" data-target="#sidebar">
					<span class="sr-only">Toggle sidebar</span>
					<span class="icon-bar"></span>
					<span class="icon-bar"></span>
					<span class="icon-bar"></span>
				</button>

				<div class="navbar-header pull-left">
                    <div class="ucml-top-logo" ></div>
				</div>

				<div class="navbar-buttons navbar-header pull-right" role="navigation">
					<ul class="nav ace-nav">
						<li class="grey1 navbar-item" title="我的门户">
							<a data-toggle="dropdown" class="dropdown-toggle" href="#">
								<i class="ace-icon fa fa-tasks1 item-gateway"></i>
								<span><asp:Literal ID="portalListCount" runat="server"></asp:Literal></span>
							</a>

							<ul class="dropdown-menu-right dropdown-navbar dropdown-menu dropdown-caret dropdown-close dropdown-portal">
                                <asp:Literal ID="portalList" runat="server"></asp:Literal>
							</ul>
						</li>

						<li class="purple1 navbar-item" title="我的待办">
							<a data-toggle="dropdown" class="dropdown-toggle bpo-tasktick" href="#">
                                <i class="ace-icon fa fa-bell1 item-todo"></i>
								<span><asp:Literal ID="taskTicketListCount" runat="server"></asp:Literal></span>
							</a>
						</li>

						<li class="green1 navbar-item" title="我的消息">
							<a data-toggle="dropdown" class="dropdown-toggle bpo-message" href="#">
                                <i class="ace-icon fa fa-envelope1 item-message"></i>
								<span><asp:Literal ID="messageListCount" runat="server"></asp:Literal></span>
							</a>
						</li>

						<li class="light-blue1 navbar-item">
							<a data-toggle="dropdown" href="#" class="dropdown-toggle">
                                <asp:Literal ID="ltUserLoginInfoLab" runat="server"></asp:Literal>
								<i class="ace-icon fa fa-caret-down"></i>
							</a>

							<ul class="user-menu dropdown-menu-right dropdown-menu dropdown-yellow dropdown-caret dropdown-close">
								<li><a href="#" class="user-setting"><i class="ace-icon fa fa-cog" style="color:green;"></i>设置</a></li>
								<li><a href="#" class="user-skin"><i class="ace-icon fa fa-windows" style="color:red;"></i>换肤</a></li>
								<!--<li><a href="#" class="user-skin2"><i class="ace-icon fa fa-windows" style="color:red;"></i>换肤2</a></li>-->
								<li><a href="#" class="user-profile"><i class="ace-icon fa fa-user" style="color:blue;"></i>个人信息</a></li>
								<li class="divider"></li>
								<li><a href="#" class="user-logout"><i class="ace-icon fa fa-power-off" style="color:red;"></i>退出</a></li>
							</ul>
						</li>
					</ul>
				</div>
			</div>
		</div>

    <div class="main-container" id="main-container">
            <script type="text/javascript">
			    try { ace.settings.check('main-container', 'fixed') } catch (e) { }
			</script>
			<div id="sidebar" class="sidebar responsive sidebar-fixed">
				<script type="text/javascript">
				    try { ace.settings.check('sidebar', 'fixed') } catch (e) { }
				</script>
                <div class="nav-search" id="nav-search">
                    <span class="input-icon">
                        <input type="text" placeholder="搜索菜单 ..." class="nav-search-input" id="searchText" autocomplete="off" />
                        <i class="ace-icon fa fa-search nav-search-icon"></i>
                    </span>
                    <ul id="search-menulist" class="search-menu dropdown-menu dropdown-caret" style="display:none;top:35px;left:10px;">
                    </ul>
				</div>

                <!--左侧菜单-->
				<ul id="leftNavMenu" class="nav nav-list">
                    <asp:Literal ID="ltTopMenuBar" runat="server"></asp:Literal>
				</ul>

				<div class="sidebar-toggle sidebar-collapse" id="sidebar-collapse">
					<i class="ace-icon fa fa-angle-double-left ep ep-angle-double-left" data-icon1="ace-icon fa fa-angle-double-left" data-icon2="ace-icon fa fa-angle-double-right"></i>
				</div>

				<script type="text/javascript">
				    try { ace.settings.check('sidebar', 'collapsed') } catch (e) { }
				</script>
			</div>

			<div class="main-content">
				<div class="main-content-inner">
					<div class="breadcrumbs breadcrumbs-fixed11" id="breadcrumbs" style="background-color:#fff;">
                        <!--
						<script type="text/javascript">
						    try { ace.settings.check('breadcrumbs', 'fixed') } catch (e) { }
						</script>
                        -->
						<ul class="breadcrumb" style="margin:0;">
							<li>
                                <i class="home-icon ace-icon fa ep"></i>
                                <span>首页：</span>
							</li>
						</ul>
					</div>

					<div class="page-content" style="padding:0px;">
						

                        <iframe id="mainIframe" scrolling="auto" frameborder="0" height="100%" width="100%" src="" ></iframe>
                        <!--<div id="mainPage"></div>-->
					</div>
				</div>
			</div>

		</div>
	<div id="change_skin" style="BACKGROUND-IMAGE: url(images/Skin/2/z.png);background-size: 100% 100%;WIDTH: 300px; HEIGHT: 300px;display:none; position:absolute">
		 <div id="outerDiv" style='display:none'>
            <div id="circleDiv">
            </div>
			<asp:Literal ID="skinBubbleCenter" runat="server"></asp:Literal>
		 </div>
	</div>

      <!--[if !IE]> -->
    <script type="text/javascript">
        window.jQuery || document.write("<script type='text/javascript' src='js/jquery.js'>" + "<" + "/script>");
    </script>
    <!-- <![endif]-->

    <!--[if IE]>
    <script type="text/javascript">
        window.jQuery || document.write("<script type='text/javascript' src='js/jquery1x.js'>"+"<"+"/script>");
    </script>
    <![endif]-->		
 
    <!-- 页面script,多页签的请一定带参数引入 -->	    
	<script type="text/javascript" src="js/Home.js"></script>
	<script type="text/javascript" src="js/Home.Skin.js"></script>   
	<script type="text/javascript" src="js/Home.Include.js"></script>
    <asp:Literal runat="server" ID="Literalportal"></asp:Literal>
</body>
</html>
