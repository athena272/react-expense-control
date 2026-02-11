using ExpenseControl.Api.Domain.Enums;

namespace ExpenseControl.Api.Contracts.Transactions;

public record TransactionCreateRequest(
    string Description,
    decimal Value,
    TransactionType Type,
    int CategoryId,
    int PersonId);
