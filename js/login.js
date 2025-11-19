document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const usuario = document.getElementById('usuario').value;
        const senha = document.getElementById('senha').value;
        
        // Validação básica
        if (usuario.trim() === '' || senha.trim() === '') {
            alert('Por favor, preencha todos os campos.');
            return;
        }
        
        // Login mockado
        const usuarioValido = 'admin';
        const senhaValida = 'admin';
        
        // Exemplo de feedback visual
        const button = loginForm.querySelector('.login-button');
        const originalText = button.textContent;
        button.textContent = 'Entrando...';
        button.disabled = true;
        
        // Validação do login mockado
        setTimeout(() => {
            if (usuario === usuarioValido && senha === senhaValida) {
                // Redireciona para a tela inicial
                window.location.href = 'pages/dashboard.html';
            } else {
                button.textContent = originalText;
                button.disabled = false;
                alert('Usuário ou senha incorretos. Use: admin / admin');
            }
        }, 1000);
    });
    
    // Melhorar a experiência do usuário com Enter
    const inputs = loginForm.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                loginForm.dispatchEvent(new Event('submit'));
            }
        });
    });
});


