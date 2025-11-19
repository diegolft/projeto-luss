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
                    <button id="open-session-modal-btn" class="btn btn-primary">
                        <i class="fas fa-plus"></i> Nova Sessão
                    </button>
                </div>

                <div class="finance-controls">
                    <div class="session-selector">
                        <h3>Sessões:</h3>
                        <div class="session-buttons" id="sessions-container">
                            <button class="btn-session active" id="session-geral" onclick="selectSession('geral')">Geral</button>
                        </div>
                    </div>
                    <div class="period-selector">
                        <button id="btn-mensal" class="active" onclick="changePeriod('mensal')">Mensal</button>
                        <button id="btn-semestral" onclick="changePeriod('semestral')">Semestral</button>
                        <button id="btn-anual" onclick="changePeriod('anual')">Anual</button>
                    </div>
                </div>

                <div id="session-info" class="session-info-bar">
                    <span>Sessão atual: <strong id="current-session-name">Geral</strong></span>
                    <button id="edit-session-btn" class="btn-text" onclick="editCurrentSession()">Editar</button>
                    <button id="delete-session-btn" class="btn-text btn-danger" onclick="deleteCurrentSession()">Excluir</button>
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
                            <div id="budget-info" class="budget-tracker hidden">
                                <small>Orçamento: <span id="budget-amount">R$ 0,00</span></small>
                                <div class="progress-bar-container">
                                    <div id="budget-progress" class="progress-bar"></div>
                                </div>
                            </div>
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

            <!-- Modal de Sessão -->
            <div id="session-modal" class="modal-backdrop hidden">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 id="session-modal-title">Nova Sessão</h3>
                        <button id="close-session-modal-btn" class="modal-close-btn">×</button>
                    </div>
                    <form id="session-form">
                        <div class="modal-body">
                            <div class="form-group">
                                <label for="session-name">Nome da Sessão</label>
                                <input type="text" id="session-name" required placeholder="Ex: Casamento, Viagem, Festa de Aniversário...">
                            </div>
                            <div class="form-group">
                                <label for="session-description">Descrição (opcional)</label>
                                <textarea id="session-description" rows="3" placeholder="Descreva o propósito desta sessão..."></textarea>
                            </div>
                            <div class="form-group">
                                <label for="session-budget">Orçamento Previsto (opcional)</label>
                                <input type="number" id="session-budget" step="0.01" placeholder="0,00">
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" id="cancel-session-btn" class="btn btn-outline">Cancelar</button>
                            <button type="submit" id="save-session-btn" class="btn btn-primary">Criar Sessão</button>
                        </div>
                    </form>
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
                                <label for="tipo">Tipo</label>
                                <select id="tipo">
                                    <option value="entrada">Entrada</option>
                                    <option value="saida">Saída</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="descricao">Descrição</label>
                                <input type="text" id="descricao" required placeholder="Ex: Salário, Aluguel, Compras...">
                            </div>
                            <div class="form-group">
                                <label for="categoria">Categoria</label>
                                <input type="text" id="categoria" required placeholder="Ex: Trabalho, Moradia, Alimentação...">
                            </div>
                            <div class="form-group">
                                <label for="valor">Valor</label>
                                <input type="number" id="valor" step="0.01" required placeholder="0,00">
                            </div>
                            <div class="form-group">
                                <label for="instituicao">Instituição Financeira</label>
                                <select id="instituicao">
                                    <option value="">Selecione uma instituição</option>
                                    <option value="Nubank">Nubank</option>
                                    <option value="Banco do Brasil">Banco do Brasil</option>
                                    <option value="Itaú">Itaú</option>
                                    <option value="Bradesco">Bradesco</option>
                                    <option value="Santander">Santander</option>
                                    <option value="Caixa Econômica">Caixa Econômica</option>
                                    <option value="Inter">Inter</option>
                                    <option value="C6 Bank">C6 Bank</option>
                                    <option value="PicPay">PicPay</option>
                                    <option value="Dinheiro">Dinheiro</option>
                                    <option value="Outro">Outro</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="metodo">Método de Pagamento</label>
                                <select id="metodo">
                                    <option value="">Selecione um método</option>
                                    <option value="Cartão de Débito">Cartão de Débito</option>
                                    <option value="Cartão de Crédito">Cartão de Crédito</option>
                                    <option value="PIX">PIX</option>
                                    <option value="TED/DOC">TED/DOC</option>
                                    <option value="Boleto">Boleto</option>
                                    <option value="Dinheiro">Dinheiro</option>
                                    <option value="Depósito">Depósito</option>
                                    <option value="Transferência">Transferência</option>
                                </select>
                            </div>
                            <div class="form-grid">
                                <div class="form-group">
                                    <label for="data">Data</label>
                                    <input type="date" id="data" required>
                                </div>
                                <div class="form-group">
                                    <label for="hora">Hora</label>
                                    <input type="time" id="hora">
                                </div>
                            </div>
                            <div class="form-attachments">
                                <div class="attachments-header">
                                    <label>Anexos (Notas Fiscais)</label>
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

