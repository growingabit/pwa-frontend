<template>
<div class="stage">
    <h1 class="md-headline">Indirizzo Wallet</h1>
    <vue-form :state="fs" @submit.prevent="onSubmit">
        <validate tag="label">
            <md-input-container md-clearable v-bind:class="{ 'md-input-invalid': (!user.isStageValid(6) || fs.$invalid) && fs.$dirty }">
                <label>Indirizzo Wallet</label>
                <md-input :disabled="stage.isDone" v-model="stage.data.invitationCode" name="invitationCode" required></md-input>
                <span class="md-error">Indirizzo non valido</span>
            </md-input-container>
        </validate>
        <md-button v-if="!loading" :disabled="!user.isStageValid(6) || fs.$invalid || stage.isDone" type="submit">Invia</md-button>
        <md-spinner v-if="loading" md-indeterminate class="md-warn"></md-spinner>
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
    name: "Stage6",
    beforeMount() {
        this.authenticated = auth.isAuthenticated();
        this.user = User.get();
        this.stage = this.user.getStage(6);
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
            return User.submitStageData(6, this.stage.data)
            .then(() => {
                this.loading = false;
                return router.push('/stage/7');
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
