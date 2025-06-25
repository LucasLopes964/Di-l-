const userId = document.getElementById('userId')?.value;

var map = L.map('map').setView([-23.55052, -46.633308], 12);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);


async function carregarInspecoesUsuario(userId) {
  let atribuicoes = await fetch(`/api/team_assignments/getByUserId?user_id=${userId}`).then(r => r.json());
  if (!Array.isArray(atribuicoes)) {
    atribuicoes = atribuicoes ? [atribuicoes] : [];
  }


  const inspectionIds = new Set();
  for (const atribuicao of atribuicoes) {
    const team = await fetch(`/api/teams/getById?id=${atribuicao.team_id}`).then(r => r.json());
    if (Array.isArray(team)) {
      team.forEach(e => inspectionIds.add(e.inspection_id));
    } else if (team && team.inspection_id) {
      inspectionIds.add(team.inspection_id);
    }
  }

  const inspectionsArr = [];
  await Promise.all([...inspectionIds].map(async (id) => {
    if (!id) return;
    const resp = await fetch(`/api/inspections/getById?id=${id}`);
    if (resp.ok) {
      const data = await resp.json();
      if (Array.isArray(data)) {
        data.forEach(i => inspectionsArr.push(i));
      } else if (data) {
        inspectionsArr.push(data);
      }
    }
  }));

  const coordenadas = [];
  await Promise.all(inspectionsArr.map(async (inspection) => {
    if (!inspection.address_id) return;
    const resp = await fetch(`/api/addresses/getById?id=${inspection.address_id}`);
    if (resp.ok) {
      const endereco = await resp.json();
      if (endereco && endereco.latitude && endereco.longitude) {
        coordenadas.push({
          inspection_id: inspection.id,
          inspection_title: inspection.inspection_title,
          latitude: endereco.latitude,
          longitude: endereco.longitude,
          endereco
        });
        
      }
    }
  }));

  coordenadas.forEach(coord => {
  const marker = L.marker([coord.latitude, coord.longitude]).addTo(map)
    .bindPopup(coord.inspection_title);

  const inspection = inspectionsArr.find(i => i.id === coord.inspection_id);

  marker.on('click', function() {
    mostrarCardInspecao(inspection, coord.endereco);
  });
});
}


carregarInspecoesUsuario(userId);


function mostrarCardInspecao(inspection, endereco) {
  const card = document.getElementById('inspection-card');
  if (!card) return; 
  card.innerHTML = `
    <h2>${inspection.inspection_title || inspection.name || '-'}</h2>
    <div class="info"><strong>Endereço:</strong> ${endereco?.address || '-'}</div>
    <div class="info"><strong>Status:</strong> ${inspection.status || '-'}</div>
    <div class="info"><strong>Data de início:</strong> ${inspection.starting_date ? new Date(inspection.starting_date).toLocaleDateString() : '-'}</div>
    <div class="info"><strong>Prazo:</strong> ${inspection.due_date ? new Date(inspection.due_date).toLocaleDateString() : '-'}</div>
    <a class="btn" href="/inspection?id=${inspection.id}">Ver detalhes</a>
  `;
  card.style.display = 'block';
}
