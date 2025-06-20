<script setup>
import ListHeader from "@/components/ListHeader.vue";
import DetailCard from "@/components/DetailCard.vue";
import { ref, onMounted, computed, onBeforeUnmount } from "vue";
import { useQuasar } from 'quasar';
import axios from 'axios';
import { useAssemblyStore } from '@/stores/assembly';
import _ from "lodash";

// raw data of nodes
const nodes = ref([]);
const loading = ref(false);
const store = useAssemblyStore();
const $q = useQuasar();
const detailCardRef = ref();
const showLeftPanel = ref(true); // true - показана, false - скрыта
const showRightPanel = ref(true);
const isMobile = ref(false);

function checkMobile() {
    isMobile.value = window.innerWidth < 768; // порог можно менять
    
}

onMounted(() => {
    checkMobile();
    if (isMobile.value) {
        showRightPanel.value = false;
    }
    window.addEventListener('resize', checkMobile);
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', checkMobile);
});

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

import { initDB, saveToDB, loadFromDB } from "@/utils/indexedDB";

async function fetchUnitsTree(force = false) {
    loading.value = true;

    try {
        // Попробуем загрузить из кэша
        if (!force) {
            await initDB();
            const cached = await loadFromDB();
            if (cached) {
                nodes.value = cached;
                return;
            }
        }

        // Запрос с сервера
        const { data } = await axios.get('http://localhost:8000/hierarchy/units/?skip=0&limit=100000');
        const formattedData = data.map(item => ({
            ...item,
            expanded: false
        }));
        nodes.value = formattedData;

        // Сохраняем в IndexedDB
        await saveToDB(formattedData);
    } catch (e) {
        console.error("Ошибка загрузки дерева:", e);
    } finally {
        loading.value = false;
    }
}

/**
 * Stub for fetching single node by id
 */
async function fetchNodeById(id) {
    try {
        const { data } = await axios.get(`http://localhost:8000/hierarchy/${id}`);
        nodes.value = data.map(item => ({
            ...item,
            expanded: false
        }));
    } catch (e) {
        console.error(e);
        return null;
    }
}
async function viewNode(node) {
    try {
        const resp = await fetch(`http://localhost:8000/hierarchy/${node.dse}`)
        if (resp.ok) {
            const arr = await resp.json()
            value.value = arr
            console.log(arr)
            root.value = arr[0]

            // Теперь можно обновить карточку
            if (detailCardRef.value) {
                await detailCardRef.value.updateNode();
                await detailCardRef.value.toggleChildren();
            }

            // Если на мобилке
            if (isMobile) {
                toggleSinglePanel();
            }
        }
        else {
            alert("Ошибка" + resp.status)
        }

    } finally {

        loading.value = false;
    }

}


function openNode(node) {
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
    fetchNodeById(node.dse);
}

function exportData(type) {
    $q.notify({ message: `Экспорт ${type}`, color: 'primary' });
}

function toggleSinglePanel() {
  if (!isMobile.value) return;

  if (!showLeftPanel.value && !showRightPanel.value) {
    showLeftPanel.value = true;
    showRightPanel.value = true;
  } else if (showLeftPanel.value) {
    showLeftPanel.value = false;
    showRightPanel.value = true;
  } else {
    showLeftPanel.value = true;
    showRightPanel.value = false;
  }

  console.log(showLeftPanel.value)
  console.log(showRightPanel.value)
}

// --- Фильтрация узлов ---
const filteredNodes = computed(() => {
    const search = store.filters.left_search.toLowerCase();
    return nodes.value.filter((n) => {
        const matchSearch =
            n.nm?.toLowerCase().includes(search);
        const matchType = !store.filters.is_node || n.is_unit === store.filters.is_node;
        return matchSearch && matchType;
    });
});

const root = ref(null)
const value = ref(null)
const searchQuery = ref("");
const searchResults = ref([]);
import { debounce } from 'lodash-es';

async function runSearch() {
  await store.performSearch(searchQuery.value);
  searchResults.value = store.searchResults;
}

const debouncedSearch = debounce(runSearch, 500);

async function tryLoadFromCache() {
  await initDB();
  const cached = await loadFromDB();
  if (cached) {
    nodes.value = cached;
    return true; // данные взяты из кэша
  }
  return false; // кэша нет — нужно загружать
}

onMounted(async () => {
    // Грузим корень
    try {
        const resp = await fetch("http://localhost:8000/hierarchy/1125009000002")
        if (resp.ok) {
            const arr = await resp.json()
            value.value = arr
            root.value = arr[0]
        }
        else {
            alert("Ошибка" + resp.status)
        }

    } finally {
        loading.value = false;
    }
    const loadedFromCache = await tryLoadFromCache();
    if (!loadedFromCache) {
        await fetchUnitsTree(); // только если кэша нет
    }
    toggleSinglePanel()
}
);





</script>

<template>
    <q-page padding>
        <div class="row items-center q-mb-md justify-between full-width">
            <div v-if="isMobile" class="q-mr-sm">
                <q-btn
                icon="menu"
                round
                dense
                flat
                @click="toggleSinglePanel"
                />
            </div>

            <div class="row items-center justify-between full-width toolbar-buttons">
                    <!-- Кнопка для левой панели -->
                <div v-if="!isMobile">
                    <q-btn v-if="!showLeftPanel" icon="chevron_right" round dense flat @click="showLeftPanel = true"
                    class="q-mr-sm" />

                    <q-btn v-else icon="chevron_left" round dense flat @click="showLeftPanel = false" class="q-mr-sm" />
                </div>
                
                <!-- Основной заголовок -->
                <div class="text-h6 text-weight-medium">{{ showLeftPanel ? 'Состав сборок' : 'Состав ' + root.nm }}</div>
            
                
                <!-- Кнопка для правой панели -->
                <div v-if="!isMobile">
                    <q-btn v-if="!showRightPanel" icon="chevron_left" round dense flat @click="showRightPanel = true"
                    class="q-mr-sm" />

                    <q-btn v-else icon="chevron_right" round dense flat @click="showRightPanel = false" class="q-mr-sm" />
                
                </div>
            </div>
                
        </div>

        <div class="row q-gutter-xl">
            <div v-show="showLeftPanel" class="col">

                <!-- Фильтр -->
                <div class="q-mb-md row">
                    <q-input class="col" v-model="searchQuery" @keyup.enter="runSearch" @input="debouncedSearch" label="Поиск сборки" dense filled style="min-width: 200px;" />
                    <q-btn class="col-2" @click="searchQuery" dense>🔍 Найти</q-btn>
                </div>

                <q-inner-loading :showing="loading" />
                <div class="q-mt-sm">
                    <q-tree :nodes="filteredNodes" node-key="dse" label-key="nm">
                        <!-- Заголовок элемента -->
                        <template v-slot:default-header="{ node }">
                            <div class="row items-center"
                                style="display: grid; grid-template-columns: 1fr auto; gap: 16px; align-items: center; width: 100%">

                                <!-- Левая часть — данные -->
                                <div>
                                    <div class="text-weight-medium word-break">{{ node.nm }}</div>
                                    <div class="text-caption">{{ fieldLabels.dse }}: {{ node.dse }}</div>
                                    <div class="text-caption">{{ fieldLabels.suz }}: {{ node.suz }}</div>
                                </div>

                                <!-- Правая часть — кнопки -->
                                <div class="row justify-end q-gutter-xs">
                                    <q-btn dense flat size="sm" icon="visibility" @click.stop="viewNode(node)" />
                                </div>
                            </div>
                        </template>

                        <!-- Блок с данными при раскрытии (вертикально) -->
                        <template v-slot:default-body="{ node }">
                            <div v-if="node.expanded" class="q-pa-md bg-grey-3 rounded-borders q-mb-md">
                                <div class="column">
                                    <div v-for="(label, key) in Object.keys(fieldLabels).filter(key => data[key] != null && data[key] !== '')"
                                        :key="key" class="text-caption">
                                        <strong>{{ label }}:</strong> {{ node[key] || '—' }}
                                    </div>
                                </div>
                            </div>
                        </template>
                    </q-tree>
                </div>


            </div>
            <div v-if="showRightPanel" :class="isMobile ? 'col' : 'col-8'">
                <!-- Фильтр -->
                <div class="q-mb-md">
                    <q-input v-model="store.filters.right_search" label="Фильтр " dense filled
                        style="min-width: 200px;" />
                </div>
                <DetailCard v-if="root" :data="root" :level="0" :has-parent="false" ref="detailCardRef" />
            </div>


        </div>




    </q-page>
</template>
