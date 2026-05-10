# Odoo LLM Suite - Installation & Analysis Guide (Odoo 19.0)
# Suite Odoo LLM - Guía de Instalación y Análisis (Odoo 19.0)

EN: This document provides a detailed breakdown of each module in the Odoo LLM Suite, its purpose, technical requirements, and installation steps for Odoo 19.0.
ES: Este documento proporciona un desglose detallado de cada módulo en la suite Odoo LLM, su propósito, requisitos técnicos y pasos de instalación para Odoo 19.0.

---

## 1. General Installation
## 1. Instalación General

### EN: Prerequisites
### ES: Prerrequisitos

EN:
- Odoo 19.0 (Community or Enterprise).
- Python 3.12+.
- PostgreSQL 16+.

ES:
- Odoo 19.0 (Community o Enterprise).
- Python 3.12+.
- PostgreSQL 16+.

### EN: System Dependencies
### ES: Dependencias del Sistema

EN: Most modules require external Python libraries. Ensure your Docker/Environment has the following installed:
ES: La mayoría de los módulos requieren librerías Python externas. Asegúrese de que su Docker/Entorno tenga instalado lo siguiente:

```bash
pip install pydantic>=2.0.0 mcp anthropic openai ollama-python replicate fal-ai-client qdrant-client chromadb-client pgvector markdown2 markdownify jinja2
```

---

## 2. Core Infrastructure Modules
## 2. Módulos de Infraestructura Core

### `llm` (Base)
EN: **Purpose**: The foundation of the entire suite. It provides the provider abstraction layer, model management, and the enhanced messaging system (`llm_role` index).
ES: **Propósito**: La base de toda la suite. Proporciona la capa de abstracción de proveedores, la gestión de modelos y el sistema de mensajería mejorado (índice `llm_role`).
- **Review**: Critical for all other modules. Version 19.0.1.0.0 verified.
- **Review**: Crítico para todos los demás módulos. Versión 19.0.1.0.0 verificada.

### `llm_assistant`
EN: **Purpose**: Manages AI Assistants. Each assistant has its own system instructions, assigned tools, and prompt templates.
ES: **Propósito**: Gestiona los Asistentes de IA. Cada asistente tiene sus propias instrucciones de sistema, herramientas asignadas y plantillas de prompts.
- **Review**: Includes the logic for prompt orchestration. Verified for Odoo 19.
- **Review**: Incluye la lógica para la orquestación de prompts. Verificado para Odoo 19.

### `llm_thread`
EN: **Purpose**: Handles chat threads. Links AI conversations to any Odoo record (Sale Orders, Tasks, etc.).
ES: **Propósito**: Maneja los hilos de chat. Vincula las conversaciones de IA a cualquier registro de Odoo (Pedidos de venta, Tareas, etc.).
- **Review**: Uses PostgreSQL advisory locks for streaming stability.
- **Review**: Utiliza bloqueos de aviso de PostgreSQL para la estabilidad del streaming.

### `llm_tool`
EN: **Purpose**: The framework for function calling. Allows LLMs to execute Python functions within Odoo safely.
ES: **Propósito**: El marco para la llamada a funciones (function calling). Permite que los LLMs ejecuten funciones Python dentro de Odoo de forma segura.
- **Review**: Uses Pydantic for schema generation. Requires `mcp` library.
- **Review**: Utiliza Pydantic para la generación de esquemas. Requiere la librería `mcp`.

---

## 3. AI Providers (Text & Vision)
## 3. Proveedores de IA (Texto y Visión)

| Module / Módulo | Purpose / Propósito | Dependency / Dependencia |
| --- | --- | --- |
| `llm_openai` | OpenAI GPT-4o / GPT-4o-mini | `openai` |
| `llm_anthropic` | Anthropic Claude 3.5 Sonnet / Haiku | `anthropic` |
| `llm_ollama` | Local LLMs (Llama 3, Mistral, etc.) | `ollama` |
| `llm_mistral` | Mistral AI API | `mistralai` |

---

## 4. Domain-Specific Tool Packs
## 4. Paquetes de Herramientas Específicos de Dominio

### `llm_tool_account` (The CPA Assistant)
EN: **Purpose**: Provides 18 accounting tools: trial balance, tax reports, journal entries, reconciliation, and period close.
ES: **Propósito**: Proporciona 18 herramientas contables: balance de sumas y saldos, informes de impuestos, asientos contables, conciliación y cierre de período.
- **Review**: Depends on `account` and `llm_tool`. Essential for financial AI agents.
- **Review**: Depende de `account` y `llm_tool`. Esencial para agentes de IA financieros.

### `llm_tool_mis_builder`
EN: **Purpose**: Extends MIS Builder with 44 tools for KPI analysis and financial reporting via AI.
ES: **Propósito**: Extiende MIS Builder con 44 herramientas para análisis de KPI e informes financieros mediante IA.
- **Review**: Requires `mis_builder` module.
- **Review**: Requiere el módulo `mis_builder`.

---

## 5. Knowledge & RAG (Retrieval Augmented Generation)
## 5. Conocimiento y RAG (Generación Aumentada por Recuperación)

### `llm_knowledge`
EN: **Purpose**: The RAG engine. Indexes documents into vector stores for the AI to "read" before answering.
ES: **Propósito**: El motor RAG. Indexa documentos en almacenes de vectores para que la IA los "lea" antes de responder.

### `llm_pgvector` / `llm_chroma` / `llm_qdrant`
EN: **Purpose**: Database connectors for vector storage. `llm_pgvector` is recommended for Odoo users as it uses the same PostgreSQL instance.
ES: **Propósito**: Conectores de base de datos para almacenamiento de vectores. Se recomienda `llm_pgvector` para usuarios de Odoo ya que utiliza la misma instancia de PostgreSQL.

---

## 6. Integrations
## 6. Integraciones

### `llm_mcp_server`
EN: **Purpose**: Exposes Odoo tools to external clients like Claude Desktop or Cursor via the Model Context Protocol.
ES: **Propósito**: Expone las herramientas de Odoo a clientes externos como Claude Desktop o Cursor a través del Model Context Protocol.
- **Review**: Highly innovative. Allows managing Odoo from your IDE or Desktop AI.
- **Review**: Altamente innovador. Permite gestionar Odoo desde su IDE o IA de escritorio.

---

## 7. Installation Steps (Detailed)
## 7. Pasos de Instalación (Detallados)

EN:
1. **Add to Addons Path**: Ensure the `odoo-llm` folder is in your Odoo configuration (already done).
2. **Update Dependencies**: Run `pip install -r requirements.txt`.
3. **Update Apps List**: In Odoo, activate developer mode, go to **Apps** -> **Update Apps List**.
4. **Install Core**: Search for `llm` and install it first.
5. **Install Providers**: Install `llm_openai` or `llm_ollama`.
6. **Install Assistant**: Install `llm_assistant`.
7. **Configure Provider**: Go to **LLM** -> **Configuration** -> **Providers**, create one, and click **Fetch Models**.

ES:
1. **Agregar al Addons Path**: Asegúrese de que la carpeta `odoo-llm` esté en su configuración de Odoo (ya realizado).
2. **Actualizar Dependencias**: Ejecute `pip install -r requirements.txt`.
3. **Actualizar Lista de Aplicaciones**: En Odoo, active el modo desarrollador, vaya a **Aplicaciones** -> **Actualizar lista de aplicaciones**.
4. **Instalar Core**: Busque `llm` e instálelo primero.
5. **Instalar Proveedores**: Instale `llm_openai` o `llm_ollama`.
6. **Instalar Asistente**: Instale `llm_assistant`.
7. **Configurar Proveedor**: Vaya a **LLM** -> **Configuración** -> **Proveedores**, cree uno y haga clic en **Fetch Models**.
