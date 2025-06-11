<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import axios from 'axios';
import { useAssemblyStore } from '@/stores/assembly';

const $q = useQuasar();
const store = useAssemblyStore();

// raw data of nodes
const nodes = ref([]);
const loading = ref(false);

// --- Словарь локализации ---
const fieldLabels = {
  nom: '№',
  kdu1: 'Код изделия 1',
  kdu2: 'Код изделия 2',
  kdu3: 'Код изделия 3',
  kdu4: 'Код изделия 4',
  kdu5: 'Код изделия 5',
  kdu6: 'Код изделия 6',
  kdu7: 'Код изделия 7',
  kdu8: 'Код изделия 8',
  kdu9: 'Код изделия 9',
  kdu10: 'Код изделия 10',
  kdu11: 'Код изделия 11',
  kdu12: 'Код изделия 12',

  nds1: 'Номер документа 1',
  nds2: 'Номер документа 2',
  nds3: 'Номер документа 3',
  nds4: 'Номер документа 4',
  nds5: 'Номер документа 5',
  nds6: 'Номер документа 6',
  nds7: 'Номер документа 7',
  nds8: 'Номер документа 8',
  nds9: 'Номер документа 9',
  nds10: 'Номер документа 10',
  nds11: 'Номер документа 11',
  nds12: 'Номер документа 12',

  dse: 'Код детали',
  suz: 'Родитель',
  nd: 'Документ',
  nm: 'Наименование',
  nu: 'Чертёж',
  klu: 'Кол-во',
  kli: 'Кол-во в изделии',
  edi1: 'Ед. изм. 1',
  ein1: 'Доп. ед. изм. 1',
  norma1: 'Норма расхода 1',
  edi2: 'Ед. изм. 2',
  ein2: 'Доп. ед. изм. 2',
  norma2: 'Норма расхода 2',
  naizd: 'Наименование изделия',
  shm: 'Шифр модификации',
  nmg: 'Номенклатурная группа',
  n109: 'Признак 109',
  n111: 'Признак 111',
  n112: 'Признак 112',
  n113: 'Признак 113',
  n114: 'Признак 114',
  n115: 'Признак 115',
  n121: 'Признак 121',
  n122: 'Признак 122',
  n126: 'Признак 126',
  n131: 'Признак 131',
  n144: 'Признак 144',
  n145: 'Признак 145',
  n157: 'Признак 157',
  n210: 'Признак 210',
  nitg: 'Итог',
  ovk: 'Объём комплектации',
  mr: 'Маршрут',
  gr: 'Группа',
  id: 'ID'
};

// --- Таблица ---
const columns = computed(() => [
  { name: 'nom', label: fieldLabels.nom, field: 'nom', sortable: true },
  { name: 'kdu1', label: fieldLabels.kdu1, field: 'kdu1', sortable: true },
  { name: 'nds1', label: fieldLabels.nds1, field: 'nds1', sortable: true },
  { name: 'nm', label: fieldLabels.nm, field: 'nm', sortable: true },
  { name: 'dse', label: fieldLabels.dse, field: 'dse', sortable: true },
  { name: 'klu', label: fieldLabels.klu, field: 'klu', sortable: true }
]);

/**
 * Stub for fetching entire tree structure
 */
 async function fetchFullTree() {
  loading.value = true;
  try {
    const { data } = await axios.get('http://localhost:8000/hierarchy/details/?skip=0&limit=100');
    nodes.value = data.map(item => ({
      ...item,
      expanded: false
    }));
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
}

/**
 * Stub for fetching single node by id
 */
async function fetchNodeById(id) {
  try {
    const { data } = await axios.get(`/api/assemblies/${id}`);
    return data;
  } catch (e) {
    console.error(e);
    return null;
  }
}

// computed list filtered by search and type/quantity
const filteredNodes = computed(() => {
  const search = store.filters.search.toLowerCase();
  return nodes.value.filter((n) => {
    const matchSearch =
      n.nm?.toLowerCase().includes(search) ||
      n.kdu1?.toLowerCase().includes(search) ||
      n.nds1?.toLowerCase().includes(search);
    return matchSearch;
  });
});

function changeMode(mode) {
  store.setMode(mode);
}

function viewNode(node) {
  node.expanded = !node.expanded; // Переключаем состояние
}

function editNode(node) {
  $q.notify({ message: `Редактирование: ${node.name}`, color: 'accent' });
}

function addNode(parent) {
  $q.notify({ message: `Добавление элемента в ${parent.name}`, color: 'positive' });
}

function deleteNode(node) {
  $q.dialog({
    title: 'Удалить',
    message: `Удалить ${node.name}?`,
    cancel: true,
    persistent: true,
  }).onOk(() => {
    $q.notify({ message: 'Удалено', color: 'negative' });
  });
}

function goToParent(node) {
  if (!node.parentId) return;
  fetchNodeById(node.parentId);
}

function exportData(type) {
  $q.notify({ message: `Экспорт ${type}`, color: 'primary' });
}

onMounted(() => {
  fetchFullTree();
});
</script>

<template>
  <div>
    <div class="row items-center q-gutter-sm q-mb-sm">
      <q-input v-model="store.filters.search" label="Поиск" dense filled />
      <q-select
        v-model="store.filters.type"
        :options="['assembly', 'part', 'material']"
        label="Тип"
        dense
        filled
        emit-value
        map-options
      />
      <q-input v-model.number="store.filters.quantity" label="Кол-во" type="number" dense filled />
      <q-space />
      <q-btn flat icon="folder" @click="changeMode('tree')" :color="store.activeMode==='tree' ? 'primary' : 'grey'" />
      <q-btn flat icon="table_chart" @click="changeMode('table')" :color="store.activeMode==='table' ? 'primary' : 'grey'" />
      <q-btn flat icon="article" @click="changeMode('cards')" :color="store.activeMode==='cards' ? 'primary' : 'grey'" />
      <q-btn label="Сохранить сессию" icon="save" color="primary" @click="store.saveSession" />
      <q-btn-dropdown label="Экспорт" icon="file_upload" color="primary">
        <q-list>
          <q-item clickable v-close-popup @click="exportData('json')">
            <q-item-section>JSON</q-item-section>
          </q-item>
          <q-item clickable v-close-popup @click="exportData('csv')">
            <q-item-section>CSV</q-item-section>
          </q-item>
          <q-item clickable v-close-popup @click="exportData('pdf')">
            <q-item-section>PDF</q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
    </div>

    <q-inner-loading :showing="loading" />

    <div v-if="store.activeMode === 'tree'" class="q-mt-sm">
      <q-tree
        :nodes="filteredNodes"
        node-key="dse"
        label-key="nm"
      >
        <!-- Заголовок элемента -->
        <template v-slot:default-header="{ node }">
          <div class="row no-wrap items-center" style="display: grid; grid-template-columns: 1fr auto; gap: 16px; align-items: center; width: 100%">
            
            <!-- Левая часть — данные -->
            <div>
              <div class="text-weight-medium ellipsis">{{ node.nm }}</div>
              <div class="text-caption">{{ fieldLabels.kdu1 }}: {{ node.kdu1 }}</div>
              <div class="text-caption">{{ fieldLabels.nds1 }}: {{ node.nds1 }}</div>
            </div>

            <!-- Правая часть — кнопки -->
            <div class="row justify-end q-gutter-xs">
              <q-btn dense flat size="sm" icon="visibility" @click.stop="viewNode(node)" />
              <q-btn dense flat size="sm" icon="edit" @click.stop="editNode(node)" />
            </div>
          </div>
        </template>

        <!-- Блок с данными при раскрытии (вертикально) -->
        <template v-slot:default-body="{ node }">
          <div v-if="node.expanded" class="q-pa-md bg-grey-3 rounded-borders q-mb-md">
            <div class="column">
              <div v-for="(label, key) in fieldLabels" :key="key" class="text-caption">
                <strong>{{ label }}:</strong> {{ node[key] || '—' }}
              </div>
            </div>
          </div>
        </template>
      </q-tree>
    </div>

    <div v-else-if="store.activeMode === 'table'" class="q-mt-sm">
      <q-table
        :rows="filteredNodes"
        :columns="columns"
        row-key="id"
        flat
        bordered
      >
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="name" :props="props">
              <q-btn dense flat icon="chevron_right" v-if="props.row.children" @click="props.expand = !props.expand" />
              {{ props.row.name }}
            </q-td>
            <q-td key="code" :props="props">{{ props.row.code }}</q-td>
            <q-td key="type" :props="props">{{ props.row.type }}</q-td>
            <q-td key="quantity" :props="props">{{ props.row.quantity }}</q-td>
            <q-td>
              <q-btn dense flat size="sm" icon="visibility" @click.stop="viewNode(props.row)" />
              <q-btn dense flat size="sm" icon="edit" @click.stop="editNode(props.row)" />
              <q-btn dense flat size="sm" icon="add" @click.stop="addNode(props.row)" />
              <q-btn dense flat size="sm" icon="delete" @click.stop="deleteNode(props.row)" />
              <q-btn
                v-if="props.row.parentId"
                dense
                flat
                size="sm"
                icon="arrow_upward"
                @click.stop="goToParent(props.row)"
              />
            </q-td>
          </q-tr>
          <q-tr v-show="props.expand" :props="props">
            <q-td colspan="100%" class="bg-grey-2">
              <q-table
                dense
                :rows="props.row.children"
                :columns="columns"
                row-key="id"
                flat
              />
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>

    <div v-else class="q-mt-sm">
      <div class="row q-col-gutter-md">
        <div
          v-for="node in filteredNodes"
          :key="node.id"
          class="col-xs-12 col-sm-6 col-md-4"
        >
          <q-card class="q-pa-sm">
            <div class="text-h6">{{ node.nm }}</div>
            <div class="text-caption">{{ node.nd }}</div>
            <div class="text-caption">{{ node.gr }}</div>
            <div class="text-caption">Маршрут: {{ node.mr }}</div>
            <q-separator class="q-my-sm" />
            <div class="row justify-end q-gutter-xs">
              <q-btn dense flat size="sm" icon="visibility" @click.stop="viewNode(node)" />
              <q-btn dense flat size="sm" icon="edit" @click.stop="editNode(node)" />
              <q-btn dense flat size="sm" icon="add" @click.stop="addNode(node)" />
              <q-btn dense flat size="sm" icon="delete" @click.stop="deleteNode(node)" />
              <q-btn
                v-if="node.parentId"
                dense
                flat
                size="sm"
                icon="arrow_upward"
                @click.stop="goToParent(node)"
              />
            </div>
          </q-card>
        </div>
      </div>
    </div>
  </div>
</template>
