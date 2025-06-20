<script setup>
const navigation = [
  { caption: 'Заказы', icon: 'precision_manufacturing', route: '/orders' },
  { caption: 'Цеха', icon: 'factory', route: '/workshops' },
  { caption: 'Склад', icon: 'warehouse', route: '/warehouse' },
  { caption: 'Сборки изделий', icon: 'description', route: '/invoices' },
  { caption: 'Всё вместе', icon: "factory", route: '/assembly'}
]
</script>

<template>
  <q-list class="text-blue-1">
    <q-item v-for="(nav, idx) in navigation" :key="idx" :to="nav.route" active-class="bg-deep-orange-10">
      <q-item-section avatar>
        <q-icon :name="nav.icon" />
      </q-item-section>
      <q-item-section>
        <q-item-label>{{ nav.caption }}</q-item-label>
      </q-item-section>
    </q-item>
  </q-list>
</template>
