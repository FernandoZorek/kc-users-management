module.exports = {
  clientId: String(window._env_.CLIENT_ID),
  realm: String(window._env_.REALM),
  kcGateway: String(window._env_.KC_GATEWAY),
  multiTenancy: Boolean(JSON.parse(window._env_.MULTITENANCY))
}
