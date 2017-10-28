<template>
<div class="home">
    <h1 v-if="!awaitingAuthentication" class="md-headline">Home</h1>
    <md-button v-show="!authenticated && !awaitingAuthentication" @click="signup()" class="md-raised md-primary" id="signup">Entra</md-button>
    <md-button v-show="authenticated && !awaitingAuthentication && (!user || !user.signupDone)" @click="resumeSignup()" class="md-raised md-primary" id="logout">Riprendi la Registrazione</md-button>
    <h2 v-show="authenticated && !awaitingAuthentication && user && user.signupDone">Registrazione Completata</h2>
    <md-spinner v-show="awaitingAuthentication" md-indeterminate class="md-warn"></md-spinner>

    <md-snackbar md-position="bottom right" ref="snackbar">
        <span>{{message}}</span>
        <md-button class="md-accent" md-theme="light-blue" @click="$refs.snackbar.close()">Chiudi</md-button>
    </md-snackbar>
</div>
</template>


<script>
import auth from '@/utils/auth'
import User from '@/utils/user'
import router from '@/router'

export default {
    name: "home",
    props: ['awaitingAuthentication'],
    mounted() {
        if (this.awaitingAuthentication) {
            return auth.isReady()
            .then(() => router.push('/'))
            .then(() => this.init())
        }

        this.init();
    },
    data() {
        return {
            authenticated: false,
            stages: [],
            loading: false,
            message: ''
        }
    },
    methods: {
        init() {
            this.authenticated = auth.isAuthenticated();
            this.user = User.get();
            auth.once('logout', () => {
                this.authenticated = false;
                this.user = null;
            });

            return auth.isReady()
            .then(() => {
                this.authenticated = auth.isAuthenticated();
                this.user = User.get();
            });
        },
        signup() {
            auth.logout();
            // Show the Lock Widget and save the user's JWT on a successful login
            auth.signup()
        },
        resumeSignup() {
            router.push(`/stage/${this.user.getCurrentStage().stage}`);
        },
        logout() {
            // Remove the profile and token from localStorage
            auth.logout();
            this.authenticated = false;
        }
    }
}
</script>

<style scoped>
    .home {
        text-align: center;
    }
</style>
