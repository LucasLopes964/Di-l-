document.addEventListener('DOMContentLoaded', async () => {
  const inspectionId = new URLSearchParams(window.location.search).get('id');
  const form = document.getElementById('inspectionEditForm');
  const memberCheckboxes = document.querySelectorAll('input[name="members[]"]');
  const selectedMembersDisplay = document.getElementById('selectedMembers');
  const map = L.map('map').setView([-23.5505, -46.6333], 13);
  let marker = null;

  // Lógica do mapa igual ao de criação
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  map.on('click', function (e) {
    const { lat, lng } = e.latlng;
    if (marker) map.removeLayer(marker);
    marker = L.marker([lat, lng]).addTo(map).bindPopup('Local selecionado').openPopup();
    document.getElementById('latitude').value = lat;
    document.getElementById('longitude').value = lng;
  });

  const enderecoInput = document.getElementById('endereco');
  enderecoInput.addEventListener('blur', async () => {
    const address = enderecoInput.value.trim();
    if (!address) return;
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
      const response = await fetch(url);
      const data = await response.json();
      if (data.length > 0) {
        const { lat, lon } = data[0];
        map.setView([lat, lon], 16);
        if (marker) map.removeLayer(marker);
        marker = L.marker([lat, lon]).addTo(map).bindPopup('Endereço localizado').openPopup();
        document.getElementById('latitude').value = lat;
        document.getElementById('longitude').value = lon;
      } else {
        alert('Endereço não encontrado.');
      }
    } catch (error) {
      alert('Erro ao buscar o endereço.');
    }
  });

  // Seleção de membros (igual ao de criação)
  memberCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      const selected = Array.from(memberCheckboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.parentElement.textContent.trim());
      selectedMembersDisplay.textContent = selected.join(', ') || 'Nenhum membro selecionado';
    });
  });

  // Carrega dados da inspeção
  const res = await fetch(`/api/inspections/getById?id=${inspectionId}`);
  const inspectionArr = await res.json();
  const inspection = Array.isArray(inspectionArr) ? inspectionArr[0] : inspectionArr;

  // Preenche campos do formulário
  form.nome.value = inspection.inspection_title || '';
  form.endereco.value = inspection.address || '';
  form.inicio.value = inspection.starting_date ? inspection.starting_date.substr(0,10) : '';
  form.entrega.value = inspection.due_date ? inspection.due_date.substr(0,10) : '';
  form.edificio.value = inspection.building_type || '';
  form.observacoes.value = inspection.description || '';

  // Se usar coordenador/membros, preencha também

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const inicio = form.inicio.value;
    const entrega = form.entrega.value;

    const hoje = new Date();
    hoje.setHours(0,0,0,0);

    const dataInicio = new Date(inicio);
    const dataEntrega = new Date(entrega);

    if (dataInicio < hoje) {
      alert('A data de início não pode ser no passado.');
      return;
    }
    if (dataEntrega < hoje) {
      alert('A data de entrega não pode ser no passado.');
      return;
    }
    if (dataEntrega < dataInicio) {
      alert('A data de entrega não pode ser anterior à data de início.');
      return;
    }

    const data = {
      inspection_title: form.nome.value,
      address_id: inspection.address_id,
      starting_date: form.inicio.value,
      due_date: form.entrega.value,
      building_type: form.edificio.value,
      description: form.observacoes.value,
      status: inspection.status
      // Adicione outros campos se necessário
    };
    const res = await fetch(`/api/inspections/${inspectionId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (res.ok) {
      alert('Inspeção atualizada!');
      window.location.href = `/inspection?id=${inspectionId}`;
    } else {
      alert('Erro ao atualizar inspeção!');
    }
  });
});