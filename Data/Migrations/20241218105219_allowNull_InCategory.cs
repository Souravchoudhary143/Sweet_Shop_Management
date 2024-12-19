using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Sweet_Shop_Management.Data.Migrations
{
    /// <inheritdoc />
    public partial class allowNull_InCategory : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SweetItems_ProductCategories_ProductCategoryId",
                table: "SweetItems");

            migrationBuilder.AlterColumn<int>(
                name: "ProductCategoryId",
                table: "SweetItems",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_SweetItems_ProductCategories_ProductCategoryId",
                table: "SweetItems",
                column: "ProductCategoryId",
                principalTable: "ProductCategories",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SweetItems_ProductCategories_ProductCategoryId",
                table: "SweetItems");

            migrationBuilder.AlterColumn<int>(
                name: "ProductCategoryId",
                table: "SweetItems",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_SweetItems_ProductCategories_ProductCategoryId",
                table: "SweetItems",
                column: "ProductCategoryId",
                principalTable: "ProductCategories",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
