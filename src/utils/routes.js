export default [{
        method: 'GET',
        url: 'api/v1/me',
        response: getMeResponse()
    },
    {
        method: 'POST',
        url: 'api/v1/me/invitationcode',
        response: getMeResponse()
    },
    {
        method: 'POST',
        url: 'api/v1/me/studentdata',
        response: getMeResponse()
    },
    {
        method: 'POST',
        url: 'api/v1/me/studentdemail',
        response: getMeResponse()
    }
];

function getMeResponse() {
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
