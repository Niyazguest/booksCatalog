function searchBook() {
    var critaeriaName = $('.searchFormInput:radio:checked').val();
    var criteriaValue = $('#bookFindText').val();
    $.ajax({
        type: 'GET',
        url: '/bookCatalog/searchBook',
        dataType: 'json',
        data: {
            criteriaName: critaeriaName,
            criteriaValue: criteriaValue
        },
        success: function (result, status, xhr) {
            if (xhr.getResponseHeader("ResultStatus") == 'OK') {
                $('#bookTable').empty();
                $('#bookPagination').remove();
                var i = 0;
                result.forEach(function (bookRow) {
                    $('#bookTable').append("<tr class=\"task\" data-id=\"" + (++i).toString() + "\" data-num=\"" + "\">");
                    $('#bookTable').append("<td style=\"height:100px; width:5%;\">" + (++i).toString() + "</td>");
                    $('#bookTable').append("<td style=\"height:100px; width:10%;\">" + bookRow.productId + "</td>");
                    $('#bookTable').append("<td style=\"height:100px; width:30%;\">" + bookRow.name + "</td>");
                    $('#bookTable').append("<td style=\"height:100px; width:20%;\">" + bookRow.author + "</td>");
                    $('#bookTable').append("<td style=\"height:100px; width:10%;\">" + bookRow.publisher + "</td>");
                    $('#bookTable').append("<td style=\"height:100px; width:7%;\">" + bookRow.price + "</td>");
                    $('#bookTable').append("<td style=\"height:100px; width:10%;\"><button type=\"button\" class=\"btn btn-info btn-sm look\">Просмотр</button>" + "</td>");
                    $('#bookTable').append("</tr>");
                });
            }

        }

    });
}