using ExpenseControl.Api.Contracts.Transactions;
using ExpenseControl.Api.Data;
using ExpenseControl.Api.Domain.Entities;
using ExpenseControl.Api.Domain.Enums;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ExpenseControl.Api.Controllers;

[ApiController]
[Route("api/transactions")]
public class TransactionsController : ControllerBase
{
    private readonly AppDbContext _dbContext;

    public TransactionsController(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TransactionResponse>>> GetAllAsync()
    {
        var transactions = await _dbContext.Transactions
            .AsNoTracking()
            .Include(transaction => transaction.Person)
            .Include(transaction => transaction.Category)
            .OrderByDescending(transaction => transaction.Id)
            .Select(transaction => new TransactionResponse(
                transaction.Id,
                transaction.Description,
                transaction.Value,
                transaction.Type,
                transaction.CategoryId,
                transaction.Category!.Description,
                transaction.PersonId,
                transaction.Person!.Name))
            .ToListAsync();

        return Ok(transactions);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<TransactionResponse>> GetById(int id)
    {
        var transaction = await _dbContext.Transactions
            .AsNoTracking()
            .Include(item => item.Person)
            .Include(item => item.Category)
            .FirstOrDefaultAsync(item => item.Id == id);

        if (transaction is null)
        {
            return NotFound();
        }

        return Ok(new TransactionResponse(
            transaction.Id,
            transaction.Description,
            transaction.Value,
            transaction.Type,
            transaction.CategoryId,
            transaction.Category!.Description,
            transaction.PersonId,
            transaction.Person!.Name));
    }

    [HttpPost]
    public async Task<ActionResult<TransactionResponse>> CreateAsync(TransactionCreateRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Description) || request.Description.Length > 400)
        {
            return BadRequest("Descrição é obrigatória e deve ter no máximo 400 caracteres.");
        }

        if (request.Value <= 0)
        {
            return BadRequest("Valor deve ser um número positivo.");
        }

        var person = await _dbContext.People.FirstOrDefaultAsync(item => item.Id == request.PersonId);
        if (person is null)
        {
            return BadRequest("Pessoa informada não existe.");
        }

        var category = await _dbContext.Categories.FirstOrDefaultAsync(item => item.Id == request.CategoryId);
        if (category is null)
        {
            return BadRequest("Categoria informada não existe.");
        }

        // Regra: menor de idade só pode registrar despesas.
        if (person.Age < 18 && request.Type != TransactionType.Expense)
        {
            return BadRequest("Pessoa menor de idade só pode registrar despesas.");
        }

        // Regra: categoria precisa ser compatível com o tipo da transação.
        var categoryAllowsType = request.Type switch
        {
            TransactionType.Expense => category.Purpose is CategoryPurpose.Expense or CategoryPurpose.Both,
            TransactionType.Income => category.Purpose is CategoryPurpose.Income or CategoryPurpose.Both,
            _ => false
        };

        if (!categoryAllowsType)
        {
            return BadRequest("A categoria escolhida não é compatível com o tipo da transação.");
        }

        var transaction = new Transaction
        {
            Description = request.Description.Trim(),
            Value = request.Value,
            Type = request.Type,
            CategoryId = category.Id,
            PersonId = person.Id
        };

        _dbContext.Transactions.Add(transaction);
        await _dbContext.SaveChangesAsync();

        // ASP.NET remove o sufixo "Async" no nome da action ao gerar rotas,
        // então este método não usa "Async" para manter o CreatedAtAction consistente.
        var response = new TransactionResponse(
            transaction.Id,
            transaction.Description,
            transaction.Value,
            transaction.Type,
            category.Id,
            category.Description,
            person.Id,
            person.Name);

        return CreatedAtAction(nameof(GetById), new { id = transaction.Id }, response);
    }
}
