<template>
<div class="stage">
    <h1 class="md-headline">Dati Genitore</h1>
    <vue-form :state="fs" @submit.prevent="onSubmit">
        <validate>
            <md-input-container md-clearable v-bind:class="{ 'md-input-invalid': !validity.phoneNumber }">
                <label>Numero di telefono</label>
                <md-input :disabled="stage.awaitingVerification || stage.isDone" name="phoneNumber" v-model="stage.data.phoneNumber" required></md-input>
                <span class="md-error">Numero di telefono non valido</span>
            </md-input-container>
            <md-input-container md-clearable v-bind:class="{ 'md-input-invalid': !validity.name }">
                <label>Nome</label>
                <md-input :disabled="stage.awaitingVerification || stage.isDone" name="name" v-model="stage.data.name" required></md-input>
            </md-input-container>
            <md-input-container md-clearable v-bind:class="{ 'md-input-invalid': !validity.surname }">
                <label>Cognome</label>
                <md-input :disabled="stage.awaitingVerification || stage.isDone" name="surname" v-model="stage.data.surname" required></md-input>
            </md-input-container>
        </validate>

        <md-button v-if="!loading" :disabled="stage.awaitingVerification" type="submit">Invia</md-button>
        <md-spinner v-if="!fs || loading" md-indeterminate class="md-warn"></md-spinner>
    </vue-form>
    <md-button :disabled="stage.awaitingVerification" @click="next">Prosegui</md-button>

    <md-snackbar md-position="bottom right" ref="snackbar">
        <span>{{message}}</span>
        <md-button class="md-accent" @click="$refs.snackbar.close()">Chiudi</md-button>
    </md-snackbar>

    <md-dialog-alert
    :md-content="congratulations"
    :md-ok-text="okText"
    @close="onDialogClosed"
    ref="congratsDialog">
    </md-dialog-alert>
</div>
</template>


<script>
import auth from '@/utils/auth'
import User from '@/utils/user'
import router from '@/router'
import config from '@/utils/config'

export default {
    name: "Stage7",
    beforeMount() {
        this.authenticated = auth.isAuthenticated();
        this.user = User.get();
        this.stage = this.user.getStage(7);
    },
    computed: {
        // a computed getter
        validity: function () {
          if (!this.fs.name || !this.fs.surname || !this.fs.phoneNumber) {
            return {
              name: true,
              surname: true,
              phoneNumber: true
            }
          }

          return {
            name: this.fs.name.$valid || this.fs.name.$pristine,
            surname: this.fs.surname.$valid || this.fs.surname.$pristine,
            phoneNumber: this.user.isStageFieldValid(7, 'phoneNumber') || this.fs.phoneNumber.$pristine,
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
            verificationCode: '',
            congratulations: `Congratulazioni, hai completato una delle registrazioni piu' lunghe della tua vita! Riceverai un email/sms quando potrai svolgere l'autocertificazione.`,
            okText: 'Ok!'
        }
    },
    methods: {
        onDialogClosed() {
            return router.push('/');
        },
        onSubmit() {
            this.loading = true;
            return User.submitStageData(7, this.stage.data)
            .then(() => {
                this.user = User.get();
                this.stage = this.user.getStage(7);
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

            return User.load()
            .then((user) => {
                this.loading = false;
                this.user = user;
                this.stage = user.getStage(7);
                if (this.stage.isDone) {
                    this.$refs.congratsDialog.open();
                } else {
                    this.message = "Il numero di telefono di un genitore non è stato confermato.";
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
