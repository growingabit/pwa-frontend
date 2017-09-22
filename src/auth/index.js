import Vue from 'vue'
import Auth0Lock from "auth0-lock"
import EventEmitter from 'eventemitter3'
import User from '@/utils/user'

const lock = new Auth0Lock("32wl1L4tlptjPImhEvLIbrQSkwmAJx5s", "growbit-development.eu.auth0.com", {
    auth: {
        redirectUrl: 'http://localhost:8081/oauth2/callback',
        responseType: 'token id_token'
    }
});

let token = null;
let ready = false;
let loggedIn = false; // If just logged in with lock during this session

class Auth extends EventEmitter {
    login() {
        lock.show();
    }

    signup() {
        lock.show();
    }

    logout() {
        localStorage.removeItem('idToken');
        token = null;
        this.emit('logout');
    }

    setToken(idToken) {
        token = idToken;
        localStorage.setItem('idToken', idToken);
    }

    onTokenSet() {
        Vue.http.headers.common['Authorization'] = this.getAuthHeader();
        return User.load()
        .catch(() => {})
        .then(() => {
            ready = true;
            this.emit('ready');
        });
    }

    // To be used only in router guards to detect if user is not authenticated
    isAuthenticatedSync() {
        if (token) {
            return true;
        }

        return !!localStorage.getItem('idToken');
    }

    checkAuth() {
        token = localStorage.getItem('idToken');

        if (token) {
            return this.onTokenSet();
        }

        // Listen for the authenticated event and get profile
        lock.on("authenticated", (res) => {
            loggedIn = true;
            this.setToken(res.idToken);
            return this.onTokenSet();
        });
    }

    isReady() {
        if (ready) {
            return Promise.resolve(loggedIn);
        }

        return new Promise((resolve, reject) => {
            this.on('ready', () => resolve(loggedIn));
        });
    }

    isAuthenticated() {
        return !!token;
    }

    getAuthHeader() {
        if (token) {
            return `Bearer ${token}`;
        }

        return '';
    }
}

const auth = new Auth();

export default auth;
