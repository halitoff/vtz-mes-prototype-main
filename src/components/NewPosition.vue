<script setup>
import { ref } from "vue";
import { useDataStore } from "@/stores/data";
const dataStore = useDataStore();

const items = [...Array(20)].map(() =>dataStore.createFakeWarehouseItem());

const emit = defineEmits(["submit", "cancel"]);

const selected = ref();

function onSubmit() {
  emit("submit", selected.value);
}

function onCancel() {
  emit("cancel");
}
</script>

<template>
  <q-card class="bg-orange-1">
    <q-card-section>
      <q-select v-model="selected" :options="items" outlined option-label="name" />
    </q-card-section>
    <q-card-actions align="right">
      <q-btn label="Отмена" @click="onCancel" color="orange-10" flat />
      <q-btn label="Добавить" @click="onSubmit" color="orange-10" :disable="!selected" />
    </q-card-actions>
  </q-card>
</template>
