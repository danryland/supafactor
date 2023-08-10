<template>
  <q-layout>
    <q-page-container>
      <q-page class="flex flex-center q-pa-lg">
        <div>
          <transition appear enter-active-class="animated bounceInDown slower">
            <div class="brand">
              <img src="~/assets/img/brand.svg" alt="" />
              <h1>
                Does your<br />
                README have the<br />
                <span class="primary">Supa</span
                ><span class="secondary">factor</span>
              </h1>
            </div>
          </transition>
          <transition
            appear
            enter-active-class="animated bounceIn slower delay-3s"
          >
            <q-btn
              color="primary"
              rounded
              no-caps
              size="xl"
              text-color="dark"
              icon="fa-brands fa-github"
              label="Sign in with Github"
              @click="signIn()"
              :loading="isLoading"
              :disable="isLoading"
            />
          </transition>
          <transition
            appear
            enter-active-class="animated fadeInUp slower delay-5s"
          >
            <p class="text-center">
              Project by
              <a
                class="text-white"
                target="_blank"
                href="https://twitter.com/realdanryland"
                >Dan Ryland</a
              >, co-founder of
              <a
                class="text-white"
                target="_blank"
                href="https://insidrmusic.com"
                >Insidr&nbsp;Music</a
              >
            </p>
          </transition>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>
<script>
import { ref, onMounted } from "vue";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "vue-router";

export default {
  setup() {
    const router = useRouter();
    const isLoading = ref(false);

    // Check if they're already logged in
    onMounted(async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("An error occurred:", error);
      }

      if (data && data.session) {
        console.log(data);
        router.push("/dashboard");
      }
    });

    // Github sign in
    const signIn = async () => {
      try {
        isLoading.value = true;

        const redirectTo = process.env.SITE_URL + "/dashboard";

        console.log(redirectTo);

        const { error } = await supabase.auth.signInWithOAuth({
          provider: "github",
          options: {
            scopes: "public_repo",
            redirectTo: redirectTo,
          },
        });
        if (error) throw error;
      } catch (error) {
        console.logo("An unexpected error occurred:", error);
      } finally {
        isLoading.value = false;
      }
    };

    return {
      isLoading,
      signIn,
    };
  },
};
</script>
<style lang="scss" scoped>
.q-layout {
  &:after {
    background-image: url("../assets/img/background-1.svg");
  }
}

.brand {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  img {
    max-width: 400px;
    width: 100%;
    height: auto;
  }
  h1 {
    display: none;

    font-family: "Slackey", cursive;
    color: white;
    font-size: 21px;
    font-style: normal;
    text-transform: uppercase;
    text-align: center;
    font-weight: 400;
    line-height: 95.1%; /* 19.971px */
    opacity: 0.95;
  }
  .primary {
    $height: 62px;
    font-size: 67px;
    height: $height;
    line-height: $height;
    display: block;
    background: linear-gradient(180deg, #62ef24 0%, #37971c 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .secondary {
    $height: 40px;
    font-size: 48px;
    height: $height;
    line-height: $height;
    display: block;
  }
}
</style>
