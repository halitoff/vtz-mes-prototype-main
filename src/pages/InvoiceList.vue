<script setup>
import ListHeader from "@/components/ListHeader.vue";

import { ref, onMounted, computed } from "vue";
import { DateTime } from "luxon";
import _ from "lodash";
import { faker } from "@faker-js/faker/locale/ru";

const MAX_INVOICES = 15;

const tab = ref("current");

const invoices = ref([]);
const invoicesFiltered = computed(() =>
  tab.value === "current"
    ? invoices.value.filter((el) => !el.isGranted)
    : invoices.value.filter((el) => el.isGranted)
);

function createFakeInvoice() {
  const _name1 = _.random(999).toString().padStart(3, "0");
  const _name2 = _.random(999999).toString().padStart(6, "0");
  const _name3 = _.random(112, 250).toString().padStart(3, "0");
  const name = `${_name1}-${_name2}/${_name3}`;

  const now = DateTime.now();
  const createdAt = now.minus({ days: _.random(20) });
  const createdAtFormatted = createdAt.toFormat("dd.MM.yyyy");

  const isGranted = _.sample([true, false]);
  const isApproveRequired = isGranted ? false : _.sample([true, false]);

  const fio = faker.person.fullName();

  return {
    name,
    createdAt,
    createdAtFormatted,
    isGranted,
    isApproveRequired,
    fio,
  };
}

function generateInvoices() {
  invoices.value = [...Array(MAX_INVOICES)]
    .map(() => createFakeInvoice())
    .sort((a, b) => a.createdAt.toMillis() - b.createdAt.toMillis());
}

onMounted(() => generateInvoices());
</script>

<template>
  <q-page padding>
    <list-header caption="Накладные">
      <template #buttons>
        <q-btn
          label="Новая накладная"
          icon="add"
          color="deep-orange-8"
          to="/invoices/create"
        />
      </template>
    </list-header>

    <q-tabs v-model="tab" align="left" class="text-deep-orange-10 q-mb-md">
      <q-tab name="current" label="Текущие" />
      <q-tab name="archived" label="Архивные" />
    </q-tabs>

    <q-list>
      <q-item
        v-for="(invoice, idx) in invoicesFiltered"
        :key="idx"
        v-ripple
        clickable
        class="rounded-borders q-mb-md bg-deep-orange-1"
      >
        <q-item-section>
          <q-item-label caption>{{ invoice.createdAtFormatted }}</q-item-label>
          <q-item-label>{{ invoice.name }}</q-item-label>
        </q-item-section>
        <q-item-section v-if="invoice.isApproveRequired">
          <q-item-label>
            <q-badge color="red"> <q-icon name="priority_high" />ОТК</q-badge>
          </q-item-label>
        </q-item-section>
        <q-item-section side class="col-4">{{ invoice.fio }}</q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>
