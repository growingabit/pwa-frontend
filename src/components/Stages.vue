<template>
<div class="main">

    <h1 class="md-headline">Sign Up</h1>

    <md-button v-if="!authenticated" @click="signup()" class="md-raised md-primary" id="signup">Sign Up</md-button>

    <md-stepper id="stepper" ref="stepper" v-if="authenticated" @completed="completed" @change="submit">
        <md-step md-label="Invitation Code" md-button-continue="Submit" :md-continue="user.isValid(0)"  :md-editable="false" id="0">
            <md-input-container md-clearable v-bind:class="{ 'md-input-invalid': !user.isValid(0) }">
                <label>Invitation Code</label>
                <md-input v-model="stages[0].data.invitationCode"></md-input>
                <span class="md-error">Invalid invitation code</span>
            </md-input-container>
        </md-step>

        <md-step md-label="Personal Data" md-button-continue="Submit" :md-continue="user.isValid(1)"  :md-disabled="!stages[0].isDone" id="1">
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

        <md-step md-label="Email" md-button-continue="Submit" :md-continue="user.isValid(2)" :md-error="stages[2].awaitingVerification" :md-disabled="!stages[0].isDone" id="2">
            <md-input-container md-clearable v-bind:class="{ 'md-input-invalid': !user.isValid(2) }">
                <label>
                    <span v-if="stages[2].awaitingVerification" class="verification-error">(Waiting verification) - </span> Email
                </label>
                <md-input v-model="stages[2].data.email"></md-input>
                <span class="md-error">Invalid email</span>
            </md-input-container>
        </md-step>

        <md-step md-label="Phone Number" md-button-continue="Submit" :md-continue="user.isValid(3)" :md-error="stages[3].awaitingVerification" :md-disabled="!stages[0].isDone" id="3">
            <md-input-container md-clearable v-bind:class="{ 'md-input-invalid': !user.isValid(3) }">
                <label>
                    <span v-if="stages[3].awaitingVerification" class="verification-error">(Waiting verification) - </span> Phone Number
                </label>
                <md-input type="tel" v-model="stages[3].data.phoneNumber"></md-input>
                <span class="md-error">Invalid phone number</span>
            </md-input-container>
        </md-step>

        <md-step md-label="Wallet Address" md-button-continue="Submit" :md-continue="user.isValid(4)" :md-disabled="!stages[0].isDone" id="4">
            <md-input-container md-clearable v-bind:class="{ 'md-input-invalid': !user.isValid(4) }">
                <label>Wallet Address</label>
                <md-input v-model="stages[4].data.address"></md-input>
                <span class="md-error">Invalid wallet address</span>
            </md-input-container>
        </md-step>

        <md-step :md-error="stages[5].awaitingVerification" md-label="Blockcerts" md-button-continue="Next" id="5">
            <md-input-container>
                <label>
                    <span v-if="stages[5].awaitingVerification" class="verification-error">(Waiting verification) - </span> Blockcerts Otp
                </label>
                <md-input readonly v-model="stages[5].data.otp"></md-input>
                <span v-if="stages[5].awaitingVerification" class="md-error">Verify your blockerts otp</span>
            </md-input-container>
            <md-button v-clipboard="stages[5].data.otp" @success="copySuccess" @error="copyError">Copy</md-button>
        </md-step>

        <md-step md-label="Parent Phone Number" md-button-continue="Submit" :md-continue="user.isValid(6)" :md-error="stages[6].awaitingVerification" :md-disabled="!stages[0].isDone" id="6">
            <md-input-container md-clearable v-bind:class="{ 'md-input-invalid': !user.isValid(6) }">
                <label>
                    <span v-if="stages[6].awaitingVerification" class="verification-error">(Waiting verification) - </span> Parent Phone Number
                </label>
                <md-input type="tel" v-model="stages[6].data.phoneNumber"></md-input>
                <span class="md-error">Invalid phone number</span>
            </md-input-container>
        </md-step>
    </md-stepper>

    <md-snackbar md-position="bottom right" ref="snackbar">
        <span>{{message}}</span>
        <md-button class="md-accent" md-theme="light-blue" @click="$refs.snackbar.close()">Close</md-button>
    </md-snackbar>
</div>
</template>


<script>
import auth from '@/utils/auth'
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
            user: {},
            message: ''
        }
    },
    methods: {
        copySuccess() {
            this.message = 'Copied!';
            this.$refs.snackbar.open();
        },
        copyError(foo) {
            this.message = 'An error happened during copy. Please try manually.';
            this.$refs.snackbar.open();
        },
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

            const stopConditions = [
                this.stages[prevStage - 1].isDone,
                this.stages[prevStage - 1].awaitingVerification,
                !goingForward,
                !this.user.isValid(prevStage - 1)
            ]

            if (stopConditions.some(cond => cond)) {
                this.prevStep = nextStage;
                return this.gotoStage(nextStage);
            }

            if (nextStage == 7) {
                return;
            }

            return User.submitStageData(prevStage - 1, this.stages[prevStage - 1].data)
            .then(user => this.user = user)
            .then(() => this.stages = this.user.getStages())
            .then(() => this.prevStep = nextStage)
            .then(() => this.gotoStage(nextStage))
            .then(() => {
                this.message = `Stage ${prevStage} submitted!`;
                this.$refs.snackbar.open();
            })
            .then(() => {
                if (nextStage == 6) {
                    return User.retrieveStageData(nextStage)
                    .then(user => this.user = user)
                    .then(() => this.stages = this.user.getStages())
                }
            })
            .catch((err) => {
                console.log(err);
                this.message = `An error happened while submitting stage ${prevStage} data.`;
                this.$refs.snackbar.open();
            });
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

#stepper nav::-webkit-scrollbar {
    height: 8px;
    padding-right: 10px;
}

#stepper nav::-webkit-scrollbar-thumb {
    background-color: rgba(0,0,0,.3);
    border-radius: 4px;
}

#stepper nav::-webkit-scrollbar-track {
    background:rgba(0,0,0,0);
}

.verification-error {
    color: #f44336;
}
</style>
