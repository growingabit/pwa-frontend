<template>
<div class="main">

    <h1 class="md-headline">Sign Up</h1>

    <md-button v-if="!authenticated" @click="signup()" class="md-raised md-primary" id="signup">Sign Up</md-button>

    <md-stepper class="step" ref="stepper" v-if="authenticated" @completed="completed" @change="submit">
        <md-step md-label="Invitation Code" md-button-continue="Submit" :md-continue="user.isValid(0)" :md-error="!user.isValid(0)" :md-editable="false" id="0">
            <md-input-container md-clearable>
                <label>Invitation Code</label>
                <md-input v-model="stages[0].data.invitationCode"></md-input>
            </md-input-container>
        </md-step>

        <md-step md-label="Personal Data" md-button-continue="Submit" :md-continue="user.isValid(1)" :md-error="!user.isValid(1)" :md-disabled="!stages[0].isDone" id="1">
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


        <md-step md-label="Email" md-button-continue="Submit" :md-continue="user.isValid(2)" :md-error="!user.isValid(2)" :md-disabled="!stages[0].isDone" id="2">
            <md-input-container md-clearable>
                <label>Email</label>
                <md-input v-model="stages[2].data.email"></md-input>
            </md-input-container>
        </md-step>

        <md-step md-label="Phone Number" md-button-continue="Submit" :md-continue="user.isValid(3)" :md-error="!user.isValid(3)" :md-disabled="!stages[0].isDone" id="3">
            <md-input-container md-clearable>
                <label>Phone Number</label>
                <md-input type="tel" v-model="stages[3].data.phoneNumber"></md-input>
            </md-input-container>
        </md-step>

        <md-step md-label="Wallet Address" md-button-continue="Submit" :md-continue="user.isValid(4)" :md-error="!user.isValid(4)" :md-disabled="!stages[0].isDone" id="4">
            <md-input-container md-clearable>
                <label>Wallet Address</label>
                <md-input v-model="stages[4].data.address"></md-input>
            </md-input-container>
        </md-step>
    </md-stepper>
</div>
</template>


<script>
import auth from '@/auth'
import User from '@/utils/user'
import router from '@/router'

export default {
    name: "home",
    mounted() {
        auth.isReady()
        .then(() => {
            this.authenticated = auth.isAuthenticated();
            this.fakeSubmits = []; // Sigh...

            this.user = User.get();
            this.stages = this.user.getStages();

            const stageIndex = Number(this.$route.params.stageid) - 1;

            setTimeout(() => {
                const activeStep = this.$refs.stepper.stepList[stageIndex];
                this.prevStep = stageIndex + 1;
                this.$refs.stepper.setActiveStep(activeStep);
            });

        })
    },
    data() {
        return {
            authenticated: false,
            stages: [],
            user: {}
        }
    },
    methods: {
        submit(index) { // index: the next
            const prevStage = this.prevStep;
            const nextStage = index + 1;
            const goingForward = nextStage > prevStage;

            if (this.fakeSubmits.length < 2) {
                this.fakeSubmits.push(true);
                return;
            }

            if (prevStage === nextStage) {
                return;
            }

            if (this.stages[prevStage - 1].isDone || !goingForward  || !this.user.isValid(prevStage - 1)) {
                this.prevStep = nextStage;
                return this.gotoStage(nextStage);
            }

            return User.submitStageData(prevStage - 1, this.stages[prevStage - 1].data)
            .then(user => this.user = user)
            .then(() => this.stages = this.user.getStages())
            .then(() => this.prevStep = nextStage)
            .then(() => this.gotoStage(nextStage))
        },
        completed() {
            const last = this.stages.length - 1;

            return User.submitStageData(last, this.stages[last].data)
            .then(user => this.user = user)
            .then(() => this.stages = this.user.getStages())
            .then(() => this.prevStep = last);
        },
        gotoStage(index) {
            router.push(`/stage/${index}`);
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
<style>
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

.md-steps-navigation {
    overflow-x: auto !important;
}
</style>
