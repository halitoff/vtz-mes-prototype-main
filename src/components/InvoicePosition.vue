<script setup>
import { ref } from "vue";

defineProps(["title"]);
const emit = defineEmits(["remove"]);

const counter = ref(1);
</script>

<template>
  <q-item>
    <q-item-section>{{ title }}</q-item-section>
    <q-item-section>
      <q-item-label class="text-center">
        <q-input v-model.number="counter" type="number" outlined style="width: 100px" />
      </q-item-label>
    </q-item-section>
    <q-item-section side>
      <q-btn
        icon="close"
        color="red"
        flat
        rounded
        dense
        @click="emit('remove')"
      />
    </q-item-section>
  </q-item>
</template>
