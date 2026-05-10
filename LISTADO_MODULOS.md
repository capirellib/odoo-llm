# Listado de Módulos de la Suite Odoo LLM / Odoo LLM Suite Module List

EN: This document provides a complete list of the modules included in the Odoo LLM Suite, mapped for the Odoo 19 migration.
ES: Este documento proporciona una lista completa de los módulos incluidos en la Suite Odoo LLM, mapeados para la migración a Odoo 19.

EN:

| Module (Technical Name) | Summary / Purpose | Dependencies |
| --- | --- | --- |
| **LLM Integration Base** (llm) | Integration with various LLM providers like Ollama, OpenAI, Replicate and Anthropic | - |
| **Web JSON Editor** (web_json_editor) | JSON Editor widget for Odoo | - |
| **LLM Vector Store Base** (llm_store) | Integration with various vector database providers for LLM applications | llm |
| **LLM Tool** (llm_tool) | Function calling and tool execution for LLM models to interact with Odoo | llm |
| **LLM Training Management** (llm_training) | Manage LLM fine-tuning datasets and training jobs | llm, web_json_editor |
| **LLM Knowledge** (llm_knowledge) | RAG vector search: AI knowledge base with semantic document retrieval, embeddings, PDF parsing, and multi-store support (Qdrant, pgvector, Chroma) | llm, llm_store |
| **Anthropic LLM Integration** (llm_anthropic) | Anthropic Claude provider integration for LLM module | llm, llm_tool |
| **LLM MCP Server** (llm_mcp_server) | MCP server exposing Odoo LLM tools to Claude Desktop and other MCP hosts | llm, llm_tool, web_json_editor |
| **Ollama LLM Integration** (llm_ollama) | Ollama provider integration for LLM module | llm, llm_tool |
| **LLM Assistant** (llm_assistant) | LLM/AI Assistant module with prompt templates for Odoo | llm, llm_thread, llm_tool, web_json_editor |
| **LLM Tool Account** (llm_tool_account) | 18 AI-powered accounting tools for CPAs: trial balance, tax reports, journal entries, reconciliation, payments, and period close | llm_tool |
| **LLM Tool Demo** (llm_tool_demo) | Demonstration of @llm_tool decorator usage | llm_tool |
| **LLM Tool MIS Builder** (llm_tool_mis_builder) | 44 AI-powered tools for MIS Builder: create KPIs, configure periods, compute reports, drill down, and analyze variances through natural language | llm_tool |
| **LLM Tool Website** (llm_tool_website) | 31 AI-powered website tools: pages, content, media, menus, SEO, redirects, visitor analytics, and configuration | llm_tool |
| **OpenAI LLM Integration** (llm_openai) | OpenAI provider integration for LLM module | llm, llm_tool, llm_training |
| **LLM Chroma** (llm_chroma) | Vector store integration with Chroma for LLM features | llm, llm_knowledge, llm_store |
| **LLM Knowledge Integration for Document Pages** (llm_document_page) | Integrate document.page with LLM RAG for knowledge base search | llm_knowledge |
| **LLM Knowledge Automation** (llm_knowledge_automation) | Auto-sync knowledge base: keeps AI current with real-time data updates, domain filters, and automated RAG pipeline processing | llm_knowledge |
| **LLM RAG LlamaIndex** (llm_knowledge_llama) | Advanced RAG chunking: LlamaIndex markdown parsing, semantic chunking, structured document splitting for better AI retrieval accuracy | llm_knowledge |
| **LLM PgVector** (llm_pgvector) | Vector field and search capabilities using pgvector | llm, llm_knowledge, llm_store |
| **LLM Qdrant Integration** (llm_qdrant) | Integrates Qdrant vector store with the Odoo LLM framework. | llm_knowledge, llm_store |
| **Mistral AI LLM Integration** (llm_mistral) | Mistral AI provider integration for LLM module | llm_openai |
| **LLM Content Generation** (llm_generate) | Content generation capabilities for LLM models | llm, llm_thread, llm_assistant, web_json_editor |
| **Letta LLM Integration** (llm_letta) | Letta agent-based AI with persistent memory and MCP tools | llm, llm_thread, llm_assistant, llm_mcp_server |
| **LLM Tool RAG** (llm_tool_knowledge) | RAG tools for AI assistants: semantic search, knowledge retrieval, source citations, and function calling for LLM chat integration | llm_knowledge, llm_tool, llm_assistant |
| **Account Invoice Import LLM** (account_invoice_import_llm) | AI-powered invoice data extraction with OCR for OCA account_invoice_import | llm_assistant, llm_mistral |
| **LLM RAG Mistral** (llm_knowledge_mistral) | OCR vision AI: extract text from images, receipts, handwriting, and scanned documents using Mistral vision models | llm_knowledge, llm_mistral, llm_tool |
| **Mistral OCR Tool** (llm_tool_ocr_mistral) | Extract text from images and PDFs using Mistral AI vision models | llm_mistral, llm_tool |
| **LLM ComfyICU Integration** (llm_comfy_icu) | Integration with ComfyICU API for media generation | llm, llm_generate |
| **LLM ComfyUI Integration** (llm_comfyui) | Integration with ComfyUI API for media generation | llm, llm_generate |
| **LLM Generate Job** (llm_generate_job) | Generation Job Management and Queue System for LLM Providers | llm_thread, llm_tool, llm_generate, web_json_editor |
| **Replicate LLM Integration** (llm_replicate) | Replicate provider integration for LLM module | llm, llm_generate |
| **LLM - Fal.ai Provider** (llm_fal_ai) | Integration with the fal.ai API for LLM generation services | llm, llm_generate_job |


ES:

| Módulo (Nombre Técnico) | Resumen / Propósito | Dependencias |
| --- | --- | --- |
| **Base de Integración LLM** (llm) | Integración con varios proveedores de LLM como Ollama, OpenAI, Replicate y Anthropic | - |
| **Editor JSON Web** (web_json_editor) | Widget de editor JSON para Odoo | - |
| **Base de Almacén de Vectores LLM** (llm_store) | Integración con varios proveedores de bases de datos vectoriales para aplicaciones LLM | llm |
| **Herramienta LLM** (llm_tool) | Llamadas a funciones y ejecución de herramientas para que los modelos LLM interactúen con Odoo | llm |
| **Gestión de Entrenamiento LLM** (llm_training) | Gestión de conjuntos de datos de ajuste fino y trabajos de entrenamiento de LLM | llm, web_json_editor |
| **Conocimiento LLM** (llm_knowledge) | Búsqueda vectorial RAG: base de conocimientos de IA con recuperación semántica de documentos, embeddings, análisis de PDF y soporte multi-almacén (Qdrant, pgvector, Chroma) | llm, llm_store |
| **Integración Anthropic LLM** (llm_anthropic) | Integración del proveedor Anthropic Claude para el módulo LLM | llm, llm_tool |
| **Servidor MCP LLM** (llm_mcp_server) | Servidor MCP que expone las herramientas de Odoo LLM a Claude Desktop y otros hosts MCP | llm, llm_tool, web_json_editor |
| **Integración Ollama LLM** (llm_ollama) | Integración del proveedor Ollama para el módulo LLM | llm, llm_tool |
| **Asistente LLM** (llm_assistant) | Módulo de asistente de IA/LLM con plantillas de prompts para Odoo | llm, llm_thread, llm_tool, web_json_editor |
| **Herramientas Contables LLM** (llm_tool_account) | 18 herramientas contables potenciadas por IA: balance de sumas y saldos, informes fiscales, asientos contables, conciliación, pagos y cierre de periodo | llm_tool |
| **Demo de Herramientas LLM** (llm_tool_demo) | Demostración del uso del decorador @llm_tool | llm_tool |
| **Herramientas LLM MIS Builder** (llm_tool_mis_builder) | 44 herramientas para MIS Builder: crear KPIs, configurar periodos, computar informes, desglose y análisis de variaciones mediante lenguaje natural | llm_tool |
| **Herramientas de Sitio Web LLM** (llm_tool_website) | 31 herramientas para sitios web: páginas, contenido, medios, menús, SEO, redirecciones, analítica de visitantes y configuración | llm_tool |
| **Integración OpenAI LLM** (llm_openai) | Integración del proveedor OpenAI para el módulo LLM | llm, llm_tool, llm_training |
| **LLM Chroma** (llm_chroma) | Integración de almacén vectorial con Chroma para funciones LLM | llm, llm_knowledge, llm_store |
| **Integración de Conocimiento para Páginas de Documentos** (llm_document_page) | Integra document.page con LLM RAG para búsqueda en la base de conocimientos | llm_knowledge |
| **Automatización de Conocimiento LLM** (llm_knowledge_automation) | Sincronización automática de base de conocimientos: mantiene la IA actualizada con datos en tiempo real, filtros de dominio y procesamiento automatizado de RAG | llm_knowledge |
| **LLM RAG LlamaIndex** (llm_knowledge_llama) | Fragmentación RAG avanzada: análisis markdown de LlamaIndex, fragmentación semántica, división estructurada de documentos para mejor precisión | llm_knowledge |
| **LLM PgVector** (llm_pgvector) | Capacidades de búsqueda y campos vectoriales usando pgvector | llm, llm_knowledge, llm_store |
| **Integración LLM Qdrant** (llm_qdrant) | Integra el almacén vectorial Qdrant con el framework Odoo LLM | llm_knowledge, llm_store |
| **Integración Mistral AI LLM** (llm_mistral) | Integración del proveedor Mistral AI para el módulo LLM | llm_openai |
| **Generación de Contenido LLM** (llm_generate) | Capacidades de generación de contenido para modelos LLM | llm, llm_thread, llm_assistant, web_json_editor |
| **Integración Letta LLM** (llm_letta) | IA basada en agentes Letta con memoria persistente y herramientas MCP | llm, llm_thread, llm_assistant, llm_mcp_server |
| **Herramienta RAG LLM** (llm_tool_knowledge) | Herramientas RAG para asistentes de IA: búsqueda semántica, recuperación de conocimiento, citas de fuentes y llamadas a funciones | llm_knowledge, llm_tool, llm_assistant |
| **Importación de Facturas con LLM** (account_invoice_import_llm) | Extracción de datos de facturas con IA y OCR para account_invoice_import de la OCA | llm_assistant, llm_mistral |
| **LLM RAG Mistral** (llm_knowledge_mistral) | IA de visión OCR: extraer texto de imágenes, recibos, manuscritos y documentos escaneados usando modelos de visión de Mistral | llm_knowledge, llm_mistral, llm_tool |
| **Herramienta OCR Mistral** (llm_tool_ocr_mistral) | Extraer texto de imágenes y PDFs usando modelos de visión de Mistral AI | llm_mistral, llm_tool |
| **Integración LLM ComfyICU** (llm_comfy_icu) | Integración con la API de ComfyICU para generación de medios | llm, llm_generate |
| **Integración LLM ComfyUI** (llm_comfyui) | Integración con la API de ComfyUI para generación de medios | llm, llm_generate |
| **Trabajo de Generación LLM** (llm_generate_job) | Gestión de trabajos de generación y sistema de colas para proveedores LLM | llm_thread, llm_tool, llm_generate, web_json_editor |
| **Integración Replicate LLM** (llm_replicate) | Integración del proveedor Replicate para el módulo LLM | llm, llm_generate |
| **Proveedor LLM - Fal.ai** (llm_fal_ai) | Integración con la API de fal.ai para servicios de generación LLM | llm, llm_generate_job |
