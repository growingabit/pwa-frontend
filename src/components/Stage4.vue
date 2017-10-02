<template>
<div class="stage">
    <h1 class="md-headline">Numero di telefono</h1>
    <vue-form :state="fs" @submit.prevent="onSubmit">
        <validate>
            <md-input-container md-clearable v-bind:class="{ 'md-input-invalid': !validity.phoneNumber }">
                <label>Numero di telefono</label>
                <md-input :disabled="stage.awaitingVerification || stage.isDone" name="phoneNumber" v-model="stage.data.phoneNumber" required></md-input>
                <span class="md-error">Numero di telefono non valido</span>
            </md-input-container>
        </validate>

        <validate v-if="stage.awaitingVerification">
            <label>Codice di verifica</label>
            <md-input-container md-clearable v-bind:class="{ 'md-input-invalid': !validity.verificationCode }">
                <md-input name="verificationCode" v-model="verificationCode" required></md-input>
                <span class="md-error">Codice di verifica non valido</span>
            </md-input-container>
        </validate>

        <md-button v-if="!loading" :disabled="fs.$invalid || stage.awaitingVerification || stage.isDone" type="submit">Invia</md-button>
        <md-spinner v-if="!fs || loading" md-indeterminate class="md-warn"></md-spinner>
    </vue-form>
    <md-button :disabled="!stage.awaitingVerification || (fs.verificationCode && fs.verificationCode.$invalid)" @click="next">Prosegui</md-button>

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
import config from '@/utils/config'

export default {
    name: "Stage4",
    beforeMount() {
        this.authenticated = auth.isAuthenticated();
        this.user = User.get();
        this.stage = this.user.getStage(4);
    },
    computed: {
        // a computed getter
        validity: function () {
            if (!this.fs.phoneNumber) {
                return {
                    phoneNumber: true
                }
            }

            return {
                verificationCode: this.fs.verificationCode && (this.fs.verificationCode.$valid || this.fs.verificationCode.$pristine),
                phoneNumber: this.user.isStageFieldValid(4, 'phoneNumber') || this.fs.phoneNumber.$pristine
            }
        }
    },

    data() {
        return {
            authenticated: false,
            fs: {},
            stage: {},
            loading: false,
            message: '',
            verificationCode: ''
        }
    },
    methods: {
        onSubmit() {
            this.loading = true;
            return User.submitStageData(4, this.stage.data)
            .then(() => {
                this.user = User.get();
                this.stage = this.user.getStage(4);
                this.loading = false;
                this.message = "A breve riceverai un sms di conferma!";
                this.$refs.snackbar.open();
            })
            .catch((err) => {
                this.loading = false;
                this.message = "E' avvenuto un errore durante l'invio dei dati";
                this.$refs.snackbar.open();
            });
        },
        next() {
            this.loading = true;

            return this.$http.get(`${config.apiUrl}/api/v1/verify/phone/${this.verificationCode}`)
            .then(() => {
                return User.load();
            })
            .then((user) => {
                this.loading = false;
                this.user = user;
                this.stage = user.getStage(4);
                if (this.stage.isDone) {
                    return router.push('/stage/5');
                } else {
                    this.message = "Il tuo numero di telefono non è stato confermato.";
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
