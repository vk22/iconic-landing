<template>
  <main class="min-h-screen w-full bg-[#fff] px-4 py-10 text-[#1f1f1f] md:px-8 flex items-center justify-center">
    <div class="mx-auto w-[400px] h-auto rounded-xl border border-[#ddd] bg-white p-6 shadow-[0_20px_50px_rgba(0,0,0,0.05)] md:p-8">
      <!-- <p class="mb-2 text-[.65rem] uppercase tracking-[0.2em] text-[#7a7468]">
        Admin
      </p> -->
      <!-- <h1 class="mb-6 font-['ABCHelveesti-Regular'] text-2xl">
        Sign In
      </h1> -->

      <form class="space-y-4" @submit.prevent="onSubmit">
        <div>
          <label class="mb-1 block text-sm text-[#5f594f]" for="username">
            Username
          </label>
          <input
            id="username"
            v-model="form.username"
            type="text"
            autocomplete="username"
            class="w-full rounded-md border border-[#ddd] px-3 py-2 outline-none transition focus:border-[#999] text-sm"
            required
          />
        </div>

        <div>
          <label class="mb-1 block text-sm text-[#5f594f]" for="password">
            Password
          </label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            autocomplete="current-password"
            class="w-full rounded-md border border-[#ddd] px-3 py-2 outline-none transition focus:border-[#999] text-sm"
            required
          />
        </div>

        <p v-if="errorMessage" class="text-sm text-[#8a2d2d]">
          {{ errorMessage }}
        </p>

        <button
          type="submit"
          class="w-full rounded-md bg-[#1f1f1f] px-4 py-3 text-xs uppercase tracking-[0.16em] text-white transition hover:bg-[#343434]"
          :disabled="pending"
        >
          {{ pending ? "Signing in..." : "Sign In" }}
        </button>
      </form>
    </div>
  </main>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: [
    async () => {
      const requestFetch = useRequestFetch();

      try {
        const session = await requestFetch<{ authenticated: boolean }>(
          "/api/admin/session",
        );

        if (session.authenticated) {
          return navigateTo("/admin/leads");
        }
      } catch {
        return;
      }
    },
  ],
});

const form = reactive({
  username: "",
  password: "",
});

const pending = ref(false);
const errorMessage = ref("");

async function onSubmit() {
  if (pending.value) {
    return;
  }

  pending.value = true;
  errorMessage.value = "";

  try {
    await $fetch("/api/admin/login", {
      method: "POST",
      body: form,
    });

    await navigateTo("/admin/leads");
  } catch (error: any) {
    errorMessage.value =
      error?.data?.statusMessage ||
      error?.statusMessage ||
      "Failed to sign in.";
  } finally {
    pending.value = false;
  }
}
</script>
