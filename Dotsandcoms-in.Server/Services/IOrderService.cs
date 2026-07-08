using Dotsandcoms_in.Server.DTOs;

namespace Dotsandcoms_in.Server.Services
{
    public interface IOrderService
    {
        Task<int> PlaceOrderAsync(OrderRequestDto dto, string ipAddress);
    }
}
