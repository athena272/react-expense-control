using ExpenseControl.Api.Domain.Enums;

namespace ExpenseControl.Api.Contracts.Categories;

public record CategoryCreateRequest(string Description, CategoryPurpose Purpose);
