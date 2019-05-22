using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApp2.Models;

namespace WebApp2.Controllers
{
    public delegate Task<IActionResult> OrderDelegate(Cart order); //делегат создания нового заказа
    public delegate Task<string> IdDelegate(); //делегат получения id текущего пользователя

    [Produces("application/json")]
    public class AccountController : Controller
    {
        public static event OrderDelegate OrderEvent; //событие создания заказа
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;

        public AccountController(UserManager<User> userManager, SignInManager<User> signInManager)
        {
            CartController.IDEvent += new IdDelegate(GetIdUserAsync);//присоединение метода к событию

            _userManager = userManager;
            _signInManager = signInManager;
        }

        [HttpPost]
        [Route("api/Account/Register")]
        public async Task<IActionResult> Register([FromBody] RegisterViewModel model)
        {
            if (ModelState.IsValid)
            {
                User user = new User { Email = model.Email, UserName = model.Email };
                // Добавление нового пользователя
                var result = await _userManager.CreateAsync(user, model.Password);
                if (result.Succeeded)
                {
                    await _userManager.AddToRoleAsync(user, "user");

                    // установка куки
                    await _signInManager.SignInAsync(user, false);
                    var msg = new
                    {
                        message = "Добавлен новый пользователь: " + user.UserName
                    };
                    return Ok(msg);
                }
                else
                {
                    foreach (var error in result.Errors)
                    {
                        ModelState.AddModelError(string.Empty, error.Description);
                    }
                    var errorMsg = new
                    {
                        message = "Пользователь не добавлен.",
                        error = ModelState.Values.SelectMany(e => e.Errors.Select(er => er.ErrorMessage))
                    };
                    return Ok(errorMsg);
                }
            }
            else
            {
                var errorMsg = new
                {
                    message = "Неверные входные данные.",
                    error = ModelState.Values.SelectMany(e => e.Errors.Select(er => er.ErrorMessage))
                };
                return Ok(errorMsg);
            }
        }

        public string id = "";
        public string role;
        public IList<string> x;
        [HttpPost]
        [Route("api/Account/Login")]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> Login([FromBody] LoginViewModel model)
        {
            if (ModelState.IsValid)
            {
                var result =
                    await _signInManager.PasswordSignInAsync(model.Email, model.Password, model.RememberMe, false);
                if (result.Succeeded)
                {
                    var msg = new
                    {
                        message = "Выполнен вход пользователем: " + model.Email
                    };
                    return Ok(msg);
                }
                else
                {
                    ModelState.AddModelError("", "Неправильный логин и (или) пароль");
                    var errorMsg = new
                    {
                        message = "Вход не выполнен.",
                        error = ModelState.Values.SelectMany(e => e.Errors.Select(er => er.ErrorMessage))
                    };
                    return Ok(errorMsg);
                }
            }
            else
            {
                var errorMsg = new
                {
                    message = "Вход не выполнен.",
                    error = ModelState.Values.SelectMany(e => e.Errors.Select(er => er.ErrorMessage))
                };
                return Ok(errorMsg);
            }
        }

        [HttpPost]
        [Route("api/account/logoff")]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> LogOff()
        {
            // Удаление куки
            await _signInManager.SignOutAsync();
            var msg = new
            {
                message = "Выполнен выход."
            };
            return Ok(msg);
        }

        [HttpGet]
        [Route("api/Account/GetRole")]
        public async Task<string> GetUserRole()
        {//получение id текущего пользователя

            try
            {
                User usr = await GetCurrentUserAsync();
                if (usr != null)
                {
                    x = await _userManager.GetRolesAsync(usr);
                    role = x.FirstOrDefault();
                }
            }
            catch 
            {
            }
            return role;
        }

        [HttpPost]
        [Route("api/Account/isAuthenticated")]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> LogisAuthenticatedOff()
        {
            User usr = await GetCurrentUserAsync();
            if (usr != null) id = usr.Id;
            var message = usr == null ? "Вы Гость. Пожалуйста, выполните вход." : "Вы вошли как: " + usr.UserName;
            var msg = new
            {
                message
            };
            return Ok(msg);
        }

        [HttpGet]
        [Route("api/Account/WhoisAuthenticated")]
        public async Task<string> GetIdUserAsync()
        {//получение id текущего пользователя
            try
            {
                User usr = await _userManager.GetUserAsync(HttpContext.User);
                if (usr != null) id = usr.Id;
                //await LogisAuthenticatedOff();
            }
            catch
            {
            }
            return id;
        }

        [HttpPost]
        [Route("api/Account/isAdmin")]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> isAdmin()
        {
            User usr = await GetCurrentUserAsync();
            IList<string> roles;
            try
            {
                roles = await _userManager.GetRolesAsync(usr);
            }
            catch
            {
                roles = null;
            }
            var message = usr == null ? "Вы гость" : roles.FirstOrDefault();
            var msg = new
            {
                message
            };
            return Ok(msg);
        }
        private Task<User> GetCurrentUserAsync() => _userManager.GetUserAsync(HttpContext.User);
    }
}
