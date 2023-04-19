<template>
  <v-app id="inspire">
    <v-app-bar>
      <v-app-bar-nav-icon
        class="hidden-sm-and-up"
        @click.stop="drawer = !drawer"
      ></v-app-bar-nav-icon>
      <v-avatar
        class="me-10 ms-4"
        color="grey-darken-1"
        size="32"
      ></v-avatar>

      <v-container class="fill-height d-flex align-center">
        <span
          v-for="link in navigation_links"
          :key="link.name"
        >
          <v-btn
            class="hidden-xs"
            v-if="checkRoles(link.allowedRoles)"
            :key="link.name"
            :prepend-icon="link.icon"
            :to="link.location"
          >
            {{ link.name }}
          </v-btn>
        </span>

      </v-container>
      <v-btn @click="themeStore.toggleTheme()" icon="mdi-theme-light-dark"></v-btn>
      <v-btn @click="authStore.logout()" icon="mdi-logout"></v-btn>
    </v-app-bar>

    <v-navigation-drawer
      class="hidden-sm-and-up"
      v-model="drawer"
      temporary
    >
      <v-list
        :lines="false"
        density="compact"
        nav
      >
        <span
          v-for="link in navigation_links"
          :key="link.name"
        >
          <v-list-item
            v-if="checkRoles(link.allowedRoles)"
            :key="link.name"
            :title="link.name"
            :to="link.location"
            :prepend-icon="link.icon"
            active-color="primary"
          >
          </v-list-item>
        </span>
      </v-list>
    </v-navigation-drawer>

    <v-main :class="theme.global.current.value.dark ? 'black': 'bg-grey-lighten-3'">
      <v-container>
        <v-sheet
          min-height="70vh"
          rounded="lg"
        >
          <RouterView/>
        </v-sheet>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import {useTheme} from 'vuetify'
import {ref} from "vue";
import {useAuthStore} from "@/stores/AuthStore";
import {useThemeStore} from "@/stores/ThemeStore";
import config from "../../config";

const theme = useTheme()
const themeStore = useThemeStore()
const authStore = useAuthStore()
const drawer = ref(false)
const navigation_links = config["NAVIGATION"]

function checkRoles(roles: string[]): boolean {
  const intersection = authStore.userInfo?.roles.filter(element => roles.includes(element));
  if (!intersection) {
    return false
  }
  return intersection.length > 0
}

</script>
