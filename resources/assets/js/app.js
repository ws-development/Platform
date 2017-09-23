require('./bootstrap');

import Vue from 'vue'
import VueI18n from 'vue-i18n'
import VueRouter from 'vue-router'
import ElementUI from 'element-ui'
import DataTables from 'vue-data-tables'
import VueEvents from 'vue-events'
import locale from 'element-ui/lib/locale/lang/en'
import VueSimplemde from 'vue-simplemde'

Vue.use(ElementUI, { locale });
Vue.use(DataTables, { locale });
Vue.use(VueI18n);
Vue.use(VueRouter);
Vue.use(require('vue-shortkey'), { prevent: ['input', 'textarea'] });
Vue.use(VueEvents);
Vue.use(VueSimplemde);
require('./mixins');


Vue.component('ckeditor', require('../../../Modules/Core/Assets/js/components/CkEditor.vue'));
Vue.component('DeleteButton', require('../../../Modules/Core/Assets/js/components/DeleteComponent.vue'));
Vue.component('TagsInput', require('../../../Modules/Tag/Assets/js/components/TagInput.vue'));
Vue.component('SingleMedia', require('../../../Modules/Media/Assets/js/components/SingleMedia.vue'));
Vue.component('MediaManager', require('../../../Modules/Media/Assets/js/components/MediaManager.vue'));
import PageRoutes from '../../../Modules/Page/Assets/js/PageRoutes';
import MediaRoutes from '../../../Modules/Media/Assets/js/MediaRoutes';

const currentLocale =  window.AsgardCMS.currentLocale;
const adminPrefix = window.AsgardCMS.adminPrefix;

const router = new VueRouter({
    mode: 'history',
    base: `${currentLocale}/${adminPrefix}`,
    routes : [
        ...PageRoutes,
        ...MediaRoutes,
    ],
});

let messages = {
    [currentLocale]: window.AsgardCMS.translations,
};

const i18n = new VueI18n({
    locale: currentLocale,
    messages,
});

const app = new Vue({
    el: '#app',
    router,
    i18n,
});

window.axios.interceptors.response.use(null, function(error) {
    if (error.response === undefined) {
        console.log(error);
        return;
    }
    if (error.response.status === 403) {
        app.$notify.error({
            title: app.$t('core.unauthorized'),
            message: app.$t('core.unauthorized-access'),
        });
        window.location = route('dashboard.index');
    }
    if (error.response.status === 401) {
        app.$notify.error({
            title: app.$t('core.unauthenticated'),
            message: app.$t('core.unauthenticated-message'),
        });
        window.location = route('login');
    }
    return Promise.reject(error);
});
