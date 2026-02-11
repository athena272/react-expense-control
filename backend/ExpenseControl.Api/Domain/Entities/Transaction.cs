using System.ComponentModel.DataAnnotations;
using ExpenseControl.Api.Domain.Enums;

namespace ExpenseControl.Api.Domain.Entities;

public class Transaction
{
    public int Id { get; set; }

    [MaxLength(400)]
    public string Description { get; set; } = string.Empty;

    public decimal Value { get; set; }

    public TransactionType Type { get; set; }

    public int CategoryId { get; set; }

    public Category? Category { get; set; }

    public int PersonId { get; set; }

    public Person? Person { get; set; }
}
