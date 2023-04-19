<template>
  <div class="pa-5">
    <div class="d-flex justify-space-between">
      <h2>Users</h2>
      <v-btn
        color="primary"
        :to="'/users/new'"
      > Add new user
      </v-btn>
    </div>

    <p>Here is a list of our users:</p>
    <v-table>
      <thead>
        <tr>
          <th class="text-left">
            Id
          </th>
          <th class="text-left">
            Firstname
          </th>
          <th class="text-left">
            Lastname
          </th>
          <th class="text-left">
            Email
          </th>
          <th class="text-left">
            Roles
          </th>
          <th class="text-left">
            Actions
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="user in users"
          :key="user.id"
        >
          <td>{{ user.id }}</td>
          <td>{{ user.firstName }}</td>
          <td>{{ user.lastName }}</td>
          <td>{{ user.email }}</td>
          <td>
            <v-chip
              v-for="role in user.roles"
              :key="role.id"
              color="primary"
              small
            >
              {{ role.name }}
            </v-chip>
          </td>
          <td>
            <v-btn
              color="primary"
              icon="mdi-pencil"
              size="x-small"
              :to="'/users/' + user.id"
            >
            </v-btn>
            <v-btn
              class="ml-1 ml-xs-0"
              color="error"
              icon="mdi-delete"
              size="x-small"
              @click="deleteDialog = true; deleteUserId = user.id"
            >
            </v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>

    <v-dialog
      v-model="deleteDialog"
      max-width="300"
    >
      <v-card>
        <v-card-text>
          Are you sure you want to delete this user?
        </v-card-text>
        <v-card-actions>
          <v-btn color="error" @click="deleteUser(deleteUserId)">Confirm</v-btn>
          <v-btn color="secondary" @click="deleteDialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts" setup>
// Call /api/users with axios
import axios from "axios";
import config from "../../../config";
import {ref} from "vue";
import {User} from "@/models/User";
import {useAuthStore} from "@/stores/AuthStore";

const users = ref<Array<User>>([]);
const deleteDialog = ref<boolean>(false);
const deleteUserId = ref<number>();
const authStore = useAuthStore();

async function initData() {
  const res = await axios.get(config["API_URL"] + "/users", {headers: authStore.authHeader()});
  if(res && res.data) {
    users.value = res.data;
  } else {
    users.value = [];
    console.log("No data returned from API: " + res.status)
  }
}
initData();

function deleteUser(id: number | undefined) {
  if(!id) {
    return;
  }
  axios.delete(config["API_URL"] + "/users/" + id, {headers: authStore.authHeader()})
    .then(() => {
      initData();
      deleteDialog.value = false;
    })
    .catch((err) => {
      console.log(err);
    });
}
</script>

<style scoped>

</style>
