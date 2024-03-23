<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          <q-btn
            flat
            color="white"
            :label="i18n.t('kcUsersManagement')"
            to="/"
          />
          <q-badge color="primary">v1.0.0</q-badge>
        </q-toolbar-title>

        <div class="row flex flex-center">
          <div class="col-6">
            <LanguageSelector />
          </div>
          <div class="col-6">
            <UserProfile />
          </div>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header>
          {{ i18n.t("usersManagement") }}
        </q-item-label>

        <EssentialLink :linksList="linksList" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, inject, onBeforeMount, reactive } from "vue";
import UserProfile from "components/UserProfile.vue";
import EssentialLink from "components/EssentialLink.vue";
import LanguageSelector from "components/LanguageSelector.vue";

const api = inject("api");
const i18n = inject("i18n");
const keycloak = inject("keycloak");
const emitter = inject("emitter");
const linksList = reactive([
  {
    title: i18n.t("users"),
    caption: i18n.t("usersText"),
    icon: "person",
    link: "/users",
    key: "users",
  },
  {
    title: i18n.t("groups"),
    caption: i18n.t("groupsText"),
    icon: "group",
    link: "/groups",
    key: "groups",
  },
  {
    title: i18n.t("roles"),
    caption: i18n.t("rolesText"),
    icon: "lock",
    link: "/roles",
    key: "roles",
  },
]);

const leftDrawerOpen = ref(false);
const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

onBeforeMount(() => {
  api.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${keycloak.getAccessToken()}`;
  emitter.on("newLocale", () => {
    for (const newTranslate of linksList) {
      newTranslate.title = i18n.t(newTranslate.key);
      newTranslate.caption = i18n.t(`${newTranslate.key}Text`);
    }
  });
});
</script>
