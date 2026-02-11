using ExpenseControl.Api.Domain.Enums;

namespace ExpenseControl.Api.Contracts.Categories;

public record CategoryResponse(int Id, string Description, CategoryPurpose Purpose);
