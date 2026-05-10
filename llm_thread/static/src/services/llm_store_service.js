/** @odoo-module **/

import { _t } from "@web/core/l10n/translation";
import { Deferred } from "@web/core/utils/concurrency";
import { reactive } from "@odoo/owl";
import { registry } from "@web/core/registry";

/**
 * LLM Store Service - Integrates with existing mail.store
 * Provides LLM-specific functionality without breaking mail components
 */
export const llmStoreService = {
  dependencies: ["orm", "mail.store", "notification"],

  start(env, { orm, "mail.store": mailStore, notification }) {
    /**
     * Helper to get all records from a mail.store collection in any Odoo version
     * Handles .list(), .records (array/object), and direct iteration
     */
    const getCollectionRecords = (col) => {
      if (!col) return [];
      if (typeof col.list === "function") {
        return col.list();
      }
      if (col.records) {
        return Array.isArray(col.records)
          ? col.records
          : Object.values(col.records);
      }
      if (typeof col[Symbol.iterator] === "function") {
        return [...col];
      }
      return [];
    };

    const llmStore = reactive({
      // NOTE: Threads are now loaded via standard mail.store, no need for separate Map
      // Map<id, LLMModel>
      llmModels: new Map(),
      // Map<id, LLMProvider>
      llmProviders: new Map(),
      // Map<id, LLMTool>
      llmTools: new Map(),
      // Set<threadId> currently streaming
      streamingThreads: new Set(),
      // Map<threadId, EventSource>
      eventSources: new Map(),
      // Resolves when LLM data is loaded
      isReady: new Deferred(),
      // Pending AI chat open from client action (bypasses unreliable bus)
      // { threadId, model, resId, autoGenerate }
      pendingOpenInChatter: null,

      // Computed properties - using mailStore as source of truth
      get activeLLMThread() {
        // Check if current active thread in mail.store is an LLM thread
        const activeThread = mailStore.discuss && mailStore.discuss.thread;
        return activeThread &&
          (activeThread.model === "llm.thread" ||
            activeThread.res_model === "llm.thread")
          ? activeThread
          : null;
      },

      get isLLMThread() {
        return this.activeLLMThread !== null;
      },

      get llmThreadList() {
        const allThreads = [
          ...getCollectionRecords(mailStore.Thread),
          ...getCollectionRecords(mailStore["llm.thread"]),
        ];

        return allThreads
          .filter(
            (thread) =>
              thread.model === "llm.thread" || thread.res_model === "llm.thread"
          )
          .sort((a, b) => {
            const dateA = new Date(a.write_date || 0);
            const dateB = new Date(b.write_date || 0);
            return dateB - dateA;
          });
      },

      // LLM-specific methods using standard fetchData approach
      ensureThreadLoaded: async function (threadId) {
        const findInStore = () => {
          const collections = ["Thread", "llm.thread"];
          for (const colName of collections) {
            const collection = mailStore[colName];
            if (!collection) continue;

            // Try multiple ID formats: number, composite string, and plain string
            let thread =
              collection.get(threadId) ||
              collection.get(`llm.thread,${threadId}`) ||
              collection.get(String(threadId));

            if (thread) return thread;

            // Deep search fallback: check ID property of every record
            const records = getCollectionRecords(collection);
            thread = records.find(
              (r) =>
                r.id === threadId ||
                r.id === `llm.thread,${threadId}` ||
                String(r.id) === String(threadId)
            );

            if (thread) return thread;
          }
          return null;
        };

        // 1. Check local store
        let thread = findInStore();
        if (thread) return thread;

        // 2. Not in store, fetch from server
        console.log(`[LLM Store] Thread ${threadId} not in store, fetching...`);
        try {
          const storeData = await orm.call("llm.thread", "to_store_format", [
            threadId,
          ]);
          if (storeData) {
            console.log("[LLM Store] Fetch result:", storeData);
            mailStore.insert(storeData);
            // Wait a microtask for reactivity to settle
            await new Promise((resolve) => setTimeout(resolve, 0));
            thread = findInStore();
          }
        } catch (error) {
          console.error(`[LLM Store] Error fetching thread ${threadId}:`, error);
        }

        if (!thread) {
          console.error(`[LLM Store] Still could not find thread ${threadId} after fetch/insert`);
        }
        return thread;
      },

      sendLLMMessage: async function (threadId, content, attachmentIds = []) {
        console.log("[LLM Store] sendLLMMessage called:", { threadId, contentLength: content?.length, attachmentIds });
        if (
          !threadId ||
          ((!content || !content.trim()) && attachmentIds.length === 0)
        ) {
          console.warn("[LLM Store] Cannot send empty message or missing threadId");
          return;
        }

        try {
          await this.startLLMStreaming(threadId, content, attachmentIds);
        } catch (error) {
          console.error("[LLM Store] Error sending LLM message:", error);
          notification.add(
            _t(
              "Could not send your message. Please check your connection and try again."
            ),
            { type: "danger" }
          );
        }
      },

      startLLMStreaming: async function (threadId, message, attachmentIds = []) {
        this.stopStreaming(threadId);

        this.streamingThreads.add(threadId);

        try {
          let url = `/llm/thread/generate?thread_id=${threadId}`;
          if (message) {
            url += `&message=${encodeURIComponent(message)}`;
          }
          if (attachmentIds.length > 0) {
            url += `&attachment_ids=${attachmentIds.join(",")}`;
          }
          const eventSource = new EventSource(url);

          this.eventSources.set(threadId, eventSource);

          eventSource.onmessage = (event) => {
            try {
              const data = JSON.parse(event.data);
              console.log("[LLM Store] Received stream message:", data.type);
              this.handleStreamMessage(threadId, data);
            } catch (e) {
              console.error("[LLM Store] Failed to parse stream data:", event.data, e);
            }
          };

          eventSource.onerror = (error) => {
            console.error("EventSource error:", error);
            this.stopStreaming(threadId);
            notification.add(
              _t(
                "Lost connection to AI service. Please try sending your message again."
              ),
              {
                type: "danger",
              }
            );
          };
        } catch (error) {
          console.error("Error starting stream:", error);
          this.stopStreaming(threadId);
          notification.add(
            _t(
              "Could not start AI response. Please check your connection and try again."
            ),
            { type: "danger" }
          );
        }
      },

      stopStreaming(threadId) {
        const eventSource = this.eventSources.get(threadId);
        if (eventSource) {
          eventSource.close();
          this.eventSources.delete(threadId);
        }
        this.streamingThreads.delete(threadId);
      },

      handleStreamMessage: async function (threadId, data) {
        /**
         * Helper to wrap message data in the correct Odoo 19 Store format
         * Store.insert() expects { ModelName: [records] }
         */
        const wrapMessage = (msg) => {
          if (!msg) return {};
          // If already wrapped in a model key (Odoo standard), return as is
          if (msg["mail.message"] || msg.Message || msg.Thread) {
            return msg;
          }
          // If it's a single message object, wrap it in mail.message (Odoo 19 standard)
          return { "mail.message": [msg] };
        };

        switch (data.type) {
          case "message_create": {
            const wrapped = wrapMessage(data.message);
            mailStore.insert(wrapped, { html: true });

            // Extract the message data for further processing
            const msgData = wrapped["mail.message"] ? wrapped["mail.message"][0] : (wrapped.Message ? wrapped.Message[0] : null);
            if (!msgData) break;

            // In Odoo 19, use the collection mapped to the model name
            const msgCollection = mailStore["mail.message"] || mailStore.Message;
            const createdMessage = msgCollection ? msgCollection.get(msgData.id) : null;

            // Add message to the correct thread's messages collection
            const createThread = await this.ensureThreadLoaded(threadId);
            if (createThread && createdMessage) {
               if (!createThread.messages.some((m) => m.id === createdMessage.id)) {
                 createThread.messages.push(createdMessage);
               }
            }
            break;
          }

          case "message_chunk":
          case "message_update":
            // Update existing message using standard mail.store.insert()
            mailStore.insert(wrapMessage(data.message), { html: true });
            break;

          case "error":
            console.error("Stream error:", data.error);
            this.stopStreaming(threadId);
            notification.add(data.error || _t("AI response error"), {
              type: "danger",
            });
            break;

          case "done":
            this.stopStreaming(threadId);
            break;

          case "tool_called":
          case "tool_succeeded":
          case "tool_failed":
            // No-op: handled via message_update
            console.log("[LLM] no-op event:", data.type);
            break;

          default:
            console.warn("Unknown stream message type:", data.type);
            break;
        }
      },

      loadLLMModels: async function () {
        try {
          // Check if llm.model exists first - use correct field names
          const models = await orm.searchRead(
            "llm.model",
            [["active", "=", true]],
            ["id", "name", "provider_id", "default", "model_use"]
          );

          models.forEach((model) => {
            this.llmModels.set(model.id, model);
          });
        } catch (error) {
          console.warn(
            "LLM models not available - llm module may not be installed:",
            error.message
          );
          // Don't throw error, just log warning
        }
      },

      loadLLMProviders: async function () {
        try {
          // Check if llm.provider exists first - use correct field names
          const providers = await orm.searchRead(
            "llm.provider",
            [["active", "=", true]],
            ["id", "name", "service"]
          );

          providers.forEach((provider) => {
            this.llmProviders.set(provider.id, provider);
          });
        } catch (error) {
          console.warn(
            "LLM providers not available - llm module may not be installed:",
            error.message
          );
          // Don't throw error, just log warning
        }
      },

      loadLLMTools: async function () {
        // Load available tools with minimal fields
        const tools = await orm.searchRead(
          "llm.tool",
          [["active", "=", true]],
          ["id", "name"]
        );

        tools.forEach((tool) => {
          this.llmTools.set(tool.id, tool);
        });
      },

      // Thread selection using standard Odoo patterns
      selectThread: async function (threadId) {
        try {
          // Ensure thread is loaded using standard fetchData
          const thread = await this.ensureThreadLoaded(threadId);
          if (!thread) {
            throw new Error("Thread not found or failed to load");
          }

          // Set as active thread in discuss - this is all we need!
          thread.setAsDiscussThread();
        } catch (error) {
          console.error("Error selecting thread:", error);
          notification.add(
            _t(
              "Could not load this conversation. It may have been deleted or you may not have access."
            ),
            { type: "danger" }
          );
        }
      },

      // Create new thread with default provider and model
      createNewThread: async function ({ recordModel, recordId } = {}) {
        // Get first available provider and model
        const firstProvider = this.getFirstAvailableProvider();
        const firstModel = this.getFirstAvailableModel();

        // Check for null values and show notifications
        if (!firstProvider) {
          notification.add(
            _t(
              "No AI providers are configured. Please contact your administrator to set up an AI provider."
            ),
            { type: "danger" }
          );
          return;
        }

        if (!firstModel) {
          notification.add(
            _t(
              "No AI models are available. Please contact your administrator to configure AI models."
            ),
            { type: "danger" }
          );
          return;
        }

        // Create thread with auto-generated name
        const threadName = `Chat ${new Date().toLocaleString()}`;

        const threadData = {
          name: threadName,
          provider_id: firstProvider.id,
          model_id: firstModel.id,
        };

        // Auto-link to record if context provided (e.g., from chatter)
        if (recordModel && recordId) {
          threadData.model = recordModel;
          threadData.res_id = recordId;
        }

        const threadId = await orm.call("llm.thread", "create", [threadData]);

        // Reload user threads and select the new one
        await this.refreshThreadsAndSelect(threadId);
      },

      // Get first available provider
      getFirstAvailableProvider() {
        const providers = Array.from(this.llmProviders.values());
        return providers.length > 0 ? providers[0] : null;
      },

      // Get first available model
      getFirstAvailableModel() {
        const models = Array.from(this.llmModels.values());
        return models.length > 0 ? models[0] : null;
      },

      // Refresh threads and select specific thread
      refreshThreadsAndSelect: async function (threadId) {
        // Fetch the newly created thread in store format compatible with Odoo 19
        const storeData = await orm.call("llm.thread", "to_store_format", [
          threadId,
        ]);
        // Insert into mailStore to update the UI reactively
        mailStore.insert(storeData);

        // Wait a moment for threads to be populated
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Select the newly created thread
        await this.selectThread(threadId);
      },

      // Link a record to a thread
      async linkRecordToThread(threadId, model, recordId) {
        try {
          // Update database
          await orm.write("llm.thread", [threadId], {
            model: model,
            res_id: recordId,
          });

          // Update the thread object in mailStore for immediate reactivity
          const thread = mailStore.Thread.get({
            model: "llm.thread",
            id: threadId,
          });

          if (thread) {
            Object.assign(thread, {
              res_model: model,
              res_id: recordId,
            });
          }

          notification.add(_t("Record linked to conversation successfully."), {
            type: "success",
          });
          return true;
        } catch (error) {
          console.error("Error linking record:", error);
          notification.add(
            _t(
              "Could not link the record to this conversation. Please try again."
            ),
            { type: "danger" }
          );
          return false;
        }
      },

      // Unlink record from a thread
      async unlinkRecordFromThread(threadId) {
        try {
          // Update database
          await orm.write("llm.thread", [threadId], {
            model: false,
            res_id: false,
          });

          // Update the thread object in mailStore for immediate reactivity
          const thread = mailStore.Thread.get({
            model: "llm.thread",
            id: threadId,
          });

          if (thread) {
            Object.assign(thread, {
              res_model: false,
              res_id: false,
            });
          }

          notification.add(
            _t("Record unlinked from conversation successfully."),
            {
              type: "success",
            }
          );
          return true;
        } catch (error) {
          console.error("Error unlinking record:", error);
          notification.add(
            _t(
              "Could not unlink the record from this conversation. Please try again."
            ),
            { type: "danger" }
          );
          return false;
        }
      },

      // Helper methods for components
      isStreamingThread(threadId) {
        return this.streamingThreads.has(threadId);
      },

      getStreamingStatus() {
        const activeThread = mailStore.discuss && mailStore.discuss.thread;
        if (activeThread && activeThread.model === "llm.thread") {
          return this.isStreamingThread(activeThread.id);
        }
        return false;
      },

      // Pending open methods - used by client action to bypass unreliable bus
      setPendingOpenInChatter(data) {
        this.pendingOpenInChatter = data;
      },

      consumePendingOpenInChatter(model, resId) {
        const pending = this.pendingOpenInChatter;
        if (pending && pending.model === model && pending.resId === resId) {
          this.pendingOpenInChatter = null;
          return pending;
        }
        return null;
      },

      // Get list of data loaders - can be extended by patches
      getDataLoaders() {
        return [this.loadLLMProviders, this.loadLLMModels, this.loadLLMTools];
      },

      // Initialize LLM store - threads now loaded via standard init_messaging
      initialize: async function () {
        try {
          const loaders = this.getDataLoaders();
          await Promise.all(loaders.map((loader) => loader.call(this)));
          // NOTE: LLM threads are now loaded automatically via res.users._init_messaging()
          this.isReady.resolve();
        } catch (error) {
          console.error("Error initializing LLM store:", error);
          this.isReady.reject(error);
        }
      },

      // Cleanup
      destroy() {
        // Close all event sources
        this.eventSources.forEach((eventSource) => eventSource.close());
        this.eventSources.clear();
        this.streamingThreads.clear();
      },
    });

    // Initialize LLM data after mailStore is ready (which calls init_messaging)
    mailStore.isReady.then(() => {
      llmStore.initialize();
    });

    // NOTE: No longer need thread subscription since threads load automatically via fetchData

    return llmStore;
  },
};

registry.category("services").add("llm.store", llmStoreService);
