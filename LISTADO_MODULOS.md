# Listado de Módulos de la Suite Odoo LLM
# Odoo LLM Suite Module List

EN: This document provides a complete list of the modules included in the Odoo LLM Suite, ordered by their dependencies.
ES: Este documento proporciona una lista completa de los módulos incluidos en la Suite Odoo LLM, ordenados por sus dependencias.

| # | Módulo (Nombre Técnico) | Resumen / Propósito | Dependencias Locales |
| :--- | :--- | :--- | :--- |
| 1 | **Base de Integración LLM** (`llm`) | Integración base con proveedores como Ollama, OpenAI, Replicate y Anthropic. | - |
| 2 | **Editor JSON Web** (`web_json_editor`) | Widget de edición JSON para formularios de Odoo. | - |
| 3 | **Base de Almacén de Vectores** (`llm_store`) | Integración base para proveedores de bases de datos vectoriales. | `llm` |
| 4 | **Herramientas LLM** (`llm_tool`) | Framework para llamadas a funciones y ejecución de herramientas con Odoo. | `llm` |
| 5 | **Gestión de Entrenamiento LLM** (`llm_training`) | Gestión de datasets y trabajos de fine-tuning para modelos. | `llm`, `web_json_editor` |
| 6 | **Conocimiento LLM** (`llm_knowledge`) | Motor RAG: recuperación semántica, parsing de PDFs y soporte multi-almacén. | `llm`, `llm_store` |
| 7 | **Integración Anthropic** (`llm_anthropic`) | Integración del proveedor Anthropic Claude. | `llm`, `llm_tool` |
| 8 | **Servidor MCP LLM** (`llm_mcp_server`) | Expone las herramientas de Odoo a Claude Desktop y otros hosts MCP. | `llm`, `llm_tool`, `web_json_editor` |
| 9 | **Integración Ollama** (`llm_ollama`) | Integración del proveedor Ollama para modelos locales. | `llm`, `llm_tool` |
| 10 | **Chat de IA Fácil** (`llm_thread`) | Gestión central de hilos de chat e interfaz para conversaciones de IA. | `llm`, `llm_tool` |
| 11 | **Herramientas Contables LLM** (`llm_tool_account`) | 18 herramientas de contabilidad para balances, conciliaciones, etc. | `llm_tool` |
| 12 | **Demo de Herramientas LLM** (`llm_tool_demo`) | Ejemplos y demostración del uso de decoradores para herramientas. | `llm_tool` |
| 13 | **Herramientas MIS Builder LLM** (`llm_tool_mis_builder`) | 44 herramientas para MIS Builder: KPIs, análisis de variaciones, etc. | `llm_tool` |
| 14 | **Herramientas de Sitio Web LLM** (`llm_tool_website`) | 31 herramientas para gestionar páginas, SEO y analítica web. | `llm_tool` |
| 15 | **Integración OpenAI** (`llm_openai`) | Integración del proveedor OpenAI (GPT). | `llm`, `llm_tool`, `llm_training` |
| 16 | **Chroma LLM** (`llm_chroma`) | Implementación de almacén vectorial usando Chroma DB. | `llm_knowledge`, `llm_store` |
| 17 | **Conocimiento en Páginas** (`llm_document_page`) | Integra `document.page` con la búsqueda de conocimiento RAG. | `llm_knowledge` |
| 18 | **Automatización de Conocimiento** (`llm_knowledge_automation`) | Sincronización automática y procesamiento de pipelines RAG. | `llm_knowledge` |
| 19 | **RAG LlamaIndex LLM** (`llm_knowledge_llama`) | Fragmentación (chunking) avanzada y parsing usando LlamaIndex. | `llm_knowledge` |
| 20 | **PgVector LLM** (`llm_pgvector`) | Implementación de almacén vectorial usando pgvector en PostgreSQL. | `llm_knowledge`, `llm_store` |
| 21 | **Integración Qdrant LLM** (`llm_qdrant`) | Implementación de almacén vectorial usando Qdrant. | `llm_knowledge`, `llm_store` |
| 22 | **Asistente LLM** (`llm_assistant`) | Asistentes de IA configurables con roles específicos y plantillas de prompts. | `llm`, `llm_thread`, `llm_tool`, `web_json_editor` |
| 23 | **Integración Mistral AI** (`llm_mistral`) | Integración del proveedor Mistral AI. | `llm_openai` |
| 24 | **Generación de Contenido LLM** (`llm_generate`) | API unificada para la generación limpia de contenido estructurado. | `llm`, `llm_thread`, `llm_assistant`, `web_json_editor` |
| 25 | **Integración Letta LLM** (`llm_letta`) | Agentes de IA con estado y memoria persistente. | `llm`, `llm_thread`, `llm_assistant`, `llm_mcp_server` |
| 26 | **Herramientas RAG LLM** (`llm_tool_knowledge`) | Herramientas de llamada a funciones para buscar en la base de conocimiento. | `llm_knowledge`, `llm_tool`, `llm_assistant` |
| 27 | **Importación de Facturas LLM** (`account_invoice_import_llm`) | OCR potenciado por IA para la importación de facturas. | `llm_assistant`, `llm_mistral` |
| 28 | **RAG Mistral LLM** (`llm_knowledge_mistral`) | IA de visión OCR para procesar imágenes en conocimiento. | `llm_knowledge`, `llm_mistral`, `llm_tool` |
| 29 | **Herramienta OCR Mistral** (`llm_tool_ocr_mistral`) | Herramienta de visión independiente para el parseo de documentos. | `llm_mistral`, `llm_tool` |
| 30 | **Integración ComfyICU** (`llm_comfy_icu`) | Generación de medios a través de la API de ComfyICU. | `llm`, `llm_generate` |
| 31 | **Integración ComfyUI** (`llm_comfyui`) | Generación de medios vía ComfyUI local o remoto. | `llm`, `llm_generate` |
| 32 | **Trabajos de Generación LLM** (`llm_generate_job`) | Sistema de colas y gestión de trabajos para generaciones de larga duración. | `llm_thread`, `llm_tool`, `llm_generate`, `web_json_editor` |
| 33 | **Integración Replicate** (`llm_replicate`) | Integración del proveedor Replicate para diversos modelos de IA. | `llm`, `llm_generate` |
| 34 | **Proveedor Fal.ai LLM** (`llm_fal_ai`) | Servicios de generación de imágenes vía fal.ai. | `llm`, `llm_generate_job` |
