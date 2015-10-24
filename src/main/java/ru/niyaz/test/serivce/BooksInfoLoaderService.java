package ru.niyaz.test.serivce;

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

/**
 * Created by user on 24.10.15.
 */

@Service
public class BooksInfoLoaderService {

    @Autowired
    private BookDao bookDao;

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
                bookDao.saveBook(bookInfo(iterator.next()));
            }
        }
    }

    public Book bookInfo(Element bookIcon) {
        Document document = null;
        String productId = bookIcon.getElementById("product-info").attr("data-product-id");
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
            book.setName(name);
        } catch (Exception ex) {
            return null;
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
            book.setAuthor(author);
            book.setEditor(editor);
        } catch (Exception ex) {
            return null;
        }

        try {
            String publisherAndYear = "";
            str = bookElement.getElementById("product-specs").getElementsByClass("publisher").get(0).text();
            strs = str.split(":");
            if (strs.length == 2)
                publisherAndYear = strs[1].replaceAll("\"", "").trim();
            else
                publisherAndYear = strs[0].replaceAll("\"", "").trim();
            book.setPublisherAndYear(publisherAndYear);
        } catch (Exception ex) {
            return null;
        }

        try {
            str = bookElement.getElementById("product-specs").getElementsByClass("buying-pricenew-val-number").get(0).text();
            book.setPrice(Double.parseDouble(str));
        } catch (Exception ex) {
            return null;
        }

        try {
            String isbn = "";
            str = bookElement.getElementById("product-specs").getElementsByClass("isbn").get(0).text();
            strs = str.split(":");
            if (strs.length == 2)
                isbn = strs[1].replaceAll("\"", "").trim();
            else
                isbn = strs[0].replaceAll("\"", "").trim();
            book.setIsbn(isbn);
        } catch (Exception ex) {
            return null;
        }

        try {
            String pagesCount = "";
            str = bookElement.getElementById("product-specs").getElementsByClass("pages2").get(0).text();
            strs = str.split(":");
            if (strs.length == 2)
                pagesCount = strs[1].replaceAll("\"", "").trim();
            else
                pagesCount = strs[0].replaceAll("\"", "").trim();
            book.setPagesCount(pagesCount);
        } catch (Exception ex) {
            return null;
        }

        try {
            String decor = "";
            HttpURLConnection httpURLConnection = (HttpURLConnection) new URL("http://www.labirint.ru/ajax/design/" + productId).openConnection();
            httpURLConnection.getResponseCode();
            BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(httpURLConnection.getInputStream()));
            while ((str = bufferedReader.readLine()) != null)
                decor = decor + str;
            book.setPagesCount(decor);
        } catch (Exception ex) {
            return null;
        }

        try {
            String weight = "";
            str = bookElement.getElementById("product-specs").getElementsByClass("weight").get(0).text();
            strs = str.split(":");
            if (strs.length == 2)
                weight = strs[1].replaceAll("\"", "").trim();
            else
                weight = strs[0].replaceAll("\"", "").trim();
            book.setWeight(weight);
        } catch (Exception ex) {
            return null;
        }

        try {
            String dimensions = "";
            str = bookElement.getElementById("product-specs").getElementsByClass("dimensions").get(0).text();
            strs = str.split(":");
            if (strs.length == 2)
                dimensions = strs[1].replaceAll("\"", "").trim();
            else
                dimensions = strs[0].replaceAll("\"", "").trim();
            book.setDimensions(dimensions);
        } catch (Exception ex) {
            return null;
        }

        try {
            book.setAnnotation(bookElement.getElementById("fullannotation").text());
        } catch (Exception ex) {
            return null;
        }

        List<Comment> comments = new ArrayList<Comment>();
        Elements elements = bookElement.getElementById("product-comments").getElementsByClass("product-comment");
        Iterator<Element> iterator = elements.iterator();
        while (iterator.hasNext()) {
            Comment comment = new Comment();
            Element element = iterator.next();
            comment.setAuthor(element.getElementsByClass("comment-user-avatar").get(0).getElementsByTag("a").get(0).attr("title"));
            SimpleDateFormat simpleDateFormat = new SimpleDateFormat("dd.mm.yyyy HH:mm:ss");
            str = element.getElementsByClass("comment-footer").get(0).getElementsByClass("date").get(0).text().trim();
            try {
                comment.setDate(new Date(simpleDateFormat.parse(str).getTime()));
            } catch (ParseException ex) {
                comment.setDate(null);
            }
            comment.setComment(element.getElementsByAttributeValueContaining("id", "fullcomment").get(0).text());
            comment.setBook(book);
            comments.add(comment);
        }
        book.setComments(comments);
        return book;
    }
}
