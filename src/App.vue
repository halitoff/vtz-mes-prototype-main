<script setup>
import { onMounted } from "vue";
import Header from "@/components/Header.vue";
import Drawer from "@/components/Drawer.vue";
import { initDB } from "@/utils/indexedDB";

import { runNotifications } from "@/notifications";

onMounted(async () => {
  try {
      await initDB();
      console.log("IndexedDB успешно инициализирована");
    } catch (e) {
      console.error("Ошибка инициализации IndexedDB:", e);
    }
  runNotifications();
});
</script>

<template>
  <q-layout view="hHh Lpr fFf">
    <Header />
    <Drawer />
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>
