<template>
<div id="app">
    <md-toolbar>
        <md-button v-if="authenticated" class="md-icon-button" @click="toggleLeftSidenav">
            <md-icon>menu</md-icon>
        </md-button>

        <h1 class="md-title">Growbit</h1>
    </md-toolbar>
    <md-sidenav class="main-sidebar md-left" ref="leftSidenav">
        <md-toolbar class="growbit-logo">
            <router-link exact to="/">
                <img src="/static/growbitlogo.png" alt="Growbit">
            </router-link>
        </md-toolbar>

        <div class="main-sidebar-links">
            <md-list>
                <md-list-item @click="logout()">
                    <span>Log Out</span>
                </md-list-item>
                <md-divider></md-divider>
                <md-list-item>
                    <span>Stage Registrazione</span>
                    <md-list-expand>
                        <md-list>
                            <md-list-item v-for="stage in stages" :key="stage.name" class="md-inset" :disabled="stage.disabled" @click="gotoPath(stage.path)">
                                <a class="md-list-item-container md-button router-link-exact-active router-link-active">{{stage.name}}</a>
                                <md-button class="md-icon-button md-list-action" @click="gotoPath(stage.path)">
                                    <md-icon v-show="stage.isDone" class="md-primary">done</md-icon>
                                    <md-icon v-show="stage.awaitingVerification" class="md-primary">warning</md-icon>
                                </md-button>
                            </md-list-item>
                        </md-list>
                    </md-list-expand>
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
import auth from '@/utils/auth'
import User from '@/utils/user'
import router from '@/router'

export default {
    name: 'app',
    mounted() {
        auth.isReady()
        .then(() => {
            this.authenticated = auth.isAuthenticated();
            this.user = User.get();
            this.stages = this.user.getStages();
        });

        auth.on('logout', () => {
            this.authenticated = false;
        });
    },
    data() {
        return {
            authenticated: false,
            stages: []
        }
    },
    methods: {
        logout() {
            auth.logout();
            this.authenticated = false;
            this.toggleLeftSidenav();
            router.push(`/`);
        },
        toggleLeftSidenav() {
            this.$refs.leftSidenav.toggle();
        },
        gotoPath(path) {
            this.toggleLeftSidenav();
            router.push(path);
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

.stage {
    text-align: center;
}

.growbit-logo {
    font-size: 24px;
}

.growbit-logo a {
    width: 100%;
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
    color: inherit;
    text-decoration: none;
}

.growbit-logo a &:hover {
    color: inherit;
    text-decoration: none;
}

.growbit-logo a img {
    max-height: 200px !important;
    margin-bottom: 16px;
    margin-top: 8px;
}

.main-sidebar-links {
    overflow: auto;
    flex: 1;
}

.main-sidebar-links .md-inset .md-list-item-container {
    padding-left: 36px;
}

.main-sidebar-links .md-list-item-container {
    font-size: 14px;
    font-weight: 500;
}

</style>
