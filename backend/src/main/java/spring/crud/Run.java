package spring.crud;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * @SpringBootApplication: This marks the entry point of your Spring Boot app.
 * It combines @Configuration, @EnableAutoConfiguration, and @ComponentScan.
 * This tells Spring to scan the current package and sub-packages for Beans (Controllers, Services, etc.).
 */
@SpringBootApplication
public class Run {

    /**
     * The main method is the standard entry point for Java applications.
     * SpringApplication.run() starts the entire Spring framework and the embedded server (Tomcat).
     * @param args Command-line arguments.
     */
    public static void main(String[] args) {
        SpringApplication.run(Run.class, args);
    }
}
