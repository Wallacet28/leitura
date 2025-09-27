(function(){
  const form = document.getElementById('justForm');
  const summaryBox = document.getElementById('summaryBox');

  function showError(id, show, text) {
    const el = document.getElementById(id);
    if (!el) return;
    el.style.display = show ? 'block' : 'none';
    if (text) el.textContent = text;
  }

  function getMotivosChecked() {
    return Array.from(document.querySelectorAll('input[name="motivo"]:checked')).map(i => i.value);
  }

  form.addEventListener('submit', function(e){
    e.preventDefault();
    ['err-nome','err-matricula','err-data','err-motivo','err-assinatura_servidor','err-data_assinatura_servidor','err-validacao']
      .forEach(id => showError(id, false));

    let valid = true;
    if (!form.nome.value.trim()) { showError('err-nome', true); valid = false; }
    if (!form.matricula.value.trim()) { showError('err-matricula', true); valid = false; }
    if (!form.data.value) { showError('err-data', true); valid = false; }
    if (getMotivosChecked().length === 0) { showError('err-motivo', true); valid = false; }
    if (!form.assinatura_servidor.value.trim()) { showError('err-assinatura_servidor', true); valid = false; }
    if (!form.data_assinatura_servidor.value) { showError('err-data_assinatura_servidor', true); valid = false; }
    if (!document.querySelector('input[name="validacao"]:checked')) { showError('err-validacao', true); valid = false; }

    if (!valid) { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }

    const data = {
      nome: form.nome.value,
      matricula: form.matricula.value,
      data_ocorrido: form.data.value,
      horarios: form.horarios.value,
      motivos: getMotivosChecked().join(', '),
      motivoOutro: form.motivoOutro.value,
      descricao: form.descricao.value,
      assinatura_servidor: form.assinatura_servidor.value,
      data_assinatura_servidor: form.data_assinatura_servidor.value,
      validacao: document.querySelector('input[name="validacao"]:checked').value,
      assinatura_secretario: form.assinatura_secretario.value,
      data_secretario: form.data_secretario.value
    };

    summaryBox.style.display = 'block';
    summaryBox.innerHTML = '<strong>Resumo:</strong><br>' +
      'Nome: ' + escapeHtml(data.nome) + '<br>' +
      'Matrícula: ' + escapeHtml(data.matricula) + '<br>' +
      'Data: ' + escapeHtml(data.data_ocorrido) + '<br>' +
      'Horários: ' + escapeHtml(data.horarios) + '<br>' +
      'Motivos: ' + escapeHtml(data.motivos) + '<br>' +
      (data.motivoOutro ? 'Outro: ' + escapeHtml(data.motivoOutro) + '<br>' : '') +
      'Descrição: ' + (data.descricao ? escapeHtml(data.descricao) : '<i>—</i>') + '<br>' +
      'Assinatura servidor: ' + escapeHtml(data.assinatura_servidor) + ' — ' + escapeHtml(data.data_assinatura_servidor) + '<br>' +
      'Validação chefia: ' + escapeHtml(data.validacao) + '<br>' +
      (data.assinatura_secretario ? 'Assinatura secretário: ' + escapeHtml(data.assinatura_secretario) + ' — ' + escapeHtml(data.data_secretario) + '<br>' : '') +
      '<div style="margin-top:8px; font-size:13px; color:#555;">Este é um resumo local. Substitua por integração de backend para gravar/envio.</div>';
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  });

  document.getElementById('btn-reset').addEventListener('click', function(){
    form.reset();
    summaryBox.style.display = 'none';
    document.querySelectorAll('.error').forEach(el => el.style.display = 'none');
  });

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>"'`=\\/]/g, function(s) {
      return ({
        '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;', '/':'&#x2F;', '`':'&#x60;', '=':'&#x3D;'
      })[s];
    });
  }
})();
