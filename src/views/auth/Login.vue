<template>
  <v-app>
    <v-container
      fluid
      class="fill-height align-center justify-center"
    >
      <v-card class="elevation-12 w-50" min-width="300">
        <v-toolbar color="primary">
          <v-toolbar-title>Login</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-form>
            <v-text-field
              prepend-icon="mdi-account" name="email" label="Email"
              type="email"
              v-model="email"
            ></v-text-field>
            <v-text-field
              id="password"
              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              prepend-icon="mdi-lock"
              name="password"
              label="Password"
              :type="showPassword ? 'text' : 'password'"
              v-model="password"
              @click:append="showPassword = !showPassword"
            ></v-text-field>
          </v-form>
          <v-alert
            v-model="showError"
            variant="tonal"
            border="start"
            closable
            close-label="Close Alert"
            color="error"
            title="Something went wrong: wrong email or password"
          ></v-alert>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="login()">Login</v-btn>
        </v-card-actions>
      </v-card>
    </v-container>
  </v-app>
</template>

<script lang="ts" setup>

import {ref} from "vue";
import {useAuthStore} from "@/stores/AuthStore";
import {UserCredentials} from "@/models/User";
import {useRouter} from "vue-router";
import {useThemeStore} from "@/stores/ThemeStore";

const email = ref<string>('')
const password = ref<string>('')
const showPassword = ref<boolean>(false)
const showError = ref<boolean>(false)
const router = useRouter()
const authStore = useAuthStore()
useThemeStore() // this is needed to load the theme

function login(){
  authStore.login(new UserCredentials(email.value, password.value)).then(() => {
    console.log('login success')
    router.push('/')
  }).catch(() => {
    console.log('login error')
    showError.value = true
  })
}

</script>

<style scoped>

</style>
