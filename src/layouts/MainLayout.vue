<template>
  <q-layout view="hHh lpR fFf" :class="'page-' + $route.name">
    <q-header class="bg-transparent">
      <q-toolbar>
        <q-toolbar-title>
          <router-link to="/dashboard">
            <img
              class="logo"
              src="~/assets/img/logo-supafactor-small.svg"
              alt="Does your README have the Supafactor logo"
            />
          </router-link>
        </q-toolbar-title>

        <q-btn-dropdown
          dropdown-icon="fa-solid fa-sharp fa-chevron-down fa-xs"
          no-caps
          flat
          rounded
          unelevated
        >
          <template v-slot:label>
            <span class="q-mr-sm">{{
              currentUser?.user_metadata?.name ||
              currentUser?.user_metadata?.user_name
            }}</span>
            <q-avatar size="24px">
              <q-img :src="currentUser?.user_metadata?.avatar_url" />
            </q-avatar>
          </template>

          <q-list>
            <q-item clickable v-close-popup @click="signOut()">
              <q-item-section>
                <q-item-label>Sign out</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view
        :currentUser="currentUser"
        :isLoading="isLoading"
        :repos="repos"
        :formatDate="formatDate"
        :submitRepo="submitRepo"
        :addManually="addManually"
      />
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref, onMounted, getCurrentInstance } from "vue";
import { useRouter } from "vue-router";
import { supabase } from "../lib/supabaseClient";
import { date } from "quasar";

export default {
  name: "MainLayout",
  setup() {
    const router = useRouter();
    const currentUser = ref();
    const oAuthToken = ref();
    const isLoading = ref(false);
    const repos = ref([]);
    const selectedRepo = ref();

    const { appContext } = getCurrentInstance();

    const axios = appContext.config.globalProperties.$axios;

    const getRepos = async () => {
      const startDate = new Date("2023-08-04T09:00:00-07:00"); // 9:00 am PT on August 4th
      const endDate = new Date("2023-08-13T23:59:00-07:00"); // 11:59 pm PT on August 13th
      const since = startDate.toISOString();
      const before = endDate.toISOString();

      isLoading.value = true;

      const response = await axios.get("https://api.github.com/user/repos", {
        headers: {
          Authorization: `token ${oAuthToken.value}`,
        },
        params: { since, before },
      });

      //console.log(response.data);

      repos.value = response.data.map((repo) => ({
        id: repo.id,
        name: repo.name,
        html_url: repo.html_url,
        created_at: repo.created_at,
      }));

      isLoading.value = false;
    };

    const formatDate = (timestamp) => {
      return date.formatDate(timestamp, "D ddd MMM YYYY");
    };

    onMounted(async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("An error occurred:", error);
        //router.push("/sign-in");
        return;
      }

      const { provider_token, user } = data?.session || {};

      if (provider_token && user) {
        oAuthToken.value = provider_token;
        currentUser.value = user;
        getRepos();
      } else {
        //router.push("/sign-in");
      }
    });

    const addManually = () => {
      alert("TODO");
    };

    const submitRepo = (repoName) => {
      console.log("Selected ID:", selectedRepo);
      router.push(`/review/${repoName}`);
    };

    const signOut = async () => {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error(error);
      }
      router.push("/sign-in");
    };

    return {
      currentUser,
      signOut,
      getRepos,
      repos,
      isLoading,
      selectedRepo,
      formatDate,
      addManually,
      submitRepo,
    };
  },
};
</script>
<style lang="scss" scoped>
.q-btn :deep(.q-icon) {
  font-size: unset !important;
}
</style>
