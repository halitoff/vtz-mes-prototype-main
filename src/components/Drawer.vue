<script setup>
import { ref } from "vue";

import NavigationLeft from "@/components/NavigationLeft.vue";
import { useCoreStore } from "@/stores/core";

const core = useCoreStore();
</script>

<template>
  <q-drawer v-model="core.drawer" :width="200" class="bg-grey-10 q-pt-md">
    <q-scroll-area class="fit">
      <navigation-left />
    </q-scroll-area>
  </q-drawer>
</template>
