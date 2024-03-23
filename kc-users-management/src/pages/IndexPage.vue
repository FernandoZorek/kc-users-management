<template>
  <q-page>
    <div class="row items-center q-pa-xl">
      <div class="col-md-4 col-sm-12 col-xs-12 q-pa-md">
        <q-card dark bordered class="bg-amber-6 my-card">
          <q-card-section horizontal>
            <q-card-section class="col-8">
              <div class="text-h6">{{ i18n.t("users") }}</div>
              <q-icon name="person" color="white" size="4rem" />
              <div class="text-subtitle2">{{ i18n.t("usersText") }}</div>
            </q-card-section>
            <q-separator vertical color="white" />
            <q-card-section class="col-4 text-center flex flex-center">
              <q-btn
                outline
                round
                color="white"
                :label="users"
                size="2rem"
                to="/users"
              />
            </q-card-section>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-md-4 col-sm-12 col-xs-12 q-pa-md">
        <q-card dark bordered class="bg-amber-8 my-card">
          <q-card-section horizontal>
            <q-card-section class="col-8">
              <div class="text-h6">{{ i18n.t("groups") }}</div>
              <q-icon name="group" color="white" size="4rem" />
              <div class="text-subtitle2">{{ i18n.t("groupsText") }}</div>
            </q-card-section>
            <q-separator vertical color="white" />
            <q-card-section class="col-4 text-center flex flex-center">
              <q-btn
                outline
                round
                color="white"
                :label="groups"
                size="2rem"
                to="/groups"
              />
            </q-card-section>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-md-4 col-sm-12 col-xs-12 q-pa-md">
        <q-card dark bordered class="bg-amber-10 my-card">
          <q-card-section horizontal>
            <q-card-section class="col-8">
              <div class="text-h6">{{ i18n.t("roles") }}</div>
              <q-icon name="lock" color="white" size="4rem" />
              <div class="text-subtitle2">{{ i18n.t("rolesText") }}</div>
            </q-card-section>
            <q-separator vertical color="white" />
            <q-card-section class="col-4 text-center flex flex-center">
              <q-btn
                outline
                round
                color="white"
                :label="roles"
                size="2rem"
                to="/roles"
              />
            </q-card-section>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>
<script setup>
import { inject, onMounted, ref } from "vue";
import Groups from "../services/groups";
import Users from "../services/users";
import Roles from "../services/roles";

const i18n = inject("i18n");

const groups = ref(0);
const users = ref(0);
const roles = ref(0);

onMounted(async () => {
  const listGroups = await Groups.query();
  groups.value = (await Groups.extract(listGroups)).length;
  users.value = (await Users.query()).length;
  roles.value = (await Roles.query()).length;
});
</script>
