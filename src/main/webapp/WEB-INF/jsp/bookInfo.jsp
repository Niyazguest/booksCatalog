<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>Интернет-магазин "Лабиринт"</title>
    <link rel="stylesheet" href="<%= request.getContextPath() %>/resources/css/style.css" type="text/css">
    <link rel="stylesheet" href="<%= request.getContextPath() %>/resources/bootstrap-3.3.5-dist/css/bootstrap.min.css"
          type="text/css">
    <script src="<%= request.getContextPath() %>/resources/js/jquery-2.1.4.min.js" type="text/javascript"></script>
    <script src="<%= request.getContextPath() %>/resources/bootstrap-3.3.5-dist/js/bootstrap.min.js"
            type="text/javascript"></script>
    <script src="<%= request.getContextPath() %>/resources/js/scripts.js" type="text/javascript"></script>
    <script type="text/javascript" src="//vk.com/js/api/openapi.js?117"></script>
    <% ServletContext servletContext = request.getSession().getServletContext(); %>
</head>
<body>
<div style="text-align: center; font: bold 250% normal; color: #1A9FBF;
    font-family: arial, tahoma, helvetica, sans-serif;">Информация о книге</div>
<div class="container" style="margin-top: 5%;">
    <div style="height: 50%; width: 20%;"><img style="height: 100%; width: 100%;" src="${coverImgUrl}"></div>
    <div id="bookInfo" data-productId="${productId}">
        <div class="table-responsive">
            <table class="table table-striped table-bordered tableBody">
                <tbody>
                <tr class="bookInfoTextLine">
                    <td class="bookProperty">Название</td>
                    <td class="bookPropertyValue">${bookName}</td>
                </tr>
                <tr class="bookInfoTextLine">
                    <td class="bookProperty">ID товара</td>
                    <td class="bookPropertyValue">${productId}</td>
                </tr>
                <tr class="bookInfoTextLine">
                    <td class="bookProperty">Автор</td>
                    <td class="bookPropertyValue">${author}</td>
                </tr>
                <tr class="bookInfoTextLine">
                    <td class="bookProperty">Редактор</td>
                    <td class="bookPropertyValue">${editor}</td>
                </tr>
                <tr class="bookInfoTextLine">
                    <td class="bookProperty">Издательство</td>
                    <td class="bookPropertyValue">${publisherAndYear}</td>
                </tr>
                <tr class="bookInfoTextLine">
                    <td class="bookProperty">Цена</td>
                    <td class="bookPropertyValue">${price}</td>
                </tr>
                <tr class="bookInfoTextLine">
                    <td class="bookProperty">ISBN</td>
                    <td class="bookPropertyValue">${isbn}</td>
                </tr>
                <tr class="bookInfoTextLine">
                    <td class="bookProperty">Страниц</td>
                    <td class="bookPropertyValue">${pagesCount}</td>
                </tr>
                <tr class="bookInfoTextLine">
                    <td class="bookProperty">Описание</td>
                    <td class="bookPropertyValue">${decor}</td>
                </tr>
                <tr class="bookInfoTextLine">
                    <td class="bookProperty">Масса</td>
                    <td class="bookPropertyValue">${weight}</td>
                </tr>
                <tr class="bookInfoTextLine">
                    <td class="bookProperty">Размеры</td>
                    <td class="bookPropertyValue">${dimensions}</td>
                </tr>
                <tr class="bookInfoTextLine">
                    <td class="bookProperty">Аннотация</td>
                    <td class="bookPropertyValue">${annotation}</td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
    <div><button id="commentsLoadButton" class="btn btn-info btn-lg" onclick="loadComments()">Комментарии</button></div>
    <div id="comments">
        <table class="table table-striped table-bordered tableBody">
            <tbody id="commentTable">

            </tbody>
        </table>
    </div>
</div>
</body>
</html>
