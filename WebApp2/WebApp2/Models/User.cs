using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;

namespace WebApp2.Models
{
    public class User : IdentityUser
    {
        public virtual ICollection<Cart> Cart { get; set; }
        public User()
        {
            Cart = new HashSet<Cart>();
        }
    }
}