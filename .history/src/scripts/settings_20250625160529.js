// Configurações - Funcionalidades JavaScript
document.addEventListener('DOMContentLoaded', function() {
  // Aplica o tema salvo ao carregar
  var theme = localStorage.getItem('theme') || 'light';
  applyTheme(theme);
  // Marca o botão correto como ativo
  document.querySelectorAll('.theme-option').forEach(function(btn) {
    btn.classList.toggle('active', btn.dataset.theme === theme);
    btn.addEventListener('click', function() {
      localStorage.setItem('theme', btn.dataset.theme);
      applyTheme(btn.dataset.theme);
      document.querySelectorAll('.theme-option').forEach(function(b) {
        b.classList.toggle('active', b === btn);
      });
    });
  });
});
function applyTheme(theme) {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark-theme');
    document.body.classList.add('dark-theme');
  } else {
    document.documentElement.classList.remove('dark-theme');
    document.body.classList.remove('dark-theme');
  }
}
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
  if (savedSettings) {
    return { ...defaultSettings, ...JSON.parse(savedSettings) };
  }
  return defaultSettings;
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
  // Tema
  document.querySelectorAll('.theme-option').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.theme === settings.theme);
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
  applyTheme(settings.theme);
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
    background: ${type === 'success' ? '#28A745' : '#DC3545'};
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
applySettings(currentSettings);
// Carregar dados do usuário
loadUserData();