using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApp2.Models
{
    public class CartLine
    {
        [Key]
        public int Id { get; set; }
        [ForeignKey("Order")]
        public int cartId { get; set; }
        [Required]
        [ForeignKey("Product")]
        public int productId { get; set; }

        public int quantity { get; set; }
        public int price { get; set; }

        public virtual Cart Cart { get; set; }
        public virtual Product Product { get; set; }
    }
}