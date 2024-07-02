<template>
  <VueFinalModal
      v-slot="{ close }"
      class="product-card-overlay"
  >
    <div class="product-card-overlay__header">
      <div @click="close" class="go-back">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 6L9 12L15 18" stroke="#B9B9B9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Вернуться на главную
      </div>
    </div>
    <div class="product-card-overlay__content">
      <div class="product-card-overlay__wrap">
        <swiper
            class="mainSwiper"
            :navigation="true"
            :thumbs="{ swiper: thumbsSwiper }"
            :modules="[Autoplay, Navigation, Pagination, Thumbs]"

            :pagination="{
          clickable: true,
          el: '.swiper-pagination',
          renderBullet: renderBullet
        }"

            :style="{
          '--swiper-navigation-color': '#fff',
          '--swiper-pagination-color': '#fff',
        }"
            :autoplay="{ delay: 5000, disableOnInteraction: false }"
            @slideChange="slideChange"
            @autoplayTimeLeft="autoplayTimeLeft"
        >
          <swiper-slide
              v-for="(image, image_key) in product.images"
              :key="image_key"
              class="swiper-slide"
          >
            <img :src="srcImage(image.url)" :alt="product.name + image.rank">
          </swiper-slide>
        </swiper>

        <div class="swiper-pagination product-pagination"></div>

        <swiper
            v-if="product.images.length > 1"
            @swiper="setThumbsSwiper"
            :spaceBetween="10"
            :modules="[Navigation, Pagination, Thumbs]"
            class="thumbSwiper"
        >
          <swiper-slide
              v-for="(image, image_key) in product.images"
              :key="image_key"
              class="swiper-slide"
          >
            <img :src="srcImage(image.url)" :alt="product.name + image.rank">
          </swiper-slide>
        </swiper>
      </div>

      <div class="product-card__info-container">
        <div class="product-card__info-title">
          {{ product.name }}
        </div>
        <hr>
        <div class="product-card__info-price">
          <div class="product-card__info-price-row">
            <p>Цена</p>
            <b>{{ product.price }} ₽</b>
          </div>
          <div v-if="product.discount > 0" class="product-card__info-price-row product-card__info-oldprice">
            <div v-if="product.is_discount_number > 0" class="product-card__info-discount">{{ product.discount }} ₽</div>
            <div v-else class="product-card__info-discount">{{ product.discount }} %</div>
            <span>{{ product.old_price }} ₽</span>
          </div>
          <span @click="showModal()" class="product-card__info-tocart">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.40499 18C4.90954 18 4.48554 17.8239 4.13302 17.4717C3.78049 17.1195 3.60393 16.6956 3.60333 16.2C3.60333 15.705 3.77989 15.2814 4.13302 14.9292C4.48614 14.577 4.91014 14.4006 5.40499 14.4C5.90045 14.4 6.32474 14.5764 6.67787 14.9292C7.031 15.282 7.20726 15.7056 7.20666 16.2C7.20666 16.695 7.0304 17.1189 6.67787 17.4717C6.32534 17.8245 5.90105 18.0006 5.40499 18ZM14.4133 18C13.9179 18 13.4939 17.8239 13.1413 17.4717C12.7888 17.1195 12.6123 16.6956 12.6117 16.2C12.6117 15.705 12.7882 15.2814 13.1413 14.9292C13.4945 14.577 13.9185 14.4006 14.4133 14.4C14.9088 14.4 15.3331 14.5764 15.6862 14.9292C16.0393 15.282 16.2156 15.7056 16.215 16.2C16.215 16.695 16.0387 17.1189 15.6862 17.4717C15.3337 17.8245 14.9094 18.0006 14.4133 18ZM3.7835 1.8H17.0708C17.4161 1.8 17.6788 1.9539 17.859 2.2617C18.0392 2.5695 18.0467 2.8806 17.8815 3.195L14.6836 8.955C14.5184 9.255 14.2971 9.4875 14.0197 9.6525C13.7422 9.8175 13.438 9.9 13.1071 9.9H6.39591L5.40499 11.7H16.215V13.5H5.40499C4.72937 13.5 4.2189 13.2039 3.87358 12.6117C3.52826 12.0195 3.51325 11.4306 3.82854 10.845L5.04466 8.64L1.80166 1.8H0V0H2.92771L3.7835 1.8Z"/>
          </svg>
          <span class="text">
            В корзину
          </span>
        </span>
        </div>
        <hr>
        <div class="product-card__info-contains">
          Состав:
          <div>
            <p v-for="(composition, composition_key) in product.composition" :key="composition_key">
              {{ composition.sostav }} - {{ composition.kolichestvo }} шт.
            </p>
          </div>
        </div>
        <svg @click="close" class="product-card-overlay__close-button" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 1L19 19M19 1L1 19" stroke="#B9B9B9"></path>
        </svg>
      </div>
    </div>


  </VueFinalModal>
</template>

<script setup>
import {getCurrentInstance, toRefs, ref} from 'vue';
import {useModal, VueFinalModal} from 'vue-final-modal'

import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/swiper-bundle.css';
import { Autoplay, Navigation, Pagination, Thumbs } from 'swiper/modules';
import AddItemInCart from "@/components/AddItemInCart.vue";
import {useCartInfo} from "@/stores/cartInfo";

const cartInfo = useCartInfo();

const props = defineProps({
  product: {
    type: Object,
    default: () => ({})
  }
});

const { proxy } = getCurrentInstance();
const { product } = toRefs(props);

function srcImage(url){
  return proxy.$mainSite + url
}

const thumbsSwiper = ref(null);

const setThumbsSwiper = (swiper) => {
  thumbsSwiper.value = swiper;
};

let renderBullet = function (index, className) {
  return '<span class="' + className + '"> <div> </div> </span>'
}

let progressBullet;
let progressBulletActive;

const slideChange = function () {
  progressBullet = document.querySelector(".swiper-pagination .swiper-pagination-bullet-active");
  if (progressBulletActive) {
    progressBulletActive.style.maxWidth = '0%';
  }
}

const autoplayTimeLeft = function (s, time, progress) {
  progressBulletActive = document.querySelector(".swiper-pagination .swiper-pagination-bullet-active div");
  progress = (1 - progress) * 80;
  if (progressBulletActive != null) {
    progressBulletActive.style.maxWidth = progress + 20 + '%';
  }
}

const productModal = useModal({
  component: AddItemInCart
});

function showModal() {
  let product = {
    id: props.product.id,
    name: props.product.name,
    price: props.product.price,
    old_price: props.product.old_price,
    image: props.product.images[0].url
  }
  cartInfo.addItem(product);

  productModal.open();
}

</script>

