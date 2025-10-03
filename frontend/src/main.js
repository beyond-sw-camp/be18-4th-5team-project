import { createApp } from 'vue'
import { createPinia } from 'pinia';
import App from './App.vue'
import router from './router'
import '@mdi/font/css/materialdesignicons.css'
import vuetify from './plugins/vuetify'

// Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css'

// Bootstrap JS
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

const app = createApp(App)
const pinia = createPinia();

router.afterEach(() => {
  const msg = sessionStorage.getItem('global_notice')
  if (msg) {
    // 토스트 플러그인 있으면 그걸로, 없으면 alert로
    if (window.$toast) window.$toast(msg)
    else alert(msg)
    sessionStorage.removeItem('global_notice')
  }
})

app.use(router)      
app.use(vuetify)         
app.use(pinia).use(router)


import { useNotificationStore } from './stores/notifications'

const notif = useNotificationStore();
notif.init();

app.mount('#app')
