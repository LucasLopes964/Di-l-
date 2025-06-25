document.addEventListener('DOMContentLoaded', async () => {
  const inspectionId = new URLSearchParams(window.location.search).get('id');
  if (!inspectionId) return;

  const infoContainer = document.getElementById('info-container');
  const registrosContainer = document.getElementById('registros-container');
  registrosContainer.innerHTML = ''; // Limpa antes de preencher

  // 1. Consulta inspeção para pegar address_id e outros dados
  const inspectionRes = await fetch(`/api/inspections/getById?id=${inspectionId}`);
  const inspection = await inspectionRes.json();

  // 2. Consulta endereço
  let address = 'Não informado';
  
  const addressRes = await fetch(`/api/addresses/getById?id=${inspection[0].address_id}`);
  const addressData = await addressRes.json();
  if (Array.isArray(addressData) && addressData.length > 0 && addressData[0].address) {
    address = addressData[0].address;
  } else if (addressData && addressData.address) {
    address = addressData.address;
  }


  // 1. Consulta o assignment do coordenador pelo ID da inspeção
  const coordAssignRes = await fetch(`/api/coordinator_assignments/getByInspectionId?inspection_id=${inspectionId}`);
  const coordAssignData = await coordAssignRes.json();

  let coordinatorName = 'Não informado';
  if (Array.isArray(coordAssignData) && coordAssignData.length > 0 && coordAssignData[0].user_id) {
    const userRes = await fetch(`/api/users/getById?id=${coordAssignData[0].user_id}`);
    const userData = await userRes.json();
    if (userData && userData.name) {
      coordinatorName = userData.name;
    }
  }

  // 4. Consulta equipes
  let members = [];
  const teamsRes = await fetch(`/api/teams/getByInspectionId?inspection_id=${inspectionId}`);
  let teams = await teamsRes.json();
  if (!Array.isArray(teams)) teams = [];
  for (const team of teams) {
    // 5. Consulta membros de cada equipe
    const teamAssignRes = await fetch(`/api/team_assignments/getByTeamId?team_id=${team.id}`);
    const teamAssignments = await teamAssignRes.json();
    for (const assign of teamAssignments) {
      const memberRes = await fetch(`/api/users/getById?id=${assign.user_id}`);
      const memberData = await memberRes.json();
      if (memberData && memberData.name) {
        members.push(memberData.name);
      }
    }
  }
  // Remove duplicados
  members = [...new Set(members)];

  // Renderiza informações
  infoContainer.innerHTML = `
    <div class="info-item">
      <span>Endereço:</span> ${address}
    </div>
    <div class="info-item">
      <span>Coordenador:</span> ${coordinatorName}
    </div>
    <div class="info-item">
      <span>Membros:</span> ${members.length ? members.join(', ') : 'Não informado'}
    </div>
  `;

  // Função para buscar ambientes
  async function fetchEnvironments() {
    const res = await fetch(`/api/environments?inspection_id=${inspectionId}`);
    if (!res.ok) return [];
    return await res.json();
  }

  // Função para buscar registros de um ambiente
  async function fetchRecords(environmentId) {
    const res = await fetch(`/api/records/getByEnvironmentId?environment_id=${environmentId}`);
    if (!res.ok) return [];
    return await res.json();
  }

  // Função para buscar tags de um registro
  async function fetchTags(recordId) {
    const res = await fetch(`/api/record_tags/getByRecordId?record_id=${recordId}`);
    if (!res.ok) return [];
    return await res.json();
  }

  // Função para buscar nome da tag
  async function fetchTagName(tagId) {
    const res = await fetch(`/api/tags/getById?id=${tagId}`);
    if (!res.ok) return '';
    const tag = await res.json();
    return tag?.name || '';
  }

  // Função para buscar imagem do registro
  async function fetchImage(recordId) {
  const res = await fetch(`/api/images/getByRecordId?record_id=${recordId}`);
  if (!res.ok) return '';
  const imageData = await res.json();
  let imageBuffer = null;
  if (Array.isArray(imageData) && imageData.length > 0) {
    imageBuffer = imageData[0].image_data;
  } else if (imageData && imageData.image_data) {
    imageBuffer = imageData.image_data;
  }
  if (imageBuffer) {
    if (typeof imageBuffer === 'string') {
      return `data:image/png;base64,${imageBuffer}`;
    } else if (imageBuffer.data && Array.isArray(imageBuffer.data)) {
      const uint8Array = new Uint8Array(imageBuffer.data);
      const blob = new Blob([uint8Array], { type: 'image/png' });
      return URL.createObjectURL(blob);
    }
  }
  return '';
}

  // Renderiza ambientes e registros
  async function renderAmbientes(ambientes) {
    registrosContainer.innerHTML = '<h2>Registros</h2>';
    for (const ambiente of ambientes) {
      const records = await fetchRecords(ambiente.id);
      const ambienteDiv = document.createElement('div');
      ambienteDiv.className = 'card';
      ambienteDiv.innerHTML = `<h3>${ambiente.name}</h3>`;
      for (const record of records) {
        const tagsData = await fetchTags(record.id);
        const tagNames = await Promise.all(tagsData.map(async t => await fetchTagName(t.tag_id)));
        const imageUrl = await fetchImage(record.id);
        const recordDiv = document.createElement('div');
        recordDiv.className = 'registro-card';
        recordDiv.innerHTML = `
          <h4>${record.name}</h4>
          ${imageUrl ? `<img src="${imageUrl}" alt="Imagem do registro">` : ''}
          <p>${record.description || ''}</p>
          <div>
            ${tagNames.map(tag => `<span class="tag tag-primary">${tag}</span>`).join(' ')}
          </div>
        `;
        ambienteDiv.appendChild(recordDiv);
      }
      registrosContainer.appendChild(ambienteDiv);
    }
  }

  // Execução principal
  const ambientes = await fetchEnvironments();
  await renderAmbientes(ambientes);

  // Exportar para PDF

  document.getElementById('exportar-btn').addEventListener('click', () => {
  const element = document.getElementById('export-pdf-content');
  const opt = {
    margin:       20, 
    filename:     'inspecao.pdf',
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2, useCORS: true, scrollY: 0 },
    jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
    pagebreak:    { mode: ['avoid-all', 'css', 'legacy'] }
  };
  html2pdf().set(opt).from(element).save();
});

});