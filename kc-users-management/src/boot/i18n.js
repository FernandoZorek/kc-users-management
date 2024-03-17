import { boot } from 'quasar/wrappers'
import { createI18n } from 'vue-i18n'
import messages from 'src/i18n'

const i18nGlobal = createI18n({
  locale: 'en-US',
  globalInjection: true,
  messages
})
const i18n = i18nGlobal.global
export default boot(({ app }) => {
  app.provide('i18n', i18n)
})
export { i18n }
