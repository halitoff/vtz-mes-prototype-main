<script setup>
import ListHeader from "@/components/ListHeader.vue";
import { useDataStore } from "@/stores/data";
import { onMounted, ref } from "vue";

const MAX_ITEMS = 50;

const tab = ref("balance");

const items = ref([]);

const dataStore = useDataStore();

function generateItems() {
  items.value = [...Array(MAX_ITEMS)].map(() =>
    dataStore.createFakeWarehouseItem()
  );
}

onMounted(() => generateItems());
</script>

<template>
  <q-page padding>
    <list-header caption="Склад" />

    <q-tabs v-model="tab" align="left" class="text-deep-orange-10 q-mb-md">
      <q-tab name="balance" label="Остатки" />
      <q-tab name="deficit" label="Дефицит" />
      <q-tab name="proficit" label="Профицит" />
    </q-tabs>

    <q-list>
      <q-item
        v-for="(item, idx) in items"
        :key="idx"
        v-ripple
        clickable
        class="rounded-borders q-mb-md bg-deep-orange-1"
      >
        <q-item-section>{{ item.name }}</q-item-section>
        <q-item-section class="text-center text-weight-light">{{
          item.countLabel
        }}</q-item-section>
        <q-item-section side>
          <span class="text-weight-bold">{{ item.sinceAt }}</span>
          <q-badge :label="item.daysPassed" color="deep-orange-6" />
        </q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>
