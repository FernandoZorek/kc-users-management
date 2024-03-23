<template>
  <div class="q-pa-md">
    <q-table
      :title="i18n.t('roles')"
      :rows="rows"
      :columns="columns"
      :pagination="initialPagination"
      row-key="id"
      @row-click="onRowClick"
    />
  </div>
  <q-page-sticky position="bottom-right" :offset="[40, 80]" class="over-all">
    <q-btn fab icon="add" color="primary" @click="newRole()" class="q-ma-sm"/>
  </q-page-sticky>
  <ModalRole :modal="modal" :modalData="modalData" @reload="loadRoles()" />
</template>

<script setup>
import ModalRole from "../modals/ModalRole.vue";
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
const modal = ref(false);
const modalData = ref({});

function onRowClick (evt, row) {
  modal.value = !modal.value;
  modalData.value = row;
}

async function loadRoles () {
  rows.value = await Roles.query()
}

async function newRole() {
  modal.value = !modal.value;
  modalData.value = { id: null, description: null };
}

onBeforeMount (() => {
  emitter.on("newLocale", () => {
    for (const newTranslate of columns) {
      newTranslate.label = i18n.t(newTranslate.name);
    }
  });
});
onMounted (async () => {
  await loadRoles()
});
</script>
