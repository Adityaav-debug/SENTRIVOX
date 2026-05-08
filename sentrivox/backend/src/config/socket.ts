export const clients = new Set<any>();

export function broadcastAlert(alert: any) {
  const payload = JSON.stringify(alert);
  clients.forEach((client) => {
    if (client.readyState === 1) { // OPEN
      client.send(payload);
    }
  });
}
