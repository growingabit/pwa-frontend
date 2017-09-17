import Vue from 'vue'

const stagesEndpointsMap = [
    'api/v1/me/invitationcode',
    'api/v1/me/studentdata',
    'api/v1/me/studentemail'
];

let user;

class User {
    static get() {
        return user;
    }

    static load() {
        return Vue.http.get('api/v1/me')
        .then(res => new User(res.body))
        .then((usr) => {
            user = usr;
            return user;
        });
    }

    static submitStageData(stageIndex, data) {
        const url = stagesEndpointsMap[stageIndex];

        return Vue.http.post(url, data)
        .then(res => new User(res.body))
        .then((usr) => {
            user = usr;
            return user;
        });
    }

    static isAllowed(stageIndex) {
        return user && user.isAllowed(stageIndex);
    }

    constructor(data) {
        if (!data || !data.id) {
            throw new Error('Invalid data');
        }

        this.id = data.id;
        this.stages = [];

        ['mandatorySignupStages', 'signupStages']
        .forEach((key) => {
            Object.keys(data[key])
            .reduce((stages, stage) => {
                stages[stage] = data[key][stage];
                stages[stage].mandatory = key === 'mandatorySignupStages';
                stages[stage].stage = stage; // Psychosis intensifies

                return stages;
            }, this.stages);
        });
    }

    getStage(i) {
        return this.stages[i];
    }

    getCurrentStage() {
        let currentStage;
        this.stages.every((stage) => {
            if (stage.isDone) {
                return true;
            }

            currentStage = stage;
            return false;
        });

        return currentStage;
    }

    getStages() {
        let limitReached = false;
        return this.stages.map((stage) => {
            stage.disabled = limitReached || stage.isDone;
            if (limitReached) {
                return stage;
            }

            limitReached = stage.mandatory && !stage.isDone;
            return stage;
        });
    }

    isAllowed(stageIndex) {
        const stages = this.getStages();
        return !stages[stageIndex].disabled;
    }
}

export default User;
