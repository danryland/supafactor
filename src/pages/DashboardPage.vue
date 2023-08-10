<template>
  <q-page class="flex flex-center">
    <div class="text-center">
      <h1 class="hide">Dashboard</h1>

      <div v-if="!isLoading && repos && repos.length >= 1">
        <transition appear enter-active-class="animated bounceIn slower">
          <h2 class="text-h4 q-mb-lg">
            Select your<br />
            Hackathon repo
          </h2>
        </transition>
        <q-icon v-show="isLoading" name="fa-thin fa-sharp fa-spinner fa-spin" />
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
                    :val="repo.name"
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
        <transition appear enter-active-class="animated fadeIn slower delay-5s">
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

      <div v-if="!isLoading && repos && repos.length == 0">
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
</template>

<script>
import { ref } from "vue";

export default {
  name: "DashboardPage",
  props: {
    repos: {
      type: Array,
      default: () => [],
    },
    isLoading: {
      type: Boolean,
    },
    formatDate: {
      type: Function,
      required: true,
    },
    submitRepo: {
      type: Function,
      required: true,
    },
    addManually: {
      type: Function,
      required: true,
    },
  },
  setup() {
    const selectedRepo = ref();

    return {
      selectedRepo,
    };
  },
};
</script>
<style lang="scss" scoped>
.q-btn :deep(.q-icon) {
  font-size: unset !important;
}
</style>
