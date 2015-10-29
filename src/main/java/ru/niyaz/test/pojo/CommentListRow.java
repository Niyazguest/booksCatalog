package ru.niyaz.test.pojo;

/**
 * Created by user on 29.10.15.
 */
public class CommentListRow {

    private String author;
    private String date;
    private String comment;

    public CommentListRow() {
    }

    public CommentListRow(String author, String date, String comment) {
        this.author = author;
        this.date = date;
        this.comment = comment;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }
}
