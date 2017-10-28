import Vue from 'vue'
import User from '@/utils/user'
import VueResource from 'vue-resource'

Vue.use(VueResource);

describe('user.js', () => {
    describe('#constructor', () => {
        it('should merge all stages in one array', () => {
            const user = new User(getUserData());

            expect(user.stages.length)
            .to.equal(5);
        });

        it('should throw an error if invalid data is given', () => {
            expect(() => new User()).to.throw( Error );
        });

        it('should correctly assign "mandatory" property to correct stages', () => {
            const user = new User(getUserData())
            expect(user.stages[0].mandatory).to.equal(true);
            expect(user.stages[1].mandatory).to.equal(false);
            expect(user.stages[2].mandatory).to.equal(false);
            expect(user.stages[3].mandatory).to.equal(true);
            expect(user.stages[4].mandatory).to.equal(false);
        });
    })

    describe('#getCurrentStage', () => {
        it('should return 1 when no stage has been completed', () => {
            const user = new User(getUserData());

            expect(user.getCurrentStage().stage)
                .to.equal(1)
        });

        it('should return next stage + 1', () => {
            const data = getUserData();

            data.mandatorySignupStages['0'].isDone = true;
            let user = new User(data);
            expect(user.getCurrentStage().stage)
            .to.equal(2)

            data.signupStages['1'].isDone = true;
            user = new User(data);
            expect(user.getCurrentStage().stage)
            .to.equal(3)

            data.signupStages['2'].isDone = true;
            data.mandatorySignupStages['3'].isDone = true;
            user = new User(data);
            expect(user.getCurrentStage().stage)
            .to.equal(5)
        });
    });

    describe('#getStages', () => {
        it('should return an array of stages with disabled property correctly set', () => {
            const data = getUserData();

            let user = new User(data);
            let stages = user.getStages();

            expect(stages[0].disabled)
            .to.equal(false);
            expect(stages[1].disabled)
            .to.equal(true);
            expect(stages[2].disabled)
            .to.equal(true);
            expect(stages[3].disabled)
            .to.equal(true);
            expect(stages[4].disabled)
            .to.equal(true);
        });

        it('should return an array of stages with disabled property correctly set', () => {
            const data = getUserData();

            let user = new User(data);
            let stages = user.getStages();

            data.mandatorySignupStages['0'].isDone = true;
            user = new User(data);
            stages = user.getStages();

            expect(stages[0].disabled)
            .to.equal(false);
            expect(stages[1].disabled)
            .to.equal(false);
            expect(stages[2].disabled)
            .to.equal(false);
            expect(stages[3].disabled)
            .to.equal(false);
            expect(stages[4].disabled)
            .to.equal(true);
        });
    });

    describe('#isAllowed', () => {
        it('should return true only for stage 0', () => {
            const data = getUserData();

            let user = new User(data);
            expect(user.isAllowed(1))
            .to.equal(true);
            expect(user.isAllowed(2))
            .to.equal(false);
            expect(user.isAllowed(3))
            .to.equal(false);
            expect(user.isAllowed(4))
            .to.equal(false);
            expect(user.isAllowed(5))
            .to.equal(false);
        });

        it('should return true for stages 1,2,3', () => {
            const data = getUserData();
            data.mandatorySignupStages['0'].isDone = true;
            let user = new User(data);

            expect(user.isAllowed(1))
            .to.equal(true);
            expect(user.isAllowed(2))
            .to.equal(true);
            expect(user.isAllowed(3))
            .to.equal(true);
            expect(user.isAllowed(4))
            .to.equal(true);
            expect(user.isAllowed(5))
            .to.equal(false);
        });
    });
})


function getUserData() {
    return {
        "id": "string",
        "mandatorySignupStages": {
            "0": {
                "id": 0,
                "isDone": false,
                "data": {
                    "invitationCode": "",
                }
            },
            "3": {
                "id": 0,
                "isDone": false,
                "data": {
                    "invitation_code": "string",
                    "school": "string",
                    "schoolClass": "string",
                    "schoolYear": "string",
                    "specialization": "string",
                    "realtedUserWebSafeKey": "string",
                    "confirmed": true
                }
            }
        },
        "signupStages": {
            "1": {
                "id": 0,
                "isDone": false,
                "data": {
                    "name": "",
                    "surname": "",
                    "birthdate": ""
                }
            },
            "2": {
                "id": 0,
                "isDone": false,
                "data": {
                    "email": ""
                }
            },
            "4": {
                "id": 0,
                "isDone": false,
                "data": {
                    "email": ""
                }
            }
        }
    }
}
