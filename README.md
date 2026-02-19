# Casas - Análise de Imóveis 🏠

Este projeto é um catálogo interativo para análise e gerenciamento de imóveis para alugar. Ele permite listar propriedades, filtrar por critérios e cadastrar novas casas com suporte a upload de fotos e armazenamento em nuvem.

## 🚀 Funcionalidades

- **Catálogo Interativo**: Visualização de casas disponíveis com fotos e detalhes.
- **Filtros Avançados**: Busca por bairro, preço, número de quartos, etc.
- **Formulário de Cadastro**: Registro de novos imóveis de forma intuitiva.
- **Upload de Fotos**: Suporte a múltiplas imagens com **compressão automática** via Canvas API para otimizar o armazenamento.
- **Persistência de Dados**: Integração total com **Firebase Firestore**.
- **Segurança**: Arquitetura preparada para proteger chaves de API e regras de acesso ao banco de dados.

## 🛠️ Tecnologias Utilizadas

- **Frontend**: HTML5, CSS3 (Vanilla), JavaScript (ES6+).
- **Backend/Database**: [Firebase](https://firebase.google.com/) (Firestore).
- **Testes**: [Vitest](https://vitest.dev/).
- **Arquitetura**: Módulos ES6 para organização de serviços e componentes.

## 📦 Estrutura do Projeto

```text
/
├── index.html          # Página principal da aplicação
├── css/                # Folhas de estilo
├── js/                 # Lógica da aplicação
│   ├── firebase-service.js     # Integração com Firestore
│   ├── firebase-config.js      # Configurações (Privado - Ignorado pelo Git)
│   ├── firebase-config.example.js # Modelo de configuração
│   └── ...                     # Outros módulos de UI e lógica
├── tests/              # Testes unitários e de integração
├── firestore.rules     # Regras de segurança para o Firestore
└── README.md           # Esta documentação
```

## ⚙️ Configuração Inicial

### Pré-requisitos
- Servidor local (ex: Extensão "Live Server" no VS Code ou `npx serve`).

### Instalação

1. Clone o repositório ou baixe os arquivos.
2. No diretório raiz, instale as dependências (para testes):
   ```bash
   npm install
   ```

### Configuração do Firebase (CRÍTICO)

Para segurança, o projeto utiliza um arquivo de configuração separado que não é enviado para o controle de versão.

1. Navegue até a pasta `js/`.
2. Duplique o arquivo `firebase-config.example.js` e renomeie-o para `firebase-config.js`.
3. Abra `js/firebase-config.js` e preencha com suas credenciais obtidas no **Firebase Console**.

## 🛡️ Segurança e Boas Práticas

### Proteção de Chaves
O arquivo `js/firebase-config.js` está incluído no `.gitignore`. **Nunca remova esta proteção**, pois ela impede o vazamento de suas chaves de API no GitHub.

### Regras de Banco de Dados
Para proteger seus dados contra acessos não autorizados, aplique o conteúdo do arquivo `firestore.rules` no seu painel do Firebase:
1. Vá em **Firestore Database** > **Rules**.
2. Cole o conteúdo do arquivo e clique em **Publish**.

## 🧪 Como Rodar os Testes

Este projeto utiliza Vitest para garantir a qualidade do código.

```bash
# Rodar testes uma única vez
npm test

# Rodar em modo watch (desenvolvimento)
npm run test:watch
```

---
Desenvolvido para análise e catálogo de imóveis.
