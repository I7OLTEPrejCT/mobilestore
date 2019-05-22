using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace WebApp2.Models
{
    public partial class DataContext : IdentityDbContext<User>
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        { }
        public virtual DbSet<Product> Products { get; set; }       
        public virtual DbSet<CartLine> CartLine { get; set; }
        public virtual DbSet<Cart> Carts { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Cart>(entity =>
            {
                entity.HasOne(d => d.User).WithMany(p => p.Cart).HasForeignKey(d => d.UserId);
                entity.HasMany(a => a.CartLines).WithOne(a => a.Cart).HasForeignKey(a => a.cartId);
            });
            modelBuilder.Entity<CartLine>(entity =>
            {
                entity.HasOne(d => d.Cart).WithMany(p => p.CartLines).HasForeignKey(d => d.cartId);
                entity.HasOne(d => d.Product).WithMany(a => a.CartLines).HasForeignKey(d => d.productId);
            });

            modelBuilder.Entity<User>(entity =>
            {
                entity.HasMany(a => a.Cart).WithOne(b => b.User).HasForeignKey(c => c.UserId);
            });
        }
    }
}