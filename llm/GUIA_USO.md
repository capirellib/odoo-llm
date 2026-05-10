# User Guide: LLM Integration Base
# Guía de Uso: Integración Base de LLM

EN: This guide explains how to configure and use the base LLM module to manage AI providers and models.
ES: Esta guía explica cómo configurar y utilizar el módulo base de LLM para gestionar proveedores y modelos de IA.

---

## 1. Configuration of Providers
## 1. Configuración de Proveedores

EN:
1. Navigate to **LLM Integration > Configuration > Providers**.
2. Click **New**.
3. **Provider Name**: Enter a descriptive name (e.g., "OpenAI Production").
4. **Service**: Select the provider type (OpenAI, Anthropic, Ollama, etc.).
5. **Api Key**: Enter your secret API key.
6. **Api Base**: (Optional) For local providers like Ollama, enter the URL (e.g., `http://localhost:11434`).
7. **Save** the record.

ES:
1. Navegue a **Integración LLM > Configuración > Proveedores**.
2. Haga clic en **Nuevo**.
3. **Nombre del Proveedor**: Ingrese un nombre descriptivo (ej: "OpenAI Producción").
4. **Servicio**: Seleccione el tipo de proveedor (OpenAI, Anthropic, Ollama, etc.).
5. **Clave API**: Ingrese su clave API secreta.
6. **Base de API**: (Opcional) Para proveedores locales como Ollama, ingrese la URL (ej: `http://localhost:11434`).
7. **Guarde** el registro.

---

## 2. Fetching Models
## 2. Obtención de Modelos

EN:
1. After saving the provider, click the **Fetch Models** button in the header.
2. Odoo will connect to the provider's API and automatically populate the **Models** list.
3. You can mark specific models as **Default** for different usages (Chat, Embedding).

ES:
1. Después de guardar el proveedor, haga clic en el botón **Obtener Modelos** en el encabezado.
2. Odoo se conectará a la API del proveedor y completará automáticamente la lista de **Modelos**.
3. Puede marcar modelos específicos como **Predeterminados** para diferentes usos (Chat, Embedding).

---

## 3. Testing and Verification
## 3. Pruebas y Verificación

EN:
- Go to **LLM Integration > Models** to see all available models across all providers.
- If the models list is populated, the integration is working correctly.
- You can now proceed to install and use higher-level modules like **LLM Assistant**.

ES:
- Vaya a **Integración LLM > Modelos** para ver todos los modelos disponibles en todos los proveedores.
- Si la lista de modelos está completa, la integración está funcionando correctamente.
- Ahora puede proceder a instalar y utilizar módulos de nivel superior como **LLM Assistant**.
