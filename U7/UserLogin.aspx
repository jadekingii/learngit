<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="UserLogin.aspx.cs" Inherits="UCML.U7.UserLogin" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
    <meta charset="utf-8" />
    <title>UCML应用框架框架平台</title>

    <meta name="description" content="User login page" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
    <script type="text/javascript" src="assets/js/jquery.js"></script> 
    <link rel="stylesheet" type="text/css" href="css/login.css" />    
    <style>
        .item.language-item {
            text-align:right;
            padding-right:50px;
        }
        .item.language-item a {
            padding: 5px;
            background-color: #d6d6d6;
        }
        .item.language-item a.active {
            background-color:#337bc3;
            color:#fff;
        }
    </style>
</head>

<body>


    <div id="wrap">

        <div id="header">
            <div class="topbox">
                <div class="logo">
                    <img src="images/login/logo.png" /></div>
            </div>
        </div>

        <div id="mainer">

            <div class="login_main">

                <div class="login_img">
                    <img src="images/login/img.png" /></div>
                <div class="login_box">
                    <div class="login_tit">UCML应用框架平台登录</div>
                    <form id="form1" runat="server">

                        <div class="item">
                            <!--<input name="userName" type="text" class="input input1" placeholder="账号" />-->
                            <asp:TextBox ID="txtUserName" class="input input1" placeholder="账号" runat="server" Text=""></asp:TextBox>
                            <i class="input-username"></i>
                        </div>
                        <div class="item item2">
                            <!--<input name="password" type="password" class="input input2" placeholder="密码" />-->
                            <asp:TextBox ID="txtPassword" class="input input2" placeholder="密码" runat="server" TextMode="Password" Text=""></asp:TextBox>
                            <i class="input-password"></i>
                        </div>

                        <div class="item language-item">
                            <span id="language" class="language" runat="server" visible="false">
                                <a href="javascript:;" value="1" class="active">简体</a>
                                <a href="javascript:;" value="2">繁体</a>
                                <a href="javascript:;" value="3">English</a>
                            </span>
                            <asp:HiddenField ID="hidfLanguage" runat="server" Value="1" />
                            <asp:HiddenField ID="hidPost" runat="server" Value="-1" />
                        </div>

                        <!--<div class="item2"><label class="on"><input type="checkbox" class="checkbox" checked="checked" />记住登录状态</label></div>-->
                        <div class="item">
                            <!--<input name="submit" type="submit" value="登 录" class="btn" />-->
                            <asp:Button ID="btnLogin" runat="server" Text="登录" class="btn" OnClick="btnLogin_Click" />
                        </div>


                    </form>
                    <script type="text/javascript">
                        $(function () {
                            var languageKind = $("#hidfLanguage").val();
                            $("#language a").removeClass("active").filter("[value='" + languageKind + "']").addClass("active");
                        });
                        $("#language a").click(function () {
                            if ($(this).hasClass("active")) return;
                            $("#language a.active").removeClass("active");
                            $(this).addClass("active");
                            $("#hidfLanguage").val($(this).attr("value"));
                        });
                    </script>
                </div>

            </div>

        </div>

        <div id="footer">
            <div class="footbox">金富瑞（北京）科技有限公司 GoldFrame Technologies Co.Ltd.</div>
        </div>

    </div>

    <div id="downloadGCF" style="display:none;padding:50px;">
        	<a id="downloadGCFLink" href="#" style="color:blue;text-decoration:underline;">您使用的浏览器需要下载插件才能使用,点击下载</a>
        	<p>(安装后请重新打开浏览器)</p>
        </div>
    <script type="text/javascript">
        //判断浏览器, 判断GCF
        var browser = {
            isIe: function () {
                return navigator.appVersion.indexOf("MSIE") != -1;
            },
            navigator: navigator.appVersion,
            getVersion: function () {
                var version = 999; // we assume a sane browser
                if (navigator.appVersion.indexOf("MSIE") != -1)
                    // bah, IE again, lets downgrade version number
                    version = parseFloat(navigator.appVersion.split("MSIE")[1]);
                return version;
            }
        };
        function isGCFInstalled() {
            try {
                var i = new ActiveXObject('ChromeTab.ChromeFrame');
                if (i) {
                    return true;
                }
            } catch (e) { }
            return false;
        }
        //判断浏览器, 判断GCF
        var __continueRun = true;
        if (browser.isIe() && (browser.getVersion() < 10) && !isGCFInstalled()) {
            document.getElementById("wrap").style.display = 'none';
            document.getElementById("downloadGCF").style.display = 'block';
            var downloadLink = "../../swf/GoogleChromeframe.msi";
            document.getElementById("downloadGCFLink").href = downloadLink;
            __continueRun = false;
        }
    </script>
</body>
</html>
