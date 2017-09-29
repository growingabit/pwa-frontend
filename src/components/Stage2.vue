<template>
<div class="stage">
    <h1 class="md-headline">Dati Personali</h1>
    <vue-form :state="fs" @submit.prevent="onSubmit">
        <validate>
            <md-input-container md-clearable v-bind:class="{ 'md-input-invalid': !validity.name }">
                <label>Nome</label>
                <md-input :disabled="stage.isDone v-model="stage.data.name" name="name" required></md-input>
            </md-input-container>
        </validate>
        <validate tag="label">
            <md-input-container md-clearable v-bind:class="{ 'md-input-invalid': !validity.surname }">
                <label>Cognome</label>
                <md-input :disabled="stage.isDone v-model="stage.data.surname" name="surname" required></md-input>
            </md-input-container>
        </validate>
        <validate>
            <md-input-container md-clearable v-bind:class="{ 'md-input-invalid': !validity.birthdate }">
                <label>Data di nascita</label>
                <md-input :disabled="stage.isDone v-model="stage.data.birthdate" name="birthdate" required placeholder="gg/mm/aaaa"></md-input>
                <span class="md-error">Data non valida. Usa il formato gg/mm/aaaa.</span>
            </md-input-container>
        </validate>
        <md-button v-if="!fs || !loading" :disabled="fs.$invalid" type="submit">Invia</md-button>
        <md-spinner v-if="!fs || loading" md-indeterminate class="md-warn"></md-spinner>
    </vue-form>

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
    name: "Stage2",
    beforeMount() {
        this.authenticated = auth.isAuthenticated();
        this.user = User.get();
        this.stage = this.user.getStage(2);
    },
    computed: {
        // a computed getter
        validity: function () {
            if (!this.fs.name || !this.fs.surname || !this.fs.birthdate) {
                return {
                    name: true,
                    surname: true,
                    birthdate: true
                }
            }

            return {
                name: this.fs.name.$valid || this.fs.name.$pristine,
                surname: this.fs.surname.$valid || this.fs.surname.$pristine,
                birthdate: this.user.isStageFieldValid(2, 'birthdate') || this.fs.birthdate.$pristine,
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
            return User.submitStageData(2, this.stage.data)
            .then(() => {
                this.loading = false;
                return router.push('/stage/3');
            })
            .catch((err) => {
                this.loading = false;
                this.message = "E' avvenuto un errore durante l'invio dei dati";
                this.$refs.snackbar.open()
            });
        }
    }
}
</script>

<style scoped>
</style>
