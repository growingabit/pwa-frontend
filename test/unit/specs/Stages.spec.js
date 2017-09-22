import Vue from 'vue'
import Stages from '@/components/Stages'
import VueResource from 'vue-resource'

Vue.use(VueResource);

describe('Stages.vue', () => {
    it('should render correct contents', () => {
        const Constructor = Vue.extend(Stages);
        const vm = new Constructor().$mount()
        expect(vm.$el.querySelector('.main h1').textContent)
            .to.equal('Sign Up')
    })
})
