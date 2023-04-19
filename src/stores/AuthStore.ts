import { defineStore } from 'pinia'
import {JWTToken, JWTUser, UserCredentials} from "@/models/User";
import {computed, Ref, ref, UnwrapRef} from "vue";
import axios from "axios";
import config from "../../config";
import router from "@/router";


export const useAuthStore = defineStore('auth', () => {
  const userToken: Ref<UnwrapRef<JWTToken | undefined>> = ref<JWTToken | undefined>(undefined)
  const userInfo: Ref<UnwrapRef<JWTUser | undefined>> = ref<JWTUser | undefined>(undefined)

  const isLoggedIn = computed(() => {
    return !!userToken.value
  })

  async function login(user_c: UserCredentials) {
    return await axios.post(config["API_URL"] + '/auth/login', user_c)
      .then((res) => {
        userToken.value = new JWTToken(res.data["jwt-token"])
        userInfo.value = userToken.value.decode()
        // Store token in cookie
        document.cookie = 'jwt-token=' + res.data["jwt-token"] + '; path=/' + '; samesite=strict' + '; max-age=86400'
        return Promise.resolve(true)
      }).catch((err) => {
        return Promise.reject(err)
      })
  }

  function logout() {
    userToken.value = undefined
    // Remove token from cookie
    document.cookie = 'jwt-token=; path=/' + '; samesite=strict' + '; max-age=0'
    router.push('/login')
  }

  function checkToken() {
    // Check if token still valid
    if (userInfo.value && userInfo.value.exp < Math.floor(Date.now() / 1000)) {
      logout()
    }
  }

  function authHeader() {
    checkToken()
    if (userToken.value) {
      return { Authorization: 'Bearer ' + userToken.value.token }
    } else {
      return {}
    }
  }

  async function load_user() {
    if (document.cookie.includes('jwt-token')) {
      const token = document.cookie.split('; ').find(row => row.startsWith('jwt-token='))?.split('=')[1]
      userToken.value = new JWTToken(token!)
      userInfo.value = userToken.value.decode()
      checkToken()
    }
  }
  load_user()

  return { userToken, userInfo, isLoggedIn, login, logout, authHeader }
})
