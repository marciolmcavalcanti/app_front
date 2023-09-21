/*
  -------------------------------------------------------------------------------------
  Limpa a tabela de bolões preparando para uma nova carga de dados
  -------------------------------------------------------------------------------------
*/
const limparTabela = () => {
  var table = document.getElementById('myTable');
  while (table.rows.length > 1) {
    table.deleteRow(1);
  }
}


/*
  --------------------------------------------------------------------------------------
  Função para obter a lista de bolões existente do servidor - Método GET
  --------------------------------------------------------------------------------------
*/
const getList = async () => {
  let url = 'http://127.0.0.1:5000/boloes';

  fetch(url, {
    method: 'get',
  })
    .then((response) => response.json())
    .then((data) => {
      limparTabela();
      data.boloes.forEach(item => insertList(item.id, item.nome, item.cotas, item.valor))
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}


/*
  --------------------------------------------------------------------------------------
  Função para adicionar um bolão no banco de dados - Método POST
  --------------------------------------------------------------------------------------
*/
const postItem = async (inputProduct, inputQuantity, inputPrice) => {
  const formData = new FormData();
  formData.append('nome', inputProduct);
  formData.append('cotas', inputQuantity);
  formData.append('valor', inputPrice);

  let url = 'http://127.0.0.1:5000/add_bolao';
  fetch(url, {
    method: 'post',
    body: formData
  })
    .then((response) => {
      response.json();
      getList();
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}


/*
  --------------------------------------------------------------------------------------
  Função para criar um botão de excluir para cada item da lista
  --------------------------------------------------------------------------------------
*/
const insertButton = (parent) => {
  let span = document.createElement("span");
  let imgExcluir = document.createElement("img");
  imgExcluir.src = "img/lixeira.png";
  span.className = "close";
  span.appendChild(imgExcluir);
  parent.appendChild(span);
}


/*
  --------------------------------------------------------------------------------------
  Função para remover um item da lista de acordo com o click no botão close
  --------------------------------------------------------------------------------------
*/
const removeElement = () => {
  let close = document.getElementsByClassName("close");
  let i;
  for (i = 0; i < close.length; i++) {
    close[i].onclick = function () {
      let div = this.parentElement.parentElement;
      const idItem = div.getElementsByTagName('td')[0].innerHTML
      if (confirm("Você tem certeza?")) {
        div.remove()
        deleteItem(idItem)
        alert("Removido!")
      }
    }
  }
}


/*
  --------------------------------------------------------------------------------------
  Função para deletar um Boão no banco de dados - Método DELETE
  --------------------------------------------------------------------------------------
*/
const deleteItem = (idItem) => {
  console.log(idItem)
  let url = 'http://127.0.0.1:5000/bolao?id=' + idItem;
  fetch(url, {
    method: 'delete'
    })
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error:', error);
    });
}


/*
  -----------------------------------------------------------------------------------------
  Função para adicionar um novo Bolão no banco de dados e atualizar a Tabela da Página
  -----------------------------------------------------------------------------------------
*/
const newItem = () => {
  let inputProduct = document.getElementById("newInput").value;
  let inputQuantity = document.getElementById("newQuantity").value;
  let inputPrice = document.getElementById("newPrice").value;

  if (inputProduct === '') {
    alert("Informe o nome do Bolão!");
  } else if (isNaN(inputQuantity) || (inputQuantity === "") || isNaN(inputPrice) || (inputPrice === "")) {
    alert("Cotas e valor precisam ser números!");
  } else {

    // Adiciona no banco de dados
    postItem(inputProduct, inputQuantity, inputPrice);    
    
    alert("Bolão adicionado!");
  }
}


/*
  -----------------------------------------------------------------------------------------
  Função para buscar bolões de uma determinada loteria - Método GET
  -----------------------------------------------------------------------------------------
*/
const findItens = () => {
  let nomeBolao = document.getElementById("newInput").value;
  let url = 'http://127.0.0.1:5000/bolao?nome=' + nomeBolao;

  if (nomeBolao === '') {
    //alert("Informe o nome do Bolão!");
    getList();
  } else {
    fetch(url, {
      method: 'get'
      })
      .then((response) => response.json())
      .then((data) => {
        limparTabela();
        data.boloes.forEach(item => insertList(item.id, item.nome, item.cotas, item.valor))
      })
      .catch((error) => {
        alert("Nenhum bolão encontrado para a Loteria selecionada!");
      });
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para inserir Bolões na Tabela da Página
  --------------------------------------------------------------------------------------
*/
const insertList = (idBolao, nameProduct, quantity, price) => {
  var item = [idBolao, nameProduct, quantity, price]
  var table = document.getElementById('myTable');
  var row = table.insertRow();
  let valor = 0;

  // Adiciona o novo bolão na tabela
  for (var i = 0; i < item.length; i++) {
    var cel = row.insertCell(i);

    if (i == 3) {
      valor = item[i];
      cel.textContent = valor.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});
    } else {
      cel.textContent = item[i];
    }
    
    ultimoId = item[0];
  }

  // Cria o botão de excluir o item da tabela
  insertButton(row.insertCell(-1))

  // Limpa os campos de inserção dos dados
  document.getElementById("newInput").value = "";
  document.getElementById("newQuantity").value = "";
  document.getElementById("newPrice").value = "";

  removeElement()
}


/*
  --------------------------------------------------------------------------------------
  Chamada da função para carregamento inicial dos dados
  --------------------------------------------------------------------------------------
*/
getList();