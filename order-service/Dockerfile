# build
FROM maven:3.9.9-eclipse-temurin-21 AS builder
WORKDIR /app
COPY . .
RUN mvn package -DskipTests

# run
FROM eclipse-temurin:21-jdk
WORKDIR /app

# Download OpenTelemetry Java Agent
RUN curl -L -o opentelemetry-javaagent.jar https://github.com/open-telemetry/opentelemetry-java-instrumentation/releases/download/v2.5.0/opentelemetry-javaagent.jar

COPY --from=builder /app/target/quarkus-app/ /app/
CMD ["java", "-javaagent:/app/opentelemetry-javaagent.jar", "-jar", "/app/quarkus-run.jar"]
