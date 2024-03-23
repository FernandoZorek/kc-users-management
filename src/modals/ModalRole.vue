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
              v-model="dataRole.name"
              type="text"
              :rules="[
                (val) => (val && val.length > 0) || '*Campo Obrigatório',
              ]"
            />
          </div>
          <div class="col-12 q-px-sm">
            <q-input
              :label="i18n.t('description')"
              outlined
              v-model="dataRole.description"
              type="text"
              :rules="[
                (val) => (val && val.length > 0) || '*Campo Obrigatório',
              ]"
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
              v-if="dataRole.id"
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
import Roles from "../services/roles";

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
const dataRole = reactive({
  id: "",
  name: "",
  description: ""
});

function deleteGroup() {
  $q.dialog({
    title: i18n.t("delete"),
    message: i18n.t("deleteText"),
    cancel: true,
    persistent: true,
  })
    .onOk(async () => {
      await Roles.delete(dataRole.id);
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
    if (dataRole.id) {
      await Roles.edit(
        {
          name: dataRole.name,
          description: dataRole.description
        },
        dataRole.id
      );
    } else {
      await Roles.create({
          name: dataRole.name,
          description: dataRole.description
      });
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
  if(data.value.id) {
    dataRole.id = data.value.id;
    dataRole.name = data.value.name;
    dataRole.description = data.value.description;
  } else {
    dataRole.name = null
    dataRole.description = null;
  }
});
watch(modal, async () => {
  isModalOpen.value = true;
  stateBtn.value = false;
});
</script>
