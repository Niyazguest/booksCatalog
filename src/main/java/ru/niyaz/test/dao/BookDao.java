package ru.niyaz.test.dao;

import org.hibernate.Criteria;
import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Projections;
import org.hibernate.criterion.Restrictions;
import org.hibernate.exception.ConstraintViolationException;
import org.hsqldb.HsqlException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import ru.niyaz.test.entity.Book;

import java.util.List;

/**
 * Created by user on 24.10.15.
 */

@Repository
public class BookDao {

    @Autowired
    private SessionFactory sessionFactory;

    @Transactional(propagation = Propagation.REQUIRED, rollbackFor = Exception.class)
    public void saveBook(Book book) throws Exception {
        Session session = null;
        session = sessionFactory.getCurrentSession();
        session.saveOrUpdate(book);
    }

    public List<Book> getAllBooks(int pageNum) {
        List<Book> books = null;
        Session session = null;
        try {
            session = sessionFactory.openSession();
            Criteria criteria = session.createCriteria(Book.class);
            books = criteria.setFirstResult(pageNum * 20).setMaxResults(20).list();
        } catch (Exception ex) {
            return null;
        } finally {
            if (session != null)
                session.close();
        }
        return books;
    }

    public Book getBookByProductId(Long productId) {
        Book book = null;
        Session session = null;
        try {
            session = sessionFactory.openSession();
            Criteria criteria = session.createCriteria(Book.class);
            book = (Book) criteria.add(Restrictions.eq("productId", productId)).uniqueResult();
        } catch (Exception ex) {
            return null;
        } finally {
            if (session != null)
                session.close();
        }
        return book;
    }

    public Long getBooksCount() {
        Long count = null;
        try {
            Session session = sessionFactory.openSession();
            Query query = session.createQuery("select count(*) from Book");
            count = (Long) query.uniqueResult();
            return count;
        } catch (Exception ex) {
            return 0L;
        }
    }

    public List<Book> getBooksByAuthorName(String author) {
        List<Book> books = null;
        Session session = null;
        try {
            session = sessionFactory.openSession();
            Criteria criteria = session.createCriteria(Book.class);
            books = criteria.add(Restrictions.like("author", author, MatchMode.ANYWHERE)).list();
        } catch (Exception ex) {
            return null;
        } finally {
            if (session != null)
                session.close();
        }
        return books;
    }

    public List<Book> getBooksByBookName(String bookName) {
        List<Book> books = null;
        Session session = null;
        try {
            session = sessionFactory.openSession();
            Criteria criteria = session.createCriteria(Book.class);
            books = criteria.add(Restrictions.like("name", bookName, MatchMode.ANYWHERE)).list();
        } catch (Exception ex) {
            return null;
        } finally {
            if (session != null)
                session.close();
        }
        return books;
    }

    public List<Book> getBooksByAnnotation(String annotation) {
        List<Book> books = null;
        Session session = null;
        try {
            session = sessionFactory.openSession();
            Criteria criteria = session.createCriteria(Book.class);
            books = criteria.add(Restrictions.like("annotation", annotation, MatchMode.ANYWHERE)).list();
        } catch (Exception ex) {
            return null;
        } finally {
            if (session != null)
                session.close();
        }
        return books;
    }

}