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
<div class="container">
    <div style="width: 105%; margin-left: -2.5%;">
        <div class="table-responsive">
            <table class="table table-striped table-bordered tableBody">
                <tbody>
                <tr>
                    <td style="height: 50%; width: 50%;"></td>
                    <td style="height: 50%; width: 50%;">
                <tr class="bookInfoTextLine"></tr>
                <tr class="bookInfoTextLine"></tr>
                <tr class="bookInfoTextLine"></tr>
                <tr class="bookInfoTextLine"></tr>
                <tr class="bookInfoTextLine"></tr>
                <tr class="bookInfoTextLine"></tr>
                <tr class="bookInfoTextLine"></tr>
                <tr class="bookInfoTextLine"></tr>
                <tr class="bookInfoTextLine"></tr>
                <tr class="bookInfoTextLine"></tr>
                <tr class="bookInfoTextLine"></tr>
                <tr class="bookInfoTextLine"></tr>
                </td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
</div>
</body>
</html>
