const config = {
    production: {
        apiUrl: 'https://api.growbit.xyz',
        auth0: {
            clientID: 'aB4EbELMT7MHTwZRDv2ivV5TIFItysL6',
            domain: 'growbit.auth0.com'
        }
    },
    development: {
        apiUrl: 'http://localhost:8080',
        auth0: {
            clientID: '32wl1L4tlptjPImhEvLIbrQSkwmAJx5s',
            domain: 'growbit-development.eu.auth0.com'
        }
    }
};

export default config[process.env.NODE_ENV]
