<template>
<div class="home">
    <h1 class="md-headline">Home</h1>

    <md-button v-if="!authenticated" @click="signup()" class="md-raised md-primary" id="signup">Sign Up</md-button>
    <md-button v-if="authenticated" @click="logout()" class="md-raised md-primary" id="logout">Log Out</md-button>
</div>
</template>


<script>
import auth from '@/auth'
import User from '@/utils/user'
import router from '@/router'

export default {
    name: "home",
    mounted() {
        this.authenticated = auth.isAuthenticated();

        if (this.authenticated) {
            this.user = User.get();
            this.stages = this.user.getStages();
            setTimeout(() => {
                this.gotoStage(this.user.getCurrentStage().stage);
            })
        }
    },
    data() {
        return {
            authenticated: false,
            stages: []
        }
    },
    methods: {
        signup() {
            // Show the Lock Widget and save the user's JWT on a successful login
            auth.signup()
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
