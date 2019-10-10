using System;
using System.Collections.Generic;
using System.Web;
using System.Web.UI;
using System.Text;
using System.Xml;
using System.IO;
using System.Web.UI.WebControls;
using System.Web.UI.HtmlControls;
using System.Data;
using System.Linq;
using UCMLCommon;
using UCML.SkinFrame;

namespace UCML.U7
{
    public partial class Home : UCML.Page.HomePage
    {
        protected StringBuilder HTMLText = new StringBuilder();
        public UCMLCommon.ClientUserInfo loginuser;
        public bool ifPortal = true;

        string rootPath = string.Empty;

        protected override void OnInit(EventArgs e)
        {
            LocalResourcePath = "../../";
            ScreenName = "U7Frame";           
            base.OnInit(e);
        }

        protected void Page_Load(object sender, EventArgs e)
        {
            HttpBrowserCapabilities bc = Request.Browser;       
            rootPath = Request.ApplicationPath == "/" ? string.Empty : Request.ApplicationPath;
            if (!IsPostBack)
            {
                Session["SkinName"] = null;
                string UserName = (string)UCMLCommon.Session.Get("UserName");
                ScreenInfo = (UCMLCommon.UCMLScreenInfo)UCMLCommon.CachedClient.Get(UserName + "ScreenInfo");
                loginuser = (UCMLCommon.ClientUserInfo)UCMLCommon.Session.Get(PurviewSystemName + UserName);

                if (this.loginuser == null)
                {
                    Response.Write("<script type=\"text/javascript\">alert('未登录或登录失败,请重新登录'); window.location = 'Userlogin.aspx?logout=1';</script>");
                    return;
                }
                if (this.loginuser.PurviewArray == null || this.loginuser.PurviewArray.Length == 0)
                {
                    Response.Write("<script type=\"text/javascript\">alert('没有任何可操作权限');window.location = 'Userlogin.aspx?logout=1';</script>");
                    return;
                }

                if (ScreenInfo == null || ScreenInfo.BusiPortalInfo == null || ScreenInfo.BusiPortalInfo.Length == 0)
                {
                    Response.Write("<script type=\"text/javascript\">alert('没有任何菜单权限');window.location = 'Userlogin.aspx?logout=1';</script>");
                    return;
                }
                ltUserLoginInfoLab.Text = GetUserLoginInfoLab();//登录人员信息
                //taskTicketList.Text = GetUserTaskTicketInfo();//待办信息获取
                setUserTaskTicketCount();//设置待办消息数量
                setUnreadMessageCount();//设置未读消息数量
                //BindMenu();      
                BindMenu();
				LoadFrameSkin();
                LoadSkinMenu();
                PrepareMenu(loginuser);

                //GetSysRetrievalTime();//获取系统检索时
		
            }
        }
     

        public void BindMenu()
        {           
            for (int i = 0; i < ScreenInfo.BusiPortalInfo.Length; i++)
            {
                //根级PC端菜单构建过程.
                if (!ScreenInfo.BusiPortalInfo[i].IsUseMobile && !ScreenInfo.BusiPortalInfo[i].IsUseWeiXin && !ScreenInfo.BusiPortalInfo[i].IsUseDingding)
                {
                    UCMLMenuItem[] items = (UCMLMenuItem[])ScreenInfo.BusiPortalInfo[i].MenuItem.ToArray(typeof(UCMLMenuItem));                   

                    if (items.Count(n => n.ParentOID.ToString() == "00000000-0000-0000-0000-000000000000") > 0)
                    {
                        //第一层菜单无连接打开
                        //HTMLText.AppendFormat("<li class='' menuItem='{1}'><a href='#' class='dropdown-toggle'><i class='menu-icon fa fa-list'></i><span class='menu-text'> {0} </span><b class='arrow ep ep-angle-down'></b></a><b class='arrow'></b>", ScreenInfo.BusiPortalInfo[i].BusiName, "MenuLi" + ScreenInfo.BusiPortalInfo[i].MenuItemOID);
                        string htmlTemplet = "<li class='{3}' menuItem='{1}'><a href='#' class='dropdown-toggle'><img class='menu-icon' src='{2}' alt><span class='menu-text'> {0} </span><b class='arrow ep ep-angle-down'></b></a><b class='arrow'></b>";
                        HTMLText.AppendFormat(htmlTemplet, ScreenInfo.BusiPortalInfo[i].BusiName, "MenuLi" + ScreenInfo.BusiPortalInfo[i].MenuItemOID, string.IsNullOrEmpty(ScreenInfo.BusiPortalInfo[i].ImageLink) ? "images/ep_ico3.png" : ScreenInfo.BusiPortalInfo[i].ImageLink, string.Empty);

                        HTMLText.Append( setNodeMenu(items, "00000000-0000-0000-0000-000000000000"));
                        HTMLText.Append("</li>");
                    }
                }
            }

            ltTopMenuBar.Text = HTMLText.ToString();
        }
        public string setNodeMenu(UCMLMenuItem[] items, string POID)
        {
            string haveChildUrl = "<li class=''><a href='#' targetLink='{1}' mtitle='{0}' openMode='{2}' class='dropdown-toggle'><i class='menu-icon fa fa-caret-right' ></i>{0}<b class='arrow ep ep-angle-down'></b></a><b class='arrow'></b>";
            string haveChildNoUrl = "<li class=''><a href='#'  class='dropdown-toggle'><i class='menu-icon fa fa-caret-right' ></i>{0}<b class='arrow ep ep-angle-down'></b></a><b class='arrow'></b>";
            string noChild = "<li class='' ><a href='#' targetLink='{1}' mtitle='{0}' openMode='{2}' ><i class=\"menu-icon ep ep-caret-right\" ></i>{0}</a><b class='arrow'></b></li>";
            StringBuilder html = new StringBuilder();
            var a = items.Where(n => n.ParentOID.ToString().ToLower() == POID.ToLower()).ToList();
            if (a.Count > 0)
            {
                html.Append("<ul class='submenu'>");
                foreach (var b in a)
                {
                    if (b.IsUseWeiXin == false && b.IsUseMobile == false && b.IsUseDingding==false)
                    {
                         string url = createUrl(b);
                         string imageUrl = string.IsNullOrEmpty(b.ImageLink) ? "images/ep_ico3.png" : b.ImageLink;
                         int openmodel = b.OpenMode;
                         if (items.Count(n => n.ParentOID.ToString().ToLower() == b.OID.ToString().ToLower()) > 0)
                         {
                             if (string.IsNullOrEmpty(url) == false)
                             {
                                 html.AppendFormat(haveChildUrl, b.BPOName, url, openmodel.ToString());
                             }
                             else
                             {
                                 html.AppendFormat(haveChildNoUrl, b.BPOName);
                             }
                             html.Append(setNodeMenu(items, b.OID.ToString()));
                             html.Append("</li>");
                         }
                         else
                         {                    
                            //不要前端的符号                           
                             html.AppendFormat(noChild, b.BPOName, url, openmodel.ToString());
                         }
                    }

                }
                html.Append("</ul>");
            }
            return html.ToString();
        }
     
        private string createUrl(UCMLMenuItem item )
        {
            string url = string.Empty;
            switch (item.LinkBusiType)
            {
                case 0:
                    if (!string.IsNullOrEmpty(item.BPOID))
                    {
                        if (item.OpenMode == 2)//MVC单页模式
                        {
                            url = item.PageLinkUrl;
                        }
                        else
                        {
                            url = string.IsNullOrEmpty(item.LocalPath) ? item.BPOID : item.LocalPath + "/" + item.BPOID;
                            url = string.IsNullOrEmpty(item.Param) ? url + ".aspx" : url + ".aspx?" + item.Param;
                        }
                    }
                    break;
                case 3://远程html页面
                    if (!string.IsNullOrEmpty(item.BPOID))
                    {
                        url = string.IsNullOrEmpty(item.LocalPath) ? item.BPOID : item.LocalPath + "/" + item.BPOID;
                        url = string.IsNullOrEmpty(item.Param) ? url + ".HTML" : url + ".HTML?" + item.Param;
                    }
                    break;
                case 1://网页链接                 
                    url = string.IsNullOrEmpty(item.Param) ? item.PageLinkUrl : item.PageLinkUrl + "?" + item.Param; 
                    break;
                default:

                    if (item.PageLinkUrl.IndexOf("www") != -1 || item.PageLinkUrl.IndexOf(@"http://") != -1)
                    {
                        url = string.IsNullOrEmpty(item.Param) ? item.PageLinkUrl : item.PageLinkUrl + "?" + item.Param;
                    }
                    else
                    {
                        url = string.IsNullOrEmpty(item.Param) ? rootPath + item.PageLinkUrl : rootPath + item.PageLinkUrl + "?" + item.Param;

                    }
                    break;
            }
            return url;
        }

        private void LoadSkinMenu()
        {
            SkinConfigMonitor watcher = (SkinConfigMonitor)Application["SkinWatcher"];
            Skin[] skins = watcher.CurrentScreen.Skins;

            System.Text.StringBuilder sb = new System.Text.StringBuilder();
            string format = "<div class=\"Image-skins\"><img style=\"WIDTH: 100%; HEIGHT: 100%\" skinType=\"{1}\"  src=\"{0}\" /></div>";
            foreach (Skin s in skins)
            {
                sb.Append(string.Format(format,s.Icon,s.Name));
            }            
            skinBubbleCenter.Text = sb.ToString();
        } 

       
     

  #region 登录人等信息处理

        /// <summary>
        /// 门户信息处理
        /// </summary>
        /// <param name="loginuser"></param>
        public void PrepareMenu(UCMLCommon.ClientUserInfo loginuser)
        {

            string portalURL = string.Empty;           
            SysDBModel.UCML_WebPage objt = new SysDBModel.UCML_WebPage();
            System.Text.StringBuilder portalListStr = new System.Text.StringBuilder();
            DataTable entChildMenu = UCMLCommon.UCMLUtilityFunc.GetPersonAllPortal();
            string portalFormat = "<li><a href=\"#\"  targetLink=\"{1}\" mtitle=\"{0}\"><span>{0}</span></a></li>";
            var portalCount = entChildMenu.Rows.Count;
            if (portalCount > 0)
            {
                portalListStr.Append("<li class=\"dropdown-header\"><i class=\"ace-icon fa\"></i>您有" + portalCount + "个门户!</li>");
                portalListStr.Append("<li class=\"dropdown-content\"><ul class=\"dropdown-menu dropdown-navbar\">");
                for (int i = 0; i < entChildMenu.Rows.Count; i++)
                {
                    portalURL = "BPO_AppletContainer.aspx?pageID=" + entChildMenu.Rows[i]["ID"].ToString();
                    portalListStr.AppendFormat(portalFormat, entChildMenu.Rows[i]["Name"].ToString(), portalURL);
                }
                portalListStr.Append("</ul></li>");
            }
            else
            {
                portalListStr.Append("<li class=\"dropdown-header\"><i class=\"ace-icon fa\"></i>您没有门户!</li>");
            }
            //portalListStr.Append("</ul>");
            //this.Literalportal.Text = "<script  type=\"text/javascript\">" + sb.ToString() + " </script> ";
            this.portalListCount.Text = portalCount.ToString();
            this.portalList.Text = portalListStr.ToString();
        }
        //设置待办消息数量
        public void setUserTaskTicketCount()
        {
            SysDBModel.AssignTask at = new SysDBModel.AssignTask();
            string sqlstr = "SELECT COUNT(1) from AssignTask ";
            sqlstr += "where AssignTask.resolutionCode = 0 ";
            if (loginuser.UserOID.ToString() != "00000000-0000-0000-0000-000000000001")
                sqlstr += "and (AssignTask.SYS_CreatedBy='" + loginuser.UserOID.ToString() + "' or AssignTask.UCML_TaskReplacer= '" + loginuser.UserOID.ToString() + "')";
            //sqlstr += " ORDER BY AssignTask.SYS_Created DESC";

            object objNum = at.ExecuteScalar(sqlstr);
            this.taskTicketListCount.Text = (Convert.ToInt32(objNum)).ToString();
        }

        //设置未读消息数量
        public void setUnreadMessageCount()
        {
            DBLayer.view_OAUserMessage_Manage obj = new DBLayer.view_OAUserMessage_Manage();
            string sqlstr = "select count(1) from view_OAUserMessage_Manage where view_OAUserMessage_Manage.HasRead = 0 and view_OAUserMessage_Manage.ReceiverOID='" + loginuser.UserOID.ToString() + "'";
            object objNum = obj.ExecuteScalar(sqlstr);
            this.messageListCount.Text = (Convert.ToInt32(objNum)).ToString();
        }

        /// <summary>
        /// 登录人员信息
        /// </summary>
        /// <param name="LoginUser"></param>
        public string GetUserLoginInfoLab()
        {

            string labStr = string.Empty;
            if (this.loginuser == null)
            {
                return labStr;
            }
            //头像，添加逻辑判断
            SysDBModel.UCML_User user = new SysDBModel.UCML_User();
            SysDBModel.UCML_CONTACT contact = new SysDBModel.UCML_CONTACT();
            SysDBModel.UCML_CONTACTInfo contactInfo = new SysDBModel.UCML_CONTACTInfo();
            contactInfo.UCML_CONTACTOID = user.GetFieldValue("UCML_CONTACTOID", loginuser.UserOID);
            contact.Load(contactInfo);
            if (contactInfo.Photo != null && contactInfo.Photo.Length > 0)
            {
                labStr += "<img class=\"nav-user-photo\" src=\"data:image/png;base64," + Convert.ToBase64String(contactInfo.Photo) + "\" />";
            }
            else
            {
                labStr += "<img class=\"nav-user-photo\" src=\"images/avatars/avatar2.png\" />";
            }
            labStr += "<span class=\"user-info\">您好,";

            if (loginuser.PersonName == "")
            {
                if (loginuser.PostnName == null)
                {
                    loginuser.PostnName = "";
                }

                labStr += loginuser.PostnName + " " + loginuser.UserID;
            }
            else
            {
                labStr += loginuser.PostnName + " " + loginuser.PersonName;
            }
            labStr += "</span>";
            return labStr;
        }

#endregion

  
       
        public virtual void GetSysRetrievalTime()
        {
            DataTable dt = null;
            string sql = "select NewMessageRetrievalTime,SysOnlineUserRetrievalTime from CMS_MessageSetTime ";
            SysDBModel.CMS_MessageSetTime cmstobj = new SysDBModel.CMS_MessageSetTime();//获取系统检索时间
            dt = cmstobj.ExecuteQuery(sql);
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                this.NMRT.Value = dt.Rows[i]["NewMessageRetrievalTime"].ToString();
                this.SOURT.Value = dt.Rows[i]["SysOnlineUserRetrievalTime"].ToString();
            }
            if (this.NMRT.Value == "") this.NMRT.Value = "5";
            if (this.SOURT.Value == "") this.SOURT.Value = "5";
        }

   
    }


    



    
}
