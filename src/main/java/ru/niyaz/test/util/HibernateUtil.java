package ru.niyaz.test.util;

import org.hibernate.SessionFactory;
import org.hibernate.boot.registry.StandardServiceRegistryBuilder;
import org.hibernate.cfg.Configuration;
import org.hibernate.service.ServiceRegistry;
import ru.niyaz.test.entity.Book;
import ru.niyaz.test.entity.Comment;


import java.io.File;

/**
 * Created by user on 04.09.15.
 */


public class HibernateUtil {

 //   private static SessionFactory sessionFactory;

    public static SessionFactory createSessionFactory() {
        try {
            Configuration configuration = new Configuration().configure();
            ServiceRegistry serviceRegistry = new StandardServiceRegistryBuilder().applySettings(configuration.getProperties()).build();
            configuration.addAnnotatedClass(Book.class);
            configuration.addAnnotatedClass(Comment.class);
            SessionFactory newSessionFactory = configuration.buildSessionFactory(serviceRegistry);
            return newSessionFactory;
        } catch (Exception ex) {
            System.err.println("Initial SessionFactory creation failed." + ex);
            throw new ExceptionInInitializerError(ex);
        }
    }
/*
    public static SessionFactory getSessionFactory() {
        return sessionFactory;
    }

    public static void shutdown() {
        getSessionFactory().close();
    }   */
}