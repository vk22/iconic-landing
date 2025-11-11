<template>
  <div class="form-container w-full max-w-md px-5 bg-[#ffffff]">
    <div class="flex flex-col items mb-3 md:mb-6">
      <TitleH2
        v-if="mode === 'popup'"
        :text="'Secure Your Residence at ICONIC'"
        :align="'left'"
      ></TitleH2>
      <TitleH3
        v-else
        :text="'Secure Your Residence at ICONIC'"
        :align="'left'"
      ></TitleH3>
      <p class="text">
        Fill in your details and our team will contact you shortly with full
        project information and personalized offers.
      </p>
    </div>

    <form @submit.prevent="onSubmit">
      <div class="flex flex-col md:flex-col">
        <div class="mb-1 px-4 py-2 bg-[#f6f6f6]">
          <div class="flex">
            <div class="basis-1/2">
              <input
                id="client"
                class="peer/client"
                type="radio"
                name="status"
                value="client"
                v-model="form.clientType"
                checked
              />
              <label
                for="client"
                class="peer-checked/client:text-[#000000] ml-2 text-[.9rem]"
                >Client</label
              >
            </div>
            <div class="basis-1/2">
              <input
                id="broker"
                class="peer/broker"
                type="radio"
                name="status"
                value="broker"
                v-model="form.clientType"
              />
              <label
                for="published"
                class="peer-checked/broker:text-[#000000] ml-2 text-[.9rem]"
                >Broker</label
              >
            </div>
          </div>
          <fieldset></fieldset>
        </div>
        <div class="w-full">
          <div class="mb-2">
            <input
              v-model="form.full_name"
              type="text"
              required
              :class="inputClass"
              placeholder="Full Name"
            />
          </div>
          <div class="mb-2">
            <input
              class="border-0 border-b-1 border-grey-dark bg-white focus:outline-none"
              v-model="form.email"
              type="email"
              required
              :class="inputClass"
              placeholder="Email"
            />
          </div>
        </div>
        <div class="w-full">
          <div class="mb-2">
            <input
              class="border-0 border-b-1 border-grey-dark bg-white focus:outline-none"
              v-model="form.phone"
              type="phone"
              required
              :class="inputClass"
              placeholder="Phone"
            />
          </div>

          <div class="mb-2">
            <select
              id="countries"
              v-model="form.apartment_type"
              :class="selectClass"
            >
              <option disabled selected value="" class="text-gray-400">
                Apartment Type
              </option>
              <option value="A1">A1</option>
              <option value="A2">A2</option>
            </select>
          </div>
          <div class="mb-2 py-4 text-xs">
            By submitting, you agree to our
            <NuxtLink to="/terms-and-conditions" class="underline"
              >terms & conditions.</NuxtLink
            >.
          </div>
        </div>
      </div>

      <Button :size="'big'" :text="'Get a Call Back'" :type="'submit'"></Button>

      <p
        v-if="message"
        :class="success ? 'text-dark' : 'text-red-600'"
        class="mt-4"
      >
        {{ message }}
      </p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";

const props = defineProps({
  mode: {
    type: String,
    default: "", 
  },
});

const imageLoaded = ref(false);
const image = "/img/contact.jpg";
const contentVisible = ref(false);

const form = ref({
  clientType: "client",
  full_name: "",
  email: "",
  phone: "",
  apartment_type: "",
});

const selectColor = ref("text-gray-500");

const message = ref<string | null>(null);
const success = ref(false);
const inputClass =
  "placeholder-gray-400 focus:placeholder-gray-700 bg-white border-0 border-b-1 border-grey-dark text-gray-900 text-sm focus:outline-none focus:border-grey-500 block w-full py-3 autofill:bg-white";
const selectClass = ref(
  `w-full bg-gray-50 py-3 bg-white border-0 border-b-1 border-grey-dark focus:outline-none text-sm text-gray-500`
);

const onSubmit = async () => {
  message.value = null;
  try {
    const { error } = await useFetch("/api/form", {
      method: "POST",
      body: form.value,
    });
    if (error.value) throw error.value;
    success.value = true;
    message.value =
      "Thank you! Your request has been received. Our team will contact you shortly with full project details.";
  } catch (err) {
    success.value = false;
    message.value = "An error has occurred. Please try again later.";
  }
};

const sizes = {
  big2: "text-[.85rem] md:text-[.95rem]",
  big: "text-[.75rem] md:text-[.75rem]",
  small: "text-[.65rem] md:text-[.7rem]",
};

watch(form.value, (newValue, oldValue) => {
  if (newValue.apartment_type) {
    selectClass.value = `w-full bg-gray-50 py-3 bg-white border-0 border-b-1 border-grey-dark focus:outline-none text-sm text-gray-900`;
  }
});

onMounted(() => {
  const img = new Image();
  img.src = image;
  img.onload = () => {
    imageLoaded.value = true;
    setTimeout(() => (contentVisible.value = true), 300);
  };
});
</script>

<style scoped>
.form-container {
  width: 100%;
  max-width: 900px;
}

.main-btn {
  background: #0a4b5c;
}

.main-btn:hover {
  background: #053440;
}
input:-webkit-autofill {
  -webkit-box-shadow: 0 0 0 50px white inset; /* Change the color to your own background color */
  -webkit-text-fill-color: #333;
}

input:-webkit-autofill:focus {
  -webkit-box-shadow: 0 0 0 50px white inset; /*your box-shadow*/
  -webkit-text-fill-color: #333;
}

select option[disabled] {
  color: #9ca3af; /* text-gray-400 */
}

input,
select {
  border-bottom: 1px solid #444;
}
</style>
