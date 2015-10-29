package ru.niyaz.test.util;

import org.springframework.core.io.ClassPathResource;
import org.springframework.orm.hibernate4.LocalSessionFactoryBean;
import org.springframework.stereotype.Component;

import java.util.Properties;

/**
 * Created by user on 29.10.15.
 */

@Component(value = "sessionFactory")
public class SessionFacoryBean extends LocalSessionFactoryBean {

    public SessionFacoryBean() {
        super();
    //    this.setConfigLocation(new ClassPathResource("classpath:hibernate.cfg.xml"));
   //     this.setHibernateProperties(hibernateProperties());
//        this.setPackagesToScan("ru.niyaz.test.entity");
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
}
