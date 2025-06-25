document.addEventListener('DOMContentLoaded', async () => {
  const isAdmin = document.getElementById('isAdmin')?.value === 'true';
  const isCoordinator = document.getElementById('isCoordinator')?.value === 'true';
  const inspectionStatus = document.getElementById('inspectionStatus')?.value;
  const inspection_id = new URLSearchParams(window.location.search).get('id');
  const tagCache = {};

  let allTags = {};
  async function loadAllTags() {
    const res = await fetch('/api/tags/getAll');
    const tagsArr = await res.json();
    allTags = {};
    tagsArr.forEach(tag => {
      allTags[tag.id] = tag.name;
    });
  }

  function createInspectionCard(record, tagNames) {
    const card = document.createElement('div');
    card.className = 'inspection-card';
    card.setAttribute('data-id', record.id);

    card.innerHTML = `
      <div class="card-text">
        <h3>${record.name}</h3>
        <p>${record.description}</p>
        <div class="tags">
          ${tagNames.map(tag => `<span class="tag tag-primary">${tag}</span>`).join('')}
        </div>
      </div>
      <div class="card-image-placeholder">
        <span class="loading-spinner"></span>
      </div>
    `;
    return card;
  }

  let allRecords = [];

  async function getRecords(environment_id, sectionCards) {
    const res = await fetch(`/api/records/getByEnvironmentId?environment_id=${environment_id}`);
    const records = await res.json();
    allRecords = allRecords.concat(records);

    const cardRefs = [];
    for (const rec of records) {
      const tagsRes = await fetch(`/api/record_tags/getByRecordId?record_id=${rec.id}`);
      const tagsData = await tagsRes.json();
      let tagNames = [];
      if (tagsData.length) {
        tagNames = tagsData.map(tagObj => allTags[tagObj.tag_id] || 'Tag desconhecida');
      }
      const card = createInspectionCard(rec, tagNames);
      sectionCards.appendChild(card);
      cardRefs.push({ rec, card, tagNames });
    }

    cardRefs.forEach(async ({ rec, card, tagNames }) => {
      const imageRes = await fetch(`/api/images/getByRecordId?record_id=${rec.id}`);
      const imageData = await imageRes.json();
      let imageUrl = '';
      let imageBuffer = null;
      if (Array.isArray(imageData) && imageData.length > 0) {
        imageBuffer = imageData[0].image_data;
      } else if (imageData && imageData.image_data) {
        imageBuffer = imageData.image_data;
      }
      if (imageBuffer) {
        if (typeof imageBuffer === 'string') {
          imageUrl = `data:image/png;base64,${imageBuffer}`;
        } else if (imageBuffer.data && Array.isArray(imageBuffer.data)) {
          const uint8Array = new Uint8Array(imageBuffer.data);
          const blob = new Blob([uint8Array], { type: 'image/png' });
          imageUrl = URL.createObjectURL(blob);
        }
      }
      const placeholder = card.querySelector('.card-image-placeholder');
      if (imageUrl) {
        placeholder.innerHTML = `<img src="${imageUrl}" alt="Imagem do registro">`;
      } else {
        placeholder.innerHTML = '<span>📷</span>';
      }
      card.onclick = () => openRecordPopup(rec, imageUrl, tagNames);
    });
  }

  async function getEnvironments(inspectionName) {
    const res = await fetch(`/api/environments?inspection_id=${inspection_id}`);
    const environments = await res.json();
    const container = document.querySelector('.container');
    
    // Só declare uma vez!
    let ambientesList = document.getElementById('ambientes-list');
    if (!ambientesList) {
      ambientesList = document.createElement('div');
      ambientesList.id = 'ambientes-list';
      container.appendChild(ambientesList);
    }
    ambientesList.innerHTML = '';

    document.querySelector('.btn.primary').onclick = () => {
      const popup = document.createElement('div');
      popup.className = 'popup-overlay';
      popup.innerHTML = `
        <div class="popup-content" style="width: 420px; min-height: 220px; display: flex; flex-direction: column; justify-content: flex-start; align-items: stretch;">
          <h3 style="margin-top: 0; margin-bottom: 0.1rem; text-align: center;">Criar Ambiente</h3>
          <input type="text" id="novoAmbienteNome" placeholder="Nome do ambiente" class="input" style="margin-bottom: 0.rem; width: 100%;" />
          <div style="display: flex; gap: 0.1rem; width: 100%; justify-content: center;">
            <button id="criarAmbienteConfirmar" class="button button-primary" style="flex:1;">Criar</button>
            <button id="criarAmbienteCancelar" class="button button-outline" style="flex:1;">Cancelar</button>
          </div>
        </div>
      `;
      document.body.appendChild(popup);

      document.getElementById('criarAmbienteCancelar').onclick = () => popup.remove();
      document.getElementById('criarAmbienteConfirmar').onclick = async () => {
        const nome = document.getElementById('novoAmbienteNome').value.trim();
        if (!nome) return alert('Digite um nome!');
        const res = await fetch('/api/environments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: nome, inspection_id })
        });
        if (res.ok) {
          popup.remove();
          await getEnvironments(inspectionName);
          bindInspectionActionButtons();
        } else {
          alert('Erro ao criar ambiente!');
        }
      };
    };
    document.querySelector('.filter-btn').addEventListener('click', filtrarRegistros);

    environments.forEach((env, idx) => {
      const ambienteCard = document.createElement('div');
      ambienteCard.className = 'section ambiente-card';
      ambienteCard.setAttribute('data-env-id', env.id);

      const headerOpen = false;
      ambienteCard.innerHTML = `
        <div class="ambiente-header section-header ${headerOpen ? 'open' : ''}" style="display: flex; align-items: center; justify-content: space-between;">
          <h2 style="margin: 0;">${env.name}</h2>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span class="gear-btn" title="Opções" style="cursor:pointer; font-size: 1.3em;">&#9881;</span>
            <svg width="18" height="10" viewBox="0 0 18 10" fill="none" xmlns="http://www.w3.org/2000/svg" class="${headerOpen ? 'up' : ''}">
              <path d="M16.5 1.25L9 8.75L1.5 1.25" stroke="#75787B" stroke-width="1.5" stroke-linecap="round"
                stroke-linejoin="round" />
            </svg>
          </div>
        </div>
        <div class="section-cards"></div>
      `;
      ambientesList.appendChild(ambienteCard);

      const sectionCards = ambienteCard.querySelector('.section-cards');
      getRecords(env.id, sectionCards).then(() => {
        const addBtn = document.createElement('div');
        addBtn.className = 'add-btn';
        addBtn.innerHTML = `<button>+</button>`;
        addBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          window.location.href = '/criacaoRegistro?id=' + inspection_id;
        });
        sectionCards.appendChild(addBtn);
      });

      if (headerOpen) {
        sectionCards.style.maxHeight = sectionCards.scrollHeight + 'px';
      } else {
        sectionCards.style.maxHeight = '0';
      }

      const gearBtn = ambienteCard.querySelector('.gear-btn');
      gearBtn.onclick = (e) => {
        e.stopPropagation();
        const popup = document.createElement('div');
        popup.className = 'popup-overlay';
        popup.innerHTML = `
          <div class="popup-content" style="width: 370px; min-height: 210px; display: flex; flex-direction: column; align-items: stretch; padding: 2rem 1.5rem;">
            <button class="popup-close button button-outline" title="Fechar" style="align-self: flex-end; width: 2.2rem; height: 2.2rem; padding: 0; font-size: 1.5rem; margin-bottom: 0.5rem;">&times;</button>
            <h3 style="margin-top: 0; margin-bottom: 0.5rem; text-align: center;">Configurações do ambiente</h3>
            <div style="display: flex; flex-direction: column; gap: 0.7rem;">
              <button class="editar-ambiente-btn button button-primary">Editar ambiente</button>
              <button class="deletar-ambiente-btn button" style="background: var(--color-error); color: #fff; border: none;">Deletar ambiente</button>
            </div>
          </div>
        `;
        document.body.appendChild(popup);

        popup.querySelector('.popup-close').onclick = () => popup.remove();
        popup.onclick = e => { if (e.target === popup) popup.remove(); };

        popup.querySelector('.editar-ambiente-btn').onclick = async () => {
          const novoNome = prompt('Novo nome do ambiente:', env.name);
          if (novoNome && novoNome.trim()) {
            const res = await fetch(`/api/environments/${env.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ name: novoNome.trim(), inspection_id })
            });
            if (res.ok) {
              popup.remove();
              await getEnvironments(inspectionName);
              bindInspectionActionButtons();
            } else {
              alert('Erro ao editar ambiente!');
            }
          }
        };

        popup.querySelector('.deletar-ambiente-btn').onclick = async () => {
          const resReg = await fetch(`/api/records/getByEnvironmentId?environment_id=${env.id}`);
          const registros = await resReg.json();
          if (Array.isArray(registros) && registros.length > 0) {
            alert('Não é possível deletar: este ambiente possui registros!');
            return;
          }
          if (confirm('Tem certeza que deseja deletar este ambiente? Esta ação não poderá ser desfeita.')) {
            const resAmb = await fetch(`/api/environments/${env.id}`, { method: 'DELETE' });
            if (resAmb.ok) {
              popup.remove();
              await getEnvironments(inspectionName);
              bindInspectionActionButtons();
            } else {
              alert('Erro ao deletar ambiente!');
            }
          }
        };
      };
    });

    const headers = ambientesList.querySelectorAll('.section-header');
    headers.forEach(function (header) {
      header.addEventListener('click', function (event) {
        const section = this.closest('.section');
        const cards = section.querySelector('.section-cards');
        const svg = this.querySelector('svg');
        this.classList.toggle('open');
        svg.classList.toggle('up');
        if (cards.style.maxHeight && cards.style.maxHeight !== '0px') {
          cards.style.maxHeight = '0';
        } else {
          cards.style.maxHeight = cards.scrollHeight + 'px';
        }
        event.stopPropagation();
      });
    });

    if (!document.getElementById('tag-primary-style')) {
      const style = document.createElement('style');
      style.id = 'tag-primary-style';
      style.innerHTML = `
        .tag-primary {
          background: var(--color-primary, #004c78) !important;
          color: #fff !important;
          border-radius: 4px;
          padding: 0.3rem 0.8rem;
          font-size: 0.8rem;
          font-weight: 700;
          display: inline-block;
          letter-spacing: 0.02em;
          margin-right: 4px;
        }
      `;
      document.head.appendChild(style);
    }
  }

  function openRecordPopup(record, imageUrl, tagNames) {
    // Remove popup anterior se existir
    const oldPopup = document.querySelector('.popup-overlay');
    if (oldPopup) oldPopup.remove();

    // Monta HTML do popup
    const popup = document.createElement('div');
    popup.className = 'popup-overlay';
    popup.innerHTML = `
      <div class="popup-content">
        <button class="popup-close" title="Fechar">&times;</button>
        <img class="popup-image" src="${imageUrl || ''}" alt="Imagem ampliada do registro" onerror="this.style.display='none'">
        <div>
          <h3>${record.name}</h3>
          <p>${record.description || ''}</p>
          <div class="tags" style="justify-content:flex-start; margin-bottom:1rem;">
            ${tagNames.map(tag => `<span class="tag tag-primary">${tag}</span>`).join('')}
          </div>
          <div class="popup-actions">
            <button class="edit-btn">Editar</button>
            <button class="delete-btn">Deletar</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(popup);

    // Fechar popup
    popup.querySelector('.popup-close').onclick = () => popup.remove();
    popup.onclick = e => { if (e.target === popup) popup.remove(); };

    // Editar
    popup.querySelector('.edit-btn').onclick = () => {
      window.location.href = `/editarRegistro?id=${record.id}`;
    };

    // Deletar
    popup.querySelector('.delete-btn').onclick = async () => {
      if (confirm('Tem certeza que deseja deletar este registro?')) {
        try {
          // 1. Deletar registros de tags associados
          await fetch(`/api/record_tags/deleteByRecordId/${record.id}`, { method: 'DELETE' });

          // 2. Deletar imagens associadas
          await fetch(`/api/images/deleteByRecordId/${record.id}`, { method: 'DELETE' });

          // 3. Deletar o registro
          const res = await fetch(`/api/records/${record.id}`, { method: 'DELETE' });

          if (res.ok) {
            alert('Registro deletado com sucesso!');
            popup.remove();
            const card = document.querySelector(`.inspection-card[data-id="${record.id}"]`);
            if (card) card.remove();
          } else {
            alert('Erro ao deletar registro.');
          }
        } catch (err) {
          alert('Erro ao deletar registro: ' + err);
        }
      }
    };
  }

  // Inicia
  await loadAllTags();
  const inspectionName = await getInspectionName();
  await getEnvironments(inspectionName);
  bindInspectionActionButtons();

  async function getInspectionName() {
    const res = await fetch(`/api/inspections/getById?id=${inspection_id}`);
    if (res.ok) {
      const inspectionArr = await res.json();
      const inspection = Array.isArray(inspectionArr) ? inspectionArr[0] : inspectionArr;
      return inspection && inspection.inspection_title ? inspection.inspection_title : '';
    }
    return '';
  }

  async function preencherTags(categoriaId, tagIdsSelecionadas) {
    let tagsRes;
    if (categoriaId) {
      tagsRes = await fetch(`/api/tags?category_id=${categoriaId}`);
    } else {
      tagsRes = await fetch('/api/tags');
    }
    if (!tagsRes.ok) {
      alert('Erro ao buscar tags!');
      return;
    }
    const tags = await tagsRes.json();
    const tagsSelect = document.getElementById('tags');
    tagsSelect.innerHTML = '<option value="" disabled>Selecione</option>';
    tags.forEach(tag => {
      const opt = document.createElement('option');
      opt.value = tag.id;
      opt.textContent = tag.name;
      if (tagIdsSelecionadas && tagIdsSelecionadas.includes(tag.id)) opt.selected = true;
      tagsSelect.appendChild(opt);
    });
  }

  // Adicione o listener apenas uma vez, após garantir que o elemento existe
  const categoriasSelect = document.getElementById('categorias');
  if (categoriasSelect && !categoriasSelect.dataset.listenerAdded) {
    categoriasSelect.addEventListener('change', async function () {
      await preencherTags(this.value, tagIds);
    });
    categoriasSelect.dataset.listenerAdded = "true";
  }

  // Função de filtro
  function filtrarRegistros() {
    const termo = document.querySelector('.search-input').value.trim().toLowerCase();
    document.querySelectorAll('.section-cards').forEach(section => {
      section.querySelectorAll('.inspection-card').forEach(card => {
        const texto = card.textContent.toLowerCase();
        card.style.display = texto.includes(termo) ? '' : 'none';
      });
    });

    // Corrige o max-height dos acordeões abertos após o filtro
    document.querySelectorAll('.section-header.open').forEach(header => {
      const section = header.closest('.section');
      const cards = section.querySelector('.section-cards');
      if (cards) {
        // Usa scrollHeight para garantir que o acordeão fique do tamanho correto
        cards.style.maxHeight = cards.scrollHeight + 'px';
      }
    });
  }

  // Listener do botão filtrar
  document.querySelector('.filter-btn').addEventListener('click', filtrarRegistros);


  document.querySelector('.btn.secondary').onclick = () => {
    window.location.href = `/preview?id=${inspection_id}`;
  }

  // Ao clicar no botão "Criar ambiente"
  document.querySelector('.btn.primary').onclick = () => {
    const popup = document.createElement('div');
    popup.className = 'popup-overlay';
    popup.innerHTML = `
      <div class="popup-content" style="width: 420px; min-height: 220px; display: flex; flex-direction: column; justify-content: flex-start; align-items: stretch;">
        <h3 style="margin-top: 0; margin-bottom: 0.7rem; text-align: center;">Criar Ambiente</h3>
        <input type="text" id="novoAmbienteNome" placeholder="Nome do ambiente" class="input" style="margin-bottom: 0.7rem; width: 100%;" />
        <div style="display: flex; gap: 0.5rem; width: 100%; justify-content: center;">
          <button id="criarAmbienteConfirmar" class="button button-primary" style="flex:1;">Criar</button>
          <button id="criarAmbienteCancelar" class="button button-outline" style="flex:1;">Cancelar</button>
        </div>
      </div>
    `;
    document.body.appendChild(popup);

    document.getElementById('criarAmbienteCancelar').onclick = () => popup.remove();
    document.getElementById('criarAmbienteConfirmar').onclick = async () => {
      const nome = document.getElementById('novoAmbienteNome').value.trim();
      if (!nome) return alert('Digite um nome!');
      const res = await fetch('/api/environments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: nome, inspection_id })
      });
      if (res.ok) {
        popup.remove();
        await getEnvironments(inspectionName); // Recarrega ambientes
      } else {
        alert('Erro ao criar ambiente!');
      }
    };
  };

  function bindInspectionActionButtons() {
    // Editar e deletar (apenas admin)
    const editBtn = document.getElementById('edit-inspection-btn');
    if (editBtn) {
      editBtn.onclick = () => {
        window.location.href = `/inspection/edit?id=${inspection_id}`;
      };
    }
    const deleteBtn = document.getElementById('delete-inspection-btn');
    if (deleteBtn) {
      deleteBtn.onclick = async () => {
        // Apenas confirmação, sem checar ambientes
        if (confirm('Tem certeza que deseja deletar esta inspeção? Esta ação não poderá ser desfeita.')) {
          const resDel = await fetch(`/api/inspections/${inspection_id}`, { method: 'DELETE' });
          if (resDel.ok) {
            alert('Inspeção deletada com sucesso!');
            window.location.href = '/inspections';
          } else {
            alert('Erro ao deletar inspeção!');
          }
        }
      };
    }

    // Ver resumo (apenas coordenador)
    const verResumoBtn = document.getElementById('verResumoBtn');
    if (verResumoBtn) {
      verResumoBtn.onclick = () => {
        window.location.href = `/inspection/summary?id=${inspection_id}`;
      };
    }

    // Alterar status (apenas coordenador)
    const alterarStatusBtn = document.getElementById('alterarStatusBtn');
    if (alterarStatusBtn) {
      alterarStatusBtn.onclick = async () => {
        const novoStatus = inspectionStatus === 'em_andamento' ? 'concluida' : 'em_andamento';
        if (confirm(`Deseja alterar o status da inspeção de ${inspectionStatus.replace('_', ' ')} para ${novoStatus.replace('_', ' ')}?`)) {
          const res = await fetch(`/api/inspections/${inspection_id}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: novoStatus })
          });
          if (res.ok) {
            alert('Status alterado com sucesso!');
            window.location.reload();
          } else {
            alert('Erro ao alterar status!');
          }
        }
      };
    }
  }

  // Chama a função para vincular os botões de ação da inspeção
  bindInspectionActionButtons();
});