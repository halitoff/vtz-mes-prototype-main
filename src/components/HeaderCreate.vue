<script setup>
import { useRouter } from "vue-router";

defineProps(["caption", "backBtn"]);
const router = useRouter();

const onBack = () => {
  router.back();
};
</script>

<template>
  <div class="q-mb-lg">
    <q-toolbar>
      <q-btn
        v-if="backBtn"
        round
        flat
        icon="arrow_back"
        color="deep-orange-10"
        @click="onBack"
      />
      <q-toolbar-title>{{ caption }}</q-toolbar-title>
      <div class="q-gutter-sm q-mx-sm">
        <slot name="buttons" />
      </div>
    </q-toolbar>
    <q-separator />
  </div>
</template>
