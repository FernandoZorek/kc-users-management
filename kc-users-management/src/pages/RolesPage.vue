<template>
  <div class="q-pa-md">
    <q-table
      :title="i18n.t('roles')"
      :rows="rows"
      :columns="columns"
      :pagination="initialPagination"
      row-key="id"
    />
  </div>
</template>

<script setup>
import { inject, reactive, ref, onBeforeMount, onMounted } from "vue";
import Roles from "../services/roles";
const i18n = inject("i18n");
const emitter = inject("emitter");

const initialPagination = {
        sortBy: 'path',
        descending: false,
        rowsPerPage: 10
      }

const columns = reactive([
  {
    name: "name",
    align: "center",
    label: i18n.t("name"),
    field: "name",
    sortable: true,
  },
  {
    name: "description",
    label: i18n.t("description"),
    field: "description",
    sortable: true,
  }
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
  rows.value = await Roles.query()
});
</script>
