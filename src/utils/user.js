import Vue from 'vue'
import dataModels from '@/utils/data-models'
import config from '@/utils/config'

const apiUrl = config.apiUrl;

class Req {
    constructor(path, method) {
        this.path = path;
        this.method = method || 'post';
    }
}

const stagesEndpointsMap = [
    new Req('api/v1/me/invitationcode'),
    new Req('api/v1/me/studentdata'),
    new Req('api/v1/me/studentemail'),
    new Req('api/v1/me/studentphone'),
    new Req('api/v1/me/walletsetup'),
    new Req('api/v1/me/blockcerts', 'get'),
    new Req('api/v1/me/parentphone')
];

const stagesNames = [
    'Codice di Invito',
    'Dati Personali',
    'Indirizzo Email',
    'Numero di Telefono',
    'Indirizzo Wallet',
    'Otp Blockcerts',
    'Numero di Telefono Genitore'
];

let user;

class User {
    static get() {
        return user;
    }

    static load() {
        return Vue.http.get(`${apiUrl}/api/v1/me`)
        .then(res => new User(res.body))
        .then((usr) => {
            user = usr;
            return user;
        });
    }

    static retrieveStageData(stageIndex) {
        stageIndex -= 1;
        const req = stagesEndpointsMap[stageIndex];
        return Vue.http[req.method](`${apiUrl}/${req.path}`)
        .then(res => new User(res.body))
        .then((usr) => {
            user = usr;
            return user;
        });
    }

    static submitStageData(stageIndex, data) {
        stageIndex -= 1;
        const req = stagesEndpointsMap[stageIndex];
        const stageModels = dataModels[stageIndex];

        const body = Object.keys(data)
        .reduce((result, key) => {
            const model = stageModels[key];
            const val = model.transformOutput(data[key]);
            result[key] = val;
            return result;
        }, {});

        return Vue.http[req.method](`${apiUrl}/${req.path}`, body)
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

        this.signupDone = data.signupDone;
        this.stages = [];
        ['mandatorySignupStages', 'signupStages']
        .forEach((key) => {
            Object.keys(data[key])
            .reduce((stages, index) => {
                const stage = data[key][index];

                stage.mandatory = key === 'mandatorySignupStages';
                stage.stage = Number(index) + 1; // Set stage number for view
                stage.path = `/stage/${stage.stage}`;
                stage.awaitingVerification = !stage.isDone && !!stage.data;
                stage.name = stagesNames[index];

                stage.data = Object.keys(dataModels[index])
                .reduce((results, key) => {
                    stage.data = stage.data || {};
                    results[key] = dataModels[index][key].transformInput(stage.data[key]);
                    return results;
                }, {});

                stages[index] = stage;
                return stages;
            }, this.stages);
        });
    }

    getStage(i) {
        return this.stages[i - 1];
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
        stageIndex -= 1;
        const stages = this.getStages();
        return stages[stageIndex] && !stages[stageIndex].disabled;
    }


    isStageValid(stageIndex) {
        stageIndex -= 1;
        const model = dataModels[stageIndex];
        const defKeys = Object.keys(model);
        const stage = this.stages[stageIndex];

        return defKeys.every(key => model[key].validate(stage.data[key]));
    }

    isStageFieldValid(stageIndex, fieldKey) {
        stageIndex -= 1;
        const model = dataModels[stageIndex];
        const stage = this.stages[stageIndex];

        return model[fieldKey].validate(stage.data[fieldKey]);
    }
}

export default User;
