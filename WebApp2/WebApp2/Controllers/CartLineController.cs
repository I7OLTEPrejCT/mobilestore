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
    public class CartLineController : ControllerBase
    {
        private readonly DataContext _context;
        public CartLineController(DataContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IEnumerable<CartLine> GetAll()
        {
            return _context.CartLine;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetCartLine([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var CartLine = await _context.CartLine.SingleOrDefaultAsync(m => m.Id == id);
            if (CartLine == null)
            {
                return NotFound();
            }
            return Ok(CartLine);
        }

        [HttpPost]
        [Authorize(Roles = "user")]
        public async Task<IActionResult> Create([FromBody] CartLine item)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            _context.CartLine.Add(item);
            await _context.SaveChangesAsync();
            return CreatedAtAction("GetCartLine", new { id = item.Id }, item);
        }

        [HttpPut]
        public IActionResult Put([FromBody]CartLine CartLine)
        {
            if (CartLine == null)
            {
                return BadRequest();
            }
            if (!_context.CartLine.Any(x => x.Id == CartLine.Id))
            {
                return NotFound();
            }

            _context.Update(CartLine);
            _context.SaveChanges();
            return Ok(CartLine);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var item = _context.CartLine.Find(id);
            if (item == null)
            {
                return NotFound();
            }
            _context.CartLine.Remove(item);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}