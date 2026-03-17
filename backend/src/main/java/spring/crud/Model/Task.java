package spring.crud.Model;

// These are Jakarta Persistence API (JPA) imports.
// They define how Java objects map to Database tables.
import jakarta.persistence.*;

// These are Lombok imports to keep the code clean.
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @Entity: This tells Spring Data JPA that this class represents a table in your DB.
 * @Table: Explicitly names the table "tasks" in PostgreSQL.
 */
@Entity
@Table(name = "tasks")
@Data // Generates Getters, Setters, equals, canEqual, hashCode, and toString automatically.
@NoArgsConstructor // Creates a constructor with no arguments (Required by JPA).
@AllArgsConstructor // Creates a constructor with all fields (Useful for testing).
public class Task {

    /**
     * @Id: Marks this field as the Primary Key of the table.
     * @GeneratedValue: Tells Postgres to handle the ID incrementing automatically (SERIAL).
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * @Column(nullable = false): Ensures this field cannot be empty in the database.
     * This is a "Database Constraint" for data integrity.
     */
    @Column(nullable = false)
    private String title;

    // By default, fields are mapped to columns with the same name.
    private String description;

    /**
     * We set a default value of 'false' so new tasks start as incomplete.
     */
    private boolean completed = false;
}