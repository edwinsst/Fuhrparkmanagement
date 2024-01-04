package de.swtm.fuhrparkmanagement.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@Service
@RequiredArgsConstructor
public class UserService {

    private final ObjectMapper objectMapper;

    private final HttpClient httpClient = HttpClient.newHttpClient();

    @Value("${user-management-api.url}")
    private String userManagementApiUrl;

    @Value("${user-management-api.api-key}")
    private String userManagementApiKey;

    public String getUserEmail(String userId) throws URISyntaxException, IOException, InterruptedException {
        record UserResponse(long id, String name, String givenName, String surname, String mail) {}

        HttpRequest httpRequest = HttpRequest.newBuilder()
                .uri(new URI(String.format("%s/usermanagement/v2/users/%s", userManagementApiUrl, userId)))
                .header("X-API-KEY", userManagementApiKey)
                .GET()
                .build();

        HttpResponse<String> httpResponse = httpClient.send(httpRequest, HttpResponse.BodyHandlers.ofString());
        if (httpResponse.statusCode() != 200) {
            throw new RuntimeException("Failed to get email for doubleSlash user with id " + userId);
        }
        UserResponse userResponse = objectMapper.readValue(httpResponse.body(), UserResponse.class);
        return userResponse.mail();
    }
}