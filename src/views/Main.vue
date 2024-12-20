<template>
  <div>
    <MainHeader ref="header" />

    <main class="products container mt140" >
      <div class="products__head">
        <h1 class="products__head-title">
          Букеты в наличии
        </h1>

        <select class="sort-select" v-model="filter.sortBy">
          <option v-for="(sort, key) in sortsList" :key="key" :value="sort"> {{ sort.name }} </option>
        </select>
      </div>

      <div class="products__body">
        <ProductItem
            v-for="(product, product_key) in products"
            :key="product_key"
            :product="product"
        />
      </div>

      <div class="pagination--wrap">
        <ul class="pagination">
          <li
              class="page-item"
              :class="{disabled : currentPage === 1}"
              @click="getProducts(1)"
          >
            <span class="page-link">Первая</span>
          </li>

          <li
              class="page-item"
              :class="{active : currentPage === page}"
              v-for="page in countPage"
              :key="page"
              @click="getProducts(page)"
          >
            <span class="page-link">{{ page }}</span>
          </li>

          <li
              class="page-item"
              :class="{disabled : currentPage === countPage}"
              @click="getProducts(countPage)"
          >
            <span class="page-link">Последняя</span>
          </li>
        </ul>
      </div>

      <router-link to="/cart" class="cart-bottom__link" >
        <div class="cart-bottom" :class="countProduct > 0 ? 'full' : 'zero'">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.40499 21C7.90954 21 7.48554 20.8239 7.13302 20.4717C6.78049 20.1195 6.60393 19.6956 6.60333 19.2C6.60333 18.705 6.77989 18.2814 7.13302 17.9292C7.48614 17.577 7.91014 17.4006 8.40499 17.4C8.90045 17.4 9.32474 17.5764 9.67787 17.9292C10.031 18.282 10.2073 18.7056 10.2067 19.2C10.2067 19.695 10.0304 20.1189 9.67787 20.4717C9.32534 20.8245 8.90105 21.0006 8.40499 21ZM17.4133 21C16.9179 21 16.4939 20.8239 16.1413 20.4717C15.7888 20.1195 15.6123 19.6956 15.6117 19.2C15.6117 18.705 15.7882 18.2814 16.1413 17.9292C16.4945 17.577 16.9185 17.4006 17.4133 17.4C17.9088 17.4 18.3331 17.5764 18.6862 17.9292C19.0393 18.282 19.2156 18.7056 19.215 19.2C19.215 19.695 19.0387 20.1189 18.6862 20.4717C18.3337 20.8245 17.9094 21.0006 17.4133 21ZM6.7835 4.8H20.0708C20.4161 4.8 20.6788 4.9539 20.859 5.2617C21.0392 5.5695 21.0467 5.8806 20.8815 6.195L17.6836 11.955C17.5184 12.255 17.2971 12.4875 17.0197 12.6525C16.7422 12.8175 16.438 12.9 16.1071 12.9H9.39591L8.40499 14.7H19.215V16.5H8.40499C7.72937 16.5 7.2189 16.2039 6.87358 15.6117C6.52826 15.0195 6.51325 14.4306 6.82854 13.845L8.04466 11.64L4.80166 4.8H3V3H5.92771L6.7835 4.8Z" fill="black"></path>
          </svg>
          <p class="cart__info-text">В корзине</p>
          <p class="cart__info-count ms2_total_count">
            {{ countProduct }}
            <span v-if="countProduct === 1"> товар</span>
            <span v-else-if="countProduct < 5"> товарa</span>
            <span v-else> товаров</span>
          </p>
          <div class="cart__info">
            <p v-if="discountProducts" class="cart__info-discount"><span class="ms2_total_cost">{{ discountProducts }}</span> ₽</p>
            <p class="cart__info-price"><span class="ms2_total_cost">{{ priceProduct }}</span> ₽</p>
          </div>
        </div>
      </router-link>
    </main>

    <Footer/>
  </div>
</template>

<script setup>
import {ref, reactive, onMounted, watch, onUnmounted, computed, getCurrentInstance} from 'vue';
import MainHeader from "@/components/MainHeader.vue";
import ProductItem from "@/components/ProductItem.vue";
import Footer from "@/components/Footer.vue";
import apiClient from "@/axios.js";

const { proxy } = getCurrentInstance();

const sortsList = ref([
  {
    name: "По умолчанию",
    sortby: "rank",
    dir: "asc"
  },
  {
    name: "Сначала новые",
    sortby: "createdon",
    dir: "desc"
  },
  {
    name: "По названию (А-Я, A-Z)",
    sortby: "pagetitle",
    dir: "asc"
  },
  {
    name: "Сначала дешевые",
    sortby: "price",
    dir: "asc"
  },
  {
    name: "Сначала дорогие",
    sortby: "price",
    dir: "desc"
  }
]);
let products = ref([]);
let currentPage = ref(1);
let countPage = ref(1);
let limitPage = ref(28);

let filter = reactive({
  categoryId: 0,
  sortBy: {
    name: "По умолчанию",
    sortby: "rank",
    dir: "asc"
  },
  limit: 0,
  offset: 0,
  needComposition: 1
});

let getCountProducts = async () => {
  let response = await apiClient.get(`/products-count?limit=${limitPage.value}`);
  countPage.value = response.data.pages;
};

let getProducts = async (page) => {
  let refFilter = {...filter}

  refFilter.sortBy = JSON.stringify(refFilter.sortBy)
  refFilter.limit = limitPage.value
  refFilter.offset = (page - 1) * limitPage.value

  let response = await apiClient.get(`/products?${new URLSearchParams(refFilter)}`);
  products.value = response.data;
  currentPage.value = page;
};

onMounted(() => {
  getCountProducts()
  getProducts(currentPage.value);
});

watch(() => filter.sortBy, () => {
  getProducts(currentPage.value);
}, { deep: true });


const isFixed = ref(false);
const header = ref(null);
let headerHeight = 0;

const handleScroll = () => {
  isFixed.value = window.scrollY > headerHeight/2;
};

const countProduct = computed(() => {
  let count = null;
  proxy.$store.cartInfo.cart.forEach((product) => {
    count += product.quantity
  })
  return count
});

const priceProduct = computed(() => {
  let price = null;
  proxy.$store.cartInfo.cart.forEach((product) => {
    price += product.quantity * product.price
  })
  return price
});

const discountProducts = computed(() => {
  let discount = null;
  proxy.$store.cartInfo.cart.forEach((product) => {
    if (product.old_price){
      discount += (product.old_price - product.price) * product.quantity
    }
  })
  return discount
});

onMounted(() => {
  if (header.value) {
    headerHeight = header.value.$el.offsetHeight;
    window.addEventListener('scroll', handleScroll);
  }
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

</script>
