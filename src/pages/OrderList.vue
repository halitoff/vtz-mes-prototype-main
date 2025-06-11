<script setup>
import { ref, onMounted } from "vue";
import { DateTime } from "luxon";
import _ from "lodash";
import { faker } from "@faker-js/faker/locale/ru";

import ListHeader from "@/components/ListHeader.vue";
import {items as ordersData}  from '@/stores/sourceData/items'

const MAX_ORDERS = 15;

const orders = ref([]);

function createFakeOrder(idx) {
  // const name = `Заказ_${faker.word.adjective()}`;
  const name = ordersData[idx];

  const now = DateTime.now();
  let createdAt = now.minus({ days: _.random(400) });
  let deadlineAt = createdAt.plus({ days: _.random(600) });
  const daysPassed = now.diff(createdAt).as("days");
  const daysRemaining = deadlineAt.diff(now).as("days");

  const isExpired = now > deadlineAt;

  createdAt = createdAt.toFormat("dd.MM.yyyy");
  deadlineAt = deadlineAt.toFormat("dd.MM.yyyy");

  const progress = _.random(0, 1, true);
  const progressLabel = (progress * 100).toFixed(2) + "%";

  return {
    name,
    createdAt,
    deadlineAt,
    daysPassed,
    daysRemaining,
    progress,
    progressLabel,
    isExpired,
  };
}

function generateOrders() {
  orders.value = [...Array(MAX_ORDERS)]
    .map((el, index) => createFakeOrder(index))
    .sort((a, b) => b.progress - a.progress);
}

onMounted(() => generateOrders());
</script>

<template>
  <q-page padding>
    <list-header caption="Заказы">
      <template #buttons>
        <q-btn label="Новый заказ" icon="add" color="deep-orange-8" />
      </template>
    </list-header>
    <q-list>
      <q-item
        v-for="(order, idx) in orders"
        :key="idx"
        v-ripple
        clickable
        class="rounded-borders q-mb-md bg-deep-orange-1"
      >
        <q-item-section>{{ order.name }}</q-item-section>
        <q-item-section side
          ><div>
            {{ order.daysPassed }} | {{ order.daysRemaining }}
            <q-icon
              v-if="order.isExpired"
              name="error"
              color="red-6"
              size="xs"
            />
          </div>
        </q-item-section>
        <q-item-section side>
          {{ order.createdAt }} - {{ order.deadlineAt }}
        </q-item-section>
        <q-linear-progress
          :value="order.progress"
          stripe
          size="12px"
          class="absolute-bottom"
          color="deep-orange-3"
        >
          <div class="absolute-center text-black">
            {{ order.progressLabel }}
          </div>
        </q-linear-progress>
      </q-item>
    </q-list>
  </q-page>
</template>
