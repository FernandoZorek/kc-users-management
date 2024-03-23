<template>
  <div class="q-pa-md">
    <q-table
      :title="i18n.t('groups')"
      :rows="rows"
      :columns="columns"
      :pagination="initialPagination"
      row-key="id"
      @row-click="onRowClick"
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
  <q-page-sticky position="bottom-right" :offset="[40, 80]" class="over-all">
    <q-btn fab icon="add" color="primary" @click="newGroup()" class="q-ma-sm"/>
  </q-page-sticky>
  <ModalGroup :modal="modal" :modalData="modalData" @reload="loadGroups()" />
</template>

<script setup>
import { inject, reactive, ref, onBeforeMount, onMounted } from "vue";
import Groups from "../services/groups";
import ModalGroup from "../modals/ModalGroup.vue";
const i18n = inject("i18n");
const emitter = inject("emitter");

const initialPagination = {
  sortBy: "path",
  descending: false,
  rowsPerPage: 10,
};

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
    field: val => val.subGroups ? val.subGroups.join("<br>") : null,
    type: "html",
  },
]);

const rows = ref([]);
const modal = ref(false);
const modalData = ref({});

function onRowClick(evt, row) {
  modal.value = !modal.value;
  row.groupsList = rows.value;
  modalData.value = row;
}

async function loadGroups() {
  const groups = await Groups.query();
  rows.value = await Groups.extract(groups);
}

async function newGroup() {
  modal.value = !modal.value;
  modalData.value = { id: null, groupsList: rows.value };
}

onBeforeMount(() => {
  emitter.on("newLocale", () => {
    for (const newTranslate of columns) {
      newTranslate.label = i18n.t(newTranslate.name);
    }
  });
});

onMounted(async () => {
  await loadGroups();
});
</script>
