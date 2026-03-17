package spring.crud.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import spring.crud.Model.Task;
import spring.crud.Model.User;
import spring.crud.Repository.UserRepository;
import spring.crud.Service.TaskService;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @Autowired
    private UserRepository userRepository;

    /**
     * Helper method to get the current logged-in user entity.
     */
    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return userRepository.findByUsername(auth.getName()).get();
    }

    /**
     * GET: Returns only tasks belonging to the current user.
     * Admin can see everything if we wanted to add that logic.
     */
    @GetMapping
    public List<Task> getAllTasks() {
        User currentUser = getCurrentUser();
        // If Admin, return everything. If User, return only their tasks.
        if (currentUser.getRole().name().equals("ROLE_ADMIN")) {
            return taskService.getAllTasks();
        }
        return currentUser.getTasks();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Task> getTaskById(@PathVariable Long id) {
        return taskService.getTaskById(id)
                .map(task -> {
                    // Safety check: Don't let users see other people's tasks by ID
                    User currentUser = getCurrentUser();
                    if (currentUser.getRole().name().equals("ROLE_ADMIN") || task.getUser().getId().equals(currentUser.getId())) {
                        return ResponseEntity.ok(task);
                    }
                    return ResponseEntity.status(403).<Task>build(); // Forbidden
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Task createTask(@RequestBody Task task) {
        // Automatically link the task to the logged-in user
        task.setUser(getCurrentUser());
        return taskService.createTask(task);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable Long id, @RequestBody Task taskDetails) {
        try {
            // Logic handled inside service, but we should verify ownership here or in service
            return ResponseEntity.ok(taskService.updateTask(id, taskDetails));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
        return ResponseEntity.noContent().build();
    }
}
