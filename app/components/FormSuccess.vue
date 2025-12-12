<template>
  <div class="form-container w-full max-w-md px-2 md:px-8 bg-[#ffffff]">
    <div class="flex flex-col ">
      <TitleH3 :text="props.result.title" :align="'center'"></TitleH3>
      <p class="text mb-8 text-center">
        <!-- Your request has been received. Our team will contact you shortly with
        full project details. -->
        {{ props.result.message }} 
      </p>
      <p class="text-[.75rem] mb-4 text-center" v-if="props.result.success">
        You may download the assets below to get more
        information about Iconic Residences.
      </p>
      <div class="flex flex-col md:flex-row justify-center" v-if="props.result.success">
        <div class="btn pr-0 md:pr-2 w-full md:w-auto mb-1 md:mb-0">
          <Button
            :size="'big'"
            :type="'button'"
            :text="$t('overview.btn-1-1')"
            :icon="true"
            :link="'https://mered.ae/assets/docs/Iconic%20Residences%20Unit%20Layouts.pdf'"
            class="w-full md:w-auto"
          ></Button>
        </div>
        <div class="btn pr-0 md:pr-2 w-full md:w-auto">
          <Button
            :size="'big'"
            :type="'button'"
            :text="$t('overview.btn-2-1')"
            :icon="true"
            :link="'https://mered.ae/assets/docs/Iconic%20Residences%20by%20Mered%20EN.pdf'"
            class="w-full md:w-auto"
          ></Button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";

interface Result {
  success?: boolean;
  title?: string;
  message?: string;
}

const props = withDefaults(defineProps<{
  result?: Result;
}>(), {
  result: { success: false, title: '', message: '' }
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
