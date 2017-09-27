class StringModel {
    constructor() {
        this.val = '';
    }

    validate(val) {
        return !!val && typeof val === 'string';
    }

    transformInput(val) {
        return val || this.val;
    }

    transformOutput(val) {
        return val;
    }
}

class EmailModel extends StringModel {
    validate(val) {
        const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return emailRegex.test(val);
    }
}

class WalletAddressModel extends StringModel {
    validate(val) {
        return val && (val[0] === '1' || val[0] === '3') &&
            (val.length >= 26 && val.length <= 35);
    }
}

class PhoneNumberModel extends StringModel {
    validate(val) {
        return val &&
            val[0] !== '+' &&
            !isNaN(Number(val)) &&
            val.length === 10;
    }

    transformInput(val) {
        return val ? val.substr(3) : this.val;
    }

    transformOutput(val) {
        return `+39${val}`;
    }
}

export default [
    { invitationCode: new StringModel() },
    {
        name: new StringModel(),
        surname: new StringModel(),
        birthdate: new StringModel()
    },
    { email: new EmailModel },
    { phoneNumber: new PhoneNumberModel() },
    { address: new WalletAddressModel() },
    { otp: new StringModel() }, // blockcerts no data required
    { phoneNumber: new PhoneNumberModel() }
];
