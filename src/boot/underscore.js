import { boot } from 'quasar/wrappers'
import _ from 'underscore'

export default boot(async ({ app }) => {
  app.provide('_', _)
})
