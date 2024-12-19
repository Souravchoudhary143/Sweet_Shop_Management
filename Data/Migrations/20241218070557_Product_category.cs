using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Sweet_Shop_Management.Data.Migrations
{
    /// <inheritdoc />
    public partial class Product_category : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Currency",
                table: "SweetItems",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "ProductCategoryId",
                table: "SweetItems",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "ProductCategory",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Category = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductCategory", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_SweetItems_ProductCategoryId",
                table: "SweetItems",
                column: "ProductCategoryId");

            migrationBuilder.AddForeignKey(
                name: "FK_SweetItems_ProductCategory_ProductCategoryId",
                table: "SweetItems",
                column: "ProductCategoryId",
                principalTable: "ProductCategory",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SweetItems_ProductCategory_ProductCategoryId",
                table: "SweetItems");

            migrationBuilder.DropTable(
                name: "ProductCategory");

            migrationBuilder.DropIndex(
                name: "IX_SweetItems_ProductCategoryId",
                table: "SweetItems");

            migrationBuilder.DropColumn(
                name: "Currency",
                table: "SweetItems");

            migrationBuilder.DropColumn(
                name: "ProductCategoryId",
                table: "SweetItems");
        }
    }
}
