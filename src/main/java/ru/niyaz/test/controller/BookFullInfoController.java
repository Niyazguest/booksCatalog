package ru.niyaz.test.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;
import ru.niyaz.test.entity.Book;
import ru.niyaz.test.entity.Comment;
import ru.niyaz.test.pojo.CommentListRow;
import ru.niyaz.test.serivce.BookInfoService;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.List;

/**
 * Created by user on 28.10.15.
 */

@Controller
public class BookFullInfoController {

    @Autowired
    private BookInfoService bookInfoService;



    @RequestMapping(value = "bookInfo", method = RequestMethod.GET)
    public ModelAndView bookInfo(@RequestParam(value = "productId") String productId,
                                 HttpServletRequest request, HttpServletResponse response) {
        Integer id = null;
        try {
            id = Integer.parseInt(productId);
        } catch (Exception ex) {
            response.setHeader("Location", "/");
            return null;
        }
        Book book = bookInfoService.getBookByProductId(id);
        ModelAndView modelAndView = new ModelAndView("bookInfo");
        modelAndView.addObject("productId", book.getProductId().toString());
        modelAndView.addObject("bookName", book.getName());
        modelAndView.addObject("author", book.getAuthor());
        modelAndView.addObject("editor", book.getEditor());
        modelAndView.addObject("publisherAndYear", book.getPublisherAndYear());
        modelAndView.addObject("price", book.getPrice().toString());
        modelAndView.addObject("isbn", book.getIsbn());
        modelAndView.addObject("pagesCount", book.getPagesCount());
        modelAndView.addObject("decor", book.getDecor());
        modelAndView.addObject("weight", book.getWeight());
        modelAndView.addObject("dimensions", book.getDimensions());
        modelAndView.addObject("annotation", book.getAnnotation());
        modelAndView.addObject("coverImgUrl", book.getCoverImgUrl());
        return modelAndView;
    }

    @RequestMapping(value = "loadComments", method = RequestMethod.GET)
    public @ResponseBody List<CommentListRow> loadComments(@RequestParam(value = "productId") String productId) {
        Integer id = null;
        List<CommentListRow> comments=null;
        try {
            id = Integer.parseInt(productId);
            comments = bookInfoService.getCommentsByProductId(id);
        } catch (Exception ex) {
            return null;
        }
        return comments;
    }
}
