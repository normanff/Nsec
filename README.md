# NSEC

Site institucional estático em português. HTML sem dependências de interface, CSS próprio e JavaScript limitado ao menu, controle de movimento e preparação do pedido por e-mail.

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

Os oito serviços estão no HTML e podem ser lidos sem JavaScript. A página explica escopo, processo e entregas; não apresenta números comerciais não confirmados, publicações fictícias, portal simulado ou previsão de prazo automática.

O formulário prepara uma mensagem localmente. O visitante precisa revisar e enviar pelo aplicativo de e-mail, ou copiar a mensagem. Não há backend de envio nem armazenamento de dados do formulário. O link direto de e-mail funciona sem JavaScript.

## Identidade e movimento

O monograma N é uma composição geométrica em CSS, com extrusão em camadas e movimento lento. Não usa imagem gerada, vídeo, WebGL, fonte ou biblioteca externa. O controle permite pausar o movimento; `prefers-reduced-motion` o desativa automaticamente. Sem JavaScript, o símbolo fica estático.

Preto, vermelho e tipografia ampla preservam a direção escolhida. Linhas de serviço expansíveis e uma seção clara para as entregas substituem a repetição de cartões.

## Verificação

`npm test` verifica scripts, arquivos publicados, IDs, âncoras, rótulos, metadados e conteúdo disponível sem JavaScript. Verifique no navegador menu móvel, serviços expansíveis, pausa do N, formulário e foco dos diálogos. Nenhum teste deve enviar e-mails reais.

## Referências de pesquisa

- Nielsen Norman Group, [Trustworthiness in Web Design](https://www.nngroup.com/articles/trustworthy-design/): conteúdo correto, transparência e organização específica do serviço.
- Anthropic, [Frontend Design](https://github.com/anthropics/claude-code/blob/main/plugins/frontend-design/skills/frontend-design/SKILL.md): evitar padrões genéricos e escolher uma direção adequada ao contexto.

Essas referências orientam decisões de design; não constituem um método para detectar autoria por IA.
