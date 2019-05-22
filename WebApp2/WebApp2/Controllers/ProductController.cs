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
    public class ProductController : ControllerBase
    {
        private readonly DataContext _context;
        public ProductController(DataContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IEnumerable<Product> GetAll()
        {
            return _context.Products;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetProduct([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var Product = await _context.Products.SingleOrDefaultAsync(m => m.Id == id);
            if (Product == null)
            {
                return NotFound();
            }
            return Ok(Product);
        }

        [Authorize(Roles = "admin")]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Product Product)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Products.Add(Product);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetProduct", new { id = Product.Id }, Product);
        }

        [HttpPut]
        public IActionResult Put([FromBody]Product Product)
        {
            if (Product == null)
            {
                return BadRequest();
            }
            if (!_context.Products.Any(x => x.Id == Product.Id))
            {
                return NotFound();
            }
            _context.Update(Product);
            _context.SaveChanges();
            return Ok(Product);
        }

        [Authorize(Roles = "admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var item = _context.Products.Find(id);
            if (item == null)
            {
                return NotFound();
            }
            _context.Products.Remove(item);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}