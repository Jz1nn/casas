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
