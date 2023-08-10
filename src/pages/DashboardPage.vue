<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="bg-transparent">
      <q-toolbar class="q-pa-lg">
        <q-toolbar-title>&nbsp;</q-toolbar-title>

        <q-btn-dropdown
          dropdown-icon="fa-solid fa-sharp fa-chevron-down fa-xs"
          no-caps
          flat
          rounded
          unelevated
        >
          <template v-slot:label>
            <span class="q-mr-sm">{{ currentUser?.user_metadata?.name }}</span>
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
      <q-page class="flex flex-center">
        <div class="text-center">
          <h1 class="hide">Dashboard</h1>
          <div v-if="repos && repos.length >= 1">
            <transition appear enter-active-class="animated bounceIn slower">
              <h2 class="text-h4 q-mb-lg">
                Select your<br />
                Hackathon repo
              </h2>
            </transition>
            <q-icon
              v-show="isLoading"
              name="fa-thin fa-sharp fa-spinner fa-spin"
            />
            <transition
              appear
              enter-active-class="animated bounceIn slower delay-3s"
            >
              <div>
                <q-list
                  v-for="repo in repos"
                  v-bind:key="repo.id"
                  class="repos q-mb-lg"
                >
                  <q-item tag="label" v-ripple>
                    <q-item-section avatar>
                      <q-radio
                        v-model="selectedRepo"
                        :val="repo.id"
                        color="primary"
                      />
                    </q-item-section>
                    <q-item-section class="text-left">
                      <q-item-label class="text-h5">
                        {{ repo.name }}
                      </q-item-label>
                      <q-item-label caption>
                        <q-chip
                          class="q-ma-none"
                          size="sm"
                          icon="fa-solid fa-lightbulb fa-sm q-mr-sm"
                          >{{ formatDate(repo.created_at) }}
                          <q-tooltip
                            class="bg-dark text-body2"
                            anchor="bottom middle"
                            self="top middle"
                          >
                            Date created
                          </q-tooltip></q-chip
                        >
                      </q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-btn
                        type="a"
                        target="_blank"
                        :href="repo.html_url"
                        flat
                        round
                        icon="fa-solid fa-sharp fa-external-link"
                      >
                        <q-tooltip
                          class="bg-dark text-body2"
                          anchor="bottom middle"
                          self="top middle"
                        >
                          View repo
                        </q-tooltip></q-btn
                      >
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>
            </transition>
            <transition
              appear
              enter-active-class="animated fadeIn slower delay-5s"
            >
              <q-btn
                color="primary"
                rounded
                no-caps
                size="xl"
                text-color="dark"
                v-if="!isLoading && repos"
                :disable="!selectedRepo"
                @click="submitRepo(selectedRepo)"
                label="Submit"
                icon-right="fa-solid fa-sharp fa-paper-plane-alt"
              />
            </transition>
          </div>
          <div v-else>
            <transition appear enter-active-class="animated flip slower">
              <div class="border q-mb-md">
                <q-avatar size="200px">
                  <img src="~/assets/img/no-repo.png" alt="Sad Ant" />
                </q-avatar>
              </div>
            </transition>
            <transition
              appear
              enter-active-class="animated bounceIn slower delay-3s"
            >
              <h2 class="text-h4 q-mb-md">
                ...it can't be.<br />No Hackathon entry?!
              </h2>
            </transition>
            <transition
              appear
              enter-active-class="animated fadeInUp slower delay-5s"
            >
              <q-btn
                @click="addManually()"
                outline
                rounded
                no-caps
                size="lg"
                label="Add manually"
              />
            </transition>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref, onMounted, getCurrentInstance } from "vue";
import { useRouter } from "vue-router";
import { supabase } from "../lib/supabaseClient";
import { date } from "quasar";

export default {
  name: "DashboardPage",
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

    const submitRepo = (selectedRepo) => {
      alert("TODO");
      console.log("Selected ID:", selectedRepo);
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
.q-layout {
  &:after {
    background-image: url("../assets/img/background-2.svg");
    opacity: 0.3;
  }
}
.q-btn :deep(.q-icon) {
  font-size: unset !important;
}

.border {
  display: inline-block;
  border-radius: 50% 50%;
  border: 5px solid rgba(white, 0.9);
}

.repos .q-item {
  border-radius: 50px;
  background: rgba($secondary, 0.96);
  width: 100%;
  max-width: 600px;
  padding-top: 16px;
  padding-bottom: 16px;
  margin-bottom: 8px;
  .q-chip {
    background: rgba(white, 0.04);
  }
}
</style>
