function passcheck(config) {

    function transformConfig(config) {

        var scoring = {
            base: config.scoring && config.scoring.base ? config.scoring.base : null,
            medium: {
                min: config.scoring && config.scoring.medium && config.scoring.medium.min ? config.scoring.medium.min && config.scoring.medium.min : null,
                max: config.scoring && config.scoring.medium && config.scoring.medium.max ? config.scoring.medium.max && config.scoring.medium.max : null,
                bonus: config.scoring && config.scoring.medium && config.scoring.medium.bonus ? config.scoring.medium.max && config.scoring.medium.bonus : null
            },
            strong: {
                min: config.scoring && config.scoring.strong && config.scoring.strong.min ? config.scoring.strong.min && config.scoring.strong.min : null,
                max: config.scoring && config.scoring.strong && config.scoring.strong.max ? config.scoring.strong.max && config.scoring.strong.max : null,
                bonus: config.scoring && config.scoring.strong && config.scoring.strong.bonus ? config.scoring.strong.max && config.scoring.strong.bonus : null
            }
        }

        var policies = {
            medium: {
                pattern: config.policies && config.policies.medium && config.policies.medium.pattern ? config.policies.medium.pattern : null,
                minimum: config.policies && config.policies.medium && config.policies.medium.minimum ? config.policies.medium.minimum : null
            },
            strong: {
                pattern: config.policies && config.policies.strong && config.policies.strong.pattern ? config.policies.strong.pattern : null,
                minimum: config.policies && config.policies.strong && config.policies.strong.minimum ? config.policies.strong.minimum : null
            }
        }

        var transformed = {
            scoring: scoring,
            policies: policies
        }

        return transformed;
    }

    function getNumericStrength(value, satisfaction) {

        var special = {
            'specialCharacters': {'count': /[^\w\s]/.test(value) ? value.match(/[^\w\s]/g).length : 0},
            'capitalCharacters': {'count': /[A-Z]/.test(value) ? value.match(/[A-Z]/g).length : 0},
            'numericCharacters': {'count': /\d+/.test(value) ? value.match(/\d/g).length : 0}
        }

        var bonus = 0;

        var n = value.length;

        var maximum = satisfaction === 0 ?
            config.scoring.medium.min : satisfaction === 1 ?
            config.scoring.medium.max : config.scoring.strong.max;

        var minimum = satisfaction === 2 ?
            config.scoring.strong.min : satisfaction === 1 ?
            config.scoring.medium.min : 0;

        if (satisfaction === 0) {
            n = (value.length * config.scoring.base);
        }

        if (satisfaction === 1) {
            n = minimum + (value.length * config.scoring.base);

            if (value.length > config.policies.medium.minimum) {
                bonus += special.numericCharacters.count * config.scoring.medium.bonus;
                bonus += special.specialCharacters.count * config.scoring.medium.bonus;
                bonus += special.capitalCharacters.count * config.scoring.medium.bonus;
            }

            n += bonus;
        }

        if (satisfaction === 2) {
            n = minimum + ((value.length * config.scoring.base) - config.policies.strong.minimum);

            if (value.length > config.policies.strong.minimum) {
                bonus += special.numericCharacters.count * config.scoring.strong.bonus;
                bonus += special.specialCharacters.count * config.scoring.strong.bonus;
                bonus += special.capitalCharacters.count * config.scoring.strong.bonus;
            }

            n += bonus;
        }

        n = n < minimum ? minimum : n > maximum ? maximum : n;

        return n;
    }

    config = transformConfig(config);

    function check(value) {

        var result = {'weak': false, 'medium': false, 'strong': false, 'score': 0};

        var satisfaction = 0;

        if (new RegExp(config.policies.strong.pattern + '.{' + config.policies.strong.minimum + ',}$').test(value)) {
            result.strong = true;
            satisfaction = 2;
        } else if (new RegExp(config.policies.medium.pattern + '.{' + config.policies.medium.minimum + ',}$').test(value)) {
            result.medium = true;
            satisfaction = 1;
        } else {
            result.weak = true;
        }

        result.score = getNumericStrength(value, satisfaction);

        return result;
    }

    return {
        check: check
    }
}

var config = {
    policies: {
        medium: {
            pattern: '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])',
            minimum: 8
        },
        strong: {
            pattern: '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\\w\\s])',
            minimum: 12
        }
    },
    scoring: {
        base: 1,
        medium: {
            min: 40,
            max: 65,
            bonus: 1.25
        },
        strong: {
            min: 65,
            max: 100,
            bonus: 1.50
        }
    }
};

var pc = new passcheck(config);

var password = 'something';

var result = pc.check(password);

console.log(result);


module.exports.passcheck = passcheck;