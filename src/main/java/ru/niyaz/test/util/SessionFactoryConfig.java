package ru.niyaz.test.util;

import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.orm.hibernate4.HibernateTransactionManager;
import org.springframework.orm.hibernate4.LocalSessionFactoryBean;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import java.util.Properties;

/**
 * Created by user on 25.10.15.
 */

// @Configuration
// @ComponentScan({"ru.niyaz.test"})
public class SessionFactoryConfig {
 /*
    @Bean
    public LocalSessionFactoryBean sessionFactory() {
        LocalSessionFactoryBean sessionFactory = new LocalSessionFactoryBean();
        sessionFactory.setHibernateProperties(hibernateProperties());
        sessionFactory.setPackagesToScan("ru.niyaz.test.entity");
    //    sessionFactory.setConfigLocation(new ClassPathResource("classpath:hibernate.cfg.xml"));
        return sessionFactory;
    }


    @Bean
    @Autowired
    public HibernateTransactionManager transactionManager(SessionFactory sessionFactory) {
        HibernateTransactionManager txManager = new HibernateTransactionManager();
        txManager.setSessionFactory(sessionFactory);
        return txManager;
    }

    public Properties hibernateProperties() {
        return new Properties() {
            {
                setProperty("hibernate.connection.url", "jdbc:hsqldb:file:" + System.getProperty("user.dir") + "\\..\\webapps\\bookCatalog\\WEB-INF\\db\\booksDb\\books");
                setProperty("hibernate.connection.driver_class", "org.hsqldb.jdbcDriver");
                setProperty("hibernate.connection.username", "books");
                setProperty("hibernate.connection.password", "books");
                setProperty("hibernate.dialect", "org.hibernate.dialect.HSQLDialect");
                setProperty("hibernate.show_sql", "true");
                setProperty("hibernate.c3p0.min_size", "5");
                setProperty("hibernate.c3p0.max_size", "20");
                setProperty("hibernate.c3p0.timeout", "300");
                setProperty("hibernate.c3p0.max_statements", "50");
                setProperty("hibernate.c3p0.idle_test_period", "3000");
            }
        };
    }
    */
}
