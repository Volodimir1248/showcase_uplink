<template>
  <div>
    <HeaderCart/>

    <div class="container">
      <div class="cart-block">
        <div class="order-input">


          <div>
            <h4 class="order-input__row-title">Укажите Ваши контактные данные:</h4>
            <div class="order-input__row">
              <div class="order-input__container">
                <div v-for="info_key in Object.keys(order.user)" :key="info_key" class="form-group row input-parent">
                  <input
                      :class="{ error: !errors[info_key] }"
                      type="text"
                      :placeholder="titles[info_key]"
                      :name="info_key"
                      v-model="order.user[info_key]"
                      required>
                </div>
                <div class="form-group"></div>
              </div>
            </div>

            <h4 class=order-input__row-title>Кому отправить букет?</h4>
            <div class="order-input__row">
              <div class="order-input__container">
                <div class="card-checkbox">
                  <input id="checkout_sender" name="checkout_sender" type="checkbox" v-model="order.im_receiver">
                  <label for="checkout_sender">Я сам получу заказ</label>
                </div>
                <div v-if="!order.im_receiver" class="form-group row input-parent checkout_sender-group">
                  <input
                      type="text"
                      placeholder="Имя получателя*"
                      name="receiver_name"
                      v-model="order.receiver.name"
                      class="form-control"
                      :class="{ error: !errors.receiver_name }"
                  >
                </div>
                <div v-if="!order.im_receiver" class="form-group row input-parent checkout_sender-group">
                  <input
                      type="text"
                      placeholder="Телефон получателя*"
                      name="receiver_phone"
                      v-model="order.receiver.phone"
                      class="form-control"
                      :class="{ error: !errors.receiver_name }"
                  >
                </div>
              </div>
            </div>

            <div class="order-input__row">
              <h4 class=order-input__row-title>Укажите адрес доставки</h4>
              <span class="validation-text" :class="{ error: !errors.delivery_rank }" >Необходимо выбрать способ доставки!</span>
              <!--            <span class="validation-text" :class="{ error: !errors.deliveryadress }" >Нужно выбрать район </span>-->
              <div class="order-input__container">
                <div v-if="!order.courier" class="card-checkbox card-checkbox-pickup">
                  <input id="delivery_type-pickup" type="checkbox" v-model="order.pickup" :value="0" @change="deliveryPrice($event)">
                  <label for="delivery_type-pickup">Самовывоз</label>
                </div>
                <div v-if="!order.pickup" class="card-checkbox card-checkbox-courier">
                  <input id="delivery_type-courier" type="checkbox" v-model="order.courier" :value="1" @change="deliveryPrice($event)">
                  <label for="delivery_type-courier">Доставка курьером</label>
                </div>

                <div class="block-pickup" v-if="order.pickup">
                  <div
                      class="card-checkbox"
                      v-for="(delivery, delivery_key) in deliveriesList"
                      :key="delivery_key"
                  >
                    <input :id="'delivery' + delivery.id" type="radio" name="delivery" :value="delivery.id" v-model="order.delivery" @change="deliveryPrice($event)">
                    <label :for="'delivery' + delivery.id">{{ delivery.name }}</label>
                  </div>
                </div>

                <div class="block-courier" v-if="order.courier">
                  <div class="card-checkbox">
                    <input name="checkout_reciever_address" type="checkbox" v-model="order.checkout_reciever_address">
                    <label for="checkout_reciever_address">Уточнить адрес у получателя</label>
                  </div>

                  <div class="block-courier-select" :class="order.checkout_reciever_address ? 'block-courier-case' : ''">
                    <div class="form-select2 ">
                      <select name="delivery" class="delivery-select select2" v-model="order.delivery" @change="deliveryPrice($event)">
                        <option v-for="(delivery, delivery_key) in deliveriesList" :key="delivery_key" :value="delivery.id"> {{ delivery.name }} </option>
                      </select>
                    </div>

                    <div v-if="order.checkout_reciever_address" class="form-group"></div>

                    <div
                        v-for="address_key in Object.keys(order.address)"
                        :key="address_key"
                        class="form-group row input-parent group-address"
                        v-show="!order.checkout_reciever_address"
                    >
                      <input
                          type="text"
                          :placeholder="titles[address_key]"
                          :name="address_key"
                          v-model="order.address[address_key]"
                          class="form-control">
                    </div>
                  </div>

                  <div class="form-group row input-parent form-group-textarea">
                  <textarea
                      name="comment"
                      placeholder="Комментарий"
                      class="form-control{('comment' in list $errors) ? ' error' : ''}"
                      v-model="order.comment"
                  />
                  </div>
                </div>
              </div>
            </div>

            <h4 class=order-input__row-title>Выберите дату и время доставки</h4>
            <div class="order-input__row order-input__date">
              <div class="order-input__container">
                <div class="card-checkbox">
                  <input id="checkout_delivery_date" name="checkout_delivery_date" type="checkbox" v-model="order.checkout_delivery_date">
                  <label for="checkout_delivery_date">Уточнить у получателя</label>
                </div>

                <div
                    v-if="!order.checkout_delivery_date"
                    class="form-group row input-parent date-main"
                >
                  <VueDatePicker
                      v-model="order.delivery_date"
                      locale="ru-RU"
                      :enable-time-picker="false"
                      :min-date="new Date()"
                      :format="formatDate"
                      placeholder=""
                  />
                </div>

                <div class="form-group"></div>

                <div
                    v-if="!order.checkout_delivery_date && intervals.length > 0"
                    class="time-container form-group row input-parent"
                    :class="order.checkout_delivery_date ? 'delivery-date-inactive' : ''"
                >
                  <select name="delivery_time" class="select2" v-model="order.delivery_time">
                    <option
                        v-for="(interval, interval_key) in intervals"
                        :key="interval_key"
                        :value="interval.value"
                        :disabled="interval.disabled"
                    >
                      {{ interval.value }}
                    </option>
                  </select>
                </div>
                <div class="form-group"></div>
              </div>
            </div>

            <h4 class=order-input__row-title>Дополнительно</h4>
            <div class="order-input__row">
              <div class="order-input__container">
                <div class="card-checkbox">
                  <input id="checkout_anonymous" name="checkout_anonymous" type="checkbox" v-model="order.checkout_anonymous">
                  <label for="checkout_anonymous">Отправить анонимно</label>
                </div>

                <div></div>
                <div class="card-checkbox">
                  <input id="checkout_make_photo" name="checkout_make_photo" type="checkbox" v-model="order.checkout_make_photo">
                  <label for="checkout_make_photo">Сделать фото с получателем</label>
                </div>
              </div>
            </div>

            <div class="order-input__row" id="payments">
              <div class="order-input__row-title">Выберите способ оплаты</div>
              <div class="payments__rows">
                <div
                    class="card-checkbox payments__row input-parent"
                    v-for="(payment, payment_key) in payments"
                    :key="payment_key"
                >
                  <label class="col-form-label payment">
                    <input type="radio" name="payment" v-model="order.payment" :value="payment.id">
                    <img :src="$mainSite + payment.logo" :alt="payment.name" :title="payment.name" class="mw-100"/>
                    <span>{{ payment.name }}</span>
                  </label>
                </div>
              </div>
            </div>

          </div>

          <div id="msCart" class="cart-product-total">
            <p class="cart-product-total-title">Стоимость</p>
            <div class="ms-footer">
              <div class="total_count">
                <div class="total_count-case">
                  <div>Товаров ({{ countProducts }})</div>
                  <div>
                    <span class="ms2_order_cart_cost">{{ order.cart_cost }}</span> ₽
                  </div>
                </div>
                <div class="total_count-case">
                  <div>Доставка</div>
                  <div>
                    <span class="ms2_order_delivery_cost">{{ order.delivery_cost }}</span> ₽
                  </div>
                </div>
                <div class="total_count-case">
                  <div>Скидка</div>
                  <div>
                    <span class="">{{ order.discount_cost }}</span> ₽
                  </div>
                </div>
              </div>

              <div class="total_cost text-nowrap">
                <div class="total">
                  <div class="total-cost">
                    <p>Итого</p>
                    <div>
                      <span class="ms2_order_cost ms2_total_summ">{{ order.cost }}</span>
                      <span> ₽</span>
                    </div>
                  </div>
                  <span class="make-order" @click="checkValidation()"> Заказать </span>
                </div>
              </div>
              <div class="total-policy">
                Нажимая кнопку заказать вы принимаете
                <router-link to="/policy">
                  политику конфиденциальности
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>

    <Footer/>
  </div>


</template>

<script setup>
import {ref, reactive, onMounted, watch, computed, getCurrentInstance} from 'vue';
import HeaderCart from "@/components/HeaderCart.vue";
import Footer from "@/components/Footer.vue";
const { proxy } = getCurrentInstance();
import {useCartInfo} from "@/stores/cartInfo";
import apiClient from "@/axios.js";
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

const cartInfo = useCartInfo();
const $mainSite = proxy.$mainSite;

const titles = {
  fullname: "Ваше Имя*",
  mobilephone: "Ваш телефон*",
  email: "E-mail*",
  building: "Дом",
  entrance: "Подъезд",
  floor: "Этаж",
  room: "Квартира",
  street: "Улица",
}

let errors =  reactive({
  fullname: true,
  mobilephone: true,
  email: true,
  receiver_name: true,
  receiver_phone: true,
  delivery_rank: true
})

let order =  reactive({
  checkout_anonymous: false,// отправить анонимно
  checkout_delivery_date: false,// Уточнить дату и время у получателя (или Уточнить у  получателя)
  checkout_make_photo: false,// сделать фото с получателем
  checkout_reciever_address: false,// уточнить адрес у получателя
  delivery_date: "", // дата доставки(можно не убирать время)
  delivery_time: "", // времядоставки
  im_receiver: false, // я и есть получатель
  delivery_rank: "",// способ доставки, 0 – самовывоз, 1 – Доставка курьером
  pickup: false,
  courier: false,

  comment: "",

  address: {
    building: "", // дом
    entrance: "", // подъезд
    floor: "", // этаж
    room: "", // квартира
    street: "",// улица,
  },

  user: { // контактные данные
    fullname: "", // ваше имя
    mobilephone: "", // ваш телефон
    email: ""// e-mail
  },

  receiver: {
    name: "",// имяполучателя
    phone: "", // телефон получателя
  },

  cart_cost: 0, // сумма товаров
  cost: 0, // сумма заказов (она же ИТОГО)
  delivery: 0,// вариант доставки
  delivery_cost: 0, // стоимость доставки
  payment: 0,// способ оплаты
});

let deliveryIntervals = ref([]);
let deliveriesList = ref([]);
let paymentsList = ref([]);

const payments = computed(() => {
  order.payment = 0
  if (deliveriesList.value.length > 0 && paymentsList.value.length > 0){
    let delivery = deliveriesList.value.find((item) =>{
      if (item.id === order.delivery) return item
    })

    return paymentsList.value.filter((payment) => {
      if (delivery.payments.indexOf(payment.id) > -1) return payment
    })
  }
  return []
});

const intervals = computed(() => {

  let today = new Date()
  today = new Date(today.getFullYear(), today.getMonth(), today.getDate())

  let selectDate = new Date(order.delivery_date)
  selectDate = new Date(selectDate.getFullYear(), selectDate.getMonth(), selectDate.getDate())

  if (Number(today) === Number(selectDate)){

    let realClock = new Date().getHours();
    let intervals = []
    deliveryIntervals.value.forEach((elem) => {
      let interval = {
        value: elem
      }

      let clockStart = elem.split('-')[0].split(':')[0];
      if (Number(clockStart) < Number(realClock)) {
        interval.disabled = "disabled"
      }
      intervals.push(interval)
    })
    return intervals
  }else{
    return deliveryIntervals.value.map((elem) => {
      return {value: elem}
    })
  }
})

const countProducts = computed(() => {
  let count = null;
  cartInfo.cart.forEach((product) => {
    count += product.quantity
  })
  return count
});

const priceProducts = computed(() => {
  let price = null;
  cartInfo.cart.forEach((product) => {
    price += product.quantity * product.price
  })
  return price
});

const discountProducts = computed(() => {
  let discount = null;
  cartInfo.cart.forEach((product) => {
    if (product.old_price){
      discount += (product.old_price - product.price) * product.quantity
    }
  })
  return discount
});

async function getDeliveriesList() {
  let responseDeliveries = await apiClient.get('/deliveries-list');
  deliveriesList.value = responseDeliveries.data.deliveries

  order.delivery = deliveriesList.value[0].id
  order.delivery_cost = order.pickup ? 0 : Number(deliveriesList.value[0].price)
}

async function getPaymentsList() {
  let responsePayments = await apiClient.get('/payments-list');
  paymentsList.value = responsePayments.data.payments
}

async function getIntervals() {
  let responseIntervals = await apiClient.get('/intervals');
  deliveryIntervals.value = responseIntervals.data.intervals.options.split(",")
}

function init() {
  getDeliveriesList();
  getPaymentsList()
  getIntervals()

  order.products = cartInfo.cart
  order.cart_cost = priceProducts
  order.discount_cost = discountProducts

  order.delivery_date = new Date()
}

function deliveryPrice(event){
  if (order.pickup){
    order.delivery_cost = 0
  }else if(order.courier){
    let delivery = deliveriesList.value.find((elem) =>{
      if (Number(elem.id) === Number(event.target.value)) return elem
    })
    order.delivery_cost = Number(delivery.price)
  }
}

function clearErrors(){
  Object.keys(errors).forEach((key) => {
    errors[key] = true
  })
}

async function checkValidation(){
  clearErrors()

  errors.fullname = order.user.fullname !== ""
  errors.mobilephone = order.user.mobilephone !== ""
  errors.email = order.user.email !== ""
  errors.delivery_rank = order.delivery_rank !== ""

  if (!order.im_receiver){
    errors.receiver_name = order.receiver.name !== ""
    errors.receiver_phone = order.receiver.phone !== ""
  }

  let finalError = true
  Object.keys(errors).forEach((key) => {
    finalError = finalError && errors[key]
  })

  if (finalError){
    await makeOrder()
  }
}

async function makeOrder(){
  let responseMakeOrder = await apiClient.post('/make-order', order);
  console.log(responseMakeOrder)
}

const formatDate = (date) => {
  const day = ("0" + date.getDate()).slice(-2);
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

onMounted(() => {
  init();
});

watch(() => order, () => {
  order.cost = order.cart_cost + order.delivery_cost - order.discount_cost
}, { deep: true });

watch(() => order.pickup, () => {
  order.delivery_rank = order.pickup ? "0" : ""
});

watch(() => order.courier, () => {
  order.delivery_rank = order.courier ? "1" : ""
});

watch(() => intervals, () => {
  if (intervals){
    let delivery_time = Object.values(intervals.value).filter((interval) => {
      if (!interval.disabled) return interval
    })
    order.delivery_time = delivery_time[0] ? delivery_time[0].value : ""
  }

}, { deep: true });





</script>
