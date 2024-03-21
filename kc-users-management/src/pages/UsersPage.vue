<template>
  <div class="q-pa-md">
    <q-table
      :title="i18n.t('users')"
      :rows="rows"
      :columns="columns"
      row-key="username"
      @row-click="onRowClick"
    />
  </div>
  <q-page-sticky position="bottom-right" :offset="[40, 80]" class="over-all">
    <q-btn fab icon="add" color="primary" @click="modal=true" class="q-ma-sm"/>
  </q-page-sticky>
  <ModalUser
    :modal="modal"
    :modalData="modalData"
    @reload="loadUsers()"
  />
</template>

<script setup>
import { inject, reactive, ref, onBeforeMount, onMounted } from "vue";
import Users from "../services/users";
import ModalUser from "../modals/ModalUser.vue";
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

const modal = ref(false);
const modalData = ref({});

function onRowClick (evt, row) {
  modal.value = !modal.value
  modalData.value = row
}

async function loadUsers () {
  rows.value = (await Users.query()).map(el => {
    return {
      ...el,
      createdAt: formatDate(new Date(el.createdTimestamp), i18n.t('dateMask'))
    }
  });
}

onBeforeMount(() => {
  emitter.on("newLocale", () => {
    for (const newTranslate of columns) {
      newTranslate.label = i18n.t(newTranslate.name);
    }
  });
});
onMounted(async () => {
  await loadUsers()
});
</script>
