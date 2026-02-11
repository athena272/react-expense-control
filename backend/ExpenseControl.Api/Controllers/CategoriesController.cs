using ExpenseControl.Api.Contracts.Categories;
using ExpenseControl.Api.Data;
using ExpenseControl.Api.Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ExpenseControl.Api.Controllers;

[ApiController]
[Route("api/categories")]
public class CategoriesController : ControllerBase
{
    private readonly AppDbContext _dbContext;

    public CategoriesController(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<CategoryResponse>>> GetAllAsync()
    {
        var categories = await _dbContext.Categories
            .AsNoTracking()
            .OrderBy(category => category.Description)
            .Select(category => new CategoryResponse(category.Id, category.Description, category.Purpose))
            .ToListAsync();

        return Ok(categories);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<CategoryResponse>> GetById(int id)
    {
        var category = await _dbContext.Categories
            .AsNoTracking()
            .FirstOrDefaultAsync(item => item.Id == id);

        if (category is null)
        {
            return NotFound();
        }

        return Ok(new CategoryResponse(category.Id, category.Description, category.Purpose));
    }

    [HttpPost]
    public async Task<ActionResult<CategoryResponse>> CreateAsync(CategoryCreateRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Description) || request.Description.Length > 400)
        {
            return BadRequest("Descrição é obrigatória e deve ter no máximo 400 caracteres.");
        }

        var category = new Category
        {
            Description = request.Description.Trim(),
            Purpose = request.Purpose
        };

        _dbContext.Categories.Add(category);
        await _dbContext.SaveChangesAsync();

        // ASP.NET remove o sufixo "Async" no nome da action ao gerar rotas,
        // então este método não usa "Async" para manter o CreatedAtAction consistente.
        var response = new CategoryResponse(category.Id, category.Description, category.Purpose);
        return CreatedAtAction(nameof(GetById), new { id = category.Id }, response);
    }
}
