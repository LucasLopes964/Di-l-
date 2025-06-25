// Configurações - Funcionalidades JavaScript
document.addEventListener('DOMContentLoaded', function() {

  // Configurações padrão
  const defaultSettings = {
    theme: 'light',
    username: '',
    email: '',
    camera: true,
    microphone: true
  };

  // Carregar configurações salvas
  function loadSettings() {
    const savedSettings = localStorage.getItem('userSettings');
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    let settings = defaultSettings;
    
    if (savedSettings) {
      settings = { ...defaultSettings, ...JSON.parse(savedSettings) };
    }
    
    // Garantir que o tema seja sempre o que está no localStorage
    settings.theme = savedTheme;
    
    return settings;
  }

  // Salvar configurações
  function saveSettings(settings) {
    localStorage.setItem('userSettings', JSON.stringify(settings));
    showNotification('Configurações salvas com sucesso!', 'success');
  }

  // Salvar perfil do usuário no backend
  async function saveUserProfile() {
    try {
      const name = document.getElementById('user-name')?.value;
      const currentPassword = document.getElementById('current-password')?.value;
      const newPassword = document.getElementById('new-password')?.value;
      const confirmPassword = document.getElementById('confirm-password')?.value;

      // Validações
      if (!name || name.trim() === '') {
        showNotification('Nome é obrigatório', 'error');
        return;
      }

      if (newPassword && newPassword !== confirmPassword) {
        showNotification('Nova senha e confirmação não coincidem', 'error');
        return;
      }

      if (newPassword && newPassword.length < 6) {
        showNotification('Nova senha deve ter pelo menos 6 caracteres', 'error');
        return;
      }

      const response = await fetch('/api/user/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          currentPassword: currentPassword,
          newPassword: newPassword
        })
      });

      const result = await response.json();

      if (response.ok) {
        showNotification('Perfil atualizado com sucesso!', 'success');
        // Limpar campos de senha
        document.getElementById('current-password').value = '';
        document.getElementById('new-password').value = '';
        document.getElementById('confirm-password').value = '';
      } else {
        showNotification(result.error || 'Erro ao atualizar perfil', 'error');
      }
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      showNotification('Erro ao conectar com o servidor', 'error');
    }
  }

  // Aplicar configurações na interface
  function applySettings(settings) {
    // Tema - sincronizar com o localStorage
    const savedTheme = localStorage.getItem('theme') || settings.theme;
    document.querySelectorAll('.theme-option').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.theme === savedTheme);
    });

    // Inputs
    const usernameInput = document.getElementById('user-name');
    const emailInput = document.getElementById('user-email');
    if (usernameInput) usernameInput.value = settings.username;
    if (emailInput) emailInput.value = settings.email;

    // Toggles
    const cameraToggle = document.getElementById('camera-toggle');
    const microphoneToggle = document.getElementById('microphone-toggle');
    if (cameraToggle) cameraToggle.checked = settings.camera;
    if (microphoneToggle) microphoneToggle.checked = settings.microphone;

    // Aplicar tema
    applyTheme(savedTheme);
  }

  // Aplicar tema
  function applyTheme(theme) {
    document.body.classList.toggle('dark-theme', theme === 'dark');
    document.documentElement.classList.toggle('dark-theme', theme === 'dark');
    localStorage.setItem('theme', theme);
    
    // Sincronizar botões do tema
    syncThemeButtons(theme);
  }

  // Sincronizar estado dos botões do tema
  function syncThemeButtons(theme) {
    document.querySelectorAll('.theme-option').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.theme === theme);
    });
  }

  // Coletar configurações da interface
  function collectSettings() {
    const activeTheme = document.querySelector('.theme-option.active');
    const usernameInput = document.getElementById('user-name');
    const emailInput = document.getElementById('user-email');
    const cameraToggle = document.getElementById('camera-toggle');
    const microphoneToggle = document.getElementById('microphone-toggle');

    return {
      theme: activeTheme ? activeTheme.dataset.theme : 'light',
      username: usernameInput?.value || '',
      email: emailInput?.value || '',
      camera: cameraToggle?.checked || false,
      microphone: microphoneToggle?.checked || false
    };
  }

  // Mostrar notificação
  function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'success' ? '#28a745' : '#dc3545'};
      color: white;
      padding: 1rem;
      border-radius: 8px;
      z-index: 1000;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => notification.remove(), 3000);
  }

  // Solicitar permissões de mídia
  async function requestMediaPermissions() {
    try {
      const cameraEnabled = document.getElementById('camera-toggle')?.checked;
      const microphoneEnabled = document.getElementById('microphone-toggle')?.checked;

      if (cameraEnabled || microphoneEnabled) {
        const constraints = {
          video: cameraEnabled,
          audio: microphoneEnabled
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);

        // Parar o stream imediatamente (só estamos testando permissões)
        stream.getTracks().forEach(track => track.stop());

        showNotification('Permissões concedidas!', 'success');
      }
    } catch (error) {
      console.error('Erro ao solicitar permissões:', error);
      showNotification('Erro ao acessar dispositivos', 'error');
    }
  }

  // Event Listeners

  // Seletor de tema
  document.querySelectorAll('.theme-option').forEach(button => {
    button.addEventListener('click', function() {
      document.querySelectorAll('.theme-option').forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      applyTheme(this.dataset.theme);
    });
  });

  // Toggles de mídia
  const cameraToggle = document.getElementById('camera-toggle');
  const microphoneToggle = document.getElementById('microphone-toggle');

  if (cameraToggle) {
    cameraToggle.addEventListener('change', requestMediaPermissions);
  }

  if (microphoneToggle) {
    microphoneToggle.addEventListener('change', requestMediaPermissions);
  }

  // Botão salvar
  document.getElementById('save-settings').addEventListener('click', async function() {
    // Salvar configurações locais (tema, permissões)
    const settings = collectSettings();
    saveSettings(settings);

    // Salvar perfil do usuário (nome, senha)
    await saveUserProfile();
  });

  // Botão restaurar padrões
  document.getElementById('reset-settings').addEventListener('click', function() {
    if (confirm('Tem certeza que deseja restaurar as configurações padrão?')) {
      localStorage.removeItem('userSettings');
      applySettings(defaultSettings);
      showNotification('Configurações restauradas', 'success');
    }
  });

  // Botão limpar cache
  document.getElementById('clear-cache').addEventListener('click', function() {
    if (confirm('Tem certeza que deseja limpar o cache?')) {
      localStorage.clear();
      sessionStorage.clear();
      showNotification('Cache limpo com sucesso!', 'success');
    }
  });

  // Carregar dados do usuário do backend
  async function loadUserData() {
    try {
      const response = await fetch('/api/user/profile');
      if (response.ok) {
        const userData = await response.json();

        // Preencher campos com dados do usuário
        const nameInput = document.getElementById('user-name');
        const emailInput = document.getElementById('user-email');

        if (nameInput) nameInput.value = userData.name || '';
        if (emailInput) emailInput.value = userData.email || '';

        console.log('Dados do usuário carregados:', userData);
      } else {
        console.error('Erro ao carregar dados do usuário:', response.status);
      }
    } catch (error) {
      console.error('Erro ao conectar com o servidor:', error);
    }
  }

  // Inicializar
  const currentSettings = loadSettings();
  
  // Verificar tema atual do localStorage e sincronizar
  const currentTheme = localStorage.getItem('theme') || 'light';
  syncThemeButtons(currentTheme);
  
  applySettings(currentSettings);

  // Carregar dados do usuário
  loadUserData();
});
