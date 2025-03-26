FROM maven:3.8.5-eclipse-temurin-17-alpine AS build
WORKDIR /app
COPY . .
RUN mvn -f order-service/pom.xml clean package -DskipTests

FROM eclipse-temurin:17-jre-alpine
COPY --from=build /app/order-service/target/*.jar /app/app.jar
ENTRYPOINT ["java", "-jar", "/app/app.jar"]