package ru.niyaz.test.serivce;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.stereotype.Service;
import ru.niyaz.test.entity.Book;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.Iterator;

/**
 * Created by user on 24.10.15.
 */

@Service
public class BooksInfoLoaderService {

    public void loadBooksInfo() {
        Document document = null;
        try {
            URL url = new URL("http://www.labirint.ru/genres/2308");
            document = Jsoup.parse(url, 5000);
        } catch (MalformedURLException ex) {

        } catch (IOException ex) {

        }

        Elements elements = document.getElementsByClass("product");
        Iterator<Element> iterator = elements.iterator();
        while (iterator.hasNext()) {
            bookInfo(iterator.next());
        }

    }

    public Book bookInfo(Element bookIcon) {
        Document document = null;
        try {
            URL url = new URL("http://www.labirint.ru/books/" + bookIcon.attr("data-product-id"));
            document = Jsoup.parse(url, 5000);
        } catch (MalformedURLException ex) {

        } catch (IOException ex) {

        }
        Book book = new Book();
        Element bookElement = document.getElementById("product");

        String[] strs;
        String str;

        Integer productId;
        try {
            strs = bookElement.getElementById("product-specs").getElementsByClass("articul").get(0).text().split(":");
            if (strs.length == 2)
                productId = Integer.parseInt(strs[1].trim());
            else
                productId = Integer.parseInt(strs[0].trim());
            book.setProductId(productId);
        } catch (Exception ex) {
            return null;
        }

        String name;
        try {
            name = bookElement.getElementById("product-title").getElementsByTag("h1").text().trim();
            book.setName(name);
        } catch (Exception ex) {
            return null;
        }

        String author = "";
        String editor = "";
        try {
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

        

    }
}
