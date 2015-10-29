package ru.niyaz.test.serivce;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.niyaz.test.dao.BookDao;
import ru.niyaz.test.dao.CommentDao;
import ru.niyaz.test.entity.Book;
import ru.niyaz.test.entity.Comment;
import ru.niyaz.test.pojo.CommentListRow;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
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

    public Book getBookByProductId(Integer productId) {
        return bookDao.getBookByProductId(productId);
    }

    public List<CommentListRow> getCommentsByProductId(Integer productId) {
        List<Comment> comments = commentDao.loadComments(productId);
        List<CommentListRow> commentListRows = new ArrayList<CommentListRow>();
        if (comments == null)
            return null;
        for (Comment comment : comments) {
            SimpleDateFormat simpleDateFormat = new SimpleDateFormat("dd.MM.yyyy");
            CommentListRow commentListRow = new CommentListRow(comment.getAuthor(), simpleDateFormat.format(comment.getDate()), comment.getComment());
            commentListRows.add(commentListRow);
        }
        return commentListRows;
    }

}
