using ExpenseControl.Api.Domain.Enums;

namespace ExpenseControl.Api.Contracts.Transactions;

public record TransactionResponse(
    int Id,
    string Description,
    decimal Value,
    TransactionType Type,
    int CategoryId,
    string CategoryDescription,
    int PersonId,
    string PersonName);
