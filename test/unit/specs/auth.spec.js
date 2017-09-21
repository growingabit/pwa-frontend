import Vue from 'vue'
import auth from '@/auth'
import VueResource from 'vue-resource'

Vue.use(VueResource);

describe('auth.js', () => {
    beforeEach(function() {
        auth.logout();
    })

    it('should set a given token', () => {
        auth.setToken('test');
        expect(auth.isAuthenticated())
            .to.equal(true)
    })

    it('should logout and remove the token', () => {
        auth.setToken('test');
        expect(auth.isAuthenticated())
            .to.equal(true);

        auth.logout();
        expect(auth.isAuthenticated())
            .to.equal(false);
    })
});
