using Dotsandcoms_in.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace Dotsandcoms_in.Server.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
    : base(options) { }

        public DbSet<HostingOrder> HostingOrders { get; set; }

    }
}
