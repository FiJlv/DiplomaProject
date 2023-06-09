using DiplomaProject.Data;
using DiplomaProject.Models;
using Microsoft.AspNetCore.SignalR;

namespace DiplomaProject.Source
{
    public class RandomNumberHub : Hub
    {
        private Dictionary<string, Random> randomDict = new Dictionary<string, Random>();
        public async Task OnConnectedAsync(string baseNum)
        {
            int baseNumValue = int.Parse(baseNum);

            var random = new Random();
            randomDict[Context.ConnectionId] = random;

            while (true)
            {
                int randomNumber = baseNumValue + random.Next(baseNumValue - baseNumValue / 10, baseNumValue + baseNumValue / 10);
                await Clients.Client(Context.ConnectionId).SendAsync("ReceiveNumber", randomNumber); // Відправка кліенту
                await Task.Delay(1000);
            }
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            if (randomDict.ContainsKey(Context.ConnectionId))
            {
                randomDict.Remove(Context.ConnectionId);
            }

            await base.OnDisconnectedAsync(exception);
        }

    }

}