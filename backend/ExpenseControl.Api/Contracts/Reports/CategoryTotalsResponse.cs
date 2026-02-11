namespace ExpenseControl.Api.Contracts.Reports;

public record CategoryTotalsResponse(
    int CategoryId,
    string CategoryDescription,
    decimal TotalIncome,
    decimal TotalExpense,
    decimal Balance);
