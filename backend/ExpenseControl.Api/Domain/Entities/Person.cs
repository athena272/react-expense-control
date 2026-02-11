using System.ComponentModel.DataAnnotations;

namespace ExpenseControl.Api.Domain.Entities;

public class Person
{
    public int Id { get; set; }

    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    public int Age { get; set; }

    public ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
}
