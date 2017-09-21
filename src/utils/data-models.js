class StringValidate {
    constructor() {
        this.val = '';
    }

    validate(val) {
        return !!val && typeof val === 'string';
    }
}

class EmailValidate extends StringValidate {
    validate(val) {
        const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return emailRegex.test(val);
    }
}

class WalletAddressValidate extends StringValidate {
    validate(val) {
        return (val[0] === '1' || val[0] === '3') &&
            (val.length >= 26 && val.length <= 35);
    }
}

export default [
    { invitationCode: new StringValidate() },
    {
        name: new StringValidate(),
        surname: new StringValidate(),
        birthdate: new StringValidate()
    },
    { email: new EmailValidate },
    { phoneNumber: new StringValidate() },
    { address: new WalletAddressValidate() }
];
