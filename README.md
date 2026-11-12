# N7 Code Arena — site de apresentação

Site estático publicado em https://www.nsectech.com.br/ pelo repositório normanff/Nsec e Vercel. Esta revisão mantém HTML, CSS e JavaScript existentes; não inclui a migração Next.js cancelada.

## Desenvolvimento

Node.js 20 ou superior. Execute `npm ci`, `npm run build`, `npm test` e `npm run preview`. A prévia fica em http://127.0.0.1:4181. O build substitui somente `dist/`, dentro do projeto. A Vercel usa essa pasta conforme `vercel.json`.

## Revisão editorial e visual — novembro de 2026

- Título: “Saia do tutorial e escreva seu próprio código”, sem pontuação.
- Retirado o destaque da contagem de atividades. Os 49 módulos correspondem ao currículo real do aplicativo.
- Textos tratam situações de estudo e exemplos de projetos existentes, sem inventar depoimentos, resultados ou história do fundador.
- Monograma 3D, movimento contínuo e botão de pausa removidos.
- `assets/code-arena-academy.jpg` é uma captura real da beta 23 no tema Obsidian Red, feita em sessão de teste sem login. Não é uma simulação gráfica. A imagem pode ser aberta em tamanho original.
- Botões de download e manual têm ícones SVG próprios, relevo suave e detalhes alinhados à identidade N7. Download permanece desativado, com explicação visível.
- O manual de instalação e todos os links de navegação foram preservados.

## Contato e limites

Os oito recursos estão no HTML e podem ser lidos sem JavaScript. NORI online e Battle Arena 1v1 continuam identificados como futuros. Sem preço, checkout ou link de executável inventado.

O formulário prepara um rascunho local de e-mail. O visitante revisa e envia no próprio aplicativo de e-mail; nada é enviado automaticamente. Endereço confirmado: normanff57@gmail.com. Nenhum teste deve enviar mensagens reais.

## Verificar

`npm test` confere scripts, arquivos publicados, IDs, âncoras, rótulos, metadados e conteúdo. Conferir também menu móvel, recursos expansíveis, abertura da captura, manual, formulário, foco e movimento reduzido no navegador. Não publicar node_modules, relatórios de teste ou capturas alternativas.

## Visual atual

Referência fornecida pelo usuário: fundo azul claro, títulos azul-marinho, botões ciano e tipografia Inter sem serifa. Captura real preservada. Entrada suave, feedback nos controles, recursos expansíveis e navegação com indicação da seção visível. As animações respeitam prefers-reduced-motion. Download desativado; manual disponível.

Inter hospedada localmente sob SIL OFL, com licença em assets/Inter-LICENSE.txt. Verificação em 320, 390, 768 e 1440 px, sem overflow e sem violações axe WCAG A/AA detectadas; menu, formulário e manual conferidos.
