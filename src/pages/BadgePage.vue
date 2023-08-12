<template>
  <div v-html="svgContent"></div>
</template>

<script>
import { ref, onMounted, toRefs } from "vue";
import { useRouter } from "vue-router";
import { supabase } from "../lib/supabaseClient";

import BadgeFail from "/badge-supafactor-fail.svg";
import BadgePass from "/badge-supafactor-pass.svg";

export default {
  props: {
    userName: String,
    repo: String,
  },
  setup() {
    const svgContent = ref(BadgeFail);
    const router = useRouter();
    const routeProps = toRefs(router.currentRoute.value.params);

    const userName = routeProps.userName;
    const repo = routeProps.repo;

    onMounted(async () => {
      try {
        const { data, error } = await supabase
          .from("submissions")
          .select("*")
          .eq("user_name", userName.value)
          .eq("repo", repo.value)
          .limit(1)
          .single();

        if (error) {
          //console.error("Error fetching data:", error);
          return;
        }

        if (data && data.score > 3) {
          svgContent.value = BadgePass;
        }
      } catch (err) {
        //console.error("Error:", err);
      }
    });

    return {
      svgContent,
    };
  },
};
</script>
