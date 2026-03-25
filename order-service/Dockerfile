# build
FROM maven:3.9.9-eclipse-temurin-21 AS builder
WORKDIR /app
COPY . .
RUN mvn package -DskipTests

# run
FROM eclipse-temurin:21-jdk
WORKDIR /app
COPY --from=builder /app/target/quarkus-app/ /app/
CMD ["java", "-jar", "/app/quarkus-run.jar"]