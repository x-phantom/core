module.exports = {
  mount: true,
  port: 4003,
  versions: {
    default: 2,
    valid: [1, 2]
  },
  cache: {
    enabled: false,
    options: {
      name: 'public-api-cache',
      engine: require('catbox-redis'),
      host: '127.0.0.1',
      partition: 'cache'
    }
  },
  rateLimit: {
    enabled: false,
    limit: 300,
    expires: 600000
  },
  pagination: {
    limit: 100,
    include: [
      '/api/v2/blocks',
      '/api/v2/blocks/{id}/transactions',
      '/api/v2/blocks/search',
      '/api/v2/delegates',
      '/api/v2/delegates/{id}/blocks',
      '/api/v2/delegates/{id}/voters',
      '/api/v2/multisignatures',
      '/api/v2/peers',
      '/api/v2/signatures',
      '/api/v2/transactions',
      '/api/v2/transactions/search',
      '/api/v2/votes',
      '/api/v2/wallets',
      '/api/v2/wallets/{id}/transactions',
      '/api/v2/wallets/{id}/transactions/received',
      '/api/v2/wallets/{id}/transactions/send',
      '/api/v2/wallets/{id}/votes',
      '/api/v2/wallets/search',
      '/api/v2/webhooks'
    ]
  },
  webhooks: {
    secret: 'my-secret-auth-token'
  }
}