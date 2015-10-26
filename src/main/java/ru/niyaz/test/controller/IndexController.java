package ru.niyaz.test.controller;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;
import ru.niyaz.test.entity.Book;
import ru.niyaz.test.serivce.BooksInfoLoaderService;
import ru.niyaz.test.util.HibernateUtil;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

/**
 * Created by user on 05.09.15.
 */

@Controller
public class IndexController {

    @Autowired
    private ServletContext servletContext;

    @Autowired
    private SessionFactory sessionFactory;

    @Autowired
    private BooksInfoLoaderService booksInfoLoaderService;

    @RequestMapping(value = "/index", method = RequestMethod.GET)
    public void loginPage(HttpServletRequest request, HttpServletResponse response) {
        try {
    /*        Session session = sessionFactory.openSession();
            session.beginTransaction();
            Book book = new Book();
            book.setProductId(12);
            book.setAuthor("Автор3");
            session.saveOrUpdate(book);
            session.getTransaction().commit();  */
            booksInfoLoaderService.loadBooksInfo();
            servletContext.getRequestDispatcher("/books.jsp").forward(request, response);
        } catch (ServletException ex) {

        } catch (IOException ex) {

        }
    }

}
