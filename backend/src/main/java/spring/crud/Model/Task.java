package spring.crud.Model;

// These are Jakarta Persistence API (JPA) imports.
// They define how Java objects map to Database tables.
import jakarta.persistence.*;

/**
 * @Entity: This tells Spring Data JPA that this class represents a table in your DB.
 * @Table: Explicitly names the table "tasks" in PostgreSQL.
 */
@Entity
@Table(name = "tasks")
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

    /**
     * ManyToOne: Many tasks can belong to one user.
     * @JoinColumn: Specifies the foreign key column "user_id".
     */
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    public Task() {}

    public Task(Long id, String title, String description, boolean completed, User user) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.completed = completed;
        this.user = user;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public boolean isCompleted() { return completed; }
    public void setCompleted(boolean completed) { this.completed = completed; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}