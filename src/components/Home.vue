<template>
<div class="home">
    <h1 class="md-headline">Home</h1>

    <md-button v-if="!authenticated" @click="signup()" class="md-raised md-primary" id="signup">Enter</md-button>
    <md-button v-if="authenticated" @click="resumeSignup()" class="md-raised md-primary" id="logout">Resume Registration</md-button>
</div>
</template>


<script>
import auth from '@/auth'
import User from '@/utils/user'
import router from '@/router'

export default {
    name: "home",
    mounted() {
        auth.isReady()
        .then(() => {
            this.authenticated = auth.isAuthenticated();
            this.user = User.get();
        });
    },
    data() {
        return {
            authenticated: false,
            stages: []
        }
    },
    methods: {
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
