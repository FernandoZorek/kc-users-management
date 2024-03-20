<template>
  <div class="q-pa-md">
    <q-table
      :title="i18n.t('groups')"
      :rows="rows"
      :columns="columns"
      :pagination="initialPagination"
      row-key="id"
    >
      <template v-slot:body-cell="props">
        <q-td
          :props="props"
          :style="props.col.align ? `text-align:${props.col.align}` : 0"
          @click="$emit('rowClick', props.row)"
        >
          <div v-if="props.col.type === 'html'" v-html="props.value" />
          <div v-else>
            {{ props.value }}
          </div>
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script setup>
import { inject, reactive, ref, onBeforeMount, onMounted } from "vue";
import Groups from "../services/groups";
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
    name: "path",
    label: i18n.t("path"),
    field: "path",
    sortable: true,
  },
  {
    name: "subGroups",
    label: i18n.t("subGroups"),
    field: "subGroups",
    type: "html",
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
  const groups = await Groups.query()
  rows.value = await Groups.extract(groups)
});
</script>
