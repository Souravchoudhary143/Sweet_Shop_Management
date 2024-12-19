using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Sweet_Shop_Management.Data.Migrations
{
    /// <inheritdoc />
    public partial class newColumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SweetItems_ProductCategories_ProductCategoryId",
                table: "SweetItems");

            migrationBuilder.DropIndex(
                name: "IX_SweetItems_ProductCategoryId",
                table: "SweetItems");

            migrationBuilder.DropColumn(
                name: "ProductCategoryId",
                table: "SweetItems");

            migrationBuilder.AddColumn<string>(
                name: "ProductCategory",
                table: "SweetItems",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ProductCategory",
                table: "SweetItems");

            migrationBuilder.AddColumn<int>(
                name: "ProductCategoryId",
                table: "SweetItems",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_SweetItems_ProductCategoryId",
                table: "SweetItems",
                column: "ProductCategoryId");

            migrationBuilder.AddForeignKey(
                name: "FK_SweetItems_ProductCategories_ProductCategoryId",
                table: "SweetItems",
                column: "ProductCategoryId",
                principalTable: "ProductCategories",
                principalColumn: "Id");
        }
    }
}
