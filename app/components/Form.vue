<template>
  <div class="form-container w-full max-w-md px-0 bg-[#ffffff]">
    <div class="flex flex-col items mb-3 md:mb-5">
      <uiTitleH4
        v-if="mode === 'popup'"
        :text="$t('form.title')"
        :align="'left'"
        class="pr-[10%] md:pr-[20%]"
      >
      </uiTitleH4>
      <uiTitleH3
        v-else
        :text="$t('form.title')"
        :align="'left'"
        class="pr-[2%] md:pr-[5%]"
      ></uiTitleH3>
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
                class="peer-checked/client:text-[#000000] mx-2 text-[.9rem]"
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
                class="peer-checked/broker:text-[#000000] mx-2 text-[.9rem]"
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
          <div class="mb-2">
            <vue-tel-input
              :mode="''"
              :inputOptions="{ placeholder: $t('form.phone') }"
              :class="inputTelClass"
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
            <div class="relative">
              <select
                v-model="form.apartmentType"
                class="block appearance-none w-full bg-white border-b border-gray-400 hover:border-gray-500 py-4 pr-8 leading-tight focus:outline-none focus:shadow-outline text-sm"
                :class="{
                  'text-gray-400': form.apartmentType === '',
                  'text-gray-900': form.apartmentType !== '',
                }"
              >
                <option disabled selected value="">
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
              <div
                class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-0 text-gray-700"
              >
                <!-- Custom Arrow SVG -->
                <svg
                  class="fill-current h-4 w-4"
                  xmlns="www.w3.org"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <!-- honeypot -->
          <input
            v-model="form.company"
            type="text"
            tabindex="-1"
            autocomplete="off"
            style="
              position: absolute;
              left: -9999px;
              opacity: 0;
              pointer-events: none;
            "
          />

          <div id="cf-turnstile"></div>

          <div class="mb-2 py-4 text-xs">
            {{ $t("form.subtext") }}
            <NuxtLink to="/terms-and-conditions" class="underline">
              {{ $t("form.sublink") }}</NuxtLink
            >
          </div>
        </div>
      </div>

      <uiMainButton
        :mode="'submitForm'"
        :size="'big'"
        :text="$t('form.btn')"
        :type="'submit'"
        :icon="loading"
      >
      </uiMainButton>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import { VueTelInput } from "vue-tel-input";
import "vue-tel-input/vue-tel-input.css";
import { useI18n } from "vue-i18n";
import { usePopup } from "../composables/usePopup";

useHead({
  script: [
    {
      src: "https://challenges.cloudflare.com/turnstile/v0/api.js",
      async: true,
      defer: true,
    },
  ],
});

const { t } = useI18n();
const { $gtmPush } = useNuxtApp();
const config = useRuntimeConfig();

const {
  setPopupMode,
  setFormMode,
  setSuccessMode,
  setResult,
} = usePopup();

const modes = ["download", "default"] as const;
type FormMode = (typeof modes)[number];

const props = withDefaults(
  defineProps<{
    mode: FormMode;
  }>(),
  {
    mode: "default",
  }
);

const apartmentTypeOptions = [
  "1-bedroom",
  "2-bedroom",
  "3-bedroom +",
  "Penthouse / luxury apartment",
];

const inputClass =
  "text-start placeholder-gray-400 focus:placeholder-gray-700 bg-white border-0 border-b border-[#999] text-gray-900 text-sm focus:outline-none shadow-none focus:border-grey-500 block w-full py-3 autofill:bg-white";

const inputTelClass =
  "text-start placeholder-gray-400 focus:placeholder-gray-700 bg-white border-0 border-b border-[#999] text-gray-900 text-sm focus:outline-none shadow-none focus:border-grey-500 block w-full py-2 autofill:bg-white";

const selectClass = ref(
  "text-start w-full bg-gray-50 py-3 bg-white border-0 border-b border-[#999] focus:outline-none text-sm text-gray-400"
);

const loading = ref(false);
const isValidPhone = ref(false);
const showPhoneError = ref(false);

const turnstileToken = ref("");
const formStartedAt = ref(Date.now());
const widgetId = ref<string | null>(null);
let turnstileInterval: ReturnType<typeof setInterval> | null = null;

const getDefaultForm = () => ({
  clientType: "client",
  full_name: "",
  email: "",
  phone: "",
  apartmentType: "",
  company: "",
});

const form = ref(getDefaultForm());

const setIfValidPhone = (data: { valid: boolean }) => {
  isValidPhone.value = !!data.valid;
  showPhoneError.value = !data.valid && !!form.value.phone;
};

const resetForm = () => {
  form.value = getDefaultForm();
  isValidPhone.value = false;
  showPhoneError.value = false;
  formStartedAt.value = Date.now();
};

const resetTurnstile = () => {
  turnstileToken.value = "";

  if (widgetId.value && (window as any).turnstile) {
    (window as any).turnstile.reset(widgetId.value);
  }
};

const showSuccess = () => {
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
};

const showError = () => {
  setResult({
    success: false,
    title: "Oops!",
    message: "An error has occurred. Please try again later.",
  });
};

const gtmPush = () => {
  if (props.mode === "default") {
    $gtmPush({
      event: "GAEvent",
      event_params: {
        eventCategory: "form",
        eventAction: "success",
        eventLabel: "applicationland",
        data: "form_success_applicationland",
      },
    });
    return;
  }

  if (props.mode === "download") {
    $gtmPush({
      event: "GAEvent",
      event_params: {
        eventCategory: "button",
        eventAction: "click",
        eventLabel: "applicationdownload",
        data: "form_success_applicationdownload",
      },
    });
  }
};

const renderTurnstile = () => {
  turnstileInterval = setInterval(() => {
    const el = document.getElementById("cf-turnstile");
    const turnstile = (window as any).turnstile;

    if (!el || !turnstile) return;

    if (turnstileInterval) {
      clearInterval(turnstileInterval);
      turnstileInterval = null;
    }

    widgetId.value = turnstile.render("#cf-turnstile", {
      sitekey: config.public.turnstileSiteKey,
      callback: (token: string) => {
        turnstileToken.value = token;
      },
      "expired-callback": () => {
        turnstileToken.value = "";
      },
      "timeout-callback": () => {
        turnstileToken.value = "";
      },
      "error-callback": () => {
        turnstileToken.value = "";
      },
    });
  }, 200);
};

const onSubmit = async () => {
  if (!isValidPhone.value) {
    showPhoneError.value = true;
    alert("Enter a valid phone number!");
    return;
  }

  if (!turnstileToken.value) {
    alert("Подтвердите, что вы не бот!");
    return;
  }

  loading.value = true;

  try {
    const { error } = await useFetch("/api/form", {
      method: "POST",
      body: {
        ...form.value,
        turnstileToken: turnstileToken.value,
        formStartedAt: formStartedAt.value,
      },
    });

    if (error.value) {
      throw error.value;
    }

    gtmPush();
    showSuccess();
    resetTurnstile();
    resetForm();
  } catch (err) {
    showError();
  } finally {
    loading.value = false;
  }
};

watch(
  () => form.value.apartmentType,
  (value) => {
    selectClass.value = value
      ? "w-full bg-gray-50 py-3 bg-white border-0 border-b border-[#999] focus:outline-none text-sm text-gray-900"
      : "text-start w-full bg-gray-50 py-3 bg-white border-0 border-b border-[#999] focus:outline-none text-sm text-gray-400";
  }
);

onMounted(() => {
  renderTurnstile();
});

onBeforeUnmount(() => {
  if (turnstileInterval) {
    clearInterval(turnstileInterval);
    turnstileInterval = null;
  }
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
  -webkit-box-shadow: 0 0 0 50px white inset;
  /* Change the color to your own background color */
  -webkit-text-fill-color: #333;
}

input:-webkit-autofill:focus {
  -webkit-box-shadow: 0 0 0 50px white inset;
  /*your box-shadow*/
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
  outline: none;
  /* Optional: Remove the default browser outline */
  box-shadow: 0 0 0 3px rgba(255, 89, 0, 0.5) !important;
  /* Blue shadow */
}

.vti__dropdown-list {
  z-index: 999;
}
</style>
