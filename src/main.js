import { createApp } from 'vue';
import 'bootstrap';
import axios from 'axios';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faBackspace, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import VueLoading from 'vue-loading-overlay';
import router from './router';
import App from './App.vue';
import 'vue-loading-overlay/dist/vue-loading.css';

library.add(faBackspace, faChevronDown);
const app = createApp(App);

app.config.globalProperties.axios = axios;
app.use(router).use(VueLoading).component('font-awesome-icon', FontAwesomeIcon).mount('#app');
