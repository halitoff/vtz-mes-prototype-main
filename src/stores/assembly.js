import { defineStore } from "pinia";
import { reactive, ref } from "vue";

export const useAssemblyStore = defineStore("assembly", () => {
  const session = ref({});
  const activeMode = ref("tree");
  const filters = reactive({
      left_search: "",
      right_search: "",
      is_node: true,
  });
  const currentAssembly = ref(null);
  const searchResults = ref([]); // <-- Результаты поиска

  async function performSearch(query) {
      if (!query.trim()) {
          searchResults.value = [];
          return;
      }

      try {
          const response = await fetch('http://localhost:8000/hierarchy/search', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'Accept': 'application/json'
              },
              body: JSON.stringify({ nm: query })
          });

          if (!response.ok) {
              throw new Error('Ошибка сети');
          }

          const data = await response.json();
          searchResults.value = data;
      } catch (error) {
          console.error("Ошибка поиска:", error);
          searchResults.value = [];
      }
  }

  function setMode(mode) {
      activeMode.value = mode;
  }

  function saveSession() {
      console.debug("session saved", session.value);
  }

  return {
      session,
      activeMode,
      filters,
      currentAssembly,
      searchResults,   // <-- Экспортируем
      performSearch,   // <-- Экспортируем
      setMode,
      saveSession,
  };
});
