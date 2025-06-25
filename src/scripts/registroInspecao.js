const inspection_id = new URLSearchParams(window.location.search).get('id');

async function carregarAmbientes() {
  const res = await fetch(`/api/environments?inspection_id=${inspection_id}`);
  const ambientes = await res.json();
  const select = document.getElementById('ambientes');
  ambientes.forEach(amb => {
    const opt = document.createElement('option');
    opt.value = amb.id;
    opt.textContent = amb.name;
    select.appendChild(opt);
  });
}

async function carregarCategoriasTags() {
  const res = await fetch('/api/tag_categories');
  const categorias = await res.json();
  const select = document.getElementById('categoriasTags');
  categorias.forEach(catg => {
    const opt = document.createElement('option');
    opt.value = catg.id;
    opt.textContent = catg.name;
    select.appendChild(opt);
  });
}

async function buscarTagsPorCategoria(category_id, tagSelecionada = null) {
  const res = await fetch(`/api/tags?category_id=${category_id}`);
  const tags = await res.json();
  const selectTags = document.getElementById('tags');
  if (selectTags) {
    selectTags.innerHTML = '';
    tags.forEach(tag => {
      const opt = document.createElement('option');
      opt.value = tag.id;
      opt.textContent = tag.name;
      if (tagSelecionada && tagSelecionada == tag.id) opt.selected = true;
      selectTags.appendChild(opt);
    });
    const optOutro = document.createElement('option');
    optOutro.value = 'outro';
    optOutro.textContent = 'Outro';
    selectTags.appendChild(optOutro);
  }
  atualizarBotaoPatologia();
}

function atualizarBotaoPatologia() {
  const categoriaId = document.getElementById('categoriasTags').value;
  const tagId = document.getElementById('tags').value;
  const patologiaActions = document.getElementById('patologia-actions');
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
      await buscarTagsPorCategoria(categoriaId);
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
  const tagOption = document.getElementById('tags').querySelector(`option[value="${tagId}"]`);
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
      alert('Não é possível editar/deletar: esta patologia está associada a um registro.');
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
      await buscarTagsPorCategoria(categoriaId);
    } else {
      alert('Erro ao atualizar patologia!');
    }
  };

  document.getElementById('btnDeletarPatologia').onclick = async () => {
    const resCheck = await fetch(`/api/record_tags/getByTagId?tag_id=${tagId}`);
    const tagsAssociadas = await resCheck.json();
    if (tagsAssociadas.length > 0) {
      alert('Não é possível deletar: esta patologia está associada a um registro.');
      return;
    }
    if (confirm('Tem certeza que deseja deletar esta patologia?')) {
      const res = await fetch(`/api/tags/${tagId}`, { method: 'DELETE' });
      if (res.ok) {
        alert('Patologia deletada!');
        popup.remove();
        await buscarTagsPorCategoria(categoriaId);
      } else {
        alert('Erro ao deletar patologia!');
      }
    }
  };

  document.getElementById('btnCancelarEdicaoPatologia').onclick = () => popup.remove();
  popup.onclick = e => { if (e.target === popup) popup.remove(); };
}

document.addEventListener('DOMContentLoaded', function () {
  const userId = document.getElementById('userId')?.value;
  carregarAmbientes();
  carregarCategoriasTags();

  const formRegistro = document.querySelector('form');
  if (formRegistro) {
    formRegistro.reset();
  }
  if (formRegistro) {
    formRegistro.addEventListener('submit', async function (e) {
      e.preventDefault();
      try {
        const user_id = userId;
        const name = document.getElementById('nome').value;
        const description = document.getElementById('descricao').value;
        const environment_id = document.getElementById('ambientes').value;

        const res = await fetch('/api/records', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, description, user_id, environment_id })
        });

        if (!res.ok) {
          const erro = await res.text();
          alert('Erro ao salvar registro!\n' + erro);
          return;
        }

        const registroCriado = await res.json();
        const record_id = registroCriado.id;

        const tag_id = document.getElementById('tags').value;
        const resRegistroTags = await fetch('/api/record_tags', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ record_id, tag_id })
        });

        if (!resRegistroTags.ok) {
          const erro = await resRegistroTags.text();
          alert('Erro ao salvar registro!\n' + erro);
          return;
        }

        if (window.selectedImageFile) {
          const formData = new FormData();
          formData.append('record_id', record_id);
          formData.append('image', window.selectedImageFile);

          const resImage = await fetch('/api/images', {
            method: 'POST',
            body: formData
          });

          if (!resImage.ok) {
            const erro = await resImage.text();
            alert('Erro ao salvar imagem!\n' + erro);
            return;
          }
        }

        alert('Registro salvo com sucesso!');
        formRegistro.reset();
        registerPhoto.src = "https://www.inteli.edu.br/wp-content/uploads/2024/08/Salas-de-aula-para-Metodologias-Ativas-Atelies.jpg";
        selectedImageFile = null;
        window.location.href = `/inspection?id=${inspection_id}`;

      } catch (err) {
        alert('Erro inesperado ao salvar registro!\n' + err);
      }
    });
  } else {
    console.log('Form NÃO encontrado!');
  }

  const categoriaSelecionada = document.getElementById('categoriasTags');
  if (categoriaSelecionada) {
    categoriaSelecionada.addEventListener('change', function () {
      const categoriaId = this.value;
      buscarTagsPorCategoria(categoriaId);
    });
  }

  const grupoPatologia = document.getElementById('grupo-patologia');
  const selectCategoria = document.getElementById('categoriasTags');

  if (selectCategoria) {
    selectCategoria.addEventListener('change', function () {
      if (this.value) {
        grupoPatologia.style.display = 'block';
        buscarTagsPorCategoria(this.value);
      } else {
        grupoPatologia.style.display = 'none';
      }
    });
    grupoPatologia.style.display = 'none';
  }

  const form = document.getElementById('form-registro');
  const botaoSalvar = document.getElementById('botaoSalvar');
  const botaoCancelar = document.getElementById('botaoCancelar');

  if (botaoSalvar && form) {
    botaoSalvar.addEventListener('click', function () {
      form.requestSubmit(); 
    });
  }
  if (botaoCancelar && form) {
    botaoCancelar.addEventListener('click', function () {
      form.reset();
    });
  }

  let selectedImageFile = null;
  const imageInput = document.getElementById('imageInput');
  const addPhotoBtn = document.getElementById('addPhotoBtn');
  const registerPhoto = document.getElementById('registerPhoto');

  if (addPhotoBtn && imageInput) {
    addPhotoBtn.addEventListener('click', () => imageInput.click());
  }

  if (imageInput && registerPhoto) {
    imageInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        selectedImageFile = file;
        const reader = new FileReader();
        reader.onload = function (ev) {
          registerPhoto.src = ev.target.result;
        };
        reader.readAsDataURL(file);
      }
    });
  }

  const selectTags = document.getElementById('tags');
  const selectCategorias = document.getElementById('categoriasTags');

  if (selectTags) {
    selectTags.addEventListener('change', atualizarBotaoPatologia);
  }
  if (selectCategorias) {
    selectCategorias.addEventListener('change', atualizarBotaoPatologia);
  }

  // Initialize the Fabric.js image editor
  ImageEditor.init();
});

// === FABRIC.JS IMAGE EDITOR (Refactored) ===

const ImageEditor = {
  canvas: null,
  imgObj: null,
  drawingMode: null,
  drawingShape: null,
  startX: null,
  startY: null,
  color: '#ff0000',
  initialized: false,
  undoStack: [],

  init() {
    if (this.initialized) return;
    this.initialized = true;

    // Tool buttons
    document.getElementById('drawRectBtn').addEventListener('click', () => this.setMode('rect'));
    document.getElementById('drawCircleBtn').addEventListener('click', () => this.setMode('circle'));
    document.getElementById('drawLineBtn').addEventListener('click', () => this.setMode('freedraw'));
    document.getElementById('colorPicker').addEventListener('input', e => this.setColor(e.target.value));
    document.getElementById('saveFabricImageBtn').addEventListener('click', () => this.save());
    document.getElementById('closeFabricModal').addEventListener('click', () => this.close());
    document.getElementById('fabricModal').addEventListener('click', e => {
      if (e.target === document.getElementById('fabricModal')) this.close();
    });
    document.getElementById('editImageBtn').addEventListener('click', () => {
      const imgElem = document.getElementById('registerPhoto');
      if (imgElem.complete && imgElem.naturalWidth !== 0) {
        ImageEditor.open();
      } else {
        imgElem.onload = () => {
          ImageEditor.open();
          imgElem.onload = null;
        };
      }
    });
    // Add Undo button only
    const toolbar = document.querySelector('#fabricModal > .card > div');
    if (toolbar) {
      const undoBtn = document.createElement('button');
      undoBtn.type = 'button';
      undoBtn.id = 'undoBtn';
      undoBtn.className = 'button button-outline';
      undoBtn.innerHTML = '<img src="/assets/back-arrow.svg" alt="undo" style="width:18px;height:18px;">';
      toolbar.insertBefore(undoBtn, toolbar.firstChild);

      undoBtn.addEventListener('click', () => this.undo());
      // Removido: botão Refazer
    }
  },

  setMode(mode) {
    this.drawingMode = mode;
    if (!this.canvas) return;
    if (mode === 'freedraw') {
      this.canvas.isDrawingMode = true;
      this.canvas.freeDrawingBrush = new fabric.PencilBrush(this.canvas);
      this.canvas.freeDrawingBrush.color = this.color;
      this.canvas.freeDrawingBrush.width = 4;
    } else {
      this.canvas.isDrawingMode = false;
    }
  },

  setColor(color) {
    this.color = color;
    if (this.canvas && this.canvas.isDrawingMode && this.canvas.freeDrawingBrush) {
      this.canvas.freeDrawingBrush.color = color;
    }
  },

  open() {
    // 1. Show modal first, so canvas is visible and has correct size
    const modal = document.getElementById('fabricModal');
    modal.style.display = 'flex';

    // 2. Wait for next animation frame to ensure DOM is updated and visible
    requestAnimationFrame(() => {
      const imgElem = document.getElementById('registerPhoto');
      const imgSrc = imgElem.src;
      const isDataUrl = imgSrc.startsWith('data:');
      const tempImg = new window.Image();
      if (!isDataUrl) tempImg.crossOrigin = "anonymous";
      tempImg.onload = () => {
        const imgWidth = tempImg.naturalWidth;
        const imgHeight = tempImg.naturalHeight;
        const maxCanvasWidth = window.innerWidth * 0.85;
        const maxCanvasHeight = window.innerHeight * 0.65;
        const scale = Math.min(maxCanvasWidth / imgWidth, maxCanvasHeight / imgHeight, 1);
        const canvasWidth = imgWidth * scale;
        const canvasHeight = imgHeight * scale;

        if (this.canvas) this.canvas.dispose();
        this.canvas = new fabric.Canvas('fabricCanvas');
        this.canvas.setWidth(canvasWidth);
        this.canvas.setHeight(canvasHeight);

        // Debug: set background color
        this.canvas.setBackgroundColor('#eee', this.canvas.renderAll.bind(this.canvas));

        fabric.Image.fromURL(
          imgSrc,
          img => {
            img.set({
              left: 0,
              top: 0,
              scaleX: scale,
              scaleY: scale,
              selectable: false,
              evented: false,
              hasControls: false,
              lockMovementX: true,
              lockMovementY: true,
              lockScalingX: true,
              lockScalingY: true,
              lockRotation: true
            });
            this.imgObj = img;
            this.canvas.add(img);
            this.canvas.sendToBack(img);
            this.canvas.renderAll();
            this.attachShapeListeners();
            // Save initial state for undo
            this.undoStack = [];
            this.saveState();
            // Listen for changes to save state
            this.canvas.on('object:added', () => this.saveState());
            this.canvas.on('object:modified', () => this.saveState());
            this.canvas.on('object:removed', () => this.saveState());
            // Debug: log image info
            console.log('Image loaded:', imgWidth, imgHeight, 'Scale:', scale);
          },
          isDataUrl ? undefined : { crossOrigin: 'anonymous' }
        );
      };
      tempImg.src = imgSrc;
    });
  },

  saveState() {
    if (!this.canvas) return;
    if (this.undoStack.length > 30) this.undoStack.shift();
    this.undoStack.push(this.canvas.toJSON());
  },

  undo() {
    if (this.undoStack.length <= 1 || !this.canvas) return;
    const currentState = this.undoStack.pop();
    const prevState = this.undoStack[this.undoStack.length - 1];
    this.canvas.loadFromJSON(prevState, () => {
      this.canvas.renderAll();
    });
  },

  close() {
    document.getElementById('fabricModal').style.display = 'none';
    if (this.canvas) {
      this.canvas.off('mouse:down');
      this.canvas.off('mouse:move');
      this.canvas.off('mouse:up');
      this.canvas.off('object:added');
      this.canvas.off('object:modified');
      this.canvas.off('object:removed');
    }
    this.drawingMode = null;
    this.drawingShape = null;
    this.undoStack = [];
  },

  save() {
    if (!this.canvas) return;
    const dataURL = this.canvas.toDataURL({ format: 'png' });
    document.getElementById('registerPhoto').src = dataURL;
    fetch(dataURL)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], "edited-image.png", { type: "image/png" });
        const dt = new DataTransfer();
        dt.items.add(file);
        document.getElementById('imageInput').files = dt.files;
        // Always update the global selectedImageFile variable
        window.selectedImageFile = file;
        this.close();
      });
  },

  attachShapeListeners() {
    // Remove previous listeners
    this.canvas.off('mouse:down');
    this.canvas.off('mouse:move');
    this.canvas.off('mouse:up');

    this.canvas.on('mouse:down', opt => this.onMouseDown(opt));
    this.canvas.on('mouse:move', opt => this.onMouseMove(opt));
    this.canvas.on('mouse:up', opt => this.onMouseUp(opt));
  },

  onMouseDown(opt) {
    if (this.drawingMode === 'rect' || this.drawingMode === 'circle') {
      const pointer = this.canvas.getPointer(opt.e);
      this.startX = pointer.x;
      this.startY = pointer.y;
      if (this.drawingMode === 'rect') {
        this.drawingShape = new fabric.Rect({
          left: this.startX,
          top: this.startY,
          width: 1,
          height: 1,
          stroke: this.color,
          strokeWidth: 2,
          fill: 'transparent',
          selectable: true
        });
      } else if (this.drawingMode === 'circle') {
        this.drawingShape = new fabric.Ellipse({
          left: this.startX,
          top: this.startY,
          rx: 1,
          ry: 1,
          stroke: this.color,
          strokeWidth: 2,
          fill: 'transparent',
          selectable: true,
          originX: 'left',
          originY: 'top'
        });
      }
      this.canvas.add(this.drawingShape);
    }
  },

  onMouseMove(opt) {
    if (!this.drawingShape) return;
    const pointer = this.canvas.getPointer(opt.e);
    if (this.drawingMode === 'rect') {
      this.drawingShape.set({
        width: Math.abs(pointer.x - this.startX),
        height: Math.abs(pointer.y - this.startY),
        left: Math.min(pointer.x, this.startX),
        top: Math.min(pointer.y, this.startY)
      });
    } else if (this.drawingMode === 'circle') {
      this.drawingShape.set({
        rx: Math.abs(pointer.x - this.startX) / 2,
        ry: Math.abs(pointer.y - this.startY) / 2,
        left: Math.min(pointer.x, this.startX),
        top: Math.min(pointer.y, this.startY)
      });
    }
    this.canvas.renderAll();
  },

  onMouseUp(opt) {
    if (this.drawingShape) {
      this.drawingShape.setCoords();
      this.drawingShape = null;
      this.drawingMode = null;
    }
  }
};