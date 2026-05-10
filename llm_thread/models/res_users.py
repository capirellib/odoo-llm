from odoo import models


class ResUsers(models.Model):
    _inherit = "res.users"

    def _init_messaging(self, store):
        """Extend init_messaging to include LLM threads following Odoo 19 patterns.

        EN: Load user's recent LLM threads into the store during messaging initialization.
            Uses store.add() with as_thread=True to leverage the standard Odoo 19 Store API,
            which delegates to _thread_to_store() on the llm.thread model.

        ES: Cargar los hilos LLM recientes del usuario en el store durante la inicialización
            de mensajería. Usa store.add() con as_thread=True para aprovechar la API estándar
            del Store de Odoo 19, que delega a _thread_to_store() en el modelo llm.thread.
        """
        super()._init_messaging(store)

        # Load user's recent LLM threads (similar to how discuss.channel works)
        llm_threads = self.env["llm.thread"].search(
            [("user_id", "=", self.id), ("active", "=", True)],
            order="write_date DESC",
        )

        # Use standard Store.add() with as_thread=True — this calls _thread_to_store()
        if llm_threads:
            store.add(llm_threads, as_thread=True)
