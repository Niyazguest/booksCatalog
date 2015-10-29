package ru.niyaz.test.serivce;

import org.hibernate.exception.ConstraintViolationException;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.niyaz.test.dao.BookDao;
import ru.niyaz.test.entity.Book;
import ru.niyaz.test.entity.Comment;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;
import java.sql.Date;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;

/**
 * Created by user on 24.10.15.
 */

@Service
public class BooksInfoLoaderService {

    @Autowired
    private BookDao bookDao;

    @Scheduled(fixedDelay = 10900000)
    public void loadBooksInfo() {
        int booksListPageNumber = 1;
        while (true) {
            Document document = null;
            try {
                URL url = new URL("http://www.labirint.ru/genres/2308/?page=" + Integer.toString(booksListPageNumber++));
                document = Jsoup.parse(url, 5000);
            } catch (MalformedURLException ex) {

            } catch (IOException ex) {

            }
            Elements elements = document.getElementsByClass("product");
            if (elements.size() == 0)
                break;
            Iterator<Element> iterator = elements.iterator();
            while (iterator.hasNext()) {
                try {
                    bookDao.saveBook(bookInfo(iterator.next()));
                } catch (Exception ex) {
                    if (ex instanceof ConstraintViolationException)
                        continue;
                }
            }
        }
    }

    protected Book bookInfo(Element bookIcon) {
        Document document = null;
        String productId = bookIcon.attr("data-product-id");
        try {
            URL url = new URL("http://www.labirint.ru/books/" + productId);
            document = Jsoup.parse(url, 5000);
        } catch (MalformedURLException ex) {

        } catch (IOException ex) {

        }
        Book book = new Book();
        Element bookElement = document.getElementById("product");

        String[] strs;
        String str;

        book.setProductId(Integer.parseInt(productId));

        try {
            String name;
            name = bookElement.getElementById("product-title").getElementsByTag("h1").text().trim();
            book.setName((name.length() <= 150) ? name : name.substring(0, 149));
        } catch (Exception ex) {
            book.setName("");
        }

        try {
            String author = "";
            String editor = "";
            Elements authorElements = bookElement.getElementById("product-specs").getElementsByClass("authors");
            Iterator<Element> iterator = authorElements.iterator();
            while (iterator.hasNext()) {
                str = iterator.next().text();
                if (str.contains("Автор")) {
                    strs = str.split(":");
                    if (strs.length == 2)
                        author = strs[1].replaceAll("\"", "").trim();
                    else
                        author = strs[0].replaceAll("\"", "").trim();
                }
                if (str.contains("Редактор")) {
                    strs = str.split(":");
                    if (strs.length == 2)
                        editor = strs[1].replaceAll("\"", "").trim();
                    else
                        editor = strs[0].replaceAll("\"", "").trim();
                }
            }
            book.setAuthor((author.length() <= 100) ? author : author.substring(0, 99));
            book.setEditor((editor.length() <= 100) ? editor : editor.substring(0, 99));
        } catch (Exception ex) {
            book.setAuthor("");
            book.setEditor("");
        }

        try {
            String publisherAndYear = "";
            str = bookElement.getElementById("product-specs").getElementsByClass("publisher").get(0).text();
            strs = str.split(":");
            if (strs.length == 2)
                publisherAndYear = strs[1].replaceAll("\"", "").trim();
            else
                publisherAndYear = strs[0].replaceAll("\"", "").trim();
            book.setPublisherAndYear((publisherAndYear.length() <= 200) ? publisherAndYear : publisherAndYear.substring(0, 199));
        } catch (Exception ex) {
            book.setPublisherAndYear("");
        }

        try {
            if (bookElement.getElementById("product-specs").getElementsByClass("buying-pricenew-val-number").size() > 0)
                str = bookElement.getElementById("product-specs").getElementsByClass("buying-pricenew-val-number").get(0).text();
            else
                str = bookElement.getElementById("product-specs").getElementsByClass("buying-price-val-number").get(0).text();
            book.setPrice(Double.parseDouble(str.length() <= 10 ? str : str.substring(0, 9)));
        } catch (Exception ex) {
            book.setPrice(null);
        }

        try {
            String isbn = "";
            str = bookElement.getElementById("product-specs").getElementsByClass("isbn").get(0).text();
            strs = str.split(":");
            if (strs.length == 2)
                isbn = strs[1].replaceAll("\"", "").trim();
            else
                isbn = strs[0].replaceAll("\"", "").trim();
            book.setIsbn((isbn.length() <= 20) ? isbn : isbn.substring(0, 19));
        } catch (Exception ex) {
            book.setIsbn("");
        }

        try {
            String pagesCount = "";
            str = bookElement.getElementById("product-specs").getElementsByClass("pages2").get(0).text();
            strs = str.split(":");
            if (strs.length == 2)
                pagesCount = strs[1].replaceAll("\"", "").trim();
            else
                pagesCount = strs[0].replaceAll("\"", "").trim();
            book.setPagesCount((pagesCount.length() <= 30) ? pagesCount : pagesCount.substring(0, 29));
        } catch (Exception ex) {
            book.setPagesCount("");
        }

        try {
            String decor = "";
            Document decorHtml = Jsoup.parse(new URL("http://www.labirint.ru/ajax/design/" + productId), 5000);
            book.setDecor((decorHtml.text().length() <= 400) ? decorHtml.text() : decorHtml.text().substring(0, 399));
        } catch (Exception ex) {
            book.setDecor("");
        }

        try {
            String weight = "";
            str = bookElement.getElementById("product-specs").getElementsByClass("weight").get(0).text();
            strs = str.split(":");
            if (strs.length == 2)
                weight = strs[1].replaceAll("\"", "").trim();
            else
                weight = strs[0].replaceAll("\"", "").trim();
            book.setWeight((weight.length() <= 20) ? weight : weight.substring(0, 19));
        } catch (Exception ex) {
            book.setWeight("");
        }

        try {
            String dimensions = "";
            str = bookElement.getElementById("product-specs").getElementsByClass("dimensions").get(0).text();
            strs = str.split(":");
            if (strs.length == 2)
                dimensions = strs[1].replaceAll("\"", "").trim();
            else
                dimensions = strs[0].replaceAll("\"", "").trim();
            book.setDimensions((dimensions.length() <= 30) ? dimensions : dimensions.substring(0, 29));
        } catch (Exception ex) {
            book.setDimensions("");
        }

        try {
            if (bookElement.getElementById("fullannotation") != null)
                book.setAnnotation((bookElement.getElementById("fullannotation").text().length() <= 2000) ? bookElement.getElementById("fullannotation").text() : bookElement.getElementById("fullannotation").text().substring(0, 1999));
            else if (bookElement.getElementById("product-about") != null)
                book.setAnnotation((bookElement.getElementById("product-about").text().length() <= 2000) ? bookElement.getElementById("product-about").text() : bookElement.getElementById("product-about").text().substring(0, 1999));
            else
                book.setAnnotation((bookElement.getElementById("smallannotation").text().length() <= 2000) ? bookElement.getElementById("smallannotation").text() : bookElement.getElementById("smallannotation").text().substring(0, 1999));

        } catch (Exception ex) {
            book.setAnnotation("");
        }

        try {
            String imageUrl = "";
            if (document.getElementsByAttributeValue("property", "og:image") != null)
                imageUrl = document.getElementsByAttributeValue("property", "og:image").get(0).attr("content");
            else
                imageUrl = "http://img.labirint.ru/design/emptycover.png";
            book.setCoverImgUrl(imageUrl);
        } catch (Exception ex) {
            book.setCoverImgUrl("");
        }

        if (document.getElementById("product-comments") != null)
            book.setComments(parseComments(document.getElementById("product-comments"), book));

        return book;
    }

    private List<Comment> parseComments(Element commentsElement, Book book) {
        List<Comment> comments = new ArrayList<Comment>();
        Elements elements = commentsElement.getElementsByClass("product-comment");
        Iterator<Element> iterator = elements.iterator();
        String str = "";
        while (iterator.hasNext()) {
            Comment comment = new Comment();
            Element element = iterator.next();
            try {
                str = element.getElementsByClass("comment-user-avatar").get(0).getElementsByTag("a").get(0).attr("title");
                comment.setAuthor((str.length() <= 100) ? str : str.substring(0, 99));
            } catch (Exception ex) {
                comment.setAuthor("");
            }

            try {
                SimpleDateFormat simpleDateFormat = new SimpleDateFormat("dd.mm.yyyy HH:mm:ss");
                str = element.getElementsByClass("comment-footer").get(0).getElementsByClass("date").get(0).text().trim();
                comment.setDate(new Date(simpleDateFormat.parse(str).getTime()));
            } catch (Exception ex) {
                comment.setDate(null);
            }
            try {
                if (element.getElementsByAttributeValueContaining("id", "fullcomment").size() > 0) {
                    str = element.getElementsByAttributeValueContaining("id", "fullcomment").get(0).text();
                    comment.setComment((str.length() <= 5000) ? str : str.substring(0, 4999));
                } else if (element.getElementsByClass("comment-text").size() > 0) {
                    str = element.getElementsByClass("comment-text").get(0).text();
                    comment.setComment((str.length() <= 5000) ? str : str.substring(0, 4999));
                } else {
                    str = element.getElementsByAttributeValueContaining("id", "shortcomment").get(0).text();
                    comment.setComment((str.length() <= 5000) ? str : str.substring(0, 4999));
                }
            } catch (Exception ex) {
                comment.setComment("");
            }
            comment.setBook(book);
            comments.add(comment);
        }
        return comments;
    }

    public List<Book> loadAllBooks(int pageNum) {
        return bookDao.getAllBooks(pageNum);
    }

    public Long getBooksCount() {
        return bookDao.getBooksCount();
    }
}
