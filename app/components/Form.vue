<template>
  <div class="form-container w-full max-w-md px-0 bg-[#ffffff]">
    <div class="flex flex-col items mb-3 md:mb-5">
      <TitleH4
        v-if="mode === 'popup'"
        :text="$t('form.title')"
        :align="'left'"
        class="pr-[10%] md:pr-[20%]"
      ></TitleH4>
      <TitleH3
        v-else
        :text="$t('form.title')"
        :align="'left'"
        class="pr-[2%] md:pr-[5%]"
      ></TitleH3>
      <p :class="{ 'text-[.75rem]': mode === 'popup' }">
        {{ $t("form.text") }}
      </p>
    </div>

    <form @submit.prevent="onSubmit">
      <div class="flex flex-col md:flex-col">
        <div class="mb-1 px-3 py-1 bg-[#f6f6f6] rounded-[99rem]">
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
                >{{ $t("form.client") }}</label
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
                >{{ $t("form.broker") }}</label
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
              :placeholder="$t('form.fullName')"
            />
          </div>
          <div class="mb-2">
            <input
              v-model="form.email"
              type="email"
              required
              :class="inputClass"
              :placeholder="$t('form.email')"
            />
          </div>
        </div>
        <div class="w-full">
          <div class="mb-2">
            <!-- <input
              v-model="form.phone"
              type="phone"
              required
              :class="inputClass"
              placeholder="Phone"
            /> -->
            <vue-tel-input
              :mode="''"
              :inputOptions="{ placeholder: $t('form.phone') }"
              :class="inputClass"
              v-model="form.phone"
              @validate="setIfValidPhone"
              :validCharactersOnly="true"
            ></vue-tel-input>
            <div
              class="phone-error text-xs text-[#d20404] mt-1"
              v-if="showPhoneError"
            >
              {{ $t("form.errorMessage") }}
            </div>
          </div>

          <div class="mb-2">
            <select
              id="countries"
              v-model="form.apartmentType"
              :class="selectClass"
            >
              <option disabled selected value="" class="text-gray-300">
                {{ $t("form.apType") }}
              </option>
              <option
                :value="type"
                v-for="(type, index) in apartmentTypeOptions"
                :key="index"
              >
                {{ type }}
              </option>
            </select>
          </div>
          <div class="mb-2 py-4 text-xs">
            {{ $t("form.subtext") }}
            <NuxtLink to="/terms-and-conditions" class="underline">
              {{ $t("form.sublink") }}</NuxtLink
            >
          </div>
        </div>
      </div>

      <Button
        :size="'big2'"
        :text="$t('form.btn')"
        :type="'submit'"
        :icon="loading"
      ></Button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { gtmPush } from "../utils/gtm";
import { usePopup } from "../composables/usePopup";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const {
  isPopupOpen,
  isFormOpen,
  isSuccessOpen,
  setPopupMode,
  setFormMode,
  setSuccessMode,
  setResult,
  formResult,
} = usePopup();

const props = defineProps({
  mode: {
    type: String,
    default: "",
  },
});

// const emit = defineEmits(['formSent']);

const form = ref({
  clientType: "client",
  full_name: "",
  email: "",
  phone: "",
  apartmentType: "",
});

const isValidPhone = ref(false);
const showPhoneError = ref(false);

const loading = ref(false);

const apartmentTypeOptions = [
  "1-bedroom",
  "2-bedroom",
  "3-bedroom +",
  "Penthouse / luxury apartment",
];

const inputClass =
  "text-left placeholder-gray-400 focus:placeholder-gray-700 bg-white border-0 border-b border-[#999] text-gray-900 text-sm focus:outline-none shadow-none focus:border-grey-500 block w-full py-3 autofill:bg-white";
const selectClass = ref(
  `text-left w-full bg-gray-50 py-3 bg-white border-0 border-b border-[#999] focus:outline-none text-sm text-gray-400`
);

const setIfValidPhone = (data: object) => {
  isValidPhone.value = data.valid;
};

const onSubmit = async () => {
  if (!isValidPhone.value) {
    alert("Enter a valid phone number!");
    //showPhoneError.value = true;
    return;
  }
  loading.value = true;
  try {
    const { error } = await useFetch("/api/form", {
      method: "POST",
      body: form.value,
    });
    if (error.value) throw error.value;

    gtmPush({
      event: "GAEvent",
      event_params: {
        eventCategory: "form",
        eventAction: "success",
        eventLabel: "applicationland",
        data: "form_success_applicationland",
      },
    });

    setPopupMode(false);
    setFormMode(false);
    setSuccessMode(false);

    setTimeout(() => {
      setResult({
        success: true,
        title: t("form.responseMessage-1"),
        message: t("form.responseMessage-2"),
      });
      setPopupMode(true);
      setSuccessMode(true);
    }, 1000);

    form.value = {
      clientType: "client",
      full_name: "",
      email: "",
      phone: "",
      apartmentType: "",
    };
  } catch (err) {
    setResult({
      success: false,
      title: "Oops!",
      message: "An error has occurred. Please try again later.",
    });
  }
  loading.value = false;
};

const sizes = {
  big2: "text-[.85rem] md:text-[.95rem]",
  big: "text-[.75rem] md:text-[.75rem]",
  small: "text-[.65rem] md:text-[.7rem]",
};

watch(form.value, (newValue, oldValue) => {
  if (newValue.apartmentType) {
    selectClass.value = `w-full bg-gray-50 py-3 bg-white border-0 border-b border-[#999] focus:outline-none text-sm text-gray-900`;
  }
});

onMounted(() => {});
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
  color: #9ca3af;
}

input,
select {
}

.vue-tel-input {
  border-radius: 0px;
  display: flex;
  border: none;
  border-bottom: 1px solid #999;
  box-shadow: none;
}

.vue-tel-input:focus {
  outline: none; /* Optional: Remove the default browser outline */
  box-shadow: 0 0 0 3px rgba(255, 89, 0, 0.5) !important; /* Blue shadow */
}

.vti__dropdown-list {
  z-index: 999;
}
</style>
