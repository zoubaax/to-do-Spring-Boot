package spring.crud;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;
import spring.crud.Model.Role;
import spring.crud.Model.User;
import spring.crud.Repository.UserRepository;

@SpringBootApplication
public class Run {

    public static void main(String[] args) {
        Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();
        dotenv.entries().forEach(entry -> System.setProperty(entry.getKey(), entry.getValue()));
        SpringApplication.run(Run.class, args);
    }

    /**
     * BEST PRACTICE: Data Seeding
     * This method runs once the application has started.
     * We create a default admin if none exists.
     */
    @Bean
    CommandLineRunner init(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.findByUsername("admin").isEmpty()) {
                User admin = new User();
                admin.setUsername("admin");
                admin.setPassword(passwordEncoder.encode("admin123")); // Default password
                admin.setRole(Role.ROLE_ADMIN);
                userRepository.save(admin);
                System.out.println(">>> Created default Admin user: admin / admin123");
            }
        };
    }
}
