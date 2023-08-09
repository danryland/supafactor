<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-transparent">
      <q-toolbar class="q-pa-lg">
        <q-toolbar-title
          >Hey {{ currentUser?.user_metadata?.name }} 👋🏻</q-toolbar-title
        >
        <div>
          <q-btn @click="signOut()" no-caps label="Sign out" />
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-page class="flex flex-center">
        <p>Coming soon</p>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { supabase } from "../lib/supabaseClient";

export default {
  name: "DashboardPage",
  setup() {
    const router = useRouter();
    const currentUser = ref();

    onMounted(async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        // If no user is authenticated, redirect to the login page
        router.push("/sign-in");
      } else {
        currentUser.value = user;
      }

      // Otherwise, continue with your dashboard logic
    });

    const signOut = async () => {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error(error);
      } else {
        router.push("/sign-in");
      }
    };

    return {
      currentUser,
      signOut,
    };
  },
};
</script>
