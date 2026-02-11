namespace ExpenseControl.Api.Contracts.Reports;

public record PeopleTotalsReportResponse(
    IReadOnlyCollection<PersonTotalsResponse> Items,
    TotalsSummaryResponse Summary);
