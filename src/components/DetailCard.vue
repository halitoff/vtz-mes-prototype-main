<template>
    <div class="node" :style="{ '--lvl': level }">
        <span v-if="hasParent" class="in-connector" />

        <q-card class="card">
            <q-card-section class="card-header row items-start justify-between q-pa-sm"
                :class="{ 'detail-style': data.is_unit == false }">
                <div>
                    <div class="text-weight-bold">{{ data.nm }}</div>
                    <div class="text-caption">Код: {{ data.nd }}</div>
                </div>
                <q-icon name="close" size="14px" class="cursor-pointer text-grey-1" @click="toggleChildren" />
            </q-card-section>

            <q-separator />
            <q-card-section class="card-body" :class="{ 'q-pb-none': data.is_unit}">
                <div><b>НУ:</b> {{ data.nu || '—' }}</div>
                <div><b>Маршрут:</b> {{ data.mr || '—' }}</div>
                <div><b>Узел:</b> {{ data.is_unit ? 'Да' : 'Нет' }}</div>
                <div class="text-xs"><b>ID:</b> {{ data.nom }}</div>
            </q-card-section>

            <div v-if="data.is_unit" class="expander">
                <a href="#" @click.prevent="toggleChildren">
                    {{ isExpanded ? '− скрыть' : '+ дочерние' }}
                </a>
            </div>
        </q-card>

        <div v-if="isExpanded && childrenLoaded" class="children">
            <DetailCard v-for="kid in kids" :key="kid.dse" :data="kid" :level="level + 1" :has-parent="true" @remove="removeKid" />
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref } from 'vue'
    import DetailCard from './DetailCard.vue'
    
    const props = defineProps<{
        data: any
        level: number
        hasParent: boolean
    }>()
    const emit = defineEmits(['remove'])

    const kids = ref<any[]>([])
    const childrenLoaded = ref(false)
    const isExpanded = ref(false)

    const loadChildren = async () => {
        kids.value = []
        const res = await fetch(`http://localhost:8000/hierarchy/children_of/${props.data.dse}`)
        kids.value = await res.json()
        childrenLoaded.value = true
    }

    const toggleChildren = async () => {
    if (!isExpanded.value) {
        await loadChildren()
    }
    isExpanded.value = !isExpanded.value
    }
    
    const removeKid = (dse: string) => {
        kids.value = kids.value.filter(k => k.dse !== dse)
    }

    const updateNode = async () => {
        kids.value = [];
        childrenLoaded.value = false;
        isExpanded.value = false;
        console.log("Всё очистили!")
    }

    defineExpose({ updateNode, toggleChildren })
    
</script>

<style scoped>
    :root {
        --card-w: 300px;
        --h-gap: 40px;
    }

    .node {
        position: relative;
        margin-left: calc(var(--lvl) * (var(--card-w) + var(--h-gap)));
        margin-top: 20px;
    }

    /* карточка */
    .card {
        width: var(--card-w);
        border: 1px solid #ccc;
    }

    /* стрелка от родителя */
    .in-connector {
        position: absolute;
        right: calc(100% + -6px);
        top: 24px;
        width: 30px;
        height: 2px;
        background: #bbb;
    }

    .in-connector::after {
        content: '';
        position: absolute;
        right: 0;
        top: -5px;
        border: 6px solid transparent;
        border-left-color: #bbb;
    }

    /* блок дочерних */
    .children {
        margin-top: 12px;
        padding-left: 24px;
        border-left: 2px dashed #ccc;
    }

    .children .fefe .card-body {
        padding-bottom: 20px;
    }

    /* кнопка показать детей */
    .expander {
        text-align: right;
        margin: -4px 8px 4px 0;
        font-size: 13px;
        font-family: 'Courier New', Courier, monospace;
    }

    .expander a {
        color: #d95726 !important;
        text-decoration: none;
    }

    .card-header {
        background-color: #d95726;
        color: #ffffff;
    }

    .unit-style {
        background-color: #d95726;
        color: #ffffff;
    }

    .detail-style {
        background-color: #e0e0e0;
        color: black;
       
    }
</style>
