<script setup>
import HeaderCreate from "@/components/HeaderCreate.vue";
import { useDataStore } from "@/stores/data";
import { ref } from "vue";
import { Dialog, Notify } from "quasar";
import NewPosition from "@/components/NewPosition.vue";
import InvoicePosition from "@/components/InvoicePosition.vue";

const dataStore = useDataStore();

const workshops = [...Array(15)].map(() => dataStore.createFakeWorkshop());

const isPositionCreated = ref(false);

const formNumber = ref("");
const formWorkshop = ref();
const formPositions = ref([]);

const isCreated = ref(false)

function onCreate() {
  Dialog.create({
    message: `Создать накладную с номером <b>${formNumber.value}</b>?`,
    cancel: true,
    html: true,
  }).onOk(() => {
    Notify.create({
      message: `Накладная <b>${formNumber.value}</b> создана и отправлена в работу`,
      type: "positive",
      html: true,
    });

    isCreated.value = true

    formNumber.value = "";
    formWorkshop.value = undefined;
    formPositions.value = [];
  });
}

function onNewPositionSubmit(data) {
  formPositions.value.push(data.name);
  isPositionCreated.value = false;
}

function onRemoveInvoicePosition(idx) {
  formPositions.value.splice(idx, 1);
}
</script>

<template>
  <q-page padding>
    <div v-if="isCreated" class="absolute-full column flex-center z-top bg-white text-green">
      <q-icon name="description" size="100px" />
      <span class="text-h4">Накладная создана!</span>
      <q-btn label="Новая накладная" outline @click="isCreated=false" class="q-ma-md" />
    </div>
    <header-create caption="Новая накладная">
      <template #buttons>
        <q-btn label="Создать" color="orange-10" @click="onCreate" />
      </template>
    </header-create>

    <q-form class="column" style="gap: 1em">
      <q-input label="Номер" outlined v-model="formNumber" />
      <q-select
        v-model="formWorkshop"
        :options="workshops"
        label="Цех назначения"
        outlined
        option-label="name"
        use-input
      />

      <q-toolbar class="q-mt-lg">
        <q-toolbar-title>
          Позиции <q-badge color="orange-10" align="top" :label="formPositions.length" />
        </q-toolbar-title>
      </q-toolbar>
      <q-separator />
      <invoice-position
        v-for="(pos, idx) in formPositions"
        :key="pos"
        :title="pos"
        @remove="onRemoveInvoicePosition(idx)"
      />
      <q-btn
        label="Добавить позицию"
        color="orange-10"
        size="l"
        
        v-if="!isPositionCreated"
        @click="isPositionCreated = true"
      />
      <new-position
        v-if="isPositionCreated"
        @submit="onNewPositionSubmit"
        @cancel="isPositionCreated = false"
      />
    </q-form>
  </q-page>
</template>
