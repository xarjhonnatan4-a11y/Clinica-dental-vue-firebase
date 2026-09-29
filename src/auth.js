import { reactive } from "vue";

export const authState = reactive({
  user: null
});

export function setUser(user) {
  authState.user = user;
}

export function clearUser() {
  authState.user = null;
}
