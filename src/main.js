import '@/assets/fonts'
import '@/assets/main.sass'

import { createPinia } from 'pinia'
import { createApp } from 'vue'

import App from '@/App.vue'
import router from '@/router'

import '@quasar/extras/material-icons/material-icons.css'
import { Dialog, Loading, Notify, Quasar } from 'quasar'
import quasarLang from 'quasar/lang/ru'
import 'quasar/src/css/index.sass'

const app = createApp(App)

app.use(createPinia())
app.use(router)
  .use(Quasar, {
    plugins: { Loading, Dialog, Notify },
    lang: quasarLang,
  })

  app.mount('#app')
