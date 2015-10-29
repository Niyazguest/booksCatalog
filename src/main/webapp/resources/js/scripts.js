function searchBook() {
    var criteriaName = $('.searchFormInput:radio:checked').val();
    var criteriaValue = $('#bookFindText').val();
    if (criteriaValue.length < 3)
        alert("Наберите минимум 3 символа");
    $.ajax({
        type: 'GET',
        url: '/bookCatalog/searchBook',
        dataType: 'json',
        data: {
            criteriaName: criteriaName,
            criteriaValue: criteriaValue
        },
        success: function (result, status, xhr) {
            if (xhr.getResponseHeader("ResultStatus") == 'OK') {
                $('#bookTable').empty();
                $('#bookPagination').remove();
                var i = 0;
                result.forEach(function (bookRow) {
                    $('#bookTable').append("<tr class=\"task\" data-id=\"" + (++i).toString() + "\" data-num=\"" + "\">");
                    $('#bookTable').append("<td style=\"height:100px; width:5%;\">" + i.toString() + "</td>");
                    $('#bookTable').append("<td style=\"height:100px; width:10%;\">" + bookRow.productId + "</td>");
                    $('#bookTable').append("<td style=\"height:100px; width:30%;\">" + bookRow.name + "</td>");
                    $('#bookTable').append("<td style=\"height:100px; width:20%;\">" + bookRow.author + "</td>");
                    $('#bookTable').append("<td style=\"height:100px; width:10%;\">" + bookRow.publisher + "</td>");
                    $('#bookTable').append("<td style=\"height:100px; width:7%;\">" + bookRow.price + "</td>");
                    $('#bookTable').append("<td style=\"height:100px; width:10%;\"><button type=\"button\" class=\"btn btn-info btn-sm look\" onclick=\"loadBookInfo(this)\" data-productId=\"" + bookRow.productId + "\">Просмотр</button>" + "</td>");
                    $('#bookTable').append("</tr>");
                });
            }
        }
    });
}

function loadBookInfo(button) {
    var productId = $(button).attr('data-productId');
    window.location.assign('/bookCatalog/bookInfo?productId=' + productId);
}

function loadComments() {
    var productId = $('#bookInfo').attr('data-productId');
    $.ajax({
        type: 'GET',
        url: '/bookCatalog/loadComments',
        dataType: 'json',
        data: {
            productId: productId
        },
        success: function (result, status, xhr) {
            result.forEach(function (comment) {
                $('#commentTable').append('<tr>');
                $('#commentTable').append('<td class="commentTableAuthorColumn">' + comment.author + '<br><br>' + comment.date + '</td>');
                $('#commentTable').append('<td><br><br>' + comment.comment + '<br><br></td>');
                $('#commentTable').append('</tr>');
            });
            $('#commentsLoadButton').remove();
        }
    })
}