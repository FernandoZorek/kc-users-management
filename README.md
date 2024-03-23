# KEYCLOAK USERS MANAGEMENT
## _kc-users-management_


> This is a frontend application integrated with Keycloak,
> which allows you to manage users, groups and roles,
> through a user-friendly interface.
> The main idea of this application is to serve as a base
> enabling the development of new features for the needs of each application.

## Features

- Manage user: list; create; edit; delete; link users to groups; grant roles;
- Manage groups: list; create; edit; move groups of levels; delete;
- Manage roles: list; create; edit; delete;


## Tech

This project uses several open source projects to function correctly::

- [Docker] - Platform for developing, shipping, and running applications using containerization;
- [Keycloak] - Open-source Identity and Access Management solution;
- [MYSQL] -  - Relational database management system for data storage;
- [Node.js] - JavaScript runtime built on Chrome’s V8 JavaScript engine;
- [VueJS] - A progressive JavaScript framework for building performant and versatile web user interfaces;
- [Quasar.js] - Configuration file for Quasar Framework, a Vue.js based framework;
- [i18n] - Abbreviation for ‘internationalization’, a process of designing applications for multiple languages;
- [DarkMode] - Dark Mode is a supplemental mode that can be used to display mostly dark surfaces on the UI;
- [Underscorejs] - JavaScript library that provides functional programming support;
- [Mitt] - Lightweight, functional event emitter / pubsu;
- [DateFn]- Part of date-fns library, a modern JavaScript date utility library;
- [Axios] - Axios - Promise-based HTTP client for the browser and Node.js;

## Installation

Dillinger requires [Node.js](https://nodejs.org/) v20+ to run.

Install the dependencies and devDependencies and start the server.

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
Create user with role realm-management > realm-admin
```

### Build the app for production

```bash
quasar build
```

## License

MIT
**Free Software, Hell Yeah!**

[//]: # (These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)
[Docker]: <https://docs.docker.com/>
[Keycloak]: <https://www.keycloak.org/docs-api/21.0.1/rest-api/index.html#_version_information>
[MYSQL]: <https://dev.mysql.com/doc/>
[Node.js]: <https://nodejs.org/docs/latest/api/>
[VueJS]: <http://angularjs.org>
[Quasar.js]: <https://v2.quasar.dev/>
[i18n]: <https://vue-i18n.intlify.dev/>
[DarkMode]: <https://quasar.dev/quasar-plugins/dark#installation>
[Underscorejs]: <https://underscorejs.org/>
[Mitt]: <https://github.com/developit/mitt>
[DateFn]: <https://date-fns.org/docs/Getting-Started>
[Axios]: <https://axios-http.com/docs/intro>

