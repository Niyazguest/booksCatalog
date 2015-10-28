package ru.niyaz.test.dao;

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
    private SessionFactory sessionFactory;

    public List<Comment> getComments(Book book) {
        Session session = null;
        List<Comment> comments = null;
        try {
            session = sessionFactory.openSession();
            Book bookObject = (Book) session.merge(book);
            comments = book.getComments();
        } catch (Exception ex) {
            return null;
        } finally {
            if (session != null)
                session.close();
        }
        return comments;
    }
}
