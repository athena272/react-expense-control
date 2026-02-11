using System.ComponentModel.DataAnnotations;
using ExpenseControl.Api.Domain.Enums;

namespace ExpenseControl.Api.Domain.Entities;

public class Category
{
    public int Id { get; set; }

    [MaxLength(400)]
    public string Description { get; set; } = string.Empty;

    public CategoryPurpose Purpose { get; set; }

    public ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
}
