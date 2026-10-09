# NSEC

Site institucional estático, em português, com demonstrações locais de segurança ofensiva.

## Desenvolvimento

Requer Node.js 20 ou superior.

```sh
npm ci
npm run build
npm test
npm run preview
```

Abra http://127.0.0.1:4173. A pasta `dist/` é gerada pela compilação e não é versionada.
Edite `index.html`, `css/` e `js/`, execute a compilação novamente e atualize a página.
Tailwind e os ícones Lucide utilizados são compilados localmente; o navegador não depende de CDNs ou fontes externas.

## Publicação

O arquivo `vercel.json` define `npm run build` e a pasta de saída `dist`.
Revise o deploy de prévia antes de integrar alterações na branch de produção.
As URLs canônicas apontam para https://nsec-tawny.vercel.app/; atualize os metadados ao configurar um domínio próprio.

## Contato e demonstrações

O formulário prepara uma mensagem localmente e oferece um link `mailto:` para `contato@nsec.com.br`.
O visitante precisa revisar e enviar a mensagem em seu aplicativo de e-mail. Não há backend de envio, armazenamento de dados nem confirmação falsa de recebimento.
A mensagem também fica disponível para cópia manual, caso não exista um aplicativo de e-mail configurado.
Confirme que essa caixa de e-mail recebe mensagens antes de usar o fluxo comercialmente.

O simulador, a tabela e os exemplos dos artigos usam dados fictícios e não executam testes contra sistemas reais.
A calculadora fornece apenas uma estimativa preliminar. As métricas comerciais existentes foram preservadas e devem ser validadas pelo responsável pelo site.
Links sociais sem destino confirmado e links legais vazios foram removidos. Políticas legais e outros perfis devem ser adicionados quando houver conteúdo e URLs aprovados.

## Validação

`npm test` verifica sintaxe, o carregamento do conjunto de dados, integridade dos arquivos compilados, âncoras e metadados.
Ao alterar interações, confira também menu móvel, filtros e pesquisa, calculadora, artigos e diálogos com teclado (Tab, Shift+Tab e Escape).
