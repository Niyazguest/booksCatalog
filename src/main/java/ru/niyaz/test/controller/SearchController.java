package ru.niyaz.test.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import ru.niyaz.test.entity.Book;
import ru.niyaz.test.pojo.BookListRow;
import ru.niyaz.test.serivce.SearchService;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.List;

/**
 * Created by user on 28.10.15.
 */

@Controller
public class SearchController {

    @Autowired
    private SearchService searchService;

    @RequestMapping(value = "searchBook",method = RequestMethod.GET)
    public @ResponseBody List<BookListRow> searchBookByCriteria(@RequestParam(value = "criteriaName") String criteriaName,
                                    @RequestParam(value = "criteriaValue") String criteriaValue,
                                    HttpServletRequest request, HttpServletResponse response) {
        List<BookListRow> books = null;
        if (criteriaValue.length() > 3) {
            try {
                books = searchService.searchBooksByCriteria(criteriaName, criteriaValue);
                response.addHeader("ResultStatus", "OK");
            } catch (Exception ex) {
                response.addHeader("ResultStatus", "error");
            }
        }
        return books;
    }
}
