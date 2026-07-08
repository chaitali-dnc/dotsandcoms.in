using Dotsandcoms_in.Server.DTOs;
using Dotsandcoms_in.Server.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Dotsandcoms_in.Server.Controllers
{
    [ApiController]
    [Route("api/orders")]
    public class OrdersController : ControllerBase
    {
        private readonly IOrderService _orderService;

        public OrdersController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] OrderRequestDto dto)
        {
            if (dto == null)
                return BadRequest(new { message = "Invalid order data." });

            var ip = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "-";

            try
            {
                var orderId = await _orderService.PlaceOrderAsync(dto, ip);
                return Ok(new { success = true, orderId });
            }
            catch (Exception ex)
            {
                // ideally log this properly
                return StatusCode(500, new { success = false, message = "Order failed", error = ex.Message });
            }
        }
    }
}
