<script setup>
import WarehouseHeader from '@/components/WarehouseHeader.vue';
import { faker } from "@faker-js/faker/locale/ru";
import _ from "lodash";
import { date } from "quasar";
import { onMounted, ref } from 'vue';

const MAX_FAKE_ITEMS = 20;
const MAX_FAKE_COUNT = 20;

const materials = ref([])

function createFake(idx) {
  const mat = {}

  mat.id = idx;
  mat.name = `Материал ${idx}`;
  mat.count = _.random(MAX_FAKE_COUNT);
  mat.brand = `Марка ${faker.word.adjective()}`;
  mat.width = _.random(100);
  mat.height = _.random(100);
  mat.length = _.random(100);
  mat.weight = _.random(1000)

  const today = new Date();
  const arrived_at = date.subtractFromDate(today, { days: _.random(500) })
  
  mat.arrived_at = date.formatDate(arrived_at, "DD.MM.YYYY")
  mat.days = date.getDateDiff(today, arrived_at, 'days')

  return mat;
}


onMounted(() => {
  materials.value = [...new Array(MAX_FAKE_ITEMS)].map((el, idx) => createFake(idx))
})

const columns = [
  { name: "id", align: "center", label: "id", field: "id", sortable: true, },
  { name: "name", align: "center", label: "name", field: "name", sortable: true, },
  { name: "brand", align: "center", label: "brand", field: "brand", sortable: true, },
  { name: "width", align: "center", label: "width", field: "width", sortable: true, },
  { name: "height", align: "center", label: "height", field: "height", sortable: true, },
  { name: "length", align: "center", label: "length", field: "length", sortable: true, },
  { name: "weight", align: "center", label: "weight", field: "weight", sortable: true, },
  { name: "arrived_at", align: "center", label: "arrived_at", field: "arrived_at", sortable: true, },
  { name: "days", align: "center", label: "days", field: "days", sortable: true, },
  { name: "count", align: "center", label: "count", field: "count", sortable: true, },
];
</script>

<template>
  <q-page padding>
    <warehouse-header caption="Материалы" />
    <q-table :rows="materials" :columns="columns" row-key="id" :pagination="{ rowsPerPage: 0 }" hide-pagination />
    <!-- <q-list>
      <template v-for="(material, idx) in materials" :key="idx">
        <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="mail" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ material.name }}</q-item-label>
          </q-item-section>
          <q-item-section side>{{ material.count }}</q-item-section>
        </q-item>
      </template>
</q-list> -->
  </q-page>
</template>