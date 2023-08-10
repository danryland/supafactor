<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
      <q-page class="flex flex-center">
        <div class="text-center">
          <h1 class="hide">Review</h1>
          <h2 class="text-h4">Still working on<br />this part...</h2>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
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

    // const t = {
    //   comments: [
    //     {
    //       criteria: "creativity/inventiveness",
    //       comment:
    //         "Well, Dan, your README is as creative as a painting by numbers. Where's the unique flair?",
    //     },
    //     {
    //       criteria:
    //         "explain how to run the application locally clearly and well and technically impressive",
    //       comment:
    //         "While it's clear how to run the application, it's not particularly impressive. It's like following instructions on a microwave meal. Technically, it's dinner, but it's not winning any Michelin stars.",
    //     },
    //     {
    //       criteria: "use of Supabase features",
    //       comment:
    //         "I'm sorry, but where's Supabase? It's like you turned up to a song contest without a song!",
    //     },
    //     {
    //       criteria: "fun",
    //       comment:
    //         "As fun as watching paint dry, Dan. This README needs a touch of excitement and intrigue.",
    //     },
    //   ],
    //   score: 1,
    // };

    watch(
      () => props.currentUser,
      async (currentUser) => {
        if (currentUser) {
          repoName.value = route.params.repo_name;

          const url =
            "https://api.github.com/repos/" +
            currentUser?.user_metadata?.user_name +
            "/" +
            repoName.value +
            "/contents/README.md";

          try {
            const response = await axios.get(url);

            if (response) {
              console.log("Good");
            }
          } catch (error) {
            console.log(error);
          }
        }
      },
      { immediate: true }
    );

    return {
      repoName,
    };
  },
};
</script>
