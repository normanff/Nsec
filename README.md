# N7 Code Arena — site de apresentação

Site estático em português para apresentar o N7 Code Arena. HTML sem dependências de interface, CSS próprio e JavaScript limitado ao menu, controle de movimento e preparação de contato por e-mail.

## Desenvolvimento

Requer Node.js 20 ou superior.

```sh
npm ci
npm run build
npm test
npm run preview
```

Abra http://127.0.0.1:4173. O build substitui apenas a pasta gerada `dist/` dentro deste projeto. Edite `index.html`, `css/site.css` e `js/`, compile e atualize a prévia.

## Publicação

`vercel.json` define o comando de compilação e a saída `dist/`. Revise a prévia antes de integrar a mudança na branch de produção.
O endereço canônico é https://www.nsectech.com.br/. O e-mail de contato confirmado é **normanff57@gmail.com**.

## Conteúdo e contato

Os oito recursos estão no HTML e podem ser lidos sem JavaScript. A página apresenta a trilha de sete mundos, 49 módulos e 777 atividades, oficinas, Battle Time, revisão, NORI e progresso. Identifica a edição como beta e distingue orientação local de IA online futura. Não há preço, checkout ou download público inventado.

O formulário prepara uma mensagem localmente. O visitante precisa revisar e enviar pelo aplicativo de e-mail, ou copiar a mensagem. Não há backend de envio nem armazenamento de dados do formulário. O link direto de e-mail funciona sem JavaScript.

## Identidade e movimento

O monograma N é uma composição geométrica em CSS, com extrusão em camadas e movimento lento. Não usa imagem gerada, vídeo, WebGL, fonte ou biblioteca externa. O controle permite pausar o movimento; `prefers-reduced-motion` o desativa automaticamente. Sem JavaScript, o símbolo fica estático.

Preto, vermelho e tipografia ampla preservam a direção escolhida. Linhas de recursos expansíveis e uma seção clara sobre o percurso substituem a repetição de cartões.

## Verificação

`npm test` verifica scripts, arquivos publicados, IDs, âncoras, rótulos, metadados e conteúdo disponível sem JavaScript. Verifique no navegador menu móvel, recursos expansíveis, pausa do N, formulário e foco dos diálogos. Nenhum teste deve enviar e-mails reais.

## Conteúdo do Code Arena

O site apresenta o aplicativo Windows em beta, os recursos disponíveis e os que ainda estão planejados. Preço, data de lançamento e acesso público à beta não são anunciados sem confirmação. O contato prepara um rascunho de e-mail; não cadastra automaticamente em lista de espera.

O CSS, o monograma N e as animações foram preservados na adaptação editorial. O repositório mantém o domínio nsectech.com.br na configuração existente.
