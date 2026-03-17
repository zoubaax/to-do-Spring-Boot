package spring.crud.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import spring.crud.Model.Task;

/**
 * @Repository: This marks this interface as a Spring-managed Bean for DB access.
 * JpaRepository: This provides a lot of methods for free (Save, Delete, Find, etc.).
 * We specify <Task, Long>: Task is the Entity, and Long is the type of the ID.
 */
@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    // You can add custom queries here if needed,
    // e.g., List<Task> findByCompleted(boolean completed);
}
