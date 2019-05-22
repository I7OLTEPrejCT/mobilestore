using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApp2.Models
{
    public class Cart
    {
        [Key]
        public int CartId { get; set; }
        [ForeignKey("User")]
        public string UserId { get; set; }
        public int Active { get; set; }
        public DateTime DateOrder { get; set; }
        public int SumOrder { get; set; }

        public virtual User User { get; set; }

        public ICollection<CartLine> CartLines { get; set; }
        public Cart()
        {
            CartLines = new HashSet<CartLine>();
        }
    }                    
}