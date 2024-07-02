import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createVfm } from 'vue-final-modal'

import App from './App.vue';
import { useSiteInfo } from './stores/siteInfo';
import { useCartInfo } from './stores/cartInfo';
import router from './router'

import 'vue-final-modal/style.css'
import "./assets/style/main.scss";
import '@vuepic/vue-datepicker/dist/main.css'

const app = createApp(App);

const pinia = createPinia();
const vfm = createVfm()

app.use(pinia);
app.use(router)
app.use(vfm)

useSiteInfo().getSiteSettings().then(() => {
    app.config.globalProperties.$store = {
        siteInfo: useSiteInfo(),
        cartInfo: useCartInfo()
    }
    app.config.globalProperties.$mainSite = import.meta.env.VITE_MAIN_SITE
    document.title = useSiteInfo().siteInfo.sitename
    app.mount('#app');
});
