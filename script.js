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

    // Salva dados no localStorage
    localStorage.setItem('nome', nome);
    localStorage.setItem('matricula', matricula);
    localStorage.setItem('data', data);
    localStorage.setItem('horario', horario);
    localStorage.setItem('motivo', motivo);
    localStorage.setItem('tipos', tipos);

    // Monta mensagem para o Secretário
    const numeroSecretario = '5531985396866'; // Substitua pelo número do secretário
    const mensagem = `*Formulário de Justificativa*\n\n` +
                     `👤 Nome: ${nome}\n` +
                     `🆔 Matrícula: ${matricula}\n` +
                     `📅 Data: ${data} ${horario}\n` +
                     `📝 Motivo: ${motivo}\n` +
                     `📌 Tipo: ${tipos}\n\n➡️ Favor assinar.`;

    const url = `https://wa.me/${numeroSecretario}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');
    alert('Mensagem enviada para o Secretário via WhatsApp!');
    this.reset();
  });
}

// ------------------- Secretário -------------------
if(document.getElementById('assinaturaForm')){
  // Pré-preenche dados do funcionário
  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('nome').value = localStorage.getItem('nome') || '';
    document.getElementById('matricula').value = localStorage.getItem('matricula') || '';
    document.getElementById('data').value = localStorage.getItem('data') || '';
    document.getElementById('horario').value = localStorage.getItem('horario') || '';
    document.getElementById('motivo').value = localStorage.getItem('motivo') || '';
    document.getElementById('tipos').value = localStorage.getItem('tipos') || '';
  });

  document.getElementById('assinaturaForm').addEventListener('submit', function(e){
    e.preventDefault();

    const assinatura = document.getElementById('assinatura').value;
    localStorage.setItem('assinatura', assinatura);

    const nome = document.getElementById('nome').value;
    const matricula = document.getElementById('matricula').value;
    const data = document.getElementById('data').value;
    const horario = document.getElementById('horario').value;
    const motivo = document.getElementById('motivo').value;
    const tipos = document.getElementById('tipos').value;

    // Monta mensagem para o Controle
    const numeroControle = '5531985396866'; // Substitua pelo número do controle
    const mensagem = `*Formulário de Justificativa - Assinado*\n\n` +
                     `👤 Nome: ${nome}\n` +
                     `🆔 Matrícula: ${matricula}\n` +
                     `📅 Data: ${data} ${horario}\n` +
                     `📝 Motivo: ${motivo}\n` +
                     `📌 Tipo: ${tipos}\n` +
                     `✍️ Assinado por: ${assinatura}`;

    const url = `https://wa.me/${numeroControle}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');
    alert('Mensagem enviada para Controle via WhatsApp!');
    this.reset();
  });
}

// ------------------- Controle -------------------
if(document.getElementById('visualizacao')){
  const nome = localStorage.getItem('nome') || '';
  const matricula = localStorage.getItem('matricula') || '';
  const data = localStorage.getItem('data') || '';
  const horario = localStorage.getItem('horario') || '';
  const motivo = localStorage.getItem('motivo') || '';
  const tipos = localStorage.getItem('tipos') || '';
  const assinatura = localStorage.getItem('assinatura') || 'Não assinada';

  const dadosDiv = document.getElementById('dadosFormulario');
  dadosDiv.innerHTML = `
      <strong>Nome:</strong> ${nome}<br>
      <strong>Matrícula:</strong> ${matricula}<br>
      <strong>Data:</strong> ${data} ${horario}<br>
      <strong>Motivo:</strong> ${motivo}<br>
      <strong>Tipo:</strong> ${tipos}<br>
      <strong>Assinatura:</strong> ${assinatura}
  `;

  // Botão para enviar via WhatsApp
  document.getElementById('enviarWhatsApp').addEventListener('click', () => {
    const mensagem = `*Formulário de Justificativa - Controle*\n\n` +
                     `👤 Nome: ${nome}\n` +
                     `🆔 Matrícula: ${matricula}\n` +
                     `📅 Data: ${data} ${horario}\n` +
                     `📝 Motivo: ${motivo}\n` +
                     `📌 Tipo: ${tipos}\n` +
                     `✍️ Assinado por: ${assinatura}`;

    const numeroControle = '5531985396866'; // Número para envio
    const url = `https://wa.me/${numeroControle}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');
  });
}
