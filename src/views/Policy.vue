<template>
  <MainHeader />

  <div class="container info mt140">
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
  let response = await apiClient.get('/site-pages');
  data.value = response.data.policy;
};

onMounted(() => {
  init();
});
</script>
