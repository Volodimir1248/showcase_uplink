<template>
  <div class="product-item">
    <div
        class="product-item-img"
        @click="showModal(product)"
        @close="closeModal"
    >
      <img :src="imgUrl" :alt="product.name" :title="product.name" itemprop="image">
    </div>
    <div class="product-item-price-row">
      <p class="product-item-price">{{ product.price }} ₽</p>
      <p v-if="product.old_price" class="product-item-old-price">{{ product.old_price }} ₽</p>
      <template v-if="product.discount > 0">
        <div v-if="product.is_discount_number > 0" class="product-item-discount">{{ product.discount }}₽</div>
        <div v-else class="product-item-discount">{{ product.discount }}%</div>
      </template>
    </div>
    <div class="product-item-title">
      {{ product.name }}
    </div>
    <div class="product-item-add-to-cart">
      <div
          v-if="countProduct === 0"
          class="empty"
          @click="addToCart"
      >
        <IconCart />
        В корзину
      </div>

      <div
          v-else
          class="not_empty"
      >
        <span @click="removeToCart">-</span>
        <span>{{countProduct}}</span>
        <span @click="addToCart">+</span>
      </div>


    </div>
  </div>
</template>

<script setup>

import { computed, getCurrentInstance, toRefs } from 'vue';
import IconCart from "@/components/icons/IconCart.vue";
import {useModal} from 'vue-final-modal';
import ProductModal from "@/components/ProductModal.vue";
import {useCartInfo} from "@/stores/cartInfo";

const cartInfo = useCartInfo();
const { proxy } = getCurrentInstance();
const $mainSite = proxy.$mainSite;
const $store = proxy.$store;

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const productModal = useModal({
  component: ProductModal,
  attrs: {
    product: {}
  },
});

function showModal(product) {
  productModal.patchOptions({
    attrs: {
      product: product
    },
  });
  productModal.open();

}

function addToCart() {
  let product = {
    id: props.product.id,
    name: props.product.name,
    price: props.product.price,
    old_price: props.product.old_price,
    image: props.product.images[0].url
  }
  cartInfo.addItem(product);
}

function removeToCart() {
  cartInfo.removeItem(props.product.id);
}

const { product } = toRefs(props);
const imgUrl = computed(() => $mainSite + product.value.images[0].url);

const countProduct = computed(() => {
  let existingProduct = $store.cartInfo.cart.find(item => item.id === props.product.id);
  if (existingProduct){
    return existingProduct.quantity
  }
  return 0
});



</script>
