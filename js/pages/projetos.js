// Página Projetos
window.Pages = window.Pages || {};

window.Pages.projetos = {
    getHTML: function() {
        return `
            <div class="projetos-page">
                <div class="projetos-header">
                    <div class="projetos-title">
                        <h1>Projetos</h1>
                        <p>Gerencie os projetos do sistema</p>
                    </div>
                    <button id="open-projeto-modal-btn" class="btn btn-primary">
                        <i class="fas fa-plus"></i> Adicionar Projeto
                    </button>
                </div>

                <div id="projetos-list-container" class="projetos-list-container">
                    <div class="list-empty-state">
                        <p>Nenhum projeto cadastrado</p>
                        <p>Adicione seu primeiro projeto</p>
                    </div>
                </div>
            </div>

            <!-- Modal de Projeto -->
            <div id="projeto-modal" class="modal-backdrop hidden">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 id="projeto-modal-title">Adicionar Projeto</h3>
                        <button id="close-projeto-modal-btn" class="modal-close-btn">×</button>
                    </div>
                    <form id="projeto-form">
                        <div class="modal-body">
                            <div class="form-group">
                                <label for="projeto-nome">Nome *</label>
                                <input type="text" id="projeto-nome" required placeholder="Ex: Projeto Social, Evento Beneficente...">
                            </div>
                            <div class="form-group">
                                <label for="projeto-descricao">Descrição</label>
                                <textarea id="projeto-descricao" rows="4" placeholder="Descreva o propósito deste projeto..."></textarea>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" id="cancel-projeto-btn" class="btn btn-outline">Cancelar</button>
                            <button type="submit" class="btn btn-primary">Salvar</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
    }
};

