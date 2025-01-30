const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

let users = [];

wss.on('connection', ws => {
    // Добавляем нового пользователя
    const userId = Date.now(); // Простой способ сгенерировать уникальный ID
    users.push(userId);
    console.log(`User ${userId} connected`);

    // Отправляем список пользователей
    ws.send(JSON.stringify({ users }));

    // Отправляем обновления всем клиентам
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ users }));
        }
    });

    // Когда пользователь отключается
    ws.on('close', () => {
        users = users.filter(user => user !== userId);
        console.log(`User ${userId} disconnected`);

        // Обновляем всех клиентов
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ users }));
            }
        });
    });
});
