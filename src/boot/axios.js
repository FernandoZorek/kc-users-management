import { boot } from 'quasar/wrappers'
import axios from 'axios'
import { kcGateway } from '../components/variables.js'

const api = axios.create({ baseURL: kcGateway })

export default boot(({ app }) => {
  app.provide('api', api)
  app.provide('axios', axios)
})

export { api }
