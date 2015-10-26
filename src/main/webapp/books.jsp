<%@ page import="java.util.List" %>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page session="true" contentType="text/html;charset=UTF-8" language="java" pageEncoding="utf-8" %>
<html>
<head>
    <title>Книги</title>
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
            <a class="navbar-brand" href="#">Книги по программированию</a>
        </div>
        <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-2">
            <form class="navbar-form navbar-left" role="search">
                <p><input type="radio" name="criteria" value="name">Название<Br>
                    <input type="radio" name="criteria" value="author">Автор<Br>
                    <input type="radio" name="criteria" value="annotation">Аннотация</p>

                <div class="input-group">
                    <input id="bookFindText" type="text" class="form-control">
                    <span class="input-group-btn">
                        <button id="bookFindButton" class="btn btn-default" type="button">Поиск</button>
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
                    <td>ID товара</td>
                    <td>Наименование</td>
                    <td>Автор</td>
                    <td>Издательство</td>
                    <td>Цена</td>
                    <td>ISBN</td>
                </tr>
                </thead>
                <tbody id="taskTable">
                <%

                %>
                </tbody>
            </table>
        </div>
    </div>
</div>

</body>
</html>
