/* script.js
   Código compartilhado para index.html, secretario.html e controle.html
   Usa localStorage com a chave: justificativas_etaqa
*/

(function () {
  const STORAGE_KEY = 'justificativas_etaqa';
  const WA_NUMBER = '5531985396866'; // (31) 98539-6866

  // ---------- util ----------
  function lerStorage() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  }
  function salvarTodos(arr) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
  }
  function salvarItem(item) {
    const arr = lerStorage();
    arr.push(item);
    salvarTodos(arr);
  }
  function gerarId() {
    return 'id-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
  }
  function formataDataIso(iso) {
    try {
      const d = new Date(iso);
      return d.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
    } catch { return iso; }
  }
  function getQueryParam(name) {
    const url = new URL(window.location.href);
    return url.searchParams.get(name);
  }

  // ---------- montar mensagem whatsapp ----------
  function montarMensagem(item) {
    const tipos = (item.tipos && item.tipos.length) ? item.tipos.join(', ') : '—';
    return `*Formulário de Justificativa - Assinado*\n\n` +
           `👤 *Nome:* ${item.nome}\n` +
           `🆔 *Matrícula:* ${item.matricula}\n` +
           `📅 *Data:* ${item.data} ${ item.horario ? 'às ' + item.horario : '' }\n` +
           `📝 *Motivo:* ${item.motivo}\n` +
           `📌 *Tipo:* ${tipos}\n\n` +
           `✍️ *Assinado por:* ${item.assinatura}\n` +
           `🕒 *Assinado em:* ${formataDataIso(item.assinadoEm || item.criadoEm)}\n`;
  }

  // ---------- pagina: index.html (form) ----------
  function initIndex() {
    const form = document.getElementById('formJustificativa');
    if (!form) return;

    // define data para hoje
    (function setHoje() {
      const d = new Date().toISOString().split('T')[0];
      const dataInput = document.getElementById('data');
      if (dataInput) dataInput.value = d;
    })();

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const nome = document.getElementById('nome').value.trim();
      const matricula = document.getElementById('matricula').value.trim();
      const data = document.getElementById('data').value;
      const horario = document.getElementById('horario').value;
      const motivo = document.getElementById('motivo').value.trim();
      const checked = Array.from(document.querySelectorAll("input[name='tipo']:checked")).map(c => c.value);

      if (!nome || !matricula || !data || !motivo) {
        alert('Preencha os campos obrigatórios.');
        return;
      }

      const item = {
        id: gerarId(),
        nome,
        matricula,
        data,
        horario,
        motivo,
        tipos: checked,
        status: 'pendente', // pendente -> precisa assinatura do secretário
        assinatura: '',
        criadoEm: new Date().toISOString()
      };

      salvarItem(item);

      // redireciona para página do secretário com id na query
      window.location.href = 'secretario.html?id=' + encodeURIComponent(item.id);
    });
  }

  // ---------- pagina: secretario.html ----------
  function initSecretario() {
    const conteudo = document.getElementById('conteudo');
    const assinaturaArea = document.getElementById('assinaturaArea');
    if (!conteudo) return;

    const id = getQueryParam('id');
    if (!id) {
      conteudo.innerHTML = '<p>Registro não encontrado. Volte ao formulário e envie novamente.</p>';
      return;
    }

    const arr = lerStorage();
    const item = arr.find(x => x.id === id);

    if (!item) {
      conteudo.innerHTML = '<p>Registro não encontrado no armazenamento local.</p>';
      return;
    }

    const tipos = (item.tipos && item.tipos.length) ? item.tipos.join(', ') : '—';
    const horario = item.horario ? item.horario : '—';
    conteudo.innerHTML = `
      <p><strong>Nome:</strong> ${item.nome}</p>
      <p><strong>Matrícula:</strong> ${item.matricula}</p>
      <p><strong>Data:</strong> ${item.data} ${horario ? 'às ' + horario : ''}</p>
      <p><strong>Motivo:</strong><br>${item.motivo.replace(/\n/g,'<br>')}</p>
      <p><strong>Tipo de ocorrência:</strong> ${tipos}</p>
      <p style="margin-top:10px;color:#666;font-size:13px"><em>Criado em: ${formataDataIso(item.criadoEm)}</em></p>
    `;

    if (item.status === 'assinado') {
      conteudo.innerHTML += `<hr><p><strong>Já assinado por:</strong> ${item.assinatura}</p>
        <div class="actions"><a class="btn primary" href="controle.html">Ir para Controle</a></div>`;
    } else {
      assinaturaArea.style.display = 'block';
    }

    document.getElementById('btnAssinar')?.addEventListener('click', function () {
      const nomeAss = document.getElementById('assinatura').value.trim();
      if (!nomeAss) {
        alert('Digite o nome do secretário para assinar.');
        return;
      }

      const idx = arr.findIndex(x => x.id === id);
      if (idx === -1) {
        alert('Registro não encontrado.');
        return;
      }

      arr[idx].assinatura = nomeAss;
      arr[idx].status = 'assinado';
      arr[idx].assinadoEm = new Date().toISOString();
      salvarTodos(arr);

      // redireciona para controle (visualizar assinados)
      window.location.href = 'controle.html';
    });
  }

  // ---------- pagina: controle.html ----------
  function initControle() {
    const root = document.getElementById('lista');
    if (!root) return;

    const arr = lerStorage();
    const assinados = arr.filter(x => x.status === 'assinado');

    if (assinados.length === 0) {
      root.innerHTML = '<p>Nenhum formulário assinado ainda.</p>';
      return;
    }

    root.innerHTML = '';
    assinados.sort((a, b) => new Date(b.assinadoEm || b.criadoEm) - new Date(a.assinadoEm || a.criadoEm));

    assinados.forEach(item => {
      const div = document.createElement('div');
      div.className = 'registro';

      const horario = item.horario ? item.horario : '—';
      const tipos = (item.tipos && item.tipos.length) ? item.tipos.join(', ') : '—';

      div.innerHTML = `
        <p><strong>Nome:</strong> ${item.nome}</p>
        <p><strong>Matrícula:</strong> ${item.matricula}</p>
        <p><strong>Data:</strong> ${item.data} ${ horario ? 'às ' + horario : '' }</p>
        <p><strong>Motivo:</strong><br>${item.motivo.replace(/\n/g,'<br>')}</p>
        <p><strong>Tipo de ocorrência:</strong> ${tipos}</p>
        <p><strong>Assinado por:</strong> ${item.assinatura}</p>
        <p class="meta">Assinado em: ${formataDataIso(item.assinadoEm || item.criadoEm)}</p>

        <div class="actions">
          <button class="btn small send" data-id="${item.id}">Enviar via WhatsApp</button>
          <button class="btn small ghost view" data-id="${item.id}">Visualizar</button>
        </div>
      `;
      root.appendChild(div);
    });

    // events
    document.querySelectorAll('.send').forEach(btn => {
      btn.addEventListener('click', function () {
        const id = this.dataset.id;
        const arr2 = lerStorage();
        const item = arr2.find(x => x.id === id);
        if (!item) return alert('Registro não encontrado.');

        const mensagem = montarMensagem(item);
        const url = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(mensagem);
        window.open(url, '_blank');
      });
    });

    document.querySelectorAll('.view').forEach(btn => {
      btn.addEventListener('click', function () {
        const id = this.dataset.id;
        window.location.href = 'secretario.html?id=' + encodeURIComponent(id);
      });
    });
  }

  // ---------- init by page ----------
  document.addEventListener('DOMContentLoaded', function () {
    const path = window.location.pathname.split('/').pop();

    if (path === '' || path === 'index.html') initIndex();
    else if (path === 'secretario.html') initSecretario();
    else if (path === 'controle.html') initControle();
    else {
      // fallback: try to init all (safe)
      initIndex(); initSecretario(); initControle();
    }
  });

})();
