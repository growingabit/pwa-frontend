<template>
<div class="stage">
    <h1 class="md-headline">Email</h1>
    <vue-form :state="fs" @submit.prevent="onSubmit">
        <validate>
            <md-input-container md-clearable v-bind:class="{ 'md-input-invalid': !validity.email }">
                <label>Email</label>
                <md-input :disabled="stage.awaitingVerification || stage.isDone" type="email" v-model="stage.data.email" name="email" required></md-input>
            </md-input-container>
        </validate>
        <md-button v-show="!loading" :disabled="fs.$invalid || stage.awaitingVerification" type="submit">Invia</md-button>
        <md-spinner v-show="!fs || loading" md-indeterminate class="md-warn"></md-spinner>
    </vue-form>
    <md-button v-show="!loading" :disabled="!stage.awaitingVerification" @click="next">Prosegui</md-button>

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
    name: "Stage3",
    beforeMount() {
        this.authenticated = auth.isAuthenticated();
        this.user = User.get();
        this.stage = this.user.getStage(3);
    },
    computed: {
        // a computed getter
        validity: function () {
            if (!this.fs.email) {
                return {
                    email: true
                }
            }

            return {
                email: this.fs.email.$valid || this.fs.email.$pristine
            }
        }
    },

    data() {
        return {
            authenticated: false,
            fs: {},
            stage: {},
            loading: false,
            message: ''
        }
    },
    methods: {
        onSubmit() {
            this.loading = true;
            return User.submitStageData(3, this.stage.data)
            .then(() => {
                this.user = User.get();
                this.loading = false;
                this.message = "A breve riceverai una mail di conferma!";
                this.$refs.snackbar.open();
            })
            .catch((err) => {
                console.log(err);
                this.loading = false;
                this.message = "E' avvenuto un errore durante l'invio dei dati";
                this.$refs.snackbar.open();
            });
        },
        next() {
            this.loading = true;
            return User.load()
            .then((user) => {
                this.loading = false;
                this.user = user;
                if (user.getStage(3).isDone) {
                    return router.push('/stage/4');
                } else {
                    this.message = "Il tuo indirizzo email non è stato confermato.";
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
