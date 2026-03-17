package spring.crud;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * @SpringBootApplication: This marks the entry point of your Spring Boot app.
 */
@SpringBootApplication
public class Run {

    public static void main(String[] args) {
        // Load .env file
        Dotenv dotenv = Dotenv.configure()
                .ignoreIfMissing() // Don't crash if the file is missing (e.g. in production)
                .load();

        // Feed .env variables into Spring's system properties
        dotenv.entries().forEach(entry -> {
            System.setProperty(entry.getKey(), entry.getValue());
        });

        SpringApplication.run(Run.class, args);
    }
}
