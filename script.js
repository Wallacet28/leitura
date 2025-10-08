// ------------------- Funcionário -------------------
if(document.getElementById('formJustificativa')){
  document.getElementById('formJustificativa').addEventListener('submit', function(e){
    e.preventDefault();

    const nome = document.getElementById('nome').value;
    const matricula = document.getElementById('matricula').value;
    const data = document.getElementById('data').value;
    const horario = document.getElementById('horario').value;
    const motivo = document.getElementById('motivo').value;
    const tipos = Array.from(document.querySelectorAll('.tipo:checked')).map(cb => cb.value).join(', ');

    // Recupera array existente ou cria um novo
    const justificativas = JSON.parse(localStorage.getItem('justificativas')) || [];

    // Adiciona nova justificativa sem assinatura
    justificativas.push({ nome, matricula, data, horario, motivo, tipos, assinatura: null });
    localStorage.setItem('justificativas', JSON.stringify(justificativas));

    // Envia para WhatsApp do Secretário
    const numeroSecretario = '5531985396866';
    const mensagem = `*Formulário de Justificativa*\n\n` +
                     `👤 Nome: ${nome}\n` +
                     `🆔 Matrícula: ${matricula}\n` +
                     `📅 Data: ${data} ${horario}\n` +
                     `📝 Motivo: ${motivo}\n` +
                     `📌 Tipo: ${tipos}\n\n➡️ Favor assinar.`;

    window.open(`https://wa.me/${numeroSecretario}?text=${encodeURIComponent(mensagem)}`, '_blank');
    alert('Mensagem enviada para o Secretário via WhatsApp!');
    this.reset();
  });
}

// ------------------- Secretário -------------------
if(document.getElementById('listaJustificativas')){
  const listaDiv = document.getElementById('listaJustificativas');
  let justificativas = JSON.parse(localStorage.getItem('justificativas')) || [];

  function renderLista() {
    listaDiv.innerHTML = '';
    justificativas.forEach((j, index) => {
      if(!j.assinatura){
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
          <p><strong>Nome:</strong> ${j.nome}</p>
          <p><strong>Matrícula:</strong> ${j.matricula}</p>
          <p><strong>Data:</strong> ${j.data} ${j.horario}</p>
          <p><strong>Motivo:</strong> ${j.motivo}</p>
          <p><strong>Tipo:</strong> ${j.tipos}</p>
          <input type="text" placeholder="Digite sua assinatura" id="assinatura-${index}" />
          <button class="btn primary" onclick="assinar(${index})">Assinar e Enviar</button>
        `;
        listaDiv.appendChild(card);
      }
    });
  }

  window.assinar = function(index){
    const assinatura = document.getElementById(`assinatura-${index}`).value;
    if(!assinatura){ alert('Digite a assinatura'); return; }
    justificativas[index].assinatura = assinatura;

    // Atualiza localStorage
    localStorage.setItem('justificativas', JSON.stringify(justificativas));

    // Envia WhatsApp para Controle
    const j = justificativas[index];
    const numeroControle = '5531985396866';
    const mensagem = `*Formulário de Justificativa - Assinado*\n\n` +
                     `👤 Nome: ${j.nome}\n` +
                     `🆔 Matrícula: ${j.matricula}\n` +
                     `📅 Data: ${j.data} ${j.horario}\n` +
                     `📝 Motivo: ${j.motivo}\n` +
                     `📌 Tipo: ${j.tipos}\n` +
                     `✍️ Assinado por: ${assinatura}`;

    window.open(`https://wa.me/${numeroControle}?text=${encodeURIComponent(mensagem)}`, '_blank');

    renderLista();
    alert('Justificativa assinada e enviada para Controle!');
  }

  renderLista();
}

// ------------------- Controle -------------------
if(document.getElementById('listaAssinadas')){
  const listaAssinadasDiv = document.getElementById('listaAssinadas');
  const justificativas = JSON.parse(localStorage.getItem('justificativas')) || [];

  justificativas.forEach(j => {
    if(j.assinatura){
      const card = document.createElement('div');
      card.classList.add('card');
      card.innerHTML = `
        <p><strong>Nome:</strong> ${j.nome}</p>
        <p><strong>Matrícula:</strong> ${j.matricula}</p>
        <p><strong>Data:</strong> ${j.data} ${j.horario}</p>
        <p><strong>Motivo:</strong> ${j.motivo}</p>
        <p><strong>Tipo:</strong> ${j.tipos}</p>
        <p><strong>Assinatura:</strong> ${j.assinatura}</p>
      `;
      listaAssinadasDiv.appendChild(card);
    }
  });
    }
