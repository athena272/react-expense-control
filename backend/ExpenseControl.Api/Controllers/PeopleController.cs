using ExpenseControl.Api.Contracts.People;
using ExpenseControl.Api.Data;
using ExpenseControl.Api.Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ExpenseControl.Api.Controllers;

[ApiController]
[Route("api/people")]
public class PeopleController : ControllerBase
{
    private readonly AppDbContext _dbContext;

    public PeopleController(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<PersonResponse>>> GetAllAsync()
    {
        var people = await _dbContext.People
            .AsNoTracking()
            .OrderBy(person => person.Name)
            .Select(person => new PersonResponse(person.Id, person.Name, person.Age))
            .ToListAsync();

        return Ok(people);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<PersonResponse>> GetById(int id)
    {
        var person = await _dbContext.People
            .AsNoTracking()
            .FirstOrDefaultAsync(item => item.Id == id);

        if (person is null)
        {
            return NotFound();
        }

        return Ok(new PersonResponse(person.Id, person.Name, person.Age));
    }

    [HttpPost]
    public async Task<ActionResult<PersonResponse>> CreateAsync(PersonCreateRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Name) || request.Name.Length > 200)
        {
            return BadRequest("Nome é obrigatório e deve ter no máximo 200 caracteres.");
        }

        if (request.Age < 0)
        {
            return BadRequest("Idade deve ser um valor não negativo.");
        }

        var person = new Person
        {
            Name = request.Name.Trim(),
            Age = request.Age
        };

        _dbContext.People.Add(person);
        await _dbContext.SaveChangesAsync();

        // ASP.NET remove o sufixo "Async" no nome da action ao gerar rotas,
        // então este método não usa "Async" para manter o CreatedAtAction consistente.
        var response = new PersonResponse(person.Id, person.Name, person.Age);
        return CreatedAtAction(nameof(GetById), new { id = person.Id }, response);
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<PersonResponse>> UpdateAsync(int id, PersonUpdateRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Name) || request.Name.Length > 200)
        {
            return BadRequest("Nome é obrigatório e deve ter no máximo 200 caracteres.");
        }

        if (request.Age < 0)
        {
            return BadRequest("Idade deve ser um valor não negativo.");
        }

        var person = await _dbContext.People.FirstOrDefaultAsync(item => item.Id == id);
        if (person is null)
        {
            return NotFound();
        }

        person.Name = request.Name.Trim();
        person.Age = request.Age;

        await _dbContext.SaveChangesAsync();

        return Ok(new PersonResponse(person.Id, person.Name, person.Age));
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteAsync(int id)
    {
        var person = await _dbContext.People.FirstOrDefaultAsync(item => item.Id == id);
        if (person is null)
        {
            return NotFound();
        }

        // Regra: ao deletar pessoa, remove todas as transações associadas (cascade).
        _dbContext.People.Remove(person);
        await _dbContext.SaveChangesAsync();

        return NoContent();
    }
}
