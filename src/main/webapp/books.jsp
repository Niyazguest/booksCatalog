<%@ page import="java.util.List" %>
<%@ page import="ru.niyaz.test.entity.Book" %>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page session="true" contentType="text/html;charset=UTF-8" language="java" pageEncoding="utf-8" %>
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
<nav class="navbar navbar-default" role="navigation">
    <div class="container-fluid">
        <div class="navbar-header">
            <button type="button" class="navbar-toggle" data-toggle="collapse"
                    data-target="#bs-example-navbar-collapse-2">
                <span class="sr-only">Toggle navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
        </div>
        <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-2" style="    background-color: #CEF7F7;">
            <form class="navbar-form navbar-left" role="search">
                <div class="searchFormElem"><input id="bookName" type="radio" checked name="criteria" value="name"
                                                   class="searchFormInput"><label for="bookName">Название</label></div>
                <div class="searchFormElem"><input id="bookAuthor" type="radio" name="criteria" value="author"
                                                   class="searchFormInput"><label for="bookAuthor">Автор</label></div>
                <div class="searchFormElem"><input id="bookAnnotation" type="radio" name="criteria" value="annotation"
                                                   class="searchFormInput"><label for="bookAnnotation">Аннотация</label>
                </div>
            </form>
            <div style="margin-left: 20%; width: 50%; margin-top: 1%;" class="input-group">
                <input id="bookFindText" type="text" class="form-control">
                    <span class="input-group-btn">
                        <button id="bookFindButton" class="btn btn-default" type="button" onclick="searchBook()">Поиск
                        </button>
                    </span>
            </div>
            </form>
        </div>
    </div>
</nav>

<div class="container">
    <div style="width: 105%; margin-left: -2.5%;">
        <div class="table-responsive">
            <table class="table table-striped table-bordered tableBody">
                <thead>
                <tr>
                    <td>№</td>
                    <td>ID товара</td>
                    <td>Наименование</td>
                    <td>Автор</td>
                    <td>Издательство</td>
                    <td>Цена</td>
                    <td>Информация</td>
                </tr>
                </thead>
                <tbody id="bookTable">
                <%
                    int i = 1;
                    int num = 0;
                    List<Book> books = (List<Book>) servletContext.getAttribute("books");
                    for (Book book : books) {
                        try {
                            if (request.getParameter("page") != null)
                                num = (Integer.parseInt(request.getParameter("page")) - 1) * 20 + (i++);
                            else
                                num = (i++);
                        } catch (Exception ex) {
                            num = 1;
                        }
                        out.println("<tr class=\"task\" data-id=\"" + book.getProductId() + "\" data-num=\"" + num + "\">");
                        out.println("<td style=\"height:100px; width:5%;\">" + num + "</td>");
                        out.println("<td style=\"height:100px; width:10%;\">" + book.getProductId().toString().replace("<", "").replace(">", "") + "</td>");
                        out.println("<td style=\"height:100px; width:30%;\">" + book.getName().replace("<", "").replace(">", "") + "</td>");
                        out.println("<td style=\"height:100px; width:20%;\">" + book.getAuthor().replace("<", "").replace(">", "") + "</td>");
                        out.println("<td style=\"height:100px; width:10%;\">" + book.getPublisherAndYear().replace("<", "").replace(">", "") + "</td>");
                        out.println("<td style=\"height:100px; width:7%;\">" + book.getPrice().toString().replace("<", "").replace(">", "") + "</td>");
                        out.println("<td style=\"height:100px; width:10%;\"><button type=\"button\" class=\"btn btn-info btn-sm look\" data-productId=\"" + book.getProductId().toString() + "\" onclick=\"loadBookInfo(this)\">Просмотр</button>" + "</td>");
                        out.println("</tr>");
                    }
                %>
                </tbody>
            </table>
            <ul id="bookPagination" class="pagination pagesNum pagination-lg">
                <%
                    Long pageNum = (Long) servletContext.getAttribute("booksCount");
                    pageNum = pageNum / 20 + 1;
                    for (long j = 1; j <= pageNum; ++j)
                        out.println("<li><a href=\"?page=" + j + "\">" + j + "</a></li>");
                %>
            </ul>
        </div>
    </div>
</div>

</body>
</html>
