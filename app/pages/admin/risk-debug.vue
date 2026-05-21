<template>
  <main class="min-h-screen bg-[#f5f1e8] px-4 py-8 text-[#1f1f1f] md:px-8">
    <div class="mx-auto max-w-6xl">
      <div class="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p class="text-xs uppercase tracking-[0.2em] text-[#7a7468]">
            Admin
          </p>
          <h1 class="font-['ABCHelveesti-Regular'] text-3xl md:text-4xl">
            Risk Debug
          </h1>
        </div>
        <div class="flex items-center gap-3">
          <NuxtLink
            to="/admin/leads"
            class="rounded-2xl border border-[#d5ccbb] bg-white px-4 py-3 text-xs uppercase tracking-[0.14em] text-[#5f594f] transition hover:border-[#8c7e62] hover:text-[#1f1f1f]"
          >
            Leads
          </NuxtLink>
          <button
            class="rounded-2xl border border-[#d5ccbb] bg-white px-4 py-3 text-xs uppercase tracking-[0.14em] text-[#5f594f] transition hover:border-[#8c7e62] hover:text-[#1f1f1f]"
            type="button"
            @click="logout"
          >
            Logout
          </button>
        </div>
      </div>

      <div class="grid gap-6 lg:grid-cols-[420px_minmax(0,1fr)]">
        <section class="rounded-3xl border border-[#d5ccbb] bg-white p-6 shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
          <form class="space-y-4" @submit.prevent="runDebug">
            <div>
              <label class="mb-2 block text-sm text-[#5f594f]" for="full_name">
                Full Name
              </label>
              <input
                id="full_name"
                v-model="form.full_name"
                type="text"
                class="w-full rounded-2xl border border-[#d5ccbb] px-4 py-3 outline-none transition focus:border-[#8c7e62]"
                required
              />
            </div>

            <div>
              <label class="mb-2 block text-sm text-[#5f594f]" for="email">
                Email
              </label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                class="w-full rounded-2xl border border-[#d5ccbb] px-4 py-3 outline-none transition focus:border-[#8c7e62]"
                required
              />
            </div>

            <div>
              <label class="mb-2 block text-sm text-[#5f594f]" for="phone">
                Phone
              </label>
              <input
                id="phone"
                v-model="form.phone"
                type="text"
                class="w-full rounded-2xl border border-[#d5ccbb] px-4 py-3 outline-none transition focus:border-[#8c7e62]"
              />
            </div>

            <div>
              <label class="mb-2 block text-sm text-[#5f594f]" for="apartmentType">
                Apartment Type
              </label>
              <input
                id="apartmentType"
                v-model="form.apartmentType"
                type="text"
                class="w-full rounded-2xl border border-[#d5ccbb] px-4 py-3 outline-none transition focus:border-[#8c7e62]"
              />
            </div>

            <div>
              <label class="mb-2 block text-sm text-[#5f594f]" for="clientType">
                Client Type
              </label>
              <input
                id="clientType"
                v-model="form.clientType"
                type="text"
                class="w-full rounded-2xl border border-[#d5ccbb] px-4 py-3 outline-none transition focus:border-[#8c7e62]"
              />
            </div>

            <p v-if="errorMessage" class="text-sm text-[#8a2d2d]">
              {{ errorMessage }}
            </p>

            <button
              type="submit"
              class="w-full rounded-2xl bg-[#1f1f1f] px-4 py-3 text-sm uppercase tracking-[0.16em] text-white transition hover:bg-[#343434]"
              :disabled="pending"
            >
              {{ pending ? "Calculating..." : "Calculate Risk" }}
            </button>
          </form>
        </section>

        <section class="rounded-3xl border border-[#d5ccbb] bg-white p-6 shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
          <div v-if="result" class="space-y-6">
            <div class="flex flex-wrap items-center gap-3">
              <span
                class="rounded-full px-4 py-2 text-xs uppercase tracking-[0.14em]"
                :class="statusClass(result.scoring.total.status)"
              >
                {{ result.scoring.total.status }}
              </span>
              <span class="text-sm text-[#5f594f]">
                Total score: <strong>{{ result.scoring.total.totalScore }}</strong>
              </span>
            </div>

            <div>
              <h2 class="mb-2 text-sm uppercase tracking-[0.14em] text-[#7a7468]">
                Reasons
              </h2>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="reason in result.scoring.total.reasons"
                  :key="reason"
                  class="rounded-full bg-[#f2ede3] px-3 py-1 text-xs text-[#5f594f]"
                >
                  {{ reason }}
                </span>
              </div>
            </div>

            <div class="grid gap-4 md:grid-cols-2">
              <div class="rounded-2xl bg-[#f8f4ec] p-4">
                <h3 class="mb-2 text-sm uppercase tracking-[0.14em] text-[#7a7468]">
                  Features
                </h3>
                <pre class="overflow-x-auto text-xs text-[#2f2f2f]">{{ pretty(result.features) }}</pre>
              </div>

              <div class="rounded-2xl bg-[#f8f4ec] p-4">
                <h3 class="mb-2 text-sm uppercase tracking-[0.14em] text-[#7a7468]">
                  Fingerprint
                </h3>
                <pre class="overflow-x-auto text-xs text-[#2f2f2f]">{{ result.templateFingerprint }}</pre>
              </div>
            </div>

            <div class="grid gap-4 md:grid-cols-3">
              <div class="rounded-2xl bg-[#f8f4ec] p-4">
                <h3 class="mb-2 text-sm uppercase tracking-[0.14em] text-[#7a7468]">
                  Single
                </h3>
                <pre class="overflow-x-auto text-xs text-[#2f2f2f]">{{ pretty(result.scoring.single) }}</pre>
              </div>
              <div class="rounded-2xl bg-[#f8f4ec] p-4">
                <h3 class="mb-2 text-sm uppercase tracking-[0.14em] text-[#7a7468]">
                  Cluster
                </h3>
                <pre class="overflow-x-auto text-xs text-[#2f2f2f]">{{ pretty(result.scoring.cluster) }}</pre>
              </div>
              <div class="rounded-2xl bg-[#f8f4ec] p-4">
                <h3 class="mb-2 text-sm uppercase tracking-[0.14em] text-[#7a7468]">
                  Velocity
                </h3>
                <pre class="overflow-x-auto text-xs text-[#2f2f2f]">{{ pretty(result.scoring.velocity) }}</pre>
              </div>
            </div>
          </div>

          <div v-else class="flex min-h-[320px] items-center justify-center text-sm text-[#7a7468]">
            Submit a lead on the left to inspect its risk scoring.
          </div>
        </section>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["admin-auth"],
});

type LeadRiskDebugResponse = {
  input: {
    full_name?: string;
    email?: string;
    phone?: string;
    apartmentType?: string;
    clientType?: string;
  };
  features: Record<string, unknown>;
  templateFingerprint: string;
  scoring: {
    single: {
      score: number;
      reasons: string[];
    };
    cluster: {
      score: number;
      reasons: string[];
      stats: Record<string, unknown>;
    };
    velocity: {
      score: number;
      reasons: string[];
      stats: Record<string, unknown>;
    };
    total: {
      totalScore: number;
      reasons: string[];
      status: "normal" | "suspicious" | "quarantine";
    };
  };
};

const form = reactive({
  full_name: "Тимофей",
  email: "youritch@gmail.com",
  phone: "+971 55 410 1020",
  apartmentType: "3-bedroom +",
  clientType: "client",
});

const pending = ref(false);
const errorMessage = ref("");
const result = ref<LeadRiskDebugResponse | null>(null);

async function runDebug() {
  if (pending.value) {
    return;
  }

  pending.value = true;
  errorMessage.value = "";

  try {
    result.value = await $fetch("/api/admin/lead-risk-debug", {
      method: "POST",
      body: form,
    });
  } catch (error: any) {
    errorMessage.value =
      error?.data?.statusMessage ||
      error?.statusMessage ||
      "Failed to calculate risk.";
  } finally {
    pending.value = false;
  }
}

function pretty(value: unknown) {
  return JSON.stringify(value, null, 2);
}

function statusClass(status: string) {
  if (status === "quarantine") {
    return "bg-[#3d0f19] text-white";
  }

  if (status === "suspicious") {
    return "bg-[#f2dfb2] text-[#6c4a00]";
  }

  return "bg-[#d8ead9] text-[#215728]";
}

async function logout() {
  await $fetch("/api/admin/logout", {
    method: "POST",
  });

  await navigateTo("/admin/login");
}
</script>
