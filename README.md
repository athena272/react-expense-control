# Controle de Gastos Residenciais

Sistema completo com API .NET e frontend React/TypeScript para controle de gastos residenciais.

## Tecnologias

- Backend: .NET 6 (C#) + Entity Framework Core + SQLite
- Frontend: React + TypeScript (Vite)

## Requisitos

- .NET 6 SDK
- Node.js 18+ (ou versão compatível com Vite 7)

## Como executar

### Backend

```bash
cd backend/ExpenseControl.Api
dotnet restore
dotnet run
```

O banco SQLite é criado automaticamente no primeiro `run` em `backend/ExpenseControl.Api/expensecontrol.db`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Por padrão, o backend roda em `http://localhost:5000` (definido em `backend/ExpenseControl.Api/Properties/launchSettings.json`).
Se a porta mudar, ajuste o frontend via `VITE_API_URL`:

```bash
# Windows (PowerShell)
$env:VITE_API_URL="http://localhost:5000"
npm run dev
```

Também é possível fixar a porta do backend usando a variável `ASPNETCORE_URLS`:

```bash
# Windows (PowerShell)
$env:ASPNETCORE_URLS="http://localhost:5000"
dotnet run
```

## Funcionalidades

- Cadastro de pessoas (criação, edição, deleção, listagem)
- Cadastro de categorias (criação, listagem)
- Cadastro de transações (criação, listagem)
- Totais por pessoa (receitas, despesas, saldo)
- Totais por categoria (receitas, despesas, saldo)

## Observações de negócio

- Menores de idade só podem registrar despesas.
- Categoria deve ser compatível com o tipo da transação.
- Ao deletar uma pessoa, todas as transações associadas são removidas.

