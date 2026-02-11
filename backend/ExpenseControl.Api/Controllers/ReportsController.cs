using ExpenseControl.Api.Contracts.Reports;
using ExpenseControl.Api.Data;
using ExpenseControl.Api.Domain.Enums;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ExpenseControl.Api.Controllers;

[ApiController]
[Route("api/reports")]
public class ReportsController : ControllerBase
{
    private readonly AppDbContext _dbContext;

    public ReportsController(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet("people-totals")]
    public async Task<ActionResult<PeopleTotalsReportResponse>> GetPeopleTotalsAsync()
    {
        // SQLite não suporta SUM com decimal direto via LINQ para SQL.
        // Por isso materializamos e agregamos em memória.
        var people = await _dbContext.People
            .AsNoTracking()
            .Include(person => person.Transactions)
            .OrderBy(person => person.Name)
            .ToListAsync();

        var peopleTotals = people
            .Select(person =>
            {
                var totalIncome = person.Transactions
                    .Where(transaction => transaction.Type == TransactionType.Income)
                    .Sum(transaction => transaction.Value);
                var totalExpense = person.Transactions
                    .Where(transaction => transaction.Type == TransactionType.Expense)
                    .Sum(transaction => transaction.Value);

                return new PersonTotalsResponse(
                    person.Id,
                    person.Name,
                    totalIncome,
                    totalExpense,
                    0);
            })
            .ToList();

        var normalizedPeople = peopleTotals
            .Select(item =>
                item with
                {
                    Balance = item.TotalIncome - item.TotalExpense
                })
            .ToList();

        var totalIncome = normalizedPeople.Sum(item => item.TotalIncome);
        var totalExpense = normalizedPeople.Sum(item => item.TotalExpense);
        var summary = new TotalsSummaryResponse(totalIncome, totalExpense, totalIncome - totalExpense);

        return Ok(new PeopleTotalsReportResponse(normalizedPeople, summary));
    }

    [HttpGet("category-totals")]
    public async Task<ActionResult<CategoryTotalsReportResponse>> GetCategoryTotalsAsync()
    {
        // SQLite não suporta SUM com decimal direto via LINQ para SQL.
        var categories = await _dbContext.Categories
            .AsNoTracking()
            .Include(category => category.Transactions)
            .OrderBy(category => category.Description)
            .ToListAsync();

        var categoryTotals = categories
            .Select(category =>
            {
                var totalIncome = category.Transactions
                    .Where(transaction => transaction.Type == TransactionType.Income)
                    .Sum(transaction => transaction.Value);
                var totalExpense = category.Transactions
                    .Where(transaction => transaction.Type == TransactionType.Expense)
                    .Sum(transaction => transaction.Value);

                return new CategoryTotalsResponse(
                    category.Id,
                    category.Description,
                    totalIncome,
                    totalExpense,
                    0);
            })
            .ToList();

        var normalizedCategories = categoryTotals
            .Select(item =>
                item with
                {
                    Balance = item.TotalIncome - item.TotalExpense
                })
            .ToList();

        var totalIncome = normalizedCategories.Sum(item => item.TotalIncome);
        var totalExpense = normalizedCategories.Sum(item => item.TotalExpense);
        var summary = new TotalsSummaryResponse(totalIncome, totalExpense, totalIncome - totalExpense);

        return Ok(new CategoryTotalsReportResponse(normalizedCategories, summary));
    }
}
