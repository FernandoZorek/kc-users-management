# KC USERS MANAGEMENT (kc-users-management)

KEYCLOAK USERS MANAGEMENT

## Install the dependencies

```bash
yarn
```

### Open hosts file:

```sh
sudo nano /etc/hosts
```

### Add new line:

```sh
127.0.0.1       frontend
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)

```bash
docker-compose up
```

### Config DB

```bash
Open DB and create schema "keycloak"
```

### Config Keycloak:

```sh
Create realm "firstrealm"
Create client "frontend" (Client Protocol: openid-connect / Access Type: public)
```

### Build the app for production

```bash
quasar build
```

### Customize the configuration

See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-webpack/quasar-config-js).
