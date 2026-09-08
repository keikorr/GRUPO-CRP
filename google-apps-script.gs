/**
 * Raio-X do Posto — Grupo CRP
 * Recebe cada resposta do formulário (via POST) e grava como uma nova
 * linha na planilha ativa. As colunas se ajustam automaticamente: se o
 * site enviar um campo novo, uma nova coluna é criada sozinha — não é
 * preciso editar este script quando as perguntas mudarem.
 *
 * INSTALAÇÃO
 * 1. Crie uma planilha nova em sheets.new
 * 2. Menu Extensões > Apps Script
 * 3. Apague o conteúdo padrão (Code.gs) e cole todo este arquivo
 * 4. Clique em Implantar > Nova implantação
 *    - Tipo: App da Web
 *    - Executar como: Eu (sua conta)
 *    - Quem pode acessar: Qualquer pessoa
 * 5. Autorize as permissões pedidas (é o seu próprio script, é seguro)
 * 6. Copie a "URL do app da Web" gerada
 * 7. Cole essa URL na constante SHEETS_WEBHOOK_URL, no topo do script.js
 *
 * Toda vez que alguém terminar o Raio-X no site, uma linha nova aparece
 * aqui na planilha. Para baixar como CSV: Arquivo > Fazer download >
 * Valores separados por vírgula (.csv).
 */

function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);

  var lastCol = sheet.getLastColumn();
  var headers = lastCol > 0 ? sheet.getRange(1, 1, 1, lastCol).getValues()[0] : [];

  Object.keys(data).forEach(function (key) {
    if (headers.indexOf(key) === -1) {
      headers.push(key);
      sheet.getRange(1, headers.length).setValue(key);
    }
  });

  var row = headers.map(function (h) {
    return Object.prototype.hasOwnProperty.call(data, h) ? data[h] : "";
  });
  sheet.appendRow(row);

  return ContentService
    .createTextOutput(JSON.stringify({ status: "ok" }))
    .setMimeType(ContentService.MimeType.JSON);
}
