<template>
  <q-dialog v-model="isModalOpen" persistent>
    <q-card>
      <q-bar class="bg-primary text-white">
        {{ data.firstName }}

        <q-space />

        <q-btn dense flat icon="close" v-close-popup>
          <q-tooltip class="bg-white text-primary">Close</q-tooltip>
        </q-btn>
      </q-bar>

      <q-card-section>
        <q-form ref="form" class="row" @submit="saveData">
          <div class="col-6 q-px-sm">
            <q-input
              :label="i18n.t('firstName')"
              outlined
              v-model="dataUser.firstName"
              type="text"
              :rules="[
                (val) => (val && val.length > 0) || '*Campo Obrigatório',
              ]"
            />
          </div>
          <div class="col-6 q-px-sm">
            <q-input
              :label="i18n.t('lastName')"
              outlined
              v-model="dataUser.lastName"
              type="text"
              :rules="[
                (val) => (val && val.length > 0) || '*Campo Obrigatório',
              ]"
            />
          </div>
          <div class="col-6 q-px-sm q-pb-lg">
            <q-select
              v-model="dataUser.groups"
              :options="groupsList"
              :label="i18n.t('groups')"
              outlined
              multiple
              map-options
              emit-value
            />
          </div>
          <div class="col-6 q-px-sm q-pb-lg">
            <q-select
              v-model="dataUser.roles"
              :options="rolesList"
              :label="i18n.t('roles')"
              outlined
              multiple
              map-options
              emit-value
            />
          </div>
          <div class="col-6 q-px-sm">
            <q-input
              :label="i18n.t('username')"
              outlined
              v-model="dataUser.username"
              type="text"
              :rules="[
                (val) => (val && val.length > 0) || '*Campo Obrigatório',
              ]"
            />
          </div>
          <div class="col-6 q-px-sm">
            <q-input
              :label="i18n.t('email')"
              outlined
              v-model="dataUser.email"
              type="text"
            />
          </div>
          <div class="col-6 q-px-sm">
            <q-input
              :label="i18n.t('password')"
              outlined
              v-model="dataUser.password"
              :type="dataUser.isPwd ? 'password' : 'text'"
            >
              <template v-slot:append>
                <q-icon
                  :name="dataUser.isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="dataUser.isPwd = !dataUser.isPwd"
                />
              </template>
            </q-input>
          </div>
          <div class="col-6 q-px-sm">
            <q-input
              :label="i18n.t('repeatPassword')"
              outlined
              v-model="dataUser.password2"
              :type="dataUser.isPwd2 ? 'password' : 'text'"
              @keypress.enter="login()"
              :rules="[(val) => passCheck(val) || '*Senhas não conferem']"
            >
              <template v-slot:append>
                <q-icon
                  :name="dataUser.isPwd2 ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="dataUser.isPwd2 = !dataUser.isPwd2"
                />
              </template>
            </q-input>
          </div>
          <div class="col-12 row justify-center q-pa-sm">
            <q-checkbox
              left-label
              v-model="dataUser.temporary"
              :label="i18n.t('temporaryPassword')"
              checked-icon="task_alt"
              unchecked-icon="highlight_off"
            />
          </div>
          <div class="col-12 row justify-center q-pa-sm">
            <q-btn
              :label="i18n.t('save')"
              color="secondary"
              :disabled="!right"
              class="col-6"
              type="submit"
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
import { inject, ref, watch, computed, reactive } from "vue";
import Users from "../services/users";
import Groups from "../services/groups";
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
const emit = defineEmits(['reload'])
const modal = computed(() => props.modal);
const data = computed(() => props.modalData);
const isModalOpen = ref(false);
const stateBtn = ref(false);
const right = ref(true);
const i18n = inject("i18n");
const _ = inject("_");
const rolesList = ref([])
const rolesUser = ref([])
const groupsList = ref([])
const groupsUser = ref([])
const dataUser = reactive({
  id: '',
  firstName: '',
  lastName: '',
  email: '',
  username: '',
  temporary: true,
  password: '',
  password2: '',
  groups: [],
  roles: [],
  isPwd: true,
  isPwd2: true
})

function passCheck(val) {
  if (dataUser.password) {
    return val === dataUser.password ? true : false;
  }
  return true;
}

async function groupsLoad() {
  const groups = await Groups.query();
  groupsList.value = (await Groups.extract(groups)).map((el) => {
    return {
      label: el.name,
      value: el.id,
    };
  });
  if(dataUser.id) {
    const listUsers = await Users.listGroups(dataUser.id);
    groupsUser.value = listUsers.map((el) => {
      return {
        label: el.name,
        value: el.id,
      };
    });
    dataUser.groups = groupsUser.value
  }
}

async function rolesLoad() {
  rolesList.value = (await Roles.query()).map((el) => {
    return {
      label: el.name,
      value: el.id,
    };
  });
  if(dataUser.id) {
    const listUsers = await Users.listRoles(dataUser.id);
    rolesUser.value = listUsers.map((el) => {
      return {
        label: el.name,
        value: el.id,
      };
    });
    dataUser.roles = rolesUser.value
  }
}


async function checkNewData(currentData, newData) {
  const currentDataStr = _.map(currentData, JSON.stringify);
  const newDataStr = _.map(newData, JSON.stringify);

  const removedDataStr = _.difference(currentDataStr, newDataStr);
  const removedData = _.map(removedDataStr, JSON.parse);

  const addedDataStr = _.difference(newDataStr, currentDataStr);
  const addedData = _.map(addedDataStr, JSON.parse);
  return { removed: removedData, added: addedData }
}

async function saveData() {
  try {
    stateBtn.value = true;
    if (dataUser.id) {
      await Users.edit(
        {
          firstName: dataUser.firstName,
          lastName: dataUser.lastName,
          username: dataUser.username,
          email: dataUser.email
        },
        dataUser.id
      );
    } else  {
      await Users.create({
          firstName: dataUser.firstName,
          lastName: dataUser.lastName,
          username: dataUser.username,
          email: dataUser.email
        });
      dataUser.id = (await Users.query()).find(el => el.username === dataUser.username).id;
    }
    if (dataUser.password) {
          await Users.resetPassword(dataUser.id, {
            temporary: dataUser.temporary,
            type: "password",
            value: dataUser.password
          });
      }
    if (groupsUser.value !== dataUser.groups) {
      const checkGroups = checkNewData(groupsUser.value, dataUser.groups)
      if (checkGroups.added) {
        for await (const group of checkGroups.added) {
          await Users.addGroup(dataUser.id, group);
        }
      }
      if (checkGroups.removed) {
        for await (const group of checkGroups.removed) {
          await Users.removeGroup(dataUser.id, group);
        }
      }
    }
    if (rolesUser.value !== dataUser.roles) {
      const checkRoles = checkNewData(rolesUser.value, dataUser.roles)
      if (checkRoles.added) {
        for await (const role of checkRoles.added) {
          await Users.addRole(dataUser.id,
            {
              id: role
            }
          );
        }
      }
      if (checkRoles.removed) {
        for await (const role of checkRoles.removed) {
          await Users.removeRole(dataUser.id,
            {
              id: role
            }
          );
        }
      }
    }
    emit('reload', true);
    stateBtn.value = false;
    isModalOpen.value = false;
  } catch(e) {
    console.log(e)
  } finally {
    stateBtn.value = false;
  }
}

watch(data, async () => {
  dataUser.id = data.value.id;
  dataUser.firstName = data.value.firstName;
  dataUser.lastName = data.value.lastName;
  dataUser.username = data.value.username;
});
watch(modal, async () => {
  isModalOpen.value = true;
  stateBtn.value = false;
  await groupsLoad();
  await rolesLoad();
});
</script>
