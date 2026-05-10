/** @odoo-module **/

import { llmStoreService } from "@llm_thread/services/llm_store_service";
import { patch } from "@web/core/utils/patch";
import { rpc } from "@web/core/network/rpc";

/**
 * Minimal patch to add assistant functionality to existing LLM store
 * Reuses all existing patterns and infrastructure
 */
patch(llmStoreService, {
  start(env, services) {
    const llmStore = super.start(env, services);
    const { orm, notification } = services;

    // Store the original getDataLoaders method
    const originalGetDataLoaders = llmStore.getDataLoaders.bind(llmStore);

    // Add assistant-specific properties directly
    llmStore.llmAssistants = new Map();
    llmStore._assistantsLoaded = false;

    // Define currentAssistant getter with proper context binding
    Object.defineProperty(llmStore, "currentAssistant", {
      get: function () {
        const activeThread = this.activeLLMThread;
        if (!activeThread || !activeThread.assistant_id) return null;

        const assistantId =
          (activeThread.assistant_id && activeThread.assistant_id.id) ||
          activeThread.assistant_id;
        const assistant = this.llmAssistants.get(assistantId);

        return assistant || activeThread.assistant_id;
      },
      enumerable: true,
      configurable: true,
    });

    // Add other methods using Object.assign
    Object.assign(llmStore, {
      async loadLLMAssistants() {
        try {
          const assistants = await orm.searchRead(
            "llm.assistant",
            [["active", "=", true]],
            ["id", "name", "is_public", "provider_id", "model_id", "tool_ids"]
          );

          assistants.forEach((assistant) => {
            this.llmAssistants.set(assistant.id, assistant);
          });
          this._assistantsLoaded = true;
        } catch (error) {
          console.warn(
            "LLM assistants not available - llm_assistant module may not be installed:",
            error.message
          );
        }
      },

      async selectAssistant(assistantId) {
        const activeThread = this.activeLLMThread;
        if (!activeThread) {
          notification.add("No active thread to update", { type: "warning" });
          return;
        }

        try {
          // Use RPC endpoint instead of direct ORM call for better separation of concerns
          const result = await rpc("/llm/thread/set_assistant", {
            thread_id: activeThread.id,
            assistant_id: assistantId,
          });

          if (!result.success && result.success !== undefined) {
            notification.add("Failed to update assistant", { type: "danger" });
            return;
          }

          // Odoo 19: fetchData is not available on thread objects.
          // Instead, read the updated fields via ORM and apply them manually.
          const threadId = typeof activeThread.id === "string"
            ? parseInt(activeThread.id.split(",").pop(), 10)
            : activeThread.id;

          const updated = await orm.read(
            "llm.thread",
            [threadId],
            ["assistant_id", "provider_id", "model_id", "tool_ids", "prompt_id"]
          );

          if (updated && updated.length > 0) {
            const data = updated[0];
            // Update reactive thread properties
            if (data.provider_id) activeThread.provider_id = data.provider_id;
            if (data.model_id) activeThread.model_id = data.model_id;
            if (data.assistant_id) activeThread.assistant_id = data.assistant_id;
            if (data.tool_ids) activeThread.tool_ids = data.tool_ids;
            if (data.prompt_id) activeThread.prompt_id = data.prompt_id;
          }
        } catch (error) {
          console.error("Error selecting assistant:", error);
          notification.add("Failed to update assistant", { type: "danger" });
        }
      },

      // Extend existing getDataLoaders method instead of overriding initialize
      getDataLoaders() {
        const baseLoaders = originalGetDataLoaders();
        return [...baseLoaders, this.loadLLMAssistants];
      },
    });

    return llmStore;
  },
});
