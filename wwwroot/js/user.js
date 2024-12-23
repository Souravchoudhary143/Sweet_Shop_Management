var dataTable;

$(document).ready(function () {
    loadDataTable();
});

function loadDataTable() {
    dataTable = $('#tblData').DataTable({
        "ajax": {
            "url": "/User/GetAll"
        },
        "columns": [
            { "data": "name", "width": "15%" },
            { "data": "email", "width": "15%" },
            { "data": "phoneNumber", "width": "15%" },
            { "data": "state", "width": "15%" },
            { "data": "role", "width": "15%" },
            {
                "data": "id",
                "width": "15%",
                "render": function (data) {
                    return `
                    <div class="text-center">
                            <a class="btn btn-danger" onclick="DeleteUser('/User/DeleteUser/${data}')">
                                <i class="fas fa-trash-alt"></i>
                            </a>

                    </div> `;
                }
            }
        ]
    })
}
//<a href="/admin/user/updateuser/${data}" class="btn btn-info">
//    <i class="fas fa-edit"></i>
//</a>
function DeleteUser(url) {
    console.log('Delete URL:', url);
    if (confirm('Are you sure you want to delete this record?')) {
        $.ajax({
            url: url,
            type: 'DELETE',
            success: function (result) {
                dataTable.ajax.reload(); // Reload the table data
            },
            error: function (error) {
                alert('Error deleting record');
            }
        });
    }
}


