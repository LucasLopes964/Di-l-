// Configurações - Funcionalidades JavaScript

document.addEventListener('DOMContentLoaded', function () {
  const theme = localStorage.getItem('theme') || 'light';
  applyTheme(theme);
  highlightThemeButton(theme);

  // Adiciona eventos nos botões de tema
  document.querySelectorAll('.theme-option').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const selectedTheme = btn.dataset.theme;
      localStorage.setItem('theme', selectedTheme);
      applyTheme(selectedTheme);
      highlightThemeButton(selectedTheme);
    });
  });

  const currentSettings = loadSettings();
  applySettings(currentSettings);
  loadUserData();

  // Eventos
  document.getElementById('save-settings').addEventListener('click', async function () {
    const settings = collectSettings();
    saveSettings(settings);
    await saveUserProfile();
  });

  document.getElementById('reset-settings').addEventListener('click', function () {
    if (confirm('Tem certeza que deseja restaurar as configurações padrão?')) {
      localStorage.removeItem('userSettings');
      applySettings(defaultSettings);
      showNotification('Configurações restauradas', 'success');
    }
  });

  document.getElementById('clear-cache').addEventListener('click', function () {
    if (confirm('Tem certeza que deseja limpar o cache?')) {
      localStorage.clear();
      sessionStorage.clear();
      showNotification('Cache limpo com sucesso!', 'success');
    }
  });

  const cameraToggle = document.getElementById('camera-toggle');
  const microphoneToggle = document.getElementById('microphone-toggle');
  if (cameraToggle) {
    cameraToggle.addEventListener('change', requestMediaPermissions);
  }
  if (microphoneToggle) {
    microphoneToggle.addEventListener('change', requestMediaPermissions);
  }
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

function highlightThemeButton(theme) {
  document.querySelectorAll('.theme-option').forEach(function (btn) {
    btn.classList.toggle('active', btn.dataset.theme === theme);
  });
}

const defaultSettings = {
  theme: 'light',
  username: '',
  email: '',
  camera: true,
  microphone: true,
};

function loadSettings() {
  const savedSettings = localStorage.getItem('userSettings');
  if (savedSettings) {
    return { ...defaultSettings, ...JSON.parse(savedSettings) };
  }
  return defaultSettings;
}

function saveSettings(settings) {
  localStorage.setItem('userSettings', JSON.stringify(settings));
  showNotification('Configurações salvas com sucesso!', 'success');
}

async function saveUserProfile() {
  try {
    const name = document.getElementById('user-name')?.value;
    const currentPassword = document.getElementById('current-password')?.value;
    const newPassword = document.getElementById('new-password')?.value;
    const confirmPassword = document.getElementById('confirm-password')?.value;

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
        name,
        currentPassword,
        newPassword,
      }),
    });

    const result = await response.json();

    if (response.ok) {
      showNotification('Perfil atualizado com sucesso!', 'success');
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

function applySettings(settings) {
  highlightThemeButton(settings.theme);
  applyTheme(settings.theme);

  const usernameInput = document.getElementById('user-name');
  const emailInput = document.getElementById('user-email');
  if (usernameInput) usernameInput.value = settings.username;
  if (emailInput) emailInput.value = settings.email;

  const cameraToggle = document.getElementById('camera-toggle');
  const microphoneToggle = document.getElementById('microphone-toggle');
  if (cameraToggle) cameraToggle.checked = settings.camera;
  if (microphoneToggle) microphoneToggle.checked = settings.microphone;
}

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
    microphone: microphoneToggle?.checked || false,
  };
}

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

async function requestMediaPermissions() {
  try {
    const cameraEnabled = document.getElementById('camera-toggle')?.checked;
    const microphoneEnabled = document.getElementById('microphone-toggle')?.checked;
    if (cameraEnabled || microphoneEnabled) {
      const constraints = {
        video: cameraEnabled,
        audio: microphoneEnabled,
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      stream.getTracks().forEach((track) => track.stop());
      showNotification('Permissões concedidas!', 'success');
    }
  } catch (error) {
    console.error('Erro ao solicitar permissões:', error);
    showNotification('Erro ao acessar dispositivos', 'error');
  }
}

async function loadUserData() {
  try {
    const response = await fetch('/api/user/profile');
    if (response.ok) {
      const userData = await response.json();
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
