// Página Início - Sistema Financeiro
window.Pages = window.Pages || {};

window.Pages.inicio = {
    getHTML: function() {
        return `
            <div class="finance-page">
                <div class="finance-header">
                    <div class="finance-title">
                        <h1>Controle Financeiro</h1>
                        <p>Gerencie suas finanças de forma simples e eficiente</p>
                    </div>
                </div>

                <div class="finance-controls">
                    <div class="period-selector">
                        <button id="btn-mensal" class="active" onclick="changePeriod('mensal')">Mensal</button>
                        <button id="btn-semestral" onclick="changePeriod('semestral')">Semestral</button>
                        <button id="btn-anual" onclick="changePeriod('anual')">Anual</button>
                    </div>
                </div>

                <div class="summary-grid">
                    <div class="card card-summary">
                        <div class="summary-text">
                            <p>Entradas</p>
                            <strong id="total-entradas" class="text-green">R$ 0,00</strong>
                        </div>
                        <div class="summary-icon icon-green">
                            <i class="fas fa-arrow-up"></i>
                        </div>
                    </div>
                    <div class="card card-summary">
                        <div class="summary-text">
                            <p>Saídas</p>
                            <strong id="total-saidas" class="text-red">R$ 0,00</strong>
                        </div>
                        <div class="summary-icon icon-red">
                            <i class="fas fa-arrow-down"></i>
                        </div>
                    </div>
                    <div class="card card-summary">
                        <div class="summary-text">
                            <p>Saldo</p>
                            <strong id="saldo-total">R$ 0,00</strong>
                        </div>
                        <div class="summary-icon icon-pink">
                            <i class="fas fa-wallet"></i>
                        </div>
                    </div>
                </div>

                <div class="main-content-grid">
                    <div class="card">
                        <h2>Distribuição por Categoria</h2>
                        <div class="chart-container">
                            <svg width="300" height="300" id="pie-chart">
                                <circle cx="150" cy="150" r="120" fill="#f3f4f6" stroke="#e5e7eb" stroke-width="2" />
                                <text x="150" y="155" text-anchor="middle" class="chart-empty-text">Sem dados</text>
                            </svg>
                        </div>
                        <div id="chart-legend" class="chart-legend"></div>
                    </div>

                    <div class="card">
                        <div class="card-header">
                            <h2>Transações</h2>
                            <button id="open-transaction-modal-btn" class="btn btn-primary">
                                <i class="fas fa-plus"></i> Adicionar
                            </button>
                        </div>
                        <div id="transactions-list" class="transactions-list-container">
                            <div class="list-empty-state">
                                <p>Nenhuma transação encontrada</p>
                                <p>Adicione sua primeira transação</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Modal de Detalhes da Transação -->
            <div id="transaction-details-modal" class="modal-backdrop hidden">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Detalhes da Transação</h3>
                        <button id="close-details-modal-btn" class="modal-close-btn">×</button>
                    </div>
                    <div class="modal-body" id="transaction-details-content">
                        <!-- Conteúdo será preenchido dinamicamente -->
                    </div>
                    <div class="modal-footer">
                        <button type="button" id="close-details-btn" class="btn btn-primary">Fechar</button>
                    </div>
                </div>
            </div>

            <!-- Modal de Transação -->
            <div id="transaction-modal" class="modal-backdrop hidden">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 id="modal-title">Adicionar Transação</h3>
                        <button id="close-transaction-modal-btn" class="modal-close-btn">×</button>
                    </div>
                    <form id="transaction-form">
                        <div class="modal-body">
                            <div class="form-group">
                                <label for="titulo">Título *</label>
                                <input type="text" id="titulo" required placeholder="Ex: Doação de João Silva">
                            </div>
                            <div class="form-group">
                                <label for="tipo">Tipo *</label>
                                <select id="tipo" required>
                                    <option value="entrada">Entrada</option>
                                    <option value="saida">Saída</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="doador">Doador</label>
                                <select id="doador">
                                    <option value="">Selecione um doador (opcional)</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="beneficiario">Beneficiário</label>
                                <select id="beneficiario">
                                    <option value="">Selecione um beneficiário (opcional)</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="categoria">Categoria *</label>
                                <select id="categoria" required>
                                    <option value="">Selecione uma categoria</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="projeto">Projeto</label>
                                <select id="projeto">
                                    <option value="">Selecione um projeto (opcional)</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="valor">Valor *</label>
                                <input type="number" id="valor" step="0.01" required placeholder="0,00">
                            </div>
                            <div class="form-group">
                                <label for="descricao">Descrição</label>
                                <textarea id="descricao" rows="3" placeholder="Descrição adicional da transação..."></textarea>
                            </div>
                            <div class="form-group">
                                <label for="data">Data *</label>
                                <input type="date" id="data" required>
                            </div>
                            <div class="form-attachments">
                                <div class="attachments-header">
                                    <label>Anexos</label>
                                    <button type="button" id="add-attachment-btn" class="btn-text">+ Adicionar Anexo</button>
                                </div>
                                <div id="attachments-container" class="attachments-list"></div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" id="cancel-transaction-btn" class="btn btn-outline">Cancelar</button>
                            <button type="submit" class="btn btn-primary">Salvar</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
    }
};

