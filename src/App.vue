<template>
<div id="app">
    <md-toolbar>
        <md-button class="md-icon-button" @click="toggleLeftSidenav">
            <md-icon>menu</md-icon>
        </md-button>

        <h1 class="md-title">Growbit</h1>
    </md-toolbar>
    <md-sidenav class="main-sidebar md-left" ref="leftSidenav" @open="open('Left')" @close="close('Left')">
        <md-toolbar class="md-large">
            <div class="md-toolbar-container">
                <h3 class="md-title">Sidenav content</h3>
            </div>
        </md-toolbar>

        <div class="main-sidebar-links">
            <md-list class="md-dense">
                <md-list-item>
                    <!-- <router-link exact to="/">Introduction</router-link> -->
                    <md-button v-if="authenticated" @click="logout()" class="md-raised md-primary" id="logout">Log Out</md-button>
                    <!-- <router-link exact to="/">Introduction</router-link> -->
                </md-list-item>
            </md-list>
        </div>

    </md-sidenav>


    <div class="main-content">
        <router-view></router-view>
    </div>
</div>
</template>

<script>
import 'vue-material/dist/vue-material.css'
import auth from '@/auth'

export default {
    name: 'app',
    mounted() {
        auth.checkAuth();
        this.authenticated = auth.isAuthenticated();
    },
    data() {
        return {
            authenticated: false
        }
    },
    methods: {
        toggleLeftSidenav() {
            this.$refs.leftSidenav.toggle();
        },
        toggleRightSidenav() {
            this.$refs.rightSidenav.toggle();
        },
        closeRightSidenav() {
            this.$refs.rightSidenav.close();
        },
        open(ref) {
            console.log('Opened: ' + ref);
        },
        close(ref) {
            console.log('Closed: ' + ref);
        }
    }

}
</script>

<style>
#app {
    color: #2c3e50;
}

.main-content {
    margin-top: 16px;
    padding: 16px;
}


</style>
