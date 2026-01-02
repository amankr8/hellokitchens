# Dockerfile
FROM eclipse-temurin:21-jdk AS build
COPY . .
RUN ./mvnw clean package -DskipTests

FROM eclipse-temurin:21-jdk
COPY --from=build target/*.jar app.jar
ENTRYPOINT ["java","-jar","/app.jar"]
EXPOSE 8080
