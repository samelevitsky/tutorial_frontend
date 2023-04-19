import { defineStore } from 'pinia'
import {Ref, ref, UnwrapRef} from "vue";
import {useTheme} from "vuetify";

export const useThemeStore = defineStore('theme', () => {
  const theme: Ref<UnwrapRef<string>> = ref<string>('dark')

  const globalTheme = useTheme()
  function toggleTheme() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
    globalTheme.global.name.value = theme.value
    // save theme to local storage
    localStorage.setItem('theme', theme.value)
  }

  function loadTheme() {
    // load theme from local storage
    const themeName = localStorage.getItem('theme')
    if (themeName) {
      globalTheme.global.name.value = themeName
    }
  }
  loadTheme()

  return { theme, toggleTheme }
})
