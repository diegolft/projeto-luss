// Variáveis globais para controle de inicialização
let financeSystemInitialized = false;
let doadoresSystemInitialized = false;
let beneficiariosSystemInitialized = false;

document.addEventListener('DOMContentLoaded', function() {
    // Navegação entre páginas
    const contentArea = document.getElementById('contentArea');
    
    // Usar event delegation para garantir que os cliques funcionem
    document.addEventListener('click', function(e) {
        const navLink = e.target.closest('.nav-link[data-page]');
        if (navLink) {
            e.preventDefault();
            const pageId = navLink.getAttribute('data-page');
            loadPage(pageId);
        }
    });

    // Função para carregar CSS dinamicamente
    function loadPageCSS(pageId) {
        const existingLink = document.getElementById(`page-css-${pageId}`);
        if (existingLink) return; // CSS já carregado
        
        const link = document.createElement('link');
        link.id = `page-css-${pageId}`;
        link.rel = 'stylesheet';
        link.href = `../css/pages/${pageId}.css`;
        document.head.appendChild(link);
    }

    // Páginas disponíveis
    const pages = {
        inicio: {
            title: 'Início',
            getContent: function() {
                return window.Pages && window.Pages.inicio ? window.Pages.inicio.getHTML() : '';
            }
        },
        doadores: {
            title: 'Doadores',
            getContent: function() {
                return window.Pages && window.Pages.doadores ? window.Pages.doadores.getHTML() : '';
            }
        },
        beneficiarios: {
            title: 'Beneficiários',
            getContent: function() {
                return window.Pages && window.Pages.beneficiarios ? window.Pages.beneficiarios.getHTML() : '';
            }
        },
        categorias: {
            title: 'Categorias',
            getContent: function() {
                return window.Pages && window.Pages.categorias ? window.Pages.categorias.getHTML() : '';
            }
        },
        projetos: {
            title: 'Projetos',
            getContent: function() {
                return window.Pages && window.Pages.projetos ? window.Pages.projetos.getHTML() : '';
            }
        }
    };

    // Páginas antigas (mantidas para compatibilidade temporária)
    const pagesOld = {
        inicio: {
            title: 'Início',
            content: `
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
            `
        },
        doadores: {
            title: 'Doadores',
            content: `
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
            `
        },
        beneficiarios: {
            title: 'Beneficiários',
            content: `
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
            `
        },
        categorias: {
            title: 'Categorias',
            content: '<div class="page-content"><h1>Categorias</h1><p>Gerenciamento de categorias.</p></div>'
        },
        projetos: {
            title: 'Projetos',
            content: '<div class="page-content"><h1>Projetos</h1><p>Gerenciamento de projetos.</p></div>'
        }
    };

    // Função para carregar página
    function loadPage(pageId) {
        const page = pages[pageId];
        if (page && contentArea) {
            // Carrega CSS da página se necessário
            if (pageId !== 'categorias' && pageId !== 'projetos') {
                loadPageCSS(pageId);
            }
            
            // Obtém conteúdo da página
            const content = typeof page.getContent === 'function' ? page.getContent() : (page.content || '');
            contentArea.innerHTML = content;
            
            // Atualiza estado ativo dos links
            const navLinks = document.querySelectorAll('.nav-link[data-page]');
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('data-page') === pageId) {
                    link.classList.add('active');
                }
            });
            
            // Reinicializa sistema financeiro se for a página de início
            if (pageId === 'inicio') {
                financeSystemInitialized = false;
                initFinanceFeatures();
            }
            
            // Reinicializa sistema de doadores se for a página de doadores
            if (pageId === 'doadores') {
                doadoresSystemInitialized = false;
                setTimeout(() => {
                    initDoadoresSystem();
                }, 200);
            }
            
            // Reinicializa sistema de beneficiários se for a página de beneficiários
            if (pageId === 'beneficiarios') {
                beneficiariosSystemInitialized = false;
                setTimeout(() => {
                    initBeneficiariosSystem();
                }, 200);
            }
        }
    }

    // Carrega a página inicial por padrão
    loadPage('inicio');

    // Inicializa funcionalidades financeiras quando a página de início é carregada
    function initFinanceFeatures() {
        // Verifica se os elementos financeiros existem
        setTimeout(() => {
            if (document.getElementById('open-session-modal-btn')) {
                initFinanceSystem();
            }
        }, 200);
    }

    // Observa mudanças no contentArea para reinicializar funcionalidades
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                // Verifica se algum nó adicionado contém elementos financeiros
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) { // Element node
                        if (node.querySelector && node.querySelector('#open-session-modal-btn')) {
                            initFinanceFeatures();
                        }
                    }
                });
            }
        });
    });

    observer.observe(contentArea, { childList: true, subtree: true });

    // Inicializa na primeira carga
    initFinanceFeatures();
    
    // Inicializa funcionalidades de doadores quando a página de doadores é carregada
    function initDoadoresFeatures() {
        setTimeout(() => {
            if (document.getElementById('open-doador-modal-btn')) {
                initDoadoresSystem();
            }
        }, 200);
    }

    // Observa mudanças no contentArea para reinicializar funcionalidades de doadores
    const doadoresObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) {
                        if (node.querySelector && node.querySelector('#open-doador-modal-btn')) {
                            initDoadoresFeatures();
                        }
                    }
                });
            }
        });
    });

    doadoresObserver.observe(contentArea, { childList: true, subtree: true });
    
    // Inicializa na primeira carga
    initDoadoresFeatures();
});

// Sistema Financeiro
function initFinanceSystem() {
    // Evita múltiplas inicializações
    if (financeSystemInitialized) return;
    
    const checkBtn = document.getElementById('open-session-modal-btn');
    if (!checkBtn) return;
    
    financeSystemInitialized = true;
    
    let sessions = {
        'geral': {
            id: 'geral',
            name: 'Geral',
            description: 'Controle financeiro geral',
            budget: null,
            transactions: []
        }
    };
    let currentSession = 'geral';
    let currentPeriod = 'mensal';
    let editingId = null;
    let editingSessionId = null;
    let currentAttachments = [];
    const colors = ['#e91e63', '#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4', '#84cc16'];

    // Elementos
    const openSessionModalBtn = document.getElementById('open-session-modal-btn');
    const openTransactionModalBtn = document.getElementById('open-transaction-modal-btn');
    const sessionModal = document.getElementById('session-modal');
    const closeSessionModalBtn = document.getElementById('close-session-modal-btn');
    const cancelSessionBtn = document.getElementById('cancel-session-btn');
    const sessionForm = document.getElementById('session-form');
    const sessionModalTitle = document.getElementById('session-modal-title');
    const saveSessionBtn = document.getElementById('save-session-btn');
    const sessionNameInput = document.getElementById('session-name');
    const sessionDescInput = document.getElementById('session-description');
    const sessionBudgetInput = document.getElementById('session-budget');
    const transactionModal = document.getElementById('transaction-modal');
    const closeTransactionModalBtn = document.getElementById('close-transaction-modal-btn');
    const cancelTransactionBtn = document.getElementById('cancel-transaction-btn');
    const transactionForm = document.getElementById('transaction-form');
    const transactionModalTitle = document.getElementById('modal-title');
    const addAttachmentBtn = document.getElementById('add-attachment-btn');
    const attachmentsContainer = document.getElementById('attachments-container');
    const tipoInput = document.getElementById('tipo');
    const descricaoInput = document.getElementById('descricao');
    const categoriaInput = document.getElementById('categoria');
    const valorInput = document.getElementById('valor');
    const instituicaoInput = document.getElementById('instituicao');
    const metodoInput = document.getElementById('metodo');
    const dataInput = document.getElementById('data');
    const horaInput = document.getElementById('hora');
    const sessionsContainer = document.getElementById('sessions-container');
    const currentSessionName = document.getElementById('current-session-name');
    const editSessionBtn = document.getElementById('edit-session-btn');
    const deleteSessionBtn = document.getElementById('delete-session-btn');
    const totalEntradasEl = document.getElementById('total-entradas');
    const totalSaidasEl = document.getElementById('total-saidas');
    const saldoTotalEl = document.getElementById('saldo-total');
    const budgetInfoEl = document.getElementById('budget-info');
    const budgetAmountEl = document.getElementById('budget-amount');
    const budgetProgressEl = document.getElementById('budget-progress');
    const transactionsListEl = document.getElementById('transactions-list');
    const pieChartEl = document.getElementById('pie-chart');
    const chartLegendEl = document.getElementById('chart-legend');

    // Event Listeners
    openSessionModalBtn?.addEventListener('click', () => openSessionModal());
    closeSessionModalBtn?.addEventListener('click', closeSessionModal);
    cancelSessionBtn?.addEventListener('click', closeSessionModal);
    sessionForm?.addEventListener('submit', saveSession);
    openTransactionModalBtn?.addEventListener('click', () => openTransactionModal());
    closeTransactionModalBtn?.addEventListener('click', closeTransactionModal);
    cancelTransactionBtn?.addEventListener('click', closeTransactionModal);
    transactionForm?.addEventListener('submit', saveTransaction);
    addAttachmentBtn?.addEventListener('click', addAttachment);

    // Funções Modal Sessão
    function openSessionModal(sessionId = null) {
        editingSessionId = sessionId;
        if (editingSessionId) {
            const session = sessions[editingSessionId];
            sessionModalTitle.textContent = 'Editar Sessão';
            saveSessionBtn.textContent = 'Salvar Alterações';
            sessionNameInput.value = session.name;
            sessionDescInput.value = session.description || '';
            sessionBudgetInput.value = session.budget || '';
        } else {
            sessionModalTitle.textContent = 'Nova Sessão';
            saveSessionBtn.textContent = 'Criar Sessão';
            sessionForm.reset();
        }
        sessionModal.classList.remove('hidden');
    }

    function closeSessionModal() {
        sessionModal.classList.add('hidden');
        editingSessionId = null;
    }

    // Funções Modal Transação
    function openTransactionModal(transactionId = null) {
        editingId = transactionId;
        currentAttachments = [];
        
        if (editingId) {
            const t = sessions[currentSession].transactions.find(t => t.id === editingId);
            transactionModalTitle.textContent = 'Editar Transação';
            tipoInput.value = t.tipo;
            descricaoInput.value = t.descricao;
            categoriaInput.value = t.categoria;
            valorInput.value = t.valor;
            instituicaoInput.value = t.instituicao || '';
            metodoInput.value = t.metodo || '';
            dataInput.value = t.data;
            horaInput.value = t.hora || '';
            currentAttachments = t.attachments || [];
        } else {
            transactionModalTitle.textContent = 'Adicionar Transação';
            transactionForm.reset();
            dataInput.value = new Date().toISOString().split('T')[0];
            horaInput.value = new Date().toTimeString().slice(0, 5);
        }
        
        updateAttachmentsList();
        transactionModal.classList.remove('hidden');
    }

    function closeTransactionModal() {
        transactionModal.classList.add('hidden');
        editingId = null;
        currentAttachments = [];
        attachmentsContainer.innerHTML = '';
    }

    // Funções Sessão
    function saveSession(event) {
        event.preventDefault();
        const name = sessionNameInput.value;
        const description = sessionDescInput.value;
        const budget = parseFloat(sessionBudgetInput.value) || null;

        if (editingSessionId) {
            sessions[editingSessionId].name = name;
            sessions[editingSessionId].description = description;
            sessions[editingSessionId].budget = budget;
        } else {
            const id = 'session-' + new Date().getTime();
            sessions[id] = { id, name, description, budget, transactions: [] };
            selectSession(id);
        }
        
        updateSessionButtons();
        updateDisplay();
        closeSessionModal();
    }

    window.selectSession = (sessionId) => {
        currentSession = sessionId;
        document.querySelectorAll('.btn-session').forEach(btn => btn.classList.remove('active'));
        const btn = document.getElementById(`session-${sessionId}`);
        if (btn) btn.classList.add('active');
        currentSessionName.textContent = sessions[sessionId].name;
        
        if (sessionId === 'geral') {
            editSessionBtn.classList.add('hidden');
            deleteSessionBtn.classList.add('hidden');
        } else {
            editSessionBtn.classList.remove('hidden');
            deleteSessionBtn.classList.remove('hidden');
        }
        updateDisplay();
    }

    window.editCurrentSession = () => {
        if (currentSession !== 'geral') {
            openSessionModal(currentSession);
        }
    }

    window.deleteCurrentSession = () => {
        if (currentSession === 'geral') return;
        if (confirm(`Tem certeza que deseja excluir a sessão "${sessions[currentSession].name}"? Todas as transações serão perdidas.`)) {
            delete sessions[currentSession];
            selectSession('geral');
            updateSessionButtons();
        }
    }

    function updateSessionButtons() {
        sessionsContainer.innerHTML = '';
        Object.values(sessions).forEach(session => {
            const button = document.createElement('button');
            button.id = `session-${session.id}`;
            button.textContent = session.name;
            button.className = 'btn-session';
            if (session.id === currentSession) button.classList.add('active');
            button.onclick = () => selectSession(session.id);
            sessionsContainer.appendChild(button);
        });
    }

    // Funções Transação
    function saveTransaction(event) {
        event.preventDefault();
        const transaction = {
            id: editingId ? editingId : new Date().getTime().toString(),
            tipo: tipoInput.value,
            descricao: descricaoInput.value,
            categoria: categoriaInput.value,
            valor: parseFloat(valorInput.value),
            instituicao: instituicaoInput.value,
            metodo: metodoInput.value,
            data: dataInput.value,
            hora: horaInput.value,
            attachments: [...currentAttachments]
        };
        
        const currentTransactions = sessions[currentSession].transactions;
        if (editingId) {
            const index = currentTransactions.findIndex(t => t.id === editingId);
            currentTransactions[index] = transaction;
        } else {
            currentTransactions.push(transaction);
        }
        
        closeTransactionModal();
        updateDisplay();
    }

    window.editTransaction = (id) => {
        openTransactionModal(id);
    }

    window.deleteTransaction = (id) => {
        if (confirm('Tem certeza que deseja excluir esta transação?')) {
            sessions[currentSession].transactions = sessions[currentSession].transactions.filter(t => t.id !== id);
            updateDisplay();
        }
    }

    // Funções Anexos
    function addAttachment() {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*,application/pdf';
        fileInput.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    currentAttachments.push({ name: file.name, type: file.type, dataUrl: e.target.result });
                    updateAttachmentsList();
                };
                reader.readAsDataURL(file);
            }
        };
        fileInput.click();
    }

    function updateAttachmentsList() {
        attachmentsContainer.innerHTML = '';
        currentAttachments.forEach((file, index) => {
            const fileElement = document.createElement('div');
            fileElement.className = 'attachment-item';
            fileElement.innerHTML = `
                <a href="${file.dataUrl}" target="_blank" title="${file.name}">${file.name}</a>
                <button type="button" onclick="removeAttachment(${index})">×</button>
            `;
            attachmentsContainer.appendChild(fileElement);
        });
    }

    window.removeAttachment = (index) => {
        currentAttachments.splice(index, 1);
        updateAttachmentsList();
    }

    // Funções Visualização
    window.changePeriod = (period) => {
        currentPeriod = period;
        document.querySelectorAll('.period-selector button').forEach(btn => btn.classList.remove('active'));
        const btn = document.getElementById(`btn-${period}`);
        if (btn) btn.classList.add('active');
        updateDisplay();
    }

    function getFilteredTransactions() {
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth();
        const sessionTransactions = sessions[currentSession].transactions;
        
        return sessionTransactions.filter(t => {
            const transactionDate = new Date(t.data + 'T00:00:00');
            const transactionYear = transactionDate.getFullYear();
            const transactionMonth = transactionDate.getMonth();
            
            switch(currentPeriod) {
                case 'mensal':
                    return transactionYear === currentYear && transactionMonth === currentMonth;
                case 'semestral':
                    const currentSemester = Math.floor(currentMonth / 6);
                    const transactionSemester = Math.floor(transactionMonth / 6);
                    return transactionYear === currentYear && transactionSemester === currentSemester;
                case 'anual':
                    return transactionYear === currentYear;
                default:
                    return true;
            }
        });
    }

    function updateDisplay() {
        const filteredTransactions = getFilteredTransactions();
        updateSummary(filteredTransactions);
        updateChart(filteredTransactions);
        updateTransactionsList(filteredTransactions);
    }

    function updateSummary(filteredTransactions) {
        const entradas = filteredTransactions.filter(t => t.tipo === 'entrada').reduce((sum, t) => sum + t.valor, 0);
        const saidas = filteredTransactions.filter(t => t.tipo === 'saida').reduce((sum, t) => sum + t.valor, 0);
        const saldo = entradas - saidas;
        
        totalEntradasEl.textContent = formatCurrency(entradas);
        totalSaidasEl.textContent = formatCurrency(saidas);
        saldoTotalEl.textContent = formatCurrency(saldo);
        saldoTotalEl.className = saldo >= 0 ? 'text-green' : 'text-red';

        const currentSessionData = sessions[currentSession];
        if (currentSessionData.budget) {
            budgetInfoEl.classList.remove('hidden');
            budgetAmountEl.textContent = formatCurrency(currentSessionData.budget);
            const spentPercentage = Math.min((saidas / currentSessionData.budget) * 100, 100);
            budgetProgressEl.style.width = `${spentPercentage}%`;
            if (spentPercentage > 90) {
                budgetProgressEl.style.backgroundColor = '#ef4444';
            } else if (spentPercentage > 75) {
                budgetProgressEl.style.backgroundColor = '#f59e0b';
            } else {
                budgetProgressEl.style.backgroundColor = '#e91e63';
            }
        } else {
            budgetInfoEl.classList.add('hidden');
        }
    }

    function updateTransactionsList(filteredTransactions) {
        transactionsListEl.innerHTML = '';
        
        if (filteredTransactions.length === 0) {
            transactionsListEl.innerHTML = `
                <div class="list-empty-state">
                    <p>Nenhuma transação encontrada</p>
                    <p>Adicione sua primeira transação</p>
                </div>
            `;
            return;
        }
        
        const sorted = filteredTransactions.sort((a, b) => {
            const dateA = new Date(a.data + (a.hora ? 'T' + a.hora : 'T00:00:00'));
            const dateB = new Date(b.data + (b.hora ? 'T' + b.hora : 'T00:00:00'));
            return dateB - dateA;
        });
        
        sorted.forEach(t => {
            const isEntrada = t.tipo === 'entrada';
            const iconClass = isEntrada ? 'icon-green' : 'icon-red';
            const iconSymbol = isEntrada ? '<i class="fas fa-arrow-up"></i>' : '<i class="fas fa-arrow-down"></i>';
            const amountClass = isEntrada ? 'text-green' : 'text-red';
            const sign = isEntrada ? '+' : '-';
            
            const item = document.createElement('div');
            item.className = 'transaction-item';
            item.innerHTML = `
                <div class="transaction-details">
                    <div class="transaction-icon ${iconClass}">${iconSymbol}</div>
                    <div class="transaction-info">
                        <p>${t.descricao}</p>
                        <small>${t.categoria} • ${formatDateTime(t.data, t.hora)}</small>
                        ${t.instituicao ? `<small>${t.instituicao} • ${t.metodo}</small>` : ''}
                        ${t.attachments && t.attachments.length > 0 ? `<small class="attachment-info">${t.attachments.length} anexo(s)</small>` : ''}
                    </div>
                </div>
                <div class="transaction-amount">
                    <strong class="${amountClass}">${sign} ${formatCurrency(t.valor)}</strong>
                    <div class="transaction-actions">
                        <button onclick="editTransaction('${t.id}')">Editar</button>
                        <button class="btn-delete" onclick="deleteTransaction('${t.id}')">Excluir</button>
                    </div>
                </div>
            `;
            transactionsListEl.appendChild(item);
        });
    }

    function updateChart(filteredTransactions) {
        pieChartEl.innerHTML = '<circle cx="150" cy="150" r="120" fill="#f3f4f6" stroke="#e5e7eb" stroke-width="2"/>';
        chartLegendEl.innerHTML = '';

        const saidas = filteredTransactions.filter(t => t.tipo === 'saida');
        if (saidas.length === 0) {
            pieChartEl.innerHTML += '<text x="150" y="155" text-anchor="middle" class="chart-empty-text">Sem dados</text>';
            return;
        }

        const totalSaidas = saidas.reduce((sum, t) => sum + t.valor, 0);
        const categories = saidas.reduce((acc, t) => {
            acc[t.categoria] = (acc[t.categoria] || 0) + t.valor;
            return acc;
        }, {});

        let angleStart = 0;
        let colorIndex = 0;

        Object.entries(categories).forEach(([categoria, valor]) => {
            const percentage = (valor / totalSaidas) * 100;
            const angleSweep = (percentage / 100) * 360;
            const color = colors[colorIndex % colors.length];

            const slice = createPieSlice(angleStart, angleSweep, color);
            pieChartEl.appendChild(slice);

            const legendItem = document.createElement('div');
            legendItem.className = 'legend-item';
            legendItem.innerHTML = `
                <div class="legend-item-name">
                    <div class="legend-color-box" style="background-color: ${color}"></div>
                    <span>${categoria}</span>
                </div>
                <div class="legend-item-value">
                    <strong>${formatCurrency(valor)}</strong>
                    <span>(${percentage.toFixed(1)}%)</span>
                </div>
            `;
            chartLegendEl.appendChild(legendItem);
            
            angleStart += angleSweep;
            colorIndex++;
        });
    }

    function createPieSlice(startAngle, sweepAngle, color) {
        const radius = 120;
        const cx = 150;
        const cy = 150;
        const start = polarToCartesian(cx, cy, radius, startAngle);
        const end = polarToCartesian(cx, cy, radius, startAngle + sweepAngle);
        const largeArcFlag = sweepAngle <= 180 ? "0" : "1";
        const d = ["M", cx, cy, "L", start.x, start.y, "A", radius, radius, 0, largeArcFlag, 1, end.x, end.y, "Z"].join(" ");
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", d);
        path.setAttribute("fill", color);
        path.style.transformOrigin = `${cx}px ${cy}px`;
        return path;
    }

    function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
        var angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
        return {
            x: centerX + (radius * Math.cos(angleInRadians)),
            y: centerY + (radius * Math.sin(angleInRadians))
        };
    }

    function formatCurrency(value) {
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    function formatDateTime(dateStr, timeStr) {
        const date = new Date(dateStr + 'T00:00:00');
        const formattedDate = date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
        return timeStr ? `${formattedDate} às ${timeStr}` : formattedDate;
    }

    // Inicialização
    updateSessionButtons();
    updateDisplay();
    if (dataInput) {
        dataInput.value = new Date().toISOString().split('T')[0];
        horaInput.value = new Date().toTimeString().slice(0, 5);
    }
}

// Sistema de Doadores
function initDoadoresSystem() {
    if (doadoresSystemInitialized) return;
    
    const openDoadorModalBtn = document.getElementById('open-doador-modal-btn');
    if (!openDoadorModalBtn) return;
    
    doadoresSystemInitialized = true;
    
    // Carregar doadores do localStorage
    let doadores = JSON.parse(localStorage.getItem('doadores') || '[]');
    let editingDoadorId = null;
    
    // Elementos
    const doadorModal = document.getElementById('doador-modal');
    const closeDoadorModalBtn = document.getElementById('close-doador-modal-btn');
    const cancelDoadorBtn = document.getElementById('cancel-doador-btn');
    const doadorForm = document.getElementById('doador-form');
    const doadorModalTitle = document.getElementById('doador-modal-title');
    const doadoresListContainer = document.getElementById('doadores-list-container');
    const buscarCepBtn = document.getElementById('buscar-cep-btn');
    
    // Campos do formulário
    const nomeInput = document.getElementById('doador-nome');
    const emailInput = document.getElementById('doador-email');
    const telefoneInput = document.getElementById('doador-telefone');
    const cpfCnpjInput = document.getElementById('doador-cpf-cnpj');
    const cepInput = document.getElementById('doador-cep');
    const estadoInput = document.getElementById('doador-estado');
    const cidadeInput = document.getElementById('doador-cidade');
    const bairroInput = document.getElementById('doador-bairro');
    const ruaInput = document.getElementById('doador-rua');
    const numeroInput = document.getElementById('doador-numero');
    const complementoInput = document.getElementById('doador-complemento');
    
    // Máscaras de input
    function aplicarMascaraTelefone(value) {
        value = value.replace(/\D/g, '');
        if (value.length <= 10) {
            return value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3').replace(/-$/, '');
        } else {
            return value.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3').replace(/-$/, '');
        }
    }
    
    function aplicarMascaraCEP(value) {
        value = value.replace(/\D/g, '');
        return value.replace(/(\d{5})(\d{0,3})/, '$1-$2').replace(/-$/, '');
    }
    
    function aplicarMascaraCPFCNPJ(value) {
        value = value.replace(/\D/g, '');
        if (value.length <= 11) {
            // CPF
            return value.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, '$1.$2.$3-$4').replace(/[-.]$/, '');
        } else {
            // CNPJ
            return value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{0,2})/, '$1.$2.$3/$4-$5').replace(/[-./]$/, '');
        }
    }
    
    // Aplicar máscaras
    telefoneInput?.addEventListener('input', (e) => {
        e.target.value = aplicarMascaraTelefone(e.target.value);
    });
    
    cepInput?.addEventListener('input', (e) => {
        e.target.value = aplicarMascaraCEP(e.target.value);
    });
    
    cpfCnpjInput?.addEventListener('input', (e) => {
        e.target.value = aplicarMascaraCPFCNPJ(e.target.value);
    });
    
    // Buscar CEP via ViaCEP
    async function buscarCEP(cep) {
        const cepLimpo = cep.replace(/\D/g, '');
        if (cepLimpo.length !== 8) {
            alert('CEP deve conter 8 dígitos');
            return;
        }
        
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
            const data = await response.json();
            
            if (data.erro) {
                alert('CEP não encontrado');
                return;
            }
            
            estadoInput.value = data.uf || '';
            cidadeInput.value = data.localidade || '';
            bairroInput.value = data.bairro || '';
            ruaInput.value = data.logradouro || '';
            
            // Focar no campo número após preencher
            numeroInput.focus();
        } catch (error) {
            alert('Erro ao buscar CEP. Tente novamente.');
            console.error('Erro ao buscar CEP:', error);
        }
    }
    
    // Event listeners
    buscarCepBtn?.addEventListener('click', () => {
        if (cepInput.value) {
            buscarCEP(cepInput.value);
        }
    });
    
    cepInput?.addEventListener('blur', () => {
        const cepLimpo = cepInput.value.replace(/\D/g, '');
        if (cepLimpo.length === 8) {
            buscarCEP(cepInput.value);
        }
    });
    
    // Funções do Modal
    function openDoadorModal(doadorId = null) {
        editingDoadorId = doadorId;
        
        if (editingDoadorId) {
            const doador = doadores.find(d => d.id === editingDoadorId);
            if (doador) {
                doadorModalTitle.textContent = 'Editar Doador';
                nomeInput.value = doador.nome || '';
                emailInput.value = doador.email || '';
                telefoneInput.value = doador.telefone || '';
                cpfCnpjInput.value = doador.cpfCnpj || '';
                cepInput.value = doador.cep || '';
                estadoInput.value = doador.estado || '';
                cidadeInput.value = doador.cidade || '';
                bairroInput.value = doador.bairro || '';
                ruaInput.value = doador.rua || '';
                numeroInput.value = doador.numero || '';
                complementoInput.value = doador.complemento || '';
            }
        } else {
            doadorModalTitle.textContent = 'Adicionar Doador';
            doadorForm.reset();
        }
        
        doadorModal.classList.remove('hidden');
    }
    
    function closeDoadorModal() {
        doadorModal.classList.add('hidden');
        editingDoadorId = null;
        doadorForm.reset();
    }
    
    // CRUD
    function saveDoador(event) {
        event.preventDefault();
        
        const doador = {
            id: editingDoadorId || new Date().getTime().toString(),
            nome: nomeInput.value.trim(),
            email: emailInput.value.trim(),
            telefone: telefoneInput.value.trim(),
            cpfCnpj: cpfCnpjInput.value.trim(),
            cep: cepInput.value.trim(),
            estado: estadoInput.value.trim(),
            cidade: cidadeInput.value.trim(),
            bairro: bairroInput.value.trim(),
            rua: ruaInput.value.trim(),
            numero: numeroInput.value.trim(),
            complemento: complementoInput.value.trim()
        };
        
        // Validação básica
        if (!doador.nome || !doador.email || !doador.telefone || !doador.cpfCnpj || 
            !doador.cep || !doador.estado || !doador.cidade || !doador.bairro || 
            !doador.rua || !doador.numero) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }
        
        // Validação de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(doador.email)) {
            alert('Por favor, insira um email válido.');
            return;
        }
        
        if (editingDoadorId) {
            const index = doadores.findIndex(d => d.id === editingDoadorId);
            if (index !== -1) {
                doadores[index] = doador;
            }
        } else {
            doadores.push(doador);
        }
        
        localStorage.setItem('doadores', JSON.stringify(doadores));
        updateDoadoresList();
        closeDoadorModal();
    }
    
    function deleteDoadorLocal(id) {
        if (confirm('Tem certeza que deseja excluir este doador?')) {
            doadores = doadores.filter(d => d.id !== id);
            localStorage.setItem('doadores', JSON.stringify(doadores));
            updateDoadoresList();
        }
    }
    
    function updateDoadoresList() {
        doadoresListContainer.innerHTML = '';
        
        if (doadores.length === 0) {
            doadoresListContainer.innerHTML = `
                <div class="list-empty-state">
                    <p>Nenhum doador cadastrado</p>
                    <p>Adicione seu primeiro doador</p>
                </div>
            `;
            return;
        }
        
        doadores.forEach(doador => {
            const card = document.createElement('div');
            card.className = 'doador-card';
            card.innerHTML = `
                <div class="doador-card-header">
                    <div class="doador-card-title">
                        <h3>${doador.nome}</h3>
                        <span class="doador-badge">${doador.cpfCnpj.length <= 14 ? 'CPF' : 'CNPJ'}</span>
                    </div>
                    <div class="doador-card-actions">
                        <button class="btn-icon" onclick="editDoador('${doador.id}')" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon btn-icon-danger" onclick="deleteDoador('${doador.id}')" title="Excluir">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="doador-card-body">
                    <div class="doador-info-item">
                        <i class="fas fa-envelope"></i>
                        <span>${doador.email}</span>
                    </div>
                    <div class="doador-info-item">
                        <i class="fas fa-phone"></i>
                        <span>${doador.telefone}</span>
                    </div>
                    <div class="doador-info-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${doador.rua}, ${doador.numero}${doador.complemento ? ' - ' + doador.complemento : ''}</span>
                    </div>
                    <div class="doador-info-item">
                        <i class="fas fa-city"></i>
                        <span>${doador.bairro}, ${doador.cidade} - ${doador.estado}</span>
                    </div>
                    <div class="doador-info-item">
                        <i class="fas fa-map-pin"></i>
                        <span>CEP: ${doador.cep}</span>
                    </div>
                </div>
            `;
            doadoresListContainer.appendChild(card);
        });
    }
    
    // Funções globais para os botões
    window.editDoador = (id) => {
        openDoadorModal(id);
    };
    
    window.deleteDoador = (id) => {
        deleteDoadorLocal(id);
    };
    
    // Event listeners
    openDoadorModalBtn?.addEventListener('click', () => openDoadorModal());
    closeDoadorModalBtn?.addEventListener('click', closeDoadorModal);
    cancelDoadorBtn?.addEventListener('click', closeDoadorModal);
    doadorForm?.addEventListener('submit', saveDoador);
    
    // Inicialização
    updateDoadoresList();
}

// Sistema de Beneficiários
function initBeneficiariosSystem() {
    if (beneficiariosSystemInitialized) return;
    
    const openBeneficiarioModalBtn = document.getElementById('open-beneficiario-modal-btn');
    if (!openBeneficiarioModalBtn) return;
    
    beneficiariosSystemInitialized = true;
    
    // Carregar beneficiários do localStorage
    let beneficiarios = JSON.parse(localStorage.getItem('beneficiarios') || '[]');
    let editingBeneficiarioId = null;
    
    // Elementos
    const beneficiarioModal = document.getElementById('beneficiario-modal');
    const closeBeneficiarioModalBtn = document.getElementById('close-beneficiario-modal-btn');
    const cancelBeneficiarioBtn = document.getElementById('cancel-beneficiario-btn');
    const beneficiarioForm = document.getElementById('beneficiario-form');
    const beneficiarioModalTitle = document.getElementById('beneficiario-modal-title');
    const beneficiariosListContainer = document.getElementById('beneficiarios-list-container');
    const buscarCepBeneficiarioBtn = document.getElementById('buscar-cep-beneficiario-btn');
    
    // Campos do formulário
    const nomeInput = document.getElementById('beneficiario-nome');
    const emailInput = document.getElementById('beneficiario-email');
    const telefoneInput = document.getElementById('beneficiario-telefone');
    const cpfCnpjInput = document.getElementById('beneficiario-cpf-cnpj');
    const cepInput = document.getElementById('beneficiario-cep');
    const estadoInput = document.getElementById('beneficiario-estado');
    const cidadeInput = document.getElementById('beneficiario-cidade');
    const bairroInput = document.getElementById('beneficiario-bairro');
    const ruaInput = document.getElementById('beneficiario-rua');
    const numeroInput = document.getElementById('beneficiario-numero');
    const complementoInput = document.getElementById('beneficiario-complemento');
    
    // Máscaras de input (reutilizando funções de doadores)
    function aplicarMascaraTelefone(value) {
        value = value.replace(/\D/g, '');
        if (value.length <= 10) {
            return value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3').replace(/-$/, '');
        } else {
            return value.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3').replace(/-$/, '');
        }
    }
    
    function aplicarMascaraCEP(value) {
        value = value.replace(/\D/g, '');
        return value.replace(/(\d{5})(\d{0,3})/, '$1-$2').replace(/-$/, '');
    }
    
    function aplicarMascaraCPFCNPJ(value) {
        value = value.replace(/\D/g, '');
        if (value.length <= 11) {
            // CPF
            return value.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, '$1.$2.$3-$4').replace(/[-.]$/, '');
        } else {
            // CNPJ
            return value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{0,2})/, '$1.$2.$3/$4-$5').replace(/[-./]$/, '');
        }
    }
    
    // Aplicar máscaras
    telefoneInput?.addEventListener('input', (e) => {
        e.target.value = aplicarMascaraTelefone(e.target.value);
    });
    
    cepInput?.addEventListener('input', (e) => {
        e.target.value = aplicarMascaraCEP(e.target.value);
    });
    
    cpfCnpjInput?.addEventListener('input', (e) => {
        e.target.value = aplicarMascaraCPFCNPJ(e.target.value);
    });
    
    // Buscar CEP via ViaCEP
    async function buscarCEP(cep) {
        const cepLimpo = cep.replace(/\D/g, '');
        if (cepLimpo.length !== 8) {
            alert('CEP deve conter 8 dígitos');
            return;
        }
        
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
            const data = await response.json();
            
            if (data.erro) {
                alert('CEP não encontrado');
                return;
            }
            
            estadoInput.value = data.uf || '';
            cidadeInput.value = data.localidade || '';
            bairroInput.value = data.bairro || '';
            ruaInput.value = data.logradouro || '';
            
            // Focar no campo número após preencher
            numeroInput.focus();
        } catch (error) {
            alert('Erro ao buscar CEP. Tente novamente.');
            console.error('Erro ao buscar CEP:', error);
        }
    }
    
    // Event listeners
    buscarCepBeneficiarioBtn?.addEventListener('click', () => {
        if (cepInput.value) {
            buscarCEP(cepInput.value);
        }
    });
    
    cepInput?.addEventListener('blur', () => {
        const cepLimpo = cepInput.value.replace(/\D/g, '');
        if (cepLimpo.length === 8) {
            buscarCEP(cepInput.value);
        }
    });
    
    // Funções do Modal
    function openBeneficiarioModal(beneficiarioId = null) {
        editingBeneficiarioId = beneficiarioId;
        
        if (editingBeneficiarioId) {
            const beneficiario = beneficiarios.find(b => b.id === editingBeneficiarioId);
            if (beneficiario) {
                beneficiarioModalTitle.textContent = 'Editar Beneficiário';
                nomeInput.value = beneficiario.nome || '';
                emailInput.value = beneficiario.email || '';
                telefoneInput.value = beneficiario.telefone || '';
                cpfCnpjInput.value = beneficiario.cpfCnpj || '';
                cepInput.value = beneficiario.cep || '';
                estadoInput.value = beneficiario.estado || '';
                cidadeInput.value = beneficiario.cidade || '';
                bairroInput.value = beneficiario.bairro || '';
                ruaInput.value = beneficiario.rua || '';
                numeroInput.value = beneficiario.numero || '';
                complementoInput.value = beneficiario.complemento || '';
            }
        } else {
            beneficiarioModalTitle.textContent = 'Adicionar Beneficiário';
            beneficiarioForm.reset();
        }
        
        beneficiarioModal.classList.remove('hidden');
    }
    
    function closeBeneficiarioModal() {
        beneficiarioModal.classList.add('hidden');
        editingBeneficiarioId = null;
        beneficiarioForm.reset();
    }
    
    // CRUD
    function saveBeneficiario(event) {
        event.preventDefault();
        
        const beneficiario = {
            id: editingBeneficiarioId || new Date().getTime().toString(),
            nome: nomeInput.value.trim(),
            email: emailInput.value.trim(),
            telefone: telefoneInput.value.trim(),
            cpfCnpj: cpfCnpjInput.value.trim(),
            cep: cepInput.value.trim(),
            estado: estadoInput.value.trim(),
            cidade: cidadeInput.value.trim(),
            bairro: bairroInput.value.trim(),
            rua: ruaInput.value.trim(),
            numero: numeroInput.value.trim(),
            complemento: complementoInput.value.trim()
        };
        
        // Validação básica
        if (!beneficiario.nome || !beneficiario.email || !beneficiario.telefone || !beneficiario.cpfCnpj || 
            !beneficiario.cep || !beneficiario.estado || !beneficiario.cidade || !beneficiario.bairro || 
            !beneficiario.rua || !beneficiario.numero) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }
        
        // Validação de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(beneficiario.email)) {
            alert('Por favor, insira um email válido.');
            return;
        }
        
        if (editingBeneficiarioId) {
            const index = beneficiarios.findIndex(b => b.id === editingBeneficiarioId);
            if (index !== -1) {
                beneficiarios[index] = beneficiario;
            }
        } else {
            beneficiarios.push(beneficiario);
        }
        
        localStorage.setItem('beneficiarios', JSON.stringify(beneficiarios));
        updateBeneficiariosList();
        closeBeneficiarioModal();
    }
    
    function deleteBeneficiarioLocal(id) {
        if (confirm('Tem certeza que deseja excluir este beneficiário?')) {
            beneficiarios = beneficiarios.filter(b => b.id !== id);
            localStorage.setItem('beneficiarios', JSON.stringify(beneficiarios));
            updateBeneficiariosList();
        }
    }
    
    function updateBeneficiariosList() {
        beneficiariosListContainer.innerHTML = '';
        
        if (beneficiarios.length === 0) {
            beneficiariosListContainer.innerHTML = `
                <div class="list-empty-state">
                    <p>Nenhum beneficiário cadastrado</p>
                    <p>Adicione seu primeiro beneficiário</p>
                </div>
            `;
            return;
        }
        
        beneficiarios.forEach(beneficiario => {
            const card = document.createElement('div');
            card.className = 'doador-card';
            card.innerHTML = `
                <div class="doador-card-header">
                    <div class="doador-card-title">
                        <h3>${beneficiario.nome}</h3>
                        <span class="doador-badge">${beneficiario.cpfCnpj.length <= 14 ? 'CPF' : 'CNPJ'}</span>
                    </div>
                    <div class="doador-card-actions">
                        <button class="btn-icon" onclick="editBeneficiario('${beneficiario.id}')" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon btn-icon-danger" onclick="deleteBeneficiario('${beneficiario.id}')" title="Excluir">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="doador-card-body">
                    <div class="doador-info-item">
                        <i class="fas fa-envelope"></i>
                        <span>${beneficiario.email}</span>
                    </div>
                    <div class="doador-info-item">
                        <i class="fas fa-phone"></i>
                        <span>${beneficiario.telefone}</span>
                    </div>
                    <div class="doador-info-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${beneficiario.rua}, ${beneficiario.numero}${beneficiario.complemento ? ' - ' + beneficiario.complemento : ''}</span>
                    </div>
                    <div class="doador-info-item">
                        <i class="fas fa-city"></i>
                        <span>${beneficiario.bairro}, ${beneficiario.cidade} - ${beneficiario.estado}</span>
                    </div>
                    <div class="doador-info-item">
                        <i class="fas fa-map-pin"></i>
                        <span>CEP: ${beneficiario.cep}</span>
                    </div>
                </div>
            `;
            beneficiariosListContainer.appendChild(card);
        });
    }
    
    // Funções globais para os botões
    window.editBeneficiario = (id) => {
        openBeneficiarioModal(id);
    };
    
    window.deleteBeneficiario = (id) => {
        deleteBeneficiarioLocal(id);
    };
    
    // Event listeners
    openBeneficiarioModalBtn?.addEventListener('click', () => openBeneficiarioModal());
    closeBeneficiarioModalBtn?.addEventListener('click', closeBeneficiarioModal);
    cancelBeneficiarioBtn?.addEventListener('click', closeBeneficiarioModal);
    beneficiarioForm?.addEventListener('submit', saveBeneficiario);
    
    // Inicialização
    updateBeneficiariosList();
}

