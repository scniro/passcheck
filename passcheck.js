function passcheck() {

    var self = this;

    var common;

    var defaults = getDefaultConfig();

    function getDefaultConfig() {
        return {
            policies: {
                medium: {
                    pattern: '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])',
                    min: 6
                },
                strong: {
                    pattern: '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\\w\\s])',
                    min: 8
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
    }

    var config = {
        get: function () {
            return self.configuration
        },
        set: function (options, internal) {
            function merge(config, options) {

                for (var p in options) {
                    try {
                        options[p].constructor == Object ? config[p] = merge(config[p], options[p]) : config[p] = options[p]
                    }
                    catch (e) {
                        config[p] = options[p];
                    }
                }

                return config;
            }

            self.configuration = merge(getDefaultConfig(), options)

            if (!internal)
                init();
        }
    }

    config.set(defaults, true)

    function eval(value) {

        var result = {'weak': false, 'medium': false, 'strong': false, 'score': 0};

        var tier = 0;

        console.log(common.length)

        if (new RegExp(self.configuration.policies.strong.pattern + '.{' + self.configuration.policies.strong.min + ',}$').test(value)) {
            result.strong = true;
            tier = 2;
        } else if (new RegExp(self.configuration.policies.medium.pattern + '.{' + self.configuration.policies.medium.min + ',}$').test(value)) {
            result.medium = true;
            tier = 1;
        } else {
            result.weak = true;
        }

        result.score = score(value, tier);

        return result;
    }

    function score(value, tier) {

        var special = {
            'specialCharacters': {'count': /[^\w\s]/.test(value) ? value.match(/[^\w\s]/g).length : 0},
            'capitalCharacters': {'count': /[A-Z]/.test(value) ? value.match(/[A-Z]/g).length : 0},
            'numericCharacters': {'count': /\d+/.test(value) ? value.match(/\d/g).length : 0}
        }

        var bonus = 0;

        var n = value.length;

        var maximum = tier === 0 ?
            self.configuration.scoring.medium.min : tier === 1 ?
            self.configuration.scoring.medium.max : self.configuration.scoring.strong.max;

        var minimum = tier === 2 ?
            self.configuration.scoring.strong.min : tier === 1 ?
            self.configuration.scoring.medium.min : 0;

        if (tier === 0) {
            n = (value.length * self.configuration.scoring.base);
        }

        if (tier === 1) {
            n = minimum + (value.length * self.configuration.scoring.base);

            if (value.length > self.configuration.policies.medium.min) {
                bonus += special.numericCharacters.count * self.configuration.scoring.medium.bonus;
                bonus += special.specialCharacters.count * self.configuration.scoring.medium.bonus;
                bonus += special.capitalCharacters.count * self.configuration.scoring.medium.bonus;
            }

            n += bonus;
        }

        if (tier === 2) {
            n = minimum + ((value.length * self.configuration.scoring.base) - self.configuration.policies.strong.min);

            if (value.length > self.configuration.policies.strong.min) {
                bonus += special.numericCharacters.count * self.configuration.scoring.strong.bonus;
                bonus += special.specialCharacters.count * self.configuration.scoring.strong.bonus;
                bonus += special.capitalCharacters.count * self.configuration.scoring.strong.bonus;
            }

            n += bonus;
        }

        n = n < minimum ? minimum : n > maximum ? maximum : n;

        return n;
    }

    function init() {

        if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
            var fs = require('fs');
            common =  self.configuration.testCommon && self.configuration.testCommon.limit ?
                fs.readFileSync('./passwords.txt').toString().split('\n').slice(0, self.configuration.testCommon.limit) :
                fs.readFileSync('./passwords.txt').toString().split('\n');
        } else {
            // angular place passwords in memory
        }
    }

    return {
        config: config,
        eval: eval
    }
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = new passcheck();
}

if (typeof window !== 'undefined') {
    window.passcheck = new passcheck();
}