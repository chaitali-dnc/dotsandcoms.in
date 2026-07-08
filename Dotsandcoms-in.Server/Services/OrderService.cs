using Dotsandcoms_in.Server.Data;
using Dotsandcoms_in.Server.DTOs;
using Dotsandcoms_in.Server.Models;
using System.Text;

namespace Dotsandcoms_in.Server.Services
{
    public class OrderService : IOrderService
    {
        private readonly AppDbContext _db;
        private readonly IEmailService _emailService;

        public OrderService(AppDbContext db, IEmailService emailService)
        {
            _db = db;
            _emailService = emailService;
        }

        public async Task<int> PlaceOrderAsync(OrderRequestDto dto, string ipAddress)
        {
            var order = new HostingOrder
            {
                PackageName = dto.PackageName,
                PackageId = dto.PackageId,
                Price = dto.Price,
                Period = dto.Period,
                CompanyName = dto.CompanyName,
                ContactNumber = dto.ContactNumber,
                Email = dto.EmailId,
                Address = dto.Address,
                CityOrState = dto.State,
                Country = dto.Country,
                Comments = string.IsNullOrWhiteSpace(dto.Comments) ? "-" : dto.Comments,
                IsServerPlan = dto.IsServerPlan,
                TotalPrice = dto.TotalPrice,
                DomainName = dto.DomainName,
                YourName = dto.YourName,
                AreaCode = dto.AreaCode,
                AddMsSql = dto.AddMsSql ?? false,
                ServerName = dto.ServerName,
                ContactPersonName = dto.ContactPersonName,
                SpecialInstructions = dto.SpecialInstructions,
                OperatingSystem = dto.OperatingSystem,
                PaymentTerms = dto.PaymentTerms,
                ControlPanel = dto.ControlPanel,
                IpAddress = ipAddress,
                CreatedOn = DateTime.Now
            };

            _db.HostingOrders.Add(order);
            await _db.SaveChangesAsync();

            // Admin email
            var adminHtml = BuildAdminMailBody(order);
            await _emailService.SendEmailAsync(
                to: "karan@dotscoms.com",  
                from: order.Email,
                subject: $"Hosting Order Form-{DateTime.Now:dd-MMM-yyyy}- IN",
                html: adminHtml
            );

            // Thank you email to customer
            var thankYouHtml = BuildThankYouMailBody(order);
            await _emailService.SendEmailAsync(
                to: order.Email,
                from: null, // service apne aap _settings.From use kar lega
                subject: "Thank You!",
                html: thankYouHtml
            );

            return order.Id;
        }

        private string BuildAdminMailBody(HostingOrder o)
        {
            var sb = new StringBuilder();
            sb.Append($"<p><b>Package:</b> {o.PackageName}</p>");
            sb.Append($"<p><b>Company:</b> {o.CompanyName}</p>");
            sb.Append($"<p><b>Contact Person:</b> {(o.IsServerPlan ? o.ContactPersonName : o.YourName)}</p>");
            sb.Append($"<p><b>Domain/Server Name:</b> {(o.IsServerPlan ? o.ServerName : o.DomainName)}</p>");
            sb.Append($"<p><b>Email:</b> {o.Email}</p>");
            sb.Append($"<p><b>Phone:</b> {o.ContactNumber}</p>");
            sb.Append($"<p><b>Address:</b> {o.Address}</p>");
            sb.Append($"<p><b>City/State:</b> {o.CityOrState}</p>");
            sb.Append($"<p><b>Country:</b> {o.Country}</p>");
            if (o.IsServerPlan)
            {
                sb.Append($"<p><b>OS:</b> {o.OperatingSystem}</p>");
                sb.Append($"<p><b>Payment Terms:</b> {o.PaymentTerms}</p>");
                sb.Append($"<p><b>Control Panel:</b> {o.ControlPanel}</p>");
                sb.Append($"<p><b>Special Instructions:</b> {o.SpecialInstructions}</p>");
            }
            else
            {
                sb.Append($"<p><b>Area Code:</b> {o.AreaCode}</p>");
                sb.Append($"<p><b>MS-SQL Addon:</b> {(o.AddMsSql ? "Yes" : "No")}</p>");
            }
            sb.Append($"<p><b>Comments:</b> {o.Comments}</p>");
            sb.Append($"<p><b>Amount:</b> ₹{o.TotalPrice}</p>");
            sb.Append($"<p><b>IP Address:</b> {o.IpAddress}</p>");
            return sb.ToString();
        }

        private string BuildThankYouMailBody(HostingOrder o)
        {
            return $@"<p>Dear {(o.IsServerPlan ? o.ContactPersonName : o.YourName)},</p>
                       <p>Thank you for placing an order with Dots &amp; Coms. Our team will contact you shortly to complete verification and payment.</p>
                       <p>Order Reference ID: <b>DNC-{o.Id}</b></p>";
        }
    }
}
