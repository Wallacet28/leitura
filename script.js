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

    localStorage.setItem('nome', nome);
    localStorage.setItem('matricula', matricula);
    localStorage.setItem('data', data);
    localStorage.setItem('horario', horario);
    localStorage.setItem('motivo', motivo);
    localStorage.setItem('tipos', tipos);

    const numeroSecretario = '5531985396866';
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

    const mensagem = `*Formulário de Justificativa - Assinado*\n\n` +
                     `👤 Nome: ${nome}\n` +
                     `🆔 Matrícula: ${matricula}\n` +
                     `📅 Data: ${data} ${horario}\n` +
                     `📝 Motivo: ${motivo}\n` +
                     `📌
