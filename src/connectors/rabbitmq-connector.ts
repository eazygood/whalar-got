export function getConfig() {
    return {
        protocol: 'amqp',
        hostname: 'localhost',
        port: 5672,
        username: process.env.RABBITMQ_USERNAME || 'guest',
        password: process.env.RABBITMQ_PASSWORD || 'guest',
        vhost: ''
      };
  }