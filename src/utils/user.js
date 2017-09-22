import Vue from 'vue'
import dataModels from '@/utils/data-models'

const stagesEndpointsMap = [
    'api/v1/me/invitationcode',
    'api/v1/me/studentdata',
    'api/v1/me/studentemail',
    'api/v1/me/studentphone',
    'api/v1/me/walletsetup'
];

let user;

class User {
    static get() {
        return user;
    }

    static load() {
        return Vue.http.get('http://localhost:8080/api/v1/me')
        .then(res => new User(res.body))
        .then((usr) => {
            user = usr;
            return user;
        });
    }

    static submitStageData(stageIndex, data) {
        const url = stagesEndpointsMap[stageIndex];

        return Vue.http.post(`http://localhost:8080/${url}`, data)
        .then(res => new User(res.body))
        .then((usr) => {
            user = usr;
            return user;
        });
    }

    constructor(data) {
        if (!data) {
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
                stages[stage].stage = Number(stage) + 1; // Set stage number for view

                if (!stages[stage].data) {
                    stages[stage].data = Object.keys(dataModels[stage])
                    .reduce((results, key) => {
                        results[key] = dataModels[stage][key].val;
                        return results;
                    }, {});
                }
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
            stage.disabled = limitReached;
            if (limitReached) {
                return stage;
            }

            limitReached = stage.mandatory && !stage.isDone;
            return stage;
        });
    }

    isAllowed(stageIndex) {
        const stages = this.getStages();
        return stages[stageIndex] && !stages[stageIndex].disabled;
    }


    isValid(stageIndex) {
        const defData = dataModels[stageIndex];
        const defKeys = Object.keys(defData);
        const stage = this.stages[stageIndex];

        return defKeys.every(key => defData[key].validate(stage.data[key]));
    }
}

export default User;
