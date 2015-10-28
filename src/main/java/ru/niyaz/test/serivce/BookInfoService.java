package ru.niyaz.test.serivce;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.niyaz.test.dao.BookDao;
import ru.niyaz.test.dao.CommentDao;
import ru.niyaz.test.entity.Book;

import java.util.List;

/**
 * Created by user on 28.10.15.
 */

@Service
public class BookInfoService {

    @Autowired
    private BookDao bookDao;

    @Autowired
    private CommentDao commentDao;

    public List<Book> getBookByProductId(Long productId) {

    }

}
