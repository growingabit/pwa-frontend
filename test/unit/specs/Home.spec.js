import Vue from 'vue'
import Home from '@/components/Home'
import VueResource from 'vue-resource'

Vue.use(VueResource);

describe('Home.vue', () => {
    it('should render correct contents', () => {
        const Constructor = Vue.extend(Home)
        const vm = new Constructor().$mount()
        expect(vm.$el.querySelector('.home h1').textContent)
            .to.equal('Home')
    })
})
