namespace ExpenseControl.Api.Contracts.Reports;

public record CategoryTotalsReportResponse(
    IReadOnlyCollection<CategoryTotalsResponse> Items,
    TotalsSummaryResponse Summary);
