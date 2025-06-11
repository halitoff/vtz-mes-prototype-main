<script setup>
import ListHeader from "@/components/ListHeader.vue";
import { ref, onMounted } from "vue";
import _ from "lodash";

import { useDataStore } from "@/stores/data";
const MAX_WORKSHOPS = 15;
const dataStore = useDataStore();

const workshops = ref([]);

function generateWorkshops() {
  workshops.value = [...Array(MAX_WORKSHOPS)].map(() => dataStore.createFakeWorkshop());
}

onMounted(() => generateWorkshops());
</script>

<template>
  <q-page padding>
    <list-header caption="Заказы" />
    <q-list>
      <q-item
        v-for="(workshop, idx) in workshops"
        :key="idx"
        v-ripple
        clickable
        class="rounded-borders q-mb-md bg-deep-orange-1"
      >
        <q-item-section>{{ workshop.name }}</q-item-section>
        <q-item-section side>
          <q-circular-progress
            show-value
            :value="workshop.workload * 100"
            size="md"
            color="deep-orange-10"
          >
            {{ workshop.workloadLabel }}
          </q-circular-progress>
        </q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>
