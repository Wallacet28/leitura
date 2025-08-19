const STORAGE_KEY = "cadastro_leitura";

let dadosPorDia = {};
let editandoRegistro = null;

window.onload = () => {
  const data = new Date();
  const nomeMes = data.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  document.getElementById("mesAtual").textContent = nomeMes.charAt(0).toUpperCase() + nomeMes.slice(1);

  const salvo = localStorage.getItem(STORAGE_KEY);
  if (salvo) dadosPorDia = JSON.parse(salvo);

  preencherDias();
  atualizarTabela();
};

document.getElementById("formulario").addEventListener("submit", function (e) {
  e.preventDefault();

  const agora = new Date();
  const dia = agora.getDate().toString().padStart(2, "0");
  const nomeAba = "Dia " + dia;

  const registro = {
    Data: agora.toLocaleDateString(),
    Hora: agora.toLocaleTimeString(),
    Nome: document.getElementById("nome").value,
    Endereco: document.getElementById("endereco").value,
    Rota: document.getElementById("rota").value,
    Ligacao: document.getElementById("ligacao").value,
    NumeroHidro: document.getElementById("numeroHidro").value,
    LeituraAnterior: document.getElementById("leituraAnterior").value,
    LeituraAtual: document.getElementById("leituraAtual").value,
    Lacre: document.getElementById("lacre").value,
    Observacao: document.getElementById("observacao").value,
    Assinatura: document.getElementById("assinatura").value,
  };

  if (editandoRegistro !== null) {
    dadosPorDia[editandoRegistro.dia][editandoRegistro.index] = registro;
    editandoRegistro = null;
  } else {
    if (!dadosPorDia[nomeAba]) dadosPorDia[nomeAba] = [];
    dadosPorDia[nomeAba].push(registro);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(dadosPorDia));
  alert("Registro salvo com sucesso!");

  this.reset();
  document.querySelector('button[type="submit"]').textContent = "Salvar";
  preencherDias();
  atualizarTabela(document.getElementById("selecionarDia").value || nomeAba);
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

    tr.appendChild(td(reg.Data));
    tr.appendChild(td(reg.Hora));
    tr.appendChild(td(reg.Nome));
    tr.appendChild(td(reg.Endereco));
    tr.appendChild(td(reg.Rota));
    tr.appendChild(td(reg.Ligacao));
    tr.appendChild(td(reg.NumeroHidro));
    tr.appendChild(td(reg.LeituraAnterior));
    tr.appendChild(td(reg.LeituraAtual));
    tr.appendChild(td(reg.Lacre));
    tr.appendChild(td(reg.Observacao));
    tr.appendChild(td(reg.Assinatura));

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
  const registro = dadosPorDia[dia][index];
  if (!registro) return;

  document.getElementById("nome").value = registro.Nome;
  document.getElementById("endereco").value = registro.Endereco;
  document.getElementById("rota").value = registro.Rota;
  document.getElementById("ligacao").value = registro.Ligacao;
  document.getElementById("numeroHidro").value = registro.NumeroHidro;
  document.getElementById("leituraAnterior").value = registro.LeituraAnterior;
  document.getElementById("leituraAtual").value = registro.LeituraAtual;
  document.getElementById("lacre").value = registro.Lacre;
  document.getElementById("observacao").value = registro.Observacao;
  document.getElementById("assinatura").value = registro.Assinatura;

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
      "Nome": reg.Nome,
      "Endereço": reg.Endereco,
      "Rota": reg.Rota,
      "Ligação": reg.Ligacao,
      "Número do Hidrômetro": reg.NumeroHidro,
      "Leitura Anterior": reg.LeituraAnterior,
      "Leitura Atual": reg.LeituraAtual,
      "Lacre": reg.Lacre,
      "Observação": reg.Observacao,
      "Assinatura": reg.Assinatura,
    }));

    const ws = XLSX.utils.json_to_sheet(registrosFormatados);
    XLSX.utils.book_append_sheet(wb, ws, dia);
  }

  XLSX.writeFile(wb, "cadastro_hidrometros.xlsx");
}

function fazerLogout() {
  if (confirm("Deseja realmente sair?")) {
    localStorage.removeItem("AUTH_KEY");
    window.location.href = "login.html";
  }
}
