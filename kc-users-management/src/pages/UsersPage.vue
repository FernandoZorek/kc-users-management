
<template>
  <q-page class="flex flex-center">
    <h3>{{ i18n.t("usersText") }}</h3>
  </q-page>
</template>

<script setup>

import {inject} from "vue";
const i18n = inject("i18n");
</script>
