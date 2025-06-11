import { defineStore } from "pinia";
import { reactive, ref } from "vue";

/**
 * Store for assembly explorer session and settings
 */
export const useAssemblyStore = defineStore("assembly", () => {
  // session data can be expanded when backend is ready
  const session = ref({});

  // view mode: tree | table | cards
  const activeMode = ref("tree");

  // current applied filters
  const filters = reactive({
    search: "",
    type: null,
    quantity: null,
  });

  // current assembly or node id
  const currentAssembly = ref(null);

  function setMode(mode) {
    activeMode.value = mode;
  }

  function saveSession() {
    // TODO: implement session save via API/localStorage
    console.debug("session saved", session.value);
  }

  return {
    session,
    activeMode,
    filters,
    currentAssembly,
    setMode,
    saveSession,
  };
});
