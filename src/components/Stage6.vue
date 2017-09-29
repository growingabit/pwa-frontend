<template>
<div class="stage">
    <h1 class="md-headline">Blockcerts</h1>
    <md-input-container>
        <label>Issuer</label>
        <md-input disabled type="text" v-model="issuer"></md-input>
    </md-input-container>
    <md-input-container v-show="!loading">
        <label>Nonce</label>
        <md-input disabled type="text" v-model="stage.data.nonce"></md-input>
    </md-input-container>
    <md-spinner v-show="loading" md-indeterminate class="md-warn"></md-spinner>
    <md-button v-show="!loading" @click="next">Prosegui</md-button>

    <md-snackbar md-position="bottom right" ref="snackbar">
        <span>{{message}}</span>
        <md-button class="md-accent" @click="$refs.snackbar.close()">Chiudi</md-button>
    </md-snackbar>
</div>
</template>


<script>
import auth from '@/utils/auth'
import User from '@/utils/user'
import router from '@/router'

export default {
    name: "Stage6",
    beforeMount() {
        this.authenticated = auth.isAuthenticated();
        this.user = User.get();
        this.stage = this.user.getStage(6);
    },
    mounted() {
        if (this.stage.data.nonce) {
            return;
        }

        this.loading = true;
        User.retrieveStageData(6)
        .then(() => {
            this.user = User.get();
            this.stage = this.user.getStage(6);
            this.loading = false;
        })
        .catch((err) => {
            console.log(err);
            this.loading = false;
            this.message = "E' avvenuto un errore durante l'invio dei dati";
            this.$refs.snackbar.open();
        });
    },
    data() {
        return {
            authenticated: false,
            stage: {},
            loading: false,
            message: '',
            issuer: 'https://issuer.growbit.xyz/'
        }
    },
    methods: {
        next() {
            this.loading = true;
            return User.load()
            .then((user) => {
                this.loading = false;
                this.user = user;
                if (user.getStage(6).isDone) {
                    return router.push('/stage/7');
                } else {
                    this.message = "Non ci risulta che hai completato il passaggio su blockcerts. Chiedi aiuto se ti serve.";
                    this.$refs.snackbar.open();
                }
            })
            .catch((err) => {
                console.log(err);
                this.loading = false;
                this.message = "E' avvenuto un errore durante l'invio dei dati";
                this.$refs.snackbar.open();
            });
        }
    }
}
</script>

<style scoped>
</style>
