import { boot } from 'quasar/wrappers'
import { LocalStorage } from 'quasar'
import { multiTenancy, kcGateway, realm, clientId } from '../components/variables.js'
import { api } from './axios.js'

export default boot(async ({ router, app }) => {
  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop)
  })

  if (!params.e) {
    const updateToken = (keycloak, { minValidity, noRedirect, redirectUri } = {}) => {
      return keycloak.updateToken(minValidity)
        .catch((error = Error('Failed to refresh the token, or the session has expired')) => {
          if (!noRedirect) {
            keycloak.login({ redirectUri })
          }

          throw error
        })
    }

    const setupKeycloak = async () => {
      if (multiTenancy === true) {
        const multiTenancyRealm = LocalStorage.getItem('multiTenancyRealm')
        if (multiTenancyRealm) {
          realm = multiTenancyRealm
        } else {
          realm = params.realm
          if (realm) LocalStorage.set('multiTenancyRealm', realm)
        }
      }

      const oidc = {
        clientId: clientId,
        url: kcGateway,
        realm
      }

      const keycloak = window.Keycloak(oidc)
      await keycloak.init({
        initOptions: {
          checkLoginIframe: false
        }
      })

      const getRoles = () => keycloak.tokenParsed.realm_access.roles

      const checkRouteRequiredRoles = (to, from, next, { roles }) => {
        if (to.matched.some(({ meta }) => meta.requiresRole)) {
          const routes = to.matched.filter(({ meta }) => meta.requiresRole)

          if (
            routes.every(({ meta }) =>
              roles.some(role => meta.requiresRole.includes(role))
            )
          ) {
            next()
          } else {
            next('/403')
          }
        } else {
          next()
        }
      }

      router.beforeEach((to, from, next) => {
        updateToken(keycloak, { redirectUri: `${window.location.origin}${to.path}` })
          .then(() => {
            return checkRouteRequiredRoles(to, from, next, { roles: getRoles() })
          })
      })

      await updateToken(keycloak)
      return keycloak
    }

    const loadKeycloakScript = () => new Promise((resolve, reject) => {
      const script = document.createElement('script')

      script.src = kcGateway + '/js/keycloak.min.js'
      script.id = 'keycloakJs'

      script.addEventListener('load', () => {
        setupKeycloak()
          .then((keycloak) => {
            app.config.globalProperties.$auth = {
              ...keycloak,
              signOut: keycloak.logout,

              updateToken () {
                keycloak.tokenParsed.exp = keycloak.tokenParsed.iat
                return updateToken(keycloak, { noRedirect: true })
              },

              getGroups () {
                return keycloak.tokenParsed.groups
              },

              getGroupNames () {
                return keycloak.tokenParsed.groups
              },

              getUser () {
                return keycloak.tokenParsed
              },

              getAccessToken () {
                return keycloak.token
              },

              getRefreshToken () {
                return keycloak.refreshToken
              },

              isAuthenticated () {
                return keycloak.authenticated
              },

              signInWithRedirect (redirectUri) {
                return keycloak.login({ redirectUri })
              }
            }

            return resolve(keycloak)
          })
          .catch(reject)
      })

      document.body.appendChild(script)
    })

    await loadKeycloakScript()
    app.provide('keycloak', app.config.globalProperties.$auth)
    api.defaults.headers.common['Authorization'] = `Bearer ${app.config.globalProperties.$auth.getAccessToken()}`
  }
})
