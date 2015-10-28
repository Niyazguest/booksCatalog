package ru.niyaz.test.pojo;

/**
 * Created by user on 28.10.15.
 */
public class BookListRow {

    private String productId;
    private String author;
    private String name;
    private String publisher;
    private String price;

    public BookListRow() {
    }

    public BookListRow(String productId, String author, String name, String publisher, String price) {
        this.productId=productId;
        this.author = author;
        this.name = name;
        this.publisher = publisher;
        this.price = price;
    }

    public String getProductId() {
        return productId;
    }

    public void setProductId(String productId) {
        this.productId = productId;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPublisher() {
        return publisher;
    }

    public void setPublisher(String publisher) {
        this.publisher = publisher;
    }

    public String getPrice() {
        return price;
    }

    public void setPrice(String price) {
        this.price = price;
    }
}
