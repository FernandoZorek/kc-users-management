<template>
  <q-dialog v-model="isModalOpen" persistent>
    <q-card>
      <q-bar class="bg-primary text-white">
        {{ data.name }}

        <q-space />

        <q-btn dense flat icon="close" v-close-popup>
          <q-tooltip class="bg-white text-primary">Close</q-tooltip>
        </q-btn>
      </q-bar>

      <q-card-section>
        <q-form ref="form" class="row" @submit="saveData">
          <div class="col-12 q-px-sm">
            <q-input
              :label="i18n.t('name')"
              outlined
              v-model="dataGroup.name"
              type="text"
              :rules="[
                (val) => (val && val.length > 0) || '*Campo Obrigatório',
              ]"
            />
          </div>
          <div class="col-12 q-px-sm q-pb-lg">
            <q-select
              v-model="dataGroup.groups"
              :options="groupsList"
              :label="i18n.t('path')"
              option-value="id"
              option-label="path"
              outlined
              map-options
            />
          </div>
          <div class="row justify-center col-12 row q-gutter-md q-pa-md">
            <q-btn
              :label="i18n.t('save')"
              color="secondary"
              :disabled="!right"
              class="col-3"
              type="submit"
              :loading="stateBtn"
              :disable="stateBtn"
            ></q-btn>
            <q-btn
              v-if="dataGroup.id"
              :label="i18n.t('delete')"
              color="negative"
              :disabled="!right"
              class="col-3"
              @click="deleteGroup()"
              :loading="stateBtn"
              :disable="stateBtn"
            ></q-btn>
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { computed, inject, reactive, ref, watch } from "vue";
import { useQuasar } from "quasar";
import Groups from "../services/groups";

const props = defineProps({
  modal: {
    type: Boolean,
    default: false,
  },
  modalData: {
    type: Object,
    default: () => {},
  },
});
const $q = useQuasar();
const emit = defineEmits(["reload"]);
const modal = computed(() => props.modal);
const data = computed(() => props.modalData);
const isModalOpen = ref(false);
const stateBtn = ref(false);
const right = ref(true);
const i18n = inject("i18n");
const _ = inject("_");
const groupsList = ref([]);
const dataGroup = reactive({
  id: "",
  name: "",
  path: "",
  groups: ""
});

function deleteGroup() {
  $q.dialog({
    title: i18n.t("delete"),
    message: i18n.t("deleteText"),
    cancel: true,
    persistent: true,
  })
    .onOk(async () => {
      await Groups.delete(dataGroup.id);
      emit("reload", true);
      isModalOpen.value = false;
    })
    .onCancel(() => {
      return true;
    });
}

async function saveData() {
  try {
    stateBtn.value = true;
    if (dataGroup.id) {
      await Groups.edit(
        {
          name: dataGroup.name
        },
        dataGroup.id
      );
    } else {
      await Groups.create({
          name: dataGroup.name
      });
      dataGroup.id = (await Groups.query()).find(
        (el) => el.name === dataGroup.name
      ).id;
    }
    if (dataGroup.path !== dataGroup.groups.path) {
      if (!dataGroup.groups.id) {
        await Groups.create({
            name: dataGroup.name,
            id: dataGroup.id
        });
      } else {
        await Groups.move({
            name: dataGroup.groups.name,
            id: dataGroup.id
        }, dataGroup.groups.id);
      }
    }
    emit("reload", true);
    stateBtn.value = false;
    isModalOpen.value = false;
  } catch (e) {
    console.log(e);
  } finally {
    stateBtn.value = false;
  }
}

watch(data, async () => {
  const startList = {path: i18n.t('source'), id: ''}
  const completList = [startList].concat(data.value.groupsList);
  if(data.value.id) {
    dataGroup.id = data.value.id;
    dataGroup.name = data.value.name;
    dataGroup.path = data.value.path;
    dataGroup.groups = data.value.groupsList.find(el => el.path === data.value.path)
  } else {
    dataGroup.name = null
    dataGroup.path = startList.path
    dataGroup.groups = startList
  }
  groupsList.value = completList.filter(el => el.path !== dataGroup.path)
});
watch(modal, async () => {
  isModalOpen.value = true;
  stateBtn.value = false;
});
</script>
