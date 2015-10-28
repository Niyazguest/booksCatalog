package ru.niyaz.test.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

/**
 * Created by user on 28.10.15.
 */

@Controller
public class BookFullInfoController {

    @RequestMapping(value = "/bookCatalog/bookInfo", method = RequestMethod.GET)
    public ModelAndView bookInfo() {
        ModelAndView modelAndView = new ModelAndView("bookInfo");
        return modelAndView;
    }
}
