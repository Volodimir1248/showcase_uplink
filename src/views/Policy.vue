<template>
  <MainHeader />

  <div class="header-margin container info">
    <h1>{{ data.pagetitle }}</h1>
    <div v-html="data.content"></div>
  </div>

  <Footer/>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import MainHeader from "../components/MainHeader.vue";
import Footer from "@/components/Footer.vue";
import apiClient from "../axios";

let data = ref({});

const init = async () => {
  let response = await apiClient.get('/showcase-params');
  data.value = response.data.settings.policy;
};

onMounted(() => {
  init();
});
</script>
