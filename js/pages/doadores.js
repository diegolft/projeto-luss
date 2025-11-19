// Página Doadores
window.Pages = window.Pages || {};

window.Pages.doadores = {
    getHTML: function() {
        return `
            <div class="doadores-page">
                <div class="doadores-header">
                    <div class="doadores-title">
                        <h1>Doadores</h1>
                        <p>Gerencie os doadores do sistema</p>
                    </div>
                    <button id="open-doador-modal-btn" class="btn btn-primary">
                        <i class="fas fa-plus"></i> Adicionar Doador
                    </button>
                </div>

                <div id="doadores-list-container" class="doadores-list-container">
                    <div class="list-empty-state">
                        <p>Nenhum doador cadastrado</p>
                        <p>Adicione seu primeiro doador</p>
                    </div>
                </div>
            </div>

            <!-- Modal de Doador -->
            <div id="doador-modal" class="modal-backdrop hidden">
                <div class="modal-content modal-large">
                    <div class="modal-header">
                        <h3 id="doador-modal-title">Adicionar Doador</h3>
                        <button id="close-doador-modal-btn" class="modal-close-btn">×</button>
                    </div>
                    <form id="doador-form">
                        <div class="modal-body">
                            <div class="form-group">
                                <label for="doador-nome">Nome *</label>
                                <input type="text" id="doador-nome" required placeholder="Nome completo">
                            </div>
                            <div class="form-group">
                                <label for="doador-email">Email *</label>
                                <input type="email" id="doador-email" required placeholder="email@exemplo.com">
                            </div>
                            <div class="form-grid">
                                <div class="form-group">
                                    <label for="doador-telefone">Telefone *</label>
                                    <input type="tel" id="doador-telefone" required placeholder="(00) 00000-0000">
                                </div>
                                <div class="form-group">
                                    <label for="doador-cpf-cnpj">CPF/CNPJ *</label>
                                    <input type="text" id="doador-cpf-cnpj" required placeholder="000.000.000-00 ou 00.000.000/0000-00">
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="doador-cep">CEP *</label>
                                <div style="display: flex; gap: 8px;">
                                    <input type="text" id="doador-cep" required placeholder="00000-000" style="flex: 1;">
                                    <button type="button" id="buscar-cep-btn" class="btn btn-outline" style="white-space: nowrap;">Buscar</button>
                                </div>
                            </div>
                            <div class="form-grid">
                                <div class="form-group">
                                    <label for="doador-estado">Estado *</label>
                                    <input type="text" id="doador-estado" required placeholder="UF" maxlength="2" readonly>
                                </div>
                                <div class="form-group">
                                    <label for="doador-cidade">Cidade *</label>
                                    <input type="text" id="doador-cidade" required placeholder="Cidade" readonly>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="doador-bairro">Bairro *</label>
                                <input type="text" id="doador-bairro" required placeholder="Bairro" readonly>
                            </div>
                            <div class="form-group">
                                <label for="doador-rua">Rua *</label>
                                <input type="text" id="doador-rua" required placeholder="Rua/Avenida" readonly>
                            </div>
                            <div class="form-grid">
                                <div class="form-group">
                                    <label for="doador-numero">Número *</label>
                                    <input type="text" id="doador-numero" required placeholder="123">
                                </div>
                                <div class="form-group">
                                    <label for="doador-complemento">Complemento</label>
                                    <input type="text" id="doador-complemento" placeholder="Apto, Bloco, etc.">
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" id="cancel-doador-btn" class="btn btn-outline">Cancelar</button>
                            <button type="submit" class="btn btn-primary">Salvar</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
    }
};

