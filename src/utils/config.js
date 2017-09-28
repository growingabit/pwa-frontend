const config = {
    production: {
        apiUrl: 'https://api.growbit.xyz',
        auth0: {
            clientID: 'aB4EbELMT7MHTwZRDv2ivV5TIFItysL6',
            domain: 'growbit.auth0.com',
            redirectUrl: 'https://abc.growbit.xyz/oauth2/callback'
        }
    },
    development: {
        apiUrl: 'http://localhost:8080',
        auth0: {
            clientID: '32wl1L4tlptjPImhEvLIbrQSkwmAJx5s',
            domain: 'growbit-development.eu.auth0.com',
            redirectUrl: 'http://localhost:8081/oauth2/callback'
        }
    }
};

console.log('ENVIRONMENT: ', process.env.NODE_ENV);

export default config[process.env.NODE_ENV]
