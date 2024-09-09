export function getConfig() {
    return {
        hostname: process.env.RABBITMQ_HOST || 'localhost',
        port: Number(process.env.RABBITMQ_PORT) || 5672,
        username: process.env.RABBITMQ_USERNAME || 'rabbitmq',
        password: process.env.RABBITMQ_PASSWORD || 'rabbitmq',
        vhost: ''
      };
  }