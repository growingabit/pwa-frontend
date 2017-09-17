<template>
<div class="main">

    <h1 class="md-headline">Sign Up</h1>

    <md-button v-if="!authenticated" @click="signup()" class="md-raised md-primary" id="signup">Sign Up</md-button>

    <md-stepper class="step" ref="stepper" md-vertical v-if="authenticated" @change="submit">
        <md-step md-button-continue="Submit">
            <md-input-container md-clearable>
                <label>Invitation Code</label>
                <md-input v-model="stages[0].data.invitationCode"></md-input>
            </md-input-container>
        </md-step>

        <md-step md-button-continue="Submit">
            <md-input-container md-clearable>
                <label>Name</label>
                <md-input v-model="stages[1].data.name"></md-input>
            </md-input-container>
            <md-input-container md-clearable>
                <label>Surname</label>
                <md-input v-model="stages[1].data.surname"></md-input>
            </md-input-container>
            <md-input-container md-clearable>
                <label>Birth Date</label>
                <md-input v-model="stages[1].data.birthdate"></md-input>
            </md-input-container>
        </md-step>


        <md-step md-button-continue="Submit">
            <md-input-container md-clearable>
                <label>Email</label>
                <md-input v-model="stages[2].data.email"></md-input>
            </md-input-container>
        </md-step>
    </md-stepper>

    <md-button v-if="authenticated" @click="logout()" class="md-raised md-primary" id="logout">Log Out</md-button>
</div>
</template>


<script>
import auth from '@/auth'
import User from '@/utils/user'
import router from '@/router'

export default {
    name: "home",
    mounted() {
        this.authenticated = auth.isAuthenticated();

        if (this.authenticated) {
            this.user = User.get();
            this.stages = this.user.getStages();
            setTimeout(() => {
                this.gotoStage(this.user.getCurrentStage().stage);
            })
        }
    },
    data() {
        return {
            authenticated: false,
            stages: []
        }
    },
    methods: {
        submit(index) {
            if (index === 0) {
                return;
            }

            return User.submitStageData(index - 1, this.stages[index - 1].data)
            .then(user => this.user = user)
            .then(() => this.gotoStage(index))
        },
        gotoStage(index) {
            router.push(`/stage/${index}`)
        },
        signup() {
            // Show the Lock Widget and save the user's JWT on a successful login
            auth.signup()
        },
        logout() {
            // Remove the profile and token from localStorage
            auth.logout();
            this.authenticated = false;
            router.push('/');
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

.main {
    text-align: center;
}

.subtitle {
    padding-bottom: 16px;
}

.step {
    text-align: justify;
    margin-bottom: 16px;
    margin-top: 16px;
}
</style>
