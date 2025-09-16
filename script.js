const STORAGE_KEY = "controle_abastecimento";
let dadosPorDia = {};
let editandoRegistro = null;

window.onload = () => {
  const data = new Date();
  const nomeMes = data.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  document.getElementById("mesAtual").textContent = nomeMes.charAt(0).toUpperCase() + nomeMes.slice(1);
  document.getElementById("mesAtualTabela").textContent = nomeMes.charAt(0).toUpperCase() + nomeMes.slice(1);

  const salvo = localStorage.getItem(STORAGE_KEY);
  if (salvo) dadosPorDia = JSON.parse(salvo);

  preencherDias();
  atualizarTabela();
};

document.getElementById("formulario").addEventListener("submit", function (e) {
  e.preventDefault();

  const agora = new Date();
  const data = agora.toLocaleDateString('pt-BR'); // Ex: 16/09/2025
  const hora = agora.toLocaleTimeString('pt-BR'); // Ex: 14:35:22
  const dia = "Dia " + agora.getDate().toString().padStart(2, "0");

  const registro = {
    Data: data,
    Hora: hora,
    Placa: document.getElementById("placa").value.trim(),
    KmAtual: parseFloat(document.getElementById("kmAtual").value),
    Litros: parseFloat(document.getElementById("litros").value),
    Valor: parseFloat(document.getElementById("valor").value),
    Tecnico: document.getElementById("tecnico").value.trim(),
    Observacao: document.getElementById("observacao").value.trim(),
  };

  if (editandoRegistro !== null) {
    dadosPorDia[editandoRegistro.dia][editandoRegistro.index] = registro;
    editandoRegistro = null;
  } else {
    if (!dadosPorDia[dia]) dadosPorDia[dia] = [];
    dadosPorDia[dia].push(registro);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(dadosPorDia));
  alert("Registro salvo com sucesso!");

  this.reset();
  document.querySelector('button[type="submit"]').textContent = "Salvar";
  preencherDias();
  atualizarTabela(dia);
});

function preencherDias() {
  const select = document.getElementById("selecionarDia");
  select.innerHTML = "";

  const hoje = new Date();
  const diaHoje = "Dia " + hoje.getDate().toString().padStart(2, "0");
  const diasOrdenados = Object.keys(dadosPorDia).sort(
    (a, b) => parseInt(a.replace("Dia ", "")) - parseInt(b.replace("Dia ", ""))
  );

  for (const dia of diasOrdenados) {
    const opt = document.createElement("option");
    opt.value = dia;
    opt.textContent = dia;
    select.appendChild(opt);
  }

  if (!select.value) {
    const optHoje = document.createElement("option");
    optHoje.value = diaHoje;
    optHoje.textContent = diaHoje;
    select.appendChild(optHoje);
  }

  select.value = diaHoje;
}

function atualizarTabela(diaSelecionado = null) {
  const hoje = new Date();
  const nomeAba = diaSelecionado || "Dia " + hoje.getDate().toString().padStart(2, "0");

  const tbody = document.querySelector("#tabela-registros tbody");
  tbody.innerHTML = "";

  if (!dadosPorDia[nomeAba]) return;

  dadosPorDia[nomeAba].forEach((reg, index) => {
    const tr = document.createElement("tr");

    const td = (text) => {
      const td = document.createElement("td");
      td.textContent = text || "";
      return td;
    };

    const precoPorLitro = reg.Litros > 0 ? (reg.Valor / reg.Litros).toFixed(2) : "0.00";

    tr.appendChild(td(reg.Data));
    tr.appendChild(td(reg.Hora));
    tr.appendChild(td(reg.Placa));
    tr.appendChild(td(reg.KmAtual));
    tr.appendChild(td(reg.Litros));
    tr.appendChild(td("R$ " + reg.Valor.toFixed(2)));
    tr.appendChild(td("R$ " + precoPorLitro));
    tr.appendChild(td(reg.Tecnico));
    tr.appendChild(td(reg.Observacao));

    const tdAcoes = document.createElement("td");
    tdAcoes.className = "acoes";
    tdAcoes.innerHTML = `
      <button onclick="editarRegistro('${nomeAba}', ${index})">✏️</button>
      <button onclick="deletarRegistro('${nomeAba}', ${index})">❌</button>`;
    tr.appendChild(tdAcoes);

    tbody.appendChild(tr);
  });
}

function editarRegistro(dia, index) {
  const reg = dadosPorDia[dia][index];
  if (!reg) return;

  document.getElementById("placa").value = reg.Placa;
  document.getElementById("kmAtual").value = reg.KmAtual;
  document.getElementById("litros").value = reg.Litros;
  document.getElementById("valor").value = reg.Valor;
  document.getElementById("tecnico").value = reg.Tecnico;
  document.getElementById("observacao").value = reg.Observacao;

  editandoRegistro = { dia, index };
  document.querySelector('button[type="submit"]').textContent = "Atualizar";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function deletarRegistro(dia, index) {
  if (confirm("Deseja realmente excluir este registro?")) {
    dadosPorDia[dia].splice(index, 1);
    if (dadosPorDia[dia].length === 0) delete dadosPorDia[dia];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dadosPorDia));
    alert("Registro excluído com sucesso!");
    preencherDias();
    atualizarTabela(document.getElementById("selecionarDia").value);
  }
}

function exportarExcel() {
  const wb = XLSX.utils.book_new();
  const diasOrdenados = Object.keys(dadosPorDia).sort(
    (a, b) => parseInt(a.replace("Dia ", "")) - parseInt(b.replace("Dia ", ""))
  );

  for (const dia of diasOrdenados) {
    const registrosFormatados = dadosPorDia[dia].map((reg) => ({
      "Data": reg.Data,
      "Hora": reg.Hora,
      "Placa": reg.Placa,
      "KM Atual": reg.KmAtual,
      "Litros": reg.Litros,
      "Valor (R$)": reg.Valor.toFixed(2),
      "Preço por Litro (R$)": reg.Litros > 0 ? (reg.Valor / reg.Litros).toFixed(2) : "0.00",
      "Motorista": reg.Tecnico,
      "Observações": reg.Observacao,
    }));

    const ws = XLSX.utils.json_to_sheet(registrosFormatados);
    XLSX.utils.book_append_sheet(wb, ws, dia);
  }

  XLSX.writeFile(wb, "controle_abastecimento.xlsx");
}

function fazerLogout() {
  if (confirm("Deseja realmente sair?")) {
    localStorage.clear();
    alert("Você saiu do sistema.");
    location.reload();
  }
    }
