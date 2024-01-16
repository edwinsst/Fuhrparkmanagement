# Stage 1: Build the application
FROM gradle:8.3-jdk17 as builder

WORKDIR /app

COPY build.gradle .
COPY swagger ./swagger
COPY src ./src

# Build the application
RUN gradle clean build

# Stage 2: Create the runtime image
FROM openjdk:17-alpine

WORKDIR /app

COPY --from=builder /app/build/libs/app-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080

# Run the application
CMD ["java", "-jar", "app.jar"]
