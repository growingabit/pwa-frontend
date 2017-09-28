<template>
<div class="stage">
    <h1 class="md-headline">Numero di telefono</h1>
    <vue-form :state="fs" @submit.prevent="onSubmit">
        <validate>
            <md-input-container md-clearable v-bind:class="{ 'md-input-invalid': !validity.phoneNumber }">
                <md-input :disabled="stage.awaitingVerification" name="phoneNumber" v-model="stage.data.phoneNumber" required></md-input>
                <span class="md-error">Numero di telefono non valido</span>
            </md-input-container>
        </validate>
        <md-button v-if="!loading" :disabled="fs.$invalid || stage.awaitingVerification" type="submit">Invia</md-button>
        <md-spinner v-if="!fs || loading" md-indeterminate class="md-warn"></md-spinner>
    </vue-form>
    <md-button :disabled="!stage.awaitingVerification" @click="next">Prosegui</md-button>

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
            message: ''
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
            return User.load()
            .then((user) => {
                this.user = user;
                this.stage = user.getStage(4);
                if (this.stage.isDone) {
                    return router.push('/stage/5');
                } else {
                    this.message = "Il tuo numero di telefono non è stato confermato.";
                    this.$refs.snackbar.open();
                }
            })
        }
    }
}
</script>

<style scoped>
</style>
