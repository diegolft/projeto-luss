// Página Categorias
window.Pages = window.Pages || {};

window.Pages.categorias = {
    getHTML: function() {
        return `
            <div class="categorias-page">
                <div class="categorias-header">
                    <div class="categorias-title">
                        <h1>Categorias</h1>
                        <p>Gerencie as categorias do sistema</p>
                    </div>
                    <button id="open-categoria-modal-btn" class="btn btn-primary">
                        <i class="fas fa-plus"></i> Adicionar Categoria
                    </button>
                </div>

                <div id="categorias-list-container" class="categorias-list-container">
                    <div class="list-empty-state">
                        <p>Nenhuma categoria cadastrada</p>
                        <p>Adicione sua primeira categoria</p>
                    </div>
                </div>
            </div>

            <!-- Modal de Categoria -->
            <div id="categoria-modal" class="modal-backdrop hidden">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 id="categoria-modal-title">Adicionar Categoria</h3>
                        <button id="close-categoria-modal-btn" class="modal-close-btn">×</button>
                    </div>
                    <form id="categoria-form">
                        <div class="modal-body">
                            <div class="form-group">
                                <label for="categoria-nome">Nome *</label>
                                <input type="text" id="categoria-nome" required placeholder="Ex: Doação, Evento, Projeto Social...">
                            </div>
                            <div class="form-group">
                                <label for="categoria-descricao">Descrição</label>
                                <textarea id="categoria-descricao" rows="4" placeholder="Descreva o propósito desta categoria..."></textarea>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" id="cancel-categoria-btn" class="btn btn-outline">Cancelar</button>
                            <button type="submit" class="btn btn-primary">Salvar</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
    }
};

