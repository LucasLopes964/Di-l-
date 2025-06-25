document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('inspectionForm');

  const memberCheckboxes = document.querySelectorAll('input[name="members[]"]');
  const selectedMembersDisplay = document.getElementById('selectedMembers');

  memberCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      const selected = Array.from(memberCheckboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.parentElement.textContent.trim());

      selectedMembersDisplay.textContent = selected.join(', ') || 'Nenhum membro selecionado';
    });
  });

  function updateSelectedMembers() {
    const selected = Array.from(memberCheckboxes)
      .filter(cb => cb.checked)
      .map(cb => cb.parentElement.textContent.trim());
    selectedMembersDisplay.textContent = selected.join(', ') || 'Nenhum membro selecionado';
  }

  memberCheckboxes.forEach(cb => cb.addEventListener('change', updateSelectedMembers));

  updateSelectedMembers();


  const map = L.map('map').setView([-23.5505, -46.6333], 13);
  let marker = null;

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
      console.error('Erro ao buscar endereço:', error);
      alert('Erro ao buscar o endereço.');
    }
  });

  // Validação de datas: início e entrega não podem ser no passado, entrega não pode ser antes do início
  form.addEventListener('submit', async (event) => {
    event.preventDefault(); // <-- PRIMEIRA LINHA

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
      endereco: form.endereco.value,
      starting_date: form.inicio.value,
      due_date: form.entrega.value,
      building_type: form.edificio.value,
      description: form.observacoes.value,
      status: 'em_andamento',
      image_url: null,
      latitude: document.getElementById('latitude').value,
      longitude: document.getElementById('longitude').value,
      coordinator_id: form.coordenador.value,
      project_code_id: document.getElementById('project_code').value,
      members: Array.from(document.querySelectorAll('input[name="members[]"]:checked')).map(cb => cb.value)
    };

    try {
      const response = await fetch('/inspection/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        const modal = document.getElementById('successModal');
        modal.classList.remove('hidden');

        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      } else {
        const errorText = await response.text();
        alert(`Erro ao criar inspeção: ${errorText}`);
        console.error('Erro do servidor:', errorText);
      }
    } catch (error) {
      console.error('Erro ao enviar requisição:', error);
      alert('Erro ao enviar dados. Verifique sua conexão ou o servidor.');
    }
  });
  
});
