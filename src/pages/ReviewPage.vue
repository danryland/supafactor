<template>
  <q-page class="flex flex-center" :class="{ 'is-ready': showBackground }">
    <div class="text-center">
      <h1 class="hide">Review</h1>

      <div v-show="isLoading">
        <h2 class="text-h5 q-mb-lg">Collecting<br />Simon's comments...</h2>
        <ol>
          <li
            v-for="(criteria, index) in judgeCriteria"
            :key="criteria.title"
            :class="getItemClass(index)"
          >
            <div class="flex item-center">
              <q-icon size="24px" :class="criteria.icon" class="q-mr-md" />
              <span class="text-h6">{{ criteria.title }}</span>
            </div>
            <q-icon
              class="q-ml-md"
              size="24px"
              :class="getItemIconClass(index)"
            />
          </li>
        </ol>
      </div>

      <q-carousel
        v-if="judgeResponse && judgeResponse.comments"
        v-model="slide"
        transition-prev="scale"
        transition-next="scale"
        swipeable
        animated
        navigation
        padding
        navigation-position="bottom"
        control-type="flat"
        control-color="primary"
        class="rounded-borders"
      >
        <template v-slot:navigation-icon="{ active, onClick }">
          <q-btn
            v-if="active"
            size="md"
            icon="fa-regular fa-circle-dot"
            color="primary"
            flat
            round
            dense
            @click="onClick"
          />
          <q-btn
            v-else
            size="sm"
            icon="fa-regular fa-circle"
            color="white"
            flat
            round
            dense
            @click="onClick"
          />
        </template>

        <template
          v-for="(judge, index) in judgeResponse.comments"
          v-bind:key="judge"
        >
          <q-carousel-slide
            :name="'slide-' + (index + 1)"
            class="column no-wrap flex-center"
          >
            <q-icon
              size="32px"
              :name="judgeCriteria[index].icon"
              class="q-mb-sm"
            />
            <h2 class="text-h4 q-mb-sm">
              {{ judgeCriteria[index].title }}
            </h2>
            <p class="text-body1">{{ judge.comment }}</p>
            <div v-if="index === 3">
              <q-btn
                color="primary"
                rounded
                no-caps
                size="lg"
                text-color="dark"
                @click="viewResult()"
                label="See final result"
                class="q-mb-md"
              />
            </div>
          </q-carousel-slide>
        </template>
      </q-carousel>
    </div>
  </q-page>
</template>

<script>
import { ref, getCurrentInstance, watch } from "vue";
import { useRoute } from "vue-router";

export default {
  name: "DashboardPage",
  props: {
    currentUser: {
      type: Object,
    },
  },
  setup(props) {
    const route = useRoute();
    const repoName = ref();
    const { appContext } = getCurrentInstance();
    const axios = appContext.config.globalProperties.$axios;
    const isLoading = ref(true);
    const showBackground = ref(false);
    const judgeCriteria = [
      { title: "Creativity", icon: "fa-regular fa-paintbrush-pencil" },
      { title: "Functionality", icon: "fa-regular fa-gears" },
      { title: "Supabase-ness", icon: "fa-regular fa-bolt" },
      { title: "Fun", icon: "fa-regular fa-party-horn" },
    ];
    const completedIndices = ref([]);
    const judgeResponse = ref([]);
    // const judgeResponse = ref([
    //   {
    //     comments: [
    //       {
    //         criteria: "creativity/inventiveness",
    //         comment:
    //           "Well, it's a bit lacking in creativity. It's a pretty standard README without any unique or inventive elements.",
    //       },
    //       {
    //         criteria:
    //           "explain how to run the application locally clearly and well and technically impressive",
    //         comment:
    //           "The instructions on how to run the app locally are clear and concise. Good job on that! However, it could have been more technically impressive by providing more details or examples on how to use specific Supabase features.",
    //       },
    //       {
    //         criteria: "use of Supabase features",
    //         comment:
    //           "I'm a bit disappointed. There's no mention of any Supabase features being used in this app. It would have been great to see how the application leverages the power of Supabase.",
    //       },
    //       {
    //         criteria: "fun",
    //         comment:
    //           "I have to say, this README is lacking in the fun department. It's a bit dry and could definitely use some personality or humor to make it more enjoyable to read.",
    //       },
    //     ],
    //     score: 2,
    //   },
    // ]);

    const getJudgment = async (currentUser, github) => {
      try {
        isLoading.value = true;

        const name =
          currentUser?.user_metadata?.name ||
          currentUser?.user_metadata?.user_name;

        const decodedString = atob(github.data.content);
        const stringWithoutBreaks = decodedString.replace(/(\r\n|\n|\r)/gm, "");

        let config = {
          method: "post",
          url: process.env.SUPABASE_FUNCTION + "/v1/review",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + process.env.SUPABASE_KEY,
          },
          data: {
            name: name,
            readme: stringWithoutBreaks,
          },
        };

        const judge = await axios(config);

        if (judge) {
          completedIndices.value = [0, 1, 2, 3];
          showBackground.value = true;
          judgeResponse.value = judge.data;
          console.log("Judge Good");
        } else {
          console.log("No judge");
        }
      } catch (error) {
        console.log(error);
      } finally {
        isLoading.value = false;
      }
    };

    const getReadme = async (currentUser) => {
      repoName.value = route.params.repo_name;

      const url =
        "https://api.github.com/repos/" +
        currentUser.user_metadata?.user_name +
        "/" +
        repoName.value +
        "/contents/README.md";

      try {
        const github = await axios.get(url);

        if (github) {
          console.log("Github Good");
          getJudgment(currentUser, github);
        }
      } catch (error) {
        console.log(error);
      }
    };

    const getItemClass = (index) => {
      return completedIndices.value.includes(index) ? "completed" : "pending";
    };

    const getItemIconClass = (index) => {
      if (completedIndices.value.includes(index)) {
        return "fa-solid fa-check";
      }
      return "fa-regular fa-sharp fa-spinner fa-spin";
    };

    const viewResult = () => {
      alert("Todo");
    };

    watch(
      () => props.currentUser,
      async (currentUser) => {
        if (currentUser) {
          getReadme(currentUser);
          setTimeout(() => {
            completedIndices.value.push(0);
          }, 2000);
          setTimeout(() => {
            completedIndices.value.push(1);
          }, 5000);
          setTimeout(() => {
            completedIndices.value.push(2);
          }, 8000);
          setTimeout(() => {
            completedIndices.value.push(3);
          }, 10000);
        }
      },
      { immediate: true }
    );

    return {
      repoName,
      isLoading,
      judgeCriteria,
      judgeResponse,
      slide: ref("slide-1"),
      showBackground,
      getItemIconClass,
      getItemClass,
      viewResult,
    };
  },
};
</script>

<style lang="scss" scoped>
.q-page {
  background-image: url("../assets/img/simon_1.svg");
  background-repeat: no-repeat;
  background-position: -500% 40px;
  transition: ease-in-out 0.6s all;
  background-size: contain;
  &.is-ready {
    background-position: center 40px;
  }
}
.q-carousel {
  margin-top: 160px;
  max-width: 500px;
  height: auto;
  width: 100%;
  background-color: transparent;
  .q-icon {
    color: $primary;
    text-shadow: 0px 0px 10px rgba($primary, 0.5);
  }
}
.q-carousel__slide {
  border-radius: 24px;
  background-color: rgba($secondary, 0.9);
  padding: 32px;
  //text-align: left;
  h2 {
    text-shadow: 0px 0px 10px rgba(white, 0.25);
  }
}

ol {
  list-style-type: none;
  padding: 0;
}

li {
  margin: 10px 0;
  display: flex;
  align-items: center;
  padding: 12px 24px;
  border-radius: 100px;
  justify-content: space-between;
  //transition: all 0.3s ease-in-out;
  div {
    align-items: center;
  }
  .q-icon {
    //transition: all 0.3s ease-in-out;
  }
}

.completed {
  background: linear-gradient(
    180deg,
    rgba(98, 239, 36, 0.92) 0%,
    rgba(55, 151, 28, 0.92) 100%
  );
  color: $secondary;
  .q-icon {
    color: $secondary;
    text-shadow: 0px 0px 10px rgba($secondary, 0.2);
  }
  div {
    .q-icon {
      color: lighten($secondary, 14);
      opacity: 0.8;
    }
  }
}

.pending {
  color: white;
  background-color: $secondary;
  div .q-icon {
    color: $primary;
    text-shadow: 0px 0px 10px rgba($primary, 0.2);
  }
}
</style>
