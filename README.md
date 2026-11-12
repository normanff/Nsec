# UNIO Code — site de apresentação

Site oficial em https://www.nsectech.com.br/ . Repositório normanff/Nsec, publicação pela Vercel a partir de main. HTML, CSS, JavaScript e esbuild; não utiliza Next.js.

## Desenvolvimento

Node.js 20 ou superior. Execute `npm ci`, `npm run build`, `npm test` e `npm run preview`. Prévia em http://127.0.0.1:4181. O build substitui somente a pasta dist dentro do projeto; a Vercel publica essa pasta.

## Marca e documentação

UNIO Code é o novo nome do Code Arena. Veja [Identidade visual](IDENTIDADE-VISUAL.md) para paleta, tipografia, símbolo, arquitetura UNIO Learn / UNIO Arena / UNIO Cloud e regras de transição.

O manual público está em manual-instalacao.html. Ele explica que a beta 23, seus arquivos e menus ainda podem usar N7 Code Arena ou Code Arena. Esta entrega não renomeia o aplicativo, serviços, autenticação ou dados locais.

Paleta principal: #E10600, #7A0000, #0B0B0B, #1A1A1A, #2E2E2E e #C9C9C9. Inter hospedada localmente sob SIL OFL, com licença em assets/Inter-LICENSE.txt. Favicon e assinatura usam infinito vetorial simplificado inspirado no painel fornecido.

## Conteúdo e limites

Captura real da beta 23 mantida sem manipulação e identificada como anterior à nova marca. O arquivo assets/code-arena-academy.jpg preserva seu nome histórico para evitar quebrar links externos. Botão Baixar UNIO Code desativado, manual acessível. Sem preços, promoções, garantia ou depoimentos inventados. NORI online e Battle Arena 1v1 continuam futuros; UNIO Cloud descreve a sincronização existente, não hospedagem de aplicativos.

O formulário prepara um rascunho no aplicativo de e-mail do visitante; não envia mensagens automaticamente. Contato preservado: normanff57@gmail.com. Testes não devem enviar e-mails.

## Movimento e validação

Faixa vermelha com rolagem horizontal sem botão, conforme pedido. Sem JavaScript ou com movimento reduzido, conteúdo estático. Duplicação visual oculta de leitores de tela.

`npm test` valida scripts, arquivos, links internos, IDs e conteúdo básico. Conferir também menu móvel, teclado, formulário, imagem, manual, faixa e movimento reduzido. Revisão atual em 320, 390, 768 e 1440 px sem overflow ou violações detectadas pelo axe nos cenários testados. A verificação automática não substitui auditoria manual completa.

Publicar apenas os arquivos de produção, documentação e testes necessários; não incluir scripts locais de edição, node_modules ou capturas de QA.
