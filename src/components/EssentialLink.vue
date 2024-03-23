<template>
  <q-item
    v-for="link in linksList"
    :key="link.title"
    v-bind="link"
    clickable
    tag="a"
    :to="link.link"
  >
    <q-item-section
      v-if="link.icon"
      avatar
    >
      <q-icon :name="link.icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ link.title }}</q-item-label>
      <q-item-label link.caption>{{ link.caption }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup>
const props = defineProps({
  linksList: {
      type: Array,
      required: true
    }
  })
</script>
