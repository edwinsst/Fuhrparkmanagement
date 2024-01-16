package de.swtm.fuhrparkmanagement.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import de.swtm.fuhrparkmanagement.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private static final TypeReference<List<User>> USERS_TYPE = new TypeReference<>() {};

    private final ObjectMapper objectMapper;

    private final HttpClient httpClient = HttpClient.newHttpClient();

    @Value("${user-management-api.url}")
    private String userManagementApiUrl;

    @Value("${user-management-api.api-key}")
    private String userManagementApiKey;

    public User getUser(String userId) throws URISyntaxException, IOException, InterruptedException {
        HttpRequest httpRequest = HttpRequest.newBuilder()
                .uri(new URI(String.format("%s/usermanagement/v2/users/%s", userManagementApiUrl, userId)))
                .header("X-API-KEY", userManagementApiKey)
                .GET()
                .build();

        HttpResponse<String> httpResponse = httpClient.send(httpRequest, HttpResponse.BodyHandlers.ofString());
        if (httpResponse.statusCode() != 200) {
            throw new RuntimeException("Failed to get email for doubleSlash user with id " + userId);
        }
        return objectMapper.readValue(httpResponse.body(), User.class);
    }

    public List<User> getUsers() throws URISyntaxException, IOException, InterruptedException {
        HttpRequest httpRequest = HttpRequest.newBuilder()
                .uri(new URI(userManagementApiUrl + "/usermanagement/v2/users"))
                .header("X-API-KEY", userManagementApiKey)
                .GET()
                .build();

        HttpResponse<String> httpResponse = httpClient.send(httpRequest, HttpResponse.BodyHandlers.ofString());
        if (httpResponse.statusCode() != 200) {
            throw new RuntimeException("Failed to get doubleSlash users");
        }
        return objectMapper.readValue(httpResponse.body(), USERS_TYPE);
    }
}
