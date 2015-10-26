package ru.niyaz.test.entity;

import javax.persistence.*;
import java.sql.Date;

/**
 * Created by user on 24.10.15.
 */

@Entity
@Table(name = "comment", schema = "public")
public class Comment {

    private Long commentId;
    private String author;
    private Date date;
    private String comment;
    private Book book;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "comment_id")
    public Long getCommentId() {
        return commentId;
    }

    public void setCommentId(Long commentId) {
        this.commentId = commentId;
    }

    @Column(name = "author")
    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    @Column(name = "date")
    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    @Column(name = "comment")
    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "book_id")
    public Book getBook() {
        return book;
    }

    public void setBook(Book book) {
        this.book = book;
    }

}


/*
CREATE TABLE comment (
   comment_id BIGINT PRIMARY KEY IDENTITY,
   author CHARACTER VARYING(100),
   date DATE,
   comment CHARACTER VARYING(5000)
)
 */