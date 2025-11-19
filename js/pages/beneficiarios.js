// Página Beneficiários
window.Pages = window.Pages || {};

window.Pages.beneficiarios = {
    getHTML: function() {
        return `
            <div class="doadores-page">
                <div class="doadores-header">
                    <div class="doadores-title">
                        <h1>Beneficiários</h1>
                        <p>Gerencie os beneficiários da organização</p>
                    </div>
                    <button id="open-beneficiario-modal-btn" class="btn btn-primary">
                        <i class="fas fa-plus"></i> Adicionar Beneficiário
                    </button>
                </div>

                <div id="beneficiarios-list-container" class="doadores-list-container">
                    <div class="list-empty-state">
                        <p>Nenhum beneficiário cadastrado</p>
                        <p>Adicione seu primeiro beneficiário</p>
                    </div>
                </div>
            </div>

            <!-- Modal de Beneficiário -->
            <div id="beneficiario-modal" class="modal-backdrop hidden">
                <div class="modal-content modal-large">
                    <div class="modal-header">
                        <h3 id="beneficiario-modal-title">Adicionar Beneficiário</h3>
                        <button id="close-beneficiario-modal-btn" class="modal-close-btn">×</button>
                    </div>
                    <form id="beneficiario-form">
                        <div class="modal-body">
                            <div class="form-group">
                                <label for="beneficiario-nome">Nome *</label>
                                <input type="text" id="beneficiario-nome" required placeholder="Nome completo">
                            </div>
                            <div class="form-group">
                                <label for="beneficiario-email">Email *</label>
                                <input type="email" id="beneficiario-email" required placeholder="email@exemplo.com">
                            </div>
                            <div class="form-grid">
                                <div class="form-group">
                                    <label for="beneficiario-telefone">Telefone *</label>
                                    <input type="tel" id="beneficiario-telefone" required placeholder="(00) 00000-0000">
                                </div>
                                <div class="form-group">
                                    <label for="beneficiario-cpf-cnpj">CPF/CNPJ *</label>
                                    <input type="text" id="beneficiario-cpf-cnpj" required placeholder="000.000.000-00 ou 00.000.000/0000-00">
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="beneficiario-cep">CEP *</label>
                                <div style="display: flex; gap: 8px;">
                                    <input type="text" id="beneficiario-cep" required placeholder="00000-000" style="flex: 1;">
                                    <button type="button" id="buscar-cep-beneficiario-btn" class="btn btn-outline" style="white-space: nowrap;">Buscar</button>
                                </div>
                            </div>
                            <div class="form-grid">
                                <div class="form-group">
                                    <label for="beneficiario-estado">Estado *</label>
                                    <input type="text" id="beneficiario-estado" required placeholder="UF" maxlength="2" readonly>
                                </div>
                                <div class="form-group">
                                    <label for="beneficiario-cidade">Cidade *</label>
                                    <input type="text" id="beneficiario-cidade" required placeholder="Cidade" readonly>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="beneficiario-bairro">Bairro *</label>
                                <input type="text" id="beneficiario-bairro" required placeholder="Bairro" readonly>
                            </div>
                            <div class="form-group">
                                <label for="beneficiario-rua">Rua *</label>
                                <input type="text" id="beneficiario-rua" required placeholder="Rua/Avenida" readonly>
                            </div>
                            <div class="form-grid">
                                <div class="form-group">
                                    <label for="beneficiario-numero">Número *</label>
                                    <input type="text" id="beneficiario-numero" required placeholder="123">
                                </div>
                                <div class="form-group">
                                    <label for="beneficiario-complemento">Complemento</label>
                                    <input type="text" id="beneficiario-complemento" placeholder="Apto, Bloco, etc.">
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" id="cancel-beneficiario-btn" class="btn btn-outline">Cancelar</button>
                            <button type="submit" class="btn btn-primary">Salvar</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
    }
};

