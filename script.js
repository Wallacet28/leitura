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
    const setor = document.getElementById('setor').value;

    const justificativas = JSON.parse(localStorage.getItem('justificativas')) || [];
    justificativas.push({ nome, matricula, data, horario, motivo, tipos, setor, assinatura: null });
    localStorage.setItem('justificativas', JSON.stringify(justificativas));

    // Mapear setor para WhatsApp do Secretário (10 números diferentes)
    const numerosSecretario = {
      relogio1: '5531985396866',
      relogio2: '5531985396866',
      relogio3: '5531971293658',
      relogio4: '5531971293658',
      relogio5: '5531971293658',
      relogio6: '5531971293658',
      relogio7: '5531971293658',
      relogio8: '5531971293658',
      relogio9: '5531971293658',
      relogio10:'5531986396866'
    };

    const numeroSecretario = numerosSecretario[setor]; 
    const mensagem = `*Formulário de Justificativa*\n\n` +
                     `👤 Nome: ${nome}\n🆔 Matrícula: ${matricula}\n📅 Data: ${data} ${horario}\n📝 Motivo: ${motivo}\n📌 Tipo: ${tipos}\n🏢 Setor: ${setor}\n\n➡️ Favor assinar.`;

    window.open(`https://wa.me/${numeroSecretario}?text=${encodeURIComponent(mensagem)}`, '_blank');
    alert('Mensagem enviada para o Secretário do seu setor via WhatsApp!');
    this.reset();
  });
}

// ------------------- Secretário -------------------
if(document.getElementById('listaJustificativas')){
  const listaDiv = document.getElementById('listaJustificativas');
  let justificativas = JSON.parse(localStorage.getItem('justificativas')) || [];

  function renderLista() {
    listaDiv.innerHTML = '';
    const setorSecretario = document.getElementById('setorSecretario').value;
    justificativas.forEach((j, index) => {
      if(!j.assinatura && j.setor === setorSecretario){
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
    localStorage.setItem('justificativas', JSON.stringify(justificativas));

    const j = justificativas[index];
    const numeroControle = '5531985396866'; // mesmo número para todos
    const mensagem = `*Formulário de Justificativa - Assinado*\n\n` +
                     `👤 Nome: ${j.nome}\n🆔 Matrícula: ${j.matricula}\n📅 Data: ${j.data} ${j.horario}\n📝 Motivo: ${j.motivo}\n📌 Tipo: ${j.tipos}\n🏢 Setor: ${j.setor}\n✍️ Assinado por: ${assinatura}`;
    window.open(`https://wa.me/${numeroControle}?text=${encodeURIComponent(mensagem)}`, '_blank');

    renderLista();
    alert('Justificativa assinada e enviada para Controle!');
  }

  document.getElementById('setorSecretario').addEventListener('change', renderLista);
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
        <p><strong>Setor:</strong> ${j.setor}</p>
        <p><strong>Assinatura:</strong> ${j.assinatura}</p>
      `;
      listaAssinadasDiv.appendChild(card);
    }
  });
}
