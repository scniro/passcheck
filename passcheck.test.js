var chai = require('chai');
var expect = chai.expect;
var passcheck = require('./passcheck');

chai.should();

describe('passcheck tests:init', function () {

    it('should have defined api method:eval', function () {
        expect(passcheck.eval).to.exist;
    });

    it('should have defined api method:config:get', function () {
        expect(passcheck.config.get).to.exist;
    });

    it('should have defined api method:config:set', function () {
        expect(passcheck.config.set).to.exist;
    });
});

describe('passcheck tests:config', function () {

    var defaultConfiguration = {
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
        },
        common: {
            test: false
        }
    };

    it('should return the default configuration', function () {

        var returned = passcheck.config.get();
        returned.should.deep.equal(defaultConfiguration)
    });

    it('should return not return the default configuration once set', function () {

        var setter = { scoring: { base: 5 } }
        passcheck.config.set(setter)
        var returned = passcheck.config.get();
        returned.should.not.deep.equal(defaultConfiguration)
    });

    it('should return the default configuration once set, then explicitly set again to the default', function () {

        var setter = { scoring: { base: 5 } }
        passcheck.config.set(setter)
        passcheck.config.set(defaultConfiguration)
        var returned = passcheck.config.get();
        returned.should.deep.equal(defaultConfiguration)
    });

    it('should set a new configuration value - supply partial object - ignore sibling values', function () {

        var setter = { scoring: { base: 5 } }
        passcheck.config.set(setter);
        var returned = passcheck.config.get();
        returned.scoring.base.should.equal(5)
        returned.scoring.medium.min.should.equal(40)
        returned.policies.medium.min.should.equal(6)
    });
});

describe('passcheck tests:eval', function () {

    it('should return the password result: weak - default configuration', function(){
        var result = passcheck.eval('pass');
        expect(result.weak).to.be.true;
        expect(result.medium).to.be.false;
        expect(result.strong).to.be.false;
    });

    it('should return the password result: medium - default configuration', function(){
        var result = passcheck.eval('Passs1');
        expect(result.weak).to.be.false;
        expect(result.medium).to.be.true;
        expect(result.strong).to.be.false;
    });

    it('should return the password result: strong - default configuration', function(){
        var result = passcheck.eval('Passs12!');
        expect(result.weak).to.be.false;
        expect(result.medium).to.be.false;
        expect(result.strong).to.be.true;
    });
});