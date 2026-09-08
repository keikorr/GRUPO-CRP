# Coletar as respostas do Raio-X numa planilha (exportável como CSV)

Cada vez que alguém termina o formulário, o site envia a resposta completa
(dados do lead + todas as perguntas + o resultado calculado) para uma
planilha do Google. Você exporta essa planilha como CSV quando quiser.

## Passo a passo (uma vez só)

1. Crie uma planilha nova: [sheets.new](https://sheets.new)
2. No menu, vá em **Extensões > Apps Script**
3. Apague o conteúdo que já vem escrito e cole todo o conteúdo do arquivo
   [`google-apps-script.gs`](google-apps-script.gs) (está na raiz do projeto)
4. Clique em **Implantar > Nova implantação**
   - Tipo: **App da Web**
   - Executar como: **Eu** (sua conta)
   - Quem pode acessar: **Qualquer pessoa**
5. Clique em **Implantar** e autorize as permissões pedidas (é o seu
   próprio script, pode aceitar)
6. Copie a **URL do app da Web** que aparece
7. Abra [`script.js`](script.js) neste projeto e cole a URL na constante
   `SHEETS_WEBHOOK_URL`, perto do topo do arquivo:

   ```js
   const SHEETS_WEBHOOK_URL = "https://script.google.com/macros/s/SEU_ID/exec";
   ```

Pronto. A partir daí, toda resposta completa vira uma linha nova na
planilha, com colunas para nome, posto, cidade, WhatsApp, cada pergunta
respondida e o percentual calculado para CapaXero, CRP Charge e CRP Tank.

## Exportar como CSV

Na planilha: **Arquivo > Fazer download > Valores separados por vírgula (.csv)**

## Se você mudar as perguntas do site

Não precisa editar o Apps Script — ele cria colunas novas sozinho quando
recebe um campo que ainda não existe na planilha.

## Nenhuma URL configurada?

Se `SHEETS_WEBHOOK_URL` estiver vazia (`""`), o site funciona normalmente
e simplesmente não envia nada — nada quebra.
