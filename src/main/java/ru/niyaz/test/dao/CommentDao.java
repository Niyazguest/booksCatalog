package ru.niyaz.test.dao;

import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import ru.niyaz.test.entity.Book;
import ru.niyaz.test.entity.Comment;

import java.util.List;

/**
 * Created by user on 28.10.15.
 */

@Repository
public class CommentDao {

    @Autowired
    private BookDao bookDao;

    @Autowired
    private SessionFactory sessionFactory;

    public List<Comment> loadComments(Integer productId) {
        List<Comment> comments = null;
        try {
            Book book = bookDao.getBookByProductId(productId);
            Session session = sessionFactory.openSession();
            book = (Book) session.merge(book);
            comments = book.getComments();
            session.close();
        } catch (Exception ex) {
            ex.getMessage();
        }
        return comments;
    }
}
