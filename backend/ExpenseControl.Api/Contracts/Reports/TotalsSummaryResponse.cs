namespace ExpenseControl.Api.Contracts.Reports;

public record TotalsSummaryResponse(decimal TotalIncome, decimal TotalExpense, decimal Balance);
