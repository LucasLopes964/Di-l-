document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const recordId = urlParams.get('id');
  if (!recordId) {
    alert('Registro não encontrado!');
    return;
  }

  const res = await fetch(`/api/records/${recordId}`);
  if (!res.ok) {
    alert('Registro não encontrado!');
    return;
  }
  const registro = await res.json();

  const ambienteResInsp = await fetch(`/api/environments/getInspectionId?environment_id=${registro.environment_id}`);
  if (!ambienteResInsp.ok) {
    alert('Ambiente do registro não encontrado!');
    return;
  }
  const ambiente = await ambienteResInsp.json();
  const inspectionId = ambiente.inspection_id;

  const ambientesRes = await fetch(`/api/environments?inspection_id=${inspectionId}`);
  const ambientes = await ambientesRes.json();
  const ambientesSelect = document.getElementById('ambientes');
  ambientesSelect.innerHTML = '<option value="" disabled>Selecione</option>';
  ambientes.forEach(amb => {
    const opt = document.createElement('option');
    opt.value = amb.id;
    opt.textContent = amb.name;
    if (String(amb.id) === String(registro.environment_id)) opt.selected = true;
    ambientesSelect.appendChild(opt);
  });

  const categoriasRes = await fetch('/api/tag_categories');
  const categorias = await categoriasRes.json();
  const categoriasSelect = document.getElementById('categoriasTags');
  categoriasSelect.innerHTML = '<option value="" disabled>Selecione</option>';
  categorias.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat.id;
    opt.textContent = cat.name;
    if (String(cat.id) === String(registro.categoria_id)) opt.selected = true;
    categoriasSelect.appendChild(opt);
  });

  const tagRes = await fetch(`/api/record_tags/getByRecordId?record_id=${recordId}`);
  const tagData = await tagRes.json();
  const tagIds = tagData.map(t => t.tag_id);

  async function preencherTags(categoriaId, tagIdsSelecionadas) {
    let tagsRes;
    if (categoriaId) {
      tagsRes = await fetch(`/api/tags?category_id=${categoriaId}`);
    } else {
      tagsRes = await fetch('/api/tags');
    }
    const tags = await tagsRes.json();
    const tagsSelect = document.getElementById('tags');
    tagsSelect.innerHTML = '<option value="" disabled>Selecione</option>';
    tags.forEach(tag => {
      const opt = document.createElement('option');
      opt.value = tag.id;
      opt.textContent = tag.name;
      if (tagIdsSelecionadas && (tagIdsSelecionadas.includes(tag.id) || tagIdsSelecionadas.includes(String(tag.id)))) {
        opt.selected = true;
      }
      tagsSelect.appendChild(opt);
    });
    const optOutro = document.createElement('option');
    optOutro.value = 'outro';
    optOutro.textContent = 'Outro';
    tagsSelect.appendChild(optOutro);
  }
  await preencherTags(registro.categoria_id, tagIds);

  categoriasSelect.addEventListener('change', async function () {
    await preencherTags(this.value, []);
    atualizarBotaoPatologia();
  });

  document.getElementById('tags').addEventListener('change', atualizarBotaoPatologia);

  categoriasSelect.value = registro.categoria_id;

  const tagsSelect = document.getElementById('tags');
  if (tagIds.length > 0) {
    tagsSelect.value = tagIds[0];
  }

  function atualizarBotaoPatologia() {
    const categoriaId = categoriasSelect.value;
    const tagId = tagsSelect.value;
    let patologiaActions = document.getElementById('patologia-actions');
    if (!patologiaActions) {
      patologiaActions = document.createElement('div');
      patologiaActions.id = 'patologia-actions';
      tagsSelect.parentNode.appendChild(patologiaActions);
    }
    patologiaActions.innerHTML = '';

    if (tagId === 'outro') {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'button button-outline';
      btn.textContent = 'Criar Patologia';
      btn.onclick = function (e) {
        e.preventDefault();
        abrirPopupCriarPatologia(categoriaId);
      };
      patologiaActions.appendChild(btn);
    } else if (tagId && tagId !== '') {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'button button-outline';
      btn.textContent = 'Editar/Deletar patologia';
      btn.onclick = function (e) {
        e.preventDefault();
        abrirPopupEditarDeletarPatologia(tagId, categoriaId);
      };
      patologiaActions.appendChild(btn);
    }
  }
  atualizarBotaoPatologia();

  function abrirPopupCriarPatologia(categoriaId) {
    const popup = document.createElement('div');
    popup.className = 'popup-overlay';
    popup.innerHTML = `
      <div class="popup-content">
        <h3>Criar nova patologia</h3>
        <input type="text" id="novaPatologiaNome" placeholder="Nome da patologia" class="input"/>
        <div style="margin-top:1rem;">
          <button class="button button-primary" id="btnSalvarNovaPatologia">Salvar</button>
          <button class="button button-outline" id="btnCancelarNovaPatologia">Cancelar</button>
        </div>
      </div>
    `;
    document.body.appendChild(popup);

    document.getElementById('btnSalvarNovaPatologia').onclick = async function () {
      const nome = document.getElementById('novaPatologiaNome').value.trim();
      if (!nome) {
        alert('Digite o nome da patologia!');
        return;
      }
      const res = await fetch('/api/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: nome, category_id: categoriaId })
      });
      if (res.ok) {
        alert('Patologia criada!');
        popup.remove();
        await preencherTags(categoriaId, []);
        atualizarBotaoPatologia();
      } else {
        alert('Erro ao criar patologia!');
      }
    };
    document.getElementById('btnCancelarNovaPatologia').onclick = function () {
      popup.remove();
    };
    popup.onclick = function (e) {
      if (e.target === popup) popup.remove();
    };
  }

  function abrirPopupEditarDeletarPatologia(tagId, categoriaId) {
    if (tagId === 'outro') return;
    const tagOption = tagsSelect.querySelector(`option[value="${tagId}"]`);
    const tagName = tagOption ? tagOption.textContent : '';
    const popup = document.createElement('div');
    popup.className = 'popup-overlay';
    popup.innerHTML = `
      <div class="popup-content">
        <h3>Editar/Deletar patologia</h3>
        <input type="text" id="editarPatologiaNome" value="${tagName}" class="input"/>
        <div style="margin-top:1rem;">
          <button class="button button-primary" id="btnSalvarEdicaoPatologia">Salvar Alteração</button>
          <button class="button button-outline" id="btnDeletarPatologia">Deletar</button>
          <button class="button button-outline" id="btnCancelarEdicaoPatologia">Cancelar</button>
        </div>
      </div>
    `;
    document.body.appendChild(popup);

    document.getElementById('btnSalvarEdicaoPatologia').onclick = async () => {
      const novoNome = document.getElementById('editarPatologiaNome').value.trim();
      if (!novoNome) {
        alert('Digite o nome da patologia!');
        return;
      }
      const resCheck = await fetch(`/api/record_tags/getByTagId?tag_id=${tagId}`);
      const tagsAssociadas = await resCheck.json();
      if (Array.isArray(tagsAssociadas) && tagsAssociadas.length > 0) {
        alert('Não é possível editar: esta patologia está associada a um registro.');
        return;
      }
      const res = await fetch(`/api/tags/${tagId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: novoNome, category_id: categoriaId })
      });
      if (res.ok) {
        alert('Patologia atualizada!');
        popup.remove();
        await preencherTags(categoriaId, []);
        atualizarBotaoPatologia();
      } else {
        alert('Erro ao atualizar patologia!');
      }
    };

    document.getElementById('btnDeletarPatologia').onclick = async () => {
      const resCheck = await fetch(`/api/record_tags/getByTagId?tag_id=${tagId}`);
      const tagsAssociadas = await resCheck.json();
      if (Array.isArray(tagsAssociadas) && tagsAssociadas.length > 0) {
        alert('Não é possível deletar: esta patologia está associada a um registro.');
        return;
      }
      if (confirm('Tem certeza que deseja deletar esta patologia?')) {
        const res = await fetch(`/api/tags/${tagId}`, { method: 'DELETE' });
        if (res.ok) {
          alert('Patologia deletada!');
          popup.remove();
          await preencherTags(categoriaId, []);
          atualizarBotaoPatologia();
        } else {
          alert('Erro ao deletar patologia!');
        }
      }
    };

    document.getElementById('btnCancelarEdicaoPatologia').onclick = () => popup.remove();
    popup.onclick = e => { if (e.target === popup) popup.remove(); };
  }

  document.getElementById('nome').value = registro.name;
  document.getElementById('descricao').value = registro.description;

  const imgRes = await fetch(`/api/images/getByRecordId?record_id=${recordId}`);
  const imgData = await imgRes.json();
  let imageId = null;
  let imageUrl = '';
  let imageBuffer = null;
  if (Array.isArray(imgData) && imgData.length > 0) {
    imageId = imgData[0].id;
    imageBuffer = imgData[0].image_data;
  } else if (imgData && imgData.image_data) {
    imageBuffer = imgData.image_data;
  }
  if (imageBuffer) {
    if (typeof imageBuffer === 'string') {
      imageUrl = `data:image/png;base64,${imageBuffer}`;
    } else if (imageBuffer.data && Array.isArray(imageBuffer.data)) {
      const uint8Array = new Uint8Array(imageBuffer.data);
      const blob = new Blob([uint8Array], { type: 'image/png' });
      imageUrl = URL.createObjectURL(blob);
    }
    document.getElementById('registerPhoto').src = imageUrl;
  }

  document.getElementById('botaoSalvar').onclick = async () => {
    const name = document.getElementById('nome').value;
    const description = document.getElementById('descricao').value;
    const environment_id = ambientesSelect.value;
    const categoria_id = categoriasSelect.value;
    const tag_id = document.getElementById('tags').value;
    const user_id = document.getElementById('userId')?.value;

    if (
      !name.trim() ||
      !description.trim() ||
      !environment_id ||
      !categoria_id ||
      !tag_id
    ) {
      alert('Preencha todos os campos!');
      return;
    }

    const res = await fetch(`/api/records/${recordId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description, environment_id, user_id })
    });
    if (!res.ok) {
      alert('Erro ao atualizar registro!');
      return;
    }

    const tagRes = await fetch(`/api/record_tags/getByRecordId?record_id=${recordId}`);
    const tagData = await tagRes.json();
    if (tagData.length > 0) {
      await fetch(`/api/record_tags/${tagData[0].id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ record_id: recordId, tag_id })
      });
    } else {
      await fetch(`/api/record_tags`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ record_id: recordId, tag_id })
      });
    }

    const imageInput = document.getElementById('imageInput');
    if (imageInput.files && imageInput.files[0]) {
      const formData = new FormData();
      formData.append('record_id', recordId);
      formData.append('image', imageInput.files[0]);
      if (imageId) {
        await fetch(`/api/images/${imageId}`, {
          method: 'PUT',
          body: formData
        });
      } else {
        await fetch('/api/images', {
          method: 'POST',
          body: formData
        });
      }
    }

    alert('Registro atualizado!');
    window.location.href = `/inspection?id=${inspectionId}`;
  };

  document.getElementById('botaoCancelar').onclick = () => window.history.back();

  document.getElementById('addPhotoBtn').onclick = () => {
    document.getElementById('imageInput').click();
  };
  document.getElementById('imageInput').onchange = function () {
    if (this.files && this.files[0]) {
      const reader = new FileReader();
      reader.onload = function (e) {
        document.getElementById('registerPhoto').src = e.target.result;
      };
      reader.readAsDataURL(this.files[0]);
    }
  };
});