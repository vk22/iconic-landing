<template>
  <main class="min-h-screen bg-[#fff] px-4 py-8 text-[#1f1f1f] md:px-8">
    <div class="mx-auto max-w-6xl">
      <div class="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p class="text-[.65rem] uppercase tracking-[0.2em] text-[#7a7468] mb-6">
            Admin
          </p>
          <h1 class="font-['ABCHelveesti-Regular'] text-xl md:text-xl">
            Leads Raw
          </h1>
        </div>
        <div class="flex items-center gap-3">
          <button
            class="rounded-2xl border border-[#d5ccbb] bg-white px-3 py-2 text-[.65rem] uppercase tracking-[0.14em] text-[#5f594f] transition hover:border-[#888888] hover:text-[#1f1f1f]"
            type="button"
            @click="logout"
          >
            Logout
          </button>
          <div class="rounded-xl border border-[#ddd] bg-white px-3 py-2 text-sm">
            <div>Total: {{ pagination.total }}</div>
            <!-- <div>Page: {{ pagination.page }} / {{ pagination.totalPages }}</div> -->
          </div>
        </div>
      </div>

      <div v-if="error" class="rounded-2xl border border-[#ddd] bg-[#fff7f7] p-4 text-sm text-[#8a2d2d]">
        {{ errorMessage }}
      </div>

      <div v-else class="overflow-hidden rounded-xl border border-[#ddd] bg-white shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
        <div class="overflow-x-auto">
          <table class="min-w-full border-collapse">
            <thead>
              <tr class="border-b border-[#ebebeb] bg-[#ebebeb] text-left text-[.55rem] uppercase tracking-[0.18em] text-[#777]">
                <th class="px-4 py-4">Date</th>
                <th class="px-4 py-4">Name</th>
                <th class="px-4 py-4">Email</th>
                <th class="px-4 py-4">Phone</th>
                <th class="px-4 py-4">Apartment</th>
                <th class="px-4 py-4">Client Type</th>
                <th class="px-4 py-4">IP</th>
                <th class="px-4 py-4">Status</th>
                <th class="px-4 py-4">Score</th>
                
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="lead in items"
                :key="lead._id"
                class="border-b border-[#f0eadf] text-xs last:border-b-0"
              >
                <td class="px-4 py-4 whitespace-nowrap">{{ formatDate(lead.createdAt) }}</td>
                <td class="px-4 py-4">{{ lead.full_name || "-" }}</td>
                <td class="px-4 py-4">{{ lead.email || "-" }}</td>
                <td class="px-4 py-4">{{ lead.phone || "-" }}</td>
                <td class="px-4 py-4">{{ lead.apartmentType || "-" }}</td>
                <td class="px-4 py-4">{{ lead.clientType || "-" }}</td>
                <td class="px-4 py-4">{{ lead.ip || "-" }}</td>
                <td class="px-4 py-4">
                  <span
                    class="rounded-full px-3 py-1 text-[.6rem] uppercase tracking-[0.12em]"
                    :class="statusClass(lead.scoring?.status)"
                  >
                    {{ lead.scoring?.status || "unknown" }}
                  </span>
                </td>
                <td class="px-4 py-4">{{ lead.scoring?.totalScore ?? "-" }}</td>
                
              </tr>
              <tr v-if="items.length === 0">
                <td colspan="8" class="px-4 py-10 text-center text-sm text-[#7a7468]">
                  No leads found.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>


    </div>
  </main>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["admin-auth"],
});

type LeadItem = {
  _id: string;
  createdAt?: string;
  full_name?: string;
  email?: string;
  phone?: string;
  apartmentType?: string;
  clientType?: string;
  scoring?: {
    status?: string;
    totalScore?: number;
  };
  ip?: string;
};

type LeadsResponse = {
  items: LeadItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

const requestFetch = useRequestFetch();

const { data, error } = await useAsyncData<LeadsResponse>(
  "admin-leads-page",
  async () => {
    return await requestFetch("/api/leads-raw");
  },
  {
    server: true,
    lazy: false,
  },
);

const items = computed(() => data.value?.items || []);
const pagination = computed(() => {
  return (
    data.value?.pagination || {
      page: 1,
      limit: 20,
      total: 0,
      totalPages: 1,
    }
  );
});

const errorMessage = computed(() => {
  return error.value?.statusMessage || "Failed to load leads.";
});

function formatDate(value?: string) {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function statusClass(status?: string) {
  if (status === "quarantine") {
    return "bg-[#3d0f19] text-white";
  }

  if (status === "suspicious") {
    return "bg-[#f2dfb2] text-[#6c4a00]";
  }

  if (status === "normal") {
    return "bg-[#d8ead9] text-[#215728]";
  }

  return "bg-[#ece7dc] text-[#5f594f]";
}

async function logout() {
  await $fetch("/api/admin/logout", {
    method: "POST",
  });

  await navigateTo("/admin/login");
}
</script>
