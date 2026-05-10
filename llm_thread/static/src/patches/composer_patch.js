/** @odoo-module **/

import { _t } from "@web/core/l10n/translation";
import { Composer } from "@mail/core/common/composer";
import { patch } from "@web/core/utils/patch";
import { useService } from "@web/core/utils/hooks";
import { useState } from "@odoo/owl";

/**
 * Patch Composer to handle LLM threads
 * IMPORTANT: Only affects behavior when dealing with llm.thread model
 * All other mail functionality remains unchanged
 */
patch(Composer.prototype, {
  setup() {
    super.setup();

    // Initialize LLM store in setup - wrap with useState for reactivity (like Odoo does)
    try {
      this.llmStore = useState(useService("llm.store"));
    } catch (error) {
      // LLM service might not be available, that's ok
      console.warn("LLM store service not available:", error.message);
      this.llmStore = null;
    }
  },

  /**
   * Check if current thread is an LLM thread
   * This is our safety check to ensure we only modify LLM-related behavior
   */
  get isLLMThread() {
    const thread = this.props.composer && this.props.composer.thread;
    if (!thread) {
      return false;
    }
    // In Odoo 19, check both model and res_model as a fallback
    return thread.model === "llm.thread" || thread.res_model === "llm.thread";
  },

  /**
   * Check if this LLM thread is currently streaming
   */
  get isStreaming() {
    // Normal mail threads are never "streaming"
    if (!this.isLLMThread || !this.llmStore) {
      return false;
    }
    return this.llmStore.getStreamingStatus() || false;
  },

  get showStop() {
    if (this.isLLMThread) {
      return this.isStreaming;
    }

    return false;
  },

  async sendMessage() {
    const composer = this.props.composer;
    
    // Exhaustive search for text in the composer object
    const findText = (obj) => {
      if (!obj) return "";
      // Priority 1: Standard paths
      if (typeof obj.text === "string") return obj.text;
      if (typeof obj.textValue === "string") return obj.textValue;
      if (obj.comment && typeof obj.comment.text === "string") return obj.comment.text;
      
      // Priority 2: Any string property containing 'text' in its name
      for (const key in obj) {
        if (key.toLowerCase().includes("text") && typeof obj[key] === "string") {
          return obj[key];
        }
      }
      
      // Priority 3: Fallback to common Odoo properties
      return obj.body || obj.comment?.body || "";
    };

    const rawContent = findText(composer);
    const content = typeof rawContent === "string" ? rawContent.trim() : "";
    const attachments = composer.attachments || [];
    const attachmentIds = attachments.map((att) => att.id);

    console.log("[LLM Composer] sendMessage called. isLLMThread:", this.isLLMThread);
    console.log("[LLM Composer] Composer Keys:", Object.keys(composer).join(", "));
    console.log("[LLM Composer] Detected Content:", content);

    if (this.isLLMThread && this.llmStore) {
      if (!content && attachmentIds.length === 0) {
        console.log("[LLM Composer] Empty content and no attachments, ignoring.");
        return;
      }

      const threadId = composer.thread.id;
      console.log("[LLM Composer] Sending message to thread:", threadId);

      try {
        // Clear composer FIRST to give immediate feedback
        this.props.composer.clear();
        await this.llmStore.sendLLMMessage(threadId, content, attachmentIds);
      } catch (error) {
        console.error("[LLM Composer] Error in sendMessage:", error);
      }
      return;
    }

    return super.sendMessage();
  },

  /**
   * Override onKeydown to handle LLM-specific shortcuts
   * @param {KeyboardEvent} ev - Keyboard event
   */
  onKeydown(ev) {
    // LLM-specific handling
    if (this.isLLMThread) {
      switch (ev.key) {
        case "Enter":
          // For LLM threads, always send on Enter (no Shift+Enter for newline)
          if (!ev.shiftKey && !this.isStreaming) {
            ev.preventDefault();
            this.sendMessage();
            return;
          }
          break;
        case "Escape":
          // Stop streaming if ESC is pressed
          if (this.isStreaming) {
            ev.preventDefault();
            this.stopStreaming();
            return;
          }
          break;
      }
    }

    // For all other cases (including non-LLM threads), use original behavior
    super.onKeydown(ev);
  },

  /**
   * Stop LLM streaming (only relevant for LLM threads)
   */
  stopStreaming() {
    if (this.isLLMThread && this.llmStore) {
      const threadId = this.props.composer.thread.id;
      this.llmStore.stopStreaming(threadId);
    }
  },

  /**
   * Override placeholder for LLM threads
   */
  get placeholder() {
    if (this.isLLMThread) {
      return this.isStreaming
        ? _t("AI is responding...")
        : _t("Ask anything...");
    }

    // Use original placeholder for regular mail
    return super.placeholder || _t("Write a message...");
  },

  /**
   * Hide composer avatar/sidebar for LLM threads
   * This removes the empty 42px column on the left
   */
  get showComposerAvatar() {
    if (this.isLLMThread) {
      return false;
    }

    // Use original logic for regular mail
    return super.showComposerAvatar;
  },

  /**
   * Disable composer while streaming (LLM only)
   */
  get isDisabled() {
    if (this.isLLMThread) {
      return (
        this.isStreaming ||
        !this.props.composer.text ||
        !this.props.composer.text.trim()
      );
    }

    // Use original disabled logic for regular mail
    return super.isDisabled;
  },
});
