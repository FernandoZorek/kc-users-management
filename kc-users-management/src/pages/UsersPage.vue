<template>
  <div class="q-pa-md">
    <q-table
      :title="i18n.t('users')"
      :rows="rows"
      :columns="columns"
      row-key="name"
    />
  </div>
</template>

<script setup>
import { inject, reactive, ref, onBeforeMount, onMounted } from "vue";
import Users from "../services/Users.js";
const i18n = inject("i18n");
const emitter = inject("emitter");
const formatDate = inject("formatDate");

const columns = reactive([
  {
    name: "firstName",
    align: "center",
    label: i18n.t("firstName"),
    field: "firstName",
    sortable: true,
  },
  {
    name: "lastName",
    label: i18n.t("lastName"),
    field: "lastName",
    sortable: true,
  },
  {
    name: "username",
    label: i18n.t("username"),
    field: "username"
   },
  {
    name: "email",
    label: i18n.t("email"),
    field: "email"
  },
  {
    name: "createdAt",
    label: i18n.t("createdAt"),
    field: "createdAt",
    sortable: true,
  },
]);

const rows = ref([]);
onBeforeMount(() => {
  emitter.on("newLocale", () => {
    for (const newTranslate of columns) {
      newTranslate.label = i18n.t(newTranslate.name);
    }
  });
});
onMounted(async () => {
  rows.value = (await Users.query()).map(el => {
    return {
      ...el,
      createdAt: formatDate(new Date(el.createdTimestamp), i18n.t('dateMask'))
    }
  });
});
</script>
