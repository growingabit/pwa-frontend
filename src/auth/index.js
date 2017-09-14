import Vue from 'vue'
import Auth0Lock from "auth0-lock"
import router from '@/router'
import User from '@/utils/user'

const lock = new Auth0Lock("aB4EbELMT7MHTwZRDv2ivV5TIFItysL6", "growbit.auth0.com", {
    auth: {
        redirectUrl: 'http://localhost:8080/oauth2/callback',
        responseType: 'token'
    }
});

let token;

const auth = {
    login() {
        lock.show();
    },
    signup() {
        lock.show();
    },
    logout() {
        localStorage.removeItem('idToken');
        token = null;
    },
    setToken(idToken) {
        localStorage.setItem('idToken', idToken);
        Vue.http.headers.common['Authorization'] = getAuthHeader();
        token = idToken;
    },
    checkAuth() {
        console.log('checkAuth');
        token = localStorage.getItem('idToken');
        Vue.http.headers.common['Authorization'] = getAuthHeader();
    },
    isAuthenticated() {
        return !!token;
    }
};

export default auth;

// Listen for the authenticated event and get profile
lock.on("authenticated", function(authResult) {
    auth.setToken(authResult.idToken)
    User.load()
    .then(() => {
        router.push('/');
    });
});

function getAuthHeader() {
    if (token) {
        return `Bearer ${token}`;
    }

    return '';
}
