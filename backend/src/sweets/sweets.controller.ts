@Controller('sweets')
export class SweetsController {
  constructor(private readonly sweetsService: SweetsService) {}

  // PUBLIC
  @Get()
  findAll() {
    return this.sweetsService.findAll();
  }

  // PUBLIC (must be BEFORE :id)
  @Get('search')
  search(
    @Query('name') name?: string,
    @Query('category') category?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
  ) {
    return this.sweetsService.search({
      name,
      category,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
    });
  }

  // PUBLIC
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sweetsService.findOne(id);
  }

  // PROTECTED
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createSweetDto: CreateSweetDto) {
    return this.sweetsService.create(createSweetDto);
  }

  // PROTECTED
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateSweetDto: UpdateSweetDto) {
    return this.sweetsService.update(id, updateSweetDto);
  }

  // ADMIN
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sweetsService.remove(id);
  }
}



