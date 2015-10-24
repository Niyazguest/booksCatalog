package ru.niyaz.test.entity;

import javax.persistence.*;
import java.util.List;

/**
 * Created by user on 24.10.15.
 */

@Entity
@Table(name = "book", schema = "public")
public class Book {

    private Integer bookId;
    private Integer productId;
    private String name;
    private String author;
    private String editor;
    private String publisherAndYear;
    private Double price;
    private String isbn;
    private String pagesCount;
    private String decor;
    private Double weight;
    private String size;
    private String annotation;
    private String coverImgUrl;
    private List<Comment> comments;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "book_id")
    public Integer getBookId() {
        return bookId;
    }

    public void setBookId(Integer bookId) {
        this.bookId = bookId;
    }

    @Column(name = "product_id")
    public Integer getProductId() {
        return productId;
    }

    public void setProductId(Integer productId) {
        this.productId = productId;
    }

    @Column(name = "name")
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Column(name = "author")
    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    @Column(name = "editor")
    public String getEditor() {
        return editor;
    }

    public void setEditor(String editor) {
        this.editor = editor;
    }

    @Column(name = "price")
    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    @Column(name = "publisher")
    public String getPublisherAndYear() {
        return publisherAndYear;
    }

    public void setPublisherAndYear(String publisherAndYear) {
        this.publisherAndYear = publisherAndYear;
    }

    @Column(name = "isbn")
    public String getIsbn() {
        return isbn;
    }

    public void setIsbn(String isbn) {
        this.isbn = isbn;
    }

    @Column(name = "pages_count")
    public String getPagesCount() {
        return pagesCount;
    }

    public void setPagesCount(String pagesCount) {
        this.pagesCount = pagesCount;
    }

    @Column(name = "decor")
    public String getDecor() {
        return decor;
    }

    public void setDecor(String decor) {
        this.decor = decor;
    }

    @Column(name = "weight")
    public Double getWeight() {
        return weight;
    }

    public void setWeight(Double weight) {
        this.weight = weight;
    }

    @Column(name = "size")
    public String getSize() {
        return size;
    }

    public void setSize(String size) {
        this.size = size;
    }

    @Column(name = "annotation")
    public String getAnnotation() {
        return annotation;
    }

    public void setAnnotation(String annotation) {
        this.annotation = annotation;
    }

    @Column(name="cover_image_url")
    public String getCoverImgUrl() {
        return coverImgUrl;
    }

    public void setCoverImgUrl(String coverImgUrl) {
        this.coverImgUrl = coverImgUrl;
    }

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "book", fetch = FetchType.LAZY)
    public List<Comment> getComments() {
        return comments;
    }

    public void setComments(List<Comment> comments) {
        this.comments = comments;
    }

}



/*

CREATE TABLE book (
        book_id INTEGER PRIMARY KEY IDENTITY,
        product_id INTEGER,
        name CHARACTER VARYING(100),
        author CHARACTER VARYING(50),
        editor CHARACTER VARYING(50),
        publisher CHARACTER VARYING(100),
        price DOUBLE,
        isbn CHARACTER VARYING(20),
        pages_count SMALLINT,
        decor CHARACTER VARYING(200),
        weight DOUBLE,
        size CHARACTER VARYING(20),
        annotation CHARACTER VARYING(2000),
        cover_image_url CHARACTER VARYING(200)
        )

*/