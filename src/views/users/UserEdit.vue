<template>
  <v-alert
    v-model="showSuccess"
    border="start"
    variant="tonal"
    closable
    close-label="Close Alert"
    color="success"
    title="Saved successfully"
  ></v-alert>
  <v-alert
    v-model="showError"
    border="start"
    variant="tonal"
    closable
    close-label="Close Alert"
    color="error"
    :title="errorMessage"
  ></v-alert>
  <div class="pa-5">
    <h2 v-if="action === 'edit'">Edit User: {{ user.firstName }} {{ user.lastName }}</h2>
    <h2 v-if="action === 'new'">Create User</h2>
    <v-row no-gutters>
      <v-col
        cols="12"
        md="6"
      >
        <v-text-field
          v-model="user.firstName"
          :counter="30"
          :error-messages="fieldErrors.get('firstName')"
          label="First name"
          required
        ></v-text-field>
      </v-col>
      <v-col
        cols="12"
        md="6"
        class="pl-md-2"
      >
        <v-text-field
          v-model="user.lastName"
          :counter="30"
          :error-messages="fieldErrors.get('lastName')"
          label="Last name"
          required
        ></v-text-field>
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col>
        <v-text-field
          v-model="user.email"
          :counter="50"
          :error-messages="fieldErrors.get('email')"
          label="Email"
          required
        ></v-text-field>
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col
        cols="12"
        md="6"
      >
        <v-text-field
          v-model="user.uaNumber"
          :counter="8"
          :error-messages="fieldErrors.get('uaNumber')"
          label="UA-Number"
          required
        ></v-text-field>
      </v-col>
      <v-col
        cols="12"
        md="6"
        class="pl-md-2"
      >
        <v-text-field
          v-model="user.telephone"
          :counter="16"
          :error-messages="fieldErrors.get('telephone')"
          label="Telephone Number"
          type="number"
          required
        ></v-text-field>
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col
        cols="12"
        md="6"
      >
        <v-text-field
          v-model="user.location"
          :counter="50"
          :error-messages="fieldErrors.get('location')"
          label="Location"
          required
        ></v-text-field>
      </v-col>
      <v-col
        cols="12"
        md="6"
        class="pl-md-2"
      >
        <v-select
          v-model="user.roles"
          :items="roles"
          item-title="name"
          item-value="id"
          label="Role"
          :error-messages="fieldErrors.get('roles')"
          return-object
          required
          multiple
        ></v-select>
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col>
        <v-text-field
          v-model="user.password"
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :type="showPassword ? 'text' : 'password'"
          :error-messages="fieldErrors.get('password')"
          label="Password"
          counter
          @click:append="showPassword = !showPassword"
        ></v-text-field>
        <v-text-field
          v-model="user.repeatPassword"
          :append-icon="showRepeatPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :type="showRepeatPassword ? 'text' : 'password'"
          :error-messages="fieldErrors.get('repeatPassword')"
          label="Repeat Password"
          counter
          @click:append="showRepeatPassword = !showRepeatPassword"
        ></v-text-field>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-btn
          color="success"
          @click="save"
        >
          Save
        </v-btn>
        <v-btn
          class="ml-2"
          color="secondary"
          to="/users"
        >
          Back
        </v-btn>
      </v-col>
    </v-row>

  </div>
</template>

<script lang="ts" setup>
import axios from "axios";
import config from "../../../config";
import {useRoute, useRouter} from "vue-router";
import {ref} from "vue";
import {User} from "@/models/User";
import {useAuthStore} from "@/stores/AuthStore";

const route = useRoute();
const router = useRouter();

const user = ref<User>(new User(0, "", "", "", "", "", "", "", "", []));
const roles = ref<object[]>([]);
const showPassword = ref<boolean>(false);
const showRepeatPassword = ref<boolean>(false);
const showSuccess = ref<boolean>(false);
const showError = ref<boolean>(false);
const errorMessage = ref<string>("");
const fieldErrors = ref<Map<string, string>>(new Map());
const action = ref("edit")
const authStore = useAuthStore();

async function init() {
  if (route.params.id === "new") {
    action.value = "new";
    return;
  }
  await axios.get(config["API_URL"] + "/users/" + route.params.id, {headers: authStore.authHeader()})
    .then((response) => {
      user.value = response.data;
    }).catch((error) => {
      showError.value = true;
      errorMessage.value = error.response.data.message;
    })
}
init(); // call init() on component load

async function initRoleOptions() {
  await axios.get(config["API_URL"] + "/roles", {headers: authStore.authHeader()})
    .then((response) => {
      roles.value = response.data;
    }).catch((error) => {
      showError.value = true;
      errorMessage.value = error.response.data.message;
    })
}
initRoleOptions(); // call initRoleOptions() on component load

async function save() {
  if (action.value === "new") {
    await axios.put(config["API_URL"] + "/users/new", user.value, {headers: authStore.authHeader()})
      .then(async () => {
        showSuccess.value = true;
        await new Promise(resolve => setTimeout(resolve, 1500));
        router.push("/users")
      })
      .catch((error) => {
        showError.value = true;
        if(error.response.data.message) {
          errorMessage.value = error.response.data.message;
        } else if (typeof error.response.data === "object") {
          errorMessage.value = "Something went wrong.";
          for(let key in error.response.data) {
            fieldErrors.value.set(key as string, error.response.data[key])
          }
        }
      })
  } else {
    await axios.post(config["API_URL"] + "/users/" + route.params.id, user.value, {headers: authStore.authHeader()})
      .then(async () => {
        showSuccess.value = true;
        await new Promise(resolve => setTimeout(resolve, 1500));
        router.push("/users")
      })
      .catch((error) => {
        showError.value = true;
        if(error.response.data.message) {
          errorMessage.value = error.response.data.message;
        } else if (typeof error.response.data === "object") {
          errorMessage.value = "Something went wrong.";
          for(let key in error.response.data) {
            fieldErrors.value.set(key as string, error.response.data[key])
          }
        }
      })
  }
}


</script>

<style scoped>

</style>
