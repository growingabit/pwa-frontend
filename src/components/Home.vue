<template>
<div class="home">
    <h1>{{ msg }}</h1>
    <md-button v-if="!authenticated" @click="signup()" class="md-raised md-primary" id="signup">Sign Up</md-button>
    <md-button v-if="authenticated" @click="logout()" class="md-raised md-primary" id="logout">Log Out</md-button>
</div>
</template>


<script>
import auth from '@/auth'
export default {
    name: "home",
    mounted() {
        auth.checkAuth();
        this.authenticated = auth.isAuthenticated();
    },
    data() {
        return {
            msg: "Home",
            authenticated: false
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
    font-weight: normal;
}

ul {
    list-style-type: none;
    padding: 0;
}

li {
    display: inline-block;
    margin: 0 10px;
}

a {
    color: #42b983;
}
</style>
