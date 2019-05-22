using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApp2.Models;

namespace WebApp2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CartController : ControllerBase
    {
        private readonly DataContext _context;
        public CartController(DataContext context)
        {
            _context = context; // получаем контекст базы данных
            AccountController.OrderEvent += new OrderDelegate(Create); //получаем id текущего пользователя из AccountController
        }
        public static event IdDelegate IDEvent; //событие по получению id текущего пользователя из AccountController


        [HttpGet]
        public IEnumerable<Cart> GetAll() //получить все заказы
        {
            string id = IDEvent().Result; //получаем id текущего пользователя из AccountController
            try
            {//возвращаем список всех заказов для текущего пользователя

                return _context.Carts.Include(p => p.CartLines);
            }
            catch (Exception ex)
            {//если что-то пошло не так, выводим исключение в консоль
                Console.WriteLine("Возникла ошибка при получении списка всех заказов.");
                return null;
            }
        }

        [HttpGet("{id}")]
        //получить заказ по его id
        public async Task<IActionResult> GetOrder([FromRoute] int id)
        {
            try
            {
                //получить заказ по id заказа
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                var order = await _context.Carts.SingleOrDefaultAsync(m => m.CartId == id);
                if (order == null)//если ничего не получили -- не найдено
                {
                    return NotFound();
                }
                return Ok(order);//возвращием заказ
            }
            catch (Exception)
            {
                return BadRequest();
            }
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Cart order)
        {//создать новый заказ
         //получаем данные о заказе во входных параметрах
            try
            {
                if (!ModelState.IsValid)
                {

                    return BadRequest(ModelState);
                }

                if (order.UserId == "1")
                    order.UserId = IDEvent().Result;


                _context.Carts.Add(order); //добавление заказа в БД
                await _context.SaveChangesAsync();//асинхронное сохранение изменений

                return CreatedAtAction("GetOrder", new { id = order.CartId }, order);
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update([FromRoute] int id, [FromBody] Cart order)
        {//обновить существующий заказ
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                var item = _context.Carts.Find(id);
                if (item == null)
                {
                    return NotFound();
                }
                item.CartLines = order.CartLines;
                item.DateOrder = order.DateOrder;
                item.SumOrder = order.SumOrder;
                item.Active = order.Active;
                _context.Carts.Update(item);
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "user")]
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                var item = _context.Carts.Find(id);
                if (item == null)
                {
                    return NotFound();
                }
                _context.Carts.Remove(item);
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch
            {
                return BadRequest();
            }
        }
    }
}