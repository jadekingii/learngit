using System;
using System.Collections.Generic;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using UCML.SkinFrame;
using UCMLCommon;

namespace UCML.U7
{
    public partial class UserLogin : UCMLCommon.UserLoginPage
    {

        public override void InitControls()
        {
            base.InitControls();

            if (UCMLCommon.UCMLInitEnv.fMutiLangugeSupport == true)
            {
                language.Visible = true;

                HttpCookie Language = Request.Cookies.Get("ucml_Language");
                if (Language != null && Language.Value != null && Language.Value != "")
                {
                    hidfLanguage.Value = Language.Value;
                }
                else
                {
                    hidfLanguage.Value = "1";
                }
            }
        }

        protected override void OnInit(EventArgs e)
        {
            ScreenName = "U7Frame"; 
            base.OnInit(e);
            InitControls();
            
        }

        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                string logout = this.Request.QueryString["logout"];
                if (logout == "true" || logout == "1")
                {
                    UserLoginService busiObj = new UserLoginService();
                    busiObj.Logout();
                    busiObj.ClearCacheUser();
                }
            }
        }

        protected void btnLogin_Click(object sender, EventArgs e)
        {
            UCMLCommon.UserLoginService uls = new UCMLCommon.UserLoginService();

            if (UCMLCommon.UCMLInitEnv.fMutiLangugeSupport == true)
            {
                uls.langugeKind = hidfLanguage.Value;
                HttpCookie Language = Request.Cookies.Get("ucml_Language");
                if (Language != null)
                {

                    Language = new HttpCookie("ucml_Language");
                    Language.Expires = DateTime.Now.AddYears(10);
                    Language.Value = hidfLanguage.Value;
                    //    Response.Cookies.Set(Language);
                    Response.Cookies.Remove("ucml_Language");
                    Response.Cookies.Add(Language);
                }
                else
                {
                    Language = new HttpCookie("ucml_Language");
                    Language.Value = hidfLanguage.Value;
                    Language.Expires = DateTime.Now.AddYears(10);
                    Response.Cookies.Add(Language);
                }
            }

            if (string.IsNullOrEmpty(txtUserName.Text.Trim()))
            {
                this.Page.ClientScript.RegisterStartupScript(this.Page.GetType(), "password", "<script type=\"text/javascript\">alert('用户名不能为空111111，请输入用户名');</script>");
                return;
            }

            try
            {
                //验证用户是否登录
                if (uls.userLogin(txtUserName.Text.Trim(), txtPassword.Text.Trim()).Split(',')[0] == "1")
                {
/*
                    //登录用户对象
                    UCML.SSO.IUser user = new UCML.SSO.User();
                    //登录用户名
                    user.UserId = txtUserName.Text.Trim();
                    //登录密码
                    user.Pwd = txtPassword.Text.Trim();

                    //在单点系统中保存用户登录票据
                    server.SaveToken(user);
                    //跳转到登录的站点系统主页
                    server.Reply(user.UserId, defaultJumpUrl);
                    */
                    //在单点系统中保存用户登录票据
                        Response.Redirect("Home.aspx");
                }
                else
                {
                    this.Page.ClientScript.RegisterStartupScript(this.Page.GetType(), "password", "<script type=\"text/javascript\">alert('用户名不存在或密码错误111111,请重新登录');</script>");
                }
            }
            catch (Exception ex)
            {
                Response.Write("<script type=\"text/javascript\">alert('登录失败111111:" + ex.Message + "');</script>");
            }
        }

    }
}
