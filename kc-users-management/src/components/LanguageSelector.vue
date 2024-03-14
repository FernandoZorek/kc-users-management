<template>
  <div>
    <q-select
      class="language-select"
      color="accent" standout
      v-model="selectedLocale"
      :options="supportedLocales"
      option-value
    />
  </div>
</template>

<script setup>
import { inject, onMounted, ref, watch } from "vue";
import { useQuasar } from "quasar";

const $q = useQuasar();
const i18n = inject("i18n");
const language = $q.localStorage.getItem("language") || i18n.locale;
const selectedLocale = ref(
  loadLanguages().find((ref) => ref.value === language)
);
const supportedLocales = ref(loadLanguages());
function loadLanguages() {
  return [
    { value: "en-US", label: i18n.t("english") },
    { value: "es-ES", label: i18n.t("spanish") },
    { value: "pt-BR", label: i18n.t("portuguese") },
  ];
}
function setLanguages(newLocale) {
  import(`quasar/lang/${i18n.locale}`).then((language) =>
    $q.lang.set(language.default)
  );
  i18n.locale = newLocale.value;
  supportedLocales.value = loadLanguages();
  $q.localStorage.set("language", newLocale.value);
}

onMounted(() => {
  setLanguages({ value: language });
});

watch(selectedLocale, async (newLocale) => {
  setLanguages(newLocale);
});
</script>
