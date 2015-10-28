package ru.niyaz.test.serivce;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.niyaz.test.dao.BookDao;
import ru.niyaz.test.entity.Book;
import ru.niyaz.test.pojo.BookListRow;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by user on 28.10.15.
 */

@Service
public class SearchService {

    @Autowired
    private BookDao bookDao;

    public List<BookListRow> searchBooksByCriteria(String criteriaName, String text) throws Exception {
        List<Book> books = null;
        List<BookListRow> bookRows = null;
        if (criteriaName.equals("author"))
            books = bookDao.getBooksByAuthorName(text);
        if (criteriaName.equals("name"))
            books = bookDao.getBooksByBookName(text);
        if (criteriaName.equals("annotation"))
            books = bookDao.getBooksByAnnotation(text);
        bookRows = new ArrayList<BookListRow>();
        for (Book book : books) {
            BookListRow bookListRow = new BookListRow(book.getProductId().toString(), book.getAuthor(), book.getName(), book.getPrice().toString(), book.getPublisherAndYear());
            bookRows.add(bookListRow);
        }
        return bookRows;
    }
}
