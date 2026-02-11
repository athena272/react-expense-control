namespace ExpenseControl.Api.Contracts.Reports;

public record PersonTotalsResponse(
    int PersonId,
    string PersonName,
    decimal TotalIncome,
    decimal TotalExpense,
    decimal Balance);
