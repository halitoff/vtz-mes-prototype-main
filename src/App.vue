<script setup>
import { onMounted } from "vue";
import Header from "@/components/Header.vue";
import Drawer from "@/components/Drawer.vue";

import { runNotifications } from "@/notifications";

onMounted(() => runNotifications());
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
