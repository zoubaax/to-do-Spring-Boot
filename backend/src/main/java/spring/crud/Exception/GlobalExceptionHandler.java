package spring.crud.Exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * @ControllerAdvice: This class will intercept exceptions across ANY @Controller in your project.
 * It's much better than writing try-catch blocks everywhere!
 */
@ControllerAdvice
public class GlobalExceptionHandler {

    /**
     * @ExceptionHandler: This method will run if a RuntimeException is thrown anywhere in the app.
     * It allows you to return a nice JSON response instead of a messy error page.
     */
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Object> handleRuntimeException(RuntimeException ex) {
        
        // This is a simple Map to store our error details.
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("message", ex.getMessage());
        body.put("status", HttpStatus.NOT_FOUND.value());

        // We return a 404 Not Found since most RuntimeExceptions in this app will be "Not Found".
        return new ResponseEntity<>(body, HttpStatus.NOT_FOUND);
    }

    /**
     * A generic handler for any other type of error (like Database issues).
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> handleGeneralException(Exception ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("message", "An unexpected error occurred. Please try again later.");
        body.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());

        return new ResponseEntity<>(body, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
