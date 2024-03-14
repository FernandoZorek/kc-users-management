<template>
  <div>
    <select v-model="selectedLocale">
      <option v-for="(locale, key) in supportedLocales" :key="key" :value="key">
        {{ locale }}
      </option>
    </select>
  </div>
</template>

<script setup>
import { inject, onMounted, ref, watch } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const i18n = inject('i18n')
const language = $q.localStorage.getItem('language')
const selectedLocale = ref(language || i18n.locale)
const supportedLocales = ref(loadLanguages())
function loadLanguages () {
    return {
        'en-US': i18n.t('english'),
        'es-ES': i18n.t('spanish'),
        'pt-BR': i18n.t('portuguese')
      }
  }
function setLanguages (newLocale) {
    import(`quasar/lang/${i18n.locale}`).then(language => $q.lang.set(language.default))
    i18n.locale = newLocale
    supportedLocales.value = loadLanguages()
    $q.localStorage.set('language', newLocale)
  }

onMounted(() => {
  setLanguages(language)
})

watch(selectedLocale, async (newLocale) => {
  setLanguages(newLocale)
})
</script>
